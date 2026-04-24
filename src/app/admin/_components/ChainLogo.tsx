'use client';

import { useState } from 'react';
import { profileFor } from '@/lib/admin/chainProfiles';

/**
 * Chain logo renderer. Tries to load the matching PNG from /chain-logos/.
 * On 404, swaps to a gradient badge with the chain's Hebrew initials.
 *
 * chainKey is normalized: uppercase, underscores converted to lowercase
 * filename stem (RAMI_LEVY → /chain-logos/rami_levy.png).
 *
 * Client component — `<img onError>` needs event-handler shipping.
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
  const [errored, setErrored] = useState(false);
  const normalized = (chainKey ?? '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  const profile = profileFor(chainKey);
  const src = `/chain-logos/${normalized}.png`;
  const initials = (profile.displayName || chainKey).slice(0, 2).toUpperCase();

  const wrap: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6, verticalAlign: 'middle',
    ...(style ?? {}),
  };

  return (
    <span style={wrap}>
      {errored ? (
        <span
          style={{
            width: size, height: size, borderRadius: '50%',
            background: `linear-gradient(135deg, ${profile.color} 0%, ${profile.color}C0 100%)`,
            color: '#fff', fontWeight: 800, fontSize: Math.max(9, Math.round(size / 3)),
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-label={profile.displayName}
        >
          {initials}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={profile.displayName}
          width={size}
          height={size}
          style={{
            width: size, height: size, borderRadius: Math.round(size / 4),
            objectFit: 'contain',
            background: '#fff',
            border: '1px solid #EEF0F3',
            padding: 2,
            flexShrink: 0,
          }}
          onError={() => setErrored(true)}
        />
      )}
      {showName && (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1A1A' }}>
          {profile.displayName}
        </span>
      )}
    </span>
  );
}
