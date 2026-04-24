# IsraBis Admin Portal — Setup Guide

A production-ready admin portal at `https://israbis.com/admin`, powered by the Supabase database the Worldbite mobile app already uses.

## What you're getting

- Login at `/admin/login` with `IsrabisAdmin` + `is Password` (forced rotation on first login)
- Dashboards at `/admin` (Overview, Users, Events, SQL Console, …)
- Public ingestion endpoint at `POST /api/analytics/ingest` that the mobile app + website fire events to
- Full audit trail of every admin action
- Zero new services: uses the existing Supabase + Vercel

---

## One-time setup (15 minutes)

### 1. Install dependencies

```bash
cd "c:/Users/rotem/OneDrive/Documents/Git Project/israbis-website"
npm install @supabase/supabase-js jose @node-rs/argon2 recharts date-fns ulid exceljs
```

### 2. Apply the migrations to Supabase

Open the Supabase dashboard for the project Worldbite uses → **SQL Editor** → paste and run each file in order:

1. `migrations/001_admin_schema.sql`
2. `migrations/002_analytics_schema.sql`
3. `migrations/004_admin_kpi_views.sql`

Do **not** run `003_seed_master_admin.sql` yet — the password hash is a placeholder.

### 3. Generate the master admin password hash

```bash
node -e "require('@node-rs/argon2').hash('is Password', { memoryCost: 65536, timeCost: 3, parallelism: 4 }).then(h => console.log(h))"
```

Copy the output string (starts with `$argon2id$…`).

Open `migrations/003_seed_master_admin.sql`, replace the placeholder `$argon2id$v=19$m=65536,t=3,p=4$REPLACE_SALT$REPLACE_HASH` with your generated hash, save, then run it in the Supabase SQL Editor.

### 4. Set Vercel environment variables

Vercel project → Settings → Environment Variables → add:

| Key | Value |
|---|---|
| `SUPABASE_URL` | `https://<your-project>.supabase.co` (same as Worldbite uses) |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase → Settings → API → service_role key |
| `ADMIN_JWT_SECRET` | Generate: `openssl rand -hex 48` (or any 96+-char random string) |
| `ADMIN_SESSION_TTL_SECONDS` | `3600` |
| `ADMIN_MAX_LOGIN_ATTEMPTS` | `10` |
| `ADMIN_MAX_LOGIN_WINDOW_SEC` | `900` |

**Critical:** `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_JWT_SECRET` must be server-only. Do NOT prefix with `NEXT_PUBLIC_`.

### 5. Deploy

```bash
git add .
git commit -m "feat(admin): scaffold admin portal at /admin"
git push
```

Vercel auto-deploys.

### 6. First login

1. Go to `https://israbis.com/admin/login`
2. Username: `IsrabisAdmin`
3. Password: `is Password`
4. You'll be redirected to rotate the password immediately — pick something strong (>=12 chars, mixed case, symbols)
5. After rotation you land on `/admin` (Overview)

Done. The portal is live.

---

## What's already built (Phase 0 + 1 of the v2 plan)

| Feature | Path | Status |
|---|---|---|
| Login | `/admin/login` | Live |
| Overview dashboard | `/admin` | Live (reads public.User + analytics.events) |
| Users directory | `/admin/users` | Live (paginated, searchable) |
| Events explorer | `/admin/events` | Live (filters + pagination) |
| SQL console | `/admin/sql` | Live (master role only) |
| Analytics ingestion | `POST /api/analytics/ingest` | Live (public, rate-limited by Vercel) |
| Audit log table | `admin.admin_audit` | Live (populated on every action) |

## What ships in Phase 2+ (build using the same patterns)

- `/admin/funnels` · `/admin/retention` · `/admin/intent-baskets` (crown jewel)
- `/admin/chains` · `/admin/recipes` · `/admin/ai` · `/admin/scanners`
- `/admin/subscriptions` · `/admin/geo`
- `/admin/exports` · `/admin/audit-log` · `/admin/settings`
- Scheduled rollup cron job (Vercel Cron)
- XLSX export engine

Each new page follows the template of `/admin/users/page.tsx`:
1. Server Component that imports `adminSupabase()` from `@/lib/admin/supabase`
2. Runs a query, returns HTML
3. A pair of filter + pagination search params

---

## Instrumenting the mobile app (once ingestion is deployed)

Copy the SDK from the Cloudflare Worker scaffold (`israbis-analytics-worker/client/sdk-react-native.ts`) to `worldbite/frontend/src/analytics/index.ts`, change the endpoint to `https://israbis.com/api/analytics/ingest`, and wire it up in `App.js`:

```typescript
import { analytics } from './src/analytics';

analytics.init({
  endpoint: 'https://israbis.com/api/analytics/ingest',
  appVersion: Constants.expoConfig?.version,
  locale: 'he-IL',
});
```

Then drop `analytics.track('event.name', { props })` calls throughout the handlers. Events appear in `/admin/events` within 30 seconds.

---

## Security checklist

- [x] `SUPABASE_SERVICE_ROLE_KEY` is server-only (never in client bundle)
- [x] `ADMIN_JWT_SECRET` is separate from any user JWT secret
- [x] JWT stored in httpOnly + Secure + SameSite=Strict cookie
- [x] Argon2id password hashing (memory 64MB, time 3, parallel 4)
- [x] Force password rotation on first login
- [x] Rate-limited login (10/15min per IP hash)
- [x] Middleware gates all `/admin/*` and `/api/admin/*`
- [x] SQL console is SELECT-only via `admin.run_readonly_sql` SECURITY DEFINER function
- [x] Every admin action logged to `admin.admin_audit`
- [x] PII redaction on ingestion (password/token/secret/auth/ccn/iban/tz_id keys blocked)
- [x] Ingestion uses INSERT … ON CONFLICT DO NOTHING for dedup

## Verifying it works

After first login, go to `/admin/sql` and run:

```sql
SELECT id, username, role, created_at FROM admin.admin_users;
SELECT action, occurred_at FROM admin.admin_audit ORDER BY occurred_at DESC LIMIT 10;
SELECT COUNT(*) FROM analytics.events;
SELECT COUNT(*) FROM public."User";
```

You should see:
- Your `IsrabisAdmin` row
- Your recent login + rotation events in audit
- `0` events until you deploy the SDK
- The full Worldbite user count

## Rollback

If anything goes wrong, the admin portal is additive — set a Vercel env var `ADMIN_PORTAL_ENABLED=false` and add to middleware a short-circuit. Or simply remove the `src/middleware.ts` file. The rest of the marketing site is untouched.

## Support / next steps

All long-form docs live in `c:\Users\rotem\OneDrive\Documents\IsraBis_Admin_Portal_Plan_v2.md`. Phase 2+ is a straight extension of what's here — follow the same file patterns and you'll have the full dashboard suite in another week of work.
