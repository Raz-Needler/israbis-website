import { profileFor } from '@/lib/admin/chainProfiles';

/**
 * Chain logo renderer. Tries to load the matching PNG from /chain-logos/.
 * If the asset 404s (unknown chain), falls back to a round badge with the
 * chain's brand-color gradient and Hebrew initials.
 *
 * chainKey is normalized: uppercase, underscores converted to lowercase
 * filename stem (RAMI_LEVY → /chain-logos/rami_levy.png).
 */
export function ChainLogo({
  chainKey,
  size = 28,
  showName = false,
  style,
}: {
  chainKey: string;
  size?: number;
  showName?: boolean;
  style?: React.CSSProperties;
}) {
  const normalized = (chainKey ?? '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  const profile = profileFor(chainKey);
  const src = `/chain-logos/${normalized}.png`;

  const wrap: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6, verticalAlign: 'middle',
    ...(style ?? {}),
  };
  const imgStyle: React.CSSProperties = {
    width: size, height: size, borderRadius: Math.round(size / 4),
    objectFit: 'contain',
    background: '#fff',
    border: '1px solid #EEF0F3',
    padding: 2,
  };
  const fallbackStyle: React.CSSProperties = {
    width: size, height: size, borderRadius: '50%',
    background: `linear-gradient(135deg, ${profile.color} 0%, ${profile.color}C0 100%)`,
    color: '#fff', fontWeight: 800, fontSize: Math.max(10, Math.round(size / 3)),
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textTransform: 'uppercase',
  };
  const initials = (profile.displayName || chainKey).slice(0, 2);

  return (
    <span style={wrap}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={profile.displayName}
        width={size}
        height={size}
        style={imgStyle}
        onError={(e) => {
          const img = e.currentTarget;
          const span = document.createElement('span');
          Object.assign(span.style, fallbackStyle as unknown as Record<string, string>);
          span.textContent = initials;
          img.replaceWith(span);
        }}
      />
      {showName && (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1A1A' }}>
          {profile.displayName}
        </span>
      )}
    </span>
  );
}
