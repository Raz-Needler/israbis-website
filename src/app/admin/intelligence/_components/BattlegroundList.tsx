import { profileFor } from '@/lib/admin/chainProfiles';

interface Battleground {
  city: string;
  chains: string[];
  density: number;
}

/**
 * Ranked list of cities where the target chain faces its profile-defined
 * top competitors. density = total chains in the city (higher = hotter battle).
 */
export function BattlegroundList({
  targetChain,
  battlegrounds,
}: {
  targetChain: string;
  battlegrounds: Battleground[];
}) {
  if (battlegrounds.length === 0) {
    return (
      <div style={emptyStyles}>
        No competitor overlaps found in store_branches for this chain's profile rivals.
      </div>
    );
  }
  const max = Math.max(...battlegrounds.map(b => b.density), 1);
  return (
    <div style={listStyles}>
      {battlegrounds.map(b => {
        const intensity = b.density / max;
        const rivals = b.chains.filter(c => c !== targetChain);
        return (
          <div key={b.city} style={rowStyles}>
            <div style={{ flex: 1 }}>
              <div style={cityNameStyles}>{b.city}</div>
              <div style={rivalRowStyles}>
                {rivals.map(r => {
                  const p = profileFor(r);
                  return (
                    <span key={r} style={rivalChipStyles(p.color)}>
                      {p.displayName}
                    </span>
                  );
                })}
              </div>
            </div>
            <div style={intensityWrapStyles}>
              <div style={barTrackStyles}>
                <div style={{ ...barFillStyles, width: `${intensity * 100}%` }} />
              </div>
              <div style={densityPillStyles}>{b.density} chains</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const listStyles: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 8,
};
const rowStyles: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 14,
  padding: '12px 14px', background: '#fff',
  border: '1px solid #EEF0F3', borderRadius: 10,
};
const cityNameStyles: React.CSSProperties = {
  fontSize: 13.5, fontWeight: 700, color: '#1A1A1A',
};
const rivalRowStyles: React.CSSProperties = {
  display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 5,
};
const rivalChipStyles = (color: string): React.CSSProperties => ({
  display: 'inline-block', padding: '2px 8px',
  background: `${color}18`, color,
  borderRadius: 999, fontSize: 10.5, fontWeight: 600,
});
const intensityWrapStyles: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
  minWidth: 120,
};
const barTrackStyles: React.CSSProperties = {
  width: 110, height: 6, background: '#EEF0F3', borderRadius: 3, overflow: 'hidden',
};
const barFillStyles: React.CSSProperties = {
  height: '100%',
  background: 'linear-gradient(90deg, #FF9500 0%, #FF3B30 100%)',
  borderRadius: 3,
};
const densityPillStyles: React.CSSProperties = {
  fontSize: 10, color: '#8E8E93', fontWeight: 600,
};
const emptyStyles: React.CSSProperties = {
  padding: 24, background: '#FAFBFC', borderRadius: 10,
  textAlign: 'center', fontSize: 12.5, color: '#8E8E93',
};
