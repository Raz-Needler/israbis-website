import { sql } from '@/lib/admin/sql';
import { FunnelChart } from '../_components/Charts';
import { StatCard } from '../_components/StatCard';
import { EmptyCallout } from '../_components/EmptyCallout';
import '../admin.css';

export const dynamic = 'force-dynamic';

interface FunnelDef { key: string; title: string; description: string; steps: Array<{ name: string; event: string }> }

const FUNNELS: FunnelDef[] = [
  {
    key: 'signup_to_purchase',
    title: 'Signup → First Purchase',
    description: 'Core activation journey',
    steps: [
      { name: 'Signed up',        event: 'auth.signup_completed' },
      { name: 'Added to cart',    event: 'cart.item_added' },
      { name: 'Compared prices',  event: 'cart.compared' },
      { name: 'Confirmed purchase', event: 'cart.purchase_confirmed' },
    ]
  },
  {
    key: 'paywall_to_paid',
    title: 'Paywall → Paid',
    description: 'Revenue conversion',
    steps: [
      { name: 'Paywall viewed',     event: 'subs.paywall_viewed' },
      { name: 'Checkout started',   event: 'subs.checkout_started' },
      { name: 'Checkout completed', event: 'subs.checkout_completed' },
    ]
  },
  {
    key: 'scan_to_cart',
    title: 'Receipt Scan → Cart Import',
    description: 'Closed-loop measurement',
    steps: [
      { name: 'Scan started',    event: 'scan.receipt.started' },
      { name: 'Scan processed',  event: 'scan.receipt.processed' },
      { name: 'Imported to cart', event: 'scan.receipt.imported_to_cart' },
    ]
  },
  {
    key: 'family_growth',
    title: 'Family Group Growth',
    description: 'Viral family formation',
    steps: [
      { name: 'Family created',        event: 'family.created' },
      { name: 'Invite sent',           event: 'family.invite_sent' },
      { name: 'Invite accepted',       event: 'family.invite_accepted' },
      { name: 'Member joined',         event: 'family.member_joined' },
    ]
  },
  {
    key: 'ai_engagement',
    title: 'Miki AI Engagement',
    description: 'Are users actually using the AI?',
    steps: [
      { name: 'AI opened',        event: 'ai.opened' },
      { name: 'Message sent',     event: 'ai.message_sent' },
      { name: 'Response received', event: 'ai.response_received' },
      { name: 'Tool invoked',     event: 'ai.tool_called' },
    ]
  },
  {
    key: 'intent_loop',
    title: 'Pre-store Intent → Purchase',
    description: 'The crown-jewel flow',
    steps: [
      { name: 'Items added',       event: 'cart.item_added' },
      { name: 'Chains compared',   event: 'cart.compared' },
      { name: 'Chain switched',    event: 'cart.chain_switched' },
      { name: 'Purchase confirmed', event: 'cart.purchase_confirmed' },
    ]
  }
];

async function countFunnel(def: FunnelDef, days: number) {
  const eventList = def.steps.map(s => `'${s.event}'`).join(',');
  const { rows } = await sql<{ event_name: string; users: number }>(`
    SELECT event_name, COUNT(DISTINCT anonymous_id)::int AS users
    FROM analytics.events
    WHERE event_name IN (${eventList})
      AND day >= current_date - ${days}
    GROUP BY event_name
  `);
  const map = new Map(rows.map(r => [r.event_name, Number(r.users)]));
  return def.steps.map(s => ({ name: s.name, value: map.get(s.event) ?? 0 }));
}

export default async function FunnelsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const sp = await searchParams;
  const days = Math.max(1, Math.min(365, parseInt(sp.days ?? '30', 10)));

  const funnels = await Promise.all(FUNNELS.map(async f => ({ def: f, steps: await countFunnel(f, days) })));
  const totalReached = funnels.reduce((s, f) => s + f.steps.reduce((s2, st) => s2 + st.value, 0), 0);

  return (
    <div>
      <header className="admin-page-head">
        <div>
          <h1 className="admin-h1">Funnels</h1>
          <p className="admin-sub">Distinct users reaching each step, last {days} days</p>
        </div>
        <form style={{ display: 'flex', gap: 8 }} action="/admin/funnels" method="get">
          <select name="days" defaultValue={String(days)} className="select">
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="180">180 days</option>
          </select>
          <button type="submit" className="btn btn-primary">Apply</button>
        </form>
      </header>

      <div className="stat-grid cols-3">
        <StatCard label="Funnels tracked"       value={FUNNELS.length} accent="blue"  source="Pre-built" />
        <StatCard label="Total steps"           value={FUNNELS.reduce((s, f) => s + f.steps.length, 0)} accent="purple" />
        <StatCard label="Window (days)"         value={days} accent="gold" />
      </div>

      {totalReached === 0 && (
        <EmptyCallout
          headline="No funnel data yet."
          subline="Every funnel here reads from analytics.events. Seed 500 synthetic users to see all six funnels populate with realistic signup → purchase, AI engagement, and scan flows."
        />
      )}

      <div className="chart-grid cols-1-1">
        {funnels.map(({ def, steps }) => (
          <div key={def.key} className="admin-card">
            <div className="admin-card-head">
              <div>
                <div className="admin-card-title">{def.title}</div>
                <div className="admin-card-sub">{def.description}</div>
              </div>
              <span className="pill pill-green">
                {steps[0].value > 0 ? `${Math.round((steps[steps.length - 1].value / steps[0].value) * 100)}% end-to-end` : '—'}
              </span>
            </div>
            <FunnelChart steps={steps} />
          </div>
        ))}
      </div>
    </div>
  );
}
