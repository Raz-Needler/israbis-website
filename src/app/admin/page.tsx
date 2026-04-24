import { sql, sqlOne, eventFreshness } from '@/lib/admin/sql';
import { adminSupabase } from '@/lib/admin/supabase';
import { StatCard } from './_components/StatCard';
import { AreaSeriesChart, HBarChart, MultiLineChart } from './_components/Charts';
import { Freshness } from './_components/Freshness';

export const dynamic = 'force-dynamic';

interface Scorecard { dau_today: number; dau_yesterday: number; wau: number; mau: number; new_signups_today: number; events_today: number; purchases_today: number; paid_conversions_today: number; }

async function loadOverview() {
  const sb = adminSupabase();

  // Worldbite user counts (authoritative — not from events)
  const usersHead = await sb.from('users').select('id', { count: 'exact', head: true });
  const today = new Date().toISOString().slice(0, 10);
  const signupsTodayHead = await sb.from('users').select('id', { count: 'exact', head: true }).gte('join_date', today);

  // Event-based scorecards (gracefully handle empty analytics)
  const sc = await sqlOne<Scorecard>(`
    WITH
      today_events     AS (SELECT * FROM analytics.events WHERE day = current_date),
      yday_events      AS (SELECT * FROM analytics.events WHERE day = current_date - 1),
      last_7_events    AS (SELECT * FROM analytics.events WHERE day >= current_date - 7),
      last_30_events   AS (SELECT * FROM analytics.events WHERE day >= current_date - 30)
    SELECT
      (SELECT COUNT(DISTINCT COALESCE(user_id, anonymous_id))::int FROM today_events)     AS dau_today,
      (SELECT COUNT(DISTINCT COALESCE(user_id, anonymous_id))::int FROM yday_events)      AS dau_yesterday,
      (SELECT COUNT(DISTINCT COALESCE(user_id, anonymous_id))::int FROM last_7_events)    AS wau,
      (SELECT COUNT(DISTINCT COALESCE(user_id, anonymous_id))::int FROM last_30_events)   AS mau,
      (SELECT COUNT(*)::int FROM today_events WHERE event_name='auth.signup_completed')   AS new_signups_today,
      (SELECT COUNT(*)::int FROM today_events)                                            AS events_today,
      (SELECT COUNT(*)::int FROM today_events WHERE event_name='cart.purchase_confirmed') AS purchases_today,
      (SELECT COUNT(*)::int FROM today_events WHERE event_name='subs.checkout_completed') AS paid_conversions_today
  `);

  // 30-day DAU series
  const dau = await sql<{ day: string; dau: number }>(`
    SELECT day::text AS day, COUNT(DISTINCT COALESCE(user_id, anonymous_id))::int AS dau
    FROM analytics.events
    WHERE day >= current_date - 30
    GROUP BY day ORDER BY day
  `);

  // 30-day new signups (from public.users)
  const signupsRes = await sb
    .from('users')
    .select('join_date')
    .gte('join_date', new Date(Date.now() - 30 * 86400_000).toISOString())
    .order('join_date', { ascending: true });

  type SignupRow = { join_date: string };
  const signupRows: SignupRow[] = (signupsRes.data as SignupRow[] | null) ?? [];
  const signupSeries = bucketByDay(signupRows, r => r.join_date, 30);

  // Combined activity chart (DAU vs signups)
  const combined = mergeSeries(dau.rows, signupSeries);

  // Top events last 7 days
  const topEvents = await sql<{ name: string; n: number }>(`
    SELECT event_name AS name, COUNT(*)::int AS n
    FROM analytics.events WHERE day >= current_date - 7
    GROUP BY event_name ORDER BY n DESC LIMIT 8
  `);

  // Top screens last 7 days
  const topScreens = await sql<{ name: string; n: number }>(`
    SELECT props->>'screen_name' AS name, COUNT(*)::int AS n
    FROM analytics.events WHERE event_name='nav.screen_viewed' AND day >= current_date - 7
    GROUP BY name ORDER BY n DESC LIMIT 8
  `);

  // Platform split today
  const platform = await sql<{ platform: string; n: number }>(`
    SELECT COALESCE(platform,'unknown') AS platform, COUNT(*)::int AS n
    FROM analytics.events WHERE day >= current_date - 7
    GROUP BY platform ORDER BY n DESC
  `);

  const freshness = await eventFreshness();

  // Stores + chain counts for operational context
  const storesHead = await sb.from('store_branches').select('id', { count: 'exact', head: true });
  const pricesHead = await sb.from('product_prices').select('id', { count: 'exact', head: true });

  return {
    totalUsers: usersHead.count ?? 0,
    signupsToday: signupsTodayHead.count ?? 0,
    totalStores: storesHead.count ?? 0,
    totalPrices: pricesHead.count ?? 0,
    sc,
    dauSeries: dau.rows,
    combined,
    topEvents: topEvents.rows,
    topScreens: topScreens.rows,
    platform: platform.rows,
    freshness,
  };
}

