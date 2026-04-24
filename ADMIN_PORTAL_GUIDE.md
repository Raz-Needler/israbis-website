# IsraBis Admin Portal — The Complete Guide

**Last updated:** 2026-04-24
**Production URL:** https://israbis.com/admin
**Who this is for:** Anyone who opens the admin portal — founders, analysts,
commercial leads, investors on demo night. No engineering background needed.

---

## 1 · What this portal is

The IsraBis admin portal is the window into everything that happens on the
IsraBis platform — **the users, the recipes, the shopping baskets, the price
comparisons, the money that moves between supermarkets, and the content
users create**. It has two main jobs:

1. **Tell the story of a chain.** Pick Yochananof (or Shufersal, Rami Levy,
   any chain) and see what shoppers compared, where they bought, who beat
   you on price, and which cities are your battleground.
2. **Operate the platform.** See who signed up today, whose app crashed,
   which recipe went viral, which scanner is misfiring — with real-time
   KPIs, exports, SQL, and an audit trail.

Data lives in three places:

- **`public.*`** — the production database. Users, baskets, purchases,
  recipes, store branches, prices.
- **`analytics.*`** — everything that happens in the app: clicks, scans,
  comparisons, purchases, AI messages. Populated by the `/api/analytics/
  ingest` endpoint that the mobile SDK hits.
- **`admin.*`** — the portal's own tables: admin_users, sessions, audit
  log, a read-only SQL sandbox function.

If `analytics.events` is empty, the live-telemetry pages (Events, Funnels,
Retention, Intent Baskets, etc.) will show empty states with a link to
**/admin/demo** where you can seed a 500-user synthetic population in about
30 seconds. That synthetic data is tagged with markers (`email LIKE
'demo.%@isrbs.test'`, `props->>'is_demo' = 'true'`, etc.) so you can wipe
it cleanly and never touch real users.

---

## 2 · How the portal is organized

The sidebar groups pages by purpose:

| Group | Pages | What you'll find |
|-------|-------|------------------|
| **Core** | Overview, Users, Events | Platform heartbeat + drill-downs |
| **Analytics** | Funnels, Retention, Intent Baskets | Behavior analysis, conversion math |
| **Product** | Intelligence, Chains, Recipes, Miki AI, Scanners, Geography | Story pages for each product surface |
| **Revenue** | Subscriptions | Conversion, plans, churn |
| **Ops** | SQL Console, Exports, Audit Log, Settings, Simulated Data | Master-only ops tools |

**Core rule:** every number you see was computed from either the production
`public.*` tables, the `analytics.events` stream, or the
`analytics.fact_intent_basket` fact table. Each section below lists exactly
which source powers it.

---

## 3 · Page-by-page — what every section does

### 3.1 · Overview (`/admin`)

**Purpose:** the operational heartbeat. One screen, "is everything working?"

