"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-secondary)", borderTop: "0.5px solid var(--glass-border)" }}>
      <div className="w-980 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={56} height={22} style={{ opacity: 0.4 }} />
            <span className="hidden md:inline" style={{ fontSize: 12, color: "var(--text-dim)" }}>Copyright 2026 IsraBis Inc. כל הזכויות שמורות.</span>
          </div>
          <div className="flex gap-6" style={{ fontSize: 12, color: "var(--text-dim)" }}>
            <Link href="/terms" className="hover:underline" style={{ color: "var(--text-dim)", textDecoration: "none" }}>תנאי שימוש</Link>
            <Link href="/privacy" className="hover:underline" style={{ color: "var(--text-dim)", textDecoration: "none" }}>מדיניות פרטיות</Link>
            <Link href="/contact" className="hover:underline" style={{ color: "var(--text-dim)", textDecoration: "none" }}>צור קשר</Link>
          </div>
          <span className="md:hidden" style={{ fontSize: 12, color: "var(--text-dim)" }}>Copyright 2026 IsraBis</span>
        </div>
      </div>
    </footer>
  );
}
