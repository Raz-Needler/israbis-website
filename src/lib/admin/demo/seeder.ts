/**
 * Demo data seeder.
 *
 * Creates a fully self-contained synthetic user population:
 *   - public.users                    (rows tagged via email pattern `demo.%@isrbs.test`)
 *   - public.user_preferences         (locationCity in Hebrew so /admin/geo works)
 *   - public.saved_baskets            (name prefixed `[DEMO]`)
 *   - public.saved_basket_items       (scoped via basket_id -> DEMO baskets)
 *   - public.purchase_history         (notes contains `[demo]`)
 *   - public.purchase_items
 *   - analytics.events                (props.is_demo = true)
 *   - analytics.fact_intent_basket    (rows keyed by DEMO anonymous_id pattern)
 *
 * Zero writes to any table without a demo marker convention — wiping demo data
 * leaves production-like data untouched. See DEMO_MARKERS below.
 */

import { adminSupabase } from '../supabase';
import { mulberry32, pickOne, pickN, randInt, randFloat } from './rng';
import { ISRAELI_CITIES, pickCity, type IsraeliCity } from './cities';
import { pickName, demoEmail, type NameProfile } from './names';

// ═══════════════════════════════════════════════════════════════════
// Demo markers — the ONLY way we identify rows as synthetic.
// Every seeder write must use at least one of these.
// Every clear-demo-data operation must use EXACTLY these to find rows.
// ═══════════════════════════════════════════════════════════════════
export const DEMO_MARKERS = {
  emailPattern:     'demo.%@isrbs.test',
  basketNamePrefix: '[DEMO] ',
  purchaseNote:     '[demo]',
  eventPropKey:     'is_demo',
  anonymousIdPrefix:'demo-anon-',
  sessionIdPrefix:  'demo-sess-',
} as const;

export interface SeedOptions {
  userCount?: number;           // default 500
  basketsPerUser?: number;      // average; default 3
  purchasesPerUser?: number;    // average; default 2
  eventsPerUser?: number;       // average; default 40
  seed?: number;                // PRNG seed; default 20261224
  daysWindow?: number;          // events/purchases spread across last N days; default 90
}

export interface SeedResult {
  users_created: number;
  preferences_created: number;
  baskets_created: number;
  basket_items_created: number;
  purchases_created: number;
  purchase_items_created: number;
  events_accepted: number;
  events_rejected: number;
  fact_intent_baskets_created: number;
  duration_ms: number;
  seed: number;
  window_days: number;
  errors: string[];
}

// Canonical chain keys as they appear in store_branches / product_prices.
const CHAINS = ['YOCHANANOF', 'SHUFERSAL', 'RAMI_LEVY', 'VICTORY', 'OSHER_AD', 'HAZI_HINAM', 'TIV_TAAM', 'MACHSANEI_HASHUK', 'FRESH_MARKET', 'KESHET'];

// Realistic Israeli product set — keeps the basket data legible in admin.
const SAMPLE_PRODUCTS: Array<{ barcode: string; name: string; avgPrice: number; category: string }> = [
  { barcode: '7290004128586', name: 'Milk 1L 3%',         avgPrice: 6.90,  category: 'dairy' },
  { barcode: '7290004128579', name: 'Yogurt 150g',        avgPrice: 3.50,  category: 'dairy' },
  { barcode: '7290000067001', name: 'Cottage cheese 250g',avgPrice: 7.20,  category: 'dairy' },
  { barcode: '7290000067018', name: 'Yellow cheese 200g', avgPrice: 19.90, category: 'dairy' },
  { barcode: '7290000066653', name: 'Eggs L 12-pack',     avgPrice: 22.50, category: 'eggs' },
  { barcode: '7290002020325', name: 'Bread 750g',         avgPrice: 8.90,  category: 'bakery' },
  { barcode: '7290002334026', name: 'Fresh bread 500g',   avgPrice: 10.50, category: 'bakery' },
  { barcode: '7290000042671', name: 'Whole chicken',      avgPrice: 35.90, category: 'meat' },
  { barcode: '7290000042664', name: 'Onions 1kg',         avgPrice: 5.90,  category: 'produce' },
  { barcode: '7290000041476', name: 'Tomatoes 1kg',       avgPrice: 7.90,  category: 'produce' },
  { barcode: '7290000041483', name: 'Cucumbers 1kg',      avgPrice: 6.90,  category: 'produce' },
  { barcode: '7290000128597', name: 'Olive oil 750ml',    avgPrice: 45.00, category: 'pantry' },
  { barcode: '7290000123455', name: 'Kosher wine bottle', avgPrice: 39.00, category: 'beverages' },
  { barcode: '7290000041070', name: 'Chocolate cake',     avgPrice: 24.90, category: 'sweets' },
];

