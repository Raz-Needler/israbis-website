/**
 * GET /api/admin/intelligence/search-history?limit=20
 *
 * Lists the current admin's most recent product searches (newest first).
 * Each row includes the original query, whether it was served from cache
 * or the DB, how fast it was, and how many results it returned.
 *
 * If the cache/history tables don't exist yet (migration not applied),
 * we return an empty list rather than 500ing — the UI treats it as
 * "no history yet."
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, sessionCookieName } from '@/lib/admin/auth';
import { adminSupabase } from '@/lib/admin/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get('limit') ?? '20', 10)));

  const sb = adminSupabase();
  try {
    const res = await sb.schema('admin').from('search_history')
      .select('query_raw, kind, result_count, served_from, duration_ms, searched_at')
      .eq('admin_user_id', claims.sub)
      .order('searched_at', { ascending: false })
      .limit(limit);

    if (res.error) {
      // table missing → empty result
      return NextResponse.json({ ok: true, history: [], note: 'migration_not_applied' });
    }
    return NextResponse.json({ ok: true, history: res.data ?? [] });
  } catch (err) {
    return NextResponse.json({ ok: true, history: [], error: err instanceof Error ? err.message : 'unknown' });
  }
}
