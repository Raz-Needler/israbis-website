"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Sparkles, Cpu, Store, Download, ChevronLeft, ChefHat } from "lucide-react";
import { useTheme, THEMES, type ThemeName } from "./ThemeProvider";

const NAV = [
  { label: "בית", href: "/", icon: Home, color: "#34C759" },
  { label: "תכונות", href: "/features", icon: Sparkles, color: "#6366F1" },
  { label: "מתכונים", href: "/recipes", icon: ChefHat, color: "#C4653A" },
  { label: "כלים חכמים", href: "/ai", icon: Cpu, color: "#06B6D4" },
  { label: "רשתות", href: "/stores", icon: Store, color: "#E8773A" },
  { label: "הורדה", href: "/download", icon: Download, color: "#EC4899" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Desktop + Mobile top bar ── */}
      <nav
        className="fixed top-0 inset-x-0 z-50"
        style={{
          height: 56,
          background: scrolled || open ? "var(--bg)" : "transparent",
          backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          borderBottom: scrolled && !open ? "1px solid var(--glass-border)" : "1px solid transparent",
          transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        }}
      >
        <div className="w-1120 h-full flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={88} height={35} priority />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center" style={{ gap: "var(--space-1)" }}>
            {NAV.slice(0, 4).map((n) => {
              const active = pathname === n.href;
              return (
                <Link
                  key={n.href} href={n.href}
                  className="text-caption"
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-pill)",
                    fontWeight: active ? 600 : 400,
                    color: active ? "var(--accent)" : "var(--text-muted)",
                    background: active ? "var(--accent-10)" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  {n.label}
                </Link>
              );
            })}

            {/* Theme dots */}
            <div className="flex items-center" style={{ gap: 6, marginInlineStart: "var(--space-4)" }}>
              {(Object.keys(THEMES) as ThemeName[]).map((k) => (
                <button
                  key={k} onClick={() => setTheme(k)} title={THEMES[k].label}
                  className="rounded-full transition-all duration-200 hover:scale-125"
                  style={{
                    width: theme === k ? 14 : 10, height: theme === k ? 14 : 10,
                    background: THEMES[k].accent,
                    opacity: theme === k ? 1 : 0.2,
                    boxShadow: theme === k ? `0 0 8px ${THEMES[k].accent}40` : "none",
                  }}
                />
              ))}
            </div>

            <Link href="/download" className="btn btn-accent btn-sm" style={{ marginInlineStart: "var(--space-3)" }}>
              הורדה חינם
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col items-center justify-center"
            style={{ width: 44, height: 44, gap: 5 }}
            aria-label="menu"
          >
            <span style={{ display: "block", width: 20, height: 1.5, borderRadius: 1, background: "var(--text)", transition: "all 0.3s", transform: open ? "rotate(45deg) translate(2.3px, 2.3px)" : "none" }} />
            <span style={{ display: "block", width: 20, height: 1.5, borderRadius: 1, background: "var(--text)", transition: "all 0.3s", opacity: open ? 0 : 0.6 }} />
            <span style={{ display: "block", width: 20, height: 1.5, borderRadius: 1, background: "var(--text)", transition: "all 0.3s", transform: open ? "rotate(-45deg) translate(2.3px, -2.3px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* ── Mobile fullscreen menu (app-style grouped rows) ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "var(--bg)", paddingTop: 56 }}
          >
            <div className="h-full overflow-y-auto" style={{ padding: "var(--space-5) var(--space-4) var(--space-12)" }}>
              {/* Nav links — app-style rows */}
              <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--glass-border)", marginBottom: "var(--space-6)" }}>
                {NAV.map((n, i) => {
                  const active = pathname === n.href;
                  const Icon = n.icon;
                  return (
                    <motion.div
                      key={n.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={n.href}
                        onClick={() => setOpen(false)}
                        style={{
                          display: "flex", alignItems: "center",
                          padding: "var(--space-4) var(--space-5)",
                          background: active ? "var(--accent-10)" : "var(--card)",
                          borderBottom: i < NAV.length - 1 ? "1px solid var(--glass-border)" : "none",
                          textDecoration: "none", color: "inherit",
                          gap: "var(--space-3)",
                        }}
                      >
                        {/* Icon */}
                        <div style={{
                          width: 36, height: 36, borderRadius: "var(--radius-sm)",
                          background: n.color + "15",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <Icon size={18} color={n.color} />
                        </div>

                        {/* Label */}
                        <span className="text-body" style={{ flex: 1, fontWeight: active ? 600 : 500, color: active ? "var(--accent)" : "var(--text)" }}>
                          {n.label}
                        </span>

                        {/* Chevron */}
                        <ChevronLeft size={16} style={{ color: "var(--text-dimmer)", flexShrink: 0 }} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Theme selector */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{ marginBottom: "var(--space-6)" }}
              >
                <p className="text-caption c-muted" style={{ marginBottom: "var(--space-3)", fontWeight: 500 }}>ערכת נושא</p>
                <div className="flex" style={{ gap: "var(--space-3)" }}>
                  {(Object.keys(THEMES) as ThemeName[]).map((k) => {
                    const active = theme === k;
                    return (
                      <button
                        key={k}
                        onClick={() => setTheme(k)}
                        className="flex-1 text-center transition-all"
                        style={{
                          padding: "var(--space-3) var(--space-2)",
                          borderRadius: "var(--radius-lg)",
                          background: THEMES[k].bg,
                          border: active ? `2.5px solid ${THEMES[k].accent}` : "2px solid var(--glass-border)",
                          boxShadow: active ? `0 0 12px ${THEMES[k].accent}20` : "none",
                        }}
                      >
                        <div style={{ width: 16, height: 16, borderRadius: "var(--radius-pill)", background: THEMES[k].accent, margin: "0 auto var(--space-1)" }} />
                        <span className="text-label" style={{ fontWeight: 600, color: THEMES[k].accent }}>{THEMES[k].label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Download CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/download"
                  onClick={() => setOpen(false)}
                  className="btn btn-accent btn-lg"
                  style={{ width: "100%", justifyContent: "center", borderRadius: "var(--radius-lg)" }}
                >
                  הורידו בחינם
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav spacer */}
      <div style={{ height: 56 }} />
    </>
  );
}
