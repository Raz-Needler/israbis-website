/**
 * POST /api/admin/intelligence/basket-simulate
 *
 * Body:
 *   {
 *     targetChain: string,
 *     cart?: Array<{ barcode: string; quantity: number; productName?: string }>,
 *     presetKey?: keyof typeof PRESET_BASKETS,
 *     csv?: string,
 *     scenario?: { userCount?: number; conversionPct?: number }
 *   }
 *
 * Resolves the cart (from explicit lines, a preset, or a CSV upload), queries
 * public.product_prices for the most-recent price of each barcode per chain,
 * and runs the basket-battle algorithm to return a full competitive breakdown.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, sessionCookieName } from '@/lib/admin/auth';
import { adminSupabase } from '@/lib/admin/supabase';
import { audit } from '@/lib/admin/audit';
import {
  runBasketBattle,
  parseCartCsv,
  PRESET_BASKETS,
  type CartLine,
  type PriceMap,
} from '@/lib/admin/basketAlgorithm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface BodyIn {
  targetChain?: string;
  cart?: CartLine[];
  presetKey?: string;
  csv?: string;
  scenario?: { userCount?: number; conversionPct?: number };
  /**
   * 'strict' → never substitute. Missing barcodes stay missing.
   *             CSV uploads default to strict.
   * 'fair'   → retry with substitution until every line has ≥3-chain coverage.
   *             Presets default to fair.
   */
  mode?: 'strict' | 'fair';
  /** Minimum chain coverage per line to accept in fair mode (default 3). */
  minChainsPerItem?: number;
}

interface ItemCoverage {
  barcode: string;
  productName: string;
  quantity: number;
  originalBarcode?: string;          // set if the barcode was substituted
  substituted: boolean;
  chainCount: number;                // how many chains carry this item
  chainsWithPrice: string[];         // the chain keys that carry it
  missingFromTarget: boolean;        // target chain doesn't stock this
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: BodyIn;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad_body' }, { status: 400 }); }

  const targetChain = String(body.targetChain ?? '').trim().toUpperCase();
  if (!targetChain) return NextResponse.json({ error: 'target_chain_required' }, { status: 400 });

  // Resolve cart
  let cart: CartLine[] = [];
  let source: 'explicit' | 'preset' | 'csv' = 'explicit';
  let presetLabel: string | undefined;

  if (Array.isArray(body.cart) && body.cart.length > 0) {
    cart = body.cart.filter(l => l && typeof l.barcode === 'string' && Number.isFinite(l.quantity) && l.quantity > 0);
    source = 'explicit';
  } else if (body.presetKey && PRESET_BASKETS[body.presetKey]) {
    const p = PRESET_BASKETS[body.presetKey];
    cart = p.lines.map(l => ({ ...l }));
    presetLabel = p.label;
    source = 'preset';
  } else if (typeof body.csv === 'string' && body.csv.trim().length > 0) {
    cart = parseCartCsv(body.csv);
    source = 'csv';
  }

  if (cart.length === 0) return NextResponse.json({ error: 'empty_cart' }, { status: 400 });
  if (cart.length > 200) return NextResponse.json({ error: 'cart_too_large', max: 200 }, { status: 400 });

  const started = Date.now();
  const sb = adminSupabase();

  // Mode: strict vs fair trade.
  // - strict: never substitute. If user supplied the cart they get the truth.
  // - fair:   retry substitution until every line has ≥ minChainsPerItem
  //           of chain coverage OR we've used up the pool of anchor barcodes.
  //           Ensures an apples-to-apples comparison.
  const mode: 'strict' | 'fair' =
    body.mode === 'strict' ? 'strict' :
    body.mode === 'fair'   ? 'fair' :
    (source === 'preset' ? 'fair' : 'strict');
  const minChainsPerItem = clampInt(body.minChainsPerItem, 1, 10, 3);

  // Track substitutions for the response
  const substitutions: Array<{ from: string; to: string; fromName?: string; toName?: string }> = [];

  async function countChainsForBarcodes(bcs: string[]): Promise<Map<string, Set<string>>> {
    if (bcs.length === 0) return new Map();
    const res = await sb
      .from('product_prices')
      .select('barcode, chain_key')
      .in('barcode', bcs)
      .limit(20000);
    const out = new Map<string, Set<string>>();
    for (const row of ((res.data ?? []) as Array<{ barcode: string; chain_key: string | null }>)) {
      if (!row.barcode || !row.chain_key) continue;
      if (!out.has(row.barcode)) out.set(row.barcode, new Set());
      out.get(row.barcode)!.add(row.chain_key.toUpperCase());
    }
    return out;
  }

