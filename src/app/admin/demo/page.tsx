import { cookies } from 'next/headers';
import { verifySession, sessionCookieName, hasRole } from '@/lib/admin/auth';
import { demoStatus } from '@/lib/admin/demo/seeder';
import { DemoPanel } from './_client';
import '../admin.css';

export const dynamic = 'force-dynamic';

export default async function DemoPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  const claims = token ? await verifySession(token) : null;
  if (!claims) {
    return <div className="admin-card">Sign in required.</div>;
  }
  const canSeed = hasRole(claims.role, 'master');

  const status = await demoStatus();

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Simulated Data</h1>
          <p className="admin-sub">
            Seed a synthetic user population to stress-test every admin page and
            run supermarket scenarios — without touching production data.
          </p>
        </div>
      </header>

      <DemoPanel initialStatus={status} canSeed={canSeed} role={claims.role} />
    </div>
  );
}
