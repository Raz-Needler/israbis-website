# IsraBis Website <-> Backend Integration Plan (v2)
## Connecting a real backend to transform the website into a living product

**Author:** Engineering Lead
**Date:** April 10, 2026
**Status:** PLAN — Ready for execution on approval
**Backend:** Node.js/Express + PostgreSQL (Supabase) + Prisma + Redis
**Backend location:** /worldbite/backend/ — deployed on Railway
**Website:** /israbis-website/ — Next.js 16.2

---

## WHAT WE NOW KNOW

The WorldBite backend is a **production-grade system** with:
- 33 Israeli supermarket chains with real price scrapers
- 255,000+ products cached in memory (warmCache)
- Prisma ORM with 40+ database models
- JWT authentication with Google/Apple OAuth
- Redis caching + BullMQ job queues
- Rate limiting (express-rate-limit), Helmet security headers
- Price comparison engine with fuzzy Hebrew matching
- Recipe service with social stats (likes, upvotes, comments)
- The backend exposes PUBLIC endpoints that don't require auth

**PUBLIC endpoints we can call from the website (no JWT needed):**
```
GET /api/recipes              — All recipes with pagination
GET /api/recipes/trending     — Top recipes by likes
GET /api/recipes/quick        — Recipes under 30min
GET /api/recipes/:id          — Full recipe with ingredients/steps
GET /api/recipes/search?q=    — Search recipes
GET /api/categories           — All cuisine categories
GET /api/prices/chains        — All 33 supermarket chains
GET /api/prices/ingredient    — Single ingredient across stores
POST /api/prices/ingredients/batch — Batch ingredient prices
GET /api/prices/recipe/:id    — Recipe cost per store
GET /api/compare/recipe/:id   — Full comparison across stores
GET /api/compare/recipe/:id/cheapest — Cheapest store for recipe
GET /api/prices/freshness     — Price data freshness
```

---

## ARCHITECTURE: BFF (Backend for Frontend) Pattern

```
┌──────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                       │
│                                                          │
│  React Components (read-only, no secrets, no mutations)  │
└────────────────────────┬─────────────────────────────────┘
                         │ fetch('/api/...')
                         ▼
┌──────────────────────────────────────────────────────────┐
│              NEXT.JS SERVER (BFF Layer)                   │
│              israbis-website/src/app/api/                 │
│                                                          │
│  Route Handlers:                                         │
│  ├── /api/recipes/route.ts       (GET only)              │
│  ├── /api/recipes/[id]/route.ts  (GET only)              │
│  ├── /api/prices/route.ts        (GET only)              │
│  ├── /api/compare/route.ts       (GET only)              │
│  └── /api/chains/route.ts        (GET only)              │
│                                                          │
│  Security at this layer:                                 │
│  ✓ Server-side only — BACKEND_URL never reaches client   │
│  ✓ GET only — no POST/PUT/DELETE exposed                 │
│  ✓ Response sanitization — strip internal fields         │
│  ✓ Rate limiting — max 30 req/min per IP                 │
│  ✓ Cache headers — 5min stale-while-revalidate           │
│  ✓ Input validation — Zod schemas on all params          │
│  ✓ No auth tokens forwarded — website is anonymous       │
└────────────────────────┬─────────────────────────────────┘
                         │ fetch(BACKEND_URL + '/api/...')
                         │ (server-to-server, private)
                         ▼
┌──────────────────────────────────────────────────────────┐
│              WORLDBITE BACKEND (Railway)                  │
│              Express + Prisma + PostgreSQL                │
│                                                          │
│  Accessed via BACKEND_URL env var (never exposed)        │
│  Public endpoints only — no JWT needed                   │
│  Rate limited at 100 req/15min per IP                    │
└──────────────────────────────────────────────────────────┘
```

