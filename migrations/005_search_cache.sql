-- Search cache + history for the admin product explorer.
--
-- WHY: `product_prices` has 4.5M rows and trigram ILIKE searches for rare
-- Hebrew terms can take 5-10s even with index. Caching keeps the first hit
-- slow but every subsequent identical query returns in <20ms from an index
-- lookup. We also log every search per-admin so the UI can surface recent
-- searches and trend questions.
--
-- RUN THIS ONCE via the Supabase SQL editor. After it's applied the
-- /api/admin/intelligence/product-search endpoint starts cache-first.

-- ────────────────────────────────────────────────────────────────
-- 1. Cache table  (query → result blob, with TTL)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin.search_cache (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_key    TEXT NOT NULL,           -- normalized query (lowercased, trimmed, hash-like)
  query_raw    TEXT NOT NULL,           -- what the user actually typed
  kind         TEXT NOT NULL,           -- 'name' | 'barcode'
  result_count INT  NOT NULL,
  result_json  JSONB NOT NULL,          -- the full hits array
  duration_ms  INT  NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at   TIMESTAMPTZ NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_search_cache_query_key ON admin.search_cache(query_key);
CREATE INDEX IF NOT EXISTS idx_search_cache_expires ON admin.search_cache(expires_at);

-- ────────────────────────────────────────────────────────────────
-- 2. History table (who searched what, when)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin.search_history (
  id             BIGSERIAL PRIMARY KEY,
  admin_user_id  UUID REFERENCES admin.admin_users(id) ON DELETE SET NULL,
  query_raw      TEXT NOT NULL,
  query_key      TEXT NOT NULL,
  kind           TEXT NOT NULL,
  result_count   INT  NOT NULL,
  served_from    TEXT NOT NULL,          -- 'cache' | 'db'
  duration_ms    INT  NOT NULL,
  searched_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_search_history_user_time ON admin.search_history(admin_user_id, searched_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_time ON admin.search_history(searched_at DESC);

-- ────────────────────────────────────────────────────────────────
-- 3. Grants so the service_role can use these
-- ────────────────────────────────────────────────────────────────
GRANT USAGE ON SCHEMA admin TO service_role;
GRANT ALL ON admin.search_cache   TO service_role;
GRANT ALL ON admin.search_history TO service_role;
GRANT USAGE, SELECT ON SEQUENCE admin.search_history_id_seq TO service_role;

-- ────────────────────────────────────────────────────────────────
-- 4. Housekeeping — clear expired rows. Call from the API periodically.
-- ────────────────────────────────────────────────────────────────
-- The API route calls DELETE FROM admin.search_cache WHERE expires_at < now()
-- whenever it writes a new cache row, keeping the table bounded without a
-- cron job.
