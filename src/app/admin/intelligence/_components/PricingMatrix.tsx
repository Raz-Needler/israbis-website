import { profileFor } from '@/lib/admin/chainProfiles';

interface MatrixRow {
  barcode: string;
  productName: string;
  prices: Record<string, number>;
  winner: string;
  winnerPrice: number;
  selfPrice: number | null;
  selfDelta: number | null;
  selfRank: number | null;
}

interface Props {
  chainKey: string;
  matrix: MatrixRow[];
  summary: {
    wins: number;
    losses: number;
    missing: number;
    biggestLosses: MatrixRow[];
  };
}

/**
 * Matrix: one row per product (top-20 widest-coverage barcodes).
 * Columns = target chain's price + winner chain's price + delta.
 * Red delta = target loses by that much; green = target wins.
 */
export function PricingMatrix({ chainKey, matrix, summary }: Props) {
  const profile = profileFor(chainKey);
  if (matrix.length === 0) {
    return (
      <div style={emptyStyles}>
        No overlapping SKUs in product_prices yet — ingest more shelf-price data to see the matrix.
      </div>
    );
  }
  return (
    <div>
      <div style={summaryRowStyles}>
        <SummaryChip label={`${profile.displayName} wins`}  value={summary.wins}    accent="#34C759" />
        <SummaryChip label="Loses to competitor"            value={summary.losses}  accent="#FF3B30" />
        <SummaryChip label="Not stocked"                    value={summary.missing} accent="#8E8E93" />
      </div>

      <div style={tableWrapStyles}>
        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={thStyles}>Product</th>
              <th style={thNumStyles}>{profile.displayName}</th>
              <th style={thNumStyles}>Winner</th>
              <th style={thNumStyles}>Δ</th>
              <th style={thStyles}>Verdict</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map(row => {
              const winnerProfile = profileFor(row.winner);
              const isWinner = row.winner === chainKey;
              return (
                <tr key={row.barcode} style={{ borderTop: '1px solid #EEF0F3' }}>
                  <td style={tdStyles}>
                    <div style={{ fontWeight: 600, fontSize: 12.5 }}>{row.productName}</div>
                    <div style={{ fontSize: 10, color: '#8E8E93', marginTop: 2 }}>{row.barcode}</div>
                  </td>
                  <td style={tdNumStyles}>
                    {row.selfPrice != null ? `₪${row.selfPrice.toFixed(2)}` : <span style={{ color: '#8E8E93' }}>—</span>}
                  </td>
                  <td style={tdNumStyles}>
                    <span style={winnerChipStyles(winnerProfile.color)}>
                      {winnerProfile.displayName}
                    </span>
                    <div style={{ fontSize: 11, marginTop: 2, fontWeight: 600 }}>₪{row.winnerPrice.toFixed(2)}</div>
                  </td>
                  <td style={tdNumStyles}>
                    {isWinner ? (
                      <span style={{ color: '#34C759', fontWeight: 700, fontSize: 12 }}>win</span>
                    ) : row.selfDelta != null ? (
                      <span style={{ color: '#FF3B30', fontWeight: 700, fontSize: 12 }}>
                        +₪{row.selfDelta.toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ color: '#8E8E93', fontSize: 11 }}>n/a</span>
                    )}
                  </td>
                  <td style={tdStyles}>
                    {isWinner ? (
                      <span style={verdictStyles('#34C759')}>Winning shelf</span>
                    ) : row.selfPrice == null ? (
                      <span style={verdictStyles('#8E8E93')}>Not stocked</span>
                    ) : row.selfDelta != null && row.selfDelta > 2 ? (
                      <span style={verdictStyles('#FF3B30')}>Losing by a wide margin</span>
                    ) : (
                      <span style={verdictStyles('#FF9500')}>Losing by a thin margin</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {summary.biggestLosses.length > 0 && (
        <div style={biggestWrapStyles}>
          <div style={biggestHeadStyles}>Biggest price gaps to close</div>
          <div style={{ fontSize: 11, color: '#8E8E93', marginBottom: 8 }}>
            Products where {profile.displayName} is furthest above the cheapest chain
          </div>
          {summary.biggestLosses.map((r) => (
            <div key={r.barcode} style={biggestRowStyles}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{r.productName}</div>
                <div style={{ fontSize: 10.5, color: '#8E8E93' }}>Drop to ₪{(r.winnerPrice - 0.01).toFixed(2)} to beat <strong>{profileFor(r.winner).displayName}</strong></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, color: '#FF3B30', fontWeight: 800 }}>+₪{(r.selfDelta ?? 0).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryChip({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div style={{
      flex: 1,
      background: '#fff', border: '1px solid #EEF0F3',
      borderLeft: `3px solid ${accent}`,
      borderRadius: 10, padding: '10px 14px',
    }}>
      <div style={{ fontSize: 10.5, color: '#8E8E93', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: accent, marginTop: 3, letterSpacing: -0.5 }}>{value}</div>
    </div>
  );
}

const summaryRowStyles: React.CSSProperties = {
  display: 'flex', gap: 10, marginBottom: 14,
};
const tableWrapStyles: React.CSSProperties = {
  background: '#fff', border: '1px solid #EEF0F3',
  borderRadius: 10, overflow: 'hidden',
};
const tableStyles: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse', fontSize: 12.5,
};
const thStyles: React.CSSProperties = {
  padding: '10px 14px', background: '#FAFBFC',
  fontSize: 10.5, letterSpacing: 0.4, textTransform: 'uppercase',
  color: '#8E8E93', fontWeight: 700, textAlign: 'left',
};
const thNumStyles: React.CSSProperties = { ...thStyles, textAlign: 'right' };
const tdStyles: React.CSSProperties = { padding: '10px 14px', verticalAlign: 'top' };
const tdNumStyles: React.CSSProperties = { ...tdStyles, textAlign: 'right' };

const winnerChipStyles = (color: string): React.CSSProperties => ({
  display: 'inline-block', padding: '2px 8px',
  background: `${color}20`, color,
  borderRadius: 999, fontSize: 10.5, fontWeight: 700,
});
const verdictStyles = (color: string): React.CSSProperties => ({
  fontSize: 11, color, fontWeight: 600,
});

const biggestWrapStyles: React.CSSProperties = {
  marginTop: 16, padding: '14px 16px',
  background: '#FFF8F7', border: '1px solid #FFD5D0', borderRadius: 10,
};
const biggestHeadStyles: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 4,
};
const biggestRowStyles: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 0', borderTop: '1px dashed #FFD5D0',
};

const emptyStyles: React.CSSProperties = {
  padding: 32, background: '#FAFBFC', borderRadius: 10,
  textAlign: 'center', fontSize: 13, color: '#8E8E93',
};
