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

-- Hash is the one-way argon2id hash of the chosen master password.
-- Plaintext is never stored here or anywhere in the repo.
INSERT INTO admin.admin_users (username, password_hash, role, is_active, password_changed_at)
VALUES (
  'IsrabisAdmin',
  '$argon2id$v=19$m=65536,t=3,p=4$srlP+Pf4gGPMLtEltXpskg$n+Jc1PNy5FrovjzhYwPCeXECIkv/i//sdAPF/LBK0SY',
  'master',
  true,
  now()
)
ON CONFLICT (username) DO NOTHING;

-- Verify:
-- SELECT id, username, role, is_active, password_changed_at FROM admin.admin_users;