export default async function OverviewPage() {
  let data;
  let err: string | null = null;
  try { data = await loadOverview(); } catch (e) { err = e instanceof Error ? e.message : 'unknown'; data = null; }

  if (err || !data) {
    return (
      <div>
        <header className="admin-page-head">
          <div>
            <h1 className="admin-h1">Overview</h1>
            <p className="admin-sub">Live view of the IsraBis platform</p>
          </div>
        </header>
        <div className="error-box">
          <strong>Unable to connect to Supabase.</strong>
          <div style={{ marginTop: 4, fontSize: 11.5, opacity: 0.8 }}>
            {err} — set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> env vars, then apply migrations 001, 002, 004.
          </div>
        </div>
      </div>
    );
  }

  const sc = data.sc ?? ({ dau_today: 0, dau_yesterday: 0, wau: 0, mau: 0, new_signups_today: 0, events_today: 0, purchases_today: 0, paid_conversions_today: 0 } as Scorecard);
  const dauDelta = sc.dau_yesterday
    ? ((sc.dau_today - sc.dau_yesterday) / sc.dau_yesterday) * 100
    : null;

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Overview</h1>
          <p className="admin-sub">Live platform health · data direct from Supabase</p>
        </div>
        <Freshness minutesAgo={data.freshness} />
      </header>

      <div style={{ fontSize: 11, color: '#8E8E93', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>
        Platform state · reading direct from Supabase
      </div>
      <div className="stat-grid cols-4">
        <StatCard label="App users · total"   value={data.totalUsers}   source="public.User"          accent="green" />
        <StatCard label="Stores tracked"      value={data.totalStores}  source="public.StoreBranch"   accent="green" />
        <StatCard label="Prices in DB"        value={data.totalPrices}  source="public.ProductPrice"  accent="green" />
        <StatCard label="Signups today"       value={data.signupsToday} source="public.User.joinDate" accent="green" />
      </div>

      <div style={{ fontSize: 11, color: '#8E8E93', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', margin: '22px 0 10px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        Activity analytics · populates once the mobile SDK is wired
        {data.freshness === null && <span className="pill pill-gold" style={{ fontSize: 9 }}>SDK not live yet</span>}
      </div>
      <div className="stat-grid cols-5">
        <StatCard
          label="DAU today"
          value={sc.dau_today}
          delta={dauDelta !== null ? { value: dauDelta, kind: dauDelta > 0 ? 'up' : dauDelta < 0 ? 'down' : 'flat', label: 'vs yesterday' } : undefined}
          source="analytics.events" accent="blue"
        />
        <StatCard label="WAU · 7 days"             value={sc.wau}   source="analytics.events" accent="blue" />
        <StatCard label="MAU · 30 days"            value={sc.mau}   source="analytics.events" accent="blue" />
        <StatCard label="Events today"             value={sc.events_today} source="analytics.events" accent="purple" />
        <StatCard label="Paid conversions · today" value={sc.paid_conversions_today} source="subs.checkout_completed" accent="gold" />
      </div>

      <div className="chart-grid cols-2">
        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Activity · last 30 days</div>
              <div className="admin-card-sub">DAU from events · signups from User table</div>
            </div>
            <span className="pill pill-green">{data.dauSeries.length} days of data</span>
          </div>
          <MultiLineChart
            data={data.combined}
            xKey="day"
            series={[
              { key: 'dau',     label: 'DAU',     color: '#007AFF' },
              { key: 'signups', label: 'Signups', color: '#34C759' }
            ]}
            height={280}
          />
        </div>

        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Platform split · 7 days</div>
              <div className="admin-card-sub">Events by platform</div>
            </div>
          </div>
          <HBarChart data={data.platform} labelKey="platform" valueKey="n" height={280} />
        </div>
      </div>

      <div className="chart-grid cols-1-1">
        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Top events · 7 days</div>
              <div className="admin-card-sub">Volume-ranked</div>
            </div>
          </div>
          <HBarChart data={data.topEvents} labelKey="name" valueKey="n" height={300} color="#34C759" />
        </div>

        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Top screens · 7 days</div>
              <div className="admin-card-sub">Unique view counts</div>
            </div>
          </div>
          <HBarChart data={data.topScreens} labelKey="name" valueKey="n" height={300} color="#007AFF" />
        </div>
      </div>

      {data.freshness === null && (
        <div className="admin-card" style={{ marginTop: 14 }}>
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Next step: instrument the mobile app</div>
              <div className="admin-card-sub">Your Supabase is connected. No events yet because the SDK hasn&apos;t been wired.</div>
            </div>
          </div>
          <ol style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.9, paddingInlineStart: 18 }}>
            <li>Copy <code>israbis-analytics-worker/client/sdk-react-native.ts</code> into <code>worldbite/frontend/src/analytics/index.ts</code>.</li>
            <li>Change the SDK endpoint to <code>https://israbis.com/api/analytics/ingest</code>.</li>
            <li>In <code>App.js</code>, call <code>analytics.init(...)</code> after AppContext hydrates.</li>
            <li>Add <code>analytics.track(&apos;cart.item_added&apos;, {`{ barcode }`})</code> at the relevant handlers.</li>
            <li>Deploy. This dashboard fills in within 30 seconds of the first event.</li>
          </ol>
        </div>
      )}
    </div>
  );
}

function bucketByDay<T>(rows: T[], getDate: (r: T) => string, days: number): Array<{ day: string; signups: number }> {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
    buckets.set(d, 0);
  }
  for (const r of rows) {
    const d = getDate(r).slice(0, 10);
    if (buckets.has(d)) buckets.set(d, (buckets.get(d) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([day, signups]) => ({ day, signups }));
}

function mergeSeries(
  dauRows: Array<{ day: string; dau: number }>,
  signupRows: Array<{ day: string; signups: number }>
): Array<{ day: string; dau: number; signups: number }> {
  const map = new Map<string, { day: string; dau: number; signups: number }>();
  for (const s of signupRows) map.set(s.day, { day: s.day, dau: 0, signups: s.signups });
  for (const d of dauRows) {
    const existing = map.get(d.day);
    if (existing) existing.dau = d.dau;
    else map.set(d.day, { day: d.day, dau: d.dau, signups: 0 });
  }
  return Array.from(map.values()).sort((a, b) => a.day.localeCompare(b.day));
}
