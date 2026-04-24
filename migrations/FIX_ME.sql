-- ═══════════════════════════════════════════════════════════════════════════
-- Patch for the run_readonly_sql helper.
-- Postgres uses \y for word boundary, not \b (which is literal backspace).
-- Safe to run anytime. Replaces only the function body, touches nothing else.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION admin.run_readonly_sql(q TEXT, p JSONB)
RETURNS SETOF JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, analytics, admin
AS $fn$
DECLARE
  r RECORD;
BEGIN
  IF NOT (q ~* '^[[:space:]]*(WITH|SELECT)\y') THEN
    RAISE EXCEPTION 'read_only: only SELECT/WITH allowed';
  END IF;
  IF q ~* '\y(INSERT|UPDATE|DELETE|DROP|ALTER|ATTACH|CREATE|REPLACE|TRUNCATE|GRANT|REVOKE|COPY)\y' THEN
    RAISE EXCEPTION 'read_only: mutation keyword detected';
  END IF;

  FOR r IN EXECUTE q USING
    (p->>0)::text, (p->>1)::text, (p->>2)::text,
    (p->>3)::text, (p->>4)::text, (p->>5)::text
  LOOP
    RETURN NEXT to_jsonb(r);
  END LOOP;
END;
$fn$;

-- Verify it now works
SELECT admin.run_readonly_sql('SELECT 1 AS ok', '[]'::jsonb) AS smoke_test;
