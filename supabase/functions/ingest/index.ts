// Analytics ingestion endpoint.
//
// One POST accepts a batched envelope from the browser transport, enriches it
// SERVER-SIDE (real client IP → geo, User-Agent → device/browser/os, owner
// tagging), and writes to the `visits` / `events` tables with the service role.
//
// Why server-side: the browser can't see its own public IP reliably, client geo
// APIs are ad-blockable, and owner/self-exclusion must not depend on fragile
// per-browser localStorage. Raw IP is NEVER stored — only derived geo.
//
// Env (Supabase injects SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY automatically):
//   OWNER_TOKEN      required — secret that marks a request as owner traffic
//   IPINFO_TOKEN     optional — if set, ipinfo.io is tried first; else ipwho.is only
//   ALLOWED_ORIGINS  optional — comma list for CORS (defaults permissive echo)
//
// Deploy:  supabase functions deploy ingest --no-verify-jwt

import { parseUA } from "./ua.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OWNER_TOKEN = Deno.env.get("OWNER_TOKEN") ?? "";
const IPINFO_TOKEN = Deno.env.get("IPINFO_TOKEN") ?? "";
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",").map((s) => s.trim()).filter(Boolean);

const MAX_BODY_BYTES = 32_768;
const MAX_EVENTS = 50;
const ALLOWED_EVENT_TYPES = new Set([
  "section_view", "case_study_click", "project_open", "project_close",
  "password_success", "password_fail", "hero_cta", "privacy_consent",
]);

// ── helpers ──────────────────────────────────────────────────────────────────

function corsHeaders(origin: string | null): Record<string, string> {
  // With the Netlify /api/collect proxy this is same-origin in prod; CORS only
  // matters for direct/localhost calls. Echo an allowed origin, else "*".
  let allow = "*";
  if (origin) {
    const ok = ALLOWED_ORIGINS.length === 0 ||
      ALLOWED_ORIGINS.includes(origin) || /^https?:\/\/localhost(:\d+)?$/.test(origin);
    if (ok) allow = origin;
  }
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

/** Constant-time string compare (avoids owner-token timing leaks). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function clientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}

function isRoutableIp(ip: string | null): ip is string {
  if (!ip) return false;
  if (ip === "127.0.0.1" || ip === "::1") return false;
  if (/^(10\.|192\.168\.|169\.254\.|::ffff:127\.)/.test(ip)) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return false;
  return true;
}

function clamp(v: unknown, max = 512): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
}

function countryName(code: string | null): string | null {
  if (!code) return null;
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

interface Geo {
  country: string | null; country_code: string | null; region: string | null;
  city: string | null; postal_code: string | null; isp: string | null; timezone: string | null;
}

async function fetchJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

/** Server-side geo from the real IP. Only called when consent is granted. */
async function lookupGeo(ip: string): Promise<Geo | null> {
  if (IPINFO_TOKEN) {
    const d = await fetchJson(`https://ipinfo.io/${ip}/json?token=${IPINFO_TOKEN}`);
    if (d && !d.error && (d.city || d.country)) {
      return {
        country: countryName(d.country ?? null),
        country_code: d.country ?? null,
        region: d.region ?? null,
        city: d.city ?? null,
        postal_code: d.postal ?? null,
        isp: (d.org ?? "").replace(/^AS\d+\s*/, "") || null,
        timezone: d.timezone ?? null,
      };
    }
  }
  const w = await fetchJson(`https://ipwho.is/${ip}`);
  if (w && w.success !== false) {
    return {
      country: w.country ?? null,
      country_code: w.country_code ?? null,
      region: w.region ?? null,
      city: w.city ?? null,
      postal_code: w.postal ?? null,
      isp: w.connection?.isp ?? w.connection?.org ?? null,
      timezone: w.timezone?.id ?? null,
    };
  }
  return null;
}

async function insertRows(table: string, rows: Record<string, unknown>[]): Promise<void> {
  if (rows.length === 0) return;
  await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE,
      "Authorization": `Bearer ${SERVICE_ROLE}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(rows),
  });
}

// ── handler ──────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: cors });

  // Read body defensively (sendBeacon sends text/plain; never trust content-type).
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return new Response(null, { status: 413, headers: cors });

  let body: any;
  try { body = JSON.parse(raw); } catch { return new Response(null, { status: 400, headers: cors }); }
  if (!body || typeof body !== "object") return new Response(null, { status: 400, headers: cors });

  const isOwner = OWNER_TOKEN.length > 0 && typeof body.owner_token === "string" &&
    safeEqual(body.owner_token, OWNER_TOKEN);
  const consent = body.consent?.performance === true;

  const identity = {
    session_id: clamp(body.session_id, 128),
    visitor_id: clamp(body.visitor_id, 128),
    visitor_alias: clamp(body.visitor_alias, 64),
    is_owner: isOwner,
  };

  const ua = parseUA(req.headers.get("user-agent"));
  const ip = clientIp(req);

  // ── visit (once per session) — geo only with consent ──────────────────────
  if (body.visit && typeof body.visit === "object") {
    const v = body.visit;
    const geo: Geo | null = consent && isRoutableIp(ip) ? await lookupGeo(ip) : null;
    await insertRows("visits", [{
      ...identity,
      country: geo?.country ?? null,
      country_code: geo?.country_code ?? null,
      region: geo?.region ?? null,
      city: geo?.city ?? null,
      postal_code: geo?.postal_code ?? null,
      isp: geo?.isp ?? null,
      timezone: geo?.timezone ?? null,
      referrer: clamp(v.referrer, 1024),
      page: clamp(v.page, 512),
      language: clamp(v.language, 32),
      screen_width: Number.isFinite(v.screen_width) ? v.screen_width : null,
      screen_height: Number.isFinite(v.screen_height) ? v.screen_height : null,
      viewport_width: Number.isFinite(v.viewport_width) ? v.viewport_width : null,
      viewport_height: Number.isFinite(v.viewport_height) ? v.viewport_height : null,
      device_type: ua.device_type,
      browser: ua.browser,
      os: ua.os,
    }]);
  }

  // ── events ────────────────────────────────────────────────────────────────
  if (Array.isArray(body.events) && body.events.length) {
    const rows = body.events
      .slice(0, MAX_EVENTS)
      .filter((e: any) => e && ALLOWED_EVENT_TYPES.has(e.event_type))
      .map((e: any) => ({
        ...identity,
        event_type: e.event_type,
        label: clamp(e.label, 256),
        value: Number.isFinite(e.value) ? e.value : null,
        meta: (e.meta && typeof e.meta === "object") ? e.meta : null,
      }));
    await insertRows("events", rows);
  }

  return new Response(null, { status: 204, headers: cors });
});
