'use client';

import { useState } from 'react';
import { profileFor } from '@/lib/admin/chainProfiles';
import { ChainLogo } from '../../_components/ChainLogo';
import { ProductImage } from '../../_components/ProductImage';

interface ChainPrice {
  chain: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  storeCount: number;
}
interface ProductHit {
  barcode: string;
  productName: string;
  chains: ChainPrice[];
  cheapestChain: string;
  cheapestPrice: number;
  mostExpensiveChain: string;
  mostExpensivePrice: number;
  priceSpread: number;
}
interface SearchResponse {
  ok: boolean;
  query: string;
  kind: 'name' | 'barcode';
  count: number;
  hits: ProductHit[];
}

/**
 * Cross-chain product explorer — admin types a name or barcode, gets back
 * every chain that stocks it plus each chain's min/max/avg price and store
 * count. Price spread (max − min) is the hook: the wider the spread, the
 * bigger the opportunity. Results sort by spread descending.
 *
 * Per-row, chains render as a stacked horizontal bar chart so you see
 * WHICH chain is overcharging without reading numbers.
 */
export function ProductExplorer({ targetChain }: { targetChain: string }) {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function search(e?: React.FormEvent) {
    e?.preventDefault();
    if (q.trim().length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/intelligence/product-search?q=${encodeURIComponent(q)}&limit=15`);
      const j = await r.json();
      if (!r.ok) {
        setError(j.error ?? `HTTP ${r.status}`);
        setRes(null);
      } else {
        setRes(j);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'search_failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={search} style={searchRow}>
        <input
          type="text"
          placeholder="Search by Hebrew name or barcode (e.g. חלב, עגבניה, 7290004128586)"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={searchInput}
          dir="auto"
        />
        <button type="submit" disabled={loading || q.trim().length < 2} style={searchBtn}>
          {loading ? 'Searching…' : 'Find across chains'}
        </button>
      </form>

      <div style={hintStyles}>
        Tip: spread = biggest price gap across chains. Wider spread = bigger savings opportunity for the app.
      </div>

      {error && <div style={errStyles}>Error: {error}</div>}

      {res && res.count === 0 && (
        <div style={emptyStyles}>No results for &quot;{res.query}&quot;. Try a more common word (חלב, לחם, עגבניה).</div>
      )}

      {res && res.hits.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {res.hits.map(hit => {
            const maxPrice = Math.max(...hit.chains.map(c => c.maxPrice));
            const targetEntry = hit.chains.find(c => c.chain === targetChain);
            const cheapestProfile = profileFor(hit.cheapestChain);
            return (
              <div key={hit.barcode} style={rowStyles}>
                <div style={topRowStyles}>
                  <ProductImage barcode={hit.barcode} size={48} alt={hit.productName} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {hit.productName}
                    </div>
                    <div style={{ fontSize: 10.5, color: '#B0B0B5', fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>
                      {hit.barcode} · {hit.chains.length} chains
                    </div>
                  </div>
                  <div style={spreadPill}>
                    spread ₪{hit.priceSpread.toFixed(2)}
                  </div>
                  <div style={{ ...winnerPill, background: `${cheapestProfile.color}18`, color: cheapestProfile.color }}>
                    ⚡ {cheapestProfile.displayName} ₪{hit.cheapestPrice.toFixed(2)}
                  </div>
                </div>

                <div style={chainBarsWrap}>
                  {hit.chains.map(c => {
                    const cp = profileFor(c.chain);
                    const widthPct = (c.minPrice / maxPrice) * 100;
                    const isTarget = c.chain === targetChain;
                    return (
                      <div key={c.chain} style={{ ...chainBarRow, background: isTarget ? '#FFFCEB' : 'transparent' }}>
                        <div style={{ minWidth: 140, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ChainLogo chainKey={c.chain} size={18} />
                          <span style={{ fontSize: 12, fontWeight: isTarget ? 800 : 600, color: '#1A1A1A' }}>{cp.displayName}</span>
                          {isTarget && <span style={youPill}>YOU</span>}
                        </div>
                        <div style={{ flex: 1, height: 16, background: '#F3F5F7', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                          <div style={{ width: `${widthPct}%`, height: '100%', background: cp.color, borderRadius: 3 }} />
                        </div>
                        <div style={{ minWidth: 90, textAlign: 'right', fontSize: 12.5, fontWeight: 700, color: '#1A1A1A', fontVariantNumeric: 'tabular-nums' }}>
                          ₪{c.minPrice.toFixed(2)}
                        </div>
                        <div style={{ width: 60, textAlign: 'right', fontSize: 10.5, color: '#8E8E93' }}>
                          {c.storeCount} stores
                        </div>
                      </div>
                    );
                  })}
                </div>

                {targetEntry && targetEntry.minPrice > hit.cheapestPrice && (
                  <div style={missedOpp}>
                    <strong>
                      {profileFor(targetChain).displayName} is ₪{(targetEntry.minPrice - hit.cheapestPrice).toFixed(2)} more expensive
                    </strong>
                    {' '} than {cheapestProfile.displayName} — {((targetEntry.minPrice - hit.cheapestPrice) / hit.cheapestPrice * 100).toFixed(0)}% over.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const searchRow: React.CSSProperties = {
  display: 'flex', gap: 8, marginBottom: 10,
};
const searchInput: React.CSSProperties = {
  flex: 1, padding: '11px 14px', fontSize: 14,
  border: '1px solid #E5E7EB', borderRadius: 10, background: '#fff',
};
const searchBtn: React.CSSProperties = {
  padding: '11px 18px',
  background: 'linear-gradient(135deg, #34C759 0%, #248A3D 100%)',
  color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 10, cursor: 'pointer',
};
const hintStyles: React.CSSProperties = {
  fontSize: 11, color: '#8E8E93', marginBottom: 14,
};
const errStyles: React.CSSProperties = {
  padding: '10px 14px', background: '#FFF1EF', color: '#B42318',
  border: '1px solid #FFCDC6', borderRadius: 8, fontSize: 12, marginBottom: 10,
};
const emptyStyles: React.CSSProperties = {
  padding: 32, background: '#FAFBFC', border: '1px solid #EEF0F3',
  borderRadius: 10, textAlign: 'center', fontSize: 13, color: '#8E8E93',
};
const rowStyles: React.CSSProperties = {
  padding: '14px 16px', background: '#fff',
  border: '1px solid #EEF0F3', borderRadius: 10,
};
const topRowStyles: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
};
const spreadPill: React.CSSProperties = {
  padding: '4px 10px', background: '#FFFAF0',
  border: '1px solid #F6E1A5', color: '#1A1A1A',
  borderRadius: 999, fontSize: 11, fontWeight: 700,
};
const winnerPill: React.CSSProperties = {
  padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
};
const chainBarsWrap: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 3,
};
const chainBarRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, padding: '5px 6px', borderRadius: 5,
};
const youPill: React.CSSProperties = {
  marginLeft: 4, padding: '1px 5px',
  background: '#1A1A1A', color: '#fff',
  borderRadius: 999, fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
};
const missedOpp: React.CSSProperties = {
  marginTop: 10, padding: '8px 12px',
  background: 'linear-gradient(90deg, #FFF1EF 0%, #FFE5E0 100%)',
  border: '1px solid #FFCDC6', color: '#B42318',
  borderRadius: 8, fontSize: 12,
};
