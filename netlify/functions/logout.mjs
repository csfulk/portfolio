/** POST /api/logout -> clears the session cookie. */
import { clearedCookie } from '../lib/auth.mjs';

export default async () =>
  new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json', 'set-cookie': clearedCookie() },
  });

export const config = { path: '/api/logout' };
