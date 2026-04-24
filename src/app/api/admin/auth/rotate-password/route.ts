/**
 * POST /api/admin/auth/rotate-password
 * Body: { current_password, new_password }
 * Any authenticated admin can rotate their own password.
 * Required on first login.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verify as argonVerify, hash as argonHash } from '@node-rs/argon2';
import { admin } from '@/lib/admin/supabase';
import { verifySession, sessionCookieName, signSession, buildSessionCookie } from '@/lib/admin/auth';
import { audit } from '@/lib/admin/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MIN_LEN = 12;

export async function POST(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: { current_password?: string; new_password?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad_body' }, { status: 400 }); }
  const { current_password, new_password } = body;
  if (!current_password || !new_password) return NextResponse.json({ error: 'bad_body' }, { status: 400 });
  if (new_password.length < MIN_LEN) return NextResponse.json({ error: 'password_too_short', min: MIN_LEN }, { status: 400 });
  if (new_password === current_password) return NextResponse.json({ error: 'must_differ' }, { status: 400 });

  const userRes = await admin().from('admin_users').select('id, password_hash, role, username').eq('id', claims.sub).maybeSingle();
  if (userRes.error || !userRes.data) return NextResponse.json({ error: 'internal' }, { status: 500 });

  const ok = await argonVerify(userRes.data.password_hash, current_password).catch(() => false);
  if (!ok) return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });

  const newHash = await argonHash(new_password, { memoryCost: 65536, timeCost: 3, parallelism: 4 });
  const upd = await admin()
    .from('admin_users')
    .update({ password_hash: newHash, password_changed_at: new Date().toISOString() })
    .eq('id', claims.sub);
  if (upd.error) return NextResponse.json({ error: 'internal' }, { status: 500 });

  // Issue a fresh session token without the rotation flag
  const ttl = parseInt(process.env.ADMIN_SESSION_TTL_SECONDS ?? '3600', 10);
  const newToken = await signSession({
    sub: claims.sub, username: claims.username, role: claims.role, sid: claims.sid,
    needs_password_change: false
  }, ttl);

  await audit({ adminUserId: claims.sub, action: 'admin.password_rotated' });

  const res = NextResponse.json({ ok: true });
  res.headers.append('set-cookie', buildSessionCookie(newToken, ttl));
  return res;
}
