-- ═══════════════════════════════════════════════════════════════════════════
-- Update the master admin password and skip the forced-rotation gate.
-- Run once in the Supabase SQL Editor.
--
-- What it does:
--   - Replaces the argon2id hash of the IsrabisAdmin account
--   - Marks password_changed_at = now() so login does NOT force another rotation
--
-- Safety:
--   - This file contains ONLY the one-way argon2id hash, never the plaintext.
--   - Safe to commit to git — the hash cannot be reversed to the original password.
--   - Idempotent: re-running has no effect beyond setting the same values again.
-- ═══════════════════════════════════════════════════════════════════════════

UPDATE admin.admin_users
SET password_hash       = '$argon2id$v=19$m=65536,t=3,p=4$srlP+Pf4gGPMLtEltXpskg$n+Jc1PNy5FrovjzhYwPCeXECIkv/i//sdAPF/LBK0SY',
    password_changed_at = now(),
    failed_login_count  = 0,
    locked_until        = NULL
WHERE username = 'IsrabisAdmin';

-- Verify (should show 1 row, must_rotate = false):
SELECT username, role, is_active,
       (password_changed_at IS NULL) AS must_rotate,
       last_login_at
FROM admin.admin_users
WHERE username = 'IsrabisAdmin';
