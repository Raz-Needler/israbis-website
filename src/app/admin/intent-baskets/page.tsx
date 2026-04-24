import { sql } from '@/lib/admin/sql';
import { StatCard } from '../_components/StatCard';
import { HBarChart, AreaSeriesChart } from '../_components/Charts';
import '../admin.css';

export const dynamic = 'force-dynamic';

export default async function IntentBasketsPage({ searchParams }: { searchParams: Promise<{ days?: string; chain?: string }> }) {
  const sp = await searchParams;
  const days = Math.max(1, Math.min(365, parseInt(sp.days ?? '30', 10)));
  const chainFilter = sp.chain ? ` AND user_chose_chain = '${sp.chain.replace(/'/g, "''")}'` : '';

  const scRes = await sql<{
    total_baskets: number; baskets_purchased: number; chose_cheapest: number;
    avg_delta: number | null; avg_time_to_purchase_hours: number | null;
  }>(`
    SELECT
      COUNT(*)::int                                                  AS total_baskets,
      COUNT(*) FILTER (WHERE eventually_purchased)::int              AS baskets_purchased,
      COUNT(*) FILTER (WHERE chose_cheapest)::int                    AS chose_cheapest,
      AVG(delta_nis_vs_cheapest)::numeric(10,2)                      AS avg_delta,
      (AVG(time_to_purchase_seconds) / 3600.0)::numeric(10,2)        AS avg_time_to_purchase_hours
    FROM analytics.fact_intent_basket
    WHERE built_at >= now() - INTERVAL '${days} days' ${chainFilter}
  `);
  const sc = scRes.rows[0] ?? { total_baskets: 0, baskets_purchased: 0, chose_cheapest: 0, avg_delta: null, avg_time_to_purchase_hours: null };

  // Daily intent volume
  const volume = await sql<{ day: string; n: number }>(`
    SELECT DATE_TRUNC('day', built_at)::date::text AS day, COUNT(*)::int AS n
    FROM analytics.fact_intent_basket
    WHERE built_at >= now() - INTERVAL '${days} days' ${chainFilter}
    GROUP BY 1 ORDER BY 1
  `);

  // Chain chosen distribution
  const chainChose = await sql<{ chain: string; n: number }>(`
    SELECT COALESCE(user_chose_chain, 'UNKNOWN') AS chain, COUNT(*)::int AS n
    FROM analytics.fact_intent_basket
    WHERE built_at >= now() - INTERVAL '${days} days' ${chainFilter}
    GROUP BY 1 ORDER BY n DESC LIMIT 10
  `);

  // Cheapest chain distribution
  const chainCheap = await sql<{ chain: string; n: number }>(`
    SELECT COALESCE(cheapest_chain, 'UNKNOWN') AS chain, COUNT(*)::int AS n
    FROM analytics.fact_intent_basket
    WHERE built_at >= now() - INTERVAL '${days} days' ${chainFilter}
    GROUP BY 1 ORDER BY n DESC LIMIT 10
  `);

  // Switch-delta buckets
  const deltaBuckets = await sql<{ bucket: string; n: number }>(`
    SELECT
      CASE
        WHEN delta_nis_vs_cheapest IS NULL THEN 'unknown'
        WHEN delta_nis_vs_cheapest <= 0    THEN 'picked cheapest'
        WHEN delta_nis_vs_cheapest < 10    THEN '0–10 NIS more'
        WHEN delta_nis_vs_cheapest < 25    THEN '10–25 NIS more'
        WHEN delta_nis_vs_cheapest < 50    THEN '25–50 NIS more'
        ELSE '50+ NIS more'
      END AS bucket,
      COUNT(*)::int AS n
    FROM analytics.fact_intent_basket
    WHERE built_at >= now() - INTERVAL '${days} days' ${chainFilter}
    GROUP BY 1 ORDER BY n DESC
  `);

  // Recent baskets
  const recent = await sql<{
    id: string; built_at: string; cheapest_chain: string | null; user_chose_chain: string | null;
    chose_cheapest: boolean | null; delta_nis_vs_cheapest: number | null;
    eventually_purchased: boolean | null; purchase_chain: string | null; item_count: number | null;
  }>(`
    SELECT id, built_at::text, cheapest_chain, user_chose_chain, chose_cheapest, delta_nis_vs_cheapest::numeric(10,2),
           eventually_purchased, purchase_chain, item_count
    FROM analytics.fact_intent_basket
    WHERE built_at >= now() - INTERVAL '${days} days' ${chainFilter}
    ORDER BY built_at DESC
    LIMIT 100
  `);

  const convPct = sc.total_baskets ? Math.round((sc.baskets_purchased / sc.total_baskets) * 100) : 0;
  const cheapestPct = sc.total_baskets ? Math.round((sc.chose_cheapest / sc.total_baskets) * 100) : 0;

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Intent Baskets <span className="pill pill-gold" style={{ marginInlineStart: 8, fontSize: 9 }}>crown jewel</span></h1>
          <p className="admin-sub">Pre-store purchase-intent signal · the asset you sell</p>
        </div>
        <form style={{ display: 'flex', gap: 8 }} action="/admin/intent-baskets" method="get">
          <input name="chain" defaultValue={sp.chain ?? ''} placeholder="Filter chain_key…" className="input" style={{ width: 180 }} />
          <select name="days" defaultValue={String(days)} className="select">
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
          </select>
          <button type="submit" className="btn btn-primary">Apply</button>
        </form>
      </header>

      <div className="stat-grid cols-5">
        <StatCard label="Baskets built"         value={sc.total_baskets}      accent="green" />
        <StatCard label="Intent → purchase"     value={sc.baskets_purchased}  delta={{ value: convPct, kind: convPct > 40 ? 'up' : 'flat', label: 'conv %' }} accent="blue" />
        <StatCard label="Picked cheapest"       value={cheapestPct}           unit="%" accent="purple" />
        <StatCard label="Avg Δ vs cheapest"     value={sc.avg_delta ? Number(sc.avg_delta).toFixed(2) : '—'} unit="NIS" accent="gold" />
        <StatCard label="Avg time → purchase"   value={sc.avg_time_to_purchase_hours ? Number(sc.avg_time_to_purchase_hours).toFixed(1) : '—'} unit="h" accent="rose" />
      </div>

      <div className="chart-grid cols-2">
        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Intent volume · per day</div>
              <div className="admin-card-sub">fact_intent_basket</div>
            </div>
          </div>
          <AreaSeriesChart data={volume.rows} xKey="day" yKey="n" height={220} />
        </div>
        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Distribution vs cheapest</div>
            </div>
          </div>
          <HBarChart data={deltaBuckets.rows} labelKey="bucket" valueKey="n" height={220} />
        </div>
      </div>

      <div className="chart-grid cols-1-1">
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Top chains chosen by users</div></div>
          <HBarChart data={chainChose.rows} labelKey="chain" valueKey="n" height={260} color="#34C759" />
        </div>
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Top cheapest chains</div></div>
          <HBarChart data={chainCheap.rows} labelKey="chain" valueKey="n" height={260} color="#007AFF" />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">Recent intent baskets · 100 most recent</div>
          <span className="admin-card-sub">one row per compared basket</span>
        </div>
        {recent.rows.length === 0 ? (
          <div className="empty-state">
            <strong>No intent baskets yet.</strong>
            Ship <code>cart.compared</code> and <code>cart.chain_switched</code> events to populate this view.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Built</th><th>Items</th><th>Cheapest</th><th>Chose</th><th>Δ NIS</th><th>Purchased?</th><th>At</th></tr>
            </thead>
            <tbody>
              {recent.rows.map(r => (
                <tr key={r.id}>
                  <td className="mono muted">{new Date(r.built_at).toLocaleString('en-IL', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>{r.item_count ?? '—'}</td>
                  <td><span className="pill pill-green">{r.cheapest_chain ?? '—'}</span></td>
                  <td><span className="pill pill-blue">{r.user_chose_chain ?? '—'}</span></td>
                  <td>{r.delta_nis_vs_cheapest != null ? Number(r.delta_nis_vs_cheapest).toFixed(2) : '—'}</td>
                  <td>{r.eventually_purchased ? <span className="pill pill-green">yes</span> : <span className="pill pill-neutral">pending</span>}</td>
                  <td><span className="pill pill-neutral">{r.purchase_chain ?? '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
