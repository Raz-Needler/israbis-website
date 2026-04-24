import Link from 'next/link';
import { notFound } from 'next/navigation';
import { adminSupabase } from '@/lib/admin/supabase';
import { StatCard } from '../../_components/StatCard';
import { AreaSeriesChart } from '../../_components/Charts';
import '../../admin.css';

export const dynamic = 'force-dynamic';

// User IDs are UUIDs. Reject anything that isn't — this is what kept us out
// of SQL-injection territory even before we moved the event queries off
// string interpolation. Belt-and-suspenders: validate the shape here, then
// read events via the Supabase client (which parameterizes under the hood).
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function loadUser(id: string) {
  if (!UUID_RE.test(id)) return null;

  const sb = adminSupabase();

  const userRes = await sb.from('users').select('*').eq('id', id).maybeSingle();
  if (userRes.error || !userRes.data) return null;
  const user = userRes.data;

  const [prefsRes, purchasesRes, recipesRes, familyRes, bookmarksRes] = await Promise.all([
    sb.from('user_preferences').select('*').eq('user_id', id).maybeSingle(),
    sb.from('purchase_history').select('id, store_name, total_cost, item_count, purchased_at').eq('user_id', id).order('purchased_at', { ascending: false }).limit(20),
    sb.from('user_recipes').select('id, title, category, source_type, created_at').eq('user_id', id).order('created_at', { ascending: false }).limit(10),
    sb.from('family_members').select('family:family_id(id, name, owner_id), role').eq('user_id', id),
    sb.from('bookmarks').select('recipe_id, created_at').eq('user_id', id).order('created_at', { ascending: false }).limit(20),
  ]);

  // Events via Supabase client — parameterized, no string concatenation.
  const nowDate = new Date();
  const threshold = new Date(nowDate.getTime() - 30 * 86400_000).toISOString().slice(0, 10);
  const [recentEventsRes, dailyEventsAggRes] = await Promise.all([
    sb.schema('analytics').from('events')
      .select('event_name, occurred_at, props')
      .eq('user_id', id)
      .order('occurred_at', { ascending: false })
      .limit(100),
    sb.schema('analytics').from('events')
      .select('day')
      .eq('user_id', id)
      .gte('day', threshold)
      .limit(20000),
  ]);

  // Aggregate daily event counts in JS since PostgREST can't GROUP BY.
  const dailyMap = new Map<string, number>();
  for (const r of (dailyEventsAggRes.data ?? []) as Array<{ day: string }>) {
    dailyMap.set(r.day, (dailyMap.get(r.day) ?? 0) + 1);
  }
  const dailyEvents = Array.from(dailyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, n]) => ({ day, n }));

  const eventsRes = {
    rows: (recentEventsRes.data ?? []).map(r => ({
      event_name: (r as { event_name: string }).event_name,
      occurred_at: String((r as { occurred_at: string }).occurred_at),
      props: (r as { props: Record<string, unknown> | null }).props,
    })),
  };

  return {
    user,
    prefs: prefsRes.data,
    purchases: purchasesRes.data ?? [],
    recipes: recipesRes.data ?? [],
    family: familyRes.data ?? [],
    bookmarks: bookmarksRes.data ?? [],
    recentEvents: eventsRes.rows,
    dailyEvents,
  };
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadUser(id);
  if (!data) notFound();

  const { user, prefs, purchases, recipes, family, bookmarks, recentEvents, dailyEvents } = data;
  const daysSinceJoin = Math.round((Date.now() - new Date(user.join_date as string).getTime()) / 86400_000);
  const totalSpent = (purchases as Array<{ total_cost: number }>).reduce((s, p) => s + (Number(p.total_cost) || 0), 0);

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <Link href="/admin/users" style={{ fontSize: 12, color: '#8E8E93' }}>← All users</Link>
          <h1 className="admin-h1" style={{ marginTop: 4 }}>{user.name as string}</h1>
          <p className="admin-sub">
            {user.email as string} · {user.provider as string ?? 'email'} auth ·
            joined {fmtDate(user.join_date as string)} ({daysSinceJoin} days ago)
          </p>
        </div>
      </header>

      <div className="stat-grid cols-4">
        <StatCard label="Purchases logged"        value={purchases.length} source="PurchaseHistory" accent="green" />
        <StatCard label="Total spent (NIS)"       value={Math.round(totalSpent)} source="sum of PurchaseHistory.totalCost" accent="gold" />
        <StatCard label="Recipes created"         value={recipes.length} source="UserRecipe" accent="blue" />
        <StatCard label="Events · last 30 days"   value={dailyEvents.reduce((s, r) => s + r.n, 0)} source="analytics.events" accent="purple" />
      </div>

      <div className="chart-grid cols-2">
        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Activity · last 30 days</div>
              <div className="admin-card-sub">Events per day</div>
            </div>
          </div>
          <AreaSeriesChart data={dailyEvents} xKey="day" yKey="n" height={200} />
        </div>
        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Profile</div>
            </div>
          </div>
          <dl style={{ margin: 0, fontSize: 13, color: '#3C3C43', lineHeight: 1.9 }}>
            <Row k="User ID"          v={<span className="mono">{user.id as string}</span>} />
            <Row k="Name"             v={user.name as string} />
            <Row k="Email"            v={user.email as string} />
            <Row k="Provider"         v={<span className="pill pill-neutral">{user.provider as string ?? 'email'}</span>} />
            <Row k="Joined"           v={fmtDate(user.join_date as string)} />
            <Row k="Theme"            v={prefs?.dark_mode ? 'Dark' : 'Light'} />
            <Row k="Preferred store"  v={prefs?.preferred_store ?? '—'} />
            <Row k="Location city"    v={prefs?.location_city ?? '—'} />
            <Row k="Bookmarks"        v={bookmarks.length.toString()} />
          </dl>
        </div>
      </div>

      <div className="chart-grid cols-1-1">
        <div className="admin-card">
          <div className="admin-card-head">
            <div className="admin-card-title">Recent purchases</div>
            <span className="pill pill-neutral">{purchases.length}</span>
          </div>
          {purchases.length === 0 ? <div className="empty-state">No purchases logged yet.</div> : (
            <table className="admin-table" style={{ background: 'transparent' }}>
              <thead><tr><th>Store</th><th>Items</th><th>Total</th><th>When</th></tr></thead>
              <tbody>
                {(purchases as Array<{ store_name: string; item_count: number; total_cost: number; purchased_at: string }>).map((p, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{p.store_name ?? '—'}</td>
                    <td className="muted">{p.item_count ?? 0}</td>
                    <td>₪ {Number(p.total_cost ?? 0).toFixed(2)}</td>
                    <td className="muted">{fmtDate(p.purchased_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-head">
            <div className="admin-card-title">Family membership</div>
          </div>
          {family.length === 0 ? <div className="empty-state">Not a member of any family group.</div> : (
            <ul style={{ margin: 0, paddingInlineStart: 0, listStyle: 'none' }}>
              {(family as unknown as Array<{ family: { id: string; name: string } | Array<{ id: string; name: string }> | null; role: string }>).map((f, i) => {
                const fam = Array.isArray(f.family) ? f.family[0] : f.family;
                if (!fam) return null;
                return (
                  <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #F5F5F5', fontSize: 13 }}>
                    <strong>{fam.name}</strong>
                    <span className="pill pill-green" style={{ marginInlineStart: 8 }}>{f.role}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 14 }}>
        <div className="admin-card-head">
          <div className="admin-card-title">Event timeline · latest 100</div>
          <span className="admin-card-sub">analytics.events</span>
        </div>
        {recentEvents.length === 0 ? <div className="empty-state">No events for this user yet. Instrument the mobile SDK to start tracking.</div> : (
          <div style={{ maxHeight: 480, overflowY: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>When</th><th>Event</th><th>Props</th></tr></thead>
              <tbody>
                {recentEvents.map((e, i) => (
                  <tr key={i}>
                    <td className="muted mono" style={{ whiteSpace: 'nowrap' }}>{fmtDate(e.occurred_at)}</td>
                    <td><span className="pill pill-green">{e.event_name}</span></td>
                    <td className="mono" style={{ maxWidth: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {e.props ? JSON.stringify(e.props) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '4px 0', borderBottom: '1px solid #F5F5F5' }}>
      <dt style={{ minWidth: 130, color: '#8E8E93', fontWeight: 600, fontSize: 12 }}>{k}</dt>
      <dd style={{ margin: 0, color: '#1A1A1A' }}>{v}</dd>
    </div>
  );
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString('en-IL', { dateStyle: 'medium', timeStyle: 'short' }); }
  catch { return iso; }
}
