import type { ChainProfile } from '@/lib/admin/chainProfiles';

interface Props {
  profile: ChainProfile;
  narrative: string;
  stats: {
    branchCount: number;
    cityCount: number;
    rankByBranches: number;
    totalChains: number;
    skuCount: number;
    avgShelfPrice: number | null;
    avgVsLeader: number;
  };
}

/**
 * The headline story — profile-driven paragraph + 4 live KPI numbers that
 * make the narrative concrete. Server component; no interactivity.
 */
export function StoryCard({ profile, narrative, stats }: Props) {
  const deltaLabel =
    stats.avgVsLeader > 5
      ? `₪${stats.avgVsLeader.toFixed(1)} above leader`
      : stats.avgVsLeader < -5
        ? `₪${Math.abs(stats.avgVsLeader).toFixed(1)} below leader`
        : 'at market parity';

  return (
    <div style={wrapStyles(profile.color)}>
      <div style={topRowStyles}>
        <div style={badgeStyles(profile.color)}>{profile.archetype}</div>
        <div style={rankPillStyles}>#{stats.rankByBranches} of {stats.totalChains} by coverage</div>
      </div>

      <h2 style={headlineStyles}>
        {profile.displayName}
        <span style={heSubStyles}>{profile.displayNameHe}</span>
      </h2>

      <p style={positioningStyles}>{profile.positioningHeadline}</p>

      <p style={narrativeStyles}>{narrative}</p>

      <div style={statGridStyles}>
        <div style={statCellStyles}>
          <div style={statLabelStyles}>Branches</div>
          <div style={statValueStyles}>{stats.branchCount.toLocaleString()}</div>
        </div>
        <div style={statCellStyles}>
          <div style={statLabelStyles}>Cities</div>
          <div style={statValueStyles}>{stats.cityCount.toLocaleString()}</div>
        </div>
        <div style={statCellStyles}>
          <div style={statLabelStyles}>Priced SKUs</div>
          <div style={statValueStyles}>{stats.skuCount.toLocaleString()}</div>
        </div>
        <div style={statCellStyles}>
          <div style={statLabelStyles}>Avg shelf price</div>
          <div style={statValueStyles}>
            {stats.avgShelfPrice != null ? `₪${stats.avgShelfPrice.toFixed(2)}` : '—'}
          </div>
          <div style={statSubStyles}>{deltaLabel}</div>
        </div>
      </div>

      <div style={pitchBoxStyles(profile.color)}>
        <div style={pitchLabelStyles}>Competitive pitch</div>
        <div style={pitchTextStyles}>{profile.competitivePitch}</div>
      </div>

      <div style={twoColStyles}>
        <div>
          <div style={listHeadStyles}>Culture fit</div>
          <div style={chipRowStyles}>
            {profile.cultureFit.map(c => (
              <span key={c} style={chipStyles}>{c}</span>
            ))}
          </div>
        </div>
        <div>
          <div style={listHeadStyles}>Known weaknesses</div>
          <div style={chipRowStyles}>
            {profile.weaknesses.length > 0
              ? profile.weaknesses.map(w => (
                  <span key={w} style={weakChipStyles}>{w}</span>
                ))
              : <span style={{ fontSize: 12, color: '#8E8E93' }}>None observed</span>}
          </div>
        </div>
      </div>

      {profile.yochananofNote && (
        <div style={yochaNoteStyles}>
          <strong style={{ color: '#D4A853' }}>Yochananof lens:</strong> {profile.yochananofNote}
        </div>
      )}
    </div>
  );
}

const wrapStyles = (accent: string): React.CSSProperties => ({
  background: `linear-gradient(135deg, #FFFFFF 0%, ${hexAlpha(accent, 0.06)} 100%)`,
  border: '1px solid #E5E7EB',
  borderLeft: `4px solid ${accent}`,
  borderRadius: 14,
  padding: '24px 28px',
  marginBottom: 16,
});
const topRowStyles: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  marginBottom: 10, gap: 8, flexWrap: 'wrap',
};
const badgeStyles = (color: string): React.CSSProperties => ({
  display: 'inline-block', padding: '3px 10px',
  background: hexAlpha(color, 0.12), color: color,
  borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
});
const rankPillStyles: React.CSSProperties = {
  fontSize: 11, color: '#8E8E93', fontWeight: 600, letterSpacing: 0.2,
};
const headlineStyles: React.CSSProperties = {
  fontSize: 32, fontWeight: 800, color: '#1A1A1A',
  letterSpacing: -0.8, margin: 0, display: 'flex', alignItems: 'baseline', gap: 12,
};
const heSubStyles: React.CSSProperties = {
  fontSize: 18, color: '#8E8E93', fontWeight: 600,
};
const positioningStyles: React.CSSProperties = {
  fontSize: 14.5, color: '#1A1A1A', marginTop: 10, marginBottom: 6, fontWeight: 500,
};
const narrativeStyles: React.CSSProperties = {
  fontSize: 13.5, color: '#3C3C43', lineHeight: 1.6, marginTop: 8, marginBottom: 18,
};
const statGridStyles: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
  gap: 10, marginBottom: 18,
};
const statCellStyles: React.CSSProperties = {
  padding: '12px 14px', background: '#FFFFFF',
  border: '1px solid #EEF0F3', borderRadius: 10,
};
const statLabelStyles: React.CSSProperties = {
  fontSize: 10.5, color: '#8E8E93', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase',
};
const statValueStyles: React.CSSProperties = {
  fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginTop: 4, letterSpacing: -0.5,
};
const statSubStyles: React.CSSProperties = {
  fontSize: 11, color: '#8E8E93', marginTop: 3,
};
const pitchBoxStyles = (color: string): React.CSSProperties => ({
  background: hexAlpha(color, 0.08),
  border: `1px solid ${hexAlpha(color, 0.25)}`,
  borderRadius: 10, padding: '12px 16px', marginBottom: 16,
});
const pitchLabelStyles: React.CSSProperties = {
  fontSize: 10.5, color: '#8E8E93', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4,
};
const pitchTextStyles: React.CSSProperties = {
  fontSize: 13, color: '#1A1A1A', lineHeight: 1.5,
};
const twoColStyles: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14,
};
const listHeadStyles: React.CSSProperties = {
  fontSize: 10.5, color: '#8E8E93', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6,
};
const chipRowStyles: React.CSSProperties = {
  display: 'flex', flexWrap: 'wrap', gap: 6,
};
const chipStyles: React.CSSProperties = {
  display: 'inline-block', padding: '3px 9px',
  background: '#F3F5F7', color: '#1A1A1A',
  borderRadius: 999, fontSize: 11, fontWeight: 500,
};
const weakChipStyles: React.CSSProperties = {
  ...chipStyles, background: '#FFF1EF', color: '#B42318',
};
const yochaNoteStyles: React.CSSProperties = {
  padding: '10px 14px', background: '#FFFAF0', border: '1px solid #F6E1A5',
  borderRadius: 10, fontSize: 12.5, color: '#1A1A1A', lineHeight: 1.5,
};

function hexAlpha(hex: string, a: number): string {
  const h = hex.replace('#', '');
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
