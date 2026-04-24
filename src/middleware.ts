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
]);

/** Security headers applied to every admin response. */
function applySecurityHeaders(res: NextResponse): NextResponse {
  // Clickjacking protection — admin never needs to be embedded anywhere
  res.headers.set('x-frame-options', 'DENY');
  // MIME sniffing protection
  res.headers.set('x-content-type-options', 'nosniff');
  // Referrer policy — don't leak admin paths to external sites
  res.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  // HSTS — force HTTPS for a year (site is already served over https://israbis.com)
  res.headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains');
  // Permissions policy — deny access to sensors the admin never needs
  res.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  // CSP: restrict script sources. 'unsafe-inline' stays for Next.js inline bootstrap;
  // 'unsafe-eval' is required by Recharts in some builds.
  res.headers.set(
    'content-security-policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://*.supabase.in",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminRoute  = pathname.startsWith('/admin');
  const isAdminApi    = pathname.startsWith('/api/admin');

  if (!isAdminRoute && !isAdminApi) return NextResponse.next();
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return applySecurityHeaders(NextResponse.next());

  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;

  if (!claims) {
    if (isAdminApi) {
      return applySecurityHeaders(new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' }
      }));
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('next', pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // Attach the admin identity to request headers for downstream handlers.
  const res = NextResponse.next();
  res.headers.set('x-admin-user-id', claims.sub);
  res.headers.set('x-admin-role', claims.role);
  res.headers.set('x-admin-session-id', claims.sid);
  if (claims.needs_password_change) {
    res.headers.set('x-admin-needs-rotation', '1');
  }
  return applySecurityHeaders(res);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};
