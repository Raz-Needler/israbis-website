"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme, THEMES, type ThemeName } from "./ThemeProvider";

const LINKS = [
  { label: "תכונות", href: "/#features" },
  { label: "כלים חכמים", href: "/#ai-tools" },
  { label: "רשתות", href: "/#stores" },
  { label: "ערכות נושא", href: "/#themes" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-50"
        style={{
          height: 44,
          background: scrolled ? "var(--bg)" : "var(--bg)",
          backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          borderBottom: `0.5px solid ${scrolled ? "var(--border)" : "transparent"}`,
          transition: "border-color 0.3s, backdrop-filter 0.3s",
        }}
      >
        <div className="container-980 h-full flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={72} height={28} priority />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {LINKS.map((l) => (
              <Link
                key={l.href} href={l.href}
                className="transition-opacity duration-200 hover:opacity-100"
                style={{ fontSize: 12, fontWeight: 400, color: "var(--text)", opacity: 0.8, textDecoration: "none", lineHeight: "44px" }}
              >
                {l.label}
              </Link>
            ))}

            {/* Theme dots */}
            <div className="flex gap-1.5 ms-1">
              {(Object.keys(THEMES) as ThemeName[]).map((k) => (
                <button
                  key={k} onClick={() => setTheme(k)} title={THEMES[k].label}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: theme === k ? 12 : 10, height: theme === k ? 12 : 10,
                    background: THEMES[k].accent,
                    opacity: theme === k ? 1 : 0.3,
                    border: theme === k ? "2px solid var(--bg)" : "none",
                    boxShadow: theme === k ? `0 0 0 1px ${THEMES[k].accent}` : "none",
                  }}
                />
              ))}
            </div>

            <Link href="/#download" style={{ fontSize: 12, fontWeight: 400, color: "var(--accent)", textDecoration: "none", lineHeight: "44px" }}>
              הורדה
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col justify-center gap-[4px] w-[18px] h-[44px]" aria-label="menu">
            <span className="block h-[1px] rounded-full transition-all duration-300" style={{ width: 18, background: "var(--text)", transform: open ? "rotate(45deg) translate(2px, 2px)" : "none" }} />
            <span className="block h-[1px] rounded-full transition-all duration-300" style={{ width: open ? 18 : 14, background: "var(--text)", opacity: open ? 0 : 0.8, marginInlineStart: "auto" }} />
            <span className="block h-[1px] rounded-full transition-all duration-300" style={{ width: 18, background: "var(--text)", transform: open ? "rotate(-45deg) translate(2px, -2px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div
        className="fixed inset-x-0 z-40 md:hidden overflow-hidden transition-all duration-300"
        style={{
          top: 44,
          maxHeight: open ? 400 : 0,
          background: "var(--bg)",
          borderBottom: open ? "0.5px solid var(--border)" : "none",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="container-980 py-2">
          {LINKS.map((l) => (
            <Link
              key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-3 transition-colors"
              style={{ fontSize: 14, color: "var(--text)", borderBottom: "0.5px solid var(--border)", textDecoration: "none" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#download" onClick={() => setOpen(false)}
            className="block py-3"
            style={{ fontSize: 14, color: "var(--accent)", textDecoration: "none" }}
          >
            הורדה
          </Link>
          <div className="flex gap-3 py-3">
            {(Object.keys(THEMES) as ThemeName[]).map((k) => (
              <button key={k} onClick={() => setTheme(k)} className="w-7 h-7 rounded-full transition-all"
                style={{ background: THEMES[k].accent, opacity: theme === k ? 1 : 0.3, border: theme === k ? "2px solid var(--text)" : "2px solid transparent" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Nav spacer */}
      <div style={{ height: 44 }} />
    </>
  );
}
