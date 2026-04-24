/**
 * Centralized read-only SQL runner for Server Components.
 * Uses the admin.run_readonly_sql SECURITY DEFINER function for safety.
 * Falls back gracefully when the analytics schema hasn't been migrated yet.
 */

import { adminSupabase } from './supabase';

export interface SqlResult<T = Record<string, unknown>> {
  rows: T[];
  error: string | null;
  durationMs: number;
}

export async function sql<T = Record<string, unknown>>(
  query: string,
  params: unknown[] = []
): Promise<SqlResult<T>> {
  const t0 = Date.now();
  try {
    const { data, error } = await adminSupabase()
      .schema('admin')
      .rpc('run_readonly_sql', { q: query, p: params });

    if (error) return { rows: [], error: error.message, durationMs: Date.now() - t0 };
    return { rows: (data as unknown as T[]) ?? [], error: null, durationMs: Date.now() - t0 };
  } catch (e) {
    return { rows: [], error: e instanceof Error ? e.message : 'unknown', durationMs: Date.now() - t0 };
  }
}

/** Run a SELECT, return first row or null. */
export async function sqlOne<T = Record<string, unknown>>(
  query: string,
  params: unknown[] = []
): Promise<T | null> {
  const { rows } = await sql<T>(query, params);
  return rows[0] ?? null;
}

/** Common: check analytics schema has at least one event. */
export async function hasEvents(): Promise<boolean> {
  const r = await sqlOne<{ c: number }>(`SELECT COUNT(*)::int AS c FROM analytics.events LIMIT 1`);
  return (r?.c ?? 0) > 0;
}

/** Minutes since the most recent event, or null if none. */
export async function eventFreshness(): Promise<number | null> {
  const r = await sqlOne<{ mins: number }>(
    `SELECT EXTRACT(EPOCH FROM (now() - MAX(received_at))) / 60 AS mins FROM analytics.events`
  );
  if (!r || r.mins == null) return null;
  return Number(r.mins);
}
