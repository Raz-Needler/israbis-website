import { adminSupabase } from '@/lib/admin/supabase';
import { EmptyCallout } from '../_components/EmptyCallout';

export const dynamic = 'force-dynamic';

interface SearchParams {
  event?: string;
  category?: string;
  user?: string;
  platform?: string;
  days?: string;
  page?: string;
}

const PAGE_SIZE = 100;

async function loadEvents(params: SearchParams) {
  const sb = adminSupabase().schema('analytics');
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const from = (page - 1) * PAGE_SIZE;
  const to   = from + PAGE_SIZE - 1;
  const days = Math.max(1, Math.min(365, parseInt(params.days ?? '7', 10)));

  const dayThreshold = new Date(Date.now() - days * 86400 * 1000).toISOString().slice(0, 10);

  let q = sb.from('events').select(
    'event_id, event_name, event_category, occurred_at, user_id, anonymous_id, session_id, platform, app_version, props',
    { count: 'exact' }
  ).gte('day', dayThreshold);

  if (params.event)    q = q.eq('event_name', params.event);
  if (params.category) q = q.eq('event_category', params.category);
  if (params.user)     q = q.eq('user_id', params.user);
  if (params.platform) q = q.eq('platform', params.platform);

  q = q.order('occurred_at', { ascending: false }).range(from, to);

  const res = await q;
  return { events: res.data ?? [], total: res.count ?? 0, page, pageSize: PAGE_SIZE, days, error: res.error?.message ?? null };
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const { events, total, page, pageSize, days, error } = await loadEvents(sp);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <header style={s.head}>
        <div>
          <h1 style={s.h1}>Events</h1>
          <p style={s.sub}>{total.toLocaleString()} events · last {days} day{days === 1 ? '' : 's'}</p>
        </div>
      </header>

      <form style={s.filters} action="/admin/events" method="get">
        <input name="event"    placeholder="event_name (e.g. cart.item_added)" defaultValue={sp.event ?? ''} style={s.filterInput} />
        <input name="category" placeholder="category"    defaultValue={sp.category ?? ''} style={{ ...s.filterInput, width: 140 }} />
        <input name="user"     placeholder="user_id"     defaultValue={sp.user ?? ''}     style={{ ...s.filterInput, width: 180 }} />
        <select name="platform" defaultValue={sp.platform ?? ''} style={s.filterSelect}>
          <option value="">Any platform</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
          <option value="web">Web</option>
          <option value="server">Server</option>
        </select>
        <select name="days" defaultValue={String(days)} style={s.filterSelect}>
          <option value="1">1 day</option>
          <option value="7">7 days</option>
          <option value="30">30 days</option>
          <option value="90">90 days</option>
        </select>
        <button type="submit" style={s.applyBtn}>Apply</button>
      </form>

      {error && <div style={s.error}>{error}</div>}

      {total === 0 && !error && (
        <EmptyCallout
          headline="No analytics events in this window."
          subline="Either the mobile SDK hasn't been wired up yet, or the filter is too narrow. Seed a synthetic user population to unlock every analytics page — no production data is touched."
        />
      )}

      <div style={s.tableCard}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Occurred</th>
              <th style={s.th}>Event</th>
              <th style={s.th}>Platform</th>
              <th style={s.th}>User</th>
              <th style={s.th}>Props</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={(e.event_id as string) ?? i} style={s.tr}>
                <td style={{ ...s.td, fontVariantNumeric: 'tabular-nums', color: '#8E8E93', whiteSpace: 'nowrap' }}>
                  {fmtTime(e.occurred_at as string)}
                </td>
                <td style={s.td}>
                  <span style={s.eventPill}>{e.event_name as string}</span>
                </td>
                <td style={{ ...s.td, color: '#3C3C43' }}>{(e.platform as string) ?? '—'}</td>
                <td style={{ ...s.td, fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#3C3C43' }}>
                  {(e.user_id as string) ?? `anon:${String(e.anonymous_id).slice(0, 6)}…`}
                </td>
                <td style={{ ...s.td, fontFamily: 'ui-monospace, monospace', fontSize: 11, maxWidth: 520, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.props ? JSON.stringify(e.props) : '—'}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#8E8E93' }}>
                No events in this window. Instrument the mobile SDK and events will stream in.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={s.pager}>
        <span style={s.pagerInfo}>Page {page} of {totalPages}</span>
      </div>
    </div>
  );
}

function fmtTime(iso: string): string {
  try { return new Date(iso).toLocaleString('en-IL', { hour12: false }); } catch { return iso; }
}

const s: Record<string, React.CSSProperties> = {
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  h1: { margin: 0, fontSize: 24, fontWeight: 800, color: '#1A1A1A', letterSpacing: -0.4 },
  sub: { margin: '6px 0 0 0', fontSize: 12.5, color: '#8E8E93' },
  filters: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 },
  filterInput: { height: 34, padding: '0 10px', fontSize: 12.5, border: '1px solid #E5E7EB', borderRadius: 8, background: '#FAFAFA', width: 240 },
  filterSelect: { height: 34, padding: '0 8px', fontSize: 12.5, border: '1px solid #E5E7EB', borderRadius: 8, background: '#FAFAFA' },
  applyBtn: { height: 34, padding: '0 14px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg, #34C759 0%, #248A3D 100%)', color: '#FFF', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' },
  tableCard: { background: '#FFF', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.8, padding: '12px 16px', borderBottom: '1px solid #EEF0F3' },
  tr: { borderBottom: '1px solid #F5F5F5' },
  td: { padding: '10px 16px', fontSize: 12.5, color: '#1A1A1A', verticalAlign: 'middle' },
  eventPill: { fontSize: 11, fontWeight: 700, color: '#248A3D', background: 'rgba(52,199,89,0.10)', borderRadius: 5, padding: '3px 8px', fontFamily: 'ui-monospace, monospace' },
  pager: { display: 'flex', justifyContent: 'center', marginTop: 14 },
  pagerInfo: { fontSize: 12, color: '#8E8E93' },
  error: { background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.20)', color: '#B42318', padding: 14, borderRadius: 10, fontSize: 13, marginBottom: 16 },
};
