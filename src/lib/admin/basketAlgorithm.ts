/**
 * Basket Battle Algorithm
 *
 * Given a cart (list of barcode+quantity) and a target chain, compute:
 *   - each chain's total cost for the cart
 *   - ranking
 *   - where the target chain loses
 *   - what price changes would be needed to win
 *   - revenue at stake given a buyer population
 *
 * Pure functions — no DB access. Takes pre-fetched price data as input so this
 * module stays testable and reusable.
 */

export interface CartLine {
  barcode: string;
  quantity: number;
  productName?: string;
  /**
   * If the barcode was substituted (fair-trade mode in the API), the
   * pre-substitution barcode is preserved here for traceability.
   */
  originalBarcode?: string;
}

/**
 * price map: barcode → chain_key → lowest_price_nis (pre-aggregated by the caller).
 * If a chain doesn't stock a barcode, it's absent from that barcode's inner map.
 */
export type PriceMap = Record<string, Record<string, number>>;

export interface ChainTotal {
  chainKey: string;
  totalNis: number;
  itemsAvailable: number;
  itemsMissing: number;
  basketCompletenessPct: number;
}

export interface BattleResult {
  winner: string;
  winnerTotal: number;
  targetChainKey: string;
  targetTotal: number | null;
  targetRank: number;                 // 1-indexed
  targetChainComplete: boolean;
  deltaVsWinner: number | null;       // target − winner (positive = target is more expensive)
  chainTotals: ChainTotal[];          // sorted ascending by total
  winningAdjustments: ProductAdjustment[]; // 3 products target should drop to win
  revenue: RevenueAssessment;
}

export interface ProductAdjustment {
  barcode: string;
  productName?: string;
  quantity: number;
  targetPrice: number | null;         // what target currently charges
  winnerPrice: number | null;         // what the current cart winner charges
  dropAmountPerUnit: number | null;   // how much target would need to drop per unit
  shareOfCartDelta: number;           // fraction of the overall delta this product explains (0..1)
}

export interface RevenueAssessment {
  userCount: number;
  conversionPct: number;
  projectedBuyers: number;
  basketValueAtWinner: number;
  marketSizeNis: number;              // projectedBuyers × winnerTotal
  targetCurrentShareNis: number;      // proxy: share proportional to inverse-rank
  targetMaxShareNis: number;          // what target would capture if it won
  revenueAtStake: number;             // targetMaxShareNis − targetCurrentShareNis
}

