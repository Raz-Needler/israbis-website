"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type MotionValue, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTheme, type ThemeName, THEMES } from "./ThemeProvider";

const NAV_LINKS = [
  { label: "תכונות", href: "#features" },
  { label: "AI", href: "#ai" },
  { label: "רשתות", href: "#stores" },
  { label: "ערכות נושא", href: "#themes" },
];

export default function Navbar({ navOpacity }: { navOpacity: MotionValue<number> }) {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const bg = useTransform(navOpacity, [0, 1], ["rgba(0,0,0,0)", "var(--bg)"]);
  const borderOpacity = useTransform(navOpacity, [0, 1], [0, 1]);
  const blur = useTransform(navOpacity, [0, 1], ["blur(0px)", "blur(20px)"]);

  return (
    <>
      <motion.nav
        style={{ backgroundColor: bg, backdropFilter: blur, WebkitBackdropFilter: blur }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <motion.div style={{ opacity: borderOpacity }} className="absolute bottom-0 left-0 right-0 h-px">
          <div style={{ background: "var(--border)", height: "100%" }} />
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Image src="/images/israbis-logo.png" alt="IsraBis" width={100} height={40} className="cursor-pointer" />

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {link.label}
              </a>
            ))}

            <div className="flex gap-2 mr-2">
              {(Object.keys(THEMES) as ThemeName[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className="w-4 h-4 rounded-full transition-all duration-300"
                  style={{
                    background: THEMES[key].accent,
                    transform: theme === key ? "scale(1.3)" : "scale(1)",
                    boxShadow: theme === key ? `0 0 12px ${THEMES[key].accent}60` : "none",
                  }}
                />
              ))}
            </div>

            <button className="px-5 py-2 rounded-xl text-white text-sm font-bold transition-all duration-300 hover:scale-105" style={{ background: "var(--accent)" }}>
              הורדה
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X size={24} style={{ color: "var(--text-primary)" }} /> : <Menu size={24} style={{ color: "var(--text-primary)" }} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 pt-20 px-6 pb-8 md:hidden flex flex-col"
            style={{ background: "var(--bg)" }}
          >
            <div className="flex flex-col gap-6 mt-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              {(Object.keys(THEMES) as ThemeName[]).map((key) => (
                <button key={key} onClick={() => setTheme(key)} className="w-10 h-10 rounded-full border-2 transition-all"
                  style={{ background: THEMES[key].bg, borderColor: theme === key ? THEMES[key].accent : "var(--border)" }}
                />
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