| Section | What it shows | Where it comes from | Units |
|---------|---------------|---------------------|-------|
| **App users · total** | Count of rows in `public.users` | Real exact count | users |
| **Stores tracked** | Count of rows in `public.store_branches` | Real exact count | stores |
| **Prices in DB** | **Approximate** count of `public.product_prices` (the table has 4.5M rows; exact COUNT would time out, so we use the PostgreSQL query planner's estimate — accurate to within ~1%) | Planner estimate | prices |
| **Signups today** | Users whose `join_date >= today 00:00` | `public.users` | users |
| **DAU today / yesterday / Δ** | Distinct `(user_id, anonymous_id)` seen today vs yesterday, and % change | `analytics.events` grouped by `day` | users |
| **WAU / MAU** | Distinct users active in last 7 / 30 days | `analytics.events` | users |
| **Events today** | Total events fired today | `analytics.events` | events |
| **Paid conversions today** | Count of `subs.checkout_completed` events today | `analytics.events` | events |
| **Activity · 30 days** | Daily DAU + daily signup line, overlayed | `analytics.events` + `public.users.join_date` | users/day |
| **Platform split · 7 days** | Events grouped by platform | `analytics.events.platform` | events |
| **Top events / Top screens** | Ranked by volume, last 7 days | `analytics.events` grouped by `event_name` / `props->>'screen_name'` | events |

**How to read:** if the top stat cards say 0 and the "SDK not live yet"
pill is visible, your mobile SDK hasn't wired up yet — go to **/admin/demo**
and seed, or wait for real traffic.

**Known caveat:** DAU counts `COALESCE(user_id, anonymous_id)`. If the same
device anonymously browses then logs in, that's 2 distinct ids → small
over-count. Negligible in practice.

---

### 3.2 · Users (`/admin/users`)

**Purpose:** search any user. See signup trends.

| Section | What it shows | Source |
|---------|---------------|--------|
| **Total users** | All-time user count | `public.users` |
| **New · 7 days** | Count of users with `join_date` in last 7 days | `public.users` |
| **New Δ vs prior 7d** | % change week-over-week | `public.users` |
| **Email auth / OAuth** | Provider split | `public.users.provider` |
| **Signup chart · 30 days** | Daily signup count | `public.users` bucketed by day |
| **User list (paginated)** | 50/page, sorted by join date DESC | `public.users` |

**Filters:** search by name/email (ILIKE), filter by provider
(`email | google | apple`). Filters carry across pagination via URL.

**How to simulate:** clicking any user row opens the user-detail page.
Use **/admin/demo** to seed 500 users distributed across real Israeli
cities with mixed auth providers.

---

### 3.3 · User Detail (`/admin/users/[id]`)

**Purpose:** everything about one user. Profile, purchases, recipes,
family, events timeline.

| Section | What it shows | Source |
|---------|---------------|--------|
| **Profile card** | Name, email, provider, joined, city, bookmarks count | `public.users` + `public.user_preferences` |
| **Purchases logged** | Count of `public.purchase_history` for this user | `public.purchase_history` |
| **Total spent (NIS)** | Sum of `total_cost` across purchases | `public.purchase_history` |
| **Recipes created** | Count of `public.user_recipes` | `public.user_recipes` |
| **Events · last 30 days** | All events this user fired | `analytics.events` filtered by `user_id` |
| **Activity chart** | Daily event count | `analytics.events` grouped by day |
| **Recent purchases** | Last 20 purchases with store + total | `public.purchase_history` |
| **Family membership** | Family groups user belongs to | `public.family_members` → `public.families` |
| **Event timeline** | Last 100 events with full props JSON | `analytics.events` |

**Security:** user id in URL is validated as a strict UUID before any DB
read. Non-UUID inputs 404.

---

### 3.4 · Events (`/admin/events`)

**Purpose:** raw event stream browser. Filter by name, category, user,
platform, time window.

| Filter | What it does | Notes |
|--------|--------------|-------|
| **event_name** | Exact match on event_name | e.g. `cart.item_added` |
| **category** | Exact match on `event_category` | e.g. `cart`, `ai`, `scan` |
| **user_id** | Exact match | Use to find one user's full stream |
| **platform** | ios / android / web / server | None = all |
| **days** | 1 / 7 / 30 / 90 | Filters by `day >= current_date - N` |

**Table columns:** Occurred (timestamp), Event (event_name), Platform,
User (or `anon:...` for anonymous), Props (JSON, ellipsis-truncated).

**Pagination:** 100 events per page.

**Empty state:** when no events exist for the window, shows the
**/admin/demo** callout with one-click seed suggestion.

---

### 3.5 · Funnels (`/admin/funnels`)

**Purpose:** track multi-step user journeys — signup→purchase,
paywall→paid, scan→import, family growth, AI engagement, intent loop.

**Six pre-built funnels:**
1. `signup_to_purchase`: signup_completed → item_added → compared → purchase_confirmed
2. `paywall_to_paid`: paywall_viewed → checkout_started → checkout_completed
3. `scan_to_cart`: scan.receipt.started → processed → imported_to_cart
4. `family_growth`: family.created → invite_sent → invite_accepted → member_joined
5. `ai_engagement`: ai.opened → message_sent → response_received → tool_called
6. `intent_loop`: item_added → compared → chain_switched → purchase_confirmed

**Per-step value:** `COUNT(DISTINCT anonymous_id)` over the time window.

**End-to-end %:** `(last step users / first step users) × 100`.

**Important caveat:** these funnels count users at each step independently
— NOT the same user flowing through. If 100 users signed up and 50 different
users confirmed a purchase, the funnel shows "50% conversion" even though
zero signed-up users actually bought. For a true same-user funnel, use the
Intent Baskets page which uses the `fact_intent_basket` table where each
row is one user's complete journey.

**Filter:** days (7/30/90/180).

---

### 3.6 · Retention (`/admin/retention`)

**Purpose:** weekly cohort grid. "Of the users who first appeared in week
X, how many came back in week X+1, X+2, …?"

| Cell | Meaning |
|------|---------|
| **Green cell with %** | That cohort had that % of its users active that week. Darker green = stronger retention. |
| **Grey cell with "0%"** | That week elapsed; nobody from that cohort was active. |
| **Striped "—" cell** | That week hasn't happened yet for that cohort (e.g. a cohort 2 weeks old can't have a week-10 retention number). |

