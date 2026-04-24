import { sql } from '@/lib/admin/sql';
import { adminSupabase } from '@/lib/admin/supabase';
import { StatCard } from '../_components/StatCard';
import { HBarChart, AreaSeriesChart } from '../_components/Charts';
import '../admin.css';

export const dynamic = 'force-dynamic';

export default async function ScannersPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const sp = await searchParams;
  const days = Math.max(1, Math.min(365, parseInt(sp.days ?? '30', 10)));
  const sb = adminSupabase();

  const [apiRes, fridgeRes, receiptRes] = await Promise.all([
    sb.from('api_usage').select('feature, count'),
    sb.from('fridge_scans').select('id', { count: 'exact', head: true }),
    sb.from('receipt_scans').select('id, total_amount, confidence, added_to_expenses', { count: 'exact' }).order('created_at', { ascending: false }).limit(50),
  ]);

  type A = { feature: string; count: number };
  const apiRows: A[] = (apiRes.data as A[] | null) ?? [];
  const byFeature = apiRows.reduce((acc, r) => {
    acc[r.feature] = (acc[r.feature] ?? 0) + (r.count ?? 0);
    return acc;
  }, {} as Record<string, number>);

  const scanFreq = await sql<{ event_name: string; n: number; users: number }>(`
    SELECT event_name,
           COUNT(*)::int AS n,
           COUNT(DISTINCT COALESCE(user_id, anonymous_id))::int AS users
    FROM analytics.events
    WHERE event_category='scan' AND day >= current_date - ${days}
    GROUP BY event_name ORDER BY n DESC
  `);

  const scanDaily = await sql<{ day: string; n: number }>(`
    SELECT day::text AS day, COUNT(*)::int AS n
    FROM analytics.events
    WHERE event_category='scan' AND day >= current_date - ${days}
    GROUP BY day ORDER BY day
  `);

  const receipts = receiptRes.data as Array<{ id: string; total_amount: number; confidence: number; added_to_expenses: boolean }> | null ?? [];
  const avgConfidence = receipts.length ? receipts.reduce((s, r) => s + (r.confidence ?? 0), 0) / receipts.length : 0;
  const addedRate = receipts.length ? receipts.filter(r => r.added_to_expenses).length / receipts.length : 0;

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Scanners</h1>
          <p className="admin-sub">Calorie · Fridge · Receipt · Barcode usage</p>
        </div>
        <form style={{ display: 'flex', gap: 8 }} action="/admin/scanners" method="get">
          <select name="days" defaultValue={String(days)} className="select">
            <option value="7">7d</option><option value="30">30d</option><option value="90">90d</option>
          </select>
          <button type="submit" className="btn btn-primary">Apply</button>
        </form>
      </header>

      <div className="stat-grid cols-5">
        <StatCard label="Calorie scans"    value={byFeature.calorie_scan ?? 0} accent="green" source="ApiUsage" />
        <StatCard label="Fridge scans"     value={byFeature.fridge_scan ?? 0} accent="blue" source="ApiUsage" />
        <StatCard label="Receipt scans"    value={receiptRes.count ?? 0} accent="purple" source="ReceiptScan" />
        <StatCard label="Receipt OCR conf" value={avgConfidence.toFixed(2)} unit="/ 1.0" accent="gold" />
        <StatCard label="Added to expenses" value={Math.round(addedRate * 100)} unit="%" accent="rose" />
      </div>

      <div className="chart-grid cols-2">
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Scan events per day</div></div>
          <AreaSeriesChart data={scanDaily.rows} xKey="day" yKey="n" height={240} color="#AF52DE" />
        </div>
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Events by type</div></div>
          <HBarChart data={scanFreq.rows.map(r => ({ name: r.event_name, n: Number(r.n) }))} labelKey="name" valueKey="n" height={240} />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">Recent receipt scans · 50 most recent</div>
          <div className="admin-card-sub">public.ReceiptScan</div>
        </div>
        {receipts.length === 0 ? <div className="empty-state">No receipt scans yet.</div> : (
          <table className="admin-table">
            <thead><tr><th>Total (NIS)</th><th>OCR confidence</th><th>Added to expenses</th></tr></thead>
            <tbody>
              {receipts.slice(0, 20).map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>₪ {Number(r.total_amount ?? 0).toFixed(2)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 120, height: 6, background: '#F5F5F5', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${(r.confidence ?? 0) * 100}%`, height: '100%', background: '#34C759' }} />
                      </div>
                      <span className="muted">{Number(r.confidence ?? 0).toFixed(2)}</span>
                    </div>
                  </td>
                  <td>{r.added_to_expenses ? <span className="pill pill-green">yes</span> : <span className="pill pill-neutral">no</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
