/**
 * GET /api/analytics?limit=&since=&ownerFilter=
 *
 * Dashboard reads, moved server-side. Previously the browser queried PostgREST
 * directly with the publishable key — which is public by design, so every
 * visitor row was readable by anyone. Now the service-role key stays on the
 * server and the caller must present a valid admin session.
 */
import { isAuthed } from '../lib/auth.mjs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  ...extra,
});

/** Whitelisted filters only — nothing from the query string is interpolated raw. */
function filterParams({ since, ownerFilter }) {
  let q = '';
  if (since && !Number.isNaN(Date.parse(since))) {
    q += `&created_at=gte.${encodeURIComponent(new Date(since).toISOString())}`;
  }
  if (ownerFilter === 'exclude') q += '&is_owner=eq.false';
  else if (ownerFilter === 'only') q += '&is_owner=eq.true';
  return q;
}

async function rows(table, { limit, since, ownerFilter }) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc&limit=${limit}&offset=0${filterParams({ since, ownerFilter })}`;
  const res = await fetch(url, { headers: headers() });
  return res.ok ? res.json() : null;
}

async function total(table, { since, ownerFilter }) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=id${filterParams({ since, ownerFilter })}&limit=1`;
  const res = await fetch(url, {
    headers: headers({ Prefer: 'count=exact', 'Range-Unit': 'items', Range: '0-0' }),
  });
  const cr = res.headers.get('content-range'); // "0-0/1234"
  return cr ? parseInt(cr.split('/')[1], 10) : null;
}

export default async (req) => {
  if (!isAuthed(req, { scope: 'admin' })) return json({ error: 'unauthorized' }, 401);
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: 'server not configured' }, 500);

  const p = new URL(req.url).searchParams;
  const limit = Math.min(Math.max(parseInt(p.get('limit') || '500', 10) || 500, 1), 1000);
  const since = p.get('since') || undefined;
  const owner = p.get('ownerFilter');
  const ownerFilter = ['all', 'exclude', 'only'].includes(owner) ? owner : 'exclude';
  const opts = { limit, since, ownerFilter };

  try {
    const [visits, visitTotal, events, eventTotal] = await Promise.all([
      rows('visits', opts),
      total('visits', opts),
      rows('events', opts),
      total('events', opts),
    ]);
    return json({ visits, visitTotal, events, eventTotal });
  } catch (err) {
    return json({ error: 'upstream failure', detail: String(err?.message || err) }, 502);
  }
};

export const config = { path: '/api/analytics' };
