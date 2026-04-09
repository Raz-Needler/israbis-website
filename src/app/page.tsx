"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { useTheme, type ThemeName, THEMES } from "@/components/ThemeProvider";

/* ── Counter ── */
function Counter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 40, damping: 28 });
  const [d, setD] = useState("0");
  useEffect(() => { if (inView) mv.set(target); }, [inView, target, mv]);
  useEffect(() => { const u = sp.on("change", (v) => setD(Math.round(v).toLocaleString("he-IL"))); return u; }, [sp]);
  return <span ref={ref}>{prefix}{d}{suffix}</span>;
}

/* ── Store logos ── */
const STORE_LOGOS = [
  { key: "rami_levy", name: "רמי לוי" },
  { key: "shufersal", name: "שופרסל" },
  { key: "victory", name: "ויקטורי" },
  { key: "tiv_taam", name: "טיב טעם" },
  { key: "machsanei_hashuk", name: "מחסני השוק" },
  { key: "yochananof", name: "יוחננוף" },
  { key: "osher_ad", name: "אושר עד" },
  { key: "hazi_hinam", name: "חצי חינם" },
  { key: "mega", name: "מגה" },
  { key: "stop_market", name: "סטופ מרקט" },
  { key: "king_store", name: "קינג סטור" },
  { key: "good_pharm", name: "גוד פארם" },
];

/* ── Features ── */
const FEATURES = [
  { title: "השוואת מחירים", desc: "השוו מחירים בין 33 רשתות שיווק בישראל. מצאו את הסופר הכי זול לעגלה שלכם בלחיצה אחת.", svg: "composition_1" },
  { title: "עגלת קניות חכמה", desc: "הוסיפו מוצרים, המערכת מחשבת את העלות בכל רשת ומציעה את הזולה ביותר. חסכו בכל קנייה.", svg: "composition_7" },
  { title: "מתכונים ובישול", desc: "מעל 1,000 מתכונים עם רשימת מרכיבים, מחירים, ומצב בישול מונחה. מהמתכון לעגלה בלחיצה.", svg: "composition_12" },
];

/* ── AI Tools ── */
const AI_TOOLS = [
  { title: "סריקת מקרר", desc: "צלמו את המקרר — המערכת מזהה מרכיבים ומציעה מתכונים מותאמים. אפס בזבוז.", svg: "composition_3" },
  { title: "סריקת קלוריות", desc: "צלמו מנה וקבלו ניתוח תזונתי מלא: קלוריות, חלבון, פחמימות, שומנים.", svg: "composition_5" },
  { title: "מתכון מסרטון", desc: "הדביקו לינק מיוטיוב, טיקטוק או אינסטגרם. קבלו מתכון כתוב עם מרכיבים ומחירים.", svg: "composition_8" },
  { title: "סריקת קבלה", desc: "צלמו קבלה מהסופר. המערכת מזהה את כל המוצרים ומאפשרת להוסיף אותם לעגלה.", svg: "composition_11" },
];

