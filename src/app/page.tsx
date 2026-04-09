"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  Tag, ShoppingCart, Video, Scan, TrendingUp, Users,
  ChevronDown, Camera, Sparkles, BookOpen, Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTheme, THEMES, type ThemeName } from "@/components/ThemeProvider";

gsap.registerPlugin(ScrollTrigger);

/* ================================================================ */
/*  COUNTER                                                          */
/* ================================================================ */
function Counter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 40, damping: 25 });
  const [display, setDisplay] = useState("0");
  useEffect(() => { if (inView) mv.set(target); }, [inView, target, mv]);
  useEffect(() => { const u = sp.on("change", (v) => setDisplay(Math.round(v).toLocaleString("he-IL"))); return u; }, [sp]);
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

/* ================================================================ */
/*  DATA                                                             */
/* ================================================================ */
const FEATURES = [
  { icon: Tag, title: "השוואת מחירים", desc: "33 רשתות. מחיר אחד הכי זול. בלחיצה.", color: "#06B6D4" },
  { icon: ShoppingCart, title: "עגלה חכמה", desc: "בנו עגלה, המערכת מוצאת את הרשת הזולה.", color: "#34C759" },
  { icon: Video, title: "מתכון מסרטון", desc: "לינק מיוטיוב = מתכון מלא + רשימת קניות.", color: "#9B59B6" },
  { icon: Scan, title: "סריקת ברקוד", desc: "סרקו. דעו. חסכו. מיידי.", color: "#0891B2" },
  { icon: TrendingUp, title: "מעקב הוצאות", desc: "תקציב חודשי, תובנות, התראות חריגה.", color: "#14B8A6" },
  { icon: Users, title: "קניות משפחתיות", desc: "רשימה אחת. כל המשפחה. בזמן אמת.", color: "#EC4899" },
];

const AI_TOOLS = [
  { icon: Camera, title: "סריקת מקרר", desc: "צלמו את המקרר וקבלו מתכונים מותאמים למה שיש", svg: "/svg/composition_3.svg" },
  { icon: Sparkles, title: "סריקת קלוריות", desc: "צלמו את הצלחת וקבלו מידע תזונתי מדויק", svg: "/svg/composition_5.svg" },
  { icon: BookOpen, title: "מתכון מסרטון", desc: "הדביקו לינק מיוטיוב או טיקטוק וקבלו מתכון מלא", svg: "/svg/composition_8.svg" },
  { icon: Zap, title: "סריקת קבלה", desc: "סרקו קבלה מהסופר והוסיפו פריטים לעגלה בלחיצה", svg: "/svg/composition_11.svg" },
];

const STORES = [
  "רמי לוי", "שופרסל", "ויקטורי", "טיב טעם", "מחסני השוק", "יוחננוף",
  "אושר עד", "חצי חינם", "סטופ מרקט", "קרפור", "שוק העיר", "גוד פארם",
  "סופר ספיר", "ברקת", "מעיין 2000", "קינג סטור",
];

const THEME_DATA: Record<ThemeName, { label: string; bg: string; accent: string; text: string }> = {
  snow:     { label: "שלג",       bg: "#FFFFFF", accent: "#34C759", text: "#1A1A1A" },
  midnight: { label: "לילה כחול", bg: "#080E1C", accent: "#06B6D4", text: "#FFFFFF" },
  autumn:   { label: "סתווי",     bg: "#FFF8F0", accent: "#E8773A", text: "#3D2415" },
  dusk:     { label: "דמדומים",   bg: "#1A1423", accent: "#E8587A", text: "#F5F0FA" },
};

