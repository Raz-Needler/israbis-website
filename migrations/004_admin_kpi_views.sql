-- ═══════════════════════════════════════════════════════════════
-- Helper RPC for running pre-vetted parameterized SELECTs from Next.js.
-- Created as a SECURITY DEFINER function scoped strictly to SELECT.
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION admin.run_readonly_sql(q TEXT, p JSONB)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, analytics, admin
AS $$
DECLARE
  r RECORD;
BEGIN
  -- Defensive: block anything that isn't a SELECT/WITH.
  IF NOT (q ~* '^\s*(WITH|SELECT)\b') THEN
    RAISE EXCEPTION 'read_only: only SELECT/WITH allowed';
  END IF;
  -- Defensive: block obvious mutation keywords, even in subqueries.
  IF q ~* '\b(INSERT|UPDATE|DELETE|DROP|ALTER|ATTACH|CREATE|REPLACE|TRUNCATE|GRANT|REVOKE|COPY)\b' THEN
    RAISE EXCEPTION 'read_only: mutation keyword detected';
  END IF;

  FOR r IN EXECUTE q USING
    (p->>0)::text, (p->>1)::text, (p->>2)::text,
    (p->>3)::text, (p->>4)::text, (p->>5)::text
  LOOP
    RETURN NEXT to_jsonb(r);
  END LOOP;
END;
$$;

-- Only the service role should call this function.
REVOKE ALL ON FUNCTION admin.run_readonly_sql(TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION admin.run_readonly_sql(TEXT, JSONB) FROM anon, authenticated;
-- Supabase service role has BYPASSRLS and full access by default.
