-- ═══════════════════════════════════════════════════════════════════════════
-- ISRABIS ADMIN PORTAL · ONE-SHOT SETUP
-- ═══════════════════════════════════════════════════════════════════════════
-- What this does:
--   1. Creates the "admin" schema (admin users, sessions, audit log, api keys, export jobs)
--   2. Creates the "analytics" schema (events, daily snapshot, intent baskets)
--   3. Creates the "run_readonly_sql" helper function
--   4. Creates the master admin account (username: IsrabisAdmin)
--
-- How to run it:
--   - Open the Supabase Dashboard for the project the mobile app uses
--   - Click "SQL Editor" in the left sidebar
--   - Click "+ New query"
--   - Paste this entire file in
--   - Click "Run" (or press Ctrl+Enter)
--   - Wait 2-3 seconds for "Success"
--
-- Safety:
--   - Safe to run multiple times. Every statement uses IF NOT EXISTS or ON CONFLICT.
--   - Does NOT touch any existing table in your "public" schema.
--   - The admin password is already hashed and embedded. Run as-is.
-- ═══════════════════════════════════════════════════════════════════════════


-- ════════════════════════════════════════════════════════════════════════
-- PART 1 · Admin schema
-- ════════════════════════════════════════════════════════════════════════

CREATE SCHEMA IF NOT EXISTS admin;

CREATE TABLE IF NOT EXISTS admin.admin_users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username            TEXT UNIQUE NOT NULL,
  password_hash       TEXT NOT NULL,
  email               TEXT,
  role                TEXT NOT NULL CHECK (role IN ('master','analyst','support','readonly')),
  is_active           BOOLEAN NOT NULL DEFAULT true,
  mfa_enabled         BOOLEAN NOT NULL DEFAULT false,
  mfa_secret          TEXT,
  password_changed_at TIMESTAMPTZ,
  last_login_at       TIMESTAMPTZ,
  last_login_ip_hash  TEXT,
  failed_login_count  INT NOT NULL DEFAULT 0,
  locked_until        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by          UUID REFERENCES admin.admin_users(id) ON DELETE SET NULL,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_users_username  ON admin.admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_active    ON admin.admin_users(is_active);

