/**
 * Audit-log helper. Every sensitive admin action should call audit().
 * Best-effort: never throws to the caller.
 */

import { admin } from './supabase';

export interface AuditEntry {
  adminUserId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipHash?: string;
  userAgentHash?: string;
}

export async function audit(entry: AuditEntry): Promise<void> {
  try {
    await admin()
      .from('admin_audit')
      .insert({
        admin_user_id:   entry.adminUserId ?? null,
        action:          entry.action,
        target_type:     entry.targetType ?? null,
        target_id:       entry.targetId ?? null,
        metadata:        entry.metadata ?? null,
        ip_hash:         entry.ipHash ?? null,
        user_agent_hash: entry.userAgentHash ?? null
      });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[audit] insert failed', err);
  }
}

export async function hashIp(ip: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

export async function hashUserAgent(ua: string | null): Promise<string | null> {
  if (!ua) return null;
  return hashIp(ua); // same one-way hash, different input
}
