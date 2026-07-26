-- Analytics rework — additive schema for server-side ingestion.
--
-- Adds owner tagging + device dimensions so the dashboard can (a) verify the
-- owner's own device journey and (b) exclude owner traffic from real-visitor
-- stats, plus device/browser/OS breakdowns. All columns are additive and
-- nullable/defaulted, so existing rows and the existing dashboard keep working.
--
-- Geo is now derived SERVER-SIDE in the `ingest` edge function (from the real
-- request IP), not client-side. Raw IP is never stored.
--
-- Apply with:  supabase db push        (or paste into the Supabase SQL editor)

-- ── visits ──────────────────────────────────────────────────────────────────
ALTER TABLE visits
  ADD COLUMN IF NOT EXISTS is_owner        boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS device_type     text,   -- desktop | mobile | tablet
  ADD COLUMN IF NOT EXISTS browser         text,   -- e.g. "Chrome 126"
  ADD COLUMN IF NOT EXISTS os              text,   -- e.g. "macOS 14"
  ADD COLUMN IF NOT EXISTS viewport_width  int,
  ADD COLUMN IF NOT EXISTS viewport_height int,
  ADD COLUMN IF NOT EXISTS country_code    text;   -- ISO-2 for flag rendering

-- ── events ──────────────────────────────────────────────────────────────────
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS is_owner boolean NOT NULL DEFAULT false;

-- ── indexes (dashboard reads: recent-first, filtered by owner/session/visitor) ─
CREATE INDEX IF NOT EXISTS idx_visits_created ON visits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_owner   ON visits (is_owner);
CREATE INDEX IF NOT EXISTS idx_visits_session ON visits (session_id);

CREATE INDEX IF NOT EXISTS idx_events_created ON events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_owner   ON events (is_owner);
CREATE INDEX IF NOT EXISTS idx_events_visitor ON events (visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_session ON events (session_id);

-- ── RLS lockdown (PHASE 5 — run ONLY after the client no longer inserts
--    directly, i.e. once the `ingest` edge function is live and the app is
--    deployed pointing at /api/collect). The edge function writes with the
--    service-role key and bypasses RLS; the dashboard keeps anon SELECT.
--
--    DROP POLICY IF EXISTS "allow insert" ON visits;
--    DROP POLICY IF EXISTS "allow insert" ON events;
--    -- keep existing:  CREATE POLICY "allow select" ... USING (true);
