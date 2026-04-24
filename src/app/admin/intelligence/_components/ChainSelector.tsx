'use client';

import Link from 'next/link';
import { CHAIN_PROFILES, profileFor } from '@/lib/admin/chainProfiles';

interface Props {
  activeKey: string;
  availableChains: string[];
}

/**
 * Pill bar: every chain that has store_branches in the DB, plus whatever chains
 * have a static profile entry. Active pill is filled with the chain's accent color.
 */
export function ChainSelector({ activeKey, availableChains }: Props) {
  const unique = Array.from(new Set([...availableChains, ...Object.keys(CHAIN_PROFILES)]));
  unique.sort((a, b) => {
    const pa = profileFor(a).displayName;
    const pb = profileFor(b).displayName;
    return pa.localeCompare(pb);
  });
  return (
    <div style={barStyles}>
      {unique.map(key => {
        const profile = profileFor(key);
        const isActive = key === activeKey;
        return (
          <Link
            key={key}
            href={`/admin/intelligence/${encodeURIComponent(key)}`}
            style={{
              ...pillStyles,
              background: isActive ? profile.color : '#FFFFFF',
              color: isActive ? '#FFFFFF' : '#1A1A1A',
              borderColor: isActive ? profile.color : '#E5E7EB',
              boxShadow: isActive ? `0 6px 16px ${hexWithAlpha(profile.color, 0.35)}` : 'none',
            }}
          >
            <span style={{ ...dotStyles, background: isActive ? '#FFFFFF' : profile.color }} />
            <span>{profile.displayName}</span>
            <span style={{ fontSize: 10, opacity: isActive ? 0.9 : 0.45 }}>{profile.displayNameHe}</span>
          </Link>
        );
      })}
    </div>
  );
}

function hexWithAlpha(hex: string, a: number): string {
  const h = hex.replace('#', '');
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const barStyles: React.CSSProperties = {
  display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
  padding: 4,
};
const pillStyles: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '7px 12px', fontSize: 12.5, fontWeight: 600,
  borderRadius: 999, border: '1px solid #E5E7EB',
  textDecoration: 'none', transition: 'all 140ms ease',
};
const dotStyles: React.CSSProperties = {
  width: 8, height: 8, borderRadius: '50%',
};