**How a cohort is defined:** users are grouped by the ISO week of their
first-ever event. `anonymous_id` is used so we catch users pre-signup.
Caveat: a user who clears their app cache gets a new anonymous_id and
appears as a brand-new cohort member.

**Stat cards:**
- **Cohorts in window** — distinct cohort weeks with any data
- **Avg Week-1 retention** — mean of (week1_users / cohort_size) × 100
  across all cohorts that have reached week 1
- **Window** — time filter (30 / 60 / 90 / 180 / 365 days)

---

### 3.7 · Intent Baskets (`/admin/intent-baskets`)

**Purpose:** the crown jewel — the entire shopping journey from "built a
basket" to "actually bought at a specific chain", condensed into one row
per basket in `analytics.fact_intent_basket`.

**Each row's shape:**
- `built_at / compared_at / switched_at / purchased_at / abandoned_at`
- `item_count`
- `total_nis_by_chain` (JSONB, e.g. `{"RAMI_LEVY": 234.5, "SHUFERSAL": 251.8}`)
- `cheapest_chain`, `user_chose_chain`, `chose_cheapest` (bool)
- `delta_nis_vs_cheapest` (how much the user overspent by not picking cheapest)
- `eventually_purchased` (bool), `purchase_chain`, `time_to_purchase_seconds`

**Sections:**
| Section | Formula |
|---------|---------|
| Baskets built | `COUNT(*)` |
| Intent → purchase | `COUNT(*) FILTER (WHERE eventually_purchased)` |
| Intent → purchase % | purchased / total × 100 |
| Picked cheapest % | `chose_cheapest` / total × 100 |
| Avg Δ vs cheapest | `AVG(delta_nis_vs_cheapest)` |
| Avg time → purchase | `AVG(time_to_purchase_seconds) / 3600` |
| Volume chart | Daily count of `built_at` |
| Distribution vs cheapest | Buckets: picked cheapest / 0–10 / 10–25 / 25–50 / 50+ NIS more |
| Top chains chosen | `user_chose_chain` frequency |
| Top cheapest chains | `cheapest_chain` frequency |
| Recent baskets | Last 100 with full columns |

**Filter:** days + optional chain filter (applied to `user_chose_chain`).

---

### 3.8 · Chain Intelligence (`/admin/intelligence/[chainKey]`)

**This is the executive-presentation page.** Pick a chain from the pill
bar; every number on the page recomputes for that chain.

#### The Hero

Three giant numbers + a win/loss ribbon:

| Number | Formula | Data |
|--------|---------|------|
| **Price gap vs cheapest rival** | `target.avg_shelf_price − cheapest.avg_shelf_price` | Sample of 100K most-recently-updated product_prices rows (enough to stabilize chain averages; small chains like YOCHANANOF are explicitly re-queried to guarantee they appear) |
| **Per household / year** | `avg_gap × 50 baskets/year` | Heuristic: 50 baskets/year = roughly one weekly shop |
| **Baskets lost to rivals** | `COUNT(*) FROM fact_intent_basket WHERE target_chain was in compared set AND user_chose_chain ≠ target AND eventually_purchased` | `analytics.fact_intent_basket` |
| **Revenue at stake** (inside Defection panel) | `SUM(delta_nis_vs_cheapest)` over those defected baskets | same |
| **Shelf wins / losses** | `wins = count(matrix rows where target's price ≤ minimum price); losses = count(where target's price > minimum)` — ties count as wins | Pricing matrix (40 sampled barcodes, see below) |

#### The Receipt (Basket Comparison)

The side-by-side pitch-deck moment. Left column: target chain; right
column: market leader. Every line shows: product image (from the Rami
Levy CDN by barcode), product name, both prices, colored delta.

**Important:** both totals sum **the same** 10 items — we only use
products stocked by both chains so this is apples-to-apples. If target
doesn't carry an SKU that the rival does, that SKU is excluded from the
comparison, not charged to target's basket with a fake price.

**Rows are sorted by biggest target-vs-winner delta first** — so the
receipt leads with the worst gaps.

#### Where the Money Went (Defection Analysis)

