/**
 * POST /api/login  { password, scope? }
 *
 * Verifies against a server-only env var and, on success, sets a signed
 * HttpOnly session cookie. The password is never sent to the browser, so it
 * cannot be recovered from the JS bundle the way the old client-side check could.
 */
import { issueToken, sessionCookie, safeEqual } from '../lib/auth.mjs';

const SCOPES = {
  site:  { env: 'SITE_PASSWORD',      ttlHours: 24 * 14 },
  admin: { env: 'DASHBOARD_PASSWORD', ttlHours: 24 },
};

// Best-effort throttle. Function instances are ephemeral and may be replicated,
// so treat this as friction, not a guarantee.
const attempts = new Map();
const probes = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const MAX_PROBES = 60;

function throttled(ip, { probe = false } = {}) {
  const bucket = probe ? probes : attempts;
  const ceiling = probe ? MAX_PROBES : MAX_ATTEMPTS;
  const now = Date.now();
  const rec = bucket.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) {
    bucket.set(ip, { first: now, count: 1 });
    return false;
  }
  rec.count += 1;
  return rec.count > ceiling;
}

const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers || {}) },
  });

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, { status: 405 });

  const ip = context?.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown';

  let body;
  try { body = await req.json(); } catch { return json({ error: 'bad request' }, { status: 400 }); }

  // A probe answers "would this work?" for live field validation. It issues no
  // cookie and does not count toward the lockout, so typing can't lock you out.
  const isProbe = body?.probe === true;
  if (throttled(ip, { probe: isProbe })) {
    return json({ error: 'too many attempts' }, { status: 429 });
  }

  const scope = body?.scope === 'admin' ? 'admin' : 'site';
  const supplied = String(body?.password ?? '');
  const expected = process.env[SCOPES[scope].env];
  const decoy = process.env.DECOY_PASSWORD;

  if (!expected) return json({ error: 'server not configured' }, { status: 500 });

  // The decoy is checked first, so if the two ever match, the real password
  // would silently redirect legitimate visitors to the easter egg. Fail loudly
  // rather than ship that.
  if (decoy && expected === decoy) {
    return json({ error: `${SCOPES[scope].env} must not equal DECOY_PASSWORD` }, { status: 500 });
  }

  // The decoy lives in the client bundle on purpose; recognise it here too so
  // the joke still lands for anyone who scripts against the endpoint directly.
  if (decoy && safeEqual(supplied, decoy)) {
    // Probes report the decoy as a match on purpose: the field goes green a
    // beat before Enter sends them to Nedry.
    if (isProbe) return json({ match: true });
    return json({ ok: false, decoy: true }, { status: 401 });
  }

  if (isProbe) return json({ match: safeEqual(supplied, expected) });

  if (!safeEqual(supplied, expected)) {
    await new Promise((r) => setTimeout(r, 400)); // blunt the guessing rate
    return json({ ok: false }, { status: 401 });
  }

  const token = issueToken({ scope, ttlHours: SCOPES[scope].ttlHours });
  return json(
    { ok: true, scope },
    { headers: { 'set-cookie': sessionCookie(token, { ttlHours: SCOPES[scope].ttlHours }) } },
  );
};

export const config = { path: '/api/login' };
