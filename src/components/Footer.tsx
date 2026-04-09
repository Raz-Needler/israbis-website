"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
      <div className="container-wide py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Image src="/images/israbis-logo.png" alt="IsraBis" width={64} height={26} style={{ opacity: 0.5 }} />
          <div className="flex gap-8 text-xs" style={{ color: "var(--text-dim)" }}>
            <Link href="/terms" className="hover:underline">תנאי שימוש</Link>
            <Link href="/privacy" className="hover:underline">מדיניות פרטיות</Link>
            <Link href="/contact" className="hover:underline">צור קשר</Link>
          </div>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            Copyright 2026 IsraBis. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
