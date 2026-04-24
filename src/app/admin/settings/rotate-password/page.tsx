'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RotatePasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const isFirstLogin = params.get('first') === '1';

  const [current, setCurrent] = useState('');
  const [next1, setNext1] = useState('');
  const [next2, setNext2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next1 !== next2) { setError('New passwords do not match.'); return; }
    if (next1.length < 12) { setError('New password must be at least 12 characters.'); return; }

    setLoading(true); setError(null);
    const res = await fetch('/api/admin/auth/rotate-password', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ current_password: current, new_password: next1 })
    });
    const body = await res.json();
    if (!res.ok) {
      setError(
        body.error === 'invalid_credentials' ? 'Current password incorrect.' :
        body.error === 'password_too_short' ? `At least ${body.min ?? 12} characters.` :
        body.error === 'must_differ' ? 'New password must differ from current.' :
        'Rotation failed.'
      );
      setLoading(false);
      return;
    }
    router.push('/admin');
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <form onSubmit={submit} className="admin-card" style={{ width: 420 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
          {isFirstLogin ? 'Set a new password' : 'Rotate password'}
        </h1>
        <p className="admin-sub" style={{ marginBottom: 16 }}>
          {isFirstLogin
            ? 'You are using the initial bootstrap password. Choose a strong one — you cannot proceed until you rotate.'
            : 'Enter your current password, then choose a new one.'}
        </p>

        <label style={{ display: 'block', marginBottom: 10 }}>
          <div style={lbl}>Current password</div>
          <input className="input" type="password" value={current} onChange={e => setCurrent(e.target.value)} autoComplete="current-password" required disabled={loading} style={{ width: '100%' }} />
        </label>

        <label style={{ display: 'block', marginBottom: 10 }}>
          <div style={lbl}>New password (min 12 chars)</div>
          <input className="input" type="password" value={next1} onChange={e => setNext1(e.target.value)} autoComplete="new-password" required disabled={loading} style={{ width: '100%' }} />
        </label>

        <label style={{ display: 'block', marginBottom: 16 }}>
          <div style={lbl}>Confirm new password</div>
          <input className="input" type="password" value={next2} onChange={e => setNext2(e.target.value)} autoComplete="new-password" required disabled={loading} style={{ width: '100%' }} />
        </label>

        {error && <div className="error-box" style={{ marginBottom: 12 }}>{error}</div>}

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', height: 44 }}>
          {loading ? 'Rotating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}

const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: '#3C3C43', marginBottom: 4, letterSpacing: 0.3 };
