"use client";

import Image from "next/image";
import type { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  className?: string;
}

export default function PhoneMockup({ children, className = "" }: Props) {
  return (
    <div className={`float ${className}`} style={{ width: "clamp(180px, 30vw, 260px)" }}>
      <div
        style={{
          aspectRatio: "9 / 19.5",
          borderRadius: "clamp(28px, 4vw, 36px)",
          border: "clamp(6px, 1vw, 8px) solid",
          borderColor: "var(--text-dimmer)",
          background: "var(--card)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(60px, 10vw, 90px)",
            height: "clamp(16px, 2.5vw, 22px)",
            borderRadius: "0 0 var(--radius-md) var(--radius-md)",
            background: "var(--text-dimmer)",
            zIndex: 10,
          }}
        />

        {/* Interior */}
        <div style={{ width: "100%", height: "100%", background: "var(--btn-gradient)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {children || (
            <>
              <div className="glow" style={{ display: "block", width: 120, height: 120, top: "40%", left: "50%", marginLeft: -60, background: "rgba(255,255,255,0.15)" }} />
              <Image src="/svg/composition_12.svg" alt="" width={160} height={160} style={{ width: "75%", height: "auto", position: "relative", zIndex: 2, opacity: 0.9 }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