**Why BFF and not direct client-to-backend?**
1. Backend URL stays secret (env var, server-side only)
2. We control exactly what data leaves to the browser
3. We can cache aggressively at the Next.js layer
4. We can add website-specific rate limiting
5. We can transform/sanitize responses
6. If backend changes, only BFF layer needs updating
7. Zero CORS issues — same-origin requests from browser

---

## SECURITY MODEL (Bulletproof)

### Layer 1: Next.js API Routes (BFF)
- **GET only.** No POST/PUT/DELETE handlers exist. Period.
- **No auth forwarding.** Website users are anonymous. No JWT tokens.
- **No user data.** We never fetch /api/users/*, /api/shopping-list, etc.
- **No mutation.** No likes, no comments, no writes of any kind.
- **Input validation.** Every query param validated with Zod before use.
- **Response stripping.** Remove internal IDs, timestamps, user references.
- **Rate limiting.** 30 requests per minute per IP on BFF routes.
- **Cache-Control headers.** `s-maxage=300, stale-while-revalidate=600`

### Layer 2: Environment Variables
```env
# .env.local (NEVER committed to git)
BACKEND_URL=https://worldbite-backend.railway.app
BACKEND_API_KEY=<optional: if you add an API key check on the backend>
```
- BACKEND_URL is used in server-side code ONLY (Route Handlers / RSC)
- It NEVER appears in client bundles
- Next.js guarantees env vars without NEXT_PUBLIC_ prefix are server-only

### Layer 3: Content Security Policy (next.config.ts)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self';        ← blocks client from calling external APIs
  frame-ancestors 'none';    ← prevents iframe embedding
  form-action 'self';        ← prevents form hijacking
```
The `connect-src 'self'` directive means even if someone injects JS,
it CANNOT call any external URL — only the website's own /api/ routes.

### Layer 4: Client-Side Safety
- All user-facing inputs sanitized (search, ingredient name)
- Max input lengths enforced (100 chars)
- No dangerouslySetInnerHTML anywhere
- No localStorage for sensitive data
- No cookies set by the website
- React auto-escapes all JSX text nodes

### Layer 5: What's NOT exposed
- No user data, no emails, no passwords, no tokens
- No database IDs (we use recipe slugs, not UUIDs)
- No internal API structure (client sees /api/recipes, not /worldbite/api/recipes)
- No price scraper config or chain endpoints
- No admin functionality
- No write operations of any kind

---

## PHASE 1: BFF Data Layer
**Effort: 3-4 hours | Files: 8**

### 1.1 Install dependencies
```bash
npm install zod         # Input validation
```
That's it. One dependency. We use native fetch() (built into Next.js).

### 1.2 Create backend client utility
**src/lib/backend.ts**
```typescript
// Server-side only — NEVER imported in client components
const BACKEND_URL = process.env.BACKEND_URL;

export async function fetchBackend<T>(
  path: string,
  options?: { revalidate?: number; tags?: string[] }
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { 'Accept': 'application/json' },
    next: {
      revalidate: options?.revalidate ?? 300,  // 5 min default cache
      tags: options?.tags,
    },
  });
  if (!res.ok) throw new Error(`Backend ${res.status}: ${path}`);
  return res.json();
}
```

This function:
- Runs on the server ONLY (file never bundled for client)
- Uses Next.js fetch with ISR (Incremental Static Regeneration)
- Caches responses for 5 minutes by default
- Can be tag-invalidated for instant cache busting
- Never exposes BACKEND_URL to the browser

### 1.3 Create typed response interfaces
**src/lib/types.ts**
Define TypeScript interfaces matching the backend response shapes:
- Recipe, RecipeDetail, RecipeIngredient, RecipeStep
- PriceComparison, StorePrice, ChainInfo
- SocialStats, Category
- Stripped of internal fields (no UUIDs, no createdAt/updatedAt)

### 1.4 Create BFF API Route Handlers (Next.js App Router)

**src/app/api/recipes/route.ts** — GET only
- Proxies to backend GET /api/recipes/trending?limit=10
- Strips internal fields, returns clean JSON
- Cache: 5 minutes

**src/app/api/recipes/[id]/route.ts** — GET only
- Proxies to backend GET /api/recipes/:id
- Returns full recipe with ingredients, steps, nutrition
- Cache: 10 minutes (recipes change rarely)

**src/app/api/prices/compare/[id]/route.ts** — GET only
- Proxies to backend GET /api/compare/recipe/:id
- Returns price breakdown across chains
- Cache: 15 minutes (prices update daily)

**src/app/api/chains/route.ts** — GET only
- Proxies to backend GET /api/prices/chains
- Returns all 33 chains with names, colors, logos
- Cache: 1 hour (chain list is static)

**src/app/api/prices/ingredient/route.ts** — GET only
- Proxies to backend GET /api/prices/ingredient?name=X
- Validates `name` param with Zod (max 100 chars, sanitized)
- Cache: 15 minutes

### 1.5 Create shared input validation
**src/lib/validate.ts**
```typescript
import { z } from 'zod';

export const SearchSchema = z.string()
  .max(100)
  .regex(/^[\u0590-\u05FFa-zA-Z0-9\s\-]+$/)  // Hebrew + English + numbers only
  .transform(s => s.trim());

export const RecipeIdSchema = z.string()
  .max(100)
  .regex(/^[a-z0-9\-]+$/);  // slug format only

export const LimitSchema = z.coerce.number()
  .int().min(1).max(50).default(10);
```

---

## PHASE 2: Featured Recipe Pages (The 3 Showpieces)
**Effort: 4-5 hours | Files: 10 components + 3 pages**

### The 3 featured recipes:
1. **Smash Burger** — The crowd-pleaser, comfort food
2. **Pad Thai** (or Thai Green Curry) — Exotic, colorful
3. **Shakshuka (שקשוקה)** — Israeli classic, cultural hook

### 2.1 Recipe page layout: /recipes/[id]

This is the MONEY page. When someone finds this via Google, this is what
converts them. It must be stunning and data-rich.

**Server Component** (data fetched server-side, zero client JS for initial render):

```
┌──────────────────────────────────────────────────────┐
│  HERO: Full-width recipe image                       │
│  ┌──────────────────────────────────────────┐        │
│  │  [Recipe Image — from app screenshots]   │        │
│  │                                          │        │
│  │  Overlay:                                │        │
│  │  סמאש בורגר                              │        │
│  │  Crispy smash burger with special sauce   │        │
│  │  ⏱ 30 דק' | 🍽 4 מנות | 🔥 680 קל'     │        │
│  └──────────────────────────────────────────┘        │
├──────────────────────────────────────────────────────┤
│                                                      │
│  💰 PRICE COMPARISON (fetched from backend)          │
│  ┌──────────────────────────────────────┐            │
│  │  🏆 רמי לוי    ₪42.50  (הכי זול!)   │            │
│  │     שופרסל     ₪51.20               │            │
│  │     יוחננוף    ₪48.80               │            │
│  │                                      │            │
│  │  חיסכון: ₪8.70 ברמי לוי             │            │
│  └──────────────────────────────────────┘            │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  📋 INGREDIENTS (with per-item prices)               │
│  ┌────────────────┬────────┬─────────┐               │
│  │ מרכיב          │ כמות   │ מחיר    │               │
│  ├────────────────┼────────┼─────────┤               │
│  │ בשר טחון       │ 500 גר  │ ₪22.50  │               │
│  │ לחמניות        │ 4      │ ₪8.00   │               │
│  │ גבינה צ'דר    │ 4 פרוסות│ ₪6.50   │               │
│  │ ...            │ ...    │ ...     │               │
│  └────────────────┴────────┴─────────┘               │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  👨‍🍳 STEPS (step-by-step, read-only)                │
│  1. גלגלו כדורי בשר של 80 גר' כל אחד               │
│     💡 טיפ: הבשר צריך להיות קר                      │
│  2. חממו מחבת ברזל על אש גבוהה                      │
│     ⏱ 3 דקות                                        │
│  3. ...                                              │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  📊 NUTRITION                                        │
│  680 קלוריות | 38g חלבון | 42g פחמימות | 34g שומן   │
│  [Visual bar chart]                                  │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ❤️ SOCIAL PROOF (from backend socialStats)          │
│  342 לייקים | בושל 1,205 פעמים | 4.7★ (89 דירוגים) │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  📱 CTA SECTION                                      │
│  "רוצים טיימרים, רשימת קניות, סריקת ברקוד?"        │
│  "באפליקציה יש עוד אלפי מתכונים עם מחירים"          │
│  [App Store] [Google Play]                           │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  🍽 MORE RECIPES (link to other 2 featured)           │
│  [Pad Thai card] [Shakshuka card]                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 2.2 Recipe listing page: /recipes

Shows the 3 featured recipes as hero cards + a message:
"אלפי מתכונים נוספים מחכים לכם באפליקציה — מתכונים מהאפליקציה,
מתכונים מסרטונים, ומתכונים שיצרתם בעצמכם."

Each card links to /recipes/[id].

Below the cards, show:
- "Popular in the app right now" — pull from /api/recipes/trending
  (just names + stats, no full detail, with "open in app" CTAs)
- Cuisine category chips with recipe counts from backend

### 2.3 Recipe images strategy

Copy the 3 specific recipe images from the app's screenshot folder
into /public/images/recipes/:
- smash-burger.jpg (from Start_Cooking.jpg screenshot — already have this!)
- pad-thai.jpg (need from app assets)
- shakshuka.jpg (need from app assets)

For the trending recipes list (from backend), use the recipe imageUrl
field if available, or show a category-colored placeholder.

### 2.4 Components to build

**src/components/recipes/RecipeHero.tsx**
- Full-width image with gradient overlay
- Recipe name (Hebrew + English), badges (time, servings, calories)
- Uses Next.js Image with priority loading

**src/components/recipes/PriceComparison.tsx**
- Fetches from /api/prices/compare/[id] on the server
- Shows 3 chains ranked cheapest to most expensive
- Winner highlighted with accent color + trophy icon
- "You save ₪X by shopping at [chain]" message

**src/components/recipes/IngredientTable.tsx**
- Two-column: ingredient name (Hebrew) + price
- Total at bottom
- Clean, scannable layout

**src/components/recipes/StepList.tsx**
- Numbered steps with optional tips and durations
- Read-only (no timer — that's app-exclusive)

**src/components/recipes/NutritionBar.tsx**
- Horizontal bar chart: calories, protein, carbs, fat
- Color-coded (green for protein, blue for carbs, etc.)

**src/components/recipes/SocialStats.tsx**
- Likes, times cooked, rating stars
- All read-only, no interaction (interaction is app-exclusive)

**src/components/recipes/RecipeCard.tsx**
- Used in the grid and "more recipes" sections
- Image, name, price badge, rating, time
- Matches app's RecipeCard.js visual style

**src/components/recipes/RecipeJsonLd.tsx**
- Recipe structured data for Google rich results
- Uses backend data to populate all fields

---

## PHASE 3: Price Explorer & Live Data Pages
**Effort: 4-5 hours | Files: 6 components + 2 pages**

### 3.1 /prices — Price Explorer

Fetches real ingredient prices from backend via BFF.

**Top section: "Deal Spotlight"**
- Fetch trending/popular products from backend
- Show 5 items with biggest price spread between chains
- "שמן זית: ₪18 ברמי לוי vs ₪32 בשופרסל — חסכו 44%!"

**Main section: Ingredient search**
- Search box (sanitized input)
- User types "חלב" → shows milk prices at all chains
- Results from GET /api/prices/ingredient?name=חלב
- Visual: chain logos with prices, cheapest highlighted

**Category browse:**
- Common categories: dairy, meat, produce, bakery, pantry
- Each shows 5-10 popular items with prices
- All data from backend, cached 15 minutes

### 3.2 /compare — Basket Builder (Interactive)

This is the CONVERSION WEAPON. Users build a basket, see live prices.

**Client Component** (needs interactivity for adding/removing items):

```
┌──────────────────────────────────────────────────────┐
│  H1: "בנו עגלה ומצאו את הסופר הזול"                 │
│                                                      │
│  [Search ingredient: _______________] [הוסף]         │
│                                                      │
│  Quick-add pills:                                    │
│  [חלב] [ביצים] [לחם] [עוף] [גבינה] [עגבניות]       │
│  [אורז] [שמן זית] [בצל] [תפו"א] [בשר טחון]        │
│                                                      │
│  YOUR BASKET (X items):                              │
│  ┌──────────────┬─────────┬───┐                      │
│  │ חזה עוף      │ ₪35.00  │ ✕ │                      │
│  │ חלב 3%       │ ₪6.50   │ ✕ │                      │
│  │ ביצים        │ ₪12.00  │ ✕ │                      │
│  └──────────────┴─────────┴───┘                      │
│                                                      │
│  COMPARISON RESULTS:                                 │
│  🏆 רמי לוי     ₪53.50    הכי זול!                  │
│     שופרסל      ₪61.20    +₪7.70                    │
│     יוחננוף     ₪57.80    +₪4.30                    │
│                                                      │
│  💰 חוסכים ₪7.70 בקנייה ברמי לוי                    │
│                                                      │
│  [📱 רוצים להשוות בין כל 33 הרשתות? הורידו IsraBis] │
└──────────────────────────────────────────────────────┘
```

**How it works:**
1. User types/clicks ingredient → client calls /api/prices/ingredient
2. BFF validates input, forwards to backend, returns price
3. Item added to local state (useState, no persistence)
4. After 2+ items, comparison section shows chain-by-chain totals
5. Results calculated client-side from individual prices (no batch call
   needed — we already have per-item prices)

**Security for this page:**
- Input: sanitized with Zod regex, max 100 chars
- Basket: max 30 items (enforced in state)
- No data stored anywhere (no cookies, no localStorage)
- Each ingredient lookup goes through BFF rate limiter
- Backend URL never exposed — client calls /api/prices/ingredient
- Responses cached 15 minutes at BFF layer

---

## PHASE 4: Homepage Integration (Making it alive)
**Effort: 3-4 hours | Files: 5 components, 1 page modification**

### 4.1 "Deal of the Day" section

**Component: DealOfTheDay.tsx (Server Component)**
- Fetches popular products from backend at build/ISR time
- Shows 3-5 products with biggest cross-chain price differences
- Auto-rotates daily via date-based selection from cached data
- Revalidates every 30 minutes

**Position:** Right after hero section, before stats bar.

### 4.2 "Featured Recipes" section

**Component: FeaturedRecipes.tsx (Server Component)**
- Shows the 3 featured recipes as premium cards
- Each card: image, name (Hebrew), price badge, rating, time
- Data from backend via BFF (server-side, cached)
- Links to /recipes/[id]

**Position:** After "How It Works" section.

### 4.3 "Live from the App" ticker

**Component: LiveTicker.tsx**
- Scrolling bar: "🔥 סמאש בורגר — בושל 1,205 פעמים | ₪42 למנה"
- Data from backend socialStats (cached, not real-time)
- Auto-scrolls, pauses on hover

**Position:** Between hero and social proof.

### 4.4 "Price Spotlight" in stores section

Replace the current static "21% difference" text with:
- Real example from backend: "חזה עוף: ₪35 ברמי לוי, ₪42 בשופרסל"
- Rotates through 3 examples
- Fetched server-side, cached 30 minutes

### 4.5 Update stats section

Change "60,000+" to show the real recipe count from the backend
(or keep the aspirational number with "in-app + external" context).
Add sub-labels:
- "33 chains — updated daily from government database"
- "255,000+ products — real prices from real stores"
- "Recipes — in-app, from videos, and community"

---

## PHASE 5: SEO Structured Data for Recipes
**Effort: 1-2 hours | Files: 2**

### 5.1 Recipe Schema (JSON-LD)

For each /recipes/[id] page, generate Google Recipe rich result:
```json
{
  "@type": "Recipe",
  "name": "סמאש בורגר",
  "image": "https://www.israbi.app/images/recipes/smash-burger.jpg",
  "prepTime": "PT10M",
  "cookTime": "PT20M",
  "totalTime": "PT30M",
  "recipeYield": "4 מנות",
  "recipeCategory": "American",
  "recipeCuisine": "אמריקאי",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "680 calories",
    "proteinContent": "38g",
    "carbohydrateContent": "42g",
    "fatContent": "34g"
  },
  "recipeIngredient": ["500 גרם בשר טחון", "4 לחמניות", ...],
  "recipeInstructions": [
    { "@type": "HowToStep", "text": "גלגלו כדורי בשר..." }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "ratingCount": "89"
  }
}
```

This puts IsraBis into Google's recipe carousel (images + stars + time).

### 5.2 Update sitemap

Add recipe pages to sitemap.ts:
- /recipes (priority 0.8)
- /recipes/smash-burger (priority 0.7)
- /recipes/pad-thai (priority 0.7)
- /recipes/shakshuka (priority 0.7)
- /prices (priority 0.8)
- /compare (priority 0.8)

---

## PHASE 6: Theme & Visual Alignment
**Effort: 1-2 hours | Files: 1-2**

### 6.1 Recipe pages use warm palette

The app uses a warm food theme (terracotta #C4653A, cream #FFF8F0).
The website's "autumn" theme is similar (#E8773A, #FFF8F0).

For recipe pages specifically:
- Use warm accent colors regardless of selected theme
- Warm shadows (brown-tinted instead of neutral)
- Cream backgrounds for ingredient tables
- Food-appropriate styling that matches app screenshots

### 6.2 Match app component patterns

Recipe cards should visually mirror the app's RecipeCard.js:
- Same border radius (16px)
- Same shadow depth
- Similar badge positioning (top-right for difficulty)
- Same typography hierarchy (bold title, muted description)

---

## FILES TO CREATE (Complete list)

```
NEW FILES:
src/lib/backend.ts              — Server-side backend client
src/lib/types.ts                — TypeScript interfaces
src/lib/validate.ts             — Zod input validation schemas

src/app/api/recipes/route.ts            — BFF: list recipes
src/app/api/recipes/[id]/route.ts       — BFF: single recipe
src/app/api/prices/compare/[id]/route.ts — BFF: price comparison
src/app/api/prices/ingredient/route.ts  — BFF: ingredient price lookup
src/app/api/chains/route.ts             — BFF: chain list

src/app/recipes/page.tsx                — Recipe showcase (3 featured)
src/app/recipes/[id]/page.tsx           — Individual recipe page (SSR)
src/app/prices/page.tsx                 — Price explorer
src/app/compare/page.tsx                — Basket builder (interactive)

src/components/recipes/RecipeHero.tsx
src/components/recipes/RecipeCard.tsx
src/components/recipes/PriceComparison.tsx
src/components/recipes/IngredientTable.tsx
src/components/recipes/StepList.tsx
src/components/recipes/NutritionBar.tsx
src/components/recipes/SocialStats.tsx
src/components/recipes/RecipeJsonLd.tsx

src/components/prices/DealOfTheDay.tsx
src/components/prices/IngredientSearch.tsx
src/components/prices/BasketBuilder.tsx
src/components/prices/ChainPriceRow.tsx

src/components/homepage/FeaturedRecipes.tsx
src/components/homepage/LiveTicker.tsx
src/components/homepage/PriceSpotlight.tsx

MODIFIED FILES:
src/app/page.tsx              — Add homepage sections
src/app/sitemap.ts            — Add recipe/price URLs
src/app/globals.css            — Add food-specific warm styles
src/components/Navbar.tsx      — Add "Recipes" + "Prices" nav items
src/components/Footer.tsx      — Add new page links
next.config.ts                 — Add CSP, BACKEND_URL env config
.env.local                     — BACKEND_URL (git-ignored)
```

**Total new files: ~27**
**Total new pages: 6 (recipes index, 3 recipe detail, prices, compare)**
**Total pages after: ~28 (plus existing 22)**

---

## EXECUTION ORDER

| # | Phase | Task | Effort | Depends on |
|---|-------|------|--------|------------|
| 1 | 1.1 | Install zod | 5 min | — |
| 2 | 1.2 | Create backend.ts client | 30 min | .env.local |
| 3 | 1.3 | Create types.ts | 30 min | — |
| 4 | 1.4 | Create BFF API routes (5 files) | 2 hr | #2, #3 |
| 5 | 1.5 | Create validate.ts | 20 min | #1 |
| 6 | 2.1 | Recipe detail page /recipes/[id] | 3 hr | #4, images |
| 7 | 2.2 | Recipe listing page /recipes | 1.5 hr | #6 |
| 8 | 2.3 | Copy recipe images | 15 min | Source images |
| 9 | 2.4 | Recipe components (7 files) | 3 hr | #4 |
| 10 | 3.1 | /prices page | 2 hr | #4 |
| 11 | 3.2 | /compare basket builder | 3 hr | #4, #5 |
| 12 | 4.1-4.5 | Homepage sections | 3 hr | #4 |
| 13 | 5.1 | Recipe JSON-LD schema | 1 hr | #6 |
| 14 | 5.2 | Sitemap update | 15 min | #6, #10, #11 |
| 15 | 6.1-6.2 | Theme alignment | 1 hr | #9 |
| 16 | — | Build + verify | 30 min | All |

**Total: ~22 hours**

---

## WHAT THIS ACHIEVES

### Before:
- Static marketing site, zero real data
- Visitor has no way to verify the product works
- No reason to return to the website
- SEO: generic keywords only

### After:
- **3 stunning recipe pages** with REAL prices from REAL stores
- **Live price explorer** showing actual supermarket prices
- **Interactive basket builder** that demonstrates the core value
- **Deal of the Day** with real price differences (return visits)
- **Google Recipe rich results** (images, stars, cook time in SERPs)
- **28+ pages** indexed, each targeting specific Hebrew keywords
- **Backend-connected** with secure BFF layer

### The conversion journey:
```
1. Google "סמאש בורגר מתכון" →
   /recipes/smash-burger (rich result with image + stars)
2. User sees recipe with REAL prices at REAL stores
3. "You save ₪8.70 by shopping at Rami Levy"
4. Scroll down → "Want timers, 33 chains, barcode scan?"
5. → Download IsraBis

OR

1. Google "השוואת מחירי סופר" → /compare
2. User builds basket, sees live prices
3. "This compares 3 chains. The app compares 33."
4. → Download IsraBis
```

---

## BEFORE WE START — WHAT I NEED FROM YOU

1. **Backend URL** — What's the Railway deployment URL?
   (e.g., https://worldbite-backend-production.up.railway.app)

2. **Is the backend currently running and accessible?**
   Can I test: curl https://[your-url]/api/prices/chains

3. **Recipe images** — I need JPGs for:
   - Smash Burger (I can crop from Start_Cooking.jpg screenshot)
   - Pad Thai or Thai Green Curry
   - Shakshuka (שקשוקה)
   Do these exist in the app's assets folder?

4. **Do you want the basket builder (/compare) to show all 33 chains
   or just the top 3-6?** Showing 33 might be overwhelming on web.

5. **Should recipe pages show comments from the backend?**
   This would be read-only social proof, but means displaying user
   names publicly.

---

**Ready to build. Give me the backend URL and image confirmation
and I'll start Phase 1 immediately.**