const EVENT_SEQUENCE_TEMPLATES: Array<{ weight: number; events: Array<{ name: string; propsBuilder?: (ctx: EventContext) => Record<string, unknown> }> }> = [
  // Browse-only visit
  { weight: 30, events: [
    { name: 'app.opened' },
    { name: 'recipe.viewed', propsBuilder: (c) => ({ recipe_id: `r_${c.rng() < 0.5 ? 'hummus' : 'schnitzel'}` }) },
    { name: 'recipe.viewed', propsBuilder: (c) => ({ recipe_id: `r_${c.rng() < 0.5 ? 'shakshuka' : 'burekas'}` }) },
  ]},
  // Added to cart but didn't buy
  { weight: 25, events: [
    { name: 'app.opened' },
    { name: 'cart.item_added', propsBuilder: (c) => ({ barcode: pickOne(SAMPLE_PRODUCTS, c.rng).barcode }) },
    { name: 'cart.item_added', propsBuilder: (c) => ({ barcode: pickOne(SAMPLE_PRODUCTS, c.rng).barcode }) },
    { name: 'cart.compared',   propsBuilder: (c) => ({ chains_compared: pickN(CHAINS, 4, c.rng) }) },
    { name: 'cart.abandoned' },
  ]},
  // Full purchase funnel
  { weight: 25, events: [
    { name: 'app.opened' },
    { name: 'cart.item_added',        propsBuilder: (c) => ({ barcode: pickOne(SAMPLE_PRODUCTS, c.rng).barcode }) },
    { name: 'cart.item_added',        propsBuilder: (c) => ({ barcode: pickOne(SAMPLE_PRODUCTS, c.rng).barcode }) },
    { name: 'cart.item_added',        propsBuilder: (c) => ({ barcode: pickOne(SAMPLE_PRODUCTS, c.rng).barcode }) },
    { name: 'cart.compared',          propsBuilder: (c) => ({ chains_compared: pickN(CHAINS, 5, c.rng) }) },
    { name: 'cart.chain_switched',    propsBuilder: (c) => ({ from_chain: pickOne(CHAINS, c.rng), to_chain: pickOne(CHAINS, c.rng) }) },
    { name: 'cart.purchase_confirmed',propsBuilder: (c) => ({ chain: pickOne(CHAINS, c.rng), total_nis: Number((randFloat(c.rng, 120, 480)).toFixed(2)) }) },
  ]},
  // Scan receipt loop
  { weight: 10, events: [
    { name: 'app.opened' },
    { name: 'scan.receipt.started' },
    { name: 'scan.receipt.processed',      propsBuilder: (c) => ({ items_detected: randInt(c.rng, 6, 18) }) },
    { name: 'scan.receipt.imported_to_cart'},
  ]},
  // AI chat session
  { weight: 10, events: [
    { name: 'app.opened' },
    { name: 'ai.opened' },
    { name: 'ai.message_sent',       propsBuilder: (c) => ({ intent: pickOne(['recipe_for_leftovers', 'cheapest_milk', 'shabbat_menu', 'kid_friendly'], c.rng) }) },
    { name: 'ai.response_received' },
    { name: 'ai.tool_called',        propsBuilder: () => ({ tool: 'search_products' }) },
  ]},
];

interface EventContext {
  rng: () => number;
  anonymousId: string;
  userId: string;
  sessionId: string;
  platform: string;
  occurredAt: Date;
  locale: 'he' | 'en';
  familyId: string | null;
  subscriptionTier: string | null;
}