export default function Home() {
  const { setTheme } = useTheme();

  return (
    <>
      {/* ════════════════════════════════════════════════════════════ */}
      {/*  HERO                                                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div className="container-narrow text-center">
          <FadeIn>
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={140} height={56} className="mx-auto mb-4" priority />
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-[clamp(2.2rem,5.5vw,4rem)] font-black leading-[1.08] tracking-tight mb-4">
              חסכו עד ₪1,000 בחודש
              <br />
              <span style={{ color: "var(--accent)" }}>על קניות הסופר</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-[clamp(1rem,2.2vw,1.25rem)] leading-relaxed max-w-xl mx-auto mb-8" style={{ color: "var(--text-sub)" }}>
              השוו מחירים בין 33 רשתות, בנו עגלה חכמה, גלו מתכונים מדהימים, ועקבו אחרי ההוצאות — הכל באפליקציה אחת.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              <a href="#download" className="inline-flex items-center px-6 py-3 rounded-full text-white text-sm font-medium transition-transform hover:scale-105 active:scale-95" style={{ background: "var(--accent)" }}>
                הורידו בחינם
              </a>
              <a href="#features" className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-transform hover:scale-105" style={{ color: "var(--accent)" }}>
                גלו עוד
              </a>
            </div>
          </FadeIn>

          {/* Composition SVG hero image */}
          <FadeIn delay={0.4} y={30}>
            <div className="relative max-w-lg mx-auto">
              <Image src="/svg/composition_12.svg" alt="IsraBis" width={500} height={400} className="w-full h-auto" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  STATS BAR                                                   */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container-wide py-6 grid grid-cols-3 text-center">
          {[
            { n: 33, s: "", label: "רשתות שיווק" },
            { n: 255000, s: "+", label: "מוצרים במאגר" },
            { n: 1000, s: "+", label: "מתכונים" },
          ].map((st, i) => (
            <div key={i}>
              <div className="text-2xl md:text-4xl font-black" style={{ color: "var(--text)" }}>
                <Counter target={st.n} suffix={st.s} />
              </div>
              <div className="text-xs md:text-sm mt-1" style={{ color: "var(--text-dim)" }}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  FEATURES — alternating image + text                        */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section id="features">
        {FEATURES.map((f, i) => {
          const isEven = i % 2 === 0;
          return (
            <div key={f.title} className={i % 2 === 0 ? "section" : "section section-alt"}>
              <div className={`container-narrow flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-10 md:gap-16`}>
                <FadeIn className="flex-1" delay={0.1}>
                  <Image src={`/svg/${f.svg}.svg`} alt={f.title} width={400} height={400} className="w-full max-w-[360px] mx-auto h-auto" />
                </FadeIn>
                <FadeIn className="flex-1 text-right" delay={0.2}>
                  <h2 className="text-3xl md:text-[2.5rem] font-black leading-tight mb-4">{f.title}</h2>
                  <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--text-sub)" }}>{f.desc}</p>
                </FadeIn>
              </div>
            </div>
          );
        })}
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  AI TOOLS                                                    */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section id="ai-tools" className="section section-alt">
        <div className="container-narrow text-center mb-14">
          <FadeIn>
            <h2 className="text-3xl md:text-[2.5rem] font-black mb-3">
              כלים חכמים מבוססי <span style={{ color: "var(--accent)" }}>AI</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-base md:text-lg" style={{ color: "var(--text-sub)" }}>
              צלמו, סרקו, הדביקו — והמערכת עושה את השאר.
            </p>
          </FadeIn>
        </div>

        <div className="container-wide grid grid-cols-1 sm:grid-cols-2 gap-5">
          {AI_TOOLS.map((tool, i) => (
            <FadeIn key={tool.title} delay={i * 0.08}>
              <div
                className="rounded-2xl p-8 md:p-10 transition-transform duration-200 hover:-translate-y-1"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <Image src={`/svg/${tool.svg}.svg`} alt={tool.title} width={120} height={120} className="mb-6" />
                <h3 className="text-xl font-bold mb-2 text-right">{tool.title}</h3>
                <p className="text-sm leading-relaxed text-right" style={{ color: "var(--text-sub)" }}>{tool.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  33 STORES                                                   */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section id="stores" className="section">
        <div className="container-narrow text-center mb-14">
          <FadeIn>
            <h2 className="text-3xl md:text-[2.5rem] font-black mb-3">
              השוו מחירים ב-<span style={{ color: "var(--accent)" }}>33 רשתות</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-base md:text-lg" style={{ color: "var(--text-sub)" }}>
              כל הרשתות. כל המוצרים. מחיר אחד הכי זול.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-6">
              <span className="text-5xl md:text-7xl font-black" style={{ color: "var(--accent)" }}>
                <Counter target={847} prefix="₪" />
              </span>
              <p className="text-sm mt-2" style={{ color: "var(--text-dim)" }}>חיסכון ממוצע למשפחה בחודש</p>
            </div>
          </FadeIn>
        </div>

        <div className="container-wide">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {STORE_LOGOS.map((store, i) => (
              <FadeIn key={store.key} delay={i * 0.04}>
                <div
                  className="flex flex-col items-center gap-2 py-5 px-3 rounded-xl transition-transform hover:-translate-y-1"
                  style={{ background: "var(--bg-alt)", border: "1px solid var(--border)" }}
                >
                  <Image
                    src={`/stores/${store.key}.png`}
                    alt={store.name}
                    width={48}
                    height={48}
                    className="w-10 h-10 object-contain rounded-lg"
                  />
                  <span className="text-xs font-medium" style={{ color: "var(--text-sub)" }}>{store.name}</span>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <p className="text-center text-sm mt-6" style={{ color: "var(--text-dim)" }}>
              ועוד 21 רשתות נוספות...
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  MORE FEATURES LIST                                          */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="section section-alt">
        <div className="container-narrow text-center mb-14">
          <FadeIn>
            <h2 className="text-3xl md:text-[2.5rem] font-black mb-3">עוד ב-IsraBis</h2>
          </FadeIn>
        </div>
        <div className="container-narrow grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {[
            { title: "מעקב הוצאות", desc: "הגדירו תקציב חודשי, עקבו אחרי הוצאות לפי קטגוריה, וקבלו התראות חריגה." },
            { title: "קניות משפחתיות", desc: "רשימת קניות משותפת לכל המשפחה, קניות חיות בזמן אמת, ודשבורד הוצאות משפחתי." },
            { title: "מעקב מזון", desc: "הוסיפו מוצרים למזווה, עקבו אחרי תאריכי תפוגה, וקבלו התראות לפני שמשהו מתקלקל." },
            { title: "סריקת ברקוד", desc: "סרקו כל מוצר בסופר וראו מיד את המחיר בכל 33 הרשתות." },
            { title: "ספר מתכונים אישי", desc: "שמרו מתכונים אהובים, צרו ספרי מתכונים, ושתפו עם חברים ומשפחה." },
            { title: "עוזר AI אישי", desc: "שאלו את מיקי — העוזר החכם שלנו — כל שאלה על מתכונים, מרכיבים, ובישול." },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.06}>
              <div className="text-right">
                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  THEMES                                                      */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container-narrow text-center mb-12">
          <FadeIn>
            <h2 className="text-3xl md:text-[2.5rem] font-black mb-3">
              ארבע ערכות נושא.
              <br />
              <span style={{ color: "var(--accent)" }}>הסגנון שלכם.</span>
            </h2>
          </FadeIn>
        </div>
        <div className="container-narrow grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.keys(THEMES) as ThemeName[]).map((key, i) => {
            const t = THEMES[key];
            return (
              <FadeIn key={key} delay={i * 0.08}>
                <button
                  onClick={() => setTheme(key)}
                  className="w-full rounded-2xl overflow-hidden text-center transition-transform hover:-translate-y-1 active:scale-95"
                  style={{ border: `2px solid ${t.accent}30` }}
                >
                  <div className="p-4 pb-3" style={{ background: t.bg }}>
                    {/* Mini preview */}
                    <div className="space-y-1.5 mb-3">
                      <div className="h-4 rounded" style={{ background: t.accent + "20" }} />
                      <div className="h-2 w-3/4 rounded" style={{ background: t.accent + "10" }} />
                      <div className="flex gap-1.5">
                        <div className="flex-1 h-6 rounded" style={{ background: t.accent + "10" }} />
                        <div className="flex-1 h-6 rounded" style={{ background: t.accent + "10" }} />
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full mx-auto mb-2" style={{ background: t.accent }} />
                    <span className="text-xs font-bold" style={{ color: t.accent }}>{t.label}</span>
                  </div>
                </button>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  DOWNLOAD CTA                                                */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section id="download" className="section" style={{ background: "var(--accent)", color: "#FFFFFF" }}>
        <div className="container-narrow text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-[2.5rem] font-black mb-4">
              מוכנים לחסוך?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-lg opacity-80 max-w-md mx-auto mb-8">
              הצטרפו לאלפי ישראלים שכבר חוסכים עם IsraBis. חינם, פשוט, חכם.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="px-8 py-3.5 bg-white rounded-full font-bold text-sm transition-transform hover:scale-105 active:scale-95" style={{ color: "var(--accent)" }}>
                App Store
              </button>
              <button className="px-8 py-3.5 rounded-full font-bold text-sm border-2 border-white/40 text-white transition-transform hover:scale-105 active:scale-95 hover:bg-white/10">
                Google Play
              </button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
