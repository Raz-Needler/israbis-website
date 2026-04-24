/**
 * POST /api/admin/export   (form-encoded: dataset, format)
 * Streams CSV/XLSX for a named dataset. Size-capped at 250K rows.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, sessionCookieName } from '@/lib/admin/auth';
import { adminSupabase } from '@/lib/admin/supabase';
import { audit } from '@/lib/admin/audit';
import ExcelJS from 'exceljs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATASETS: Record<string, { query: string; schema?: 'public' | 'analytics' }> = {
  intent_baskets: { schema: 'analytics', query: `SELECT * FROM analytics.fact_intent_basket ORDER BY built_at DESC LIMIT 250000` },
  events:         { schema: 'analytics', query: `SELECT event_id, event_name, event_category, occurred_at, user_id, anonymous_id, platform, app_version, props FROM analytics.events ORDER BY occurred_at DESC LIMIT 250000` },
  users:          { query: `SELECT id, name, email, provider, "joinDate" FROM public."User" ORDER BY "joinDate" DESC LIMIT 250000` },
  purchases:      { query: `SELECT id, "userId", "storeName", "totalCost", "itemCount", "purchasedAt" FROM public."PurchaseHistory" ORDER BY "purchasedAt" DESC LIMIT 250000` },
  families:       { query: `SELECT id, name, "ownerId", "subscriptionTier", "seatCount", "createdAt" FROM public."Family" ORDER BY "createdAt" DESC LIMIT 250000` },
  prices:         { query: `SELECT barcode, "chainKey", "storeId", "priceNIS", "productName", "lastUpdated" FROM public."ProductPrice" ORDER BY "lastUpdated" DESC LIMIT 100000` },
};

export async function POST(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const form = await req.formData();
  const dataset = String(form.get('dataset') ?? '');
  const format = String(form.get('format') ?? 'csv');
  const def = DATASETS[dataset];
  if (!def) return NextResponse.json({ error: 'unknown_dataset' }, { status: 400 });

  const started = Date.now();
  const sb = adminSupabase();
  const { data, error } = await sb.schema('admin').rpc('run_readonly_sql', { q: def.query, p: JSON.stringify([]) });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = (data as unknown as Record<string, unknown>[]) ?? [];

  await audit({
    adminUserId: claims.sub,
    action: 'admin.export_completed',
    targetType: 'dataset',
    targetId: dataset,
    metadata: { format, row_count: rows.length, duration_ms: Date.now() - started }
  });

  const filename = `isrbs-${dataset}-${new Date().toISOString().slice(0, 10)}.${format}`;

  if (format === 'csv') {
    const csv = toCsv(rows);
    return new NextResponse(csv, {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="${filename}"`,
      }
    });
  }
  if (format === 'xlsx') {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(dataset);
    if (rows.length) {
      const cols = Object.keys(rows[0]);
      ws.columns = cols.map(c => ({ header: c, key: c }));
      ws.addRows(rows.map(r => Object.fromEntries(cols.map(c => [c, normalize(r[c])]))));
      ws.getRow(1).font = { bold: true };
    } else {
      ws.addRow(['(no rows)']);
    }
    const buf = await wb.xlsx.writeBuffer();
    return new NextResponse(buf, {
      headers: {
        'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'content-disposition': `attachment; filename="${filename}"`,
      }
    });
  }

  return NextResponse.json({ error: 'unknown_format' }, { status: 400 });
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const cols = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return '';
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = [cols.join(',')];
  for (const r of rows) lines.push(cols.map(c => escape(r[c])).join(','));
  return lines.join('\n');
}

function normalize(v: unknown): string | number | boolean | Date | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'object') return JSON.stringify(v);
  return v as string | number | boolean;
}
