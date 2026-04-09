"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, THEMES, type ThemeName } from "./ThemeProvider";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav
        style={{
          background: scrolled ? "rgba(var(--bg-rgb, 255,255,255), 0.8)" : "var(--bg)",
          backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
          transition: "all 0.3s ease",
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="container-wide flex items-center justify-between h-12">
          <Link href="/">
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={80} height={32} priority />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {[
              { label: "תכונות", href: "/#features" },
              { label: "כלים חכמים", href: "/#ai-tools" },
              { label: "רשתות", href: "/#stores" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs font-normal transition-colors duration-200"
                style={{ color: "var(--text-sub)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-sub)")}
              >
                {l.label}
              </Link>
            ))}

            {/* Theme switcher */}
            <div className="flex gap-1.5 mx-2">
              {(Object.keys(THEMES) as ThemeName[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setTheme(k)}
                  title={THEMES[k].label}
                  className="w-3 h-3 rounded-full transition-all duration-200"
                  style={{
                    background: THEMES[k].accent,
                    opacity: theme === k ? 1 : 0.35,
                    transform: theme === k ? "scale(1.25)" : "scale(1)",
                  }}
                />
              ))}
            </div>

            <Link
              href="/#download"
              className="text-xs font-normal transition-colors"
              style={{ color: "var(--accent)" }}
            >
              הורדה
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
            aria-label="תפריט"
          >
            <span className="block w-4 h-[1.5px] rounded-full transition-all duration-300" style={{ background: "var(--text)", transform: menuOpen ? "rotate(45deg) translateY(3.25px)" : "none" }} />
            <span className="block w-4 h-[1.5px] rounded-full transition-all duration-300" style={{ background: "var(--text)", transform: menuOpen ? "rotate(-45deg) translateY(-3.25px)" : "none", opacity: menuOpen ? 1 : 1 }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 pt-12 md:hidden" style={{ background: "var(--bg)" }}>
          <div className="container-wide flex flex-col gap-0 mt-4">
            {[
              { label: "תכונות", href: "/#features" },
              { label: "כלים חכמים", href: "/#ai-tools" },
              { label: "רשתות", href: "/#stores" },
              { label: "הורדה", href: "/#download" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-base font-normal border-b"
                style={{ color: "var(--text-sub)", borderColor: "var(--border)" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-6">
              {(Object.keys(THEMES) as ThemeName[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setTheme(k)}
                  className="w-8 h-8 rounded-full border transition-all"
                  style={{ background: THEMES[k].accent, borderColor: theme === k ? "var(--text)" : "transparent", opacity: theme === k ? 1 : 0.4 }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed nav */}
      <div className="h-12" />
    </>
  );
}