export async function seedDemoData(opts: SeedOptions = {}): Promise<SeedResult> {
  const t0 = Date.now();
  const userCount      = Math.max(10, Math.min(5000, opts.userCount ?? 500));
  const basketsPerUser = Math.max(0, Math.min(20, opts.basketsPerUser ?? 3));
  const purchasesPerUser = Math.max(0, Math.min(20, opts.purchasesPerUser ?? 2));
  const eventsPerUser  = Math.max(0, Math.min(500, opts.eventsPerUser ?? 40));
  const seed           = opts.seed ?? 20261224;
  const daysWindow     = Math.max(7, Math.min(365, opts.daysWindow ?? 90));
  const rng = mulberry32(seed);

  const sb = adminSupabase();
  const result: SeedResult = {
    users_created: 0,
    preferences_created: 0,
    baskets_created: 0,
    basket_items_created: 0,
    purchases_created: 0,
    purchase_items_created: 0,
    events_accepted: 0,
    events_rejected: 0,
    fact_intent_baskets_created: 0,
    duration_ms: 0,
    seed,
    window_days: daysWindow,
    errors: [],
  };

  // Pre-check: the seeder writes to tables; if they're missing or the service role
  // can't reach them we fail fast rather than half-seed.
  const probe = await sb.from('users').select('id', { count: 'exact', head: true });
  if (probe.error) {
    result.errors.push(`probe_failed: ${probe.error.message}`);
    result.duration_ms = Date.now() - t0;
    return result;
  }

  // ──────────────────────────────────────────────
  // 1. USERS
  // ──────────────────────────────────────────────
  interface SeededUser {
    id: string;
    email: string;
    name: string;
    city: IsraeliCity;
    nameProfile: NameProfile;
    joinedAt: Date;
    platform: 'ios' | 'android' | 'web';
    locale: 'he' | 'en';
  }
  const users: SeededUser[] = [];

  for (let i = 0; i < userCount; i++) {
    const uid = `${seed}-${i.toString(36).padStart(4, '0')}`;
    const name = pickName(rng);
    // Weight city pick by name profile for realism (religious names cluster in Bnei Brak etc.)
    const cultureHint =
      name.profile === 'religious' ? (rng() < 0.5 ? 'religious' : 'mehadrin')
      : name.profile === 'russian' ? 'russian'
      : name.profile === 'arab'    ? 'periphery'
      :                              undefined;
    const city = pickCity(rng, cultureHint);
    const email = demoEmail(name.firstName, name.lastName, uid);
    const joinDaysAgo = randInt(rng, 0, daysWindow + 30);
    const joinedAt = new Date(Date.now() - joinDaysAgo * 86400_000);
    const platform: 'ios' | 'android' | 'web' =
      rng() < 0.55 ? 'ios' : rng() < 0.9 ? 'android' : 'web';
    const locale: 'he' | 'en' = rng() < 0.8 ? 'he' : 'en';

    users.push({
      id: crypto.randomUUID(),
      email,
      name: name.fullName,
      city,
      nameProfile: name.profile,
      joinedAt,
      platform,
      locale,
    });
  }

  // Insert users in chunks
  const userRows = users.map(u => ({
    id:            u.id,
    name:          u.name,
    email:         u.email,
    password_hash: null,                        // demo users don't log in
    avatar_color:  pickOne(['#7A8B6F', '#D4A853', '#AF52DE', '#007AFF', '#FF9500', '#34C759', '#FF3B30'], rng),
    join_date:     u.joinedAt.toISOString(),
    provider:      'email',
  }));

  for (const chunk of chunks(userRows, 500)) {
    const ins = await sb.from('users').insert(chunk).select('id');
    if (ins.error) {
      result.errors.push(`users_insert: ${ins.error.message}`);
      break;
    }
    result.users_created += ins.data?.length ?? 0;
  }

  // ──────────────────────────────────────────────
  // 2. USER PREFERENCES (location_city)
  // ──────────────────────────────────────────────
  const prefRows = users.map(u => ({
    id:                 crypto.randomUUID(),
    user_id:            u.id,
    theme:              'system',
    measurement_system: 'metric',
    language:           u.locale,
    location_city:      u.city.nameHe,
    location_updated_at: new Date().toISOString(),
  }));
  for (const chunk of chunks(prefRows, 500)) {
    const ins = await sb.from('user_preferences').insert(chunk).select('id');
    if (ins.error) {
      // Some deployments have missing columns; retry with the smallest shape.
      const minChunk = chunk.map(r => ({ id: r.id, user_id: r.user_id, location_city: r.location_city }));
      const retry = await sb.from('user_preferences').insert(minChunk).select('id');
      if (retry.error) {
        result.errors.push(`prefs_insert: ${ins.error.message} (retry: ${retry.error.message})`);
      } else {
        result.preferences_created += retry.data?.length ?? 0;
      }
      continue;
    }
    result.preferences_created += ins.data?.length ?? 0;
  }

  // ──────────────────────────────────────────────
  // 3. SAVED BASKETS + ITEMS
  // ──────────────────────────────────────────────
  interface BasketDraft {
    id: string;
    user: SeededUser;
    storeName: string;
    totalCost: number;
    savedAt: Date;
    items: Array<{ product: typeof SAMPLE_PRODUCTS[number]; qty: number; price: number }>;
  }
  const basketDrafts: BasketDraft[] = [];
  for (const u of users) {
    const baskets = randInt(rng, Math.max(0, basketsPerUser - 2), basketsPerUser + 2);
    for (let b = 0; b < baskets; b++) {
      const savedDaysAgo = randInt(rng, 0, daysWindow);
      const savedAt = new Date(Date.now() - savedDaysAgo * 86400_000);
      const itemCount = randInt(rng, 4, 14);
      const picked = pickN(SAMPLE_PRODUCTS, itemCount, rng);
      const items = picked.map(p => ({
        product: p,
        qty:     randInt(rng, 1, 3),
        price:   Number((p.avgPrice * randFloat(rng, 0.85, 1.2)).toFixed(2)),
      }));
      const totalCost = Number(items.reduce((s, it) => s + it.price * it.qty, 0).toFixed(2));
      basketDrafts.push({
        id: crypto.randomUUID(),
        user: u,
        storeName: pickOne(CHAINS, rng),
        totalCost,
        savedAt,
        items,
      });
    }
  }

  const basketRows = basketDrafts.map(b => ({
    id:          b.id,
    user_id:     b.user.id,
    name:        `${DEMO_MARKERS.basketNamePrefix}${b.items.length} items from ${b.storeName}`,
    total_cost:  b.totalCost,
    store_name:  b.storeName,
    saved_at:    b.savedAt.toISOString(),
  }));
  for (const chunk of chunks(basketRows, 500)) {
    const ins = await sb.from('saved_baskets').insert(chunk).select('id');
    if (ins.error) {
      result.errors.push(`baskets_insert: ${ins.error.message}`);
      break;
    }
    result.baskets_created += ins.data?.length ?? 0;
  }

  const basketItemRows = basketDrafts.flatMap(b =>
    b.items.map(it => ({
      id:              crypto.randomUUID(),
      basket_id:       b.id,
      ingredient_name: it.product.name,
      amount:          `${it.qty}`,
      price_nis:       it.price,
      product_name:    it.product.name,
      product_id:      it.product.barcode,
      store:           b.storeName,
    }))
  );
  for (const chunk of chunks(basketItemRows, 1000)) {
    const ins = await sb.from('saved_basket_items').insert(chunk).select('id');
    if (ins.error) {
      // If the table's column set differs, retry minimal shape
      const minChunk = chunk.map(r => ({ id: r.id, basket_id: r.basket_id, ingredient_name: r.ingredient_name, amount: r.amount, price_nis: r.price_nis }));
      const retry = await sb.from('saved_basket_items').insert(minChunk).select('id');
      if (retry.error) {
        result.errors.push(`basket_items_insert: ${ins.error.message} (retry: ${retry.error.message})`);
      } else {
        result.basket_items_created += retry.data?.length ?? 0;
      }
      continue;
    }
    result.basket_items_created += ins.data?.length ?? 0;
  }

  // ──────────────────────────────────────────────
  // 4. PURCHASE HISTORY
  // ──────────────────────────────────────────────
  interface PurchaseDraft {
    id: string;
    user: SeededUser;
    totalCost: number;
    storeName: string;
    purchasedAt: Date;
    items: Array<{ product: typeof SAMPLE_PRODUCTS[number]; qty: number; price: number }>;
  }
  const purchaseDrafts: PurchaseDraft[] = [];
  for (const u of users) {
    const purchases = randInt(rng, 0, purchasesPerUser + 2);
    for (let p = 0; p < purchases; p++) {
      const daysAgo = randInt(rng, 0, daysWindow);
      const purchasedAt = new Date(Date.now() - daysAgo * 86400_000);
      const itemCount = randInt(rng, 5, 18);
      const picked = pickN(SAMPLE_PRODUCTS, itemCount, rng);
      const items = picked.map(pr => ({
        product: pr,
        qty:     randInt(rng, 1, 4),
        price:   Number((pr.avgPrice * randFloat(rng, 0.8, 1.3)).toFixed(2)),
      }));
      const totalCost = Number(items.reduce((s, it) => s + it.price * it.qty, 0).toFixed(2));
      purchaseDrafts.push({
        id: crypto.randomUUID(),
        user: u,
        totalCost,
        storeName: pickOne(CHAINS, rng),
        purchasedAt,
        items,
      });
    }
  }

  const purchaseRows = purchaseDrafts.map(p => ({
    id:            p.id,
    user_id:       p.user.id,
    total_cost:    p.totalCost,
    store_name:    p.storeName,
    item_count:    p.items.length,
    purchased_at:  p.purchasedAt.toISOString(),
    notes:         DEMO_MARKERS.purchaseNote,
  }));
  for (const chunk of chunks(purchaseRows, 500)) {
    const ins = await sb.from('purchase_history').insert(chunk).select('id');
    if (ins.error) {
      result.errors.push(`purchases_insert: ${ins.error.message}`);
      break;
    }
    result.purchases_created += ins.data?.length ?? 0;
  }

  const purchaseItemRows = purchaseDrafts.flatMap(p =>
    p.items.map(it => ({
      id:               crypto.randomUUID(),
      purchase_id:      p.id,
      ingredient_name:  it.product.name,
      quantity:         `${it.qty}`,
      price_nis:        it.price,
      product_name:     it.product.name,
      product_id:       it.product.barcode,
      store:            p.storeName,
    }))
  );
  for (const chunk of chunks(purchaseItemRows, 1000)) {
    const ins = await sb.from('purchase_items').insert(chunk).select('id');
    if (ins.error) {
      const minChunk = chunk.map(r => ({ id: r.id, purchase_id: r.purchase_id, ingredient_name: r.ingredient_name, quantity: r.quantity, price_nis: r.price_nis }));
      const retry = await sb.from('purchase_items').insert(minChunk).select('id');
      if (retry.error) {
        result.errors.push(`purchase_items_insert: ${ins.error.message} (retry: ${retry.error.message})`);
      } else {
        result.purchase_items_created += retry.data?.length ?? 0;
      }
      continue;
    }
    result.purchase_items_created += ins.data?.length ?? 0;
  }

  // ──────────────────────────────────────────────
  // 5. ANALYTICS EVENTS (this is what lights up funnels/retention/events page)
  // ──────────────────────────────────────────────
  const eventRows: Array<Record<string, unknown>> = [];
  const totalWeight = EVENT_SEQUENCE_TEMPLATES.reduce((s, t) => s + t.weight, 0);

  for (const u of users) {
    // signup event (every user has one)
    eventRows.push(buildEventRow({
      userId: u.id,
      anonymousId: `${DEMO_MARKERS.anonymousIdPrefix}${u.id.slice(0, 12)}`,
      sessionId:   `${DEMO_MARKERS.sessionIdPrefix}${u.id.slice(0, 8)}-sign`,
      eventName: 'auth.signup_completed',
      occurredAt: u.joinedAt,
      platform: u.platform,
      locale: u.locale,
      props: { method: u.nameProfile === 'secular' ? 'apple' : 'google' },
    }));

    const sessions = Math.max(1, Math.round(eventsPerUser / 6));
    for (let s = 0; s < sessions; s++) {
      // Pick a template by weight
      let roll = rng() * totalWeight;
      let tpl = EVENT_SEQUENCE_TEMPLATES[0];
      for (const t of EVENT_SEQUENCE_TEMPLATES) {
        roll -= t.weight;
        if (roll <= 0) { tpl = t; break; }
      }

      const sessionStart = new Date(Date.now() - randInt(rng, 0, daysWindow) * 86400_000 - randInt(rng, 0, 23) * 3600_000);
      const sessionId = `${DEMO_MARKERS.sessionIdPrefix}${u.id.slice(0, 8)}-${s}`;
      const anonymousId = `${DEMO_MARKERS.anonymousIdPrefix}${u.id.slice(0, 12)}`;
      let occurred = sessionStart;

      for (const ev of tpl.events) {
        const ctx: EventContext = {
          rng,
          anonymousId,
          userId: u.id,
          sessionId,
          platform: u.platform,
          occurredAt: occurred,
          locale: u.locale,
          familyId: null,
          subscriptionTier: rng() < 0.12 ? 'premium' : null,
        };
        const props = ev.propsBuilder ? ev.propsBuilder(ctx) : {};
        eventRows.push(buildEventRow({
          userId: u.id,
          anonymousId,
          sessionId,
          eventName: ev.name,
          occurredAt: occurred,
          platform: u.platform,
          locale: u.locale,
          props: { ...props, subscription_tier: ctx.subscriptionTier },
        }));
        occurred = new Date(occurred.getTime() + randInt(rng, 3_000, 180_000));
      }
    }
  }

  for (const chunk of chunks(eventRows, 500)) {
    const ins = await sb.schema('analytics').from('events').insert(chunk).select('id');
    if (ins.error) {
      result.errors.push(`events_insert: ${ins.error.message}`);
      break;
    }
    result.events_accepted += ins.data?.length ?? 0;
  }

  // ──────────────────────────────────────────────
  // 6. FACT_INTENT_BASKET — populate for /admin/intent-baskets
  // ──────────────────────────────────────────────
  const factRows = basketDrafts.slice(0, Math.min(basketDrafts.length, 2000)).map(b => {
    const chainTotals: Record<string, number> = {};
    for (const c of pickN(CHAINS, 5, rng)) {
      chainTotals[c] = Number((b.totalCost * randFloat(rng, 0.85, 1.25)).toFixed(2));
    }
    const sortedTotals = Object.entries(chainTotals).sort((a, b2) => a[1] - b2[1]);
    const cheapestChain = sortedTotals[0][0];
    const userChoseChain = b.storeName;
    const choseCheapest = userChoseChain === cheapestChain;
    const deltaNis = Number((chainTotals[userChoseChain] - chainTotals[cheapestChain]).toFixed(2));
    const didPurchase = rng() < 0.6;
    return {
      id:                       crypto.randomUUID(),
      user_id:                  b.user.id,
      anonymous_id:             `${DEMO_MARKERS.anonymousIdPrefix}${b.user.id.slice(0, 12)}`,
      family_id:                null,
      built_at:                 b.savedAt.toISOString(),
      compared_at:              new Date(b.savedAt.getTime() + 120_000).toISOString(),
      switched_at:              null,
      purchased_at:             didPurchase ? new Date(b.savedAt.getTime() + randInt(rng, 600_000, 3600_000)).toISOString() : null,
      abandoned_at:             didPurchase ? null : new Date(b.savedAt.getTime() + randInt(rng, 3600_000, 86400_000)).toISOString(),
      item_count:               b.items.length,
      total_nis_by_chain:       chainTotals,
      cheapest_chain:           cheapestChain,
      user_chose_chain:         userChoseChain,
      chose_cheapest:           choseCheapest,
      delta_nis_vs_cheapest:    deltaNis,
      eventually_purchased:     didPurchase,
      purchase_chain:           didPurchase ? userChoseChain : null,
      time_to_purchase_seconds: didPurchase ? randInt(rng, 600, 3600) : null,
    };
  });

  for (const chunk of chunks(factRows, 500)) {
    const ins = await sb.schema('analytics').from('fact_intent_basket').insert(chunk).select('id');
    if (ins.error) {
      result.errors.push(`fact_intent_basket_insert: ${ins.error.message}`);
      break;
    }
    result.fact_intent_baskets_created += ins.data?.length ?? 0;
  }

  result.duration_ms = Date.now() - t0;
  return result;
}

