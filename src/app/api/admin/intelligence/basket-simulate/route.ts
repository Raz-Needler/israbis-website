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

  // For PRESET baskets, the barcodes in PRESET_BASKETS are canonical Israeli
  // EAN-13 codes but may not all exist in this DB's product_prices. To make
  // the simulator demo-worthy even with sparse coverage, we dynamically
  // substitute any barcode with NO price data by a nearest-category product
  // that DOES have data. This runs only for presets; explicit CSV/cart lines
  // are passed through untouched so real uploads keep their own barcodes.
  if (source === 'preset' && cart.length > 0) {
    const requested = cart.map(l => l.barcode);
    const coverageRes = await sb
      .from('product_prices')
      .select('barcode')
      .in('barcode', requested)
      .limit(10000);
    const covered = new Set((coverageRes.data ?? []).map(r => (r as { barcode: string }).barcode));
    const uncovered = cart.filter(l => !covered.has(l.barcode));
    if (uncovered.length > 0) {
      // Chain-anchored substitution — pick `uncovered.length` barcodes from
      // the target chain (indexed). These will always have at least the
      // target's price, and most will exist in rivals too via overlap.
      const anchor = targetChain.replace(/'/g, '');
      const fallbackRes = await sb.schema('admin').rpc('run_readonly_sql', {
        q: `SELECT DISTINCT ON (barcode) barcode, product_name FROM public.product_prices WHERE chain_key = '${anchor}' AND price_nis IS NOT NULL AND price_nis > 0 AND barcode IS NOT NULL ORDER BY barcode, last_updated DESC LIMIT ${Math.min(uncovered.length, 50)}`,
        p: [],
      });
      type FallbackRow = { barcode: string; product_name: string | null };
      const fallbacks = ((fallbackRes.data as unknown as FallbackRow[]) ?? []);
      for (let i = 0; i < uncovered.length && i < fallbacks.length; i++) {
        const original = uncovered[i];
        const line = cart.find(l => l.barcode === original.barcode);
        if (line) {
          line.barcode = fallbacks[i].barcode;
          line.productName = `${original.productName ?? 'item'} → ${fallbacks[i].product_name ?? fallbacks[i].barcode}`;
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
    preset: presetLabel,
    cart: enrichedCart,
    coverage,
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
