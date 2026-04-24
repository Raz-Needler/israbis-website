/**
 * Next.js middleware — runs on the Edge runtime.
 * Gates /admin/* and /api/admin/* behind the admin session cookie.
 * Everything else passes through unchanged.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, sessionCookieName } from '@/lib/admin/auth';

const PUBLIC_ADMIN_PATHS = new Set<string>([
  '/admin/login',
  '/api/admin/auth/login',
  '/api/admin/_diag',
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminRoute  = pathname.startsWith('/admin');
  const isAdminApi    = pathname.startsWith('/api/admin');

  if (!isAdminRoute && !isAdminApi) return NextResponse.next();
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();

  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;

  if (!claims) {
    if (isAdminApi) {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' }
      });
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Attach the admin identity to request headers for downstream handlers.
  const res = NextResponse.next();
  res.headers.set('x-admin-user-id', claims.sub);
  res.headers.set('x-admin-role', claims.role);
  res.headers.set('x-admin-session-id', claims.sid);
  if (claims.needs_password_change) {
    res.headers.set('x-admin-needs-rotation', '1');
  }
  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};
