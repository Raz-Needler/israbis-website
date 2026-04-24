import { sql } from '@/lib/admin/sql';
import { RetentionGrid } from '../_components/Charts';
import { StatCard } from '../_components/StatCard';
import { EmptyCallout } from '../_components/EmptyCallout';
import '../admin.css';

export const dynamic = 'force-dynamic';

interface RetentionCell { cohort_week: string; week_n: number; active_users: number }
interface CohortRow { cohort: string; cohort_size: number; weeks: Array<number | null> }

async function loadRetention(days: number) {
  const { rows, error } = await sql<RetentionCell>(`
    WITH firsts AS (
      SELECT anonymous_id, DATE_TRUNC('week', MIN(occurred_at))::date AS cohort_week
      FROM analytics.events
      WHERE day >= current_date - ${days}
      GROUP BY anonymous_id
    ),
    grid AS (
      SELECT f.cohort_week,
             ((DATE_TRUNC('week', e.occurred_at)::date - f.cohort_week) / 7)::int AS week_n,
             COUNT(DISTINCT f.anonymous_id)::int AS active_users
      FROM firsts f
      INNER JOIN analytics.events e USING (anonymous_id)
      WHERE e.occurred_at >= f.cohort_week
      GROUP BY f.cohort_week, week_n
    )
    SELECT cohort_week::text, week_n, active_users
    FROM grid
    ORDER BY cohort_week, week_n
  `);
  if (error) return { cohorts: [], error };
  // Pivot to cohort rows. `weeks[i]` = active users at week i for that cohort;
  // `null` means "that week hasn't happened yet" (future relative to today) —
  // rendered as a grey cell, distinct from `0` = "week elapsed, no returns".
  const msPerWeek = 7 * 86400_000;
  const nowMs = Date.now();
  const map = new Map<string, Map<number, number>>();
  for (const r of rows) {
    if (!map.has(r.cohort_week)) map.set(r.cohort_week, new Map());
    map.get(r.cohort_week)!.set(r.week_n, r.active_users);
  }
  const cohorts: CohortRow[] = Array.from(map.entries()).map(([cohort, ws]) => {
    const size = ws.get(0) ?? 0;
    const observedMax = Math.max(...Array.from(ws.keys()), 0);
    const cohortStartMs = new Date(cohort + 'T00:00:00Z').getTime();
    const elapsedWeeks = Math.max(0, Math.floor((nowMs - cohortStartMs) / msPerWeek));
    const maxWeek = Math.max(observedMax, elapsedWeeks);
    const weeks: Array<number | null> = [];
    for (let i = 0; i <= maxWeek; i++) {
      if (i > elapsedWeeks) {
        weeks.push(null);            // future — no rendering
      } else {
        weeks.push(ws.get(i) ?? 0);  // elapsed — 0 means "no returns", still meaningful
      }
    }
    return { cohort, cohort_size: size, weeks };
  }).reverse();
  return { cohorts, error: null };
}

export default async function RetentionPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const sp = await searchParams;
  const days = Math.max(7, Math.min(365, parseInt(sp.days ?? '90', 10)));
  const { cohorts, error } = await loadRetention(days);

  const totalCohorts = cohorts.length;
  const avgW1 = cohorts
    .filter(c => c.cohort_size > 0 && c.weeks.length >= 2 && c.weeks[1] !== null)
    .map(c => ((c.weeks[1] as number) / c.cohort_size) * 100);
  const avgW1Mean = avgW1.length ? avgW1.reduce((s, v) => s + v, 0) / avgW1.length : 0;

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Retention</h1>
          <p className="admin-sub">Weekly cohort grid · users active N weeks after first seen</p>
        </div>
        <form style={{ display: 'flex', gap: 8 }} action="/admin/retention" method="get">
          <select name="days" defaultValue={String(days)} className="select">
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
            <option value="180">180 days</option>
            <option value="365">365 days</option>
          </select>
          <button type="submit" className="btn btn-primary">Apply</button>
        </form>
      </header>

      {error && <div className="error-box">{error}</div>}

      <div className="stat-grid cols-3">
        <StatCard label="Cohorts in window" value={totalCohorts} accent="blue" />
        <StatCard label="Avg Week-1 retention" value={avgW1Mean.toFixed(1)} unit="%" accent="green" />
        <StatCard label="Window" value={days} unit="days" accent="gold" />
      </div>

      {totalCohorts === 0 && !error && (
        <EmptyCallout
          headline="No retention cohorts in this window."
          subline="The cohort grid needs analytics.events to compute week-over-week return rates. Seed simulated data to see cohorts form and decay realistically."
        />
      )}

      <div className="admin-card">
        <div className="admin-card-head">
          <div>
            <div className="admin-card-title">Weekly cohort retention</div>
            <div className="admin-card-sub">Color intensity = % of cohort active in that week</div>
          </div>
        </div>
        <RetentionGrid rows={cohorts} />
      </div>
    </div>
  );
}
