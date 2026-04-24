-- ═══════════════════════════════════════════════════════════════
-- IsraBis Admin Portal · Admin Schema
-- Apply to the existing Supabase project (same DB Worldbite uses)
-- Idempotent: safe to re-run.
-- ═══════════════════════════════════════════════════════════════

CREATE SCHEMA IF NOT EXISTS admin;

-- ══════════════════════════════════════
-- admin.admin_users
-- ══════════════════════════════════════
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

-- ══════════════════════════════════════
-- admin.admin_sessions
-- ══════════════════════════════════════
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

-- ══════════════════════════════════════
-- admin.login_attempts (rate limiting)
-- ══════════════════════════════════════
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

-- ══════════════════════════════════════
-- admin.admin_audit
-- ══════════════════════════════════════
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

-- ══════════════════════════════════════
-- admin.api_keys (for programmatic access — future customer licensing)
-- ══════════════════════════════════════
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

-- ══════════════════════════════════════
-- admin.export_jobs
-- ══════════════════════════════════════
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

-- ══════════════════════════════════════
-- Updated-at trigger for admin_users
-- ══════════════════════════════════════
CREATE OR REPLACE FUNCTION admin.touch_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON admin.admin_users;
CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON admin.admin_users
  FOR EACH ROW EXECUTE FUNCTION admin.touch_updated_at();

-- ══════════════════════════════════════
-- Row-level security (disabled by default; service role bypasses it)
-- ══════════════════════════════════════
ALTER TABLE admin.admin_users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.admin_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.admin_audit      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.api_keys         ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.export_jobs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.login_attempts   ENABLE ROW LEVEL SECURITY;
-- Service role bypasses RLS. Anon / authenticated roles have NO policies by default = no access.
