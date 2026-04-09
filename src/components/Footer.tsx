"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, MessageCircle } from "lucide-react";

const NAV_LINKS = [
  { label: "בית", href: "/" },
  { label: "תכונות", href: "/features" },
  { label: "כלים חכמים", href: "/ai" },
  { label: "רשתות", href: "/stores" },
  { label: "הורדה", href: "/download" },
];

const LEGAL_LINKS = [
  { label: "תנאי שימוש", href: "/terms" },
  { label: "מדיניות פרטיות", href: "/privacy" },
  { label: "צור קשר", href: "/contact" },
];

const SOCIALS = [
  { icon: Globe, label: "Website", href: "#" },
  { icon: MessageCircle, label: "Community", href: "#" },
  { icon: Mail, label: "Email", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--glass-border)" }}>
      <div className="w-1120 sec-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ gap: "var(--space-8)" }}>
          {/* Col 1: Brand */}
          <div>
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={88} height={35} style={{ marginBottom: "var(--space-3)" }} />
            <p className="text-body-sm c-muted" style={{ maxWidth: "30ch", lineHeight: "var(--leading-relaxed)" }}>
              IsraBis — פלטפורמת חיסכון וקולינריה חכמה לכל המשפחה.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-caption" style={{ fontWeight: 700, textTransform: "uppercase", marginBottom: "var(--space-4)", color: "var(--text)" }}>
              ניווט
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-body-sm" style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div>
            <h4 className="text-caption" style={{ fontWeight: 700, textTransform: "uppercase", marginBottom: "var(--space-4)", color: "var(--text)" }}>
              מידע
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-body-sm" style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter + Social */}
          <div>
            <h4 className="text-caption" style={{ fontWeight: 700, textTransform: "uppercase", marginBottom: "var(--space-4)", color: "var(--text)" }}>
              הישארו מעודכנים
            </h4>
            <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
              <input
                type="email"
                placeholder="אימייל"
                className="text-body-sm"
                style={{
                  flex: 1,
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text)",
                  fontFamily: "inherit",
                  outline: "none",
                  direction: "rtl",
                  minWidth: 0,
                }}
              />
              <button className="btn btn-accent btn-sm">הרשמה</button>
            </div>
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: 36, height: 36, borderRadius: "var(--radius-md)",
                    background: "var(--accent-10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-20)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--accent-10)")}
                >
                  <s.icon size={16} style={{ color: "var(--accent)" }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--glass-border)" }}>
        <div className="w-1120 text-center" style={{ padding: "var(--space-4) 0" }}>
          <span className="text-label c-dimmer">
            &copy; 2026 IsraBis Inc. כל הזכויות שמורות.
          </span>
        </div>
      </div>
    </footer>
  );
}
