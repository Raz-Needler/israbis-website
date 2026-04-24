import { notFound } from 'next/navigation';
import { adminSupabase } from '@/lib/admin/supabase';
import { sql } from '@/lib/admin/sql';
import { profileFor, buildNarrative, CHAIN_PROFILES } from '@/lib/admin/chainProfiles';
import { ChainSelector } from '../_components/ChainSelector';
import { StoryCard } from '../_components/StoryCard';
import { CompetitorRadar } from '../_components/CompetitorRadar';
import { PricingMatrix } from '../_components/PricingMatrix';
import { BattlegroundList } from '../_components/BattlegroundList';
import { BasketBattle } from '../_components/BasketBattle';
import '../../admin.css';

export const dynamic = 'force-dynamic';

interface ChainCount { chain: string; n: number }
interface CityBattleground { city: string; chains: string[]; density: number }

export default async function IntelligenceChainPage(
  { params }: { params: Promise<{ chainKey: string }> }
) {
  const { chainKey: raw } = await params;
  const chainKey = String(raw ?? '').toUpperCase();
  if (!chainKey) notFound();

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

  const availableChains = chainsRanked.map(c => c.chain);

  const self = branchByChain.get(chainKey);
  const branchCount = self?.count ?? 0;
  const cityCount = self?.cities.size ?? 0;
  const rankByBranches = chainsRanked.findIndex(c => c.chain === chainKey) + 1 || chainsRanked.length + 1;

  const profile = profileFor(chainKey);

  // Battlegrounds
  const competitorSet = new Set(profile.topCompetitors.map(c => c.toUpperCase()));
  const battlegrounds: CityBattleground[] = [];
  if (self) {
    for (const city of self.cities) {
      const chainsInCity = cityChainMap.get(city);
      if (!chainsInCity) continue;
      const competitorsHere = Array.from(chainsInCity).filter(c => competitorSet.has(c));
      if (competitorsHere.length > 0) {
        battlegrounds.push({ city, chains: [chainKey, ...competitorsHere], density: chainsInCity.size });
      }
    }
    battlegrounds.sort((a, b) => b.density - a.density);
  }

  // Price position
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

  // Pricing matrix — top-20 widest-coverage barcodes. Threshold is 2+ chains
  // because real shelf-price data in this DB has sparse cross-chain overlap
  // (most barcodes appear in 1-2 chains, a handful reach 3+). When the target
  // chain itself lacks SKU data, we still show the matrix so the rival chains
  // have a story; the UI surfaces "not stocked" clearly for the target.
  const matrixRes = await sql<{
    barcode: string;
    product_name: string | null;
    chain_key: string;
    min_price: number;
  }>(`
    WITH top_barcodes AS (
      SELECT barcode
      FROM public.product_prices
      WHERE barcode IS NOT NULL AND price_nis IS NOT NULL AND price_nis > 0
      GROUP BY barcode
      HAVING COUNT(DISTINCT chain_key) >= 2
      ORDER BY COUNT(DISTINCT chain_key) DESC, COUNT(*) DESC
      LIMIT 20
    )
    SELECT pp.barcode,
           (ARRAY_AGG(pp.product_name ORDER BY pp.last_updated DESC NULLS LAST))[1] AS product_name,
           pp.chain_key,
           MIN(pp.price_nis)::numeric(10,2) AS min_price
    FROM public.product_prices pp
    JOIN top_barcodes tb USING (barcode)
    WHERE pp.price_nis IS NOT NULL AND pp.price_nis > 0
    GROUP BY pp.barcode, pp.chain_key
    ORDER BY pp.barcode, min_price ASC
  `);

  interface MatrixRow {
    barcode: string;
    productName: string;
    prices: Record<string, number>;
    winner: string;
    winnerPrice: number;
    selfPrice: number | null;
    selfDelta: number | null;
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

  const wins = matrix.filter(r => r.winner === chainKey).length;
  const losses = matrix.filter(r => r.selfPrice != null && r.winner !== chainKey).length;
  const missing = matrix.filter(r => r.selfPrice == null).length;
  const biggestLosses = matrix
    .filter(r => r.selfDelta != null && r.selfDelta > 0)
    .sort((a, b) => (b.selfDelta ?? 0) - (a.selfDelta ?? 0))
    .slice(0, 5);

  // Category buckets for narrative
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

  // Radar
  const coveragePct = chainsRanked[0]?.n ? Math.round((branchCount / chainsRanked[0].n) * 100) : 0;
  const pricePct = leaderByPrice && selfPrice && selfPrice.avg_price > 0
    ? Math.round((leaderByPrice.avg_price / selfPrice.avg_price) * 100)
    : 0;
  const assortmentPct = priceRows.length > 0
    ? Math.round(((selfPrice?.sku_count ?? 0) / Math.max(...priceRows.map(r => r.sku_count), 1)) * 100)
    : 0;
  const cityReachPct = chainsRanked[0] && branchByChain.get(chainsRanked[0].chain)
    ? Math.round((cityCount / Math.max(1, branchByChain.get(chainsRanked[0].chain)!.cities.size)) * 100)
    : 0;
  const winRatePct = Math.round((wins / Math.max(matrix.length, 1)) * 100);
  const radar = [
    { axis: 'Coverage',   value: coveragePct,   max: 100 },
    { axis: 'Price',      value: pricePct,      max: 100 },
    { axis: 'Assortment', value: assortmentPct, max: 100 },
    { axis: 'City reach', value: cityReachPct,  max: 100 },
    { axis: 'Win rate',   value: winRatePct,    max: 100 },
  ];

  const profileExists = !!CHAIN_PROFILES[chainKey];

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Chain Intelligence</h1>
          <p className="admin-sub">Tell the competitive story for any chain — the data decides.</p>
        </div>
        {!profileExists && (
          <span className="pill pill-neutral" style={{ fontSize: 11 }}>
            Profile not yet authored for {chainKey} — showing live data only
          </span>
        )}
      </header>

      <div style={{ marginBottom: 18 }}>
        <ChainSelector activeKey={chainKey} availableChains={availableChains} />
      </div>

      <StoryCard
        profile={profile}
        narrative={narrative}
        stats={{
          branchCount,
          cityCount,
          rankByBranches,
          totalChains: chainsRanked.length,
          skuCount: selfPrice?.sku_count ?? 0,
          avgShelfPrice: selfPrice?.avg_price ?? null,
          avgVsLeader,
        }}
      />

      <div style={twoColGridStyles}>
        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Competitive shape</div>
              <div className="admin-card-sub">5-axis snapshot vs market-best</div>
            </div>
          </div>
          <CompetitorRadar data={radar} color={profile.color} />
        </div>

        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Battleground cities</div>
              <div className="admin-card-sub">Where {profile.displayName} meets its rivals</div>
            </div>
          </div>
          <BattlegroundList targetChain={chainKey} battlegrounds={battlegrounds.slice(0, 10)} />
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 16 }}>
        <div className="admin-card-head">
          <div>
            <div className="admin-card-title">Basket Battle · live price simulator</div>
            <div className="admin-card-sub">
              Run a preset cart — or upload a real CSV — and watch the data decide who wins.
            </div>
          </div>
        </div>
        <BasketBattle chainKey={chainKey} />
      </div>

      <div className="admin-card" style={{ marginTop: 16 }}>
        <div className="admin-card-head">
          <div>
            <div className="admin-card-title">Pricing matrix · 20 common-basket SKUs</div>
            <div className="admin-card-sub">
              Widest-coverage barcodes in product_prices — the chain with the lowest shelf price per row wins that product.
            </div>
          </div>
        </div>
        <PricingMatrix
          chainKey={chainKey}
          matrix={matrix}
          summary={{ wins, losses, missing, biggestLosses }}
        />
      </div>
    </div>
  );
}

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

const twoColGridStyles: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16,
};
