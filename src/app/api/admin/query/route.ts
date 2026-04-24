/**
 * POST /api/admin/query   (master role only)
 * Body: { sql: string }
 * SELECT-only. Runs via admin.run_readonly_sql RPC.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, sessionCookieName, hasRole } from '@/lib/admin/auth';
import { adminSupabase } from '@/lib/admin/supabase';
import { audit } from '@/lib/admin/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MUTATION_RE = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|ATTACH|CREATE|REPLACE|TRUNCATE|GRANT|REVOKE|COPY)\b/i;
const LEAD_RE     = /^\s*(WITH|SELECT)\b/i;

export async function POST(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!hasRole(claims.role, 'master')) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  let body: { sql?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad_body' }, { status: 400 }); }
  const sql = (body.sql ?? '').trim();
  if (!sql) return NextResponse.json({ error: 'empty_sql' }, { status: 400 });
  if (sql.includes(';')) return NextResponse.json({ error: 'multi_statement_not_allowed' }, { status: 400 });
  if (!LEAD_RE.test(sql)) return NextResponse.json({ error: 'read_only' }, { status: 400 });
  if (MUTATION_RE.test(sql)) return NextResponse.json({ error: 'read_only' }, { status: 400 });

  const withLimit = /\bLIMIT\b/i.test(sql) ? sql : `${sql} LIMIT 5000`;
  const started = Date.now();

  try {
    const { data, error } = await adminSupabase()
      .schema('admin')
      .rpc('run_readonly_sql', { q: withLimit, p: JSON.stringify([]) });

    if (error) {
      await audit({ adminUserId: claims.sub, action: 'admin.query_failed', metadata: { reason: error.message, sql_preview: sql.slice(0, 200) } });
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    const rows = (data as unknown as Record<string, unknown>[]) ?? [];
    await audit({
      adminUserId: claims.sub,
      action: 'admin.query_executed',
      metadata: { duration_ms: Date.now() - started, row_count: rows.length, sql_preview: sql.slice(0, 500) }
    });

    return NextResponse.json({ ok: true, duration_ms: Date.now() - started, row_count: rows.length, results: rows });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'internal';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