Reads `analytics.fact_intent_basket` for every basket that (a) included
target in its chain comparison, (b) resulted in a purchase, (c) bought
somewhere other than target.

Per rival chain:
- `baskets_lost` — count of defections to this rival
- `avg savings/basket` — `AVG(delta_nis_vs_cheapest)` for those baskets
- `total ₪ gone` — `SUM(delta_nis_vs_cheapest)` (revenue on the floor)
- `hot city` — **per-rival top city** (most common `location_city` of
  users who defected specifically to THIS rival). Earlier the query
  pulled a random defection city; that's fixed now.

#### Branch Map

Custom SVG of Israel (29.5–33.4°N, 34.2–35.9°E). Each dot = one branch.
Target chain rendered in its brand color; top-3 profile competitors in
grey. Toggle between **Target / Rivals / Both**. Side panel lists the
target's top 8 cities by branch count.

#### Story Card + Competitive Radar + Battleground Cities

- **Story card:** narrative that templates profile metadata (archetype,
  positioning, culture fit, weaknesses) with live numbers (branches,
  cities, SKU count, avg shelf price vs leader).
- **Radar (5-axis):** Coverage, Price, Assortment, City reach, Win rate
  — all scaled 0–100 where 100 = market-best.
- **Battleground cities:** cities where target + at least one
  profile-defined competitor both operate. Sorted by total chain density
  in the city.

#### Cross-chain Product Search

Type any Hebrew product name (e.g. `חלב`, `עגבניות`) or EAN-13 barcode.
Every matching product shows its price at every chain that stocks it,
a per-chain horizontal bar, the cheapest-chain badge, and a
"spread ₪X" pill = `max − min`. Biggest spreads bubble to the top.

Search type detection: all-digits 5+ chars = exact barcode lookup; else
a Hebrew/English substring match against `product_name`.

#### Basket Battle Simulator

Pick a preset basket (Shabbat Dinner, Everyday Essentials, Mehadrin
Weekly, Family 30-Day) OR upload a CSV (`barcode,quantity[,name]`).

**What happens:**
1. Resolve each barcode's price at every chain via `public.product_prices`.
2. If a preset barcode isn't in the DB, substitute a real-barcode
   anchored on the target chain (best-effort fuzzy fallback).
3. Compute total cost per chain, rank chains, find the winner.
4. Compute the top-3 "winning adjustments" — products that explain the
   biggest share of target's basket gap, with the specific ₪ drop per
   unit target would need.
5. Compute revenue at stake: `projected buyers × basket value ×
   (target's potential share − current share)`.

**Scenario inputs:** user count (100 – 10M), conversion % (0.1–100%).
These drive the revenue-at-stake calculation but don't affect who wins
the basket.

#### Full Pricing Matrix

