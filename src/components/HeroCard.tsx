"use client";
/**
 * HeroCard — the brand's hero-visual system.
 *
 * Twelve compositions, all sharing the same DNA (Bold Geometry +
 * Editorial Grid family). Every variant reads the site's CSS
 * variables (--accent, --bg, --bg-secondary, --text, --secondary,
 * etc.), so the hero re-colors for free when the user flips between
 * the snow / midnight / autumn / dusk themes — ZERO duplication per
 * theme, and every surface on every page instantly feels "ours".
 *
 * Responsive:
 *   - The card is a CSS aspect-ratio container. Content sizes via
 *     clamp() so it scales from 360px phone up to 1440px desktop
 *     without any breakpoint switches.
 *   - On <640px the card locks to 16:9. On ≥640 it becomes 21:9 so
 *     desktop hero doesn't feel cramped.
 *
 * Variants (all produce a full hero card with headline + optional
 * eyebrow + optional CTA layered on top of the composition):
 *    1  solar-arc         — Sweeping accent arc, clipped comp disc
 *    2  editorial-split   — Asymmetric diagonal color split + callouts
 *    3  grid-core         — Precision grid, centered giant numeral
 *    4  ribbon-flag       — Diagonal ribbon bar cutting across
 *    5  spotlight-ring    — Concentric rings radiating from corner
 *    6  corner-stamp      — Huge circular stamp in one corner
 *    7  topography        — Staggered horizontal color layers
 *    8  panorama-strip    — Top strip + mini-chip row below headline
 *    9  cinematic-bar     — Dark band across middle + accent rule
 *   10  split-portrait    — Vertical split with comp on one side
 *   11  halftone-fade     — Radial dot matrix fading out
 *   12  prism-beam        — Angular light beam + dark base + bright line
 *
 * Consumer example:
 *   <HeroCard
 *     variant="solar-arc"
 *     eyebrow="IsraBis · 2026"
 *     title="מחיר אחד הכי זול."
 *     subtitle="השוואה חכמה בין 33 רשתות."
 *     cta={{ label: 'הורידו בחינם', href: '/download' }}
 *     comp="comp_1"
 *   />
 *
 * Accessibility:
 *   - The visual scene is decorative; headline + eyebrow + subtitle
 *     are real DOM text at real heading levels.
 *   - Supports prefers-reduced-motion (animations are purely CSS,
 *     wrapped in `@media (prefers-reduced-motion)` globally in
 *     globals.css — NO JS animation here.)
 *   - Every focusable element has a visible focus ring.
 */
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { CSSProperties, ReactNode, ReactElement } from "react";
import * as React from "react";

export type HeroVariant =
  | "solar-arc"
  | "editorial-split"
  | "grid-core"
  | "ribbon-flag"
  | "spotlight-ring"
  | "corner-stamp"
  | "topography"
  | "panorama-strip"
  | "cinematic-bar"
  | "split-portrait"
  | "halftone-fade"
  | "prism-beam";

type Comp =
  | "comp_1" | "comp_2" | "comp_3" | "comp_4"
  | "comp_5" | "comp_6" | "comp_7" | "comp_8"
  | "comp_9" | "comp_10" | "comp_11" | "comp_12";

export interface HeroCardProps {
  variant: HeroVariant;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  cta?: { label: string; href: string };
  comp?: Comp;
  /** Optional stat callouts for the editorial-split and panorama-strip variants. */
  stats?: { value: string; label: string }[];
  /** Aspect ratio override. Default: 16/9 mobile, 21/9 >=640px. */
  aspect?: string;
  /** Tone: "light" inverts text to white on dark base. Default: auto per variant. */
  tone?: "auto" | "light" | "dark";
  className?: string;
}

/**
 * The raw composition SVG pulled from /public/svg. Using `next/image`
 * with `unoptimized` because the file is already a perfectly-sized
 * SVG — optimizing it would be wasted work and occasionally rasterizes.
 */
function CompIcon({ name, size, style }: { name: Comp; size: number; style?: CSSProperties }) {
  return (
    <Image
      src={`/svg/composition_${name.replace("comp_", "")}.svg`}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size, ...style }}
      unoptimized
      aria-hidden
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   Shared primitives — every variant composes from these
   ─────────────────────────────────────────────────────────────── */

