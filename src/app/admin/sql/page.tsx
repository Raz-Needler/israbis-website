'use client';

import { useEffect, useRef, useState } from 'react';

interface QueryResult {
  ok: boolean;
  duration_ms?: number;
  row_count?: number;
  results?: Record<string, unknown>[];
  error?: string;
}

export default function SqlConsolePage() {
  const [sql, setSql] = useState('SELECT event_name, COUNT(*) AS n\nFROM analytics.events\nWHERE day >= current_date - 7\nGROUP BY event_name\nORDER BY n DESC\nLIMIT 50;');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { taRef.current?.focus(); }, []);

  async function run() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/query', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sql })
      });
      const body = await res.json();
      setResult(body);
    } catch (e) {
      setResult({ ok: false, error: e instanceof Error ? e.message : 'network_error' });
    } finally {
      setLoading(false);
    }
  }

  async function exportCsv() {
    if (!result?.results || result.results.length === 0) return;
    const rows = result.results;
    const cols = Object.keys(rows[0]);
    const csv = [cols.join(',')].concat(rows.map(r =>
      cols.map(c => {
        const v = r[c];
        const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
        return `"${s.replace(/"/g, '""')}"`;
      }).join(',')
    )).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isbs-query-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const cols = result?.results && result.results.length > 0 ? Object.keys(result.results[0]) : [];

  return (
    <div>
      <header style={s.head}>
        <div>
          <h1 style={s.h1}>SQL Console <span style={s.pill}>master only</span></h1>
          <p style={s.sub}>Read-only SELECT. Blocks any mutation keyword. Every query is audit-logged.</p>
        </div>
      </header>

      <div style={s.editorCard}>
        <textarea
          ref={taRef}
          value={sql}
          onChange={e => setSql(e.target.value)}
          spellCheck={false}
          onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') run(); }}
          style={s.textarea}
          rows={10}
        />
        <div style={s.editorBar}>
          <div style={{ fontSize: 11, color: '#8E8E93' }}>
            Press <kbd style={s.kbd}>Cmd/Ctrl + Enter</kbd> to run · auto-LIMIT 5000 applied if missing
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={exportCsv} disabled={!result?.results?.length} style={s.secondaryBtn}>Export CSV</button>
            <button onClick={run} disabled={loading} style={s.primaryBtn}>
              {loading ? 'Running…' : 'Run query'}
            </button>
          </div>
        </div>
      </div>

      {result && !result.ok && (
        <div style={s.error}>
          <strong>Query failed.</strong> {result.error}
        </div>
      )}

      {result?.ok && (
        <div style={s.resultCard}>
          <div style={s.resultHead}>
            <span>{result.row_count} row{result.row_count === 1 ? '' : 's'}</span>
            <span style={{ color: '#8E8E93' }}>· {result.duration_ms}ms</span>
          </div>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>{cols.map(c => <th key={c} style={s.th}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {result.results!.slice(0, 500).map((r, i) => (
                  <tr key={i} style={s.tr}>
                    {cols.map(c => (
                      <td key={c} style={s.td}>
                        {renderCell(r[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {result.results!.length > 500 && (
              <div style={{ padding: 12, fontSize: 12, color: '#8E8E93', textAlign: 'center' }}>
                Showing first 500 rows — export CSV for the full {result.row_count} rows.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function renderCell(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

const s: Record<string, React.CSSProperties> = {
  head: { marginBottom: 16 },
  h1: { margin: 0, fontSize: 24, fontWeight: 800, color: '#1A1A1A', letterSpacing: -0.4, display: 'flex', alignItems: 'center', gap: 12 },
  pill: { fontSize: 10, fontWeight: 800, color: '#FFF', background: '#1A1A1A', borderRadius: 5, padding: '3px 8px', letterSpacing: 0.8, textTransform: 'uppercase' },
  sub: { margin: '6px 0 0 0', fontSize: 12.5, color: '#8E8E93' },
  editorCard: { background: '#FFF', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', marginBottom: 14 },
  textarea: {
    width: '100%', padding: 14, border: 'none', outline: 'none',
    fontFamily: 'ui-monospace, Menlo, Monaco, "Courier New", monospace',
    fontSize: 13, lineHeight: 1.6, color: '#1A1A1A', background: '#FAFAFA', resize: 'vertical'
  },
  editorBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderTop: '1px solid #EEF0F3' },
  kbd: { fontFamily: 'ui-monospace, monospace', background: '#F5F5F5', border: '1px solid #E5E7EB', borderRadius: 4, padding: '1px 6px', fontSize: 10 },
  primaryBtn: { height: 34, padding: '0 18px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg, #34C759 0%, #248A3D 100%)', color: '#FFF', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' },
  secondaryBtn: { height: 34, padding: '0 12px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#FFF', color: '#3C3C43', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' },
  resultCard: { background: '#FFF', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' },
  resultHead: { padding: '10px 14px', fontSize: 12, fontWeight: 600, color: '#1A1A1A', borderBottom: '1px solid #EEF0F3', display: 'flex', gap: 8 },
  tableWrap: { maxHeight: 640, overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontFamily: 'ui-monospace, monospace' },
  th: { textAlign: 'left', fontSize: 10.5, fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', padding: '8px 12px', borderBottom: '1px solid #EEF0F3', background: '#FAFAFA', position: 'sticky', top: 0 },
  tr: { borderBottom: '1px solid #F5F5F5' },
  td: { padding: '6px 12px', fontSize: 11.5, color: '#1A1A1A', whiteSpace: 'nowrap', maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis' },
  error: { background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.20)', color: '#B42318', padding: 14, borderRadius: 10, fontSize: 13 },
};
