import { adminSupabase } from '@/lib/admin/supabase';
import { sql } from '@/lib/admin/sql';
import { StatCard } from '../_components/StatCard';
import { AreaSeriesChart, HBarChart } from '../_components/Charts';
import '../admin.css';

export const dynamic = 'force-dynamic';

export default async function AIPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const sp = await searchParams;
  const days = Math.max(1, Math.min(365, parseInt(sp.days ?? '30', 10)));
  const sb = adminSupabase();

  const convRes = await sb.from('AssistantConversation').select('id', { count: 'exact', head: true });
  const msgRes  = await sb.from('AssistantMessage').select('id', { count: 'exact', head: true });

  const dailyRes = await sql<{ day: string; msgs: number }>(`
    SELECT day::text AS day, COUNT(*)::int AS msgs
    FROM analytics.events
    WHERE event_name='ai.message_sent' AND day >= current_date - ${days}
    GROUP BY day ORDER BY day
  `);

  const toolsRes = await sql<{ tool: string; n: number; fail_rate: number | null }>(`
    SELECT
      COALESCE(props->>'tool_name','unknown') AS tool,
      COUNT(*)::int AS n,
      (COUNT(*) FILTER (WHERE (props->>'success')::boolean = false)::numeric
        / NULLIF(COUNT(*)::numeric, 0) * 100)::numeric(5,1) AS fail_rate
    FROM analytics.events
    WHERE event_name='ai.tool_called' AND day >= current_date - ${days}
    GROUP BY 1 ORDER BY n DESC LIMIT 10
  `);

  const latencyRes = await sql<{ avg_ms: number | null; p95_ms: number | null }>(`
    SELECT
      AVG((props->>'latency_ms')::int)::int AS avg_ms,
      PERCENTILE_DISC(0.95) WITHIN GROUP (ORDER BY (props->>'latency_ms')::int) AS p95_ms
    FROM analytics.events
    WHERE event_name='ai.response_received' AND day >= current_date - ${days}
  `);
  const lat = latencyRes.rows[0] ?? { avg_ms: null, p95_ms: null };

  const dauAiRes = await sql<{ day: string; dau: number }>(`
    SELECT day::text AS day, COUNT(DISTINCT COALESCE(user_id, anonymous_id))::int AS dau
    FROM analytics.events
    WHERE event_name='ai.message_sent' AND day >= current_date - ${days}
    GROUP BY day ORDER BY day
  `);

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Miki AI</h1>
          <p className="admin-sub">Assistant usage, tool calls, latency</p>
        </div>
        <form style={{ display: 'flex', gap: 8 }} action="/admin/ai" method="get">
          <select name="days" defaultValue={String(days)} className="select">
            <option value="7">7d</option><option value="30">30d</option><option value="90">90d</option>
          </select>
          <button type="submit" className="btn btn-primary">Apply</button>
        </form>
      </header>

      <div className="stat-grid cols-4">
        <StatCard label="Conversations (total)"   value={convRes.count ?? 0} accent="blue" source="AssistantConversation" />
        <StatCard label="Messages (total)"        value={msgRes.count ?? 0} accent="purple" source="AssistantMessage" />
        <StatCard label="Avg latency"             value={lat.avg_ms ?? '—'} unit="ms" accent="gold" />
        <StatCard label="P95 latency"             value={lat.p95_ms ?? '—'} unit="ms" accent="rose" />
      </div>

      <div className="chart-grid cols-2">
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Messages per day</div></div>
          <AreaSeriesChart data={dailyRes.rows} xKey="day" yKey="msgs" height={260} color="#AF52DE" />
        </div>
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">AI DAU</div></div>
          <AreaSeriesChart data={dauAiRes.rows} xKey="day" yKey="dau" height={260} color="#007AFF" />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">Tool-call frequency</div>
          <div className="admin-card-sub">Miki&apos;s function-calling usage</div>
        </div>
        <HBarChart data={toolsRes.rows} labelKey="tool" valueKey="n" height={300} />
      </div>
    </div>
  );
}
