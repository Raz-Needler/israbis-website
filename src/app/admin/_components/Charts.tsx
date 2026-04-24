'use client';

import {
  ResponsiveContainer,
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  Cell, LabelList
} from 'recharts';

type Point = Record<string, unknown>;

const PALETTE = ['#34C759', '#007AFF', '#AF52DE', '#FF9500', '#FF3B30', '#5AC8FA', '#D4A853', '#248A3D', '#0056CC'];

const axisTick = { fontSize: 11, fill: '#8E8E93' };
const gridStroke = '#EEF0F3';
const tooltipStyle = {
  background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10,
  fontSize: 12, color: '#1A1A1A', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
};

// ══════════════════════════════════════════════════════
// Time-series area chart (single series)
// ══════════════════════════════════════════════════════
export function AreaSeriesChart({
  data, xKey, yKey, color = '#34C759', height = 260
}: {
  data: Point[]; xKey: string; yKey: string; color?: string; height?: number;
}) {
  if (!data || data.length === 0) return <EmptyChart height={height} />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${yKey}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey={xKey} tick={axisTick} tickLine={false} axisLine={false} minTickGap={40} />
        <YAxis tick={axisTick} tickLine={false} axisLine={false} width={42} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: color, strokeOpacity: 0.15 }} />
        <Area type="monotone" dataKey={yKey} stroke={color} strokeWidth={2.2} fill={`url(#fill-${yKey})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ══════════════════════════════════════════════════════
// Multi-line chart
// ══════════════════════════════════════════════════════
export function MultiLineChart({
  data, xKey, series, height = 260
}: {
  data: Point[]; xKey: string; series: Array<{ key: string; label: string; color?: string }>; height?: number;
}) {
  if (!data || data.length === 0) return <EmptyChart height={height} />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey={xKey} tick={axisTick} tickLine={false} axisLine={false} minTickGap={40} />
        <YAxis tick={axisTick} tickLine={false} axisLine={false} width={42} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        {series.map((s, i) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.label}
                stroke={s.color ?? PALETTE[i % PALETTE.length]} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ══════════════════════════════════════════════════════
// Horizontal bar chart
// ══════════════════════════════════════════════════════
export function HBarChart({
  data, labelKey, valueKey, height = 360, color
}: {
  data: Point[]; labelKey: string; valueKey: string; height?: number; color?: string;
}) {
  if (!data || data.length === 0) return <EmptyChart height={height} />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
        <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey={labelKey} tick={axisTick} tickLine={false} axisLine={false} width={140} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(52,199,89,0.06)' }} />
        <Bar dataKey={valueKey} radius={[0, 6, 6, 0]} fill={color ?? '#34C759'}>
          {!color && data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          <LabelList dataKey={valueKey} position="right" style={{ fontSize: 10.5, fill: '#3C3C43' }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ══════════════════════════════════════════════════════
// Stacked area chart (chain share etc.)
// ══════════════════════════════════════════════════════
export function StackedAreaChart({
  data, xKey, series, height = 280
}: {
  data: Point[]; xKey: string; series: Array<{ key: string; label: string; color?: string }>; height?: number;
}) {
  if (!data || data.length === 0) return <EmptyChart height={height} />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.key} id={`stack-${s.key}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={s.color ?? PALETTE[i % PALETTE.length]} stopOpacity={0.7} />
              <stop offset="100%" stopColor={s.color ?? PALETTE[i % PALETTE.length]} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey={xKey} tick={axisTick} tickLine={false} axisLine={false} minTickGap={40} />
        <YAxis tick={axisTick} tickLine={false} axisLine={false} width={42} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        {series.map((s, i) => (
          <Area key={s.key} type="monotone" stackId="1" dataKey={s.key} name={s.label}
                stroke={s.color ?? PALETTE[i % PALETTE.length]} strokeWidth={1.5}
                fill={`url(#stack-${s.key})`} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ══════════════════════════════════════════════════════
// Funnel chart — custom implementation
// ══════════════════════════════════════════════════════
export function FunnelChart({
  steps
}: {
  steps: Array<{ name: string; value: number }>;
}) {
  if (!steps || steps.length === 0) return <EmptyChart height={240} />;
  const max = Math.max(...steps.map(s => s.value), 1);
  const first = steps[0].value || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {steps.map((s, i) => {
        const pctOfMax = Math.max(0.02, s.value / max);
        const pctOfFirst = Math.round((s.value / first) * 100);
        const drop = i === 0 ? null : Math.round(((steps[i - 1].value - s.value) / (steps[i - 1].value || 1)) * 100);
        const color = PALETTE[i % PALETTE.length];
        return (
          <div key={s.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: '#1A1A1A' }}>{i + 1}. {s.name}</span>
              <span style={{ color: '#8E8E93' }}>
                {s.value.toLocaleString()} · {pctOfFirst}% of start
                {drop != null && drop > 0 && <span style={{ color: '#B42318', marginInlineStart: 8 }}>−{drop}%</span>}
              </span>
            </div>
            <div style={{ position: 'relative', height: 26, background: '#F5F5F5', borderRadius: 7 }}>
              <div style={{
                width: `${pctOfMax * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
                borderRadius: 7,
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                paddingInlineEnd: 10,
                fontSize: 11, fontWeight: 700, color: '#fff'
              }}>
                {pctOfMax > 0.12 ? s.value.toLocaleString() : ''}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// Retention grid — weekly cohort heatmap
// ══════════════════════════════════════════════════════
export function RetentionGrid({
  rows
}: {
  rows: Array<{ cohort: string; cohort_size: number; weeks: number[] }>;
}) {
  if (!rows || rows.length === 0) return <EmptyChart height={240} />;
  const maxWeeks = Math.max(...rows.map(r => r.weeks.length));
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 11.5 }}>
        <thead>
          <tr>
            <th style={{ ...th, minWidth: 110 }}>Cohort</th>
            <th style={{ ...th, width: 70 }}>Size</th>
            {Array.from({ length: maxWeeks }, (_, i) => (
              <th key={i} style={{ ...th, width: 54 }}>W{i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.cohort}>
              <td style={{ ...td, fontWeight: 700, color: '#1A1A1A' }}>{r.cohort}</td>
              <td style={{ ...td, color: '#3C3C43' }}>{r.cohort_size}</td>
              {r.weeks.map((active, i) => {
                const pct = r.cohort_size ? (active / r.cohort_size) : 0;
                const bg = pct === 0 ? '#F5F5F5' : `rgba(52, 199, 89, ${Math.min(0.85, 0.12 + pct * 0.85)})`;
                const color = pct > 0.4 ? '#FFFFFF' : '#1A1A1A';
                return (
                  <td key={i} style={{ ...td, background: bg, color, textAlign: 'center', fontWeight: 700 }}>
                    {pct === 0 ? '' : `${Math.round(pct * 100)}%`}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const th: React.CSSProperties = { fontSize: 10, fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.6, padding: '8px 10px', borderBottom: '1px solid #EEF0F3' };
const td: React.CSSProperties = { padding: '8px 10px', borderBottom: '1px solid #F5F5F5' };

// ══════════════════════════════════════════════════════
// Empty state
// ══════════════════════════════════════════════════════
function EmptyChart({ height }: { height: number }) {
  return (
    <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8E8E93', fontSize: 12.5, flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 22, opacity: 0.4 }}>—</div>
      <div>No data in this window yet.</div>
    </div>
  );
}