export function runBasketBattle(
  cart: CartLine[],
  priceMap: PriceMap,
  targetChain: string,
  scenario: { userCount: number; conversionPct: number }
): BattleResult {
  // Collect all chains mentioned across the cart
  const allChains = new Set<string>();
  for (const line of cart) {
    const prices = priceMap[line.barcode];
    if (prices) Object.keys(prices).forEach(c => allChains.add(c));
  }
  if (!allChains.has(targetChain)) allChains.add(targetChain);

  // Compute total per chain
  const totals: ChainTotal[] = Array.from(allChains).map(chainKey => {
    let total = 0;
    let avail = 0;
    let missing = 0;
    for (const line of cart) {
      const p = priceMap[line.barcode]?.[chainKey];
      if (typeof p === 'number' && Number.isFinite(p)) {
        total += p * line.quantity;
        avail += 1;
      } else {
        missing += 1;
      }
    }
    const totalItems = cart.length || 1;
    return {
      chainKey,
      totalNis: Number(total.toFixed(2)),
      itemsAvailable: avail,
      itemsMissing: missing,
      basketCompletenessPct: Math.round((avail / totalItems) * 100),
    };
  });

  // Filter out chains that can't complete at least 50% of the basket — they're not honest competitors for this comparison
  const honest = totals.filter(t => t.basketCompletenessPct >= 50);
  honest.sort((a, b) => a.totalNis - b.totalNis);

  const winner = honest[0] ?? totals[0];
  const targetEntry = totals.find(t => t.chainKey === targetChain) ?? null;
  const targetRankInHonest = honest.findIndex(t => t.chainKey === targetChain);
  const targetRank = targetRankInHonest >= 0 ? targetRankInHonest + 1 : -1;
  const targetComplete = targetEntry ? targetEntry.basketCompletenessPct >= 50 : false;

  const deltaVsWinner =
    targetEntry && winner && targetEntry.chainKey !== winner.chainKey
      ? Number((targetEntry.totalNis - winner.totalNis).toFixed(2))
      : targetEntry && winner && targetEntry.chainKey === winner.chainKey
        ? 0
        : null;

  // Which 3 products cause the biggest gap for target vs winner?
  const adjustments: ProductAdjustment[] = [];
  if (targetEntry && winner && targetEntry.chainKey !== winner.chainKey && deltaVsWinner && deltaVsWinner > 0) {
    const totalDelta = deltaVsWinner;
    const perLineDelta = cart.map(line => {
      const tp = priceMap[line.barcode]?.[targetChain];
      const wp = priceMap[line.barcode]?.[winner.chainKey];
      if (typeof tp !== 'number' || typeof wp !== 'number') {
        return { line, tp: null, wp: null, totalDeltaLine: 0 };
      }
      const totalDeltaLine = (tp - wp) * line.quantity;
      return { line, tp, wp, totalDeltaLine };
    });
    perLineDelta.sort((a, b) => b.totalDeltaLine - a.totalDeltaLine);
    for (const entry of perLineDelta.slice(0, 3)) {
      if (entry.totalDeltaLine <= 0) continue;
      adjustments.push({
        barcode: entry.line.barcode,
        productName: entry.line.productName,
        quantity: entry.line.quantity,
        targetPrice: entry.tp,
        winnerPrice: entry.wp,
        dropAmountPerUnit:
          entry.tp !== null && entry.wp !== null
            ? Number(((entry.tp - entry.wp) + 0.01).toFixed(2)) // 1 agora below winner = flip
            : null,
        shareOfCartDelta: totalDelta > 0 ? Number((entry.totalDeltaLine / totalDelta).toFixed(3)) : 0,
      });
    }
  }

  // Revenue assessment
  const projectedBuyers = Math.round(scenario.userCount * (scenario.conversionPct / 100));
  const basketValue = winner ? winner.totalNis : 0;
  const marketSize = Number((projectedBuyers * basketValue).toFixed(2));

  // Proxy for current share: inverse-rank weighting (rank 1 gets 40%, rank 2 gets 25%, rank 3 gets 15%, 4+ split rest)
  const rankWeights = [0.40, 0.25, 0.15, 0.10, 0.05, 0.03, 0.02];
  const currentShareWeight =
    targetRank > 0 && targetRank <= rankWeights.length
      ? rankWeights[targetRank - 1]
      : 0.01;
  const targetCurrentShare = Number((marketSize * currentShareWeight).toFixed(2));
  const targetMaxShare = Number((marketSize * rankWeights[0]).toFixed(2));
  const revenueAtStake = Number((targetMaxShare - targetCurrentShare).toFixed(2));

  return {
    winner: winner?.chainKey ?? '',
    winnerTotal: winner?.totalNis ?? 0,
    targetChainKey: targetChain,
    targetTotal: targetEntry?.totalNis ?? null,
    targetRank,
    targetChainComplete: targetComplete,
    deltaVsWinner,
    chainTotals: honest,
    winningAdjustments: adjustments,
    revenue: {
      userCount: scenario.userCount,
      conversionPct: scenario.conversionPct,
      projectedBuyers,
      basketValueAtWinner: basketValue,
      marketSizeNis: marketSize,
      targetCurrentShareNis: targetCurrentShare,
      targetMaxShareNis: targetMaxShare,
      revenueAtStake,
    },
  };
}

/**
 * Parse uploaded CSV text → CartLine[]
 * Accepts formats:
 *   barcode,quantity
 *   barcode,quantity,product_name
 * Whitespace-tolerant, skips blank lines and obvious headers.
 */
