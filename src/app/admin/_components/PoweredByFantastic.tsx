/**
 * Attribution component for sections of the admin that surface the
 * Fantastic Athletes Corporation–licensed intelligence layer.
 *
 * Used in three sizes:
 *
 *   pill   — inline tag for section headers (e.g. inside DefectionAnalysis)
 *            "🟠 Powered by Fantastic Athletes"   approx 28px tall
 *
 *   strip  — full-width banner shown at the top of pages where the entire
 *            page is intelligence-layer (Intelligence, Intent Baskets)
 *
 *   footer — generous block shown at the bottom of those same pages with
 *            the patent numbers + the licence-status note. This is the one
 *            an FA stakeholder would point at as "yes, the attribution is
 *            on the page" if anyone ever asked.
 *
 * Only sections that actually depend on the FA progressivistic-metadata
 * pattern (pre-event intent → post-event outcome → delta analysis) carry
 * this attribution. Pages that are pure price comparison or operational
 * KPIs do NOT carry it — see the partnership brief, page 4 ("ownership
 * split"), for the boundary.
 */

interface Props {
  variant: 'pill' | 'strip' | 'footer';
  /** Optional override for placement scenarios where we want a
   *  one-line note instead of the multi-line footer. */
  compact?: boolean;
}

const FA_LOGO = '/fantastic-athletes-logo.png';
const ORANGE = '#F08020';
const ORANGE_DEEP = '#C0531C';
const ORANGE_BG = 'rgba(240, 128, 32, 0.08)';
const ORANGE_BORDER = 'rgba(240, 128, 32, 0.25)';

export function PoweredByFantastic({ variant, compact = false }: Props) {
  if (variant === 'pill') {
    return (
      <span style={pillStyles} title="This section uses the FA-licensed intelligence-layer architecture">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FA_LOGO} alt="" width={16} height={16} style={pillLogoStyles} />
        <span style={{ fontWeight: 800, color: ORANGE_DEEP }}>Powered by</span>
        <span style={{ fontWeight: 700, color: '#1A1A1A' }}>Fantastic Athletes</span>
      </span>
    );
  }

  if (variant === 'strip') {
    return (
      <div style={stripStyles}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FA_LOGO} alt="Fantastic Athletes Corporation" width={28} height={28} style={stripLogoStyles} />
        <div style={{ flex: 1, lineHeight: 1.45 }}>
          <div style={{ fontSize: 12, color: '#1A1A1A' }}>
            <strong style={{ color: ORANGE_DEEP, fontWeight: 800 }}>Powered by Fantastic Athletes Corporation</strong>
            <span style={{ color: '#3C3C43' }}> — intelligence-layer architecture licensed under field-of-use agreement.</span>
          </div>
          <div style={{ fontSize: 10.5, color: '#8E8E93', marginTop: 2 }}>
            Patent family · US 11,429,666 · US 12,038,971 · pending US 2024/0370492
          </div>
        </div>
      </div>
    );
  }

  // footer
  return (
    <div style={footerStyles}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: compact ? 0 : 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FA_LOGO} alt="Fantastic Athletes Corporation" width={44} height={44} style={footerLogoStyles} />
        <div>
          <div style={{ fontSize: 10, color: '#8E8E93', fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            Intelligence layer
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1A1A', letterSpacing: -0.3, marginTop: 2 }}>
            Powered by <span style={{ color: ORANGE_DEEP }}>Fantastic Athletes Corporation</span>
          </div>
        </div>
      </div>
      {!compact && (
        <p style={{ margin: 0, fontSize: 11.5, color: '#3C3C43', lineHeight: 1.55, maxWidth: 720 }}>
          The intelligence-layer architecture used on this page — capturing pre-purchase intent,
          linking it to post-purchase outcomes, and analysing the delta — is the patented
          contribution of <strong style={{ color: '#1A1A1A' }}>Fantastic Athletes Corporation</strong>
          (Tallahassee, FL). IsraBis operates this layer under a field-of-use licence covering
          consumer retail / grocery, globally.
          <br />
          <span style={{ color: '#8E8E93', fontSize: 10.5 }}>
            Patent family · US&nbsp;11,429,666 (granted) · US&nbsp;12,038,971 (granted) · US&nbsp;2024/0370492&nbsp;A1 (pending)
          </span>
        </p>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────────────

const pillStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px 4px 6px',
  borderRadius: 999,
  background: ORANGE_BG,
  border: `1px solid ${ORANGE_BORDER}`,
  fontSize: 11,
  letterSpacing: 0.2,
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
};

const pillLogoStyles: React.CSSProperties = {
  borderRadius: 4,
  flexShrink: 0,
  objectFit: 'contain',
};

const stripStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 16px',
  borderRadius: 10,
  background: 'linear-gradient(90deg, rgba(240,128,32,0.06) 0%, rgba(255,255,255,0.4) 100%)',
  border: `1px solid ${ORANGE_BORDER}`,
  borderLeft: `3px solid ${ORANGE}`,
  marginBottom: 16,
};

const stripLogoStyles: React.CSSProperties = {
  borderRadius: 6,
  flexShrink: 0,
  objectFit: 'contain',
  background: '#fff',
};

const footerStyles: React.CSSProperties = {
  marginTop: 24,
  padding: '20px 24px',
  borderRadius: 12,
  background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(240,128,32,0.05) 100%)',
  border: '1px solid #EEF0F3',
  borderLeft: `3px solid ${ORANGE}`,
};

const footerLogoStyles: React.CSSProperties = {
  borderRadius: 8,
  flexShrink: 0,
  objectFit: 'contain',
  background: '#fff',
  padding: 4,
  border: '1px solid #EEF0F3',
};
