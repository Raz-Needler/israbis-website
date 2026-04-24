/**
 * GET /api/admin/demo/status
 * Session-only. Returns demo-data footprint counts.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, sessionCookieName } from '@/lib/admin/auth';
import { demoStatus } from '@/lib/admin/demo/seeder';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const status = await demoStatus();
  return NextResponse.json({ ok: true, ...status });
}
