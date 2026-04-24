import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySession, sessionCookieName, hasRole } from '@/lib/admin/auth';
import { admin } from '@/lib/admin/supabase';
import '../../admin.css';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims || !hasRole(claims.role, 'master')) redirect('/admin');

  const listRes = await admin()
    .from('admin_users')
    .select('id, username, email, role, is_active, last_login_at, mfa_enabled, password_changed_at, created_at')
    .order('created_at', { ascending: true });
  type R = { id: string; username: string; email: string | null; role: string; is_active: boolean; last_login_at: string | null; mfa_enabled: boolean; password_changed_at: string | null; created_at: string };
  const users: R[] = (listRes.data as R[] | null) ?? [];

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Admin users <span className="pill pill-neutral" style={{ fontSize: 9 }}>master only</span></h1>
          <p className="admin-sub">{users.length} account{users.length === 1 ? '' : 's'} · manage roles and access</p>
        </div>
      </header>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>MFA</th>
              <th>Active</th>
              <th>Last login</th>
              <th>Password rotated</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 700 }}>{u.username}</td>
                <td className="muted">{u.email ?? '—'}</td>
                <td><span className={`pill ${u.role === 'master' ? 'pill-gold' : 'pill-green'}`}>{u.role}</span></td>
                <td>{u.mfa_enabled ? <span className="pill pill-green">on</span> : <span className="pill pill-rose">off</span>}</td>
                <td>{u.is_active ? <span className="pill pill-green">active</span> : <span className="pill pill-neutral">disabled</span>}</td>
                <td className="muted">{u.last_login_at ? new Date(u.last_login_at).toLocaleString('en-IL') : '—'}</td>
                <td className="muted">{u.password_changed_at ? new Date(u.password_changed_at).toLocaleDateString('en-IL') : <span className="pill pill-rose">bootstrap</span>}</td>
                <td className="muted">{new Date(u.created_at).toLocaleDateString('en-IL')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card" style={{ marginTop: 14 }}>
        <div className="admin-card-head"><div className="admin-card-title">Add an admin</div></div>
        <p className="admin-sub">
          New admin accounts are created via SQL for now. Run in Supabase SQL editor:
        </p>
        <pre style={{ background: '#F5F5F5', padding: 14, borderRadius: 8, fontSize: 11.5, overflowX: 'auto', margin: '10px 0 0 0' }}>{`-- Generate an argon2 hash first:
-- node -e "require('@node-rs/argon2').hash('NEW_PASSWORD').then(console.log)"

INSERT INTO admin.admin_users (username, password_hash, email, role, is_active, password_changed_at)
VALUES (
  'newuser',
  '<paste hash>',
  'person@israbis.com',
  'analyst',    -- or master | support | readonly
  true,
  NULL          -- NULL forces password rotation on first login
);`}</pre>
      </div>
    </div>
  );
}
