"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import {
  Tag,
  ShoppingCart,
  Video,
  Scan,
  TrendingUp,
  Users,
  Apple,
  Play,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTheme, THEMES, type ThemeName } from "@/components/ThemeProvider";

/* ------------------------------------------------------------------ */
/*  Animated Counter                                                   */
/* ------------------------------------------------------------------ */
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, {
    stiffness: 50,
    damping: 30,
    duration: duration * 1000,
  });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) {
      motionVal.set(target);
    }
  }, [inView, target, motionVal]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      setDisplay(Math.round(v).toLocaleString("he-IL"));
    });
    return unsub;
  }, [spring]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Stagger container/item variants                                    */
/* ------------------------------------------------------------------ */
const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeSlideRight: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeSlideLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ------------------------------------------------------------------ */
/*  Feature data                                                       */
/* ------------------------------------------------------------------ */
const FEATURES = [
  {
    icon: Tag,
    title: "השוואת מחירים",
    desc: "השוו מחירים בין 33 רשתות שיווק בישראל בלחיצה אחת",
    color: "#06B6D4",
  },
  {
    icon: ShoppingCart,
    title: "בניית עגלה חכמה",
    desc: "בנו עגלת קניות אופטימלית שחוסכת לכם כסף אמיתי",
    color: "#34C759",
  },
  {
    icon: Video,
    title: "מתכונים מוידאו",
    desc: "חלצו מתכונים מלאים מסרטוני יוטיוב וטיקטוק אוטומטית",
    color: "#9B59B6",
  },
  {
    icon: Scan,
    title: "סריקת ברקוד",
    desc: "סרקו כל מוצר וקבלו מיד את המחיר הכי זול ברשתות",
    color: "#0891B2",
  },
  {
    icon: TrendingUp,
    title: "מעקב הוצאות",
    desc: "עקבו אחרי ההוצאות החודשיות וחסכו בצורה חכמה",
    color: "#14B8A6",
  },
  {
    icon: Users,
    title: "קניות משפחתיות",
    desc: "שתפו רשימות קניות עם המשפחה ותכננו ביחד",
    color: "#EC4899",
  },
];

/* ------------------------------------------------------------------ */
/*  AI Tools data                                                      */
/* ------------------------------------------------------------------ */
const AI_TOOLS = [
  {
    title: "סריקת מקרר",
    desc: "צלמו את המקרר וקבלו מתכונים מותאמים למה שיש",
    longDesc:
      "האלגוריתם החכם שלנו מזהה את המרכיבים שיש לכם במקרר ומציע מתכונים מדויקים. בלי בזבוז, בלי מרכיבים מיותרים.",
    svg: "/svg/composition_3.svg",
  },
  {
    title: "סריקת קלוריות",
    desc: "צלמו את הצלחת וקבלו מידע תזונתי מדויק",
    longDesc:
      "מערכת הזיהוי שלנו מנתחת תמונות של מנות ומחשבת קלוריות, חלבון, פחמימות ושומנים בדיוק מרשים.",
    svg: "/svg/composition_5.svg",
  },
  {
    title: "מתכון מסרטון",
    desc: "הדביקו לינק מיוטיוב או טיקטוק וקבלו מתכון מלא",
    longDesc:
      "ראיתם מתכון מעולה בסרטון? הדביקו את הלינק ותקבלו מתכון כתוב מסודר עם רשימת מרכיבים ומחירים.",
    svg: "/svg/composition_8.svg",
  },
  {
    title: "סריקת קבלה",
    desc: "סרקו קבלה מהסופר והוסיפו פריטים לעגלה בלחיצה",
    longDesc:
      "צלמו את הקבלה מהסופר והמערכת תזהה אוטומטית את כל המוצרים ותאפשר לכם להוסיף אותם לעגלה.",
    svg: "/svg/composition_11.svg",
  },
];

/* ------------------------------------------------------------------ */
/*  Store chains                                                       */
/* ------------------------------------------------------------------ */
const STORES = [
  "רמי לוי",
  "שופרסל",
  "ויקטורי",
  "טיב טעם",
  "מחסני השוק",
  "יוחננוף",
  "אושר עד",
  "חצי חינם",
  "סטופ מרקט",
  "קרפור",
  "שוק העיר",
  "גוד פארם",
];

/* ------------------------------------------------------------------ */
/*  Theme preview colors                                               */
/* ------------------------------------------------------------------ */
const THEME_PREVIEWS: Record<
  ThemeName,
  { bg: string; card: string; accent: string; text: string; secondary: string }
