/**
 * Admin auth — JWT sign/verify using jose (Edge-safe).
 * argon2 password ops live in api-route handlers (Node runtime) only.
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export type AdminRole = 'master' | 'analyst' | 'support' | 'readonly';

export interface AdminSessionClaims extends JWTPayload {
  sub: string;           // admin_users.id
  username: string;
  role: AdminRole;
  sid: string;           // admin_sessions.id
  needs_password_change?: boolean;
}

const ALG = 'HS256';
const COOKIE_NAME = '__isbs_admin_session';

function getSecret(): Uint8Array {
  const raw = process.env.ADMIN_JWT_SECRET;
  if (!raw || raw.length < 32) {
    throw new Error('ADMIN_JWT_SECRET missing or too short (needs >= 32 chars)');
  }
  return new TextEncoder().encode(raw);
}

function getTtlSeconds(): number {
  const raw = process.env.ADMIN_SESSION_TTL_SECONDS;
  const n = raw ? parseInt(raw, 10) : 3600;
  return Number.isFinite(n) && n > 60 ? n : 3600;
}

export async function signSession(
  claims: Omit<AdminSessionClaims, 'iat' | 'exp'>,
  ttlSeconds = getTtlSeconds()
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const jwt = await new SignJWT({ ...claims })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt(now)
    .setExpirationTime(now + ttlSeconds)
    .sign(getSecret());
  return jwt;
}

export async function verifySession(token: string): Promise<AdminSessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: [ALG] });
    return payload as AdminSessionClaims;
  } catch {
    return null;
  }
}

export function sessionCookieName(): string {
  return COOKIE_NAME;
}

export function buildSessionCookie(token: string, ttlSeconds = getTtlSeconds()): string {
  const attrs = [
    `${COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    `Max-Age=${ttlSeconds}`,
  ];
  return attrs.join('; ');
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function roleRank(role: AdminRole): number {
  switch (role) {
    case 'master':   return 4;
    case 'analyst':  return 3;
    case 'support':  return 2;
    case 'readonly': return 1;
    default:         return 0;
  }
}

export function hasRole(actual: AdminRole | undefined, required: AdminRole): boolean {
  if (!actual) return false;
  return roleRank(actual) >= roleRank(required);
}
