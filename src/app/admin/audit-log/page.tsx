import { admin } from '@/lib/admin/supabase';
import { StatCard } from '../_components/StatCard';
import '../admin.css';

export const dynamic = 'force-dynamic';

export default async function AuditLogPage({ searchParams }: { searchParams: Promise<{ action?: string; page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? '1', 10));
  const from = (page - 1) * 100;
  const to = from + 99;

  let q = admin().from('admin_audit').select('id, admin_user_id, action, target_type, target_id, metadata, ip_hash, occurred_at', { count: 'exact' });
  if (sp.action) q = q.eq('action', sp.action);
  q = q.order('occurred_at', { ascending: false }).range(from, to);

  const res = await q;
  const rows = res.data ?? [];
  const total = res.count ?? 0;

  // Resolve usernames
  const ids = Array.from(new Set((rows as Array<{ admin_user_id: string | null }>).map(r => r.admin_user_id).filter(Boolean) as string[]));
  const usersRes = ids.length ? await admin().from('admin_users').select('id, username').in('id', ids) : { data: [] };
  const nameMap = new Map((usersRes.data as Array<{ id: string; username: string }> | null ?? []).map(u => [u.id, u.username]));

  // Top actions count
  const actionStatsRes = await admin()
    .from('admin_audit')
    .select('action')
    .gte('occurred_at', new Date(Date.now() - 7 * 86400_000).toISOString());
  type A = { action: string };
  const statRows: A[] = (actionStatsRes.data as A[] | null) ?? [];
  const byAction = statRows.reduce((acc, r) => {
    acc[r.action] = (acc[r.action] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Audit Log</h1>
          <p className="admin-sub">{total.toLocaleString()} entries · append-only</p>
        </div>
        <form style={{ display: 'flex', gap: 8 }} action="/admin/audit-log" method="get">
          <input name="action" defaultValue={sp.action ?? ''} placeholder="Filter action…" className="input" style={{ width: 200 }} />
          <button type="submit" className="btn btn-primary">Filter</button>
        </form>
      </header>

      <div className="stat-grid cols-4">
        <StatCard label="Total entries"          value={total} accent="green" />
        <StatCard label="Actions · 7d"           value={statRows.length} accent="blue" />
        <StatCard label="Unique action types"    value={Object.keys(byAction).length} accent="purple" />
        <StatCard label="Most frequent"          value={Object.entries(byAction).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? '—'} accent="gold" />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>When</th><th>Admin</th><th>Action</th><th>Target</th><th>Metadata</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={5} className="empty-state">No audit entries.</td></tr>}
            {(rows as Array<{ id: number; admin_user_id: string | null; action: string; target_type: string | null; target_id: string | null; metadata: unknown; occurred_at: string }>).map(r => (
              <tr key={r.id}>
                <td className="muted mono" style={{ whiteSpace: 'nowrap' }}>{new Date(r.occurred_at).toLocaleString('en-IL', { dateStyle: 'short', timeStyle: 'medium' })}</td>
                <td style={{ fontWeight: 600 }}>{nameMap.get(r.admin_user_id ?? '') ?? <span className="muted mono">{(r.admin_user_id ?? '').slice(0, 8)}</span>}</td>
                <td><span className="pill pill-green">{r.action}</span></td>
                <td className="muted">{r.target_type ? `${r.target_type}:${r.target_id ?? ''}` : '—'}</td>
                <td className="mono" style={{ maxWidth: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.metadata ? JSON.stringify(r.metadata) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
