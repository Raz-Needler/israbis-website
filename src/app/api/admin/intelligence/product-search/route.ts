/**
 * GET /api/admin/intelligence/product-search?q=<query>&limit=20
 *
 * Search product_prices by name substring or barcode. Returns the top-N
 * matching products with their price across every chain that stocks them.
 * Uses the trigram GIN index `idx_productprice_name_trgm` for fast name
 * search, or the barcode btree for exact barcode lookups.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, sessionCookieName } from '@/lib/admin/auth';
import { adminSupabase } from '@/lib/admin/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RawRow {
  barcode: string;
  product_name: string | null;
  chain_key: string;
  min_price: number;
  max_price: number;
  avg_price: number;
  store_count: number;
}

interface ProductHit {
  barcode: string;
  productName: string;
  chains: Array<{ chain: string; minPrice: number; maxPrice: number; avgPrice: number; storeCount: number }>;
  cheapestChain: string;
  cheapestPrice: number;
  mostExpensiveChain: string;
  mostExpensivePrice: number;
  priceSpread: number;  // most - cheap
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const limit = Math.max(1, Math.min(50, parseInt(url.searchParams.get('limit') ?? '15', 10)));
  if (!q || q.length < 2) {
    return NextResponse.json({ ok: true, hits: [], message: 'query_too_short' });
  }

  const sb = adminSupabase();
  const sqlEscape = q.replace(/'/g, "''");

  // Strategy:
  // 1. Find candidate barcodes via fast path — barcode exact match OR
  //    name-trigram (or falls back to ILIKE with small candidate set).
  // 2. Enrich each barcode with per-chain min/max/avg price.
  //
  // If the query looks like a barcode (digits only), skip the name search.
  const isBarcode = /^\d{5,}$/.test(q);

  // Two-phase query. Phase 1: find candidate barcodes fast. Phase 2: enrich
  // with per-chain prices. The earlier one-shot approach used
  // `DISTINCT ON (barcode) ORDER BY barcode, last_updated DESC` which forced
  // Postgres to sort every matching row before deduping — fine for common
  // terms like "חלב" but timing out on rarer ones like "עגבניה" because the
  // trigram index returned enough matches to blow past the 30s RPC budget.
  //
  // Phase 1 now uses a simple `LIMIT` (no ORDER BY, no DISTINCT) — the
  // trigram GIN index returns candidates fast and we de-duplicate barcodes
  // in JS. Over-fetching a bit (limit × 8) is cheap compared to a sort.
  const phase1Query = isBarcode
    ? `SELECT barcode FROM public.product_prices WHERE barcode = '${sqlEscape}' GROUP BY barcode LIMIT ${limit}`
    : `SELECT barcode FROM public.product_prices WHERE product_name ILIKE '%${sqlEscape}%' AND barcode IS NOT NULL AND price_nis IS NOT NULL AND price_nis > 0 LIMIT ${limit * 8}`;

  const phase1 = await sb.schema('admin').rpc('run_readonly_sql', { q: phase1Query, p: [] });
  if (phase1.error) {
    return NextResponse.json({ error: 'search_failed', detail: phase1.error.message }, { status: 500 });
  }

  const candidateSet = new Set<string>();
  for (const r of ((phase1.data as Array<{ barcode: string }> | null) ?? [])) {
    if (r.barcode) candidateSet.add(r.barcode);
    if (candidateSet.size >= limit) break;
  }
  if (candidateSet.size === 0) {
    return NextResponse.json({ ok: true, query: q, kind: isBarcode ? 'barcode' : 'name', count: 0, hits: [] });
  }

  // Phase 2: enrich. Barcode IN-list drives the indexed lookup.
  const barcodeList = Array.from(candidateSet).map(b => `'${b.replace(/'/g, "''")}'`).join(',');
  const phase2Query = `
    SELECT pp.barcode,
           (ARRAY_AGG(pp.product_name ORDER BY pp.last_updated DESC NULLS LAST))[1] AS product_name,
           pp.chain_key,
           MIN(pp.price_nis)::numeric(10,2) AS min_price,
           MAX(pp.price_nis)::numeric(10,2) AS max_price,
           AVG(pp.price_nis)::numeric(10,2) AS avg_price,
           COUNT(DISTINCT pp.store_id)::int AS store_count
    FROM public.product_prices pp
    WHERE pp.barcode IN (${barcodeList})
      AND pp.price_nis IS NOT NULL AND pp.price_nis > 0
    GROUP BY pp.barcode, pp.chain_key
  `;
  const { data, error } = await sb.schema('admin').rpc('run_readonly_sql', { q: phase2Query, p: [] });
  if (error) return NextResponse.json({ error: 'search_failed', detail: error.message }, { status: 500 });

  const rows = (data as unknown as RawRow[]) ?? [];
  const byBarcode = new Map<string, { productName: string; chains: Map<string, { min: number; max: number; avg: number; count: number }> }>();
  for (const r of rows) {
    const entry = byBarcode.get(r.barcode) ?? {
      productName: r.product_name ?? r.barcode,
      chains: new Map(),
    };
    entry.chains.set(r.chain_key.toUpperCase(), {
      min: Number(r.min_price),
      max: Number(r.max_price),
      avg: Number(r.avg_price),
      count: Number(r.store_count),
    });
    byBarcode.set(r.barcode, entry);
  }

  const hits: ProductHit[] = Array.from(byBarcode.entries()).map(([barcode, v]) => {
    const chains = Array.from(v.chains.entries()).map(([chain, p]) => ({
      chain,
      minPrice: p.min,
      maxPrice: p.max,
      avgPrice: p.avg,
      storeCount: p.count,
    }));
    chains.sort((a, b) => a.minPrice - b.minPrice);
    const cheapest = chains[0];
    const mostExp = chains[chains.length - 1];
    return {
      barcode,
      productName: v.productName,
      chains,
      cheapestChain: cheapest?.chain ?? '',
      cheapestPrice: cheapest?.minPrice ?? 0,
      mostExpensiveChain: mostExp?.chain ?? '',
      mostExpensivePrice: mostExp?.maxPrice ?? 0,
      priceSpread: Number(((mostExp?.maxPrice ?? 0) - (cheapest?.minPrice ?? 0)).toFixed(2)),
    };
  });

  // Sort by widest spread first — interesting products bubble up
  hits.sort((a, b) => b.priceSpread - a.priceSpread);

  return NextResponse.json({
    ok: true,
    query: q,
    kind: isBarcode ? 'barcode' : 'name',
    count: hits.length,
    hits: hits.slice(0, limit),
  });
}
