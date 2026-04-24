/**
 * Static chain profiles — the strategic lens through which we frame each chain.
 * Combines what we know from the strategic PDF, the two-pager, and industry context.
 * Numeric data (branches, prices, etc.) is ALWAYS pulled from the live database;
 * this file holds only the positioning narrative and display metadata.
 */

export type ChainKey =
  | 'YOCHANANOF' | 'SHUFERSAL' | 'RAMI_LEVY' | 'VICTORY'
  | 'OSHER_AD'   | 'HAZI_HINAM'| 'TIV_TAAM'  | 'MACHSANEI_HASHUK'
  | 'COFIX'      | 'DOR_ALON'  | 'FRESH_MARKET' | 'KESHET'
  | 'STOP_MARKET'| 'MEGA'      | 'CARREFOUR' | 'POLIZER'
  | 'SALACH_DABACH' | 'KING_STORE' | 'ZOL_VEBEGADOL' | 'BAREKET';

export interface ChainProfile {
  key: ChainKey;
  displayName: string;
  displayNameHe: string;
  color: string;            // brand accent
  archetype: string;        // one-line market position
  cultureFit: string[];     // e.g. ["traditional", "religious", "mehadrin"]
  positioningHeadline: string;
  competitivePitch: string; // what this chain sells on
  weaknesses: string[];
  topCompetitors: ChainKey[];
  yochananofNote?: string;  // optional: context for Yochananof-centric comparison
}

/**
 * Keyed by chain_key. Any chain missing from this map falls back to a generic profile.
 */
