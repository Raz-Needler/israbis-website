import { profileFor } from '@/lib/admin/chainProfiles';
import { ChainLogo } from '../../_components/ChainLogo';
import { ProductImage } from '../../_components/ProductImage';

interface Row {
  productName: string;
  barcode: string;
  targetPrice: number | null;
  winnerPrice: number | null;
  winnerChain: string;
}

interface Props {
  targetChain: string;
  rows: Row[];          // sorted by biggest loss first
  basketTotalTarget: number;
  basketTotalWinner: number;
  winnerChainKey: string;
}

/**
 * Side-by-side receipt comparison — the pitch-deck jaw-drop moment.
 * Left column: target chain receipt. Right column: winner chain receipt.
 * Each row shows the product, both prices, and a colored delta (red = target
 * loses money on this line, green = target wins). Footer totals the receipt.
 */
export function ReceiptCompare({
  targetChain,
  rows,
  basketTotalTarget,
  basketTotalWinner,
  winnerChainKey,
}: Props) {
  const target = profileFor(targetChain);
  const winner = profileFor(winnerChainKey);
  const delta = basketTotalTarget - basketTotalWinner;
  const deltaPct = basketTotalWinner > 0 ? (delta / basketTotalWinner) * 100 : 0;

  return (
    <div style={wrap}>
      <div style={headerRow}>
        <ReceiptHeader chainKey={targetChain}     chainName={target.displayName}  hebName={target.displayNameHe}  color={target.color}  total={basketTotalTarget}  isWinner={delta <= 0} />
        <ReceiptHeader chainKey={winnerChainKey}  chainName={winner.displayName}  hebName={winner.displayNameHe}  color={winner.color}  total={basketTotalWinner}  isWinner={delta > 0}  />
      </div>

      <div style={deltaBar(delta)}>
        {delta > 0 ? (
          <>
            <strong>{target.displayName} is ₪{delta.toFixed(2)} more expensive</strong>
            {' '}· {deltaPct.toFixed(1)}% over the cheapest rival
          </>
        ) : delta < 0 ? (
          <>
            <strong>{target.displayName} wins this basket by ₪{Math.abs(delta).toFixed(2)}</strong>
          </>
        ) : (
          <strong>Tied on basket total</strong>
        )}
      </div>

      <div style={rowList}>
        {rows.length === 0 ? (
          <div style={emptyRow}>No overlapping SKUs yet — more price data needed.</div>
        ) : (
          rows.map(r => (
            <LineItem key={r.barcode} row={r} targetColor={target.color} winnerColor={winner.color} />
          ))
        )}
      </div>
    </div>
  );
}

function ReceiptHeader({ chainKey, chainName, hebName, color, total, isWinner }: {
  chainKey: string; chainName: string; hebName: string; color: string; total: number; isWinner: boolean;
}) {
  return (
    <div style={headerCell(color, isWinner)}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, color: '#8E8E93', textTransform: 'uppercase' }}>
        {isWinner ? 'Basket Winner' : 'The Challenger'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
        <ChainLogo chainKey={chainKey} size={40} />
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1A1A1A', letterSpacing: -0.4, lineHeight: 1 }}>
            {chainName}
          </div>
          <div style={{ fontSize: 13, color: '#8E8E93', fontWeight: 600, marginTop: 2 }}>{hebName}</div>
        </div>
      </div>
      <div style={{ fontSize: 38, fontWeight: 900, color: isWinner ? '#34C759' : '#FF3B30', marginTop: 12, letterSpacing: -1 }}>
        ₪{total.toFixed(2)}
      </div>
    </div>
  );
}

function LineItem({ row, targetColor, winnerColor }: {
  row: Row; targetColor: string; winnerColor: string;
}) {
  const targetMissing = row.targetPrice == null;
  const lineDelta = !targetMissing && row.winnerPrice != null ? row.targetPrice! - row.winnerPrice : null;
  const targetWins = lineDelta != null && lineDelta < 0;
  const winnerProfile = profileFor(row.winnerChain);

  return (
    <div style={itemRow}>
      <ProductImage barcode={row.barcode} size={36} alt={row.productName} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.productName}
        </div>
        <div style={{ fontSize: 10, color: '#B0B0B5', fontFamily: 'ui-monospace, monospace' }}>{row.barcode}</div>
      </div>
      <div style={priceCell(targetMissing ? '#8E8E93' : targetWins ? '#34C759' : '#FF3B30', targetColor)}>
        {targetMissing ? '—' : `₪${row.targetPrice!.toFixed(2)}`}
      </div>
      <div style={priceCell(targetWins ? '#FF3B30' : '#34C759', winnerColor)}>
        {row.winnerPrice != null ? `₪${row.winnerPrice.toFixed(2)}` : '—'}
      </div>
      <div style={{ width: 95, textAlign: 'right' }}>
        {lineDelta == null ? (
          <span style={{ fontSize: 10.5, color: '#8E8E93', fontWeight: 600 }}>{winnerProfile.displayName} wins</span>
        ) : lineDelta > 0 ? (
          <span style={{ fontSize: 13, fontWeight: 800, color: '#FF3B30' }}>+₪{lineDelta.toFixed(2)}</span>
        ) : lineDelta < 0 ? (
          <span style={{ fontSize: 13, fontWeight: 800, color: '#34C759' }}>-₪{Math.abs(lineDelta).toFixed(2)}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#8E8E93' }}>tie</span>
        )}
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = {
  background: '#fff', border: '1px solid #EEF0F3', borderRadius: 14, overflow: 'hidden',
};
const headerRow: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #EEF0F3',
};
const headerCell = (color: string, isWinner: boolean): React.CSSProperties => ({
  padding: '20px 24px',
  borderLeft: isWinner ? `4px solid ${color}` : '4px solid transparent',
  background: isWinner ? `${color}08` : '#FAFBFC',
});
const deltaBar = (delta: number): React.CSSProperties => ({
  padding: '14px 24px',
  background: delta > 0 ? 'linear-gradient(90deg, #FFF1EF 0%, #FFE5E0 100%)' : delta < 0 ? 'linear-gradient(90deg, #F0F9F1 0%, #E0F5E3 100%)' : '#FAFBFC',
  color: delta > 0 ? '#B42318' : delta < 0 ? '#248A3D' : '#1A1A1A',
  fontSize: 14, fontWeight: 600, textAlign: 'center',
  borderBottom: '1px solid #EEF0F3',
});
const rowList: React.CSSProperties = {
  padding: 0,
};
const itemRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '10px 20px', borderTop: '1px solid #F3F5F7',
};
const priceCell = (color: string, _brand: string): React.CSSProperties => ({
  width: 95, textAlign: 'right', padding: '6px 10px',
  fontSize: 13, fontWeight: 800, color,
  fontVariantNumeric: 'tabular-nums',
});
const emptyRow: React.CSSProperties = {
  padding: 32, textAlign: 'center', fontSize: 13, color: '#8E8E93',
};