// ══════════════════════════════════════════════════════════════════
// CLEAR — reverses the seed, ONLY touching rows that match markers.
// ══════════════════════════════════════════════════════════════════
export interface ClearResult {
  users_deleted: number;
  preferences_deleted: number;
  baskets_deleted: number;
  basket_items_deleted: number;
  purchases_deleted: number;
  purchase_items_deleted: number;
  events_deleted: number;
  fact_intent_baskets_deleted: number;
  duration_ms: number;
  errors: string[];
}

export async function clearDemoData(): Promise<ClearResult> {
  const t0 = Date.now();
  const sb = adminSupabase();
  const result: ClearResult = {
    users_deleted: 0,
    preferences_deleted: 0,
    baskets_deleted: 0,
    basket_items_deleted: 0,
    purchases_deleted: 0,
    purchase_items_deleted: 0,
    events_deleted: 0,
    fact_intent_baskets_deleted: 0,
    duration_ms: 0,
    errors: [],
  };

  // Find every demo user first (we need their IDs to cascade deletes)
  const demoUsers = await sb.from('users').select('id').like('email', DEMO_MARKERS.emailPattern);
  if (demoUsers.error) {
    result.errors.push(`find_demo_users: ${demoUsers.error.message}`);
    result.duration_ms = Date.now() - t0;
    return result;
  }
  const userIds = (demoUsers.data ?? []).map(r => r.id as string);

  if (userIds.length === 0) {
    result.duration_ms = Date.now() - t0;
    return result;
  }

  // Purchase items (join via purchase_id -> we need purchase ids first)
  const purchaseIdsRes = await sb.from('purchase_history').select('id').in('user_id', userIds);
  const purchaseIds = (purchaseIdsRes.data ?? []).map(r => r.id as string);
  if (purchaseIds.length > 0) {
    for (const chunk of chunks(purchaseIds, 500)) {
      const del = await sb.from('purchase_items').delete({ count: 'exact' }).in('purchase_id', chunk);
      result.purchase_items_deleted += del.count ?? 0;
      if (del.error) result.errors.push(`purchase_items_delete: ${del.error.message}`);
    }
    for (const chunk of chunks(purchaseIds, 500)) {
      const del = await sb.from('purchase_history').delete({ count: 'exact' }).in('id', chunk);
      result.purchases_deleted += del.count ?? 0;
      if (del.error) result.errors.push(`purchase_history_delete: ${del.error.message}`);
    }
  }

  // Basket items -> baskets
  const basketIdsRes = await sb.from('saved_baskets').select('id').in('user_id', userIds);
  const basketIds = (basketIdsRes.data ?? []).map(r => r.id as string);
  if (basketIds.length > 0) {
    for (const chunk of chunks(basketIds, 500)) {
      const del = await sb.from('saved_basket_items').delete({ count: 'exact' }).in('basket_id', chunk);
      result.basket_items_deleted += del.count ?? 0;
      if (del.error) result.errors.push(`saved_basket_items_delete: ${del.error.message}`);
    }
    for (const chunk of chunks(basketIds, 500)) {
      const del = await sb.from('saved_baskets').delete({ count: 'exact' }).in('id', chunk);
      result.baskets_deleted += del.count ?? 0;
      if (del.error) result.errors.push(`saved_baskets_delete: ${del.error.message}`);
    }
  }

  // Preferences
  for (const chunk of chunks(userIds, 500)) {
    const del = await sb.from('user_preferences').delete({ count: 'exact' }).in('user_id', chunk);
    result.preferences_deleted += del.count ?? 0;
    if (del.error) result.errors.push(`user_preferences_delete: ${del.error.message}`);
  }

  // analytics.fact_intent_basket by user_id
  for (const chunk of chunks(userIds, 500)) {
    const del = await sb.schema('analytics').from('fact_intent_basket').delete({ count: 'exact' }).in('user_id', chunk);
    result.fact_intent_baskets_deleted += del.count ?? 0;
    if (del.error) result.errors.push(`fact_intent_basket_delete: ${del.error.message}`);
  }

  // analytics.events by user_id OR anonymous_id prefix (handles anon-only events too)
  for (const chunk of chunks(userIds, 500)) {
    const del = await sb.schema('analytics').from('events').delete({ count: 'exact' }).in('user_id', chunk);
    result.events_deleted += del.count ?? 0;
    if (del.error) result.errors.push(`events_delete_by_user: ${del.error.message}`);
  }
  const delByAnon = await sb.schema('analytics').from('events').delete({ count: 'exact' }).like('anonymous_id', `${DEMO_MARKERS.anonymousIdPrefix}%`);
  result.events_deleted += delByAnon.count ?? 0;
  if (delByAnon.error) result.errors.push(`events_delete_by_anon: ${delByAnon.error.message}`);

  // Finally delete the users themselves
  for (const chunk of chunks(userIds, 500)) {
    const del = await sb.from('users').delete({ count: 'exact' }).in('id', chunk);
    result.users_deleted += del.count ?? 0;
    if (del.error) result.errors.push(`users_delete: ${del.error.message}`);
  }

  result.duration_ms = Date.now() - t0;
  return result;
}

