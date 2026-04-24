'use client';

import { useState, useMemo } from 'react';
import { profileFor } from '@/lib/admin/chainProfiles';

export interface BranchPoint {
  chainKey: string;
  city: string;
  lat: number;
  lng: number;
  name?: string;
}

interface Props {
  targetChain: string;
  targetBranches: BranchPoint[];
  competitorBranches: BranchPoint[];
}

/**
 * Interactive Israel map. We use a simple equirectangular projection scoped
 * to Israel's bounding box + a hand-drawn coastline path that keeps the map
 * recognizable without pulling in a heavy GeoJSON package. Branches plot as
 * colored dots — target chain in its brand color, competitors in neutral
 * grey; hovering pops a label, toggle pill switches the emphasis.
 *
 * Israel bbox: lat 29.5 → 33.4, lng 34.2 → 35.9. Aspect: ~1.0 × 2.3.
 */
export function BranchMap({ targetChain, targetBranches, competitorBranches }: Props) {
  const [mode, setMode] = useState<'target' | 'competitors' | 'both'>('both');
  const [hover, setHover] = useState<{ x: number; y: number; text: string } | null>(null);
  const profile = profileFor(targetChain);

  // Project lat/lng → SVG coordinates. Lower lat (south) → bigger y (down).
  // Flip lng so east is right.
  const project = (lat: number, lng: number) => {
    const xPct = (lng - 34.2) / (35.9 - 34.2);
    const yPct = 1 - (lat - 29.5) / (33.4 - 29.5);
    return { x: 40 + xPct * 320, y: 20 + yPct * 720 };
  };

  const targetDots = useMemo(
    () =>
      targetBranches
        .filter(b => Number.isFinite(b.lat) && Number.isFinite(b.lng) && b.lat > 29 && b.lat < 34 && b.lng > 34 && b.lng < 36)
        .map(b => ({ ...b, ...project(b.lat, b.lng) })),
    [targetBranches]
  );
  const competitorDots = useMemo(
    () =>
      competitorBranches
        .filter(b => Number.isFinite(b.lat) && Number.isFinite(b.lng) && b.lat > 29 && b.lat < 34 && b.lng > 34 && b.lng < 36)
        .map(b => ({ ...b, ...project(b.lat, b.lng) })),
    [competitorBranches]
  );

  // Collect unique cities (target coverage) for the side list
  const cityCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const b of targetBranches) {
      if (!b.city) continue;
      m.set(b.city, (m.get(b.city) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [targetBranches]);

  return (
    <div style={wrapStyles}>
      <div style={topRowStyles}>
        <div>
          <div style={headStyles}>
            Where {profile.displayName} plays — and where it fights
          </div>
          <div style={subStyles}>
            {targetBranches.length} {profile.displayName} branches · {competitorBranches.length} competitor branches across top rivals
          </div>
        </div>
        <div style={toggleGroupStyles}>
          <ToggleChip active={mode === 'target'}      onClick={() => setMode('target')}      color={profile.color} label={profile.displayName} />
          <ToggleChip active={mode === 'competitors'} onClick={() => setMode('competitors')} color="#8E8E93"      label="Rivals" />
          <ToggleChip active={mode === 'both'}        onClick={() => setMode('both')}        color="#1A1A1A"      label="Both" />
        </div>
      </div>

      <div style={mapGridStyles}>
        <svg viewBox="0 0 400 760" style={mapStyles} role="img" aria-label="Israel branch map">
          {/* Israel coastline — hand-simplified path covering the mainland outline */}
          <path d={ISRAEL_OUTLINE} fill="#F7FAFC" stroke="#C9D1D9" strokeWidth={1.2} />

          {/* Competitor dots first, so target sits on top */}
          {(mode === 'competitors' || mode === 'both') &&
            competitorDots.map((d, i) => (
              <circle
                key={`c-${i}`}
                cx={d.x} cy={d.y} r={2.6}
                fill="#9BA2AA" opacity={0.72}
                onMouseEnter={() => setHover({ x: d.x, y: d.y, text: `${d.chainKey} · ${d.city}` })}
                onMouseLeave={() => setHover(null)}
              />
            ))}

          {(mode === 'target' || mode === 'both') &&
            targetDots.map((d, i) => (
              <circle
                key={`t-${i}`}
                cx={d.x} cy={d.y} r={4.5}
                fill={profile.color}
                stroke="#fff"
                strokeWidth={1.2}
                onMouseEnter={() => setHover({ x: d.x, y: d.y, text: `${profile.displayName} · ${d.city}` })}
                onMouseLeave={() => setHover(null)}
              />
            ))}

          {/* City labels for biggest target footprint */}
          {cityCounts.slice(0, 6).map(([city]) => {
            const matching = targetDots.filter(d => d.city === city);
            if (matching.length === 0) return null;
            const avg = matching.reduce((acc, d) => ({ x: acc.x + d.x, y: acc.y + d.y }), { x: 0, y: 0 });
            avg.x /= matching.length; avg.y /= matching.length;
            return (
              <text key={city} x={avg.x + 7} y={avg.y + 3} fontSize={9} fill="#1A1A1A" fontWeight={600}>
                {city}
              </text>
            );
          })}

          {hover && (
            <g pointerEvents="none">
              <rect x={hover.x + 8} y={hover.y - 22} rx={5} ry={5} width={Math.max(80, hover.text.length * 5.5)} height={20} fill="#1A1A1A" />
              <text x={hover.x + 13} y={hover.y - 8} fontSize={10} fill="#fff" fontWeight={600}>{hover.text}</text>
            </g>
          )}
        </svg>

        <div style={sidePanelStyles}>
          <div style={panelHeadStyles}>{profile.displayName} top cities</div>
          {cityCounts.map(([city, n]) => {
            const maxN = cityCounts[0][1] || 1;
            const pct = (n / maxN) * 100;
            return (
              <div key={city} style={cityRowStyles}>
                <div style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>{city}</div>
                <div style={{ flex: 2, height: 6, background: '#EEF0F3', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: profile.color, borderRadius: 3 }} />
                </div>
                <div style={{ width: 30, textAlign: 'right', fontSize: 12, fontWeight: 700 }}>{n}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ToggleChip({ active, onClick, color, label }: { active: boolean; onClick: () => void; color: string; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px', borderRadius: 999,
        border: `1px solid ${active ? color : '#E5E7EB'}`,
        background: active ? color : '#fff',
        color: active ? '#fff' : '#1A1A1A',
        fontSize: 12, fontWeight: 700, cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

const ISRAEL_OUTLINE = `
  M 180 40
  L 220 40 L 240 80 L 250 130 L 260 180
  L 275 220 L 300 260 L 310 310 L 300 360
  L 280 400 L 255 440 L 230 480 L 215 520
  L 200 570 L 185 620 L 175 670 L 160 715
  L 150 740 L 140 740 L 125 700 L 115 640
  L 110 580 L 105 520 L 95 460 L 85 400
  L 75 340 L 70 280 L 75 220 L 90 170
  L 115 130 L 140 90 L 165 60 Z
`;

const wrapStyles: React.CSSProperties = { padding: 4 };
const topRowStyles: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  gap: 16, marginBottom: 14, flexWrap: 'wrap',
};
const headStyles: React.CSSProperties = { fontSize: 16, fontWeight: 800, color: '#1A1A1A', letterSpacing: -0.3 };
const subStyles: React.CSSProperties = { fontSize: 12, color: '#8E8E93', marginTop: 3 };
const toggleGroupStyles: React.CSSProperties = { display: 'flex', gap: 6 };
const mapGridStyles: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'flex-start',
};
const mapStyles: React.CSSProperties = {
  width: '100%', maxHeight: 520,
  background: 'linear-gradient(180deg, #FAFCFF 0%, #F0F4F9 100%)',
  border: '1px solid #EEF0F3', borderRadius: 10,
};
const sidePanelStyles: React.CSSProperties = {
  padding: '16px 18px', background: '#fff',
  border: '1px solid #EEF0F3', borderRadius: 10,
};
const panelHeadStyles: React.CSSProperties = {
  fontSize: 12, fontWeight: 800, color: '#1A1A1A',
  letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 12,
};
const cityRowStyles: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9,
};
