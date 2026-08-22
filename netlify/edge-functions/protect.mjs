/**
 * Edge gate for case-study assets.
 *
 * Runs before the CDN serves the file, so a direct link to a deck or an image
 * is checked too — not just the button in the UI. Verifies the same HMAC token
 * that netlify/lib/auth.mjs issues, using Web Crypto so it runs on Deno.
 */
const enc = new TextEncoder();

const b64url = (bytes) => {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

function readCookie(req, name) {
  const header = req.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

async function verify(token, secret, scope = 'site') {
  if (typeof token !== 'string' || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;

  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  if (b64url(new Uint8Array(mac)) !== sig) return false;

  try {
    const pad = payload.replace(/-/g, '+').replace(/_/g, '/');
    const data = JSON.parse(atob(pad + '='.repeat((4 - (pad.length % 4)) % 4)));
    return data?.scope === scope && data.exp > Date.now();
  } catch {
    return false;
  }
}

export default async (request, context) => {
  const secret = Deno.env.get('AUTH_SECRET');
  // Fail closed: without a secret we cannot authenticate anyone, so serve nothing.
  if (!secret) return new Response('Not available', { status: 503 });

  const ok = await verify(readCookie(request, 'cf_session'), secret);
  if (ok) return context.next();

  return new Response('Not found', {
    status: 404,
    headers: { 'content-type': 'text/plain', 'cache-control': 'no-store' },
  });
};
