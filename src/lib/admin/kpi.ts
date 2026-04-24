/**
 * KPI catalog — named read-only SQL queries exposed at /api/admin/kpi/[name].
 * Queries run through Supabase's Postgres REST or direct SQL RPC.
 *
 * Every query is parameterized and gated: only queries in this catalog are runnable
 * by analyst/support roles. Master role can also go to /admin/sql for arbitrary SELECTs.
 */

import { adminSupabase } from './supabase';

export type KpiDisplay = 'scorecard' | 'timeseries' | 'bar' | 'funnel' | 'retention' | 'stacked-area' | 'table';

export interface KpiDef {
  display: KpiDisplay;
  description: string;
  /** SQL query. `$1`..`$n` placeholders are bound to `params`. */
  sql: string;
  /** Accepted URL query params (besides days) */
  queryParams?: string[];
}

/** Build a days filter safely: clamps to [1, 365] */
export function parseDays(input: string | null, fallback = 30): number {
  if (!input) return fallback;
  const n = parseInt(input, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(365, n));
}

export const KPI_CATALOG: Record<string, KpiDef> = {
  // ── Overview ─────────────────────────────────────────────
  dau: {
    display: 'timeseries',
    description: 'Daily active users (distinct user_id or anonymous_id) per day',
    sql: `
      SELECT day, COUNT(DISTINCT COALESCE(user_id, anonymous_id)) AS value
      FROM analytics.events
      WHERE day >= current_date - ($1::int || ' days')::interval
      GROUP BY day ORDER BY day
    `
  },
  new_signups: {
    display: 'timeseries',
    description: 'New signups per day',
    sql: `
      SELECT day, COUNT(*) AS value
      FROM analytics.events
      WHERE event_name = 'auth.signup_completed'
        AND day >= current_date - ($1::int || ' days')::interval
      GROUP BY day ORDER BY day
    `
  },
  top_events: {
    display: 'bar',
    description: 'Top events by volume in window',
    sql: `
      SELECT event_name AS label,
             COUNT(*) AS value,
             COUNT(DISTINCT COALESCE(user_id, anonymous_id)) AS unique_users
      FROM analytics.events
      WHERE day >= current_date - ($1::int || ' days')::interval
      GROUP BY event_name ORDER BY value DESC LIMIT 30
    `
  },
  top_screens: {
    display: 'bar',
    description: 'Most-viewed screens in window',
    sql: `
      SELECT props->>'screen_name' AS label,
             COUNT(*) AS value,
             COUNT(DISTINCT COALESCE(user_id, anonymous_id)) AS unique_users
      FROM analytics.events
      WHERE event_name = 'nav.screen_viewed'
        AND day >= current_date - ($1::int || ' days')::interval
      GROUP BY props->>'screen_name' ORDER BY value DESC LIMIT 40
    `
  },
  platform_split: {
    display: 'bar',
    description: 'Event split by platform',
    sql: `
      SELECT COALESCE(platform,'unknown') AS label,
             COUNT(*) AS value,
             COUNT(DISTINCT COALESCE(user_id, anonymous_id)) AS unique_users
      FROM analytics.events
      WHERE day >= current_date - ($1::int || ' days')::interval
      GROUP BY platform
    `
  },

  // ── Chain intelligence ──────────────────────────────────
  chain_share: {
    display: 'stacked-area',
    description: 'Share of cart switches by destination chain per day',
    sql: `
      SELECT day,
             props->>'to_chain' AS series,
             COUNT(*) AS value
      FROM analytics.events
      WHERE event_name = 'cart.chain_switched'
        AND day >= current_date - ($1::int || ' days')::interval
      GROUP BY day, props->>'to_chain'
      ORDER BY day, value DESC
    `
  },
  intent_baskets_daily: {
    display: 'timeseries',
    description: 'Intent baskets built per day (cart.compared events)',
    sql: `
      SELECT day, COUNT(*) AS value
      FROM analytics.events
      WHERE event_name = 'cart.compared'
        AND day >= current_date - ($1::int || ' days')::interval
      GROUP BY day ORDER BY day
    `
  },

  // ── Funnels ─────────────────────────────────────────────
  funnel_signup_to_purchase: {
    display: 'funnel',
    description: 'Signup → first cart → first compare → first purchase',
    sql: `
      WITH s AS (
        SELECT DISTINCT anonymous_id FROM analytics.events
        WHERE event_name = 'auth.signup_completed'
          AND day >= current_date - ($1::int || ' days')::interval
      ), c1 AS (
        SELECT DISTINCT s.anonymous_id FROM s
        INNER JOIN analytics.events e USING (anonymous_id)
        WHERE e.event_name = 'cart.item_added'
      ), c2 AS (
        SELECT DISTINCT s.anonymous_id FROM s
        INNER JOIN analytics.events e USING (anonymous_id)
        WHERE e.event_name = 'cart.compared'
      ), c3 AS (
        SELECT DISTINCT s.anonymous_id FROM s
        INNER JOIN analytics.events e USING (anonymous_id)
        WHERE e.event_name = 'cart.purchase_confirmed'
      )
      SELECT 'signed_up'    AS step, 1 AS ord, (SELECT COUNT(*) FROM s)  AS value
      UNION ALL SELECT 'added_cart', 2, (SELECT COUNT(*) FROM c1)
      UNION ALL SELECT 'compared',   3, (SELECT COUNT(*) FROM c2)
      UNION ALL SELECT 'purchased',  4, (SELECT COUNT(*) FROM c3)
      ORDER BY ord
    `
  },
  funnel_paywall_to_paid: {
    display: 'funnel',
    description: 'Paywall viewed → checkout started → checkout completed',
    sql: `
      WITH p AS (
        SELECT DISTINCT anonymous_id FROM analytics.events
        WHERE event_name = 'subs.paywall_viewed'
          AND day >= current_date - ($1::int || ' days')::interval
      ), s AS (
        SELECT DISTINCT p.anonymous_id FROM p
        INNER JOIN analytics.events e USING (anonymous_id)
        WHERE e.event_name = 'subs.checkout_started'
      ), c AS (
        SELECT DISTINCT p.anonymous_id FROM p
        INNER JOIN analytics.events e USING (anonymous_id)
        WHERE e.event_name = 'subs.checkout_completed'
      )
      SELECT 'paywall_viewed'   AS step, 1 AS ord, (SELECT COUNT(*) FROM p) AS value
      UNION ALL SELECT 'checkout_started', 2, (SELECT COUNT(*) FROM s)
      UNION ALL SELECT 'checkout_completed', 3, (SELECT COUNT(*) FROM c)
      ORDER BY ord
    `
  },

  // ── Retention ───────────────────────────────────────────
  retention_weekly: {
    display: 'retention',
    description: 'Weekly cohort retention grid',
    sql: `
      WITH firsts AS (
        SELECT anonymous_id, DATE_TRUNC('week', MIN(occurred_at))::date AS cohort_week
        FROM analytics.events GROUP BY anonymous_id
      )
      SELECT f.cohort_week,
             ((DATE_TRUNC('week', e.occurred_at)::date - f.cohort_week) / 7)::int AS week_n,
             COUNT(DISTINCT f.anonymous_id) AS value
      FROM firsts f
      INNER JOIN analytics.events e USING (anonymous_id)
      WHERE f.cohort_week >= current_date - ($1::int || ' days')::interval
      GROUP BY f.cohort_week, week_n
      ORDER BY f.cohort_week, week_n
    `
  },

  // ── Scanner usage ───────────────────────────────────────
  scanner_usage: {
    display: 'bar',
    description: 'Scanner events by type',
    sql: `
      SELECT event_name AS label,
             COUNT(*) AS value,
             COUNT(DISTINCT COALESCE(user_id, anonymous_id)) AS unique_users
      FROM analytics.events
      WHERE event_category = 'scan'
        AND day >= current_date - ($1::int || ' days')::interval
      GROUP BY event_name ORDER BY value DESC
    `
  },

  // ── AI / Miki ───────────────────────────────────────────
  ai_daily: {
    display: 'timeseries',
    description: 'Miki AI messages per day',
    sql: `
      SELECT day, COUNT(*) AS value,
             COUNT(DISTINCT COALESCE(user_id, anonymous_id)) AS unique_users
      FROM analytics.events
      WHERE event_name = 'ai.message_sent'
        AND day >= current_date - ($1::int || ' days')::interval
      GROUP BY day ORDER BY day
    `
  },

  // ── Scorecards (single-value) ───────────────────────────
  scorecard_overview: {
    display: 'scorecard',
    description: 'One-row key scorecards',
    sql: `
      WITH today AS (SELECT * FROM analytics.events WHERE day = current_date),
           yesterday AS (SELECT * FROM analytics.events WHERE day = current_date - 1),
           last7 AS (SELECT * FROM analytics.events WHERE day >= current_date - 7),
           last30 AS (SELECT * FROM analytics.events WHERE day >= current_date - 30)
      SELECT
        (SELECT COUNT(DISTINCT COALESCE(user_id, anonymous_id)) FROM today)     AS dau_today,
        (SELECT COUNT(DISTINCT COALESCE(user_id, anonymous_id)) FROM yesterday) AS dau_yesterday,
        (SELECT COUNT(DISTINCT COALESCE(user_id, anonymous_id)) FROM last7)     AS wau,
        (SELECT COUNT(DISTINCT COALESCE(user_id, anonymous_id)) FROM last30)    AS mau,
        (SELECT COUNT(*) FROM today WHERE event_name='auth.signup_completed')   AS new_signups_today,
        (SELECT COUNT(*) FROM today)                                            AS events_today,
        (SELECT COUNT(*) FROM today WHERE event_name='cart.purchase_confirmed') AS purchases_today,
        (SELECT COUNT(*) FROM today WHERE event_name='subs.checkout_completed') AS paid_conversions_today
    `
  }
};

/**
 * Execute a KPI by name. Uses a Supabase RPC if you've defined one,
 * otherwise falls back to a raw query via the service role.
 */
export async function runKpi(name: string, days: number): Promise<{ rows: Record<string, unknown>[]; durationMs: number }> {
  const def = KPI_CATALOG[name];
  if (!def) throw new Error(`unknown_kpi:${name}`);

  const client = adminSupabase();
  const started = Date.now();

  // Use Supabase's rpc for parameterized raw SQL via a helper function.
  // Migration 004 creates `admin.run_readonly_sql(text, jsonb)` which we call here.
  const { data, error } = await client
    .schema('admin')
    .rpc('run_readonly_sql', { q: def.sql, p: JSON.stringify([days]) });

  if (error) throw new Error(error.message);

  return {
    rows: (data as unknown as Record<string, unknown>[]) ?? [],
    durationMs: Date.now() - started
  };
}