/** Animated sweeping arc anchored to a corner. Pure SVG + CSS rotate. */
function Arc({ corner = "tl", size = 280 }: { corner?: "tl" | "tr" | "bl" | "br"; size?: number }) {
  const pos: CSSProperties =
    corner === "tl" ? { top: -size * 0.38, left: -size * 0.38 } :
    corner === "tr" ? { top: -size * 0.38, right: -size * 0.38 } :
    corner === "bl" ? { bottom: -size * 0.38, left: -size * 0.38 } :
                      { bottom: -size * 0.38, right: -size * 0.38 };
  return (
    <div
      className="hero-arc"
      style={{ position: "absolute", width: size, height: size, ...pos, pointerEvents: "none" }}
      aria-hidden
    >
      <svg width="100%" height="100%" viewBox="0 0 360 360">
        <defs>
          <linearGradient id={`arc-${corner}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="1" />
            <stop offset="1" stopColor="var(--accent-bright)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path d="M 180 20 A 160 160 0 0 1 340 180" stroke={`url(#arc-${corner})`} strokeWidth="14" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** Fine background grid — subtle, adds precision feel. */
function Grid({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <svg className="hero-grid" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <defs>
        <pattern id="gridpat" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gridpat)" opacity={opacity} />
    </svg>
  );
}

/** Diagonal ribbon band cutting across. */
function Ribbon() {
  return (
    <svg aria-hidden className="hero-ribbon" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <defs>
        <linearGradient id="ribgrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-dark)" />
        </linearGradient>
      </defs>
      <polygon points="0,100% 0,62% 100%,20% 100%,58% 0,100%" fill="url(#ribgrad)" opacity="0.22" />
      <polygon points="0,68% 100%,26% 100%,30% 0,72%" fill="var(--accent)" />
    </svg>
  );
}

/** Concentric rings radiating from a corner. */
function SpotRings({ corner = "br" }: { corner?: "tl" | "tr" | "bl" | "br" }) {
  const cx = corner.includes("r") ? "95%" : "5%";
  const cy = corner.startsWith("b") ? "95%" : "5%";
  return (
    <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {[60, 120, 180, 240, 320].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="var(--accent)" strokeWidth="1" opacity={Math.max(0.05, 0.25 - r / 1600)} />
      ))}
    </svg>
  );
}

/** Staggered horizontal color layers — topography feel. */
function TopoLayers() {
  return (
    <svg aria-hidden viewBox="0 0 400 220" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <path d="M 0,80 Q 100,40 220,78 T 400,72 L 400,0 L 0,0 Z" fill="var(--accent)" opacity="0.10" />
      <path d="M 0,115 Q 120,90 250,112 T 400,108 L 400,75 Q 320,98 200,80 T 0,90 Z" fill="var(--accent)" opacity="0.16" />
      <path d="M 0,165 Q 140,140 270,158 T 400,150 L 400,112 Q 320,125 210,112 T 0,118 Z" fill="var(--accent)" opacity="0.22" />
      <path d="M 0,220 L 400,220 L 400,155 Q 320,172 220,160 T 0,170 Z" fill="var(--accent)" opacity="0.30" />
    </svg>
  );
}

/** Radial halftone fade — dot matrix that thins outward. */
function Halftone() {
  const dots: ReactElement[] = [];
  const cols = 20, rows = 12;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c / (cols - 1)) * 100;
      const y = (r / (rows - 1)) * 100;
      const d = Math.hypot(x - 25, y - 55) / 55;
      const op = Math.max(0, 0.55 - d * 0.55);
      if (op < 0.04) continue;
      dots.push(<circle key={`${r}-${c}`} cx={`${x}%`} cy={`${y}%`} r="3" fill="var(--accent)" opacity={op} />);
    }
  }
  return (
    <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {dots}
    </svg>
  );
}

