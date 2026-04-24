/**
 * Supabase client for admin routes.
 * Uses the SERVICE ROLE KEY which bypasses row-level security.
 * Must never be imported from Client Components (the key would leak to the browser bundle).
 *
 * Safe import sites:
 *   - API route handlers under src/app/api/admin
 *   - Server utilities under src/lib/admin
 *   - Server Components under src/app/admin (no 'use client' directive)
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

export function adminSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for admin routes');
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db:   { schema: 'public' },  // default; cross-schema queries use .schema('admin') / .schema('analytics')
    global: { headers: { 'x-client-info': 'israbis-admin' } }
  });
  return cached;
}

/** Convenience: get a client already scoped to the admin schema */
export function admin(): ReturnType<SupabaseClient['schema']> {
  return adminSupabase().schema('admin');
}

/** Convenience: get a client already scoped to the analytics schema */
export function analytics(): ReturnType<SupabaseClient['schema']> {
  return adminSupabase().schema('analytics');
}
