/**
 * POST /api/admin/auth/login
 * Body: { username: string, password: string }
 * On success: sets httpOnly cookie, returns { ok: true, needs_password_change }
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verify as argonVerify } from '@node-rs/argon2';
import { admin, adminSupabase } from '@/lib/admin/supabase';
import { signSession, buildSessionCookie, type AdminRole } from '@/lib/admin/auth';
import { audit, hashIp, hashUserAgent } from '@/lib/admin/audit';

export const runtime = 'nodejs';          // argon2 needs Node runtime
export const dynamic = 'force-dynamic';

const MAX_ATTEMPTS = parseInt(process.env.ADMIN_MAX_LOGIN_ATTEMPTS ?? '10', 10);
const WINDOW_SEC   = parseInt(process.env.ADMIN_MAX_LOGIN_WINDOW_SEC ?? '900', 10);

export async function POST(req: NextRequest) {
  const ipHeader = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  const ip = ipHeader.split(',')[0]?.trim() || 'unknown';
  const ipHash = await hashIp(ip);
  const uaHash = await hashUserAgent(req.headers.get('user-agent'));

  // Rate limit
  const since = new Date(Date.now() - WINDOW_SEC * 1000).toISOString();
  const attemptsRes = await admin()
    .from('login_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('attempted_at', since);
  if ((attemptsRes.count ?? 0) >= MAX_ATTEMPTS) {
    await recordAttempt(ipHash, null, false, 'rate_limited');
    return json({ error: 'too_many_attempts' }, 429);
  }

  let body: { username?: string; password?: string };
  try { body = await req.json(); } catch { return json({ error: 'bad_body' }, 400); }
  const username = (body.username ?? '').trim();
  const password = body.password ?? '';
  if (!username || !password) {
    await recordAttempt(ipHash, username, false, 'missing_fields');
    return json({ error: 'bad_body' }, 400);
  }

  // Fetch the user
  const userRes = await admin()
    .from('admin_users')
    .select('id, username, password_hash, role, is_active, locked_until, password_changed_at')
    .eq('username', username)
    .maybeSingle();

  if (userRes.error) {
    await recordAttempt(ipHash, username, false, 'db_error');
    return json({ error: 'internal' }, 500);
  }

  const u = userRes.data;
  if (!u || !u.is_active) {
    await recordAttempt(ipHash, username, false, 'unknown_user');
    // Small delay to reduce user-enumeration timing leak
    await sleepRandom(120, 280);
    return json({ error: 'invalid_credentials' }, 401);
  }

  if (u.locked_until && new Date(u.locked_until) > new Date()) {
    await recordAttempt(ipHash, username, false, 'locked');
    return json({ error: 'locked', until: u.locked_until }, 423);
  }

  // Verify argon2 hash
  let valid = false;
  try { valid = await argonVerify(u.password_hash, password); } catch { valid = false; }
  if (!valid) {
    await recordAttempt(ipHash, username, false, 'bad_password');
    await admin()
      .from('admin_users')
      .update({ failed_login_count: (u as { failed_login_count?: number }).failed_login_count ?? 0 + 1 })
      .eq('id', u.id);
    return json({ error: 'invalid_credentials' }, 401);
  }

  // Create session
  const supabase = adminSupabase();
  const ttl = parseInt(process.env.ADMIN_SESSION_TTL_SECONDS ?? '3600', 10);
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  const sessionIns = await supabase
    .schema('admin')
    .from('admin_sessions')
    .insert({
      admin_user_id: u.id,
      expires_at: expiresAt,
      ip_hash: ipHash,
      user_agent_hash: uaHash
    })
    .select('id')
    .single();

  if (sessionIns.error || !sessionIns.data) {
    await recordAttempt(ipHash, username, false, 'session_insert_failed');
    return json({ error: 'internal' }, 500);
  }

  // Update last_login_at on the user
  await admin()
    .from('admin_users')
    .update({ last_login_at: new Date().toISOString(), last_login_ip_hash: ipHash, failed_login_count: 0 })
    .eq('id', u.id);

  const needsPasswordChange = u.password_changed_at === null;

  const token = await signSession({
    sub: u.id,
    username: u.username,
    role: u.role as AdminRole,
    sid: sessionIns.data.id,
    needs_password_change: needsPasswordChange
  }, ttl);

  await recordAttempt(ipHash, username, true, 'ok');
  await audit({
    adminUserId: u.id,
    action: 'admin.login_succeeded',
    metadata: { needs_password_change: needsPasswordChange },
    ipHash,
    userAgentHash: uaHash ?? undefined
  });

  const res = NextResponse.json({
    ok: true,
    needs_password_change: needsPasswordChange,
    role: u.role,
    username: u.username
  });
  res.headers.append('set-cookie', buildSessionCookie(token, ttl));
  return res;
}

async function recordAttempt(ipHash: string, username: string | null, success: boolean, reason: string) {
  try {
    await admin()
      .from('login_attempts')
      .insert({ ip_hash: ipHash, username_tried: username, success, reason });
  } catch {}
}

function sleepRandom(minMs: number, maxMs: number): Promise<void> {
  return new Promise(r => setTimeout(r, minMs + Math.floor(Math.random() * (maxMs - minMs))));
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}
