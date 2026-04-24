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
import { IntelligenceHero } from '../_components/IntelligenceHero';
import { ReceiptCompare } from '../_components/ReceiptCompare';
import { DefectionAnalysis, type DefectionRow } from '../_components/DefectionAnalysis';
import { BranchMap, type BranchPoint } from '../_components/BranchMap';
import { ProductExplorer } from '../_components/ProductExplorer';
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

  // --- Branches + cities + lat/lng ---
  const branchRes = await sb.from('store_branches').select('chain_key, city, lat, lng, name');
  type BranchRow = { chain_key: string | null; city: string | null; lat: number | null; lng: number | null; name: string | null };
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

  // Branch points for the map — target + top-3 competitors only so the map
  // stays readable.
  const targetBranchPoints: BranchPoint[] = branches
    .filter(b => (b.chain_key ?? '').toUpperCase() === chainKey && typeof b.lat === 'number' && typeof b.lng === 'number')
    .map(b => ({ chainKey, city: b.city ?? '', lat: b.lat as number, lng: b.lng as number, name: b.name ?? undefined }));
  const topCompetitorKeys = chainsRanked
    .map(c => c.chain)
    .filter(c => c !== chainKey && (profile.topCompetitors as string[]).includes(c))
    .slice(0, 3);
  const competitorBranchPoints: BranchPoint[] = branches
    .filter(b => topCompetitorKeys.includes((b.chain_key ?? '').toUpperCase()) && typeof b.lat === 'number' && typeof b.lng === 'number')
    .map(b => ({ chainKey: (b.chain_key ?? '').toUpperCase(), city: b.city ?? '', lat: b.lat as number, lng: b.lng as number, name: b.name ?? undefined }));

  // Defection analysis — who did users choose OVER the target chain?
  // Uses analytics.fact_intent_basket which logs every compared basket.
  // Per-rival defection stats. The `sample_city` subquery here correlates
  // to the actual rival — it picks the most common city of users who
  // defected specifically to THAT rival, not a random city from the whole
  // defection population (the prior version had an unscoped CTE join that
  // returned a random-looking city regardless of rival).
  const defectionAgg = await sql<{
    to_chain: string;
    baskets_lost: number;
    avg_delta_nis: number;
    total_delta_nis: number;
    sample_city: string | null;
  }>(`
    WITH defections AS (
      SELECT fb.user_chose_chain AS to_chain,
             fb.delta_nis_vs_cheapest,
             fb.user_id
      FROM analytics.fact_intent_basket fb
      WHERE fb.total_nis_by_chain ? '${chainKey.replace(/'/g, '')}'
        AND fb.user_chose_chain IS NOT NULL
        AND fb.user_chose_chain <> '${chainKey.replace(/'/g, '')}'
        AND fb.eventually_purchased = true
    ),
    cities_per_rival AS (
      SELECT d.to_chain, up.location_city, COUNT(*) AS n
      FROM defections d
      JOIN public.user_preferences up ON up.user_id = d.user_id
      WHERE up.location_city IS NOT NULL
      GROUP BY d.to_chain, up.location_city
    ),
    top_city_per_rival AS (
      SELECT DISTINCT ON (to_chain) to_chain, location_city
      FROM cities_per_rival
      ORDER BY to_chain, n DESC
    )
    SELECT d.to_chain,
           COUNT(*)::int AS baskets_lost,
           AVG(d.delta_nis_vs_cheapest)::numeric(10,2) AS avg_delta_nis,
           SUM(d.delta_nis_vs_cheapest)::numeric(12,2) AS total_delta_nis,
           tc.location_city AS sample_city
    FROM defections d
    LEFT JOIN top_city_per_rival tc USING (to_chain)
    GROUP BY d.to_chain, tc.location_city
    ORDER BY baskets_lost DESC
    LIMIT 10
  `);
  const defectedByChain: DefectionRow[] = defectionAgg.rows.map(r => ({
    toChain: r.to_chain,
    baskets_lost: Number(r.baskets_lost),
    avg_delta_nis: Number(r.avg_delta_nis),
    total_delta_nis: Number(r.total_delta_nis),
    sample_city: r.sample_city,
  }));

  const basketStatsRes = await sql<{
    compared_total: number;
    chose_cheapest_total: number;
    defected_total: number;
  }>(`
    SELECT
      COUNT(*)::int AS compared_total,
      COUNT(*) FILTER (WHERE chose_cheapest = true)::int AS chose_cheapest_total,
      COUNT(*) FILTER (WHERE user_chose_chain IS NOT NULL AND user_chose_chain <> '${chainKey.replace(/'/g, '')}' AND eventually_purchased = true)::int AS defected_total
    FROM analytics.fact_intent_basket
    WHERE total_nis_by_chain ? '${chainKey.replace(/'/g, '')}'
  `);
  const basketStats = basketStatsRes.rows[0] ?? { compared_total: 0, chose_cheapest_total: 0, defected_total: 0 };
  const totalDefectionNis = defectedByChain.reduce((s, r) => s + r.total_delta_nis, 0);

  // Price position — stratified per-chain query. Earlier we used a single
  // "100k most-recently-updated rows" sample, but it turned out one chain's
  // bulk import could fill the entire sample, leaving rivals with zero rows.
  // Instead we run one AVG/COUNT per chain in chainsRanked, using the indexed
  // chain_key path. 14 chains × ~200ms each = ~2s total, bounded and predictable.
  const priceRows: Array<{ chain: string; avg_price: number; sku_count: number }> = [];
  const chainsToQuery = Array.from(new Set([chainKey, ...chainsRanked.map(c => c.chain)])).slice(0, 20);
  const priceResults = await Promise.all(
    chainsToQuery.map(ch =>
      sql<{ avg_price: number; sku_count: number }>(`
        SELECT AVG(price_nis)::numeric(10,2) AS avg_price,
               COUNT(*)::int AS sku_count
        FROM public.product_prices
        WHERE chain_key = '${ch.replace(/'/g, '')}'
          AND price_nis IS NOT NULL AND price_nis > 0
        LIMIT 1
      `)
    )
  );
  priceResults.forEach((res, idx) => {
    const row = res.rows[0];
    if (row && row.sku_count > 0) {
      priceRows.push({
        chain: chainsToQuery[idx],
        avg_price: Number(row.avg_price),
        sku_count: Number(row.sku_count),
      });
    }
  });
  priceRows.sort((a, b) => b.sku_count - a.sku_count);

  const leaderByPrice = [...priceRows].sort((a, b) => a.avg_price - b.avg_price)[0] ?? null;
  const selfPrice = priceRows.find(r => r.chain === chainKey) ?? null;
  const avgVsLeader = selfPrice && leaderByPrice
    ? Number((selfPrice.avg_price - leaderByPrice.avg_price).toFixed(2))
    : 0;

  // Pricing matrix — chain-anchored to survive the 4.5M-row product_prices
  // table without timing out. We sample 30 barcodes from whichever chain has
  // the deepest catalog (indexed via `product_prices_chain_key_store_id_idx`),
  // then enrich each barcode's prices across every other chain. The original
  // "widest-coverage barcodes" query used `GROUP BY barcode` over the full
  // table which scanned 4.5M rows and always hit the 30s RPC timeout.
  const anchorChain = chainsRanked.find(c => c.chain === chainKey) ? chainKey : (chainsRanked[0]?.chain ?? 'RAMI_LEVY');
  const matrixRes = await sql<{
    barcode: string;
    product_name: string | null;
    chain_key: string;
    min_price: number;
  }>(`
    WITH sample AS (
      SELECT DISTINCT ON (barcode) barcode, product_name
      FROM public.product_prices
      WHERE chain_key = '${anchorChain.replace(/'/g, "")}'
        AND price_nis IS NOT NULL AND price_nis > 0
        AND barcode IS NOT NULL
      ORDER BY barcode, last_updated DESC
      LIMIT 40
    )
    SELECT pp.barcode,
           (ARRAY_AGG(pp.product_name ORDER BY pp.last_updated DESC NULLS LAST))[1] AS product_name,
           pp.chain_key,
           MIN(pp.price_nis)::numeric(10,2) AS min_price
    FROM public.product_prices pp
    JOIN sample USING (barcode)
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

  // Wins count any row where target's price equals the winning (minimum) price,
  // INCLUDING ties. The prior `r.winner === chainKey` approach was ordering-
  // dependent: if target and a rival both charged ₪10, the row's `winner` got
  // set to whichever chain was processed first in the by-barcode loop, so
  // target's win count silently undercounted ties.
  const wins = matrix.filter(r => r.selfPrice != null && r.winnerPrice !== Infinity && r.selfPrice <= r.winnerPrice).length;
  const losses = matrix.filter(r => r.selfPrice != null && r.winnerPrice !== Infinity && r.selfPrice > r.winnerPrice).length;
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

  // Receipt-compare dataset: pick the matrix rows where target loses, sorted
  // by biggest delta first. Use the top-coverage basket (up to 10 items).
  const overallWinner = matrix.length > 0
    ? matrix.reduce<Record<string, { count: number; firstChain: string }>>((acc, r) => {
        acc[r.winner] = acc[r.winner] ?? { count: 0, firstChain: r.winner };
        acc[r.winner].count += 1;
        return acc;
      }, {})
    : {};
  const winnerChainKey = Object.entries(overallWinner).sort((a, b) => b[1].count - a[1].count)[0]?.[0] ?? chainKey;

  // Receipt compare — ONLY rows where both target AND a winner have real prices.
  // Anything else would be comparing apples to oranges (one side would need a
  // fake backup price), which silently inflates whichever side lacks the SKU.
  // Sort by biggest delta first so the hero line items lead with the most
  // damaging gaps.
  const receiptRows = matrix
    .filter(r => r.selfPrice != null && r.winnerPrice !== Infinity && r.winnerPrice != null)
    .slice()
    .sort((a, b) => {
      const da = (a.selfPrice ?? 0) - a.winnerPrice;
      const db = (b.selfPrice ?? 0) - b.winnerPrice;
      return db - da;
    })
    .slice(0, 10)
    .map(r => ({
      productName: r.productName,
      barcode: r.barcode,
      targetPrice: r.selfPrice,
      winnerPrice: r.winnerPrice,
      winnerChain: r.winner,
    }));
  // Both totals sum the SAME set of products — now an apples-to-apples receipt.
  const basketTotalTarget = receiptRows.reduce((s, r) => s + (r.targetPrice ?? 0), 0);
  const basketTotalWinner = receiptRows.reduce((s, r) => {
    // Winner is defined per-row; if it's the target itself, use target price.
    return s + (r.winnerChain === chainKey ? (r.targetPrice ?? 0) : (r.winnerPrice ?? 0));
  }, 0);

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Chain Intelligence</h1>
          <p className="admin-sub">Live data · the story changes when you pick a chain.</p>
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

      {/* ═══════════════════════════════════════════════════════════
           HERO — jaw-drop opener. One screenshot, three numbers.
         ═══════════════════════════════════════════════════════════ */}
      <IntelligenceHero
        profile={profile}
        branchCount={branchCount}
        rankByBranches={rankByBranches}
        totalChains={chainsRanked.length}
        avgVsLeader={avgVsLeader}
        leaderChain={leaderByPrice?.chain ?? null}
        basketsLostCount={basketStats.defected_total}
        revenueAtStakeNis={totalDefectionNis}
        winsCount={wins}
        lossesCount={losses}
      />

      {/* ═══════════════════════════════════════════════════════════
           SIDE-BY-SIDE RECEIPT — the pitch-deck moment
         ═══════════════════════════════════════════════════════════ */}
      <div className="admin-card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
        <div className="admin-card-head" style={{ padding: '18px 20px' }}>
          <div>
            <div className="admin-card-title">Basket comparison · the receipt</div>
            <div className="admin-card-sub">
              Same {receiptRows.length} items · {profile.displayName} on the left, market leader on the right
            </div>
          </div>
        </div>
        <ReceiptCompare
          targetChain={chainKey}
          rows={receiptRows}
          basketTotalTarget={basketTotalTarget}
          basketTotalWinner={basketTotalWinner}
          winnerChainKey={winnerChainKey}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
           DEFECTION ANALYSIS — where customers actually went
         ═══════════════════════════════════════════════════════════ */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card-head">
          <div>
            <div className="admin-card-title">Where the money went · defection analysis</div>
            <div className="admin-card-sub">
              Baskets IsraBis users compared to {profile.displayName} and then purchased elsewhere
            </div>
          </div>
        </div>
        <DefectionAnalysis
          targetChain={chainKey}
          totalBasketsTracked={basketStats.compared_total}
          chooseCheapestCount={basketStats.chose_cheapest_total}
          defectedCount={basketStats.defected_total}
          defectedByChain={defectedByChain}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
           MAP — Israel branch footprint vs rivals
         ═══════════════════════════════════════════════════════════ */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <BranchMap
          targetChain={chainKey}
          targetBranches={targetBranchPoints}
          competitorBranches={competitorBranchPoints}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
           NARRATIVE + RADAR + BATTLEGROUNDS (secondary storytelling)
         ═══════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════
           CROSS-CHAIN PRODUCT EXPLORER — search any product, see every chain
         ═══════════════════════════════════════════════════════════ */}
      <div className="admin-card" style={{ marginTop: 16 }}>
        <div className="admin-card-head">
          <div>
            <div className="admin-card-title">Cross-chain product search</div>
            <div className="admin-card-sub">
              Type any Hebrew product name or EAN-13 barcode. See every chain that stocks it, their price, and the savings spread.
            </div>
          </div>
        </div>
        <ProductExplorer targetChain={chainKey} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
           LIVE SIMULATOR + FULL PRICING MATRIX (interactive)
         ═══════════════════════════════════════════════════════════ */}
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
            <div className="admin-card-title">Full pricing matrix</div>
            <div className="admin-card-sub">
              {matrix.length} widely-stocked SKUs · the chain with the lowest shelf price wins each row
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
