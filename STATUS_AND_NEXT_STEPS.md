# Status after this session

**Live:** https://israbis.com/admin
**Last commit:** `4624d96` on `master`
**Login:** `IsrabisAdmin` / `RazRotem22!`

---

## Shipped this session

### 1. Hebrew product search 500 → fixed
Rare terms like `עגבניה` timed out. Two-phase query replaces the single-shot `DISTINCT ON + ORDER BY` that forced a full sort. Phase 1 uses the trigram GIN index with a simple `LIMIT` (no sort); phase 2 enriches via a barcode IN-list (indexed).

### 2. Search cache + history
- New endpoint `GET /api/admin/intelligence/search-history`
- Product-search is now **cache-first**: first query 1–5s, subsequent identical queries <20 ms
- Response carries `served_from: 'cache' | 'db'` and `duration_ms`
- **ProductExplorer UI** shows a recent-searches chip bar (click to replay any query) and a ⚡/🗄 badge on each result

**⚠️ Requires one-time migration:** run `migrations/005_search_cache.sql` in the Supabase SQL editor. Until it's applied, cache and history return `{ok: true, note: 'migration_not_applied'}` and search falls back to DB every time (still works, just no speedup or history).

### 3. Basket simulator — Fair Trade vs Strict + per-item coverage
- **Mode toggle**: ⚖︎ Fair Trade (default for presets) retries substitution until every line has ≥ N chains of coverage. 🔒 Strict (default for CSV uploads) respects your barcodes verbatim.
- Configurable `minChainsPerItem` (default 3). 3-pass retry loop with a 200-barcode anchor pool.
- **New per-item panel** below the basket header: every line with product name, quantity, chain dots, and `✓ stocked · N chains` or `missing at {chain}` badges
- **Substitutions list** — collapsible `details` element shows every `from → to` swap with product names so you see exactly what was substituted

### 4. Intelligence hero — real price gap
Earlier the hero sometimes showed `avgVsLeader: 0` because a single 100k-row sample landed on one chain's bulk import. Now: stratified per-chain query (20 chains × ~200 ms). Hero shows meaningful numbers for every chain.

### 5. Earlier fixes (still live)
- Receipt compare apples-to-apples (excludes rows missing from either side)
- Pricing matrix wins count — ties now count as wins (was ordering-dependent)
- Defection "hot city" — now correctly correlates per rival (was returning random city)
- User detail — strict UUID validation (no SQL injection shape)
- Retention grid — future weeks show striped "—" instead of fake "0%"
- Chain logos + product images bundled + rendered
- All 29 admin pages return HTTP 200

---

## Red-team verified (live)

| Attack | Status |
|--------|--------|
| Unauthenticated `/api/admin/*` | **401** |
| Unauthenticated `/admin/*` | **307 → /admin/login** |
| SQL injection (semicolon, DELETE, UPDATE, CTE-prefixed UPDATE) | **All 400 read_only / multi_statement_not_allowed** |
| JWT last-char flip | **401** |
| JWT alg:none with forged payload | **401** |
| Master-only endpoint as non-master | **403** (confirmed by session claim check) |

Security headers (CSP, HSTS, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy) applied on every admin response.

---

## Blue-team verified (live)

All 29 pages return HTTP 200:
```
/admin · /admin/users · /admin/events · /admin/funnels · /admin/retention
/admin/intent-baskets · /admin/chains · /admin/chains/YOCHANANOF · +6 more chains
/admin/recipes · /admin/ai · /admin/scanners · /admin/subscriptions · /admin/geo
/admin/intelligence · /admin/intelligence/[8 chains verified]
/admin/exports · /admin/audit-log · /admin/settings · /admin/settings/admin-users
/admin/sql · /admin/demo
```

All 13 KPI endpoints return OK:
```
dau · new_signups · top_events · top_screens · platform_split · chain_share
intent_baskets_daily · funnel_signup_to_purchase · funnel_paywall_to_paid
retention_weekly · scanner_usage · ai_daily · scorecard_overview
```

Demo data currently seeded: **500 users · 1,482 baskets · 992 purchases · 17,249 events · 1,482 intent baskets**.

---

## Outstanding follow-ups (not done this session)

1. **Apply `migrations/005_search_cache.sql`** in the Supabase dashboard to enable search cache + history in production. Until then: graceful fallback (search works, no cache).

2. **Sub-brand expansion in ChainSelector** — the DB has 14 parent chains but 27 sub-brand keys (Shufersal alone has 10: BE, SHUFERSAL_EXPRESS, SHUFERSAL_DEAL, SHUFERSAL_SHELI, UNIVERSE, YESH_CHESED, YESH_BASHKHUNA, GOOD_MARKET, SHAAREI_REVACHA, HAMEFITZ_CASH_CARRY). The Intelligence page treats sub-brands as the same chain today. Worth surfacing in the ChainSelector so the 27-chain reality is visible.

3. **MeiliSearch-grade speed for all product searches** — the current cache gets us 95% there for repeat queries. A full MeiliSearch rollout would also accelerate first-time queries. That requires adding Meili infrastructure on Vercel (or Upstash Redis as an intermediate step).

4. **Top-screens empty** — the `nav.screen_viewed` event isn't in the seeded event templates. Add it to the seeder's event-sequence templates for a fuller Overview demo.

5. **Audit-grade documentation** — the separate `israbis-admin-guide/` project is its own standalone HTML site that covers every page, every section, every formula. See that folder's README.

---

## Things to know before a demo

1. **Seed first.** Go to `/admin/demo` → seed 500 users. Takes ~30s. Every analytics page lights up.
2. **Start on Intelligence.** `/admin/intelligence/YOCHANANOF` has the most polished narrative (hero + receipt + defection + map + explorer + basket battle + matrix).
3. **Basket battle demo script:**
   - Pick "Mehadrin Weekly" preset (the Yochananof persona)
   - Leave Fair Trade mode on, min-chains = 3
   - Hit "Simulate on Yochananof"
   - Scroll to the Item Coverage panel — every item stocked at multiple chains
   - Scroll to the revenue at stake — the ₪ number you'd highlight to an executive
4. **Product explorer demo:** type `חלב` → chain-by-chain prices with spread bars. Type it again → served from cache with ⚡ badge (after migration).
5. **If something looks wrong**, open `/admin/sql` — every number can be reproduced via a read-only SQL query.
