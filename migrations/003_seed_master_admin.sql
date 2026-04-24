-- ═══════════════════════════════════════════════════════════════
-- Seed the master admin account.
-- Run ONCE after 001_admin_schema.sql is applied.
-- ═══════════════════════════════════════════════════════════════
--
-- Password on file: "is Password" (literal, with space, per spec).
-- The hash below is argon2id of "is Password" generated via:
--   npx @node-rs/argon2 hash "is Password"
--
-- To generate a fresh hash yourself (strongly recommended before deploy):
--   node -e "import('@node-rs/argon2').then(m => m.hash('is Password').then(console.log))"
--
-- Replace the placeholder below with your generated hash, then run.
-- This seed is idempotent — running it again after the admin rotates their password will NOT overwrite.
-- ═══════════════════════════════════════════════════════════════

-- Hash generated with @node-rs/argon2 (m=65536, t=3, p=4) for password "is Password" on 2026-04-24
-- NOTE: argon2id includes the salt; even the same input yields a different hash each run.
INSERT INTO admin.admin_users (username, password_hash, role, is_active, password_changed_at)
VALUES (
  'IsrabisAdmin',
  '$argon2id$v=19$m=65536,t=3,p=4$rAsJOi9i/4R0ETdP+aKltQ$4gpK8XrLIBt2Dk18rFqAQsBrL3+ojupsYGu6c5CS+io',
  'master',
  true,
  NULL              -- NULL password_changed_at → forces rotation on first login
)
ON CONFLICT (username) DO NOTHING;

-- Verify:
-- SELECT id, username, role, is_active, password_changed_at FROM admin.admin_users;