40 widely-stocked barcodes (sampled via the target chain's own catalog
since it's indexed and fast). For each row:
- Product image + name + barcode
- Target's price (— if not stocked)
- Winner chain + price
- Delta (+₪X red if target overpays, "win" if target is cheapest)
- Verdict: Winning shelf / Losing by thin margin / Losing by wide margin
  / Not stocked

Under the table: summary chips (wins / losses / not stocked) + top-5
biggest price gaps with "drop to ₪X to beat rival" guidance.

---

### 3.9 · Chains (`/admin/chains`)

**Purpose:** the switching market. Who's gaining users from whom,
auto-cart integration health per chain.

| Section | Source | Formula |
|---------|--------|---------|
| Chain selection share (stacked area) | `analytics.events` where `event_name = 'cart.chain_switched'` | Daily count grouped by `props->>'to_chain'` |
| Top chains by switches in | same | `COUNT(*)` per `to_chain` |
| Auto-cart success rate | `analytics.events` — `chain.auto_cart_completed` vs `chain.auto_cart_failed` | `success / (success + failure)` |
| Branches by chain | `public.store_branches` | `COUNT(*) GROUP BY chain_key` |
| Stat cards | as above | — |

**Important:** the stacked area chart only plots the top-6 chains by
destination volume. Smaller chains that appear infrequently will show up
as zero-height bands on this specific chart (not a bug — just a design
choice to keep it readable).

Click any chain pill under the branches chart to drill into
`/admin/chains/[chainKey]`.

---

### 3.10 · Chain detail (`/admin/chains/[chainKey]`)

**Per-chain deep dive.**

- **Switches IN — daily volume:** `cart.chain_switched` where
  `to_chain = [chain]`
- **Users came FROM:** top source chains in
  `props->>'from_chain'`
- **Users left TO:** top destination chains (the outbound flow for
  this chain when it WAS the source)
- **Auto-cart performance:** same formula as the index page, scoped
- **Branches table:** full roster with lat/lng + active status

---

### 3.11 · Recipes (`/admin/recipes`)

**Purpose:** recipe engagement (catalog + user-generated content).

| Section | Source | Notes |
|---------|--------|-------|
| Recipes (catalog) | `public.recipes` count | Static catalog |
| User-created recipes | `public.user_recipes` count | UGC |
| Total likes | `public.likes` count | All-time |
| Top cooked | `recipe_social_stats.times_cooked` | Aggregated column |
| Most cooked (chart) | Top 15 by `times_cooked` | |
| Most viewed · 30 days | Top 15 by `COUNT(*)` from `analytics.events` where `event_name = 'recipe.viewed'` | Requires SDK |
| Engagement leaders | Top 15 recipes with likes, upvotes, rating, comments | From social_stats |

**Caveat:** views count raw events (no dedupe). Five views by one user =
5 in the view count. To get unique viewers, query
`COUNT(DISTINCT anonymous_id)` via SQL Console.

---

### 3.12 · Miki AI (`/admin/ai`)

**Purpose:** how much users use the AI assistant, what tools it's calling,
and how fast it responds.

| Section | Source |
|---------|--------|
| Conversations (total) | `public.assistant_conversations` count (all-time, not windowed) |
| Messages (total) | `public.assistant_messages` count (all-time) |
| Avg / P95 latency | `AVG(props->>'latency_ms')` / `PERCENTILE_DISC(0.95)` from `ai.response_received` events |
| Messages per day | Daily count of `ai.message_sent` |
| AI DAU | Daily `COUNT(DISTINCT user_or_anon)` from `ai.message_sent` |
| Tool-call frequency | Events with `event_name = 'ai.tool_called'`, grouped by `props->>'tool'`, top 10 |

**Caveat:** conversation/message totals ignore the days filter — they're
all-time. The chart + tool/latency metrics DO respect the window.

---

### 3.13 · Scanners (`/admin/scanners`)

**Purpose:** all four scanners (calorie, fridge, receipt, barcode) in one
page. Event volume + OCR quality.

| Section | Source |
|---------|--------|
| Calorie / fridge scans | `public.api_usage.count` per feature |
| Receipt scans | `public.receipt_scans` count |
| Receipt OCR confidence | `AVG(confidence)` over last 50 receipts |
| Added to expenses | % of last 50 receipts with `added_to_expenses = true` |
| Scan events per day | `analytics.events` where `event_category = 'scan'`, daily |
| Events by type | Grouped by `event_name` within category `scan` |
| Recent receipt scans table | Last 20 of latest 50 rows |

**Caveat:** OCR stats are over the last 50 receipts, not all-time. If
receipt quality improved recently, this rating is optimistic.

---

### 3.14 · Subscriptions (`/admin/subscriptions`)

**Purpose:** paywall → paid funnel, plan selection, churn.

| Section | Source |
|---------|--------|
| Checkout funnel | 3 steps in `analytics.events`: `subs.paywall_viewed` → `checkout_started` → `checkout_completed`. Each step = `COUNT(DISTINCT anonymous_id)` |
| Checkouts per day | Daily count of `subs.checkout_completed` |
| Plans chosen | `COUNT(*) GROUP BY props->>'plan'` from `checkout_completed` |
| Family tier distribution | `public.families.subscription_tier` counts (NULL treated as `basic`) |
| Cancellations | Count of `subs.cancelled` events in window |

**Caveat:** family tier distribution is all-time cumulative. Conversion %
is windowed. Don't directly subtract one from the other.

---

### 3.15 · Geography (`/admin/geo`)

**Purpose:** where branches and users are in Israel.

| Section | Source |
|---------|--------|
| Branch map | `public.store_branches.lat / lng / chain_key` projected to SVG |
| Top cities — branches | `COUNT(*) GROUP BY city` (top 20) |
| Top cities — users | `public.user_preferences.location_city` grouped (top 20) |
| Stat cards | totals from the same sources |

**Caveats:**
- `user_preferences.location_city` is free-text — typos and variants
  ("Tel Aviv" vs "TLV") count separately.
- The SVG projection is a simple linear scaling (fine for Israel's size;
  would distort at country/continent scale).

---

### 3.16 · SQL Console (`/admin/sql`) · master only

**Purpose:** run ad-hoc SELECT queries against the entire data warehouse.

**Safety rules (enforced server-side):**
- Only `WITH` or `SELECT` allowed (regex-enforced)
- No semicolons (blocks multi-statement)
- Mutation keywords (`INSERT/UPDATE/DELETE/DROP/...`) rejected
- Auto-appends `LIMIT 5000` if none present
- 30s statement timeout (the RPC layer enforces this)
- Every query audit-logged in `admin.admin_audit`

**Tips:**
- Use `analytics.fact_intent_basket` for any basket-level analysis —
  it's the pre-aggregated gold table.
- Full-table GROUP BY on `public.product_prices` (4.5M rows) will time
  out. Use a chain-anchored CTE:
  ```sql
  WITH sample AS (
    SELECT DISTINCT ON (barcode) barcode, product_name
    FROM public.product_prices
    WHERE chain_key = 'RAMI_LEVY' AND price_nis > 0
    ORDER BY barcode, last_updated DESC
    LIMIT 40
  )
  SELECT pp.barcode, pp.chain_key, MIN(pp.price_nis)
  FROM public.product_prices pp JOIN sample USING (barcode)
  GROUP BY pp.barcode, pp.chain_key
  ```

---

### 3.17 · Exports (`/admin/exports`)

**Purpose:** download any dataset as CSV or XLSX. Audit-logged.

**Available datasets:**
- `intent_baskets` — up to 250K rows from `fact_intent_basket`
- `events` — up to 250K event rows
- `users` — up to 250K rows from `public.users`
- `purchases` — up to 250K rows from `public.purchase_history`
- `families` — up to 250K rows from `public.families`
- `prices` — up to 100K rows from `public.product_prices`
  (capped lower because the table is 4.5M rows)

Each export is logged to `admin.admin_audit` with the dataset name,
format, row count, and duration.

---

### 3.18 · Audit Log (`/admin/audit-log`)

**Purpose:** every admin action is logged here. Append-only.

| Column | Meaning |
|--------|---------|
| Occurred | Timestamp |
| Who | Admin username (resolved from `admin_user_id`) |
| Action | Action key (e.g. `admin.login_succeeded`, `admin.query_executed`, `admin.demo_seed`) |
| Target | Optional target type + id (e.g. `dataset: intent_baskets`) |
| Metadata | JSON with action-specific details (SQL preview, row count, duration) |

Filter by action, paginated 100/page.

Top-section shows the most frequent actions in the last 7 days.

---

### 3.19 · Settings (`/admin/settings`) + sub-pages

- **/admin/settings** — view your account details + portal config.
- **/admin/settings/admin-users** (master only) — list of admin accounts
  with roles + security status.
- **/admin/settings/rotate-password** — change password. Enforces
  ≥12 chars, not equal to current, confirm match.

---

### 3.20 · Simulated Data (`/admin/demo`) · master only

**Purpose:** the whole portal needs data to look good. This page lets
you spin up a synthetic population without touching real users.

**Controls:**
- User count (10–5000)
- Baskets per user (0–20)
- Purchases per user (0–20)
- Events per user (0–500)
- Days window (7–365)

**What it writes:**
- `public.users` — with emails `demo.<name>.<uid>@isrbs.test`
- `public.user_preferences` — city + lat/lng in real Israeli locations
  (weighted by population + demographic profile, e.g. Bnei Brak heavy
  for Haredi personas)
- `public.saved_baskets` + `public.saved_basket_items`
- `public.purchase_history` + `public.purchase_items`
- `analytics.events` — six realistic user-journey templates
- `analytics.fact_intent_basket` — pre-aggregated intent rows

**Markers — the ONLY thing that identifies a row as demo:**
- Users: `email LIKE 'demo.%@isrbs.test'`
- Baskets: `name LIKE '[DEMO] %'`
- Purchases: `notes = '[demo]'`
- Events / fact rows: `anonymous_id LIKE 'demo-anon-%'` OR
  `props->>'is_demo' = 'true'`

**Wipe:** clicking **Delete all demo data** sends `{"confirm":
"DELETE_ALL_DEMO"}` to `/api/admin/demo/clear`. It deletes every row
matching the markers above. **Production users + events never have
these markers, so they are never touched.**

**Rate limit:** 3 seeds per admin per 5 minutes to prevent runaway loops.

---

## 4 · Data dictionary — key tables

### `public.users`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| name | text | |
| email | text UNIQUE | |
| password_hash | text? | null for OAuth |
| provider | text | `email / google / apple` |
| avatar_color | text | hex |
| join_date | timestamp | signup moment |
| created_at / updated_at | timestamp | |

### `public.user_preferences`
| Column | Notes |
|--------|-------|
| user_id | FK → users.id |
| dark_mode, notifications | booleans |
| preferred_store | chain_key |
| location_city | Hebrew city name (free-text) |
| location_lat / location_lng | numeric, unencrypted |
| location_encrypted | AES-GCM JSON of `{lat,lng}` (privacy-compliant) |

### `public.saved_baskets` + `saved_basket_items`
- One basket per row, each with N items.
- Items carry `ingredient_name`, `amount`, `price_nis`, `product_id` (barcode).

### `public.purchase_history` + `purchase_items`
- Confirmed purchases. Cascade-related to their items.

### `public.store_branches`
| Column | Notes |
|--------|-------|
| chain_key | e.g. `YOCHANANOF`, `SHUFERSAL` |
| sub_brand_key | e.g. `SHUFERSAL_DEAL`, `UNIVERSE` |
| city / address / lat / lng | |
| is_active | bool |

### `public.product_prices` (4.5M rows)
- One row per `(barcode, chain_key, store_id)`.
- `price_nis`, `product_name`, `unit_qty`, `unit_measure`, `last_updated`.
- Indexes: `(barcode)`, `(barcode, chain_key, store_id)`, `(chain_key, store_id)`, `(last_updated)`, GIN trigram on `product_name`.
- **Rule:** never do `GROUP BY barcode` over the whole table — it times
  out. Always scope with a chain_key or a barcode list first.

### `analytics.events`
The event stream. Every event has:
- `event_id` UNIQUE (idempotency)
- `event_name` (e.g. `cart.item_added`)
- `event_category` (the part before the `.`)
- `user_id?` + `anonymous_id` (always)
- `session_id?`, `device_id?`
- `platform` (ios / android / web / server)
- `props` JSONB (anything the app wants to attach)
- `occurred_at`, `received_at`, `day`
- `ip_hash` (SHA-256, truncated — no PII)

### `analytics.fact_intent_basket`
One row per intent-basket, pre-aggregated by the ingestion pipeline.
- `built_at / compared_at / switched_at / purchased_at / abandoned_at`
- `total_nis_by_chain` (JSONB map)
- `cheapest_chain`, `user_chose_chain`, `chose_cheapest` (bool)
- `delta_nis_vs_cheapest`, `eventually_purchased`, `purchase_chain`
- `time_to_purchase_seconds`

---

## 5 · Glossary of every metric shown anywhere

| Metric | Formula | Unit |
|--------|---------|------|
| **DAU / WAU / MAU** | Distinct (user_id OR anonymous_id) active in last 1 / 7 / 30 days | users |
| **Signups today** | `public.users.join_date >= today` count | users |
| **End-to-end funnel %** | `lastStep / firstStep × 100` (NOT same-user) | % |
| **Week-N retention** | `active_in_week_N / cohort_size × 100` | % |
| **Price gap vs cheapest** | `target.avg_price - cheapest_chain.avg_price`, sampled 100K rows | ₪ |
| **Per-household yearly overpayment** | `avg_gap × 50 baskets/year` | ₪/year |
| **Baskets lost** | `COUNT(*)` in fact_intent_basket where target was compared + user chose different chain + purchased | baskets |
| **Revenue at stake** | `SUM(delta_nis_vs_cheapest)` over lost baskets | ₪ |
| **Shelf wins** | Matrix rows where `target.price <= MIN(rival prices)` (ties count as wins) | SKUs |
| **Shelf losses** | Matrix rows where target has a price but loses to a rival | SKUs |
| **Basket-total delta** | `target_basket_sum - winner_basket_sum` (same items on both sides) | ₪ |
| **Winner (per SKU / per basket)** | Chain with minimum price across rivals | — |
| **Chain coverage %** (radar) | `target.branches / max_branches_any_chain × 100` | % |
| **Assortment %** (radar) | `target.sku_count / max_sku_count × 100` | % |
| **City reach %** (radar) | `target.cities / biggest_chain.cities × 100` | % |
| **Auto-cart success rate** | `completed / (completed + failed)` | % |
| **Intent → purchase %** | `eventually_purchased / total_intent_baskets × 100` | % |
| **Picked-cheapest %** | `chose_cheapest / total × 100` | % |
| **Defection %** | `(total - chose_cheapest - chose_target) / total × 100` (chains chosen that were neither cheapest nor target) | % |
| **OCR confidence** | `AVG(receipt_scans.confidence)` over last 50 | 0–1 |
| **Added-to-expenses %** | Last-50 sample | % |

---

## 6 · How to simulate any scenario

The Intelligence page + the Simulated Data page together can reproduce
any story you want to tell. Three practical recipes:

### Recipe A — "Yochananof is losing to Osher Ad on Mehadrin baskets"
1. /admin/demo → set user count 500, daysWindow 90 → seed.
2. /admin/intelligence/YOCHANANOF → hero shows baskets lost + revenue
   at stake.
3. Scroll to Defection Analysis → confirm OSHER_AD in the rival list.
4. Scroll to Basket Battle → select **Mehadrin Weekly** preset → run.
5. Screenshot.

### Recipe B — "Shufersal is the incumbent but bleeding to Rami Levy in periphery"
1. Seed as above (once is enough, the same data works for all chains).
2. /admin/intelligence/SHUFERSAL.
3. Branch Map → toggle **Both** → visible dense Shufersal network with
   Rami Levy dots clustered in specific cities.
4. Battleground cities list → shows the shared geography.
5. Cross-chain product search → type `חלב` → wide price spread rows
   prove the opportunity.

### Recipe C — "A specific product is being overcharged by 40% at chain X"
1. /admin/intelligence/[any chain] → Cross-chain product search.
2. Type the product (Hebrew name or barcode) → top row shows spread.
3. Click through to see per-chain prices; the "YOU" row identifies
   target's position.

---

## 7 · Known limitations & design choices

Documented explicitly so nothing surprises you in front of an executive:

1. **`product_prices` count is approximate** on the Overview page —
   planner estimate, accurate ~1%. Exact count would time out.
2. **Funnels don't track same-user flows** — they count distinct
   `anonymous_id` at each step independently. Use Intent Baskets for
   true same-user journeys.
3. **Retention grid** treats a user's new `anonymous_id` (after cache
   clear / reinstall) as a fresh cohort member.
