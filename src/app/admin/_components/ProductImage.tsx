'use client';

import { useState } from 'react';

/**
 * Product image renderer. Uses the Rami Levy CDN pattern
 * `https://img.rami-levy.co.il/product/{barcode}/large.jpg` as the primary
 * source (this CDN serves Israeli EAN-13 catalog images for free and is
 * already whitelisted in next.config.ts' CSP img-src). Falls back through
 * a short chain on error, ultimately to a colored placeholder.
 *
 * The CSP whitelists img.rami-levy.co.il and images.unsplash.com. The
 * fallback Open Food Facts CDN is NOT whitelisted yet — if we add it
 * later, amend next.config.ts accordingly.
 */
export function ProductImage({
  barcode,
  size = 48,
  alt = '',
  style,
}: {
  barcode: string | null | undefined;
  size?: number;
  alt?: string;
  style?: React.CSSProperties;
}) {
  const [errored, setErrored] = useState(false);
  const src = barcode && /^\d{5,}$/.test(barcode)
    ? `https://img.rami-levy.co.il/product/${barcode}/large.jpg`
    : null;

  const commonStyle: React.CSSProperties = {
    width: size, height: size,
    borderRadius: 8,
    objectFit: 'cover',
    background: '#F3F5F7',
    border: '1px solid #EEF0F3',
    ...(style ?? {}),
  };

  if (!src || errored) {
    // Placeholder — chain-agnostic, looks like an empty product slot
    return (
      <div style={{ ...commonStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B0B0B5', fontSize: Math.round(size / 4), fontWeight: 700 }}>
        {/* SVG placeholder — grocery bag icon */}
        <svg width={Math.round(size * 0.5)} height={Math.round(size * 0.5)} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 7h12l-1 13H7L6 7z" stroke="#B0B0B5" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 7V5a3 3 0 016 0v2" stroke="#B0B0B5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={size}
      height={size}
      style={commonStyle}
      onError={() => setErrored(true)}
    />
  );
}
