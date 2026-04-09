"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme, THEMES, type ThemeName } from "./ThemeProvider";

const NAV = [
  { label: "בית", href: "/" },
  { label: "תכונות", href: "/features" },
  { label: "כלים חכמים", href: "/ai" },
  { label: "רשתות", href: "/stores" },
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

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-50"
        style={{
          height: 52,
          background: scrolled || open ? "var(--bg)" : "transparent",
          backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--glass-border)" : "1px solid transparent",
          transition: "all 0.35s ease",
        }}
      >
        <div className="w-1120 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={88} height={35} priority />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const active = pathname === n.href;
              return (
                <Link
                  key={n.href} href={n.href}
                  className="px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200"
                  style={{
                    color: active ? "var(--accent)" : "var(--text-muted)",
                    background: active ? "var(--accent-10)" : "transparent",
                  }}
                >
                  {n.label}
                </Link>
              );
            })}

            {/* Theme dots */}
            <div className="flex gap-1 mx-3 items-center">
              {(Object.keys(THEMES) as ThemeName[]).map((k) => (
                <button
                  key={k} onClick={() => setTheme(k)} title={THEMES[k].label}
                  className="rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    width: theme === k ? 14 : 10, height: theme === k ? 14 : 10,
                    background: THEMES[k].accent,
                    opacity: theme === k ? 1 : 0.25,
                    boxShadow: theme === k ? `0 0 8px ${THEMES[k].accent}40` : "none",
                  }}
                />
              ))}
            </div>

            <Link href="/download" className="btn btn-accent" style={{ padding: "8px 20px", fontSize: 13, borderRadius: 12 }}>
              הורדה חינם
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px]" aria-label="menu">
            <span className="block h-[1.5px] rounded-full transition-all duration-300" style={{ width: 20, background: "var(--text)", transform: open ? "rotate(45deg) translate(2.3px, 2.3px)" : "none" }} />
            <span className="block h-[1.5px] rounded-full transition-all duration-300" style={{ width: 20, background: "var(--text)", opacity: open ? 0 : 0.7 }} />
            <span className="block h-[1.5px] rounded-full transition-all duration-300" style={{ width: 20, background: "var(--text)", transform: open ? "rotate(-45deg) translate(2.3px, -2.3px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div
        className="fixed inset-x-0 z-40 md:hidden overflow-hidden transition-all duration-300"
        style={{
          top: 52, maxHeight: open ? 360 : 0,
          background: "var(--bg)", borderBottom: open ? "1px solid var(--glass-border)" : "none",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="w-1120 py-2 flex flex-col">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href} href={n.href}
                className="py-3.5 text-[15px] font-medium border-b"
                style={{
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  borderColor: "var(--glass-border)", textDecoration: "none",
                }}
              >
                {n.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-3 py-4">
            {(Object.keys(THEMES) as ThemeName[]).map((k) => (
              <button key={k} onClick={() => setTheme(k)} className="w-8 h-8 rounded-full transition-all"
                style={{ background: THEMES[k].accent, opacity: theme === k ? 1 : 0.25, border: theme === k ? "2.5px solid var(--text)" : "2.5px solid transparent" }} />
            ))}
          </div>
          <Link href="/download" className="btn btn-accent text-center mt-1 mb-2" style={{ borderRadius: 14 }}>
            הורדה חינם
          </Link>
        </div>
      </div>

      <div style={{ height: 52 }} />
    </>
  );
}