  if (mode === 'fair' && cart.length > 0) {
    // Anchor pool: a big bucket of barcodes from the target chain we can
    // draw substitutes from. Use DISTINCT-ON fast path.
    const anchorKey = targetChain.replace(/'/g, '');
    const poolRes = await sb.schema('admin').rpc('run_readonly_sql', {
      q: `SELECT DISTINCT ON (barcode) barcode, product_name FROM public.product_prices WHERE chain_key = '${anchorKey}' AND price_nis IS NOT NULL AND price_nis > 0 AND barcode IS NOT NULL ORDER BY barcode, last_updated DESC LIMIT 200`,
      p: [],
    });
    type Pool = Array<{ barcode: string; product_name: string | null }>;
    const pool = ((poolRes.data as unknown as Pool) ?? []).slice();
    const usedBarcodes = new Set(cart.map(l => l.barcode));

    // Retry loop: up to 3 passes. Each pass, any line that still has fewer
    // than `minChainsPerItem` chain matches gets swapped with a fresh
    // barcode from the pool and re-checked on the next pass.
    for (let pass = 0; pass < 3; pass++) {
      const counts = await countChainsForBarcodes(cart.map(l => l.barcode));
      const needsSwap: number[] = [];
      cart.forEach((l, i) => {
        const n = counts.get(l.barcode)?.size ?? 0;
        if (n < minChainsPerItem) needsSwap.push(i);
      });
      if (needsSwap.length === 0) break;

      for (const idx of needsSwap) {
        // Find a pool barcode that (a) isn't already in the cart and (b) has
        // at least minChainsPerItem of chain coverage — we verify the second
        // condition on the next pass's counts check.
        while (pool.length > 0) {
          const candidate = pool.shift()!;
          if (usedBarcodes.has(candidate.barcode)) continue;
          const originalBc = cart[idx].originalBarcode ?? cart[idx].barcode;
          const originalName = cart[idx].productName;
          substitutions.push({
            from: originalBc,
            to:   candidate.barcode,
            fromName: originalName,
            toName:   candidate.product_name ?? candidate.barcode,
          });
          cart[idx] = {
            ...cart[idx],
            originalBarcode: originalBc,
            barcode: candidate.barcode,
            productName: candidate.product_name ?? cart[idx].productName,
          };
          usedBarcodes.add(candidate.barcode);
          break;
        }
      }
    }
  }

  const barcodes = Array.from(new Set(cart.map(l => l.barcode)));

  // Fetch the latest price per (barcode, chain_key) across the cart's barcodes.
  // product_prices has many rows per (barcode, chain, store) — collapse to min-by-chain.
  const { data, error } = await sb
    .from('product_prices')
    .select('barcode, chain_key, price_nis, product_name, last_updated')
    .in('barcode', barcodes)
    .limit(50000);

  if (error) return NextResponse.json({ error: 'price_fetch_failed', detail: error.message }, { status: 500 });

  type PriceRow = { barcode: string; chain_key: string | null; price_nis: number | null; product_name: string | null };
  const rows = (data as PriceRow[] | null) ?? [];

  // Build priceMap: barcode → chain → lowest price (most competitive branch wins)
  const priceMap: PriceMap = {};
  const nameMap: Record<string, string> = {};
  for (const r of rows) {
    if (!r.chain_key || r.price_nis == null || !Number.isFinite(Number(r.price_nis))) continue;
    const chain = r.chain_key.toUpperCase();
    const price = Number(r.price_nis);
    priceMap[r.barcode] = priceMap[r.barcode] ?? {};
    const current = priceMap[r.barcode][chain];
    if (current == null || price < current) priceMap[r.barcode][chain] = price;
    if (!nameMap[r.barcode] && r.product_name) nameMap[r.barcode] = r.product_name;
  }

  // Backfill productName from DB if cart didn't provide one
  const enrichedCart: CartLine[] = cart.map(l => ({
    ...l,
    productName: l.productName || nameMap[l.barcode] || l.barcode,
  }));

  const scenario = {
    userCount: clampInt(body.scenario?.userCount, 100, 10_000_000, 10000),
    conversionPct: clampFloat(body.scenario?.conversionPct, 0.1, 100, 15),
  };

  const battle = runBasketBattle(enrichedCart, priceMap, targetChain, scenario);

  // Extra telemetry: how many barcodes had any price data at all
  const coverage = {
    barcodes_in_cart: barcodes.length,
    barcodes_with_any_price: barcodes.filter(b => priceMap[b] && Object.keys(priceMap[b]).length > 0).length,
    chains_observed: new Set(
      Object.values(priceMap).flatMap(m => Object.keys(m))
    ).size,
  };

  // Per-item coverage map — one row per cart line showing exactly which
  // chains carry it and whether it's missing from the target. This is what
  // drives the basket simulator's "advanced mode" per-line panel in the UI.
  const itemCoverage: ItemCoverage[] = enrichedCart.map(line => {
    const prices = priceMap[line.barcode] ?? {};
    const chainsWithPrice = Object.keys(prices);
    return {
      barcode:          line.barcode,
      productName:      line.productName ?? line.barcode,
      quantity:         line.quantity,
      originalBarcode:  line.originalBarcode,
      substituted:      !!line.originalBarcode && line.originalBarcode !== line.barcode,
      chainCount:       chainsWithPrice.length,
      chainsWithPrice,
      missingFromTarget: !chainsWithPrice.includes(targetChain),
    };
  });

  await audit({
    adminUserId: claims.sub,
    action: 'admin.intel_basket_simulate',
    targetType: 'chain',
    targetId: targetChain,
    metadata: {
      source,
      preset: presetLabel,
      cart_size: cart.length,
      duration_ms: Date.now() - started,
      winner: battle.winner,
      target_rank: battle.targetRank,
    },
  });

  return NextResponse.json({
    ok: true,
    duration_ms: Date.now() - started,
    source,
    mode,
    preset: presetLabel,
    cart: enrichedCart,
    coverage,
    item_coverage: itemCoverage,
    substitutions,
    min_chains_per_item: minChainsPerItem,
    scenario,
    battle,
  });
}

function clampInt(v: unknown, lo: number, hi: number, fallback: number): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(lo, Math.min(hi, Math.round(n)));
}
function clampFloat(v: unknown, lo: number, hi: number, fallback: number): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(lo, Math.min(hi, n));
}