> = {
  snow: {
    bg: "#FFFFFF",
    card: "#F5F5F5",
    accent: "#34C759",
    text: "#1A1A1A",
    secondary: "#007AFF",
  },
  midnight: {
    bg: "#080E1C",
    card: "#0C1328",
    accent: "#06B6D4",
    text: "#FFFFFF",
    secondary: "#818CF8",
  },
  autumn: {
    bg: "#FFF8F0",
    card: "#FCEBD8",
    accent: "#E8773A",
    text: "#3D2415",
    secondary: "#7BAE5E",
  },
  dusk: {
    bg: "#1A1423",
    card: "#231B30",
    accent: "#E8587A",
    text: "#F5F0FA",
    secondary: "#A78BFA",
  },
};

const THEME_LABELS: Record<ThemeName, string> = {
  midnight: "לילה כחול",
  autumn: "סתווי",
  snow: "שלג",
  dusk: "דמדומים",
};

/* ------------------------------------------------------------------ */
/*  HERO WORDS Typewriter                                              */
/* ------------------------------------------------------------------ */
function TypewriterHeading() {
  const line1Words = ["חסכו", "עד", "₪1,000", "בחודש"];
  const line2Words = ["על", "קניות", "סופר"];
  const allWords = [...line1Words, ...line2Words];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <h1
      ref={ref}
      className="text-[40px] sm:text-[56px] md:text-[64px] lg:text-[72px] font-black leading-[1.1] tracking-tight"
      style={{
        fontFamily: "var(--font-rubik), var(--font-heebo), sans-serif",
        color: "var(--text-primary)",
      }}
    >
      <span className="block">
        {line1Words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={
              inView
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : {}
            }
            transition={{
              duration: 0.5,
              delay: i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block ml-3"
            style={
              word === "₪1,000"
                ? { color: "var(--accent)" }
                : undefined
            }
          >
            {word}
          </motion.span>
        ))}
      </span>
      <span className="block mt-1">
        {line2Words.map((word, i) => (
          <motion.span
            key={i + line1Words.length}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={
              inView
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : {}
            }
            transition={{
              duration: 0.5,
              delay: (i + line1Words.length) * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block ml-3"
          >
            {word}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}

/* ------------------------------------------------------------------ */
/*  Phone Mockup                                                       */
/* ------------------------------------------------------------------ */
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px] md:w-[300px]">
      {/* Phone frame */}
      <div
        className="relative rounded-[40px] p-[6px] shadow-2xl"
        style={{
          background: "linear-gradient(145deg, var(--accent), var(--accent-dark))",
          boxShadow: `0 25px 60px -12px var(--shadow), 0 0 40px var(--shadow)`,
        }}
      >
        <div
          className="rounded-[36px] overflow-hidden"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          {/* Notch */}
          <div className="flex justify-center pt-3 pb-2">
            <div
              className="w-28 h-6 rounded-full"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            />
          </div>
          {/* Screen content */}
          <div className="px-4 pb-6 space-y-3">
            {/* Mini header */}
            <div className="flex items-center justify-between">
              <div
                className="w-6 h-6 rounded-lg"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <div
                className="h-2 w-16 rounded-full"
                style={{ backgroundColor: "var(--border)" }}
              />
            </div>
            {/* Search bar */}
            <div
              className="h-10 rounded-xl"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            />
            {/* Product cards */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl shrink-0"
                  style={{
                    background: `linear-gradient(135deg, var(--accent-light), var(--accent))`,
                    opacity: 0.6 + i * 0.13,
                  }}
                />
                <div className="flex-1 space-y-1.5">
                  <div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: "var(--border)", width: `${70 - i * 10}%` }}
                  />
                  <div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: "var(--border)", width: `${50 - i * 5}%` }}
                  />
                </div>
                <div
                  className="text-xs font-bold px-2 py-1 rounded-lg"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "white",
                    fontSize: "10px",
                  }}
                >
                  ₪{(19.9 - i * 3.5).toFixed(1)}
                </div>
              </div>
            ))}
            {/* Bottom nav */}
            <div className="flex justify-around pt-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-xl"
                  style={{
                    backgroundColor:
                      i === 1 ? "var(--accent)" : "var(--bg-tertiary)",
                    opacity: i === 1 ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Glow behind phone */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[80px] opacity-20 -z-10"
        style={{ backgroundColor: "var(--accent)" }}
      />
    </div>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const parallaxRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <main className="overflow-x-hidden">
      <Navbar />

      {/* ============================================================ */}
      {/*  A. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-[72px]"
        style={{ backgroundColor: "var(--bg)" }}
      >
        {/* Background decorative gradient */}
        <div
          className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        >
          <div
            className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-15"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <div
            className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-10"
            style={{ backgroundColor: "var(--secondary)" }}
          />
        </div>

        {/* Floating composition SVGs */}
        <motion.div
          style={{ y: parallaxY1, rotate: parallaxRotate }}
          className="absolute top-[15%] left-[5%] w-24 h-24 sm:w-32 sm:h-32 opacity-30 pointer-events-none"
        >
          <Image
            src="/svg/composition_1.svg"
            alt=""
            fill
            className="object-contain"
          />
        </motion.div>
        <motion.div
          style={{ y: parallaxY2 }}
          className="absolute bottom-[20%] right-[8%] w-20 h-20 sm:w-28 sm:h-28 opacity-25 pointer-events-none"
        >
          <Image
            src="/svg/composition_7.svg"
            alt=""
            fill
            className="object-contain"
          />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full py-12 md:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Text content */}
            <div className="flex flex-col gap-8">
              <TypewriterHeading />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="text-lg sm:text-xl leading-relaxed max-w-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                השוו מחירים בין 33 רשתות, בנו עגלה חכמה, וגלו מתכונים מדהימים
                — הכל באפליקציה אחת
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="#download"
                  className="group flex items-center gap-3 h-14 px-8 rounded-2xl text-white font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                    boxShadow: "0 8px 32px var(--shadow)",
                  }}
                >
                  <Apple size={20} />
                  הורידו לאייפון
                </a>
                <a
                  href="#download"
                  className="group flex items-center gap-3 h-14 px-8 rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Play size={20} style={{ color: "var(--accent)" }} />
                  הורידו לאנדרואיד
                </a>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="flex flex-wrap gap-8 sm:gap-12 pt-4"
              >
                {[
                  { value: 33, suffix: " רשתות", prefix: "" },
                  { value: 255000, suffix: "+ מוצרים", prefix: "" },
                  { value: 1000, suffix: "+ מתכונים", prefix: "" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span
                      className="text-2xl sm:text-3xl font-extrabold"
                      style={{ color: "var(--accent)" }}
                    >
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                      />
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center lg:justify-start"
            >
              <PhoneMockup />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown
              size={24}
              style={{ color: "var(--text-muted)" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  B. FEATURES SECTION                                          */}
      {/* ============================================================ */}
      <section
        id="features"
        className="relative py-24 sm:py-32 lg:py-40"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold mb-6"
              style={{
                fontFamily: "var(--font-rubik), var(--font-heebo), sans-serif",
                color: "var(--text-primary)",
              }}
            >
              מה{" "}
              <span style={{ color: "var(--accent)" }}>IsraBis</span>{" "}
              עושה בשבילך
            </h2>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              ששה כלים עוצמתיים באפליקציה אחת שישנו את הדרך שלכם לקנות, לבשל
              ולחסוך
            </p>
          </motion.div>

          {/* Feature cards grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {FEATURES.map((feature, i) => {
              const IconComp = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUpItem}
                  className="glass-card p-8 flex flex-col gap-5 cursor-default"
                >
                  <div
                    className="feature-icon"
                    style={{
                      backgroundColor: `${feature.color}18`,
                    }}
                  >
                    <IconComp
                      size={28}
                      style={{ color: feature.color }}
                      strokeWidth={2}
                    />
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  C. AI TOOLS SECTION                                          */}
      {/* ============================================================ */}
      <section
        id="ai-tools"
        className="relative py-24 sm:py-32 lg:py-40"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 sm:mb-24"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold mb-6"
              style={{
                fontFamily: "var(--font-rubik), var(--font-heebo), sans-serif",
                color: "var(--text-primary)",
              }}
            >
              כלים חכמים{" "}
              <span className="gradient-text">מבוססי AI</span>
            </h2>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              טכנולוגיה מתקדמת שהופכת את חווית הקניות והבישול שלכם לחכמה יותר
            </p>
          </motion.div>

          {/* AI tool items */}
          <div className="flex flex-col gap-24 sm:gap-32">
            {AI_TOOLS.map((tool, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    isEven ? "" : "lg:direction-ltr"
                  }`}
                >
                  {/* Image side */}
                  <motion.div
                    variants={isEven ? fadeSlideRight : fadeSlideLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className={`relative flex justify-center ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div
                      className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <Image
                        src={tool.svg}
                        alt={tool.title}
                        width={280}
                        height={280}
                        className="object-contain p-6"
                      />
                      {/* Glow */}
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-[60px] opacity-15 -z-10"
                        style={{ backgroundColor: "var(--accent)" }}
                      />
                    </div>
                  </motion.div>

                  {/* Text side */}
                  <motion.div
                    variants={isEven ? fadeSlideLeft : fadeSlideRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className={`flex flex-col gap-6 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold self-start"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "white",
                        opacity: 0.9,
                      }}
                    >
                      AI
                    </div>
                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl font-extrabold"
                      style={{
                        fontFamily:
                          "var(--font-rubik), var(--font-heebo), sans-serif",
                        color: "var(--text-primary)",
                      }}
                    >
                      {tool.title}
                    </h3>
                    <p
                      className="text-lg sm:text-xl leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {tool.desc}
                    </p>
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {tool.longDesc}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  D. PRICE COMPARISON SECTION                                  */}
      {/* ============================================================ */}
      <section
        className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {/* Background accent glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[150px] opacity-10 pointer-events-none"
          style={{ backgroundColor: "var(--accent)" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold mb-6"
              style={{
                fontFamily: "var(--font-rubik), var(--font-heebo), sans-serif",
                color: "var(--text-primary)",
              }}
            >
              השוו מחירים ב-
              <span style={{ color: "var(--accent)" }}>33 רשתות</span>
            </h2>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              כל הרשתות הגדולות בישראל במקום אחד. מצאו את המחיר הכי טוב לכל מוצר
              בשניות
            </p>
          </motion.div>

          {/* Store badges grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-wrap justify-center gap-4 sm:gap-5 mb-16 sm:mb-20 max-w-3xl mx-auto"
          >
            {STORES.map((store, i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                className="glass-card px-6 py-3 sm:px-8 sm:py-4 cursor-default"
                style={{ borderRadius: "16px" }}
              >
                <span
                  className="text-sm sm:text-base font-semibold whitespace-nowrap"
                  style={{ color: "var(--text-primary)" }}
                >
                  {store}
                </span>
              </motion.div>
            ))}
            {/* "And more" badge */}
            <motion.div
              variants={fadeUpItem}
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-dark))",
              }}
            >
              <span className="text-sm sm:text-base font-bold text-white whitespace-nowrap">
                +21 רשתות נוספות
              </span>
            </motion.div>
          </motion.div>

          {/* Savings counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center glass-card max-w-xl mx-auto p-10 sm:p-14"
          >
            <p
              className="text-base sm:text-lg mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              המשתמשים שלנו חוסכים בממוצע
            </p>
            <div
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-4"
              style={{
                fontFamily: "var(--font-rubik), var(--font-heebo), sans-serif",
                color: "var(--accent)",
              }}
            >
              <AnimatedCounter target={847} prefix="₪" suffix="" duration={2.5} />
              <span className="text-2xl sm:text-3xl font-bold mr-2" style={{ color: "var(--text-secondary)" }}>
                {" "}בחודש
              </span>
            </div>
            <p
              className="text-base leading-relaxed max-w-md mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              האלגוריתם שלנו סורק מחירים בזמן אמת ומציע לכם את העגלה הזולה ביותר,
              כך שתוכלו לחסוך בלי מאמץ
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  E. THEMES SECTION                                            */}
      {/* ============================================================ */}
      <section
        id="themes"
        className="relative py-24 sm:py-32 lg:py-40"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold mb-6"
              style={{
                fontFamily: "var(--font-rubik), var(--font-heebo), sans-serif",
                color: "var(--text-primary)",
              }}
            >
              בחרו את{" "}
              <span className="gradient-text">הסגנון שלכם</span>
            </h2>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              ארבע ערכות נושא מעוצבות בקפידה שמתאימות לכל מצב רוח וזמן ביום
            </p>
          </motion.div>

          {/* Theme cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            {(["snow", "midnight", "autumn", "dusk"] as ThemeName[]).map(
              (themeName, i) => {
                const colors = THEME_PREVIEWS[themeName];
                const isActive = theme === themeName;
                return (
                  <motion.button
                    key={themeName}
                    variants={fadeUpItem}
                    onClick={() => setTheme(themeName)}
                    whileHover={{
                      rotateY: 5,
                      rotateX: -5,
                      scale: 1.03,
                    }}
                    className="group relative rounded-3xl p-1 transition-all duration-300 cursor-pointer text-right"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`
                        : "var(--border)",
                      perspective: "800px",
                    }}
                  >
                    <div
                      className="rounded-[22px] p-4 sm:p-5 h-full"
                      style={{ backgroundColor: colors.bg }}
                    >
                      {/* Mini app preview */}
                      <div
                        className="rounded-2xl p-3 mb-4 space-y-2"
                        style={{ backgroundColor: colors.card }}
                      >
                        {/* Mini header row */}
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-md"
                            style={{ backgroundColor: colors.accent }}
                          />
                          <div
                            className="h-1.5 rounded-full flex-1"
                            style={{
                              backgroundColor: colors.text,
                              opacity: 0.15,
                            }}
                          />
                        </div>
                        {/* Mini search */}
                        <div
                          className="h-6 rounded-lg"
                          style={{
                            backgroundColor: colors.bg,
                            border: `1px solid ${colors.text}15`,
                          }}
                        />
                        {/* Mini cards */}
                        {[1, 2].map((j) => (
                          <div key={j} className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-md shrink-0"
                              style={{
                                backgroundColor: colors.accent,
                                opacity: 0.3 + j * 0.2,
                              }}
                            />
                            <div className="flex-1 space-y-1">
                              <div
                                className="h-1 rounded-full"
                                style={{
                                  backgroundColor: colors.text,
                                  opacity: 0.2,
                                  width: `${70 - j * 15}%`,
                                }}
                              />
                              <div
                                className="h-1 rounded-full"
                                style={{
                                  backgroundColor: colors.text,
                                  opacity: 0.1,
                                  width: `${50 - j * 10}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Theme label */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm sm:text-base font-bold"
                          style={{ color: colors.text }}
                        >
                          {THEME_LABELS[themeName]}
                        </span>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        />
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="active-theme"
                          className="mt-3 h-1 rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </div>
                  </motion.button>
                );
              }
            )}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  F. CTA / DOWNLOAD SECTION                                    */}
      {/* ============================================================ */}
      <section
        id="download"
        className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--accent-dark), var(--accent), var(--secondary))",
        }}
      >
        {/* Decorative SVG */}
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 opacity-15 pointer-events-none">
          <Image
            src="/svg/composition_12.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-56 sm:h-56 opacity-10 pointer-events-none rotate-180">
          <Image
            src="/svg/composition_12.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Pattern overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-8"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-black text-white leading-tight"
              style={{
                fontFamily: "var(--font-rubik), var(--font-heebo), sans-serif",
              }}
            >
              מוכנים לחסוך?
            </h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed">
              הצטרפו לאלפי משפחות בישראל שכבר חוסכות מאות שקלים בחודש על קניות
              סופר
            </p>

            {/* Download buttons */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
              <button className="group flex items-center gap-3 h-16 px-8 sm:px-10 rounded-2xl bg-white text-gray-900 font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                <Apple size={28} className="text-gray-900" />
                <div className="flex flex-col items-start">
                  <span className="text-[11px] font-normal opacity-70">
                    הורידו מ-
                  </span>
                  <span className="text-base font-bold -mt-0.5">
                    App Store
                  </span>
                </div>
              </button>
              <button className="group flex items-center gap-3 h-16 px-8 sm:px-10 rounded-2xl bg-white/15 backdrop-blur-sm text-white border border-white/20 font-semibold text-base transition-all duration-300 hover:scale-105 hover:bg-white/25 cursor-pointer">
                <Play size={28} />
                <div className="flex flex-col items-start">
                  <span className="text-[11px] font-normal opacity-70">
                    הורידו מ-
                  </span>
                  <span className="text-base font-bold -mt-0.5">
                    Google Play
                  </span>
                </div>
              </button>
            </div>

            <p className="text-sm text-white/50 mt-2">
              חינם להורדה. ללא מנויים. ללא פרסומות מעצבנות.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  G. FOOTER                                                    */}
      {/* ============================================================ */}
      <footer
        className="py-12 sm:py-16"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            {/* Logo + copyright */}
            <div className="flex items-center gap-3">
              <Image
                src="/images/israbis-logo.png"
                alt="IsraBis"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                &copy; 2026 IsraBis. כל הזכויות שמורות.
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 sm:gap-8">
              {["תנאי שימוש", "מדיניות פרטיות", "צור קשר"].map(
                (link, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-sm transition-colors duration-200"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-muted)")
                    }
                  >
                    {link}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
