import { profileFor } from '@/lib/admin/chainProfiles';

export interface DefectionRow {
  toChain: string;
  baskets_lost: number;
  avg_delta_nis: number;
  total_delta_nis: number;
  sample_city?: string | null;
}

interface Props {
  targetChain: string;
  totalBasketsTracked: number;
  chooseCheapestCount: number;  // number of baskets where users chose cheapest chain
  defectedCount: number;         // chose another chain (not target, not cheapest)
  defectedByChain: DefectionRow[];
}

/**
 * "Where the money went" — the receipts from your own telemetry.
 * Uses analytics.fact_intent_basket which tracks every basket users compared
 * across chains, and where they ultimately purchased. If a user compared
 * prices and ended up buying elsewhere, that row counts.
 */
export function DefectionAnalysis({
  targetChain,
  totalBasketsTracked,
  chooseCheapestCount,
  defectedCount,
  defectedByChain,
}: Props) {
  const target = profileFor(targetChain);
  const totalLostNis = defectedByChain.reduce((s, r) => s + r.total_delta_nis, 0);
  const defectionPct = totalBasketsTracked > 0 ? (defectedCount / totalBasketsTracked) * 100 : 0;

  if (totalBasketsTracked === 0) {
    return (
      <div style={emptyStyles}>
        No intent-basket telemetry in this window — seed simulated data to see
        where shoppers compare {target.displayName} against rivals.
      </div>
    );
  }

  return (
    <div>
      <div style={headerGrid}>
        <StatBlock label="Baskets compared" value={totalBasketsTracked.toLocaleString()} />
        <StatBlock label="Chose cheapest" value={chooseCheapestCount.toLocaleString()} accent="#34C759" sub={`${totalBasketsTracked > 0 ? Math.round((chooseCheapestCount / totalBasketsTracked) * 100) : 0}% of compares`} />
        <StatBlock label="Defected to rival" value={defectedCount.toLocaleString()} accent="#FF3B30" sub={`${defectionPct.toFixed(1)}% of compares`} />
        <StatBlock label="₪ left on table" value={`₪${Math.round(totalLostNis).toLocaleString('en-IL')}`} accent="#FF9500" sub="total savings customers chose over target" />
      </div>

      {defectedByChain.length === 0 ? (
        <div style={{ ...emptyStyles, marginTop: 16 }}>
          No defections to rival chains were recorded. {target.displayName} is either winning the basket comparison or not being compared against.
        </div>
      ) : (
        <div style={tableWrapStyles}>
          <div style={tableHeadStyles}>
            <div>Rival</div>
            <div style={{ textAlign: 'right' }}>Baskets lost</div>
            <div style={{ textAlign: 'right' }}>Avg savings/basket</div>
            <div style={{ textAlign: 'right' }}>Total ₪ gone</div>
            <div>Hot city</div>
          </div>
          {defectedByChain.slice(0, 10).map(r => {
            const rival = profileFor(r.toChain);
            return (
              <div key={r.toChain} style={tableRowStyles}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: rival.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{rival.displayName}</span>
                  <span style={{ fontSize: 11, color: '#8E8E93' }}>{rival.displayNameHe}</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 800 }}>{r.baskets_lost.toLocaleString()}</div>
                <div style={{ textAlign: 'right', fontSize: 13, color: '#FF9500', fontWeight: 700 }}>
                  ₪{r.avg_delta_nis.toFixed(2)}
                </div>
                <div style={{ textAlign: 'right', fontSize: 14, color: '#FF3B30', fontWeight: 800 }}>
                  ₪{Math.round(r.total_delta_nis).toLocaleString('en-IL')}
                </div>
                <div style={{ fontSize: 12, color: '#1A1A1A' }}>{r.sample_city ?? '—'}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatBlock({ label, value, accent = '#1A1A1A', sub }: { label: string; value: string; accent?: string; sub?: string }) {
  return (
    <div style={{ padding: '14px 16px', background: '#fff', border: '1px solid #EEF0F3', borderLeft: `3px solid ${accent}`, borderRadius: 10 }}>
      <div style={{ fontSize: 10.5, color: '#8E8E93', fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: accent, marginTop: 4, letterSpacing: -0.5 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#8E8E93', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

const headerGrid: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14,
};
const tableWrapStyles: React.CSSProperties = {
  background: '#fff', border: '1px solid #EEF0F3', borderRadius: 10, overflow: 'hidden',
};
const tableHeadStyles: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr',
  padding: '12px 16px', background: '#FAFBFC', borderBottom: '1px solid #EEF0F3',
  fontSize: 10.5, color: '#8E8E93', fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase',
  alignItems: 'center', gap: 10,
};
const tableRowStyles: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr',
  padding: '12px 16px', borderTop: '1px solid #F3F5F7',
  alignItems: 'center', gap: 10,
};
const emptyStyles: React.CSSProperties = {
  padding: 32, background: '#FAFBFC', border: '1px solid #EEF0F3',
  borderRadius: 10, textAlign: 'center', fontSize: 13, color: '#8E8E93',
};