/* ================================================================ */
/*  PAGE                                                             */
/* ================================================================ */
export default function Home() {
  const { theme, setTheme } = useTheme();
  const mainRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // GSAP stacking pins — each panel pins and the next slides over it
  useGSAP(() => {
    if (isMobile) return; // no pinning on mobile — natural scroll

    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];

    panels.forEach((panel, i) => {
      if (i === panels.length - 1) return; // don't pin the last panel

      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        pin: true,
        pinSpacing: false,
        endTrigger: panels[panels.length - 1],
        end: "top top",
        onUpdate: (self) => {
          // Scale down + dim as user scrolls past
          const scale = 1 - self.progress * 0.05;
          const brightness = 1 - self.progress * 0.3;
          gsap.set(panel, {
            scale,
            filter: `brightness(${brightness})`,
          });
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [isMobile]);

  const setPanel = useCallback((i: number) => (el: HTMLDivElement | null) => {
    panelRefs.current[i] = el;
  }, []);

  return (
    <div ref={mainRef}>
      <Navbar />

      {/* ============================================================ */}
      {/*  PANEL 0 — HERO                                               */}
      {/* ============================================================ */}
      <div ref={setPanel(0)} className="stack-panel" style={{ background: "var(--bg)", zIndex: 1 }}>
        {/* Glows */}
        <div className="glow" style={{ width: 600, height: 600, top: -200, right: -200, background: "var(--accent)" }} />
        <div className="glow" style={{ width: 400, height: 400, bottom: -100, left: -100, background: "var(--secondary)", animationDelay: "2s" }} />

        {/* Floating SVGs */}
        <div className="absolute top-[10%] left-[5%] w-40 h-40 opacity-20 float max-md:hidden">
          <Image src="/svg/composition_1.svg" alt="" width={160} height={160} />
        </div>
        <div className="absolute bottom-[15%] right-[5%] w-44 h-44 opacity-15 float max-md:hidden" style={{ animationDelay: "1.5s" }}>
          <Image src="/svg/composition_7.svg" alt="" width={176} height={176} />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen min-h-dvh px-6 text-center max-w-5xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={180} height={72} className="mb-10 mx-auto" priority />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[1.05] mb-6"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            חסכו עד{" "}
            <span className="grad-text">₪1,000 בחודש</span>
            <br />
            על קניות סופר
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-12"
            style={{ color: "var(--text-dim)" }}
          >
            השוו מחירים בין 33 רשתות, בנו עגלה חכמה, וגלו מתכונים מדהימים — הכל באפליקציה אחת
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-4 justify-center mb-16"
          >
            <button className="group px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95" style={{ background: "var(--accent)", boxShadow: "0 4px 24px var(--shadow)" }}>
              הורידו בחינם
            </button>
            <button className="px-8 py-4 rounded-2xl font-bold text-lg border-2 transition-all duration-300 hover:scale-105 active:scale-95" style={{ borderColor: "var(--border)", color: "var(--text-sub)" }}>
              גלו עוד
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="grid grid-cols-3 gap-6 md:gap-16">
            {[
              { n: 33, s: " רשתות", l: "שיווק בישראל" },
              { n: 255000, s: "+", l: "מוצרים במאגר" },
              { n: 1000, s: "+", l: "מתכונים" },
            ].map((st, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-5xl font-black" style={{ color: "var(--accent)" }}>
                  <Counter target={st.n} suffix={st.s} />
                </div>
                <div className="text-xs md:text-base mt-1" style={{ color: "var(--text-dim)" }}>{st.l}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll hint */}
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8">
            <ChevronDown size={28} style={{ color: "var(--text-dim)", opacity: 0.3 }} />
          </motion.div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  PANEL 1 — FEATURES (slides over hero)                        */}
      {/* ============================================================ */}
      <div ref={setPanel(1)} className="stack-panel stack-card" style={{ background: "var(--bg-alt)", zIndex: 2 }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-0 flex flex-col justify-center min-h-screen min-h-dvh">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4" style={{ fontFamily: "var(--font-rubik)" }}>
              מה <span className="grad-text">IsraBis</span> עושה בשבילך
            </h2>
            <p className="text-lg" style={{ color: "var(--text-dim)" }}>כלים שחוסכים לך זמן, כסף, ומאמץ</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="p-7 rounded-3xl border cursor-default transition-shadow duration-300"
                style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: `0 4px 24px var(--shadow)` }}
              >
                <div className="w-13 h-13 rounded-2xl flex items-center justify-center mb-5" style={{ background: f.color + "12", width: 52, height: 52 }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-dim)" }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  PANEL 2 — AI TOOLS (slides over features)                    */}
      {/* ============================================================ */}
      <div ref={setPanel(2)} className="stack-panel stack-card" style={{ background: "var(--bg)", zIndex: 3 }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-0 flex flex-col justify-center min-h-screen min-h-dvh">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-4" style={{ fontFamily: "var(--font-rubik)" }}>
              כלים חכמים מבוססי <span className="grad-text">AI</span>
            </h2>
            <p className="text-lg" style={{ color: "var(--text-dim)" }}>טכנולוגיה שעובדת בשבילך</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {AI_TOOLS.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? 60 : -60, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
                className="relative p-8 rounded-3xl border overflow-hidden"
                style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: `0 4px 24px var(--shadow)` }}
              >
                {/* Glow behind SVG */}
                <div className="glow" style={{ width: 180, height: 180, top: -40, left: "50%", marginLeft: -90, background: "var(--accent)" }} />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-28 h-28 mb-6 float">
                    <Image src={tool.svg} alt={tool.title} width={112} height={112} className="w-full h-full object-contain" />
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "var(--accent)" + "12" }}>
                    <tool.icon size={20} style={{ color: "var(--accent)" }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{tool.title}</h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-dim)" }}>{tool.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  PANEL 3 — 33 CHAINS (slides over AI)                         */}
      {/* ============================================================ */}
      <div ref={setPanel(3)} className="stack-panel stack-card overflow-hidden" style={{ background: "var(--bg-alt)", zIndex: 4 }}>
        <div className="flex flex-col justify-center min-h-screen min-h-dvh py-24 md:py-0">
          <div className="max-w-5xl mx-auto px-6 text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black mb-6"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              <span className="grad-text">33 רשתות.</span> מחיר אחד הכי זול.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
              className="text-6xl md:text-9xl font-black my-4"
              style={{ color: "var(--accent)" }}
            >
              <Counter target={847} prefix="₪" />
            </motion.div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-lg" style={{ color: "var(--text-dim)" }}>
              חיסכון ממוצע למשפחה בחודש
            </motion.p>
          </div>

          {/* Marquee rows */}
          <div className="relative" style={{ direction: "ltr" }}>
            <div className="absolute inset-y-0 right-0 w-24 md:w-40 z-10" style={{ background: "linear-gradient(to left, var(--bg-alt), transparent)" }} />
            <div className="absolute inset-y-0 left-0 w-24 md:w-40 z-10" style={{ background: "linear-gradient(to right, var(--bg-alt), transparent)" }} />
            <div className="marquee-l">
              {[...STORES, ...STORES].map((s, i) => (
                <div key={i} className="flex-shrink-0 px-6 py-3 mx-2 rounded-xl border text-base font-bold whitespace-nowrap" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-3" style={{ direction: "ltr" }}>
            <div className="absolute inset-y-0 right-0 w-24 md:w-40 z-10" style={{ background: "linear-gradient(to left, var(--bg-alt), transparent)" }} />
            <div className="absolute inset-y-0 left-0 w-24 md:w-40 z-10" style={{ background: "linear-gradient(to right, var(--bg-alt), transparent)" }} />
            <div className="marquee-r">
              {[...STORES.slice().reverse(), ...STORES.slice().reverse()].map((s, i) => (
                <div key={i} className="flex-shrink-0 px-6 py-3 mx-2 rounded-xl border text-base font-bold whitespace-nowrap" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  PANEL 4 — THEMES (slides over chains)                        */}
      {/* ============================================================ */}
      <div ref={setPanel(4)} className="stack-panel stack-card" style={{ background: "var(--bg)", zIndex: 5 }}>
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-0 flex flex-col justify-center min-h-screen min-h-dvh">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl md:text-6xl font-black mb-4" style={{ fontFamily: "var(--font-rubik)" }}>
              בחרו את <span className="grad-text">הסגנון</span> שלכם
            </h2>
            <p className="text-lg" style={{ color: "var(--text-dim)" }}>לחצו כדי לשנות את ערכת הנושא של האתר</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {(Object.keys(THEME_DATA) as ThemeName[]).map((key, i) => {
              const td = THEME_DATA[key];
              const active = theme === key;
              return (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme(key)}
                  className="relative rounded-3xl overflow-hidden transition-all duration-300 aspect-[3/4]"
                  style={{ background: td.bg, border: active ? `3px solid ${td.accent}` : "2px solid var(--border)", boxShadow: active ? `0 8px 30px ${td.accent}30` : "none" }}
                >
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-5 h-5 rounded-full" style={{ background: td.accent }} />
                      <div className="flex gap-1">
                        <div className="w-3 h-1 rounded" style={{ background: td.text, opacity: 0.15 }} />
                        <div className="w-3 h-1 rounded" style={{ background: td.text, opacity: 0.15 }} />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-6 rounded-lg" style={{ background: td.accent + "20" }} />
                      <div className="h-3 w-3/4 rounded" style={{ background: td.text, opacity: 0.06 }} />
                      <div className="flex gap-1.5 mt-2">
                        <div className="flex-1 h-8 rounded-lg" style={{ background: td.accent + "10" }} />
                        <div className="flex-1 h-8 rounded-lg" style={{ background: td.accent + "10" }} />
                      </div>
                    </div>
                    <div className="text-center mt-auto pt-2">
                      <span className="font-bold text-sm" style={{ color: td.text }}>{td.label}</span>
                    </div>
                  </div>
                  {active && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: td.accent }}>
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  PANEL 5 — CTA (slides over themes — final)                   */}
      {/* ============================================================ */}
      <div ref={setPanel(5)} className="stack-panel stack-card relative overflow-hidden" style={{ zIndex: 6 }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, var(--accent), var(--accent-dark), var(--secondary))` }} />
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.25), transparent 60%)" }} />

        <div className="absolute top-[10%] right-[5%] w-52 h-52 opacity-10 float max-md:hidden">
          <Image src="/svg/composition_12.svg" alt="" width={208} height={208} />
        </div>
        <div className="absolute bottom-[15%] left-[8%] w-40 h-40 opacity-8 float max-md:hidden" style={{ animationDelay: "2s" }}>
          <Image src="/svg/composition_4.svg" alt="" width={160} height={160} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center justify-center min-h-screen min-h-dvh text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-white mb-6"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            מוכנים לחסוך?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 max-w-xl mb-10"
          >
            הצטרפו לאלפי ישראלים שכבר חוסכים עם IsraBis. חינם, פשוט, חכם.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-4 justify-center">
            <button className="px-10 py-5 bg-white rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-2xl" style={{ color: "var(--accent-dark)" }}>
              הורידו לאייפון
            </button>
            <button className="px-10 py-5 rounded-2xl font-bold text-lg border-2 border-white/30 text-white transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white/10">
              הורידו לאנדרואיד
            </button>
          </motion.div>
        </div>

        {/* Footer inside CTA panel */}
        <div className="absolute bottom-0 left-0 right-0 py-8 px-6 border-t border-white/10">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={80} height={32} className="brightness-0 invert opacity-40" />
            <div className="flex gap-6 text-sm text-white/40">
              <span className="cursor-pointer hover:text-white/60 transition-colors">תנאי שימוש</span>
              <span className="cursor-pointer hover:text-white/60 transition-colors">מדיניות פרטיות</span>
              <span className="cursor-pointer hover:text-white/60 transition-colors">צור קשר</span>
            </div>
            <p className="text-sm text-white/30">IsraBis 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
