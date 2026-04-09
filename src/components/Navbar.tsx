"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTheme, THEMES, type ThemeName } from "./ThemeProvider";

const NAV_LINKS = [
  { label: "תכונות", href: "#features" },
  { label: "כלים חכמים", href: "#ai-tools" },
  { label: "ערכות נושא", href: "#themes" },
  { label: "הורדה", href: "#download" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled
            ? "color-mix(in srgb, var(--bg) 85%, transparent)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled
            ? "blur(20px) saturate(180%)"
            : "none",
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid transparent",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 shrink-0">
              <Image
                src="/images/israbis-logo.png"
                alt="IsraBis"
                width={40}
                height={40}
                className="rounded-xl"
              />
              <span
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                IsraBis
              </span>
            </a>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-200 hover:opacity-100"
                  style={{ color: "var(--text-secondary)", opacity: 0.85 }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-secondary)")
                  }
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right side: theme dots + CTA + mobile burger */}
            <div className="flex items-center gap-4">
              {/* Theme dots - desktop only */}
              <div className="hidden lg:flex items-center gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    aria-label={`Switch to ${t.label} theme`}
                    className="relative w-5 h-5 rounded-full transition-transform duration-200 hover:scale-125"
                    style={{ backgroundColor: t.dot }}
                  >
                    {theme === t.name && (
                      <motion.span
                        layoutId="theme-ring"
                        className="absolute inset-[-3px] rounded-full border-2"
                        style={{ borderColor: t.dot }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* CTA button */}
              <a
                href="#download"
                className="hidden sm:inline-flex items-center justify-center h-10 px-5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, var(--accent), var(--accent-dark))`,
                  boxShadow: `0 4px 16px var(--shadow)`,
                }}
              >
                הורידו עכשיו
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
                style={{
                  color: "var(--text-primary)",
                  backgroundColor: "var(--bg-secondary)",
                }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 h-full w-[280px] p-6 pt-24 flex flex-col gap-6"
              style={{
                backgroundColor: "var(--bg)",
                borderRight: "1px solid var(--border)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-semibold transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {link.label}
                </motion.a>
              ))}

              <div className="h-px my-2" style={{ background: "var(--border)" }} />

              {/* Theme dots for mobile */}
              <div className="flex items-center gap-3">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  ערכת נושא:
                </span>
                {THEMES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    aria-label={`Switch to ${t.label} theme`}
                    className="relative w-6 h-6 rounded-full transition-transform duration-200"
                    style={{ backgroundColor: t.dot }}
                  >
                    {theme === t.name && (
                      <span
                        className="absolute inset-[-3px] rounded-full border-2"
                        style={{ borderColor: t.dot }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <a
                href="#download"
                onClick={() => setMobileOpen(false)}
                className="mt-4 flex items-center justify-center h-12 rounded-2xl text-base font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, var(--accent), var(--accent-dark))`,
                }}
              >
                הורידו עכשיו
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
