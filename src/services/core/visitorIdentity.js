/**
 * Visitor Identity — persistent alias across sessions.
 *
 * Generates a random `visitor_id` on first visit and stores it in
 * localStorage so returning visitors are recognised across multiple
 * browsing sessions (until they clear their cache).
 *
 * A human-readable alias (e.g. "Amber Falcon") is deterministically
 * derived from the id so the dashboard is easy to read at a glance.
 *
 * No IP address is stored. The alias resets if the user clears
 * localStorage — that is intentional and GDPR-friendly.
 */

const STORAGE_KEY = 'portfolio_visitor_id';

// ─── Alias word lists ──────────────────────────────────────────────────────

const ADJECTIVES = [
  'Amber', 'Azure', 'Bold', 'Bright', 'Calm', 'Coral', 'Crisp', 'Dawn',
  'Deep', 'Drift', 'Early', 'Ember', 'Fern', 'Firm', 'Fleet', 'Flux',
  'Gold', 'Grand', 'Gray', 'Green', 'Hazy', 'High', 'Jade', 'Just',
  'Keen', 'Kind', 'Lapis', 'Lean', 'Light', 'Lime', 'Lush', 'Mist',
  'Mild', 'Mint', 'Neat', 'Noble', 'Opal', 'Open', 'Pale', 'Peak',
  'Pine', 'Pure', 'Quiet', 'Quick', 'Rapid', 'Rare', 'Rich', 'Rose',
  'Royal', 'Rust', 'Safe', 'Sand', 'Sharp', 'Silk', 'Silver', 'Slate',
  'Soft', 'Solar', 'Spare', 'Steel', 'Still', 'Stone', 'Storm', 'Sunny',
  'Swift', 'Teal', 'Trim', 'True', 'Ultra', 'Vast', 'Warm', 'Wave',
  'Wild', 'Wise', 'Young', 'Zeal', 'Zinc', 'Zeal', 'Arctic', 'Brisk',
];

const ANIMALS = [
  'Albatross', 'Bison', 'Condor', 'Crane', 'Dingo', 'Dolphin', 'Eagle',
  'Egret', 'Falcon', 'Finch', 'Fox', 'Gecko', 'Grebe', 'Hawk', 'Heron',
  'Ibis', 'Jaguar', 'Kestrel', 'Kite', 'Lemur', 'Loon', 'Lynx', 'Macaw',
  'Manta', 'Marten', 'Merlin', 'Mink', 'Moose', 'Orca', 'Osprey', 'Otter',
  'Panther', 'Parrot', 'Peregrine', 'Petrel', 'Puma', 'Raven', 'Rhino',
  'Robin', 'Sable', 'Seal', 'Shark', 'Skua', 'Snipe', 'Sparrow', 'Stork',
  'Swift', 'Tapir', 'Tern', 'Tiger', 'Toucan', 'Viper', 'Vole', 'Weasel',
  'Wolf', 'Wren', 'Yak', 'Zebra', 'Brant', 'Curlew', 'Dunlin', 'Eider',
  'Godwit', 'Harrier', 'Hoopoe', 'Jacamar', 'Kinglet', 'Lapwing', 'Linnet',
  'Murrelet', 'Nightjar', 'Oystercatcher', 'Pipit', 'Plover', 'Redstart',
];

// ─── Simple deterministic hash ─────────────────────────────────────────────

function hashString(str) {
  let h = 2166136261; // FNV-1a 32-bit offset basis
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function deriveAlias(visitorId) {
  const h = hashString(visitorId);
  const adj    = ADJECTIVES[h % ADJECTIVES.length];
  const animal = ANIMALS[Math.floor(h / ADJECTIVES.length) % ANIMALS.length];
  return `${adj} ${animal}`;
}

// ─── Singleton ─────────────────────────────────────────────────────────────

class VisitorIdentity {
  constructor() {
    this._id    = null;
    this._alias = null;
  }

  /** Lazy-loads from localStorage; creates & persists if absent. */
  _load() {
    if (this._id) return;
    try {
      let id = localStorage.getItem(STORAGE_KEY);
      if (!id) {
        id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
        localStorage.setItem(STORAGE_KEY, id);
      }
      this._id    = id;
      this._alias = deriveAlias(id);
    } catch {
      // Private/incognito mode may block localStorage
      this._id    = 'anon-' + Math.random().toString(36).slice(2, 8);
      this._alias = 'Anon Visitor';
    }
  }

  /** Stable ID for this browser (survives tab close, resets on cache clear). */
  get id() {
    this._load();
    return this._id;
  }

  /** Human-readable alias, e.g. "Silver Falcon". */
  get alias() {
    this._load();
    return this._alias;
  }

  /** Convenience: { visitor_id, visitor_alias } for spread into DB rows. */
  get fields() {
    return { visitor_id: this.id, visitor_alias: this.alias };
  }
}

export const visitorIdentity = new VisitorIdentity();
export default visitorIdentity;
