-- Lock down analytics reads (the PHASE 5 step sketched in the analytics_rework
-- migration, now actually applied).
--
-- Context: the anon/publishable key is, by design, embedded in the client
-- bundle and therefore public. With "allow select ... USING (true)" in place,
-- anyone could read every visits/events row straight from PostgREST — city,
-- postal_code, isp and referrer for real visitors — without ever touching the
-- password-protected dashboard.
--
-- Safe to apply now because:
--   * writes come from the `ingest` edge function, which uses the service-role
--     key and bypasses RLS entirely;
--   * the client no longer inserts directly (supabaseClient.insertVisit /
--     insertEvent are unused);
--   * the dashboard now reads through /api/analytics, a Netlify function that
--     requires an admin session and uses the service-role key server-side.
--
-- Apply with:  supabase db push     (or paste into the Supabase SQL editor)

-- ── visits ──────────────────────────────────────────────────────────────────
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow select" ON public.visits;
DROP POLICY IF EXISTS "allow insert" ON public.visits;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.visits;

-- ── events ──────────────────────────────────────────────────────────────────
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow select" ON public.events;
DROP POLICY IF EXISTS "allow insert" ON public.events;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.events;

-- Belt and braces: RLS only constrains roles that hold table privileges in the
-- first place. Removing the grants means a policy accidentally re-added later
-- still won't expose these tables to the public key.
REVOKE ALL ON public.visits FROM anon;
REVOKE ALL ON public.events FROM anon;

-- The service role bypasses RLS and keeps its own grants, so ingestion and the
-- server-side dashboard reads are unaffected.