export const CHAIN_PROFILES: Record<string, ChainProfile> = {
  YOCHANANOF: {
    key: 'YOCHANANOF',
    displayName: 'Yochananof',
    displayNameHe: 'יוחננוף',
    color: '#D4A853',
    archetype: 'Traditional/religious mid-market player',
    cultureFit: ['traditional', 'religious', 'mehadrin', 'large families'],
    positioningHeadline: 'Cultural fit over raw volume — Mehadrin kashrut, Shabbat planning, multi-generational families',
    competitivePitch:
      'Not the biggest (Shufersal) or the cheapest (Rami Levy) — the chain that understands the traditional Israeli family. Investment in Cust2Mate smart carts signals a platform ambition.',
    weaknesses: ['lower branch density vs Shufersal', 'non-price-led brand'],
    topCompetitors: ['SHUFERSAL', 'OSHER_AD', 'RAMI_LEVY'],
  },
  SHUFERSAL: {
    key: 'SHUFERSAL',
    displayName: 'Shufersal',
    displayNameHe: 'שופרסל',
    color: '#007AFF',
    archetype: 'The incumbent — largest coverage + tiered brands (Deal / Sheli)',
    cultureFit: ['mainstream', 'tiered'],
    positioningHeadline: 'Israel\'s largest chain — 428 branches across every tier from discount (Deal) to premium (Sheli)',
    competitivePitch: 'Coverage and convenience win. Meets price with Shufersal Deal. Captures premium with Sheli.',
    weaknesses: ['not the price leader', 'fragmented brand feel across tiers'],
    topCompetitors: ['RAMI_LEVY', 'VICTORY', 'YOCHANANOF'],
    yochananofNote:
      'Shufersal is Yochananof\'s primary incumbent rival in religious-adjacent neighborhoods. Where they overlap geographically, kashrut strictness and service tend to decide.',
  },
  RAMI_LEVY: {
    key: 'RAMI_LEVY',
    displayName: 'Rami Levy',
    displayNameHe: 'רמי לוי',
    color: '#FF3B30',
    archetype: 'Price leader — lowest shelf prices, aggressive promos',
    cultureFit: ['price-conscious', 'large families', 'secular + traditional'],
    positioningHeadline: 'The price-sensitive shopper\'s default — 99 branches focused on beating everyone on the big basket',
    competitivePitch: 'Lowest shelf prices, Tuesday deal discipline, own-brand dairy + produce.',
    weaknesses: ['leaner store experience', 'fewer Badatz options'],
    topCompetitors: ['SHUFERSAL', 'YOCHANANOF', 'VICTORY'],
    yochananofNote:
      'Rami Levy wins on the 50-item basket. Yochananof competes by offering a kashrut tier and store experience Rami Levy doesn\'t match.',
  },
  VICTORY: {
    key: 'VICTORY',
    displayName: 'Victory',
    displayNameHe: 'ויקטורי',
    color: '#AF52DE',
    archetype: 'Shufersal Deal competitor — periphery-focused discounter',
    cultureFit: ['price-conscious', 'periphery'],
    positioningHeadline: 'The Shufersal Deal alternative — 78 branches with discount pricing and periphery presence',
    competitivePitch: 'Price-matched against Rami Levy in many categories, modern store footprint.',
    weaknesses: ['smaller scale', 'limited high-kashrut SKUs'],
    topCompetitors: ['SHUFERSAL', 'RAMI_LEVY', 'OSHER_AD'],
  },
  OSHER_AD: {
    key: 'OSHER_AD',
    displayName: 'Osher Ad',
    displayNameHe: 'אושר עד',
    color: '#5AC8FA',
    archetype: 'Mid-Haredi bulk discounter — the Costco of religious Israel',
    cultureFit: ['haredi', 'large families', 'bulk'],
    positioningHeadline: 'Bulk + Mehadrin — the go-to for large religious families buying monthly',
    competitivePitch: 'Bulk pricing, Mehadrin across most SKUs, massive cart experience.',
    weaknesses: ['fewer branches', 'not for small baskets'],
    topCompetitors: ['YOCHANANOF', 'HAZI_HINAM', 'RAMI_LEVY'],
    yochananofNote:
      'Osher Ad is Yochananof\'s most direct competitor for the Mehadrin/Haredi household segment, but on a different store format (bulk vs mid-size).',
  },
  HAZI_HINAM: {
    key: 'HAZI_HINAM',
    displayName: 'Hazi Hinam',
    displayNameHe: 'חצי חינם',
    color: '#FF9500',
    archetype: 'Mega-store price play — dense urban strongholds',
    cultureFit: ['urban', 'price-conscious'],
    positioningHeadline: '~7 mega-stores, each one a destination — urban shoppers come weekly',
    competitivePitch: 'Lowest price in its local reach. Zero frills, maximum cart value.',
    weaknesses: ['tiny footprint (7 stores)', 'can\'t serve periphery'],
    topCompetitors: ['RAMI_LEVY', 'SHUFERSAL', 'YOCHANANOF'],
  },
  TIV_TAAM: {
    key: 'TIV_TAAM',
    displayName: 'Tiv Taam',
    displayNameHe: 'טיב טעם',
    color: '#34C759',
    archetype: 'Non-kosher + imported premium niche',
    cultureFit: ['secular', 'premium', 'foreign cuisine'],
    positioningHeadline: 'The non-kosher + imported goods specialist — caters to Russian + secular demographic',
    competitivePitch: 'Unique SKU set (non-kosher deli, imported wine, specialty).',
    weaknesses: ['small religious appeal', 'smaller scale'],
    topCompetitors: ['SHUFERSAL', 'MEGA', 'VICTORY'],
  },
  MACHSANEI_HASHUK: {
    key: 'MACHSANEI_HASHUK',
    displayName: 'Machsanei HaShuk',
    displayNameHe: 'מחסני השוק',
    color: '#248A3D',
    archetype: 'Small-format discount — fast shop + basics',
    cultureFit: ['convenience', 'price-conscious', 'urban'],
    positioningHeadline: 'Convenience + discount — smaller footprint, tighter SKU list',
    competitivePitch: 'Quick weekday shop, better prices than a typical minimarket.',
    weaknesses: ['limited SKU depth', 'not a full-basket chain'],
    topCompetitors: ['RAMI_LEVY', 'VICTORY'],
  },
  DOR_ALON: {
    key: 'DOR_ALON',
    displayName: 'Dor Alon',
    displayNameHe: 'דור אלון',
    color: '#6B6B70',
    archetype: 'Gas-station convenience — ubiquitous, expensive',
    cultureFit: ['convenience', 'fuel stops'],
    positioningHeadline: '157 forecourt stores — convenience wins, price loses',
    competitivePitch: 'Availability when nothing else is open. Captive audience.',
    weaknesses: ['highest prices', 'limited cart'],
    topCompetitors: ['SHUFERSAL', 'COFIX'],
  },
  COFIX: {
    key: 'COFIX',
    displayName: 'Cofix',
    displayNameHe: 'קופיקס',
    color: '#8E8E93',
    archetype: 'Fixed-price convenience — urban commuter hub',
    cultureFit: ['urban', 'convenience', 'young'],
    positioningHeadline: 'Flat-price concept with grocery crossover — 34 urban stores',
    competitivePitch: 'Price transparency — every item at a known price point.',
    weaknesses: ['limited SKU set', 'not a full basket'],
    topCompetitors: ['SHUFERSAL', 'MACHSANEI_HASHUK'],
  },
  FRESH_MARKET: {
    key: 'FRESH_MARKET',
    displayName: 'Fresh Market',
    displayNameHe: 'פרש מרקט',
    color: '#30B350',
    archetype: 'Produce-first format — 45 stores, fresh focus',
    cultureFit: ['mainstream', 'fresh-focused'],
    positioningHeadline: 'Fresh produce + prepared foods — the chain you visit for tonight\'s dinner',
    competitivePitch: 'Quality produce, shorter supply chain, ready-meals.',
    weaknesses: ['smaller packaged-goods selection'],
    topCompetitors: ['SHUFERSAL', 'TIV_TAAM'],
  },
  KESHET: {
    key: 'KESHET',
    displayName: 'Keshet',
    displayNameHe: 'קשת',
    color: '#FF9500',
    archetype: 'Regional discounter',
    cultureFit: ['regional', 'price-conscious'],
    positioningHeadline: '27 regional stores with discount positioning',
    competitivePitch: 'Local competitor to Rami Levy / Victory in its footprint.',
    weaknesses: ['small scale', 'limited geography'],
    topCompetitors: ['RAMI_LEVY', 'VICTORY'],
  },
  STOP_MARKET: {
    key: 'STOP_MARKET',
    displayName: 'Stop Market',
    displayNameHe: 'סטופ מרקט',
    color: '#AF52DE',
    archetype: 'Compact discount',
    cultureFit: ['convenience', 'price-conscious'],
    positioningHeadline: 'Compact urban discount',
    competitivePitch: 'Low price in a small footprint.',
    weaknesses: ['tiny presence'],
    topCompetitors: ['RAMI_LEVY', 'MACHSANEI_HASHUK'],
  },
};

