import { profileFor, type ChainProfile } from '@/lib/admin/chainProfiles';

interface Props {
  profile: ChainProfile;
  branchCount: number;
  rankByBranches: number;
  totalChains: number;
  avgVsLeader: number;       // ₪ per basket vs cheapest rival
  leaderChain: string | null; // the cheapest-on-average chain key
  basketsLostCount: number;  // from fact_intent_basket: chose_cheapest=false & purchased
  revenueAtStakeNis: number; // total ₪ left on the table across demo users
  winsCount: number;         // SKUs in matrix where target wins
  lossesCount: number;       // SKUs where target loses
}

/**
 * Jaw-drop hero. Three screens worth of truth stacked on one strip:
 *   1. The big ₪ delta — how much more expensive target is vs the market leader
 *   2. Annualized impact — per-household waste
 *   3. Baskets lost to rivals (proven, from fact_intent_basket)
 *
 * Colors loud, numbers enormous, copy short. Designed to screenshot for pitches.
 */
export function IntelligenceHero({
  profile,
  branchCount,
  rankByBranches,
  totalChains,
  avgVsLeader,
  leaderChain,
  basketsLostCount,
  revenueAtStakeNis,
  winsCount,
  lossesCount,
}: Props) {
  const isBehind = avgVsLeader > 5;
  const isAhead  = avgVsLeader < -5;
  const leaderProfile = leaderChain ? profileFor(leaderChain) : null;

  // Yearly per-household estimate: assume 50 baskets/year × delta per basket
  const yearlyPerHousehold = Math.max(0, Math.round(avgVsLeader * 50));

  return (
    <div style={wrap(profile.color)}>
      {/* Headline strip — the hook */}
      <div style={hookRow}>
        <div style={pillStyle(profile.color)}>{profile.archetype}</div>
        <div style={rankStyle}>#{rankByBranches} of {totalChains} by branch coverage · {branchCount} locations</div>
      </div>

      {/* Three enormous numbers */}
      <div style={statTriptych}>
        <div style={statCol}>
          <div style={statLabel}>Price gap vs cheapest rival</div>
          <div style={{ ...statValueHuge, color: isBehind ? '#FF3B30' : isAhead ? '#34C759' : '#1A1A1A' }}>
            {isBehind || isAhead ? (avgVsLeader > 0 ? '+' : '') : ''}
            ₪{Math.abs(avgVsLeader).toFixed(1)}
          </div>
          <div style={statSub}>
            {isBehind
              ? <>on a typical basket — <strong>{leaderProfile?.displayName ?? 'a rival'}</strong> is cheaper</>
              : isAhead
                ? <>{profile.displayName} leads the market</>
                : <>roughly at market parity</>}
          </div>
        </div>

        <div style={statCol}>
          <div style={statLabel}>Per household / year</div>
          <div style={{ ...statValueHuge, color: isBehind ? '#FF3B30' : '#8E8E93' }}>
            ₪{yearlyPerHousehold.toLocaleString('en-IL')}
          </div>
          <div style={statSub}>
            {isBehind
              ? <>what a family overpays shopping at {profile.displayName}</>
              : <>no meaningful overpayment</>}
          </div>
        </div>

        <div style={statCol}>
          <div style={statLabel}>Baskets lost to rivals</div>
          <div style={{ ...statValueHuge, color: basketsLostCount > 0 ? '#FF9500' : '#8E8E93' }}>
            {basketsLostCount.toLocaleString()}
          </div>
          <div style={statSub}>
            {basketsLostCount > 0
              ? <>IsraBis users chose a cheaper chain — ₪{revenueAtStakeNis.toLocaleString('en-IL', { maximumFractionDigits: 0 })} at stake</>
              : <>none observed in this window</>}
          </div>
        </div>
      </div>

      {/* SKU-level win/loss ribbon */}
      <div style={ribbonRow}>
        <div style={ribbonCell(winsCount > 0 ? '#34C759' : '#8E8E93')}>
          <div style={ribbonLabel}>SHELF WINS</div>
          <div style={ribbonValue}>{winsCount}</div>
          <div style={ribbonSub}>products cheaper here</div>
        </div>
        <div style={ribbonCell(lossesCount > 0 ? '#FF3B30' : '#8E8E93')}>
          <div style={ribbonLabel}>SHELF LOSSES</div>
          <div style={ribbonValue}>{lossesCount}</div>
          <div style={ribbonSub}>products a rival beats</div>
        </div>
        <div style={ribbonCell('#1A1A1A')}>
          <div style={ribbonLabel}>COVERAGE</div>
          <div style={ribbonValue}>#{rankByBranches}</div>
          <div style={ribbonSub}>of {totalChains} national chains</div>
        </div>
      </div>
    </div>
  );
}

const wrap = (accent: string): React.CSSProperties => ({
  padding: '28px 32px',
  borderRadius: 16,
  marginBottom: 16,
  background: `linear-gradient(135deg, #FFFFFF 0%, ${accent}0F 100%)`,
  border: '1px solid #E5E7EB',
  borderLeft: `5px solid ${accent}`,
});
const hookRow: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  marginBottom: 20, flexWrap: 'wrap', gap: 8,
};
const pillStyle = (color: string): React.CSSProperties => ({
  display: 'inline-block', padding: '4px 12px',
  background: `${color}18`, color,
  borderRadius: 999, fontSize: 11.5, fontWeight: 800, letterSpacing: 0.4,
});
const rankStyle: React.CSSProperties = {
  fontSize: 12, color: '#8E8E93', fontWeight: 600,
};
const statTriptych: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
  marginBottom: 20,
};
const statCol: React.CSSProperties = {};
const statLabel: React.CSSProperties = {
  fontSize: 11, color: '#8E8E93', fontWeight: 800,
  letterSpacing: 0.6, textTransform: 'uppercase',
  marginBottom: 6,
};
const statValueHuge: React.CSSProperties = {
  fontSize: 56, fontWeight: 900, letterSpacing: -2,
  lineHeight: 1, fontVariantNumeric: 'tabular-nums',
};
const statSub: React.CSSProperties = {
  fontSize: 13, color: '#3C3C43', marginTop: 10, lineHeight: 1.4,
};
const ribbonRow: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
  paddingTop: 18, borderTop: '1px solid #EEF0F3',
};
const ribbonCell = (color: string): React.CSSProperties => ({
  padding: '14px 16px',
  background: '#fff',
  border: `1px solid ${color}40`,
  borderLeft: `3px solid ${color}`,
  borderRadius: 10,
});
const ribbonLabel: React.CSSProperties = {
  fontSize: 10, color: '#8E8E93', fontWeight: 800,
  letterSpacing: 0.8, textTransform: 'uppercase',
};
const ribbonValue: React.CSSProperties = {
  fontSize: 28, fontWeight: 900, color: '#1A1A1A',
  letterSpacing: -0.8, marginTop: 4,
};
const ribbonSub: React.CSSProperties = {
  fontSize: 11.5, color: '#8E8E93', marginTop: 3,
};
