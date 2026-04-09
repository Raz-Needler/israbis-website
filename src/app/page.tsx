"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import {
  Tag, ShoppingCart, Video, Scan, TrendingUp, Users,
  ChevronDown, Sparkles, Camera, BookOpen, Zap,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTheme, THEMES, type ThemeName } from "@/components/ThemeProvider";

/* ================================================================== */
/*  ANIMATED COUNTER — spring-physics number                           */
/* ================================================================== */
function Counter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 40, damping: 25 });
  const [display, setDisplay] = useState("0");

  useEffect(() => { if (inView) mv.set(target); }, [inView, target, mv]);
  useEffect(() => {
    const unsub = sp.on("change", (v) => setDisplay(Math.round(v).toLocaleString("he-IL")));
    return unsub;
  }, [sp]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

/* ================================================================== */
/*  WORD-BY-WORD REVEAL                                                */
/* ================================================================== */
function RevealText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={{ display: "inline-block", marginLeft: "0.3em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ================================================================== */
/*  PARALLAX IMAGE                                                     */
/* ================================================================== */
function ParallaxSVG({ src, className, speed = 0.3 }: { src: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -120, speed * 120]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <Image src={src} alt="" width={280} height={280} className="w-full h-full object-contain select-none pointer-events-none" />
    </motion.div>
  );
}

/* ================================================================== */
/*  DATA                                                               */
/* ================================================================== */
const FEATURES = [
  { icon: Tag, title: "השוואת מחירים", desc: "33 רשתות. מחיר אחד הכי זול. בלחיצה.", color: "#06B6D4", accent: "cyan" },
  { icon: ShoppingCart, title: "עגלה חכמה", desc: "בנו עגלה, המערכת מוצאת את הרשת הזולה.", color: "#34C759", accent: "green" },
  { icon: Video, title: "מתכון מסרטון", desc: "לינק מיוטיוב = מתכון מלא + רשימת קניות.", color: "#9B59B6", accent: "purple" },
  { icon: Scan, title: "סריקת ברקוד", desc: "סרקו. דעו. חסכו. מיידי.", color: "#0891B2", accent: "teal" },
  { icon: TrendingUp, title: "מעקב הוצאות", desc: "תקציב חודשי, תובנות, התראות חריגה.", color: "#14B8A6", accent: "emerald" },
  { icon: Users, title: "קניות משפחתיות", desc: "רשימה אחת. כל המשפחה. בזמן אמת.", color: "#EC4899", accent: "pink" },
];

const AI_TOOLS = [
  { icon: Camera, title: "סריקת מקרר", desc: "צלמו את המקרר. קבלו מתכונים ממה שיש.", detail: "AI מזהה מרכיבים ומציע מתכונים מותאמים, בלי בזבוז מזון.", svg: "/svg/composition_3.svg" },
  { icon: Sparkles, title: "סריקת קלוריות", desc: "צלמו את הצלחת. קבלו מידע תזונתי.", detail: "זיהוי אוטומטי של מנות, קלוריות, חלבון, פחמימות ושומנים.", svg: "/svg/composition_5.svg" },
  { icon: BookOpen, title: "מתכון מסרטון", desc: "לינק אחד = מתכון מלא.", detail: "יוטיוב, טיקטוק, אינסטגרם. הדביקו לינק וקבלו מתכון כתוב עם מרכיבים ומחירים.", svg: "/svg/composition_8.svg" },
  { icon: Zap, title: "סריקת קבלה", desc: "קבלה = פריטים בעגלה.", detail: "צלמו קבלה מהסופר והמערכת מזהה את כל המוצרים. הוסיפו לעגלה בלחיצה.", svg: "/svg/composition_11.svg" },
];

const STORES = [
  "רמי לוי", "שופרסל", "ויקטורי", "טיב טעם", "מחסני השוק", "יוחננוף",
  "אושר עד", "חצי חינם", "סטופ מרקט", "קרפור", "שוק העיר", "גוד פארם",
  "סופר ספיר", "ברקת", "מעיין 2000", "קינג סטור",
];

const THEME_DATA: Record<ThemeName, { label: string; bg: string; accent: string; text: string }> = {
  snow:     { label: "שלג",        bg: "#FFFFFF", accent: "#34C759", text: "#1A1A1A" },
  midnight: { label: "לילה כחול",  bg: "#080E1C", accent: "#06B6D4", text: "#FFFFFF" },
  autumn:   { label: "סתווי",      bg: "#FFF8F0", accent: "#E8773A", text: "#3D2415" },
  dusk:     { label: "דמדומים",    bg: "#1A1423", accent: "#E8587A", text: "#F5F0FA" },
};

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function Home() {
  const { theme, setTheme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <>
      <Navbar navOpacity={navBg} />

      {/* ============================================================ */}
      {/*  SLIDE 1 — HERO                                               */}
      {/* ============================================================ */}
      <section ref={heroRef} className="snap-section relative" style={{ background: "var(--bg)" }}>
        {/* Glow orbs */}
        <div className="glow-orb" style={{ width: 500, height: 500, top: -100, right: -150, background: "var(--accent)", opacity: 0.12 }} />
        <div className="glow-orb" style={{ width: 350, height: 350, bottom: 50, left: -100, background: "var(--secondary)", opacity: 0.08, animationDelay: "2s" }} />

        {/* Floating SVGs */}
        <ParallaxSVG src="/svg/composition_1.svg" speed={0.5} className="absolute top-[8%] left-[5%] w-[180px] h-[180px] opacity-30 float-slow max-md:hidden" />
        <ParallaxSVG src="/svg/composition_7.svg" speed={0.3} className="absolute bottom-[12%] right-[3%] w-[200px] h-[200px] opacity-25 float-mid max-md:hidden" />
        <ParallaxSVG src="/svg/composition_12.svg" speed={0.4} className="absolute top-[60%] left-[60%] w-[140px] h-[140px] opacity-20 float-fast max-md:hidden" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-5xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={200} height={80} className="mb-8 mx-auto" priority />
          </motion.div>

          {/* Headline — word by word reveal */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-6" style={{ fontFamily: "var(--font-rubik, var(--font-heebo))" }}>
            <RevealText text="חסכו עד" delay={0.3} />
            <br />
            <span className="gradient-text">
              <RevealText text="₪1,000 בחודש" delay={0.6} />
            </span>
            <br />
            <RevealText text="על קניות סופר" delay={0.9} />
          </h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: "var(--text-muted)" }}
          >
            השוו מחירים בין 33 רשתות, בנו עגלה חכמה, וגלו מתכונים מדהימים — הכל באפליקציה אחת
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.5 }}
            className="flex flex-wrap gap-4 justify-center mb-16"
          >
            <button className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{ background: "var(--accent)" }}>
              הורידו בחינם
            </button>
            <button className="px-8 py-4 rounded-2xl font-bold text-lg border-2 transition-all duration-300 hover:scale-105" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              גלו עוד
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="grid grid-cols-3 gap-8 md:gap-16"
          >
            {[
              { n: 33, s: " רשתות", label: "שיווק בישראל" },
              { n: 255000, s: "+", label: "מוצרים במאגר" },
              { n: 1000, s: "+", label: "מתכונים" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-5xl font-black" style={{ color: "var(--accent)" }}>
                  <Counter target={stat.n} suffix={stat.s} />
                </div>
                <div className="text-sm md:text-base mt-1" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute bottom-8"
          >
            <ChevronDown size={28} style={{ color: "var(--text-muted)", opacity: 0.4 }} />
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SLIDE 2 — FEATURES (staggered cards)                         */}
      {/* ============================================================ */}
      <section className="snap-section relative py-24 md:py-0" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4" style={{ fontFamily: "var(--font-rubik)" }}>
              <RevealText text="מה IsraBis עושה בשבילך" />
            </h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>כלים שחוסכים לך זמן, כסף, ומאמץ</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 60, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-8 rounded-3xl border transition-shadow duration-300 cursor-default"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  boxShadow: `0 8px 40px var(--shadow)`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: f.color + "15" }}
                >
                  <f.icon size={26} color={f.color} />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SLIDE 3 — AI TOOLS (full-bleed alternating)                  */}
      {/* ============================================================ */}
      <section className="snap-section relative py-24 md:py-0" style={{ background: "var(--bg)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4" style={{ fontFamily: "var(--font-rubik)" }}>
              <RevealText text="כלים חכמים מבוססי AI" />
            </h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>טכנולוגיה שעובדת בשבילך</p>
          </motion.div>

          <div className="space-y-24 md:space-y-32">
            {AI_TOOLS.map((tool, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={tool.title} className={`flex flex-col ${isEven ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12 md:gap-20`}>
                  {/* SVG side */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 100 : -100, rotate: isEven ? 5 : -5 }}
                    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 flex justify-center"
                  >
                    <div className="relative">
                      <div className="glow-orb" style={{ width: 200, height: 200, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--accent)", opacity: 0.15 }} />
                      <Image src={tool.svg} alt={tool.title} width={300} height={300} className="relative z-10 float-slow" />
                    </div>
                  </motion.div>

                  {/* Text side */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -80 : 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 text-right"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "var(--accent)" + "15" }}>
                      <tool.icon size={24} style={{ color: "var(--accent)" }} />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black mb-3">{tool.title}</h3>
                    <p className="text-xl mb-4" style={{ color: "var(--text-secondary)" }}>{tool.desc}</p>
                    <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.detail}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SLIDE 4 — 33 CHAINS MARQUEE                                  */}
      {/* ============================================================ */}
      <section className="snap-section relative py-24 md:py-0 overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
        <div className="flex flex-col justify-center min-h-screen">
          <div className="max-w-5xl mx-auto px-6 text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-black mb-4"
              style={{ fontFamily: "var(--font-rubik)" }}
            >
              <span className="gradient-text">33 רשתות.</span> מחיר אחד הכי זול.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-lg"
              style={{ color: "var(--text-muted)" }}
            >
              משפחה ישראלית ממוצעת חוסכת
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="text-6xl md:text-8xl font-black my-6"
              style={{ color: "var(--accent)" }}
            >
              <Counter target={847} prefix="₪" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="text-lg"
              style={{ color: "var(--text-muted)" }}
            >
              בחודש בממוצע
            </motion.p>
          </div>

          {/* Marquee of store names */}
          <div className="relative" style={{ direction: "ltr" }}>
            <div className="absolute inset-y-0 right-0 w-32 z-10" style={{ background: `linear-gradient(to left, var(--bg-secondary), transparent)` }} />
            <div className="absolute inset-y-0 left-0 w-32 z-10" style={{ background: `linear-gradient(to right, var(--bg-secondary), transparent)` }} />
            <div className="marquee-track">
              {[...STORES, ...STORES].map((store, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-8 py-4 mx-3 rounded-2xl border text-lg font-bold whitespace-nowrap"
                  style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                >
                  {store}
                </div>
              ))}
            </div>
          </div>

          {/* Second row — reversed */}
          <div className="relative mt-4" style={{ direction: "ltr" }}>
            <div className="absolute inset-y-0 right-0 w-32 z-10" style={{ background: `linear-gradient(to left, var(--bg-secondary), transparent)` }} />
            <div className="absolute inset-y-0 left-0 w-32 z-10" style={{ background: `linear-gradient(to right, var(--bg-secondary), transparent)` }} />
            <div className="marquee-track" style={{ animationDirection: "reverse", animationDuration: "30s" }}>
              {[...STORES.slice().reverse(), ...STORES.slice().reverse()].map((store, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-8 py-4 mx-3 rounded-2xl border text-lg font-bold whitespace-nowrap"
                  style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                >
                  {store}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SLIDE 5 — THEMES (live switcher)                             */}
      {/* ============================================================ */}
      <section className="snap-section relative py-24 md:py-0" style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4" style={{ fontFamily: "var(--font-rubik)" }}>
              <RevealText text="בחרו את הסגנון שלכם" />
            </h2>
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>לחצו כדי לשנות את ערכת הנושא של האתר</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {(Object.keys(THEME_DATA) as ThemeName[]).map((key, i) => {
              const td = THEME_DATA[key];
              const isActive = theme === key;
              return (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme(key)}
                  className="relative rounded-3xl overflow-hidden transition-all duration-300 aspect-[3/4]"
                  style={{
                    background: td.bg,
                    border: isActive ? `3px solid ${td.accent}` : "2px solid var(--border)",
                    boxShadow: isActive ? `0 8px 30px ${td.accent}30` : "none",
                  }}
                >
                  {/* Mini app preview */}
                  <div className="p-4 h-full flex flex-col">
                    {/* Fake navbar */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-6 h-6 rounded-full" style={{ background: td.accent }} />
                      <div className="flex gap-1">
                        <div className="w-4 h-1.5 rounded" style={{ background: td.text, opacity: 0.2 }} />
                        <div className="w-4 h-1.5 rounded" style={{ background: td.text, opacity: 0.2 }} />
                      </div>
                    </div>
                    {/* Fake cards */}
                    <div className="flex-1 space-y-2">
                      <div className="h-8 rounded-lg" style={{ background: td.accent + "20" }} />
                      <div className="h-5 w-3/4 rounded" style={{ background: td.text, opacity: 0.08 }} />
                      <div className="flex gap-2 mt-2">
                        <div className="flex-1 h-12 rounded-lg" style={{ background: td.accent + "12" }} />
                        <div className="flex-1 h-12 rounded-lg" style={{ background: td.accent + "12" }} />
                      </div>
                    </div>
                    {/* Label */}
                    <div className="text-center mt-3">
                      <span className="font-bold text-sm" style={{ color: td.text }}>{td.label}</span>
                    </div>
                  </div>

                  {/* Active check */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: td.accent }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SLIDE 6 — FINAL CTA                                          */}
      {/* ============================================================ */}
      <section className="snap-section relative py-24 md:py-0 overflow-hidden">
        {/* Gradient bg */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, var(--accent), var(--accent-dark), var(--secondary))` }} />
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2), transparent 60%)" }} />

        {/* Floating SVGs */}
        <div className="absolute top-[10%] right-[5%] w-[220px] h-[220px] opacity-15 float-slow max-md:hidden">
          <Image src="/svg/composition_12.svg" alt="" width={220} height={220} />
        </div>
        <div className="absolute bottom-[10%] left-[8%] w-[180px] h-[180px] opacity-10 float-mid max-md:hidden">
          <Image src="/svg/composition_4.svg" alt="" width={180} height={180} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center justify-center min-h-screen text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-black text-white mb-6"
            style={{ fontFamily: "var(--font-rubik)" }}
          >
            מוכנים לחסוך?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/80 max-w-xl mb-10"
          >
            הצטרפו לאלפי ישראלים שכבר חוסכים עם IsraBis. חינם, פשוט, חכם.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button className="px-10 py-5 bg-white rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{ color: "var(--accent-dark)" }}>
              הורידו לאייפון
            </button>
            <button className="px-10 py-5 rounded-2xl font-bold text-lg border-2 border-white/30 text-white transition-all duration-300 hover:scale-105 hover:bg-white/10">
              הורידו לאנדרואיד
            </button>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="py-12 px-6 border-t" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Image src="/images/israbis-logo.png" alt="IsraBis" width={100} height={40} className="opacity-60" />
          <div className="flex gap-8 text-sm" style={{ color: "var(--text-muted)" }}>
            <span className="cursor-pointer hover:underline">תנאי שימוש</span>
            <span className="cursor-pointer hover:underline">מדיניות פרטיות</span>
            <span className="cursor-pointer hover:underline">צור קשר</span>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            IsraBis 2026. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </>
  );
}
