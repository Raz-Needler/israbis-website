'use client';

import { useState, useRef } from 'react';
import { profileFor } from '@/lib/admin/chainProfiles';
import type { BattleResult, CartLine } from '@/lib/admin/basketAlgorithm';
import { PRESET_BASKETS } from '@/lib/admin/basketAlgorithm';

interface Props {
  chainKey: string;
}

interface ItemCoverage {
  barcode: string;
  productName: string;
  quantity: number;
  originalBarcode?: string;
  substituted: boolean;
  chainCount: number;
  chainsWithPrice: string[];
  missingFromTarget: boolean;
}
interface Substitution {
  from: string;
  to: string;
  fromName?: string;
  toName?: string;
}
interface SimulateResponse {
  ok: boolean;
  duration_ms: number;
  source: 'explicit' | 'preset' | 'csv';
  mode: 'strict' | 'fair';
  preset?: string;
  cart: CartLine[];
  coverage: {
    barcodes_in_cart: number;
    barcodes_with_any_price: number;
    chains_observed: number;
  };
  item_coverage: ItemCoverage[];
  substitutions: Substitution[];
  min_chains_per_item: number;
  scenario: { userCount: number; conversionPct: number };
  battle: BattleResult;
}

export function BasketBattle({ chainKey }: Props) {
  const profile = profileFor(chainKey);
  const [preset, setPreset] = useState<string>('shabbat_dinner');
  const [csvText, setCsvText] = useState<string>('');
  const [userCount, setUserCount] = useState<number>(10000);
  const [conversionPct, setConversionPct] = useState<number>(15);
  const [mode, setMode] = useState<'strict' | 'fair'>('fair');
  const [minChains, setMinChains] = useState<number>(3);
  const [result, setResult] = useState<SimulateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function run(source: 'preset' | 'csv') {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body: Record<string, unknown> = {
        targetChain: chainKey,
        scenario: { userCount, conversionPct },
        mode,                          // 'strict' | 'fair'
        minChainsPerItem: minChains,   // fair-trade threshold
      };
      // CSV uploads override the mode back to 'strict' — respect the user's
      // own barcodes, don't substitute.
      if (source === 'preset') body.presetKey = preset;
      else { body.csv = csvText; body.mode = 'strict'; }

      const res = await fetch('/api/admin/intelligence/basket-simulate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || json.detail || `Request failed (${res.status})`);
      } else {
        setResult(json as SimulateResponse);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'request_failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCsvText(text);
  }

  return (
    <div>
      <div style={controlsStyles}>
        <div style={{ flex: 1 }}>
          <div style={labelStyles}>Preset basket</div>
          <div style={presetRowStyles}>
            {Object.entries(PRESET_BASKETS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setPreset(key)}
                style={{
                  ...presetChipStyles,
                  background: preset === key ? profile.color : '#FFFFFF',
                  color: preset === key ? '#FFFFFF' : '#1A1A1A',
                  borderColor: preset === key ? profile.color : '#E5E7EB',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#8E8E93', marginTop: 4 }}>
            {PRESET_BASKETS[preset]?.description}
          </div>
        </div>
      </div>

      <div style={modeRowStyles}>
        <div style={{ flex: 1 }}>
          <div style={labelStyles}>Fairness mode</div>
          <div style={modeToggleStyles}>
            <button
              type="button"
              onClick={() => setMode('fair')}
              style={{ ...modeBtnStyles, ...(mode === 'fair' ? activeModeStyles(profile.color) : {}) }}
            >
              ⚖︎ Fair Trade
              <span style={modeSubStyles}>substitute until every item has {minChains}+ chains</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('strict')}
              style={{ ...modeBtnStyles, ...(mode === 'strict' ? activeModeStyles(profile.color) : {}) }}
            >
              🔒 Strict
              <span style={modeSubStyles}>keep exact barcodes, no substitution</span>
            </button>
          </div>
        </div>
        {mode === 'fair' && (
          <div style={{ width: 130 }}>
            <div style={labelStyles}>Min chains / item</div>
            <input
              type="number" min={1} max={10} step={1}
              value={minChains}
              onChange={e => setMinChains(Math.max(1, Math.min(10, Number(e.target.value))))}
              style={inputStyles}
            />
          </div>
        )}
      </div>

      <div style={scenarioRowStyles}>
        <div style={scenarioCellStyles}>
          <div style={labelStyles}>Total users</div>
          <input
            type="number" min={100} max={10_000_000} step={1000}
            value={userCount}
            onChange={e => setUserCount(Math.max(100, Number(e.target.value)))}
            style={inputStyles}
          />
        </div>
        <div style={scenarioCellStyles}>
          <div style={labelStyles}>% buying this basket</div>
          <input
            type="number" min={0.1} max={100} step={0.5}
            value={conversionPct}
            onChange={e => setConversionPct(Math.max(0.1, Number(e.target.value)))}
            style={inputStyles}
          />
        </div>
        <div style={scenarioCellStyles}>
          <button
            onClick={() => run('preset')}
            disabled={loading}
            style={{ ...runBtnStyles, background: profile.color }}
          >
            {loading ? 'Running…' : `Simulate on ${profile.displayName}`}
          </button>
        </div>
      </div>

      <details style={csvDetailsStyles}>
        <summary style={csvSummaryStyles}>Or upload a real cart CSV (barcode,quantity[,name])</summary>
        <div style={{ paddingTop: 12 }}>
          <div style={csvControlsStyles}>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              style={{ fontSize: 12 }}
            />
            <button
              onClick={() => run('csv')}
              disabled={loading || !csvText}
              style={{ ...runBtnStyles, background: profile.color, opacity: csvText ? 1 : 0.4 }}
            >
              Simulate uploaded CSV
            </button>
          </div>
          <textarea
            placeholder={"barcode,quantity,name\n7290002020325,2,Challah\n7290000042671,1,Whole chicken"}
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
            rows={6}
            style={textareaStyles}
          />
        </div>
      </details>

      {error && <div style={errStyles}>Error: {error}</div>}

      {result && <Results result={result} chainKey={chainKey} />}
    </div>
  );
}

function Results({ result, chainKey }: { result: SimulateResponse; chainKey: string }) {
  const { battle, scenario, coverage, cart } = result;
  const profile = profileFor(chainKey);
  const winnerProfile = profileFor(battle.winner);
  const isWinner = battle.winner === chainKey;
  const maxTotal = Math.max(...battle.chainTotals.map(c => c.totalNis), 1);

  return (
    <div style={{ marginTop: 18 }}>
      <div style={headlineBoxStyles(isWinner ? '#34C759' : '#FF3B30')}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.85 }}>
          {isWinner ? 'Basket Winner' : 'Basket Losing'}
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4, letterSpacing: -0.5 }}>
          {isWinner ? (
            <>
              {profile.displayName} wins this basket at ₪{battle.winnerTotal.toFixed(2)}
            </>
          ) : (
            <>
              {winnerProfile.displayName} wins · {profile.displayName} is #{battle.targetRank}
              {battle.deltaVsWinner != null && ` (+₪${battle.deltaVsWinner.toFixed(2)})`}
            </>
          )}
        </div>
        <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 6 }}>
          {cart.length} items · {coverage.barcodes_with_any_price}/{coverage.barcodes_in_cart} barcodes found in product_prices · {coverage.chains_observed} chains compared · {result.mode === 'fair' ? `⚖︎ fair-trade (${result.min_chains_per_item}+ chains/item)` : '🔒 strict'} · {result.duration_ms}ms
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
           Per-item coverage — the "advanced view" that shows every basket
           line with its chain coverage and substitution status.
          ───────────────────────────────────────────────────────────── */}
      {result.item_coverage && result.item_coverage.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={sectionHeadStyles}>
            Item coverage · each line across all chains
          </div>
          <div style={{ fontSize: 11.5, color: '#8E8E93', marginBottom: 10 }}>
            Blue dots = chains where this exact barcode exists. Substituted rows are marked — hover for the original.
          </div>
          <div style={itemCoverageList}>
            {result.item_coverage.map((item, idx) => {
              const ok = item.chainCount >= (result.min_chains_per_item ?? 3);
              return (
                <div key={idx} style={coverageRowStyles(ok)}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.productName}
                      {item.substituted && (
                        <span style={subChipStyles} title={`original barcode: ${item.originalBarcode}`}>
                          substituted
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 10.5, color: '#B0B0B5', fontFamily: 'ui-monospace, monospace' }}>
                      {item.barcode} · qty {item.quantity}
                    </div>
                  </div>
                  <div style={{ minWidth: 140, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    {item.chainsWithPrice.slice(0, 6).map(ch => (
                      <span key={ch} style={chainDotStyles(profile.color, ch === chainKey)} title={ch}>
                        {ch.slice(0, 2)}
                      </span>
                    ))}
                    {item.chainsWithPrice.length > 6 && (
                      <span style={{ fontSize: 10, color: '#8E8E93', marginLeft: 2 }}>
                        +{item.chainsWithPrice.length - 6}
                      </span>
                    )}
                  </div>
                  <div style={{ minWidth: 100, textAlign: 'right' }}>
                    {item.missingFromTarget ? (
                      <span style={{ fontSize: 11, color: '#FF3B30', fontWeight: 700 }}>
                        missing at {profile.displayName}
                      </span>
                    ) : (
                      <span style={{ fontSize: 11.5, color: '#34C759', fontWeight: 700 }}>
                        ✓ stocked · {item.chainCount} chains
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {result.substitutions && result.substitutions.length > 0 && (
            <details style={subDetailsStyles}>
              <summary style={{ fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}>
                {result.substitutions.length} substitutions made (fair-trade mode)
              </summary>
              <div style={{ paddingTop: 8, fontSize: 11 }}>
                {result.substitutions.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, padding: '4px 0', borderTop: i > 0 ? '1px dashed #EEF0F3' : 'none' }}>
                    <span style={{ color: '#B0B0B5', fontFamily: 'ui-monospace, monospace' }}>{s.from}</span>
                    <span>→</span>
                    <span style={{ color: '#1A1A1A', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>{s.to}</span>
                    <span style={{ color: '#8E8E93', marginLeft: 'auto', maxWidth: '50%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{s.toName}</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <div style={sectionHeadStyles}>Total basket cost by chain</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {battle.chainTotals.map((t, i) => {
            const p = profileFor(t.chainKey);
            const w = (t.totalNis / maxTotal) * 100;
            const isSelf = t.chainKey === chainKey;
            const isBasketWinner = i === 0;
            return (
              <div key={t.chainKey} style={chainRowStyles(isSelf)}>
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontSize: 12.5, fontWeight: isSelf ? 800 : 600 }}>
                    {p.displayName}
                    {isBasketWinner && <span style={wonPillStyles}>WON</span>}
                    {isSelf && <span style={youPillStyles}>YOU</span>}
                  </div>
                  <div style={{ fontSize: 10, color: '#8E8E93', marginTop: 2 }}>
                    {t.itemsAvailable}/{t.itemsAvailable + t.itemsMissing} items · {t.basketCompletenessPct}% complete
                  </div>
                </div>
                <div style={{ flex: 1, height: 22, background: '#F3F5F7', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                  <div style={{
                    width: `${w}%`, height: '100%',
                    background: isBasketWinner ? '#34C759' : isSelf ? p.color : '#B0B0B5',
                    borderRadius: 4,
                  }} />
                </div>
                <div style={{ minWidth: 90, textAlign: 'right', fontWeight: 700, fontSize: 13 }}>
                  ₪{t.totalNis.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isWinner && battle.winningAdjustments.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={sectionHeadStyles}>What {profile.displayName} needs to win this basket</div>
          <div style={{ fontSize: 11.5, color: '#8E8E93', marginBottom: 10 }}>
            The 3 products contributing most to the price gap — drop these and the basket flips.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {battle.winningAdjustments.map(adj => (
              <div key={adj.barcode} style={adjRowStyles}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{adj.productName ?? adj.barcode}</div>
                  <div style={{ fontSize: 10.5, color: '#8E8E93', marginTop: 3 }}>
                    Qty {adj.quantity} · this item explains {Math.round((adj.shareOfCartDelta ?? 0) * 100)}% of the gap
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10.5, color: '#8E8E93' }}>Current</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>
                      {adj.targetPrice != null ? `₪${adj.targetPrice.toFixed(2)}` : '—'}
                    </div>
                  </div>
                  <div style={{ fontSize: 16, color: '#8E8E93' }}>→</div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10.5, color: '#8E8E93' }}>Target</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#34C759' }}>
                      {adj.winnerPrice != null ? `₪${(adj.winnerPrice - 0.01).toFixed(2)}` : '—'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 64 }}>
                    <div style={{ fontSize: 10.5, color: '#8E8E93' }}>Drop</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#FF3B30' }}>
                      -₪{adj.dropAmountPerUnit != null ? adj.dropAmountPerUnit.toFixed(2) : '—'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={revenueBoxStyles}>
        <div style={sectionHeadStyles}>Revenue at stake</div>
        <div style={{ fontSize: 12, color: '#8E8E93', marginBottom: 10 }}>
          With {scenario.userCount.toLocaleString()} users × {scenario.conversionPct}% buying this basket = <strong>{battle.revenue.projectedBuyers.toLocaleString()} buyers</strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <RevCell label="Market size" value={battle.revenue.marketSizeNis} />
          <RevCell label={`${profile.displayName} captures today`} value={battle.revenue.targetCurrentShareNis} accent="#8E8E93" />
          <RevCell label="Capturable if winning" value={battle.revenue.targetMaxShareNis} accent="#34C759" />
        </div>
        <div style={atStakeStyles}>
          Revenue at stake for {profile.displayName}:
          <strong style={{ color: '#FF3B30', marginLeft: 8, fontSize: 22 }}>
            +₪{battle.revenue.revenueAtStake.toLocaleString('en-IL', { maximumFractionDigits: 0 })}
          </strong>
        </div>
      </div>
    </div>
  );
}

function RevCell({ label, value, accent = '#1A1A1A' }: { label: string; value: number; accent?: string }) {
  return (
    <div style={{ padding: '10px 14px', background: '#fff', border: '1px solid #EEF0F3', borderRadius: 8 }}>
      <div style={{ fontSize: 10, color: '#8E8E93', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: accent, marginTop: 4 }}>
        ₪{value.toLocaleString('en-IL', { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
}

const controlsStyles: React.CSSProperties = { display: 'flex', gap: 16, marginBottom: 14 };
const presetRowStyles: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 6 };
const presetChipStyles: React.CSSProperties = {
  padding: '8px 14px', borderRadius: 999, border: '1px solid #E5E7EB',
  fontSize: 12, fontWeight: 600, cursor: 'pointer',
};
const labelStyles: React.CSSProperties = {
  fontSize: 10.5, color: '#8E8E93', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6,
};
const scenarioRowStyles: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr 1.3fr', gap: 12, marginBottom: 14, alignItems: 'end',
};
const modeRowStyles: React.CSSProperties = {
  display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-end',
};
const modeToggleStyles: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
};
const modeBtnStyles: React.CSSProperties = {
  padding: '9px 12px',
  background: '#FFFFFF',
  border: '1.5px solid #E5E7EB',
  borderRadius: 10,
  fontSize: 12.5,
  fontWeight: 700,
  color: '#1A1A1A',
  cursor: 'pointer',
  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3,
  transition: 'all 140ms',
};
const activeModeStyles = (color: string): React.CSSProperties => ({
  borderColor: color,
  background: `${color}10`,
  boxShadow: `0 4px 14px ${color}22`,
});
const modeSubStyles: React.CSSProperties = {
  fontSize: 10, color: '#8E8E93', fontWeight: 500, textTransform: 'none',
};
const itemCoverageList: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 4,
};
const coverageRowStyles = (ok: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 12px',
  background: ok ? '#fff' : '#FFFAF0',
  border: `1px solid ${ok ? '#EEF0F3' : '#F6E1A5'}`,
  borderRadius: 8,
});
const subChipStyles: React.CSSProperties = {
  marginLeft: 6, padding: '1px 6px',
  background: '#FFFAF0', color: '#8B4F00', border: '1px solid #F6E1A5',
  borderRadius: 999, fontSize: 9, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase',
};
const chainDotStyles = (selfColor: string, isSelf: boolean): React.CSSProperties => ({
  width: 20, height: 20, borderRadius: '50%',
  background: isSelf ? selfColor : '#9BA2AA',
  color: '#fff', fontSize: 8.5, fontWeight: 800,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
});
const subDetailsStyles: React.CSSProperties = {
  marginTop: 10, padding: '8px 14px',
  background: '#FAFBFC', border: '1px solid #EEF0F3', borderRadius: 8,
};
const scenarioCellStyles: React.CSSProperties = {};
const inputStyles: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: 13,
  border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff',
};
const runBtnStyles: React.CSSProperties = {
  width: '100%', padding: '10px 16px',
  color: '#fff', fontWeight: 700, fontSize: 13,
  border: 'none', borderRadius: 8, cursor: 'pointer',
};
const csvDetailsStyles: React.CSSProperties = {
  background: '#FAFBFC', border: '1px solid #EEF0F3',
  borderRadius: 10, padding: '10px 14px', marginBottom: 14,
};
const csvSummaryStyles: React.CSSProperties = {
  cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: '#1A1A1A',
};
const csvControlsStyles: React.CSSProperties = {
  display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8,
};
const textareaStyles: React.CSSProperties = {
  width: '100%', padding: 10, fontSize: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff',
};
const errStyles: React.CSSProperties = {
  padding: '10px 14px', background: '#FFF1EF', color: '#B42318',
  border: '1px solid #FFCDC6', borderRadius: 8, fontSize: 12, marginBottom: 12,
};
const headlineBoxStyles = (color: string): React.CSSProperties => ({
  padding: '14px 18px', borderRadius: 12, color: '#fff',
  background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
});
const sectionHeadStyles: React.CSSProperties = {
  fontSize: 13, fontWeight: 800, color: '#1A1A1A', marginBottom: 8,
};
const chainRowStyles = (isSelf: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 12px',
  background: isSelf ? '#FFFCEB' : '#FFFFFF',
  border: isSelf ? '1px solid #F6E1A5' : '1px solid #EEF0F3',
  borderRadius: 8,
});
const wonPillStyles: React.CSSProperties = {
  marginLeft: 6, padding: '1px 6px',
  background: '#34C759', color: '#fff',
  borderRadius: 999, fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
};
const youPillStyles: React.CSSProperties = {
  marginLeft: 6, padding: '1px 6px',
  background: '#1A1A1A', color: '#fff',
  borderRadius: 999, fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
};
const adjRowStyles: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 12,
  padding: '10px 14px', background: '#fff',
  border: '1px solid #EEF0F3', borderRadius: 10,
};
const revenueBoxStyles: React.CSSProperties = {
  marginTop: 16, padding: '14px 18px',
  background: '#F0F9F1', border: '1px solid #C8E6CC', borderRadius: 12,
};
const atStakeStyles: React.CSSProperties = {
  marginTop: 14, padding: '12px 16px',
  background: '#fff', borderRadius: 8, border: '1px dashed #248A3D',
  fontSize: 13.5, fontWeight: 700, color: '#1A1A1A',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
};
