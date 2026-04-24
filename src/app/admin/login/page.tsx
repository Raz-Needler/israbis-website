'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Admin · IsraBis';
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          body.error === 'invalid_credentials' ? 'Username or password is incorrect.' :
          body.error === 'too_many_attempts'  ? 'Too many attempts. Wait 15 minutes and try again.' :
          body.error === 'locked'             ? 'Account is temporarily locked.' :
          'Login failed.'
        );
        setLoading(false);
        return;
      }
      if (body.needs_password_change) {
        router.push('/admin/settings/rotate-password?first=1');
      } else {
        router.push(next);
      }
    } catch {
      setError('Network error. Try again.');
      setLoading(false);
    }
  }

  return (
    <div style={styles.root}>
      <form onSubmit={submit} style={styles.card}>
        <div style={styles.brand}>
          <span style={styles.brandDot} />
          <span style={styles.brandName}>IsraBis Admin</span>
        </div>
        <h1 style={styles.h1}>Sign in</h1>
        <p style={styles.sub}>Admin portal · internal use only</p>

        <label style={styles.label}>Username
          <input
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
        </label>

        <label style={styles.label}>Password
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
        </label>

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p style={styles.footer}>
          © 2026 IsraBis · All rights reserved
        </p>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Heebo, sans-serif',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 14,
    padding: 28,
    boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  brand: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
  brandDot: {
    width: 10, height: 10, borderRadius: '50%',
    background: 'linear-gradient(135deg, #34C759 0%, #248A3D 100%)',
    boxShadow: '0 0 0 3px rgba(52,199,89,0.15)'
  },
  brandName: { fontSize: 13, fontWeight: 700, color: '#3C3C43', letterSpacing: 0.3 },
  h1: { margin: 0, fontSize: 26, fontWeight: 800, color: '#1A1A1A', letterSpacing: -0.5 },
  sub: { margin: '0 0 10px 0', fontSize: 13, color: '#8E8E93' },
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#3C3C43', fontWeight: 600 },
  input: {
    height: 42,
    padding: '0 12px',
    border: '1px solid #E5E7EB',
    borderRadius: 9,
    background: '#FAFAFA',
    fontSize: 14,
    color: '#1A1A1A',
    outline: 'none',
    transition: 'border-color 120ms',
  },
  error: {
    fontSize: 12.5,
    color: '#B42318',
    background: 'rgba(255,59,48,0.08)',
    border: '1px solid rgba(255,59,48,0.18)',
    borderRadius: 8,
    padding: '8px 10px',
  },
  button: {
    marginTop: 4,
    height: 44,
    border: 'none',
    borderRadius: 10,
    background: 'linear-gradient(135deg, #34C759 0%, #248A3D 100%)',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: 0.3,
    boxShadow: '0 6px 18px rgba(52,199,89,0.30)',
  },
  footer: {
    margin: '14px 0 0 0',
    textAlign: 'center',
    fontSize: 10.5,
    color: '#8E8E93',
    letterSpacing: 0.2,
  },
};