// ══════════════════════════════════════════════════════════════════
// STATUS — how much demo data is currently live
// ══════════════════════════════════════════════════════════════════
export interface DemoStatus {
  users: number;
  baskets: number;
  purchases: number;
  events: number;
  fact_intent_baskets: number;
  cities: Array<{ city: string; users: number }>;
  nameProfiles: Record<string, number>;
}

export async function demoStatus(): Promise<DemoStatus> {
  const sb = adminSupabase();
  const status: DemoStatus = {
    users: 0, baskets: 0, purchases: 0, events: 0, fact_intent_baskets: 0,
    cities: [], nameProfiles: {},
  };

  const usersRes = await sb.from('users').select('id', { count: 'exact', head: true }).like('email', DEMO_MARKERS.emailPattern);
  status.users = usersRes.count ?? 0;

  const usersFull = await sb.from('users').select('id, email').like('email', DEMO_MARKERS.emailPattern).limit(10000);
  const userIds = (usersFull.data ?? []).map(u => u.id as string);

  if (userIds.length === 0) return status;

  const basketsRes = await sb.from('saved_baskets').select('id', { count: 'exact', head: true }).in('user_id', userIds);
  status.baskets = basketsRes.count ?? 0;

  const purchasesRes = await sb.from('purchase_history').select('id', { count: 'exact', head: true }).in('user_id', userIds);
  status.purchases = purchasesRes.count ?? 0;

  const eventsRes = await sb.schema('analytics').from('events').select('id', { count: 'exact', head: true }).like('anonymous_id', `${DEMO_MARKERS.anonymousIdPrefix}%`);
  status.events = eventsRes.count ?? 0;

  const factRes = await sb.schema('analytics').from('fact_intent_basket').select('id', { count: 'exact', head: true }).in('user_id', userIds);
  status.fact_intent_baskets = factRes.count ?? 0;

  const prefsRes = await sb.from('user_preferences').select('location_city').in('user_id', userIds).limit(5000);
  const prefRows = (prefsRes.data as Array<{ location_city: string | null }> | null) ?? [];
  const cityCounts = new Map<string, number>();
  for (const p of prefRows) {
    const c = p.location_city ?? 'Unknown';
    cityCounts.set(c, (cityCounts.get(c) ?? 0) + 1);
  }
  status.cities = Array.from(cityCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([city, n]) => ({ city, users: n }));

  // Name-profile counts: cheap approximate via email local-part first-name
  const profileCounts: Record<string, number> = {};
  for (const u of (usersFull.data ?? [])) {
    const em = (u.email as string).toLowerCase();
    const profile = bucketFromEmail(em);
    profileCounts[profile] = (profileCounts[profile] ?? 0) + 1;
  }
  status.nameProfiles = profileCounts;

  return status;
}

