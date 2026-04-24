/**
 * GET /api/admin/kpi/[name]?days=30
 * Named KPI catalog — see src/lib/admin/kpi.ts.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, sessionCookieName } from '@/lib/admin/auth';
import { KPI_CATALOG, parseDays, runKpi } from '@/lib/admin/kpi';
import { audit } from '@/lib/admin/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { name } = await params;
  const def = KPI_CATALOG[name];
  if (!def) return NextResponse.json({ error: 'unknown_kpi', available: Object.keys(KPI_CATALOG) }, { status: 404 });

  const url = new URL(req.url);
  const days = parseDays(url.searchParams.get('days'));

  try {
    const { rows, durationMs } = await runKpi(name, days);
    await audit({
      adminUserId: claims.sub,
      action: 'admin.kpi_viewed',
      targetType: 'kpi',
      targetId: name,
      metadata: { days, duration_ms: durationMs, row_count: rows.length }
    });
    return NextResponse.json({
      ok: true, kpi: name, display: def.display, days,
      duration_ms: durationMs, row_count: rows.length, results: rows
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'internal';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
