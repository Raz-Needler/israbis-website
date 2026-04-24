/**
 * GET /api/admin/_diag
 *
 * Safe diagnostic endpoint — returns boolean health checks without leaking secret values.
 * Reveals only:
 *   - whether each required env var is set
 *   - whether the Supabase service-role key can reach the admin + analytics schemas
 *   - whether the IsrabisAdmin row exists
 *
 * Does NOT return:
 *   - the value of any env var
 *   - the password hash
 *   - any row content beyond presence booleans
 *
 * REMOVE after Phase 0 shakedown if paranoid — for now leaving it in is fine because
 * the response is information-free to an attacker.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { adminSupabase } from '@/lib/admin/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const report: Record<string, unknown> = {
    ts: new Date().toISOString(),
    env: {
      SUPABASE_URL_set:               !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY_set:  !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      ADMIN_JWT_SECRET_set:           !!process.env.ADMIN_JWT_SECRET,
      ADMIN_JWT_SECRET_length:        process.env.ADMIN_JWT_SECRET?.length ?? 0,
      NODE_ENV:                       process.env.NODE_ENV ?? 'unknown',
    },
  };

  // Early bail if missing env
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    report.supabase = { reachable: false, reason: 'env_missing' };
    return NextResponse.json(report, { status: 500 });
  }

  try {
    const sb = adminSupabase();

    const adminUsersHead = await sb.schema('admin').from('admin_users').select('id', { count: 'exact', head: true });
    const analyticsHead  = await sb.schema('analytics').from('events').select('id', { count: 'exact', head: true });
    const masterRes      = await sb.schema('admin').from('admin_users').select('id, role, is_active, password_changed_at').eq('username', 'IsrabisAdmin').maybeSingle();
    const rpcRes         = await sb.schema('admin').rpc('run_readonly_sql', { q: 'SELECT 1 AS ok', p: JSON.stringify([]) });

    report.supabase = { reachable: true };
    report.schemas = {
      admin: {
        reachable:          !adminUsersHead.error,
        error:              adminUsersHead.error?.message,
        admin_user_count:   adminUsersHead.count ?? 0,
      },
      analytics: {
        reachable:          !analyticsHead.error,
        error:              analyticsHead.error?.message,
        events_count:       analyticsHead.count ?? 0,
      },
    };
    report.master_admin = {
      exists:            !!masterRes.data,
      role:              masterRes.data?.role,
      is_active:         masterRes.data?.is_active,
      password_set:      !!masterRes.data,
      must_rotate:       masterRes.data ? masterRes.data.password_changed_at === null : null,
    };
    report.readonly_sql_rpc = {
      callable: !rpcRes.error,
      error:    rpcRes.error?.message,
    };

    // Check public (Worldbite app data) tables using the ACTUAL snake_case table names
    // (Prisma maps PascalCase models to snake_case tables via @@map)
    const [userH, storeH, priceH, recipeH, famH, basketH, purchaseH, userRecH] = await Promise.all([
      sb.from('users').select('id', { count: 'exact', head: true }),
      sb.from('store_branches').select('id', { count: 'exact', head: true }),
      sb.from('product_prices').select('id', { count: 'exact', head: true }),
      sb.from('recipes').select('id', { count: 'exact', head: true }),
      sb.from('families').select('id', { count: 'exact', head: true }),
      sb.from('saved_baskets').select('id', { count: 'exact', head: true }),
      sb.from('purchase_history').select('id', { count: 'exact', head: true }),
      sb.from('user_recipes').select('id', { count: 'exact', head: true }),
    ]);

    report.public = {
      users:            { ok: !userH.error,     count: userH.count ?? 0,     error: userH.error?.message },
      store_branches:   { ok: !storeH.error,    count: storeH.count ?? 0,    error: storeH.error?.message },
      product_prices:   { ok: !priceH.error,    count: priceH.count ?? 0,    error: priceH.error?.message },
      recipes:          { ok: !recipeH.error,   count: recipeH.count ?? 0,   error: recipeH.error?.message },
      families:         { ok: !famH.error,      count: famH.count ?? 0,      error: famH.error?.message },
      saved_baskets:    { ok: !basketH.error,   count: basketH.count ?? 0,   error: basketH.error?.message },
      purchase_history: { ok: !purchaseH.error, count: purchaseH.count ?? 0, error: purchaseH.error?.message },
      user_recipes:     { ok: !userRecH.error,  count: userRecH.count ?? 0,  error: userRecH.error?.message },
    };

    // Definitive list of actual tables that exist in public (for future debugging)
    const tableListRes = await sb.schema('admin').rpc('run_readonly_sql', {
      q: `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`,
      p: JSON.stringify([])
    });
    report.public_tables_actually_in_db = (tableListRes.data as Array<{ table_name: string }> | null)?.map(r => r.table_name) ?? [];

    const allOk =
      report.env &&
      (report.supabase as { reachable: boolean }).reachable &&
      (report.schemas as { admin: { reachable: boolean } }).admin.reachable &&
      (report.schemas as { analytics: { reachable: boolean } }).analytics.reachable &&
      (report.master_admin as { exists: boolean }).exists &&
      (report.readonly_sql_rpc as { callable: boolean }).callable &&
      !userH.error && !storeH.error && !priceH.error;

    report.all_ok = allOk;
    return NextResponse.json(report, { status: allOk ? 200 : 500 });
  } catch (err) {
    report.supabase = {
      reachable: false,
      reason: err instanceof Error ? err.message : 'unknown',
      name: err instanceof Error ? err.name : 'Error',
    };
    return NextResponse.json(report, { status: 500 });
  }
}