function bucketFromEmail(email: string): string {
  if (/(sarah|rivka|leah|rachel|chaya|miriam|moshe|yehuda|avraham|shmuel|eliezer|yaakov|mordechai|menachem)/i.test(email)) return 'religious';
  if (/(alexander|dmitri|mikhail|vladimir|nikolai|sergei|boris|anna|tatiana|olga|svetlana|natalia)/i.test(email)) return 'russian';
  if (/(ahmad|mohammed|omar|khalil|samir|fatima|layla|nadia|mariam|salma)/i.test(email)) return 'arab';
  return 'secular';
}

// ══════════════════════════════════════════════════════════════════
// Helpers
// ══════════════════════════════════════════════════════════════════
function* chunks<T>(arr: T[], size: number): Generator<T[]> {
  for (let i = 0; i < arr.length; i += size) yield arr.slice(i, i + size);
}

function buildEventRow(opts: {
  userId: string | null;
  anonymousId: string;
  sessionId: string;
  eventName: string;
  occurredAt: Date;
  platform: string;
  locale: string;
  props: Record<string, unknown>;
}): Record<string, unknown> {
  const category = opts.eventName.split('.')[0];
  const occurredIso = opts.occurredAt.toISOString();
  return {
    event_id:        crypto.randomUUID(),
    event_name:      opts.eventName,
    event_category:  category,
    event_version:   1,
    occurred_at:     occurredIso,
    received_at:     new Date().toISOString(),
    day:             occurredIso.slice(0, 10),
    user_id:         opts.userId,
    anonymous_id:    opts.anonymousId,
    session_id:      opts.sessionId,
    device_id:       null,
    platform:        opts.platform,
    app_version:     '1.0.0-demo',
    os_version:      null,
    locale:          opts.locale,
    subscription_tier: null,
    family_id:       null,
    props:           { ...opts.props, [DEMO_MARKERS.eventPropKey]: true },
    ip_hash:         null,
  };
}
