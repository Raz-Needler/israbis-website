import Link from 'next/link';
import { adminSupabase } from '@/lib/admin/supabase';
import { AreaSeriesChart } from '../_components/Charts';
import { StatCard } from '../_components/StatCard';
import '../admin.css';

export const dynamic = 'force-dynamic';

interface SearchParams { q?: string; page?: string; provider?: string }
const PAGE_SIZE = 50;

async function loadUsers(params: SearchParams) {
  const sb = adminSupabase();
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const from = (page - 1) * PAGE_SIZE;
  const to   = from + PAGE_SIZE - 1;

  let q = sb.from('User').select('id, name, email, provider, joinDate, avatarColor', { count: 'exact' });
  if (params.q) {
    const needle = `%${params.q}%`;
    q = q.or(`email.ilike.${needle},name.ilike.${needle}`);
  }
  if (params.provider) q = q.eq('provider', params.provider);
  q = q.order('joinDate', { ascending: false }).range(from, to);

  const listRes = await q;

  // last-30-day signup series
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400_000).toISOString();
  const trendRes = await sb.from('User').select('joinDate').gte('joinDate', thirtyDaysAgo);

  // provider breakdown
  const providerRes = await sb.from('User').select('provider');

  type U = { joinDate: string };
  const trendRows: U[] = (trendRes.data as U[] | null) ?? [];
  const series = bucketByDay(trendRows.map(r => r.joinDate), 30);

  type P = { provider: string | null };
  const providerRows: P[] = (providerRes.data as P[] | null) ?? [];
  const providerCount = providerRows.reduce((acc, r) => {
    const p = r.provider ?? 'email';
    acc[p] = (acc[p] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    users: listRes.data ?? [],
    total: listRes.count ?? 0,
    page, pageSize: PAGE_SIZE,
    series, providerCount,
    error: listRes.error?.message ?? null
  };
}

export default async function UsersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const { users, total, page, pageSize, series, providerCount, error } = await loadUsers(sp);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const newThisWeek = series.slice(-7).reduce((s, r) => s + r.count, 0);
  const newLastWeek = series.slice(-14, -7).reduce((s, r) => s + r.count, 0);
  const delta = newLastWeek > 0 ? ((newThisWeek - newLastWeek) / newLastWeek) * 100 : 0;

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Users</h1>
          <p className="admin-sub">{total.toLocaleString()} total app users · page {page} of {totalPages}</p>
        </div>
        <form style={{ display: 'flex', gap: 8 }} action="/admin/users" method="get">
          <input name="q" defaultValue={sp.q ?? ''} placeholder="Search email or name" className="input" style={{ width: 240 }} />
          <select name="provider" defaultValue={sp.provider ?? ''} className="select" style={{ width: 120 }}>
            <option value="">Any auth</option>
            <option value="email">Email</option>
            <option value="google">Google</option>
            <option value="apple">Apple</option>
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
          {(sp.q || sp.provider) && <Link href="/admin/users" className="btn btn-ghost">Clear</Link>}
        </form>
      </header>

      {error && <div className="error-box">{error}</div>}

      <div className="stat-grid cols-4">
        <StatCard label="Total users" value={total} accent="green" source="public.User count" />
        <StatCard
          label="New · last 7 days"
          value={newThisWeek}
          delta={newLastWeek > 0 ? { value: delta, kind: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat', label: 'vs prior 7d' } : undefined}
          accent="blue"
        />
        <StatCard label="Email auth" value={providerCount.email ?? 0} accent="purple" />
        <StatCard label="OAuth (Google+Apple)" value={(providerCount.google ?? 0) + (providerCount.apple ?? 0)} accent="gold" />
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card-head">
          <div>
            <div className="admin-card-title">New signups · last 30 days</div>
            <div className="admin-card-sub">public.User.joinDate, bucketed by day</div>
          </div>
        </div>
        <AreaSeriesChart data={series} xKey="day" yKey="count" color="#34C759" height={180} />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Provider</th>
              <th>Joined</th>
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={5} className="empty-state">
                <strong>No users found.</strong>
                {sp.q ? `No matches for "${sp.q}".` : 'The User table is empty.'}
              </td></tr>
            )}
            {users.map(u => (
              <tr key={u.id as string}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%', display: 'inline-flex',
                      alignItems: 'center', justifyContent: 'center',
                      background: (u.avatarColor as string) ?? '#34C759',
                      color: '#fff', fontSize: 12, fontWeight: 700
                    }}>
                      {((u.name as string) ?? '?').charAt(0).toUpperCase()}
                    </span>
                    <span style={{ fontWeight: 600 }}>{u.name as string}</span>
                  </div>
                </td>
                <td className="muted">{u.email as string}</td>
                <td><span className="pill pill-neutral">{(u.provider as string) ?? 'email'}</span></td>
                <td className="muted">{fmtDate(u.joinDate as string)}</td>
                <td><Link href={`/admin/users/${u.id}`} style={{ fontSize: 12.5, fontWeight: 600 }}>View →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 16 }}>
        {page > 1 ? <Link href={hrefFor(sp, page - 1)} className="btn btn-secondary">← Previous</Link> : <span className="btn btn-secondary" style={{ opacity: 0.4 }}>← Previous</span>}
        <span style={{ fontSize: 12, color: '#8E8E93' }}>{page} / {totalPages}</span>
        {page < totalPages ? <Link href={hrefFor(sp, page + 1)} className="btn btn-secondary">Next →</Link> : <span className="btn btn-secondary" style={{ opacity: 0.4 }}>Next →</span>}
      </div>
    </div>
  );
}

function hrefFor(sp: SearchParams, p: number): string {
  const u = new URLSearchParams();
  if (sp.q) u.set('q', sp.q);
  if (sp.provider) u.set('provider', sp.provider);
  u.set('page', String(p));
  return `/admin/users?${u.toString()}`;
}

function bucketByDay(dates: string[], days: number) {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
    buckets.set(d, 0);
  }
  for (const iso of dates) {
    const d = (iso || '').slice(0, 10);
    if (buckets.has(d)) buckets.set(d, (buckets.get(d) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([day, count]) => ({ day, count }));
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('en-IL', { year: 'numeric', month: 'short', day: '2-digit' }); }
  catch { return iso; }
}
