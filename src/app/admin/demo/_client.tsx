'use client';

import { useState } from 'react';

interface DemoStatus {
  users: number;
  baskets: number;
  purchases: number;
  events: number;
  fact_intent_baskets: number;
  cities: Array<{ city: string; users: number }>;
  nameProfiles: Record<string, number>;
}

interface SeedResult {
  ok: boolean;
  users_created: number;
  preferences_created: number;
  baskets_created: number;
  basket_items_created: number;
  purchases_created: number;
  purchase_items_created: number;
  events_accepted: number;
  fact_intent_baskets_created: number;
  duration_ms: number;
  seed: number;
  window_days: number;
  errors: string[];
}

export function DemoPanel({
  initialStatus,
  canSeed,
  role,
}: {
  initialStatus: DemoStatus;
  canSeed: boolean;
  role: string;
}) {
  const [status, setStatus] = useState<DemoStatus>(initialStatus);
  const [userCount, setUserCount] = useState(500);
  const [basketsPerUser, setBasketsPerUser] = useState(3);
  const [purchasesPerUser, setPurchasesPerUser] = useState(2);
  const [eventsPerUser, setEventsPerUser] = useState(40);
  const [daysWindow, setDaysWindow] = useState(90);
  const [loading, setLoading] = useState<'idle' | 'seeding' | 'clearing' | 'refreshing'>('idle');
  const [lastSeed, setLastSeed] = useState<SeedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runSeed() {
    if (!canSeed) return;
    setLoading('seeding');
    setError(null);
    try {
      const res = await fetch('/api/admin/demo/seed', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userCount, basketsPerUser, purchasesPerUser, eventsPerUser, daysWindow }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? `seed failed (${res.status})`);
        setLoading('idle');
        return;
      }
      setLastSeed(json as SeedResult);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'seed_failed');
    } finally {
      setLoading('idle');
    }
  }

  async function runClear() {
    if (!canSeed) return;
    if (!confirm(`This will DELETE every demo-marked row:\n\n· ${status.users.toLocaleString()} users\n· ${status.baskets.toLocaleString()} baskets\n· ${status.purchases.toLocaleString()} purchases\n· ${status.events.toLocaleString()} analytics events\n\nProduction data is NOT touched. Continue?`)) return;
    setLoading('clearing');
    setError(null);
    try {
      const res = await fetch('/api/admin/demo/clear', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ confirm: 'DELETE_ALL_DEMO' }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? `clear failed (${res.status})`);
        setLoading('idle');
        return;
      }
      setLastSeed(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'clear_failed');
    } finally {
      setLoading('idle');
    }
  }

  async function refresh() {
    setLoading('refreshing');
    try {
      const res = await fetch('/api/admin/demo/status');
      const json = await res.json();
      if (res.ok) setStatus(json);
    } finally {
      setLoading('idle');
    }
  }

  return (
    <div>
      <div className="stat-grid cols-4" style={{ marginBottom: 16 }}>
        <StatBlock label="Demo users"        value={status.users} accent="green" />
        <StatBlock label="Demo baskets"      value={status.baskets} accent="blue" />
        <StatBlock label="Demo purchases"    value={status.purchases} accent="purple" />
        <StatBlock label="Demo events"       value={status.events} accent="gold" />
      </div>

      {error && <div style={errStyles}>Error: {error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Seed synthetic population</div>
              <div className="admin-card-sub">Writes `demo.%@isrbs.test` users only. Real users untouched.</div>
            </div>
          </div>

          {!canSeed && (
            <div style={lockNoteStyles}>
              Only <strong>master</strong> admins can seed data. Your role: <strong>{role}</strong>.
            </div>
          )}

          <div style={controlsGrid}>
            <Control label="User count" value={userCount} onChange={setUserCount} min={10} max={5000} step={10} />
            <Control label="Baskets/user" value={basketsPerUser} onChange={setBasketsPerUser} min={0} max={20} step={1} />
            <Control label="Purchases/user" value={purchasesPerUser} onChange={setPurchasesPerUser} min={0} max={20} step={1} />
            <Control label="Events/user" value={eventsPerUser} onChange={setEventsPerUser} min={0} max={500} step={5} />
            <Control label="Days window" value={daysWindow} onChange={setDaysWindow} min={7} max={365} step={1} />
          </div>

          <div style={estimateStyles}>
            Rough estimate: <strong>{(userCount * basketsPerUser).toLocaleString()}</strong> baskets, <strong>{(userCount * purchasesPerUser).toLocaleString()}</strong> purchases, <strong>{(userCount * eventsPerUser).toLocaleString()}</strong> events — spread across <strong>{daysWindow}</strong> days.
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              onClick={runSeed}
              disabled={!canSeed || loading !== 'idle'}
              style={{ ...primaryBtn, opacity: canSeed ? 1 : 0.4 }}
            >
              {loading === 'seeding' ? 'Seeding… (up to 60s)' : 'Seed simulated data'}
            </button>
            <button
              onClick={refresh}
              disabled={loading !== 'idle'}
              style={secondaryBtn}
            >
              {loading === 'refreshing' ? 'Refreshing…' : 'Refresh status'}
            </button>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Wipe demo data</div>
              <div className="admin-card-sub">Deletes only rows tagged with demo markers. Irreversible.</div>
            </div>
          </div>
          <div style={warnBoxStyles}>
            <strong>Only rows with demo markers are deleted.</strong> Production users, baskets,
            purchases, and events lack these markers and are untouched.
            <ul style={{ margin: '8px 0 0 18px', fontSize: 12 }}>
              <li>Users: <code>email LIKE &apos;demo.%@isrbs.test&apos;</code></li>
              <li>Baskets: <code>name LIKE &apos;[DEMO] %&apos;</code></li>
              <li>Purchases: <code>notes = &apos;[demo]&apos;</code></li>
              <li>Events: <code>anonymous_id LIKE &apos;demo-anon-%&apos;</code> OR <code>props-&gt;&gt;&apos;is_demo&apos; = &apos;true&apos;</code></li>
            </ul>
          </div>
          <button
            onClick={runClear}
            disabled={!canSeed || loading !== 'idle' || status.users === 0}
            style={{ ...dangerBtn, marginTop: 14, opacity: canSeed && status.users > 0 ? 1 : 0.4 }}
          >
            {loading === 'clearing' ? 'Deleting…' : `Delete all demo data (${status.users.toLocaleString()} users)`}
          </button>
        </div>
      </div>

      {lastSeed && (
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <div className="admin-card-head">
            <div>
              <div className="admin-card-title">Last seed result</div>
              <div className="admin-card-sub">Seed #{lastSeed.seed} · {lastSeed.duration_ms}ms · window {lastSeed.window_days}d</div>
            </div>
            {lastSeed.ok
              ? <span className="pill pill-green">OK</span>
              : <span className="pill pill-rose">{lastSeed.errors.length} error{lastSeed.errors.length === 1 ? '' : 's'}</span>}
          </div>
          <div style={resultGrid}>
            <ResultCell label="Users"            value={lastSeed.users_created} />
            <ResultCell label="Preferences"      value={lastSeed.preferences_created} />
            <ResultCell label="Baskets"          value={lastSeed.baskets_created} />
            <ResultCell label="Basket items"     value={lastSeed.basket_items_created} />
            <ResultCell label="Purchases"        value={lastSeed.purchases_created} />
            <ResultCell label="Purchase items"   value={lastSeed.purchase_items_created} />
            <ResultCell label="Events"           value={lastSeed.events_accepted} />
            <ResultCell label="Intent baskets"   value={lastSeed.fact_intent_baskets_created} />
          </div>
          {lastSeed.errors.length > 0 && (
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: 'pointer', color: '#B42318', fontSize: 12, fontWeight: 700 }}>
                Errors ({lastSeed.errors.length})
              </summary>
              <pre style={errBlockStyles}>{lastSeed.errors.join('\n')}</pre>
            </details>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Demo users by city</div></div>
          {status.cities.length === 0 ? (
            <div className="empty-state">No demo users yet — seed some to populate this.</div>
          ) : (
            <table className="admin-table" style={{ fontSize: 12 }}>
              <thead><tr><th>City</th><th style={{ textAlign: 'right' }}>Users</th></tr></thead>
              <tbody>
                {status.cities.map(c => (
                  <tr key={c.city}>
                    <td>{c.city}</td>
                    <td style={{ textAlign: 'right' }}><strong>{c.users.toLocaleString()}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Name profile mix</div></div>
          {Object.keys(status.nameProfiles).length === 0 ? (
            <div className="empty-state">No demo users yet.</div>
          ) : (
            <table className="admin-table" style={{ fontSize: 12 }}>
              <thead><tr><th>Profile</th><th style={{ textAlign: 'right' }}>Users</th></tr></thead>
              <tbody>
                {Object.entries(status.nameProfiles)
                  .sort((a, b) => b[1] - a[1])
                  .map(([p, n]) => (
                    <tr key={p}>
                      <td style={{ textTransform: 'capitalize' }}>{p}</td>
                      <td style={{ textAlign: 'right' }}><strong>{n.toLocaleString()}</strong></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className={`stat-card accent-${accent}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value.toLocaleString()}</div>
    </div>
  );
}

function ResultCell({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ padding: '10px 12px', background: '#FAFBFC', border: '1px solid #EEF0F3', borderRadius: 8 }}>
      <div style={{ fontSize: 10.5, color: '#8E8E93', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#1A1A1A', marginTop: 3 }}>{value.toLocaleString()}</div>
    </div>
  );
}

function Control({ label, value, onChange, min, max, step }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number;
}) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: '#8E8E93', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        min={min} max={max} step={step}
        style={{ width: '100%', padding: '8px 10px', fontSize: 13, border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff' }}
      />
    </div>
  );
}

const controlsGrid: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10,
};
const estimateStyles: React.CSSProperties = {
  marginTop: 12, padding: '10px 14px', background: '#F0F9F1', border: '1px solid #C8E6CC',
  borderRadius: 8, fontSize: 12, color: '#1A1A1A', lineHeight: 1.5,
};
const primaryBtn: React.CSSProperties = {
  padding: '10px 18px', background: 'linear-gradient(135deg, #34C759 0%, #248A3D 100%)',
  color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer',
};
const secondaryBtn: React.CSSProperties = {
  padding: '10px 16px', background: '#FFFFFF', color: '#1A1A1A',
  fontWeight: 600, fontSize: 13, border: '1px solid #E5E7EB', borderRadius: 8, cursor: 'pointer',
};
const dangerBtn: React.CSSProperties = {
  padding: '10px 18px', background: 'linear-gradient(135deg, #FF3B30 0%, #B42318 100%)',
  color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer',
};
const warnBoxStyles: React.CSSProperties = {
  padding: '10px 14px', background: '#FFF8F7', border: '1px solid #FFD5D0',
  borderRadius: 8, fontSize: 12, color: '#1A1A1A', lineHeight: 1.5,
};
const lockNoteStyles: React.CSSProperties = {
  padding: '10px 14px', background: '#FFFAF0', border: '1px solid #F6E1A5',
  borderRadius: 8, fontSize: 12, color: '#1A1A1A', marginBottom: 12,
};
const errStyles: React.CSSProperties = {
  padding: '10px 14px', background: '#FFF1EF', color: '#B42318',
  border: '1px solid #FFCDC6', borderRadius: 8, fontSize: 12, marginBottom: 12,
};
const resultGrid: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
};
const errBlockStyles: React.CSSProperties = {
  padding: 12, background: '#FAFBFC', border: '1px solid #EEF0F3', borderRadius: 8,
  fontSize: 11, color: '#B42318', whiteSpace: 'pre-wrap', marginTop: 8,
};
