import Link from 'next/link';
import { sql } from '@/lib/admin/sql';
import { adminSupabase } from '@/lib/admin/supabase';
import { StackedAreaChart, HBarChart } from '../_components/Charts';
import { StatCard } from '../_components/StatCard';
import '../admin.css';

export const dynamic = 'force-dynamic';

export default async function ChainsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const sp = await searchParams;
  const days = Math.max(7, Math.min(365, parseInt(sp.days ?? '30', 10)));
  const sb = adminSupabase();

  // Chain switches per day (stacked area)
  const switchesRes = await sql<{ day: string; chain: string; n: number }>(`
    SELECT day::text AS day,
           COALESCE(props->>'to_chain','UNKNOWN') AS chain,
           COUNT(*)::int AS n
    FROM analytics.events
    WHERE event_name = 'cart.chain_switched'
      AND day >= current_date - ${days}
    GROUP BY day, chain
    ORDER BY day
  `);

  const stackData = pivotStack(switchesRes.rows);
  const topChains = rankChains(switchesRes.rows);

  // Chain totals
  const totalsRes = await sql<{ chain: string; switches_in: number; unique_users: number }>(`
    SELECT props->>'to_chain' AS chain,
           COUNT(*)::int AS switches_in,
           COUNT(DISTINCT anonymous_id)::int AS unique_users
    FROM analytics.events
    WHERE event_name = 'cart.chain_switched' AND day >= current_date - ${days}
    GROUP BY 1 ORDER BY switches_in DESC LIMIT 15
  `);

  // Auto-cart success per chain
  const autoCartRes = await sql<{ chain: string; success: number; failures: number; success_rate: number }>(`
    SELECT
      COALESCE(props->>'chain_key','UNKNOWN') AS chain,
      COUNT(*) FILTER (WHERE event_name='chain.auto_cart_completed')::int AS success,
      COUNT(*) FILTER (WHERE event_name='chain.auto_cart_failed')::int    AS failures,
      (COUNT(*) FILTER (WHERE event_name='chain.auto_cart_completed')::numeric
        / NULLIF(COUNT(*) FILTER (WHERE event_name IN ('chain.auto_cart_completed','chain.auto_cart_failed'))::numeric, 0) * 100)::numeric(5,1) AS success_rate
    FROM analytics.events
    WHERE event_name IN ('chain.auto_cart_completed','chain.auto_cart_failed')
      AND day >= current_date - ${days}
    GROUP BY 1 ORDER BY success DESC LIMIT 15
  `);

  // Store counts by chain (from public.store_branches)
  const branchRes = await sb.from('store_branches').select('chain_key');
  type B = { chain_key: string | null };
  const branchRows: B[] = (branchRes.data as B[] | null) ?? [];
  const chainBranchMap = branchRows.reduce((acc, b) => {
    const k = b.chain_key ?? 'UNKNOWN';
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const chainBranches = Object.entries(chainBranchMap).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([chain, n]) => ({ chain, n }));

  const totalSwitches = switchesRes.rows.reduce((s, r) => s + Number(r.n), 0);
  const totalChains = Object.keys(chainBranchMap).length;

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Chains</h1>
          <p className="admin-sub">Cross-chain purchase intent and integration health</p>
        </div>
        <form style={{ display: 'flex', gap: 8 }} action="/admin/chains" method="get">
          <select name="days" defaultValue={String(days)} className="select">
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
          </select>
          <button type="submit" className="btn btn-primary">Apply</button>
        </form>
      </header>

      <div className="stat-grid cols-4">
        <StatCard label="Chains tracked"        value={totalChains} accent="green" source="StoreBranch" />
        <StatCard label="Switches (window)"     value={totalSwitches} accent="blue" source="cart.chain_switched" />
        <StatCard label="Branches (total)"      value={branchRows.length} accent="purple" source="public.StoreBranch" />
        <StatCard label="Window"                value={days} unit="days" accent="gold" />
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card-head">
          <div>
            <div className="admin-card-title">Chain selection share · last {days} days</div>
            <div className="admin-card-sub">Stacked area of cart.chain_switched destinations</div>
          </div>
        </div>
        <StackedAreaChart
          data={stackData}
          xKey="day"
          series={topChains.map(c => ({ key: c, label: c }))}
          height={300}
        />
      </div>

      <div className="chart-grid cols-1-1">
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Top chains by switches in</div></div>
          <HBarChart
            data={totalsRes.rows.map(r => ({ chain: r.chain, switches_in: Number(r.switches_in) }))}
            labelKey="chain" valueKey="switches_in" height={300} color="#34C759" />
        </div>
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Auto-cart success rate</div></div>
          {autoCartRes.rows.length === 0 ? (
            <div className="empty-state">No auto-cart events yet.</div>
          ) : (
            <table className="admin-table" style={{ fontSize: 12 }}>
              <thead><tr><th>Chain</th><th>✓</th><th>✗</th><th>Rate</th></tr></thead>
              <tbody>
                {autoCartRes.rows.map(r => (
                  <tr key={r.chain}>
                    <td><span className="pill pill-neutral">{r.chain}</span></td>
                    <td>{r.success}</td>
                    <td className="muted">{r.failures}</td>
                    <td><strong>{r.success_rate != null ? `${Number(r.success_rate).toFixed(1)}%` : '—'}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 14 }}>
        <div className="admin-card-head">
          <div className="admin-card-title">Branches by chain</div>
          <span className="admin-card-sub">public.StoreBranch</span>
        </div>
        <HBarChart data={chainBranches} labelKey="chain" valueKey="n" height={Math.max(220, chainBranches.length * 26)} />
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {topChains.slice(0, 8).map(c => (
            <Link key={c} href={`/admin/chains/${encodeURIComponent(c)}`} className="btn btn-secondary" style={{ height: 30, fontSize: 11.5 }}>
              {c} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function pivotStack(rows: Array<{ day: string; chain: string; n: number }>) {
  const byDay = new Map<string, Record<string, number | string>>();
  const chainCounts = new Map<string, number>();
  for (const r of rows) {
    chainCounts.set(r.chain, (chainCounts.get(r.chain) ?? 0) + Number(r.n));
    const entry = byDay.get(r.day) ?? { day: r.day };
    entry[r.chain] = Number(r.n);
    byDay.set(r.day, entry);
  }
  const top = Array.from(chainCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(e => e[0]);
  // Zero-fill missing days/chains
  return Array.from(byDay.values()).map(row => {
    const out: Record<string, number | string> = { day: row.day };
    for (const c of top) out[c] = Number(row[c] ?? 0);
    return out;
  });
}
function rankChains(rows: Array<{ chain: string; n: number }>) {
  const m = new Map<string, number>();
  for (const r of rows) m.set(r.chain, (m.get(r.chain) ?? 0) + Number(r.n));
  return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(e => e[0]);
}
