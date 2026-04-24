/**
 * GET /api/admin/intelligence/[chainKey]/overview
 *
 * Returns the live competitive snapshot for a single chain:
 *   - branch + city counts, rank among all chains
 *   - price-band position vs market (avg shelf price across product_prices)
 *   - top competitor cities (where this chain shares geography with rivals)
 *   - pricing wins / losses (categories / products where the chain beats or loses to the market)
 *   - a narrative paragraph built from static profile + live numbers
 *
 * Static strategic metadata (archetype, positioning) is layered on top from
 * chainProfiles.ts — so the page can tell a coherent story even before
 * analytics events are flowing.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, sessionCookieName } from '@/lib/admin/auth';
import { adminSupabase } from '@/lib/admin/supabase';
import { sql } from '@/lib/admin/sql';
import { profileFor, buildNarrative } from '@/lib/admin/chainProfiles';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChainCount { chain: string; n: number }
interface CityBattleground { city: string; chains: string[]; density: number }

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chainKey: string }> }
) {
  const token = req.cookies.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { chainKey: raw } = await params;
  const chainKey = String(raw ?? '').toUpperCase();
  if (!chainKey) return NextResponse.json({ error: 'chain_required' }, { status: 400 });

  const sb = adminSupabase();

  // --- Branches + cities ---
  const branchRes = await sb.from('store_branches').select('chain_key, city');
  type BranchRow = { chain_key: string | null; city: string | null };
  const branches = (branchRes.data as BranchRow[] | null) ?? [];

  const branchByChain = new Map<string, { count: number; cities: Set<string> }>();
  const cityChainMap = new Map<string, Set<string>>();
  for (const b of branches) {
    const chain = (b.chain_key ?? 'UNKNOWN').toUpperCase();
    const city = (b.city ?? '').trim();
    const entry = branchByChain.get(chain) ?? { count: 0, cities: new Set() };
    entry.count += 1;
    if (city) entry.cities.add(city);
    branchByChain.set(chain, entry);
    if (city) {
      const set = cityChainMap.get(city) ?? new Set();
      set.add(chain);
      cityChainMap.set(city, set);
    }
  }

  const chainsRanked: ChainCount[] = Array.from(branchByChain.entries())
    .map(([chain, v]) => ({ chain, n: v.count }))
    .sort((a, b) => b.n - a.n);

  const self = branchByChain.get(chainKey);
  const branchCount = self?.count ?? 0;
  const cityCount = self?.cities.size ?? 0;
  const rankByBranches = chainsRanked.findIndex(c => c.chain === chainKey) + 1 || chainsRanked.length + 1;

  // --- Battleground cities: where this chain and its profile competitors overlap ---
  const profile = profileFor(chainKey);
  const competitorSet = new Set(profile.topCompetitors.map(c => c.toUpperCase()));
  const battlegrounds: CityBattleground[] = [];
  if (self) {
    for (const city of self.cities) {
      const chainsInCity = cityChainMap.get(city);
      if (!chainsInCity) continue;
      const competitorsHere = Array.from(chainsInCity).filter(c => competitorSet.has(c));
      if (competitorsHere.length > 0) {
        battlegrounds.push({
          city,
          chains: [chainKey, ...competitorsHere],
          density: chainsInCity.size,
        });
      }
    }
    battlegrounds.sort((a, b) => b.density - a.density);
  }

  // --- Price position vs market (avg shelf price) ---
  const priceRes = await sql<{ chain: string; avg_price: number; sku_count: number }>(`
    SELECT chain_key AS chain,
           AVG(price_nis)::numeric(10,2) AS avg_price,
           COUNT(*)::int AS sku_count
    FROM public.product_prices
    WHERE price_nis IS NOT NULL AND price_nis > 0
    GROUP BY chain_key
    ORDER BY sku_count DESC
  `);
  const priceRows = priceRes.rows.map(r => ({
    chain: r.chain.toUpperCase(),
    avg_price: Number(r.avg_price),
    sku_count: Number(r.sku_count),
  }));
  const leaderByPrice = [...priceRows].sort((a, b) => a.avg_price - b.avg_price)[0] ?? null;
  const selfPrice = priceRows.find(r => r.chain === chainKey) ?? null;
  const avgVsLeader = selfPrice && leaderByPrice
    ? Number((selfPrice.avg_price - leaderByPrice.avg_price).toFixed(2))
    : 0;

  // --- 20 common-basket barcodes: who wins each? ---
  // Pick 20 barcodes with the widest chain coverage to form a fair matrix.
  const matrixRes = await sql<{
    barcode: string;
    product_name: string | null;
    chain_key: string;
    min_price: number;
    chain_count: number;
  }>(`
    WITH top_barcodes AS (
      SELECT barcode
      FROM public.product_prices
      WHERE barcode IS NOT NULL AND price_nis IS NOT NULL AND price_nis > 0
      GROUP BY barcode
      HAVING COUNT(DISTINCT chain_key) >= 3
      ORDER BY COUNT(DISTINCT chain_key) DESC, COUNT(*) DESC
      LIMIT 20
    )
    SELECT pp.barcode,
           (ARRAY_AGG(pp.product_name ORDER BY pp.last_updated DESC NULLS LAST))[1] AS product_name,
           pp.chain_key,
           MIN(pp.price_nis)::numeric(10,2) AS min_price,
           (SELECT COUNT(DISTINCT chain_key) FROM public.product_prices WHERE barcode = pp.barcode) AS chain_count
    FROM public.product_prices pp
    JOIN top_barcodes tb USING (barcode)
    WHERE pp.price_nis IS NOT NULL AND pp.price_nis > 0
    GROUP BY pp.barcode, pp.chain_key
    ORDER BY pp.barcode, min_price ASC
  `);

  // Build matrix: barcode → { product_name, prices: chain → price, winner, selfPrice, selfDelta }
  interface MatrixRow {
    barcode: string;
    productName: string;
    prices: Record<string, number>;
    winner: string;
    winnerPrice: number;
    selfPrice: number | null;
    selfDelta: number | null;  // positive = target overpriced
    selfRank: number | null;
  }
  const byBarcode = new Map<string, MatrixRow>();
  for (const r of matrixRes.rows) {
    const chain = r.chain_key.toUpperCase();
    const price = Number(r.min_price);
    const entry = byBarcode.get(r.barcode) ?? {
      barcode: r.barcode,
      productName: r.product_name ?? r.barcode,
      prices: {},
      winner: '',
      winnerPrice: Infinity,
      selfPrice: null,
      selfDelta: null,
      selfRank: null,
    };
    entry.prices[chain] = price;
    if (price < entry.winnerPrice) {
      entry.winnerPrice = price;
      entry.winner = chain;
    }
    byBarcode.set(r.barcode, entry);
  }
  const matrix: MatrixRow[] = [];
  for (const row of byBarcode.values()) {
    row.selfPrice = row.prices[chainKey] ?? null;
    if (row.selfPrice != null) {
      row.selfDelta = Number((row.selfPrice - row.winnerPrice).toFixed(2));
      const sorted = Object.entries(row.prices).sort((a, b) => a[1] - b[1]);
      row.selfRank = sorted.findIndex(([c]) => c === chainKey) + 1 || null;
    }
    matrix.push(row);
  }
  matrix.sort((a, b) => a.productName.localeCompare(b.productName));

  // --- Wins / losses derived from matrix ---
  const wins = matrix.filter(r => r.winner === chainKey).length;
  const losses = matrix.filter(r => r.selfPrice != null && r.winner !== chainKey).length;
  const missing = matrix.filter(r => r.selfPrice == null).length;

  const biggestLosses = matrix
    .filter(r => r.selfDelta != null && r.selfDelta > 0)
    .sort((a, b) => (b.selfDelta ?? 0) - (a.selfDelta ?? 0))
    .slice(0, 5);

  // --- Best/worst category string (crude — uses product_name keyword bucket) ---
  const categoryBuckets: Record<string, { delta: number; count: number }> = {};
  for (const r of matrix) {
    if (r.selfDelta == null) continue;
    const cat = bucketOfName(r.productName);
    const b = categoryBuckets[cat] ?? { delta: 0, count: 0 };
    b.delta += r.selfDelta;
    b.count += 1;
    categoryBuckets[cat] = b;
  }
  const catAverages = Object.entries(categoryBuckets)
    .filter(([, v]) => v.count > 0)
    .map(([cat, v]) => ({ cat, avgDelta: v.delta / v.count }));
  catAverages.sort((a, b) => a.avgDelta - b.avgDelta);
  const bestCategory = catAverages[0]?.cat ?? 'general';
  const worstCategory = catAverages[catAverages.length - 1]?.cat ?? 'general';

  // --- Narrative ---
  const narrative = buildNarrative({
    chainKey,
    branchCount,
    cityCount,
    rankByBranches,
    totalChains: chainsRanked.length,
    avgBasketVsLeader: avgVsLeader,
    bestCategory,
    worstCategory,
    topCompetitorCity: battlegrounds[0]?.city,
    topCompetitorChain: battlegrounds[0]?.chains.find(c => c !== chainKey),
  });

  // --- Radar axes (all normalized 0-100 vs the best chain) ---
  const coveragePct = chainsRanked[0]?.n
    ? Math.round((branchCount / chainsRanked[0].n) * 100)
    : 0;
  const pricePct = leaderByPrice && selfPrice && selfPrice.avg_price > 0
    ? Math.round((leaderByPrice.avg_price / selfPrice.avg_price) * 100)
    : 0;
  const assortmentPct = priceRows.length > 0
    ? Math.round(((selfPrice?.sku_count ?? 0) / Math.max(...priceRows.map(r => r.sku_count), 1)) * 100)
    : 0;
  const cityReachPct = chainsRanked[0] && branchByChain.get(chainsRanked[0].chain)
    ? Math.round((cityCount / Math.max(1, branchByChain.get(chainsRanked[0].chain)!.cities.size)) * 100)
    : 0;
  const matrixWinsTotal = matrix.length || 1;
  const winRatePct = Math.round((wins / matrixWinsTotal) * 100);

  const radar = [
    { axis: 'Coverage',    value: coveragePct,    max: 100 },
    { axis: 'Price',       value: pricePct,       max: 100 },
    { axis: 'Assortment',  value: assortmentPct,  max: 100 },
    { axis: 'City reach',  value: cityReachPct,   max: 100 },
    { axis: 'Win rate',    value: winRatePct,     max: 100 },
  ];

  return NextResponse.json({
    ok: true,
    chainKey,
    profile,
    narrative,
    stats: {
      branchCount,
      cityCount,
      rankByBranches,
      totalChains: chainsRanked.length,
      skuCount: selfPrice?.sku_count ?? 0,
      avgShelfPrice: selfPrice?.avg_price ?? null,
      avgVsLeader,
      leaderByPrice,
    },
    radar,
    battlegrounds: battlegrounds.slice(0, 12),
    priceRows,
    matrix,
    matrixSummary: { wins, losses, missing, biggestLosses },
    chainsRanked,
  });
}

/**
 * Crude Hebrew/English keyword bucket. We don't have a categories table for
 * product_prices — this is just enough to tell a story.
 */
function bucketOfName(name: string): string {
  const s = name.toLowerCase();
  if (/חלב|גבינה|יוגורט|שמנת|milk|cheese|yogurt|dairy/.test(s)) return 'dairy';
  if (/עוף|בשר|שוק|chicken|beef|meat|turkey/.test(s)) return 'meat';
  if (/לחם|חלה|פיתה|bread|challah|pita/.test(s)) return 'bakery';
  if (/מלפפון|עגבניה|בצל|תפוח|פרי|ירק|tomato|cucumber|onion|fruit|vegetable|produce/.test(s)) return 'produce';
  if (/יין|בירה|משקה|wine|beer|juice|drink/.test(s)) return 'beverages';
  if (/שמן|סוכר|אורז|פסטה|oil|sugar|rice|pasta|flour/.test(s)) return 'pantry';
  if (/שוקולד|עוגה|ממתק|chocolate|cake|candy|snack|cookie/.test(s)) return 'sweets';
  if (/ביצה|ביצים|egg/.test(s)) return 'eggs';
  return 'general';
}
