/**
 * POST /api/admin/demo/clear
 *
 * Master-only. Deletes every row that matches a demo marker.
 * Rows lacking a marker (production data) are NEVER touched.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, sessionCookieName, hasRole } from '@/lib/admin/auth';
import { audit } from '@/lib/admin/audit';
import { clearDemoData } from '@/lib/admin/demo/seeder';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!hasRole(claims.role, 'master')) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  // Safety pin: require an explicit confirm=="DELETE_ALL_DEMO" in the body
  let body: { confirm?: string } = {};
  try { body = await req.json(); } catch { /* ignore */ }
  if (body.confirm !== 'DELETE_ALL_DEMO') {
    return NextResponse.json({ error: 'confirmation_required', expected: 'DELETE_ALL_DEMO' }, { status: 400 });
  }

  const started = Date.now();
  const result = await clearDemoData();

  await audit({
    adminUserId: claims.sub,
    action:      'admin.demo_clear',
    metadata: {
      duration_ms: Date.now() - started,
      users_deleted: result.users_deleted,
      baskets_deleted: result.baskets_deleted,
      purchases_deleted: result.purchases_deleted,
      events_deleted: result.events_deleted,
      error_count: result.errors.length,
    },
  });

  return NextResponse.json({ ok: result.errors.length === 0, ...result });
}
