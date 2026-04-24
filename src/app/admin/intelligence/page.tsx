import { redirect } from 'next/navigation';
import { adminSupabase } from '@/lib/admin/supabase';

export const dynamic = 'force-dynamic';

/**
 * /admin/intelligence → pick the chain with the most branches and redirect to it.
 * Falls back to YOCHANANOF (the Raz/IsraBis focus chain) if the query fails.
 */
export default async function IntelligenceIndex() {
  let top = 'YOCHANANOF';
  try {
    const sb = adminSupabase();
    const res = await sb.from('store_branches').select('chain_key');
    type Row = { chain_key: string | null };
    const rows = (res.data as Row[] | null) ?? [];

    const counts = new Map<string, number>();
    for (const r of rows) {
      const k = (r.chain_key ?? '').toUpperCase();
      if (!k) continue;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    top = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'YOCHANANOF';
  } catch { /* fall through to default */ }

  redirect(`/admin/intelligence/${encodeURIComponent(top)}`);
}
