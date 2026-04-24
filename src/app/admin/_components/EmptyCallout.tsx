import Link from 'next/link';

interface Props {
  headline: string;
  subline?: string;
  primaryAction?: { href: string; label: string };
}

/**
 * Consistent empty-state callout. Always offers two paths: instrument the real
 * SDK OR seed synthetic data. Used on every page that has no useful fallback
 * when analytics.events is empty.
 */
export function EmptyCallout({ headline, subline, primaryAction }: Props) {
  return (
    <div style={wrap}>
      <div style={{ flex: 1 }}>
        <div style={head}>{headline}</div>
        {subline && <div style={sub}>{subline}</div>}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Link href={primaryAction?.href ?? '/admin/demo'} style={primaryBtn}>
          {primaryAction?.label ?? 'Seed simulated data'}
        </Link>
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 20,
  padding: '16px 20px', marginBottom: 16,
  background: 'linear-gradient(135deg, #FFFAF0 0%, #F0F9F1 100%)',
  border: '1px solid #F6E1A5',
  borderRadius: 12,
};
const head: React.CSSProperties = { fontSize: 14, fontWeight: 800, color: '#1A1A1A', letterSpacing: -0.2 };
const sub: React.CSSProperties  = { fontSize: 12.5, color: '#3C3C43', marginTop: 3, lineHeight: 1.5 };
const primaryBtn: React.CSSProperties = {
  padding: '9px 16px',
  background: 'linear-gradient(135deg, #34C759 0%, #248A3D 100%)',
  color: '#fff', fontWeight: 700, fontSize: 12.5,
  textDecoration: 'none', borderRadius: 8,
};