/** Asymmetric diagonal color split (editorial). */
function Split() {
  return (
    <svg aria-hidden viewBox="0 0 400 220" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <defs>
        <linearGradient id="splitL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--text)" />
          <stop offset="1" stopColor="var(--accent-dark)" />
        </linearGradient>
        <linearGradient id="splitR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--accent-light)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <path d="M 0,0 L 248,0 L 152,220 L 0,220 Z" fill="url(#splitL)" />
      <path d="M 248,0 L 400,0 L 400,220 L 152,220 Z" fill="url(#splitR)" />
    </svg>
  );
}

/** Angular light beam diagonal. */
function PrismBeam() {
  return (
    <svg aria-hidden viewBox="0 0 400 220" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent-bright)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--accent-bright)" stopOpacity="0.45" />
          <stop offset="1" stopColor="var(--accent-bright)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points="-40,220 220,-40 300,-40 40,220" fill="url(#beam)" />
      <line x1="0" y1="80%" x2="100%" y2="20%" stroke="var(--accent)" strokeWidth="2" opacity="0.6" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Layouts per variant
   ─────────────────────────────────────────────────────────────── */

function CardShell({ children, style, tone = "dark", className = "" }: { children: ReactNode; style?: CSSProperties; tone?: "dark" | "light"; className?: string }) {
  return (
    <div className={`hero-shell ${className}`} data-tone={tone} style={style}>
      {children}
    </div>
  );
}

function renderText({ eyebrow, title, subtitle, cta, align = "start", textColor }: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  cta?: { label: string; href: string };
  align?: "start" | "center" | "end";
  textColor?: string;
}) {
  const alignItems = align === "center" ? "center" : align === "end" ? "flex-end" : "flex-start";
  const textAlign = align === "center" ? "center" : "right";
  return (
    <div className="hero-text" style={{ alignItems, textAlign, color: textColor }}>
      {eyebrow ? <span className="hero-eyebrow">{eyebrow}</span> : null}
      <h2 className="hero-title">{title}</h2>
      {subtitle ? <p className="hero-subtitle">{subtitle}</p> : null}
      {cta ? (
        <Link href={cta.href} className="hero-cta">
          {cta.label} <ArrowLeft size={16} strokeWidth={2.5} />
        </Link>
      ) : null}
    </div>
  );
}

function SolarArc({ eyebrow, title, subtitle, cta, comp = "comp_1" }: HeroCardProps) {
  return (
    <CardShell tone="light" style={{ background: "var(--bg-secondary)" }}>
      <Grid opacity={0.05} />
      <Arc corner="tl" size={360} />
      <div className="hero-stamp hero-stamp-br" aria-hidden>
        <div className="hero-stamp-disc" style={{ background: "var(--accent)" }}>
          <CompIcon name={comp} size={120} />
        </div>
      </div>
      {renderText({ eyebrow, title, subtitle, cta })}
      <span className="hero-dot hero-dot-tr" aria-hidden />
    </CardShell>
  );
}

function EditorialSplit({ eyebrow, title, subtitle, cta, stats, comp = "comp_7" }: HeroCardProps) {
  return (
    <CardShell tone="dark">
      <Split />
      {renderText({ eyebrow, title, subtitle, cta, textColor: "#fff" })}
      <div className="hero-callout hero-callout-bl" aria-hidden>
        <span className="hero-callout-value">{stats?.[0]?.value ?? "33"}</span>
        <span className="hero-callout-label">{stats?.[0]?.label ?? "רשתות"}</span>
      </div>
      <div className="hero-callout hero-callout-br hero-callout-dark" aria-hidden>
        <span className="hero-callout-value">{stats?.[1]?.value ?? "255K+"}</span>
        <span className="hero-callout-label">{stats?.[1]?.label ?? "מוצרים"}</span>
      </div>
      <div className="hero-callout-round" aria-hidden>
        <CompIcon name={comp} size={44} />
      </div>
    </CardShell>
  );
}

function GridCore({ eyebrow, title, subtitle, cta, comp = "comp_4" }: HeroCardProps) {
  return (
    <CardShell tone="light" style={{ background: "var(--bg)" }}>
      <Grid opacity={0.08} />
      <div className="hero-center-stack" aria-hidden>
        <div className="hero-ring">
          <CompIcon name={comp} size={130} />
        </div>
      </div>
      <div className="hero-text hero-text-overlay" style={{ alignItems: "flex-end", textAlign: "right" }}>
        {eyebrow ? <span className="hero-eyebrow">{eyebrow}</span> : null}
        <h2 className="hero-title">{title}</h2>
        {subtitle ? <p className="hero-subtitle">{subtitle}</p> : null}
        {cta ? <Link href={cta.href} className="hero-cta">{cta.label} <ArrowLeft size={16} strokeWidth={2.5} /></Link> : null}
      </div>
    </CardShell>
  );
}

function RibbonFlag({ eyebrow, title, subtitle, cta, comp = "comp_10" }: HeroCardProps) {
  return (
    <CardShell tone="light" style={{ background: "var(--bg-secondary)" }}>
      <Grid opacity={0.05} />
      <Ribbon />
      <div className="hero-ribbon-comp" aria-hidden>
        <CompIcon name={comp} size={120} />
      </div>
      {renderText({ eyebrow, title, subtitle, cta })}
    </CardShell>
  );
}

function SpotlightRing({ eyebrow, title, subtitle, cta, comp = "comp_6" }: HeroCardProps) {
  return (
    <CardShell tone="light" style={{ background: "var(--bg)" }}>
      <Grid opacity={0.05} />
      <SpotRings corner="br" />
      <div className="hero-spot-comp" aria-hidden>
        <CompIcon name={comp} size={150} />
      </div>
      {renderText({ eyebrow, title, subtitle, cta })}
    </CardShell>
  );
}

function CornerStamp({ eyebrow, title, subtitle, cta, comp = "comp_2" }: HeroCardProps) {
  return (
    <CardShell tone="light" style={{ background: "var(--bg-secondary)" }}>
      <Grid opacity={0.06} />
      <div className="hero-bigstamp" aria-hidden>
        <CompIcon name={comp} size={240} />
      </div>
      {renderText({ eyebrow, title, subtitle, cta })}
    </CardShell>
  );
}

function Topography({ eyebrow, title, subtitle, cta }: HeroCardProps) {
  return (
    <CardShell tone="light" style={{ background: "var(--bg)" }}>
      <TopoLayers />
      <Grid opacity={0.04} />
      {renderText({ eyebrow, title, subtitle, cta })}
    </CardShell>
  );
}

function PanoramaStrip({ eyebrow, title, subtitle, cta, stats }: HeroCardProps) {
  const chips = stats ?? [
    { value: "33", label: "רשתות" },
    { value: "255K+", label: "מוצרים" },
    { value: "AI", label: "חכם" },
    { value: "∞", label: "מתכונים" },
  ];
  return (
    <CardShell tone="light" style={{ background: "var(--bg-secondary)" }}>
      <div className="hero-top-strip" aria-hidden />
      <Grid opacity={0.04} />
      {renderText({ eyebrow, title, subtitle, cta })}
      <div className="hero-chip-row" aria-hidden>
        {chips.map((c, i) => (
          <div key={i} className="hero-chip">
            <span className="hero-chip-value">{c.value}</span>
            <span className="hero-chip-label">{c.label}</span>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function CinematicBar({ eyebrow, title, subtitle, cta }: HeroCardProps) {
  return (
    <CardShell tone="dark" style={{ background: "var(--text)" }}>
      <div className="hero-cine-bar" aria-hidden />
      <Grid opacity={0.06} />
      {renderText({ eyebrow, title, subtitle, cta, align: "center", textColor: "#fff" })}
    </CardShell>
  );
}

function SplitPortrait({ eyebrow, title, subtitle, cta, comp = "comp_8" }: HeroCardProps) {
  return (
    <CardShell tone="light" style={{ background: "var(--bg)" }}>
      <div className="hero-portrait-side" aria-hidden>
        <CompIcon name={comp} size={180} />
      </div>
      <Grid opacity={0.04} />
      {renderText({ eyebrow, title, subtitle, cta })}
    </CardShell>
  );
}

function HalftoneFade({ eyebrow, title, subtitle, cta }: HeroCardProps) {
  return (
    <CardShell tone="light" style={{ background: "var(--bg-secondary)" }}>
      <Halftone />
      {renderText({ eyebrow, title, subtitle, cta })}
    </CardShell>
  );
}

function PrismBeamVariant({ eyebrow, title, subtitle, cta }: HeroCardProps) {
  return (
    <CardShell tone="dark" style={{ background: "var(--text)" }}>
      <PrismBeam />
      <Grid opacity={0.08} />
      {renderText({ eyebrow, title, subtitle, cta, textColor: "#fff" })}
    </CardShell>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Router
   ─────────────────────────────────────────────────────────────── */

export default function HeroCard(props: HeroCardProps) {
  const { variant, className = "" } = props;
  switch (variant) {
    case "solar-arc":        return <div className={`hero-card-wrap ${className}`}><SolarArc {...props} /></div>;
    case "editorial-split":  return <div className={`hero-card-wrap ${className}`}><EditorialSplit {...props} /></div>;
    case "grid-core":        return <div className={`hero-card-wrap ${className}`}><GridCore {...props} /></div>;
    case "ribbon-flag":      return <div className={`hero-card-wrap ${className}`}><RibbonFlag {...props} /></div>;
    case "spotlight-ring":   return <div className={`hero-card-wrap ${className}`}><SpotlightRing {...props} /></div>;
    case "corner-stamp":     return <div className={`hero-card-wrap ${className}`}><CornerStamp {...props} /></div>;
    case "topography":       return <div className={`hero-card-wrap ${className}`}><Topography {...props} /></div>;
    case "panorama-strip":   return <div className={`hero-card-wrap ${className}`}><PanoramaStrip {...props} /></div>;
    case "cinematic-bar":    return <div className={`hero-card-wrap ${className}`}><CinematicBar {...props} /></div>;
    case "split-portrait":   return <div className={`hero-card-wrap ${className}`}><SplitPortrait {...props} /></div>;
    case "halftone-fade":    return <div className={`hero-card-wrap ${className}`}><HalftoneFade {...props} /></div>;
    case "prism-beam":       return <div className={`hero-card-wrap ${className}`}><PrismBeamVariant {...props} /></div>;
    default:                 return <div className={`hero-card-wrap ${className}`}><SolarArc {...props} /></div>;
  }
}
