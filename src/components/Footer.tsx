"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, MessageCircle } from "lucide-react";

const LINKS = [
  { label: "בית", href: "/" },
  { label: "תכונות", href: "/features" },
  { label: "מתכונים", href: "/recipes" },
  { label: "כלים חכמים", href: "/ai" },
  { label: "רשתות", href: "/stores" },
  { label: "מדריכים", href: "/guides" },
  { label: "הורדה", href: "/download" },
];

const LEGAL = [
  { label: "תנאי שימוש", href: "/terms" },
  { label: "מדיניות פרטיות", href: "/privacy" },
  { label: "צור קשר", href: "/contact" },
];

const SOCIALS = [
  { icon: Globe, label: "Website", href: "https://www.israbi.app" },
  { icon: MessageCircle, label: "Community", href: "https://wa.me/972000000000" },
  { icon: Mail, label: "Email", href: "mailto:support@israbi.app" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-secondary)" }}>
      {/* Main footer content */}
      <div className="w-980" style={{ paddingTop: "var(--space-11)", paddingBottom: "var(--space-9)" }}>
        <div className="grid grid-cols-1 md:grid-cols-12" style={{ gap: "var(--space-9)" }}>

          {/* Brand — spans more on desktop */}
          <div className="md:col-span-4">
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={100} height={40} style={{ marginBottom: "var(--space-4)" }} />
            <p className="text-body-sm c-muted" style={{ maxWidth: "32ch", lineHeight: "var(--leading-relaxed)" }}>
              פלטפורמת חיסכון וקולינריה חכמה לכל המשפחה. השוו מחירים, גלו מתכונים, וחסכו כסף אמיתי.
            </p>

            {/* Social icons */}
            <div className="flex" style={{ gap: "var(--space-2)", marginTop: "var(--space-5)" }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: 40, height: 40,
                    borderRadius: "var(--radius-md)",
                    background: "var(--accent-10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-20)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--accent-10)")}
                >
                  <s.icon size={18} style={{ color: "var(--accent)" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <p className="text-caption" style={{ fontWeight: 700, color: "var(--text)", marginBottom: "var(--space-4)" }}>ניווט</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-body-sm"
                    style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <p className="text-caption" style={{ fontWeight: 700, color: "var(--text)", marginBottom: "var(--space-4)" }}>מידע</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-body-sm"
                    style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <p className="text-caption" style={{ fontWeight: 700, color: "var(--text)", marginBottom: "var(--space-4)" }}>הישארו מעודכנים</p>
            <div className="flex" style={{ gap: "var(--space-2)" }}>
              <input
                type="email"
                placeholder="אימייל"
                className="text-body-sm"
                style={{
                  flex: 1, minWidth: 0,
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text)",
                  fontFamily: "inherit",
                  outline: "none",
                  direction: "rtl",
                }}
              />
              <button className="btn btn-accent btn-sm">הרשמה</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--glass-border)" }}>
        <div className="w-980 text-center" style={{ padding: "var(--space-4) 0" }}>
          <span className="text-label c-dimmer">&copy; 2026 IsraBis Inc. כל הזכויות שמורות.</span>
        </div>
      </div>
    </footer>
  );
}