export function parseCartCsv(csv: string): CartLine[] {
  const lines: CartLine[] = [];
  for (const raw of csv.split(/\r?\n/)) {
    const row = raw.trim();
    if (!row) continue;
    if (/^(barcode|ean|upc|sku)/i.test(row)) continue; // header
    const parts = row.split(',').map(s => s.trim());
    if (parts.length < 2) continue;
    const barcode = parts[0].replace(/["']/g, '');
    const qty = parseFloat(parts[1]);
    if (!barcode || !Number.isFinite(qty) || qty <= 0) continue;
    lines.push({
      barcode,
      quantity: qty,
      productName: parts[2]?.replace(/["']/g, ''),
    });
  }
  return lines;
}

/**
 * Preset baskets for the demo. Each references real barcodes that exist widely
 * in the Israeli market so product_prices has good coverage.
 *
 * Barcodes are 13-digit EANs. The product_name is only for display; the real
 * lookup happens against product_prices.barcode.
 */
export const PRESET_BASKETS: Record<string, { label: string; description: string; lines: CartLine[] }> = {
  shabbat_dinner: {
    label: 'Shabbat Dinner for 8',
    description: 'Friday-night staples — challah, chicken, wine, salad fixings, dessert',
    lines: [
      { barcode: '7290002020325', quantity: 2, productName: 'Challah' },
      { barcode: '7290000042671', quantity: 2, productName: 'Whole chicken' },
      { barcode: '7290000123455', quantity: 1, productName: 'Kosher wine bottle' },
      { barcode: '7290000041483', quantity: 3, productName: 'Cucumbers (kg)' },
      { barcode: '7290000041476', quantity: 3, productName: 'Tomatoes (kg)' },
      { barcode: '7290000042664', quantity: 2, productName: 'Onions (kg)' },
      { barcode: '7290000128597', quantity: 1, productName: 'Olive oil 750ml' },
      { barcode: '7290002334026', quantity: 2, productName: 'Fresh bread' },
      { barcode: '7290004128579', quantity: 4, productName: 'Yogurt 150g' },
      { barcode: '7290000041070', quantity: 1, productName: 'Chocolate cake' },
    ],
  },
  everyday_essentials: {
    label: 'Everyday Essentials',
    description: 'Mid-week cart — milk, bread, eggs, cheese, produce',
    lines: [
      { barcode: '7290004128579', quantity: 6, productName: 'Yogurt 150g' },
      { barcode: '7290004128586', quantity: 2, productName: 'Milk 1L 3%' },
      { barcode: '7290000042664', quantity: 1, productName: 'Onions (kg)' },
      { barcode: '7290000041476', quantity: 2, productName: 'Tomatoes (kg)' },
      { barcode: '7290000041483', quantity: 2, productName: 'Cucumbers (kg)' },
      { barcode: '7290002020325', quantity: 2, productName: 'Bread' },
      { barcode: '7290000066653', quantity: 1, productName: 'Eggs L 12-pack' },
      { barcode: '7290000067001', quantity: 1, productName: 'Cottage cheese 250g' },
      { barcode: '7290000067018', quantity: 2, productName: 'Yellow cheese' },
      { barcode: '7290000042671', quantity: 1, productName: 'Chicken breasts' },
    ],
  },
  mehadrin_weekly: {
    label: 'Mehadrin Weekly',
    description: 'Strict-kashrut weekly cart — the Yochananof + Osher Ad target persona',
    lines: [
      { barcode: '7290004128579', quantity: 8, productName: 'Yogurt 150g (Mehadrin)' },
      { barcode: '7290000042671', quantity: 2, productName: 'Chicken (Mehadrin)' },
      { barcode: '7290000067001', quantity: 2, productName: 'Cottage (Mehadrin)' },
      { barcode: '7290004128586', quantity: 4, productName: 'Milk 1L 3% (Mehadrin)' },
      { barcode: '7290000066653', quantity: 2, productName: 'Eggs 12 (Mehadrin)' },
      { barcode: '7290000067018', quantity: 3, productName: 'Yellow cheese (Mehadrin)' },
      { barcode: '7290002334026', quantity: 3, productName: 'Fresh bread (Mehadrin)' },
      { barcode: '7290000041476', quantity: 3, productName: 'Tomatoes (kg)' },
      { barcode: '7290000041483', quantity: 3, productName: 'Cucumbers (kg)' },
      { barcode: '7290000042664', quantity: 2, productName: 'Onions (kg)' },
      { barcode: '7290000128597', quantity: 1, productName: 'Olive oil' },
      { barcode: '7290000041070', quantity: 1, productName: 'Cake for Shabbat' },
    ],
  },
  family_30day: {
    label: 'Family of 6 · 30-Day Staples',
    description: 'Bulk-style monthly cart — the Osher Ad / Hazi Hinam target persona',
    lines: [
      { barcode: '7290004128586', quantity: 20, productName: 'Milk 1L' },
      { barcode: '7290004128579', quantity: 30, productName: 'Yogurt 150g' },
      { barcode: '7290000066653', quantity: 4, productName: 'Eggs L 12-pack' },
      { barcode: '7290000067001', quantity: 6, productName: 'Cottage cheese 250g' },
      { barcode: '7290000067018', quantity: 4, productName: 'Yellow cheese' },
      { barcode: '7290000042671', quantity: 4, productName: 'Chicken' },
      { barcode: '7290000041476', quantity: 10, productName: 'Tomatoes (kg)' },
      { barcode: '7290000041483', quantity: 10, productName: 'Cucumbers (kg)' },
      { barcode: '7290000042664', quantity: 8, productName: 'Onions (kg)' },
      { barcode: '7290002020325', quantity: 8, productName: 'Bread' },
      { barcode: '7290000128597', quantity: 2, productName: 'Olive oil 750ml' },
      { barcode: '7290000123455', quantity: 2, productName: 'Kosher wine' },
    ],
  },
};
