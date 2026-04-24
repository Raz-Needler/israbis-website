/**
 * POST /api/analytics/ingest
 * Public endpoint — receives batched events from the mobile app and website.
 * No auth; rate-limited per IP; schema-validated; PII-redacted.
 * Writes to analytics.events with INSERT … ON CONFLICT DO NOTHING for dedup.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { adminSupabase } from '@/lib/admin/supabase';
import { hashIp } from '@/lib/admin/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BATCH = 100;
const MAX_EVENT_BYTES = 8192;
const EVENT_NAME_RE = /^[a-z][a-z0-9_]*\.[a-z0-9_.]+$/i;
const PII_KEY_RE = /(password|token|secret|authorization|jwt|apikey|api_key|ccn|iban|tz_id|identity_number)/i;

interface IncomingEvent {
  event_id?: string;
  event_name?: string;
  event_version?: number;
  occurred_at?: string;
  anonymous_id?: string;
  user_id?: string | null;
  session_id?: string | null;
  device_id?: string | null;
  platform?: string | null;
  app_version?: string | null;
  os_version?: string | null;
  locale?: string | null;
  subscription_tier?: string | null;
  family_id?: string | null;
  props?: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  // CORS
  const origin = req.headers.get('origin') ?? '';
  const corsHeaders: Record<string, string> = {
    'access-control-allow-origin': origin || '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
  };

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim() || 'unknown';
  const ipHash = await hashIp(ip);

  // TODO: IP-based rate limit via a tiny in-memory LRU or Supabase sliding window.
  // For Phase 1 we rely on Vercel's built-in rate limiting + upstream WAF.

  let body: { events?: IncomingEvent[] };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'bad_body' }, { status: 400, headers: corsHeaders });
  }

  const events = Array.isArray(body.events) ? body.events : [];
  if (events.length === 0) {
    return NextResponse.json({ accepted: 0, rejected: 0 }, { headers: corsHeaders });
  }
  if (events.length > MAX_BATCH) {
    return NextResponse.json({ error: 'batch_too_large', max: MAX_BATCH }, { status: 413, headers: corsHeaders });
  }

  const rows: Record<string, unknown>[] = [];
  const rejects: Array<{ reason: string; raw: string }> = [];

  for (const e of events) {
    const serialized = JSON.stringify(e);
    if (serialized.length > MAX_EVENT_BYTES) {
      rejects.push({ reason: 'too_large', raw: serialized.slice(0, 500) });
      continue;
    }
    if (!e.event_id || !e.event_name || !e.occurred_at || !e.anonymous_id) {
      rejects.push({ reason: 'schema_mismatch', raw: serialized.slice(0, 500) });
      continue;
    }
    if (typeof e.event_name !== 'string' || !EVENT_NAME_RE.test(e.event_name)) {
      rejects.push({ reason: 'invalid_event_name', raw: serialized.slice(0, 500) });
      continue;
    }

    const cleanProps = redactProps(e.props ?? {});
    const occurredAt = e.occurred_at;
    const day = occurredAt.slice(0, 10);
    const category = e.event_name.split('.')[0];

    rows.push({
      event_id:          e.event_id,
      event_name:        e.event_name,
      event_category:    category,
      event_version:     e.event_version ?? 1,
      occurred_at:       occurredAt,
      day,
      user_id:           e.user_id ?? null,
      anonymous_id:      e.anonymous_id,
      session_id:        e.session_id ?? null,
      device_id:         e.device_id ?? null,
      platform:          e.platform ?? null,
      app_version:       e.app_version ?? null,
      os_version:        e.os_version ?? null,
      locale:            e.locale ?? null,
      subscription_tier: e.subscription_tier ?? null,
      family_id:         e.family_id ?? null,
      props:             cleanProps,
      ip_hash:           ipHash
    });
  }

  let accepted = 0;
  if (rows.length > 0) {
    const { error, data } = await adminSupabase()
      .schema('analytics')
      .from('events')
      .upsert(rows, { onConflict: 'event_id', ignoreDuplicates: true })
      .select('id');
    if (error) {
      return NextResponse.json({ error: 'internal', detail: error.message }, { status: 500, headers: corsHeaders });
    }
    accepted = data?.length ?? rows.length;
  }

  if (rejects.length > 0) {
    const rejectRows = rejects.map(r => ({ reason: r.reason, raw: r.raw }));
    try {
      await adminSupabase().schema('analytics').from('events_rejected').insert(rejectRows);
    } catch {
      // fail-open — never block ingestion on a debug-log insert
    }
  }

  return NextResponse.json(
    { accepted, rejected: rejects.length },
    { headers: corsHeaders }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'access-control-allow-origin':  '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'access-control-max-age':       '86400'
    }
  });
}

function redactProps(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (PII_KEY_RE.test(k)) continue;
    out[k] = v;
  }
  return out;
}