const GENERIC: ChainProfile = {
  key: 'SHUFERSAL',
  displayName: 'Unknown chain',
  displayNameHe: '',
  color: '#8E8E93',
  archetype: 'Generic retailer',
  cultureFit: ['mainstream'],
  positioningHeadline: 'Profile not yet defined',
  competitivePitch: '—',
  weaknesses: [],
  topCompetitors: [],
};

export function profileFor(chainKey: string): ChainProfile {
  const p = CHAIN_PROFILES[chainKey];
  if (!p) return { ...GENERIC, key: chainKey as ChainKey, displayName: chainKey };
  return p;
}

/** Build a one-paragraph narrative string by templating with live data. */
export function buildNarrative(opts: {
  chainKey: string;
  branchCount: number;
  cityCount: number;
  rankByBranches: number;   // 1 = largest
  totalChains: number;
  avgBasketVsLeader: number; // + = more expensive, - = cheaper
  bestCategory: string;
  worstCategory: string;
  topCompetitorCity?: string;
  topCompetitorChain?: string;
}): string {
  const p = profileFor(opts.chainKey);
  const rankStr =
    opts.rankByBranches === 1 ? 'the largest chain' :
    opts.rankByBranches === 2 ? 'the #2 chain by coverage' :
    `#${opts.rankByBranches} of ${opts.totalChains} by coverage`;

  const priceStr = opts.avgBasketVsLeader > 5
    ? `priced above the market leader by about ₪${opts.avgBasketVsLeader.toFixed(1)} on a typical 50-item basket`
    : opts.avgBasketVsLeader < -5
      ? `priced below the market leader by about ₪${Math.abs(opts.avgBasketVsLeader).toFixed(1)} on a typical 50-item basket`
      : 'priced roughly at market parity';

  const compStr = opts.topCompetitorCity && opts.topCompetitorChain
    ? ` Most intense battlefield: ${opts.topCompetitorCity}, where it competes directly with ${opts.topCompetitorChain}.`
    : '';

  return (
    `${p.displayName} (${p.displayNameHe}) operates ${opts.branchCount} branches across ` +
    `${opts.cityCount} cities — ${rankStr}. Market archetype: ${p.archetype.toLowerCase()}. ` +
    `Today it is ${priceStr}. Its pricing strength sits in **${opts.bestCategory}**, and its ` +
    `pricing weakness in **${opts.worstCategory}**.${compStr} ` +
    `${p.positioningHeadline}.`
  );
}
