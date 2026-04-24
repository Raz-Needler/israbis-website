import Link from 'next/link';
import { sql } from '@/lib/admin/sql';
import { adminSupabase } from '@/lib/admin/supabase';
import { AreaSeriesChart, HBarChart } from '../../_components/Charts';
import { StatCard } from '../../_components/StatCard';
import '../../admin.css';

export const dynamic = 'force-dynamic';

export default async function ChainDetailPage({ params, searchParams }: { params: Promise<{ chainKey: string }>; searchParams: Promise<{ days?: string }> }) {
  const { chainKey } = await params;
  const sp = await searchParams;
  const days = Math.max(7, Math.min(365, parseInt(sp.days ?? '30', 10)));
  const safeKey = chainKey.replace(/'/g, "''");
  const sb = adminSupabase();

  const branchRes = await sb.from('StoreBranch').select('id, name, city, lat, lng, isActive').eq('chainKey', chainKey).order('city', { ascending: true });
  const branches = branchRes.data ?? [];

  const volumeRes = await sql<{ day: string; n: number }>(`
    SELECT day::text AS day, COUNT(*)::int AS n
    FROM analytics.events
    WHERE event_name = 'cart.chain_switched'
      AND props->>'to_chain' = '${safeKey}'
      AND day >= current_date - ${days}
    GROUP BY day ORDER BY day
  `);

  const switchedIntoRes = await sql<{ from_chain: string; n: number }>(`
    SELECT props->>'from_chain' AS from_chain, COUNT(*)::int AS n
    FROM analytics.events
    WHERE event_name='cart.chain_switched'
      AND props->>'to_chain' = '${safeKey}'
      AND day >= current_date - ${days}
    GROUP BY 1 ORDER BY n DESC LIMIT 10
  `);
  const switchedOutRes = await sql<{ to_chain: string; n: number }>(`
    SELECT props->>'to_chain' AS to_chain, COUNT(*)::int AS n
    FROM analytics.events
    WHERE event_name='cart.chain_switched'
      AND props->>'from_chain' = '${safeKey}'
      AND day >= current_date - ${days}
    GROUP BY 1 ORDER BY n DESC LIMIT 10
  `);

  const autoRes = await sql<{ completed: number; failed: number }>(`
    SELECT
      COUNT(*) FILTER (WHERE event_name='chain.auto_cart_completed')::int AS completed,
      COUNT(*) FILTER (WHERE event_name='chain.auto_cart_failed')::int    AS failed
    FROM analytics.events
    WHERE props->>'chain_key' = '${safeKey}' AND day >= current_date - ${days}
  `);
  const auto = autoRes.rows[0] ?? { completed: 0, failed: 0 };
  const autoRate = auto.completed + auto.failed > 0 ? Math.round((auto.completed / (auto.completed + auto.failed)) * 100) : null;

  const totalSwitchesIn = volumeRes.rows.reduce((s, r) => s + Number(r.n), 0);

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <Link href="/admin/chains" style={{ fontSize: 12, color: '#8E8E93' }}>← All chains</Link>
          <h1 className="admin-h1" style={{ marginTop: 4 }}>{chainKey}</h1>
          <p className="admin-sub">{branches.length} branches · last {days} days of intent data</p>
        </div>
        <form style={{ display: 'flex', gap: 8 }} action={`/admin/chains/${chainKey}`} method="get">
          <select name="days" defaultValue={String(days)} className="select">
            <option value="7">7d</option><option value="30">30d</option><option value="90">90d</option>
          </select>
          <button type="submit" className="btn btn-primary">Apply</button>
        </form>
      </header>

      <div className="stat-grid cols-4">
        <StatCard label="Branches"                value={branches.length} accent="green" />
        <StatCard label="Switches IN to chain"    value={totalSwitchesIn} accent="blue" />
        <StatCard label="Auto-cart completed"     value={auto.completed} accent="purple" />
        <StatCard label="Auto-cart success %"     value={autoRate ?? '—'} unit={autoRate != null ? '%' : ''} accent="gold" />
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card-head"><div className="admin-card-title">Switches IN · daily volume</div></div>
        <AreaSeriesChart data={volumeRes.rows} xKey="day" yKey="n" height={220} color="#248A3D" />
      </div>

      <div className="chart-grid cols-1-1">
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Users came FROM these chains</div></div>
          <HBarChart data={switchedIntoRes.rows} labelKey="from_chain" valueKey="n" height={260} color="#007AFF" />
        </div>
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Users left TO these chains</div></div>
          <HBarChart data={switchedOutRes.rows} labelKey="to_chain" valueKey="n" height={260} color="#FF9500" />
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 14 }}>
        <div className="admin-card-head">
          <div className="admin-card-title">Branches</div>
          <span className="admin-card-sub">from public.StoreBranch</span>
        </div>
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>City</th><th>Lat/Lng</th><th>Active</th></tr></thead>
            <tbody>
              {(branches as Array<{ id: string; name: string; city: string; lat: number; lng: number; isActive: boolean }>).map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.name}</td>
                  <td className="muted">{b.city}</td>
                  <td className="mono">{b.lat?.toFixed(4)}, {b.lng?.toFixed(4)}</td>
                  <td>{b.isActive ? <span className="pill pill-green">active</span> : <span className="pill pill-neutral">inactive</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