CREATE TABLE IF NOT EXISTS admin.admin_sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id     UUID NOT NULL REFERENCES admin.admin_users(id) ON DELETE CASCADE,
  issued_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at        TIMESTAMPTZ NOT NULL,
  revoked_at        TIMESTAMPTZ,
  ip_hash           TEXT,
  user_agent_hash   TEXT,
  last_seen_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user    ON admin.admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_active  ON admin.admin_sessions(expires_at) WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS admin.login_attempts (
  id                BIGSERIAL PRIMARY KEY,
  username_tried    TEXT,
  ip_hash           TEXT NOT NULL,
  success           BOOLEAN NOT NULL,
  attempted_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason            TEXT
);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time ON admin.login_attempts(ip_hash, attempted_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_time    ON admin.login_attempts(attempted_at);

CREATE TABLE IF NOT EXISTS admin.admin_audit (
  id                BIGSERIAL PRIMARY KEY,
  admin_user_id     UUID REFERENCES admin.admin_users(id) ON DELETE SET NULL,
  action            TEXT NOT NULL,
  target_type       TEXT,
  target_id         TEXT,
  metadata          JSONB,
  ip_hash           TEXT,
  user_agent_hash   TEXT,
  occurred_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_audit_user_time ON admin.admin_audit(admin_user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_action    ON admin.admin_audit(action, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_time      ON admin.admin_audit(occurred_at DESC);

CREATE TABLE IF NOT EXISTS admin.api_keys (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id     UUID REFERENCES admin.admin_users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  key_hash          TEXT NOT NULL UNIQUE,
  prefix            TEXT NOT NULL,
  scopes            TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  customer_id       TEXT,
  rate_limit        INT NOT NULL DEFAULT 100,
  last_used_at      TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ,
  revoked_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix    ON admin.api_keys(prefix);
CREATE INDEX IF NOT EXISTS idx_api_keys_customer  ON admin.api_keys(customer_id);

CREATE TABLE IF NOT EXISTS admin.export_jobs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id     UUID NOT NULL REFERENCES admin.admin_users(id),
  dataset           TEXT NOT NULL,
  format            TEXT NOT NULL CHECK (format IN ('csv','xlsx','json')),
  filters           JSONB,
  status            TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','completed','failed')),
  row_count         INT,
  file_size_bytes   BIGINT,
  download_url      TEXT,
  error_message     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_export_jobs_user_time ON admin.export_jobs(admin_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_export_jobs_status    ON admin.export_jobs(status, created_at);

CREATE OR REPLACE FUNCTION admin.touch_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON admin.admin_users;
CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON admin.admin_users
  FOR EACH ROW EXECUTE FUNCTION admin.touch_updated_at();

ALTER TABLE admin.admin_users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.admin_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.admin_audit      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.api_keys         ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.export_jobs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.login_attempts   ENABLE ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════════════════
-- PART 2 · Analytics schema
-- ════════════════════════════════════════════════════════════════════════

CREATE SCHEMA IF NOT EXISTS analytics;

CREATE TABLE IF NOT EXISTS analytics.events (
  id                BIGSERIAL PRIMARY KEY,
  event_id          TEXT NOT NULL UNIQUE,
  event_name        TEXT NOT NULL,
  event_category    TEXT NOT NULL,
  event_version     SMALLINT NOT NULL DEFAULT 1,
  occurred_at       TIMESTAMPTZ NOT NULL,
  received_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  day               DATE NOT NULL,
  user_id           TEXT,
  anonymous_id      TEXT NOT NULL,
  session_id        TEXT,
  device_id         TEXT,
  platform          TEXT,
  app_version       TEXT,
  os_version        TEXT,
  locale            TEXT,
  subscription_tier TEXT,
  family_id         TEXT,
  props             JSONB,
  ip_hash           TEXT,
  customer_id       TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_day           ON analytics.events(day);
CREATE INDEX IF NOT EXISTS idx_events_name_day      ON analytics.events(event_name, day);
CREATE INDEX IF NOT EXISTS idx_events_category_day  ON analytics.events(event_category, day);
CREATE INDEX IF NOT EXISTS idx_events_user_time     ON analytics.events(user_id, occurred_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_anon_time     ON analytics.events(anonymous_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_session       ON analytics.events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_props_gin     ON analytics.events USING GIN (props);
CREATE INDEX IF NOT EXISTS idx_events_customer_day  ON analytics.events(customer_id, day) WHERE customer_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS analytics.events_rejected (
  id           BIGSERIAL PRIMARY KEY,
  received_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason       TEXT NOT NULL,
  raw          TEXT
);
CREATE INDEX IF NOT EXISTS idx_rejected_time ON analytics.events_rejected(received_at DESC);

CREATE TABLE IF NOT EXISTS analytics.user_timeline (
  anonymous_id     TEXT PRIMARY KEY,
  first_seen_at    TIMESTAMPTZ NOT NULL,
  last_seen_at     TIMESTAMPTZ NOT NULL,
  first_platform   TEXT,
  first_user_id    TEXT,
  current_user_id  TEXT,
  total_events     INT NOT NULL DEFAULT 0,
  total_sessions   INT NOT NULL DEFAULT 0,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_timeline_user    ON analytics.user_timeline(current_user_id) WHERE current_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_timeline_last    ON analytics.user_timeline(last_seen_at DESC);

CREATE TABLE IF NOT EXISTS analytics.daily_snapshot (
  day                 DATE PRIMARY KEY,
  dau                 INT NOT NULL DEFAULT 0,
  unique_anon         INT NOT NULL DEFAULT 0,
  new_signups         INT NOT NULL DEFAULT 0,
  total_events        BIGINT NOT NULL DEFAULT 0,
  total_sessions      INT NOT NULL DEFAULT 0,
  carts_built         INT NOT NULL DEFAULT 0,
  carts_compared      INT NOT NULL DEFAULT 0,
  purchases_confirmed INT NOT NULL DEFAULT 0,
  ai_messages         INT NOT NULL DEFAULT 0,
  scans_performed     INT NOT NULL DEFAULT 0,
  crashes             INT NOT NULL DEFAULT 0,
  paid_conversions    INT NOT NULL DEFAULT 0,
  refreshed_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_daily_snapshot_day ON analytics.daily_snapshot(day DESC);

CREATE TABLE IF NOT EXISTS analytics.fact_intent_basket (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  TEXT,
  anonymous_id             TEXT,
  family_id                TEXT,
  built_at                 TIMESTAMPTZ NOT NULL,
  compared_at              TIMESTAMPTZ,
  switched_at              TIMESTAMPTZ,
  purchased_at             TIMESTAMPTZ,
  abandoned_at             TIMESTAMPTZ,
  item_count               INT,
  total_nis_by_chain       JSONB,
  cheapest_chain           TEXT,
  user_chose_chain         TEXT,
  chose_cheapest           BOOLEAN,
  delta_nis_vs_cheapest    NUMERIC(10,2),
  eventually_purchased     BOOLEAN DEFAULT FALSE,
  purchase_chain           TEXT,
  time_to_purchase_seconds INT
);
CREATE INDEX IF NOT EXISTS idx_intent_basket_time     ON analytics.fact_intent_basket(built_at DESC);
CREATE INDEX IF NOT EXISTS idx_intent_basket_user     ON analytics.fact_intent_basket(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_intent_basket_chain    ON analytics.fact_intent_basket(user_chose_chain);
CREATE INDEX IF NOT EXISTS idx_intent_basket_purchase ON analytics.fact_intent_basket(purchase_chain) WHERE eventually_purchased;

ALTER TABLE analytics.events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.events_rejected     ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.user_timeline       ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.daily_snapshot      ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.fact_intent_basket  ENABLE ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════════════════
-- PART 3 · The read-only SQL helper function
-- (used by the admin portal for safe queries)
-- ════════════════════════════════════════════════════════════════════════

-- NOTE on regex: Postgres uses \y (not \b) for word boundary.
-- In Postgres regex, \b is literally "backspace character" inside bracket
-- expressions and no-op outside them. We use \y here for portability.
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

REVOKE ALL ON FUNCTION admin.run_readonly_sql(TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION admin.run_readonly_sql(TEXT, JSONB) FROM anon, authenticated;


-- ════════════════════════════════════════════════════════════════════════
-- PART 4 · Master admin account
-- (password hash for "is Password" already embedded — rotated at first login)
-- ════════════════════════════════════════════════════════════════════════

INSERT INTO admin.admin_users (username, password_hash, role, is_active, password_changed_at)
VALUES (
  'IsrabisAdmin',
  '$argon2id$v=19$m=65536,t=3,p=4$rAsJOi9i/4R0ETdP+aKltQ$4gpK8XrLIBt2Dk18rFqAQsBrL3+ojupsYGu6c5CS+io',
  'master',
  true,
  NULL
)
ON CONFLICT (username) DO NOTHING;


-- ════════════════════════════════════════════════════════════════════════
-- DONE · Sanity checks
-- ════════════════════════════════════════════════════════════════════════
-- The three queries below run immediately after. You should see:
--   Row 1: your master admin (IsrabisAdmin / master / active / must_rotate = true)
--   Row 2: count of events (0 until the SDK is wired)
--   Row 3: {"ok": 1}

SELECT username, role, is_active, (password_changed_at IS NULL) AS must_rotate
FROM admin.admin_users;

SELECT COUNT(*) AS total_events FROM analytics.events;

SELECT admin.run_readonly_sql('SELECT 1 AS ok', '[]'::jsonb) AS smoke_test;
