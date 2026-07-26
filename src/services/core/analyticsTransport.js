/**
 * Analytics Transport
 * Reliable delivery of events/visits to the `ingest` edge function.
 *
 * Replaces the old fire-and-forget direct-to-Supabase inserts, which silently
 * dropped data on network blips and tab-close. This module:
 *   - queues events and batches them to one POST endpoint,
 *   - flushes on a debounce, on queue size, and on tab-hide / pagehide,
 *   - uses navigator.sendBeacon on unload (survives tab close),
 *   - retries with backoff and persists unsent data to replay on next load,
 *   - attaches identity (session/visitor), the owner token, and consent.
 *
 * NOTE: this intentionally does NOT resurrect the dead AnalyticsService.
 */

import { visitorIdentity } from './visitorIdentity.js';
import { ownerToken } from './ownerToken.js';
import { privacyManager } from './PrivacyManager.js';

const INGEST_URL = import.meta.env.VITE_INGEST_URL || '/api/collect';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
// A relative path means the Netlify /api/collect proxy (same-origin, no apikey
// needed). An absolute *.supabase.co URL is the function gateway, which we hit
// with the (public) anon key.
const IS_DIRECT_SUPABASE = /^https?:\/\/[^/]*supabase\.co/.test(INGEST_URL);

const SESSION_KEY = 'portfolio_session_id';
const PENDING_KEY = 'portfolio_pending_events';
const FLUSH_DEBOUNCE_MS = 3000;
const FLUSH_AT = 5;
const MAX_RETRIES = 3;
const MAX_PERSISTED = 100;

let eventQueue = [];
let pendingVisit = null;
let flushTimer = null;
let retryCount = 0;
let listenersBound = false;
// Hooks run synchronously right before an unload (beacon) flush, so in-progress
// timers (current section dwell, open project) can enqueue a final event.
const beforeUnloadHooks = new Set();

// ── identity / config ────────────────────────────────────────────────────────

function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = Date.now().toString(36) + Math.random().toString(36).slice(2);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'nostore-' + Math.random().toString(36).slice(2, 8);
  }
}

function hasConsent() {
  try { return privacyManager.hasPerformanceConsent() === true; } catch { return false; }
}

function isConfigured() {
  // The proxy path is always usable; a direct URL needs the anon key.
  return !IS_DIRECT_SUPABASE || !!ANON_KEY;
}

function envelope(batch) {
  const env = {
    session_id: getSessionId(),
    ...visitorIdentity.fields,
    consent: { performance: hasConsent() },
  };
  const token = ownerToken.get();
  if (token) env.owner_token = token;
  if (batch.visit) env.visit = batch.visit;
  if (batch.events && batch.events.length) env.events = batch.events;
  return env;
}

function fetchUrl() { return INGEST_URL; }
function beaconUrl() {
  return IS_DIRECT_SUPABASE && ANON_KEY
    ? `${INGEST_URL}?apikey=${encodeURIComponent(ANON_KEY)}`
    : INGEST_URL;
}
function fetchHeaders() {
  const h = { 'Content-Type': 'application/json' };
  if (IS_DIRECT_SUPABASE && ANON_KEY) { h.apikey = ANON_KEY; h.Authorization = `Bearer ${ANON_KEY}`; }
  return h;
}

// ── persistence (replay unsent across reloads) ───────────────────────────────

function persistPending(batch) {
  try {
    const events = (batch.events || []).slice(-MAX_PERSISTED);
    if (!events.length && !batch.visit) { localStorage.removeItem(PENDING_KEY); return; }
    localStorage.setItem(PENDING_KEY, JSON.stringify({ visit: batch.visit || null, events }));
  } catch { /* storage full / blocked — best effort */ }
}
function clearPending() {
  try { localStorage.removeItem(PENDING_KEY); } catch { /* noop */ }
}
function loadPending() {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed?.visit && !pendingVisit) pendingVisit = parsed.visit;
    if (Array.isArray(parsed?.events)) eventQueue = parsed.events.concat(eventQueue);
    if (eventQueue.length || pendingVisit) scheduleFlush(0);
  } catch { /* noop */ }
}

// ── send / flush ─────────────────────────────────────────────────────────────

async function send(batch, useBeacon) {
  const body = JSON.stringify(envelope(batch));
  if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
    // text/plain is CORS-safelisted → no preflight (beacon can't set headers).
    const blob = new Blob([body], { type: 'text/plain' });
    const ok = navigator.sendBeacon(beaconUrl(), blob);
    if (!ok) persistPending(batch);
    return ok;
  }
  try {
    const res = await fetch(fetchUrl(), {
      method: 'POST',
      keepalive: true,
      headers: fetchHeaders(),
      body,
    });
    return res.ok || res.status === 204;
  } catch {
    return false;
  }
}

function scheduleFlush(delay = FLUSH_DEBOUNCE_MS) {
  if (flushTimer) return;
  flushTimer = setTimeout(() => { flushTimer = null; flush(false); }, delay);
}

async function flush(useBeacon = false) {
  // On the unload path, let in-progress timers contribute a final event first.
  if (useBeacon) {
    for (const fn of beforeUnloadHooks) { try { fn(); } catch { /* noop */ } }
  }
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
  if (!eventQueue.length && !pendingVisit) return;
  if (!isConfigured()) return;

  const batch = { visit: pendingVisit, events: eventQueue };
  pendingVisit = null;
  eventQueue = [];
  clearPending();

  const ok = await send(batch, useBeacon);
  if (!ok && !useBeacon) {
    // Requeue and retry with capped backoff; persist so a reload can replay.
    if (batch.visit && !pendingVisit) pendingVisit = batch.visit;
    if (batch.events.length) eventQueue = batch.events.concat(eventQueue);
    persistPending({ visit: pendingVisit, events: eventQueue });
    if (retryCount < MAX_RETRIES) {
      retryCount += 1;
      scheduleFlush(1000 * 2 ** retryCount); // 2s, 4s, 8s
    }
  } else if (ok) {
    retryCount = 0;
  }
}

function bindLifecycle() {
  if (listenersBound || typeof document === 'undefined') return;
  listenersBound = true;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true);
  });
  window.addEventListener('pagehide', () => flush(true));
  loadPending();
}

// ── public API ───────────────────────────────────────────────────────────────

export const analyticsTransport = {
  isConfigured,
  init() { bindLifecycle(); },
  enqueueEvent(evt) {
    eventQueue.push({
      event_type: evt.event_type,
      label: evt.label ?? null,
      value: evt.value ?? null,
      meta: evt.meta ?? null,
      client_ts: evt.client_ts ?? Date.now(),
    });
    persistPending({ visit: pendingVisit, events: eventQueue });
    if (eventQueue.length >= FLUSH_AT) flush(false);
    else scheduleFlush();
  },
  enqueueVisit(visit) {
    pendingVisit = visit;
    persistPending({ visit: pendingVisit, events: eventQueue });
    scheduleFlush();
  },
  /**
   * Register a hook that runs synchronously just before an unload flush, so an
   * in-progress timer (section dwell, open project) can enqueue a final event.
   * Returns an unsubscribe function.
   */
  onBeforeFlush(fn) {
    beforeUnloadHooks.add(fn);
    return () => beforeUnloadHooks.delete(fn);
  },
  /** Force an immediate beacon flush (used by unload handlers). */
  flushNow() { flush(true); },
};

export default analyticsTransport;
