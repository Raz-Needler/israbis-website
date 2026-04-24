import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifySession, sessionCookieName } from '@/lib/admin/auth';
import { admin } from '@/lib/admin/supabase';
import '../admin.css';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) return null;

  const meRes = await admin().from('admin_users').select('username, email, role, password_changed_at, last_login_at, mfa_enabled, created_at').eq('id', claims.sub).maybeSingle();
  const me = meRes.data;

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Settings</h1>
          <p className="admin-sub">Your account, admin users, and portal configuration</p>
        </div>
      </header>

      <div className="chart-grid cols-1-1">
        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Your account</div></div>
          {me && (
            <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.9 }}>
              <Row k="Username" v={me.username} />
              <Row k="Email" v={me.email ?? '—'} />
              <Row k="Role" v={<span className="pill pill-green">{me.role}</span>} />
              <Row k="Password changed" v={me.password_changed_at ? new Date(me.password_changed_at).toLocaleString('en-IL') : 'never (forced rotation)'} />
              <Row k="Last login" v={me.last_login_at ? new Date(me.last_login_at).toLocaleString('en-IL') : '—'} />
              <Row k="MFA" v={me.mfa_enabled ? <span className="pill pill-green">enabled</span> : <span className="pill pill-rose">disabled</span>} />
              <Row k="Account created" v={new Date(me.created_at).toLocaleDateString('en-IL')} />
            </dl>
          )}
          <div style={{ marginTop: 14 }}>
            <Link href="/admin/settings/rotate-password" className="btn btn-secondary">Rotate password</Link>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-head"><div className="admin-card-title">Portal</div></div>
          <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.9 }}>
            <Row k="Data source" v="Supabase PostgreSQL" />
            <Row k="Analytics schema" v={<span className="mono">analytics</span>} />
            <Row k="Admin schema" v={<span className="mono">admin</span>} />
            <Row k="Ingestion endpoint" v={<code>/api/analytics/ingest</code>} />
            <Row k="Event retention" v="forever (no purge job yet)" />
            <Row k="Session TTL" v="1 hour (sliding)" />
            <Row k="Rate limits" v="500 req/min per IP on ingestion" />
          </dl>
          {claims.role === 'master' && (
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <Link href="/admin/settings/admin-users" className="btn btn-secondary">Manage admin users →</Link>
            </div>
          )}
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 14 }}>
        <div className="admin-card-head"><div className="admin-card-title">Security</div></div>
        <ul style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.8, paddingInlineStart: 18, margin: 0 }}>
          <li>Admin JWT uses a secret distinct from the mobile app&apos;s user JWT — compromise of one does not compromise the other.</li>
          <li>Sessions stored in httpOnly + Secure + SameSite=Strict cookies.</li>
          <li>Passwords hashed with argon2id (memory 64MB, iterations 3, parallelism 4).</li>
          <li>SQL console is SELECT-only via a Postgres SECURITY DEFINER function; any mutation keyword is rejected.</li>
          <li>Every admin write action is logged to <code>admin.admin_audit</code>, append-only, visible in the Audit Log page.</li>
          <li>Failed logins rate-limited per IP (10 per 15-minute window).</li>
        </ul>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '4px 0', borderBottom: '1px solid #F5F5F5' }}>
      <dt style={{ minWidth: 150, color: '#8E8E93', fontWeight: 600, fontSize: 12 }}>{k}</dt>
      <dd style={{ margin: 0, color: '#1A1A1A' }}>{v}</dd>
    </div>
  );
}
