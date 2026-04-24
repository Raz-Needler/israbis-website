/**
 * POST /api/admin/auth/logout
 * Revokes the current session and clears the cookie.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { admin } from '@/lib/admin/supabase';
import { clearSessionCookie, verifySession, sessionCookieName } from '@/lib/admin/auth';
import { audit } from '@/lib/admin/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;

  if (claims) {
    try {
      await admin()
        .from('admin_sessions')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', claims.sid);
    } catch {}
    await audit({ adminUserId: claims.sub, action: 'admin.logged_out' });
  }

  const res = NextResponse.json({ ok: true });
  res.headers.append('set-cookie', clearSessionCookie());
  return res;
}
