import { admin } from '@/lib/admin/supabase';
import { StatCard } from '../_components/StatCard';
import '../admin.css';

export const dynamic = 'force-dynamic';

const DATASETS = [
  { key: 'intent_baskets', label: 'Intent Baskets',     table: 'analytics.fact_intent_basket' },
  { key: 'events',         label: 'Events (raw)',       table: 'analytics.events' },
  { key: 'users',          label: 'Users',              table: 'public."User"' },
  { key: 'purchases',      label: 'Purchases',          table: 'public."PurchaseHistory"' },
  { key: 'families',       label: 'Families',           table: 'public."Family"' },
  { key: 'prices',         label: 'Product prices',     table: 'public."ProductPrice"' },
];

export default async function ExportsPage() {
  const jobsRes = await admin().from('export_jobs').select('*').order('created_at', { ascending: false }).limit(50);
  const jobs = (jobsRes.data as Array<{ id: string; dataset: string; format: string; status: string; row_count: number | null; created_at: string; completed_at: string | null; download_url: string | null }> | null) ?? [];

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Exports</h1>
          <p className="admin-sub">Download datasets as CSV, Excel, or JSON · all exports audit-logged</p>
        </div>
      </header>

      <div className="stat-grid cols-4">
        <StatCard label="Jobs (all time)"         value={jobs.length} accent="green" />
        <StatCard label="Completed"               value={jobs.filter(j => j.status === 'completed').length} accent="blue" />
        <StatCard label="Queued / running"        value={jobs.filter(j => j.status === 'queued' || j.status === 'running').length} accent="gold" />
        <StatCard label="Failed"                  value={jobs.filter(j => j.status === 'failed').length} accent="rose" />
      </div>

      <div className="chart-grid cols-1-1">
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Available datasets</div></div>
          <table className="admin-table">
            <thead><tr><th>Dataset</th><th>Source table</th><th style={{ width: 160 }}></th></tr></thead>
            <tbody>
              {DATASETS.map(d => (
                <tr key={d.key}>
                  <td style={{ fontWeight: 600 }}>{d.label}</td>
                  <td className="mono muted">{d.table}</td>
                  <td>
                    <form action="/api/admin/export" method="post" style={{ display: 'flex', gap: 6 }}>
                      <input type="hidden" name="dataset" value={d.key} />
                      <button className="btn btn-secondary" style={{ height: 28, fontSize: 11 }} name="format" value="csv">CSV</button>
                      <button className="btn btn-secondary" style={{ height: 28, fontSize: 11 }} name="format" value="xlsx">Excel</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Recent jobs</div></div>
          {jobs.length === 0 ? (
            <div className="empty-state">No exports yet. Request one from the left panel.</div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Dataset</th><th>Format</th><th>Status</th><th>Rows</th><th>Download</th></tr></thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.id}>
                    <td>{j.dataset}</td>
                    <td><span className="pill pill-neutral">{j.format}</span></td>
                    <td>
                      {j.status === 'completed' && <span className="pill pill-green">completed</span>}
                      {j.status === 'running'   && <span className="pill pill-gold">running</span>}
                      {j.status === 'queued'    && <span className="pill pill-blue">queued</span>}
                      {j.status === 'failed'    && <span className="pill pill-rose">failed</span>}
                    </td>
                    <td>{j.row_count ?? '—'}</td>
                    <td>{j.download_url ? <a href={j.download_url}>Download</a> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