4. **Intelligence hero "baskets lost"** requires `fact_intent_basket`
   rows — the defection table is empty if you haven't seeded or the
   SDK isn't firing.
5. **Basket Battle preset substitutions** — if a preset barcode isn't
   in product_prices, the simulator substitutes a real-barcode from
   the target chain's catalog. This keeps demos believable but means
   "Shabbat Dinner" at RAMI_LEVY is actually 10 different barcodes
   than "Shabbat Dinner" at SHUFERSAL. For apples-to-apples, upload
   your own CSV with barcodes you verify.
6. **Chain-share / auto-cart stacked chart** shows top 6 chains only.
7. **Rate limiter** is per-serverless-instance in-memory; a determined
   attacker spanning instances can exceed the per-minute cap. Vercel
   edge + WAF layer-1 still applies.
8. **Hebrew search in ProductExplorer** uses `ILIKE`. Works for most
   queries since the DB is UTF-8, but large result sets could be slow.
   Use an exact barcode for deterministic behavior.
9. **Logos** live in `public/chain-logos/`. Chains without a PNG
   render a gradient badge with Hebrew initials.
10. **Product images** come from the Rami Levy CDN pattern
    `https://img.rami-levy.co.il/product/{barcode}/large.jpg`.
    Non-existent images fall back to a grocery-bag placeholder.

---

## 8 · Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Page shows 500 / `digest` error | Usually a client/server boundary issue in a new component | Check Vercel logs for the digest; most likely missing `'use client'` on a component with event handlers |
| All analytics pages empty | No `analytics.events` data | Seed via /admin/demo or wait for real SDK traffic |
| "Price gap" says ₪0 on a chain | Chain wasn't in the sample window | Fixed: code re-queries small chains directly |
| Defection panel empty | No `fact_intent_basket` rows mentioning this chain | Seed demo data, or wait for real basket-compare telemetry |
| Basket Battle coverage < 100% | Preset barcodes not in live `product_prices` | Use the CSV upload with real barcodes, or accept the fuzzy substitution |
| SQL Console timeout | Full-scan on big table | Add a `WHERE chain_key = '...'` filter first, then join |
| Demo seed fails | Schema drift or FK issue | Check the returned `errors` array — it'll name the exact column/constraint |

---

**Anything unclear? Open SQL Console and query it — every number you
see in the UI can be reproduced there.**
