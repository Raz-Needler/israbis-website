"use client";

import FadeIn from "./FadeIn";
import type { ReactNode } from "react";

interface Props {
  label: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "right";
  className?: string;
}

export default function SectionHeader({ label, title, subtitle, align = "center", className = "" }: Props) {
  const isCenter = align === "center";

  return (
    <div className={className} style={{ textAlign: isCenter ? "center" : "right", marginBottom: "var(--space-10)" }}>
      <FadeIn>
        <p className="text-overline" style={{ marginBottom: "var(--space-2)" }}>{label}</p>
      </FadeIn>
      <FadeIn delay={0.05}>
        <h2 className="text-h2" style={{ marginBottom: subtitle ? "var(--space-3)" : 0 }}>
          {title}
        </h2>
      </FadeIn>
      {subtitle && (
        <FadeIn delay={0.1}>
          <p className="text-body c-muted" style={{ maxWidth: isCenter ? "52ch" : "none", margin: isCenter ? "0 auto" : undefined, lineHeight: "var(--leading-relaxed)" }}>
            {subtitle}
          </p>
        </FadeIn>
      )}
    </div>
  );
}
