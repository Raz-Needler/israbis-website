-- ═══════════════════════════════════════════════════════════════════════════
-- Grant the Supabase service_role (and anon/authenticated, blocked by RLS)
-- USAGE on the new schemas and ALL on their tables/sequences/functions.
-- Required because CREATE SCHEMA defaults to owner-only access.
--
-- Safe to run anytime · idempotent · no data writes.
-- ═══════════════════════════════════════════════════════════════════════════

-- Schema USAGE
GRANT USAGE ON SCHEMA admin     TO service_role, anon, authenticated;
GRANT USAGE ON SCHEMA analytics TO service_role, anon, authenticated;

-- Full access for service_role (bypasses RLS, used by the admin API)
GRANT ALL ON ALL TABLES    IN SCHEMA admin     TO service_role;
GRANT ALL ON ALL TABLES    IN SCHEMA analytics TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA admin     TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA analytics TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA admin     TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA analytics TO service_role;
GRANT EXECUTE ON FUNCTION admin.run_readonly_sql(TEXT, JSONB) TO service_role;

-- Future tables created in these schemas auto-grant to service_role
ALTER DEFAULT PRIVILEGES IN SCHEMA admin     GRANT ALL ON TABLES    TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA admin     GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA admin     GRANT ALL ON FUNCTIONS TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics GRANT ALL ON TABLES    TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics GRANT ALL ON SEQUENCES TO service_role;

-- Verify (should return rows showing service_role has privileges)
SELECT grantee, table_schema, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema IN ('admin','analytics')
  AND grantee = 'service_role'
ORDER BY table_schema, privilege_type
LIMIT 10;
