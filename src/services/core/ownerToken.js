/**
 * Owner Token
 * A shared-secret marker that identifies the portfolio owner's own traffic so
 * the server can tag it (`is_owner=true`). This replaces the old fragile
 * `localStorage('portfolio_owner')` boolean.
 *
 * Why a token (not a device flag / fingerprint): it survives VPNs, incognito,
 * and new devices. The owner visits `https://<site>/?owner=<TOKEN>` once on any
 * device/session; the token is stored and attached to every request thereafter.
 * The URL param is stripped immediately so it can't be shared or leaked via
 * history/referrer. The token only controls a boolean tag (low stakes); rotate
 * by changing the OWNER_TOKEN secret on the edge function.
 *
 * Owner rows are TAGGED, not dropped — so the owner can verify tracking works
 * (dashboard "Only me") while being excluded from real-visitor stats by default.
 */

const STORAGE_KEY = 'portfolio_owner_token';
const PARAM = 'owner';

class OwnerToken {
  constructor() {
    this._token = null;
    this._loaded = false;
  }

  _load() {
    if (this._loaded) return;
    this._loaded = true;
    try {
      this._token = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY) || null;
    } catch {
      this._token = null;
    }
  }

  /**
   * Read `?owner=<token>` from the URL on boot; if present, persist it and strip
   * the param from the address bar. Call once, early, in App bootstrap.
   */
  bootstrap() {
    try {
      const url = new URL(window.location.href);
      const t = url.searchParams.get(PARAM);
      if (t) {
        try { localStorage.setItem(STORAGE_KEY, t); } catch { /* incognito */ }
        try { sessionStorage.setItem(STORAGE_KEY, t); } catch { /* noop */ }
        url.searchParams.delete(PARAM);
        window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
      }
    } catch { /* noop */ }
    // Re-read from storage (now includes any just-set token).
    this._loaded = false;
    this._load();
  }

  /** The stored owner token, or null. */
  get() {
    this._load();
    return this._token;
  }

  /** True when this browser carries the owner token. */
  get isOwner() {
    return !!this.get();
  }

  /** Forget the owner token on this device. */
  clear() {
    this._token = null;
    this._loaded = true;
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  }
}

export const ownerToken = new OwnerToken();
export default ownerToken;
