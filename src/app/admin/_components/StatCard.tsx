import type { CSSProperties } from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: { value: number; label?: string; kind?: 'up' | 'down' | 'flat' };
  accent?: 'green' | 'blue' | 'rose' | 'gold' | 'purple';
  source?: string;
  sparkline?: number[];
}

export function StatCard({ label, value, unit, delta, accent = 'green', source, sparkline }: StatCardProps) {
  const arrow = delta?.kind === 'up' ? '↑' : delta?.kind === 'down' ? '↓' : '→';
  const deltaClass = delta ? (delta.kind === 'up' ? 'up' : delta.kind === 'down' ? 'down' : 'flat') : '';
  return (
    <div className={`stat-card accent-${accent}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {typeof value === 'number' ? fmt(value) : value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      {delta && (
        <div className={`stat-delta ${deltaClass}`}>
          <span>{arrow}</span>
          <span>{Math.abs(delta.value).toFixed(1)}%</span>
          {delta.label && <span style={{ fontWeight: 400, opacity: 0.7 }}>· {delta.label}</span>}
        </div>
      )}
      {sparkline && sparkline.length > 1 && <Sparkline values={sparkline} accent={accent} />}
      {source && <div className="stat-source">{source}</div>}
    </div>
  );
}

function Sparkline({ values, accent }: { values: number[]; accent: string }) {
  const w = 120, h = 34, pad = 2;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = (w - pad * 2) / Math.max(1, values.length - 1);
  const pts = values
    .map((v, i) => `${pad + i * step},${h - pad - ((v - min) / range) * (h - pad * 2)}`)
    .join(' ');
  const colorMap: Record<string, string> = {
    green: '#248A3D', blue: '#0056CC', rose: '#B42318', gold: '#D4A853', purple: '#AF52DE'
  };
  const color = colorMap[accent] ?? '#248A3D';
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={sparkStyle}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const sparkStyle: CSSProperties = { display: 'block', marginTop: 8, height: 34, width: '100%' };

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (Math.abs(n) >= 10_000) return (n / 1_000).toFixed(0) + 'K';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}
