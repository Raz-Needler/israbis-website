import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifySession, sessionCookieName, hasRole, type AdminRole } from '@/lib/admin/auth';
import type { ReactNode } from 'react';
import './admin.css';

export const dynamic = 'force-dynamic';

interface NavItem { href: string; label: string; group: string; minRole?: AdminRole; icon?: string }

const NAV: NavItem[] = [
  { href: '/admin',                  label: 'Overview',        group: 'Core',      icon: '◎' },
  { href: '/admin/users',            label: 'Users',           group: 'Core',      icon: '👤' },
  { href: '/admin/events',           label: 'Events',          group: 'Core',      icon: '≡' },
  { href: '/admin/funnels',          label: 'Funnels',         group: 'Analytics', icon: '▼' },
  { href: '/admin/retention',        label: 'Retention',       group: 'Analytics', icon: '◆' },
  { href: '/admin/intent-baskets',   label: 'Intent Baskets',  group: 'Analytics', icon: '★' },
  { href: '/admin/intelligence',     label: 'Intelligence',    group: 'Product',   icon: '◉' },
  { href: '/admin/chains',           label: 'Chains',          group: 'Product',   icon: '⛓' },
  { href: '/admin/recipes',          label: 'Recipes',         group: 'Product',   icon: '❖' },
  { href: '/admin/ai',               label: 'Miki AI',         group: 'Product',   icon: '✧' },
  { href: '/admin/scanners',         label: 'Scanners',        group: 'Product',   icon: '⎔' },
  { href: '/admin/subscriptions',    label: 'Subscriptions',   group: 'Revenue',   icon: '₪' },
  { href: '/admin/geo',              label: 'Geography',       group: 'Product',   icon: '◉' },
  { href: '/admin/sql',              label: 'SQL Console',     group: 'Ops', minRole: 'master', icon: '⌘' },
  { href: '/admin/demo',             label: 'Simulated Data',  group: 'Ops', minRole: 'master', icon: '⌁' },
  { href: '/admin/exports',          label: 'Exports',         group: 'Ops',       icon: '⇩' },
  { href: '/admin/audit-log',        label: 'Audit Log',       group: 'Ops',       icon: '◈' },
  { href: '/admin/settings',         label: 'Settings',        group: 'Ops',       icon: '⚙' },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;

  // Login page renders inside this layout; it handles its own UI.
  if (!claims) {
    return <div className="admin-root">{children}</div>;
  }

  if (claims.needs_password_change) {
    redirect('/admin/settings/rotate-password?first=1');
  }

  const groups = Array.from(new Set(NAV.map(n => n.group)));
  const visible = NAV.filter(n => !n.minRole || hasRole(claims.role, n.minRole));

  return (
    <div className="admin-root" dir="ltr" style={rootStyles}>
      <aside style={sidebarStyles}>
        <div style={brandStyles}>
          <div style={brandMarkStyles}>IB</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1A1A1A', letterSpacing: -0.2 }}>IsraBis</div>
            <div style={{ fontSize: 10.5, color: '#8E8E93', marginTop: 2, letterSpacing: 0.3 }}>Admin Portal</div>
          </div>
        </div>

        <nav style={navStyles}>
          {groups.map(group => {
            const items = visible.filter(n => n.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group} style={{ marginBottom: 14 }}>
                <div style={navGroupHeadStyles}>{group}</div>
                {items.map(item => (
                  <Link key={item.href} href={item.href} style={navItemStyles}>
                    <span style={{ opacity: 0.6, width: 16, display: 'inline-block', textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>

        <div style={sidebarFooterStyles}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1A1A1A' }}>{claims.username}</div>
            <span className="pill pill-green" style={{ fontSize: 9 }}>{claims.role}</span>
          </div>
          <form action="/api/admin/auth/logout" method="post">
            <button type="submit" className="btn btn-secondary" style={{ width: '100%', height: 32 }}>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main style={mainStyles}>{children}</main>
    </div>
  );
}

const rootStyles: React.CSSProperties = {
  display: 'flex', minHeight: '100vh',
};
const sidebarStyles: React.CSSProperties = {
  width: 232, minWidth: 232, background: '#FFFFFF',
  borderInlineEnd: '1px solid #E5E7EB',
  display: 'flex', flexDirection: 'column',
  padding: '18px 0',
  position: 'sticky', top: 0, height: '100vh',
};
const brandStyles: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 12,
  padding: '0 18px 16px 18px', borderBottom: '1px solid #EEF0F3',
};
const brandMarkStyles: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 9,
  background: 'linear-gradient(135deg, #34C759 0%, #248A3D 100%)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#FFF', fontWeight: 800, fontSize: 13, letterSpacing: 0.5,
  boxShadow: '0 6px 18px rgba(52,199,89,0.35)',
};
const navStyles: React.CSSProperties = { flex: 1, overflowY: 'auto', padding: '12px 10px' };
const navGroupHeadStyles: React.CSSProperties = {
  fontSize: 9.5, fontWeight: 800, letterSpacing: 1.3, textTransform: 'uppercase',
  color: '#8E8E93', padding: '4px 10px 6px 10px',
};
const navItemStyles: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '7px 10px',
  fontSize: 12.5, color: '#1A1A1A',
  borderRadius: 7, textDecoration: 'none', fontWeight: 500,
};
const sidebarFooterStyles: React.CSSProperties = {
  borderTop: '1px solid #EEF0F3', padding: '12px 18px',
};
const mainStyles: React.CSSProperties = {
  flex: 1, padding: '28px 36px', overflowX: 'auto', minWidth: 0,
};
