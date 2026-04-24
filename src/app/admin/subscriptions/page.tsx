import { sql } from '@/lib/admin/sql';
import { adminSupabase } from '@/lib/admin/supabase';
import { StatCard } from '../_components/StatCard';
import { AreaSeriesChart, HBarChart, FunnelChart } from '../_components/Charts';
import '../admin.css';

export const dynamic = 'force-dynamic';

export default async function SubscriptionsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const sp = await searchParams;
  const days = Math.max(1, Math.min(365, parseInt(sp.days ?? '30', 10)));
  const sb = adminSupabase();

  const familyRes = await sb.from('families').select('subscription_tier');
  type F = { subscription_tier: string | null };
  const familyRows: F[] = (familyRes.data as F[] | null) ?? [];
  const tierCount = familyRows.reduce((acc, f) => {
    const t = f.subscription_tier ?? 'basic';
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const funnelRes = await sql<{ step: string; n: number }>(`
    SELECT event_name AS step, COUNT(DISTINCT anonymous_id)::int AS n
    FROM analytics.events
    WHERE event_name IN ('subs.paywall_viewed','subs.checkout_started','subs.checkout_completed','subs.cancelled')
      AND day >= current_date - ${days}
    GROUP BY event_name
  `);
  const stepMap = new Map(funnelRes.rows.map(r => [r.step, r.n]));

  const dailyRes = await sql<{ day: string; n: number }>(`
    SELECT day::text AS day, COUNT(*)::int AS n
    FROM analytics.events
    WHERE event_name='subs.checkout_completed' AND day >= current_date - ${days}
    GROUP BY day ORDER BY day
  `);

  const planRes = await sql<{ plan: string; n: number }>(`
    SELECT props->>'plan' AS plan, COUNT(*)::int AS n
    FROM analytics.events
    WHERE event_name='subs.checkout_completed' AND day >= current_date - ${days}
    GROUP BY 1 ORDER BY n DESC
  `);

  const totalPaid = (tierCount.pro ?? 0) + (tierCount.max ?? 0) + (tierCount.premium ?? 0);
  const totalFamilies = familyRows.length;
  const conversionPct = (stepMap.get('subs.paywall_viewed') ?? 0) > 0
    ? Math.round(((stepMap.get('subs.checkout_completed') ?? 0) / (stepMap.get('subs.paywall_viewed') ?? 1)) * 100)
    : 0;

  const funnelSteps = [
    { name: 'Paywall viewed',     value: stepMap.get('subs.paywall_viewed') ?? 0 },
    { name: 'Checkout started',   value: stepMap.get('subs.checkout_started') ?? 0 },
    { name: 'Checkout completed', value: stepMap.get('subs.checkout_completed') ?? 0 },
  ];

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Subscriptions</h1>
          <p className="admin-sub">Revenue conversion · RevenueCat + event stream</p>
        </div>
        <form style={{ display: 'flex', gap: 8 }} action="/admin/subscriptions" method="get">
          <select name="days" defaultValue={String(days)} className="select">
            <option value="7">7d</option><option value="30">30d</option><option value="90">90d</option>
          </select>
          <button type="submit" className="btn btn-primary">Apply</button>
        </form>
      </header>

      <div className="stat-grid cols-5">
        <StatCard label="Total families"        value={totalFamilies} accent="blue" source="public.Family" />
        <StatCard label="Paid families"         value={totalPaid} accent="gold" source="Family.subscriptionTier" />
        <StatCard label="Free tier"             value={tierCount.basic ?? 0} accent="purple" />
        <StatCard label="Conversion (30d)"      value={conversionPct} unit="%" accent="green" />
        <StatCard label="Cancellations"         value={stepMap.get('subs.cancelled') ?? 0} accent="rose" />
      </div>

      <div className="chart-grid cols-2">
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Checkout funnel</div></div>
          <FunnelChart steps={funnelSteps} />
        </div>
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Checkouts per day</div></div>
          <AreaSeriesChart data={dailyRes.rows} xKey="day" yKey="n" height={280} color="#D4A853" />
        </div>
      </div>

      <div className="chart-grid cols-1-1">
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Plans chosen</div></div>
          <HBarChart data={planRes.rows.filter(r => r.plan)} labelKey="plan" valueKey="n" height={220} />
        </div>
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Family tier distribution</div></div>
          <HBarChart
            data={Object.entries(tierCount).map(([tier, n]) => ({ tier, n }))}
            labelKey="tier" valueKey="n" height={220}
          />
        </div>
      </div>
    </div>
  );
}
