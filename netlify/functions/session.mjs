/** GET /api/session -> { authenticated, admin } so the SPA can restore state on load. */
import { verifyToken, readCookie } from '../lib/auth.mjs';

export default async (req) => {
  const token = readCookie(req);
  return new Response(
    JSON.stringify({
      authenticated: verifyToken(token, { scope: 'site' })  !== null,
      admin:         verifyToken(token, { scope: 'admin' }) !== null,
    }),
    { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } },
  );
};

export const config = { path: '/api/session' };
