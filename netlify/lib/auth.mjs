/**
 * Server-side session helpers.
 *
 * The password itself never leaves the server: it lives in SITE_PASSWORD, which
 * has no VITE_ prefix and is therefore never inlined into the client bundle.
 * What the browser gets is an opaque, signed, HttpOnly cookie it cannot forge
 * or read from JavaScript.
 */
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

export const COOKIE_NAME = 'cf_session';
const DEFAULT_TTL_HOURS = 24 * 14; // two weeks

const b64url = (buf) => Buffer.from(buf).toString('base64url');

/** Constant-time string compare that doesn't leak length via early return. */
export function safeEqual(a = '', b = '') {
  const ha = createHmac('sha256', 'cmp').update(String(a)).digest();
  const hb = createHmac('sha256', 'cmp').update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error('AUTH_SECRET is not set');
  return s;
}

/** Signed token: base64url(payload).base64url(hmac) */
export function issueToken({ scope = 'site', ttlHours = DEFAULT_TTL_HOURS } = {}) {
  const payload = b64url(JSON.stringify({
    scope,
    exp: Date.now() + ttlHours * 3600 * 1000,
    jti: randomBytes(8).toString('hex'),
  }));
  const sig = b64url(createHmac('sha256', secret()).update(payload).digest());
  return `${payload}.${sig}`;
}

/** Returns the decoded payload if the token is authentic and unexpired, else null. */
export function verifyToken(token, { scope = 'site' } = {}) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;

  const expected = b64url(createHmac('sha256', secret()).update(payload).digest());
  if (!safeEqual(sig, expected)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data || data.exp < Date.now()) return null;
    if (data.scope !== scope) return null;
    return data;
  } catch {
    return null;
  }
}

export function readCookie(req, name = COOKIE_NAME) {
  const header = req.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export function sessionCookie(token, { ttlHours = DEFAULT_TTL_HOURS } = {}) {
  return [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${Math.floor(ttlHours * 3600)}`,
  ].join('; ');
}

export const clearedCookie = () =>
  `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

/** True when the request carries a valid session for the given scope. */
export function isAuthed(req, opts) {
  return verifyToken(readCookie(req), opts) !== null;
}
