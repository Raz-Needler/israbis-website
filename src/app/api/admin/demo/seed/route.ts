/**
 * POST /api/admin/demo/seed
 *
 * Master-only. Kicks off the demo data seeder.
 * Writes are synchronous — the request blocks until the seed is complete and
 * returns a full report. For a 500-user seed this takes ~8-20 seconds.
 *
 * Body: { userCount?, basketsPerUser?, purchasesPerUser?, eventsPerUser?, daysWindow?, seed? }
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, sessionCookieName, hasRole } from '@/lib/admin/auth';
import { audit } from '@/lib/admin/audit';
import { rateLimit } from '@/lib/admin/rateLimit';
import { seedDemoData, type SeedOptions } from '@/lib/admin/demo/seeder';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Vercel Pro/Hobby cap

export async function POST(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!hasRole(claims.role, 'master')) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  // Per-admin rate limit — 3 seeds per 5 minutes is plenty and caps cost of a runaway UI loop
  const rl = rateLimit(`demo-seed::${claims.sub}`, 3, 300);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retry_after_seconds: rl.retryAfterSeconds },
      { status: 429 }
    );
  }

  let opts: SeedOptions = {};
  try { opts = await req.json(); } catch { /* defaults ok */ }

  const started = Date.now();
  const result = await seedDemoData({
    userCount:        clampInt(opts.userCount,        10,    5000, 500),
    basketsPerUser:   clampInt(opts.basketsPerUser,   0,     20,   3),
    purchasesPerUser: clampInt(opts.purchasesPerUser, 0,     20,   2),
    eventsPerUser:    clampInt(opts.eventsPerUser,    0,     500,  40),
    daysWindow:       clampInt(opts.daysWindow,       7,     365,  90),
    seed:             Number.isFinite(opts.seed) ? Number(opts.seed) : undefined,
  });

  await audit({
    adminUserId: claims.sub,
    action:      'admin.demo_seed',
    metadata: {
      duration_ms: Date.now() - started,
      users_created: result.users_created,
      baskets_created: result.baskets_created,
      purchases_created: result.purchases_created,
      events_accepted: result.events_accepted,
      error_count: result.errors.length,
    },
  });

  return NextResponse.json({ ok: result.errors.length === 0, ...result });
}

function clampInt(v: number | undefined, lo: number, hi: number, fallback: number): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(lo, Math.min(hi, Math.round(n)));
}
