"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTheme, THEMES, type ThemeName } from "./ThemeProvider";

const LINKS = [
  { label: "תכונות", href: "#features" },
  { label: "AI", href: "#ai" },
  { label: "רשתות", href: "#stores" },
  { label: "ערכות נושא", href: "#themes" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "var(--bg)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Image src="/images/israbis-logo.png" alt="IsraBis" width={100} height={40} />

          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium transition-colors hover:opacity-70" style={{ color: "var(--text-dim)" }}>
                {l.label}
              </a>
            ))}
            <div className="flex gap-2 mr-2">
              {(Object.keys(THEMES) as ThemeName[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className="w-3.5 h-3.5 rounded-full transition-all duration-300"
                  style={{
                    background: THEMES[key].accent,
                    transform: theme === key ? "scale(1.4)" : "scale(1)",
                    boxShadow: theme === key ? `0 0 10px ${THEMES[key].accent}50` : "none",
                  }}
                />
              ))}
            </div>
            <button className="px-5 py-2 rounded-xl text-white text-sm font-bold transition-all hover:scale-105 active:scale-95" style={{ background: "var(--accent)" }}>
              הורדה
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X size={24} style={{ color: "var(--text)" }} /> : <Menu size={24} style={{ color: "var(--text)" }} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pt-20 px-6 pb-8 md:hidden flex flex-col"
            style={{ background: "var(--bg)" }}
          >
            <div className="flex flex-col gap-6 mt-8">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href} href={l.href}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold" style={{ color: "var(--text)" }}
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              {(Object.keys(THEMES) as ThemeName[]).map((key) => (
                <button key={key} onClick={() => setTheme(key)} className="w-10 h-10 rounded-full border-2 transition-all"
                  style={{ background: THEMES[key].bg, borderColor: theme === key ? THEMES[key].accent : "var(--border)" }} />
              ))}
            </div>
            <button onClick={() => setMenuOpen(false)} className="mt-auto px-8 py-4 rounded-2xl text-white font-bold text-lg w-full" style={{ background: "var(--accent)" }}>
              הורידו בחינם
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
