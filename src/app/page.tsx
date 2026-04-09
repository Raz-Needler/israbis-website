"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { useTheme, type ThemeName, THEMES } from "@/components/ThemeProvider";

/* ── Animated counter ── */
function Counter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 40, damping: 28 });
  const [d, setD] = useState("0");
  useEffect(() => { if (inView) mv.set(target); }, [inView, target, mv]);
  useEffect(() => { const u = sp.on("change", v => setD(Math.round(v).toLocaleString("he-IL"))); return u; }, [sp]);
  return <span ref={ref}>{prefix}{d}{suffix}</span>;
}

/* ── Store data ── */
const STORES = [
  { key: "rami_levy", name: "רמי לוי" },
  { key: "shufersal", name: "שופרסל" },
  { key: "victory", name: "ויקטורי" },
  { key: "tiv_taam", name: "טיב טעם" },
  { key: "machsanei_hashuk", name: "מחסני השוק" },
  { key: "yochananof", name: "יוחננוף" },
  { key: "osher_ad", name: "אושר עד" },
  { key: "hazi_hinam", name: "חצי חינם" },
  { key: "mega", name: "מגה" },
  { key: "yeinot_bitan", name: "יינות ביתן" },
  { key: "stop_market", name: "סטופ מרקט" },
  { key: "good_pharm", name: "גוד פארם" },
];

/* ── Feature sections ── */
const FEATURES = [
  {
    title: "השוואת מחירים",
    headline: "33 רשתות.\nמחיר אחד הכי זול.",
    body: "בדקו את המחיר של כל מוצר בכל הרשתות בישראל. המערכת מחשבת את העגלה המלאה ומוצאת את הרשת הכי זולה עבורכם.",
    svg: "composition_1",
    dark: false,
  },
  {
    title: "עגלה חכמה",
    headline: "בנו עגלה.\nהמערכת חוסכת.",
    body: "הוסיפו מוצרים מהקטגוריות, מהמתכונים, או מסריקת ברקוד. המערכת משווה אוטומטית בין כל הרשתות ומציעה את העגלה הזולה ביותר.",
    svg: "composition_7",
    dark: true,
  },
  {
    title: "מתכונים",
    headline: "מהמתכון לעגלה.\nבלחיצה אחת.",
    body: "מעל 1,000 מתכונים עם רשימת מרכיבים מתומחרת, מצב בישול מונחה צעד-אחר-צעד, וטיימרים חכמים. אהבתם מתכון? הוסיפו את כל המרכיבים לעגלה בלחיצה.",
    svg: "composition_12",
    dark: false,
  },
];

const AI_TOOLS = [
  { title: "סריקת מקרר", body: "צלמו את המקרר — AI מזהה מרכיבים ומציע מתכונים מותאמים. אפס בזבוז.", svg: "composition_3" },
  { title: "סריקת קלוריות", body: "צלמו מנה וקבלו ניתוח תזונתי מלא: קלוריות, חלבון, פחמימות, שומנים.", svg: "composition_5" },
  { title: "מתכון מסרטון", body: "הדביקו לינק מיוטיוב, טיקטוק או אינסטגרם. קבלו מתכון כתוב עם מרכיבים ומחירים.", svg: "composition_8" },
  { title: "סריקת קבלה", body: "צלמו קבלה מהסופר. המערכת מזהה את כל המוצרים ומאפשרת להוסיף אותם לעגלה.", svg: "composition_11" },
];

export default function Home() {
  const { setTheme } = useTheme();

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  HERO                                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ paddingTop: 60 }}>
        <div className="container-980 text-center">
          <FadeIn>
            <p className="caption mb-3" style={{ letterSpacing: "0.03em" }}>IsraBis</p>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="headline-hero mb-4">
              חסכו עד ₪1,000 בחודש
              <br />
              <span style={{ color: "var(--accent)" }}>על קניות הסופר.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="body-elevated max-w-[42ch] mx-auto mb-8">
              השוו מחירים בין 33 רשתות, בנו עגלה חכמה, גלו מתכונים מדהימים, ועקבו אחרי ההוצאות — הכל באפליקציה אחת.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <a href="#download" className="btn-primary">הורידו בחינם</a>
              <a href="#features" className="link link-sm">גלו עוד &larr;</a>
            </div>
          </FadeIn>
          <FadeIn delay={0.2} y={30}>
            <Image src="/svg/composition_12.svg" alt="" width={480} height={380} className="mx-auto w-full max-w-md h-auto" priority />
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  STATS                                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-alt)" }}>
        <div className="container-980 py-8 grid grid-cols-3 text-center gap-4">
          {[
            { n: 33, s: "", l: "רשתות שיווק" },
            { n: 255000, s: "+", l: "מוצרים" },
            { n: 1000, s: "+", l: "מתכונים" },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <div className="headline-sub" style={{ color: "var(--text)" }}>
                <Counter target={s.n} suffix={s.s} />
              </div>
              <div className="caption mt-1">{s.l}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  FEATURES — large alternating sections                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div id="features">
        {FEATURES.map((f, i) => (
          <section
            key={f.title}
            className="section-pad"
            style={{ background: f.dark ? "var(--bg-alt)" : "var(--bg)" }}
          >
            <div className="container-980 text-center">
              <FadeIn>
                <p className="caption mb-2" style={{ letterSpacing: "0.03em", color: "var(--accent)" }}>{f.title}</p>
              </FadeIn>
              <FadeIn delay={0.05}>
                <h2 className="headline-section mb-4 whitespace-pre-line">{f.headline}</h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="body-elevated max-w-[50ch] mx-auto mb-10">{f.body}</p>
              </FadeIn>
              <FadeIn delay={0.15} y={30}>
                <Image
                  src={`/svg/${f.svg}.svg`}
                  alt={f.title}
                  width={500} height={400}
                  className="mx-auto w-full max-w-[420px] h-auto"
                />
              </FadeIn>
            </div>
          </section>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  AI TOOLS                                                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="ai-tools" className="section-pad" style={{ background: "var(--bg-alt)" }}>
        <div className="container-980 text-center mb-12">
          <FadeIn>
            <p className="caption mb-2" style={{ letterSpacing: "0.03em", color: "var(--accent)" }}>AI</p>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="headline-section mb-3">כלים חכמים.</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="body-elevated">צלמו, סרקו, הדביקו — והמערכת עושה את השאר.</p>
          </FadeIn>
        </div>

        <div className="container-1200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AI_TOOLS.map((t, i) => (
            <FadeIn key={t.title} delay={i * 0.06}>
              <div
                className="rounded-[18px] p-8 sm:p-10 flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-1"
                style={{ background: "var(--bg)", border: "none" }}
              >
                <Image src={`/svg/${t.svg}.svg`} alt={t.title} width={140} height={140} className="mb-6" />
                <h3 className="headline-sub mb-2">{t.title}</h3>
                <p className="body-elevated text-center">{t.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  33 STORES                                                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="stores" className="section-pad">
        <div className="container-980 text-center mb-10">
          <FadeIn>
            <p className="caption mb-2" style={{ letterSpacing: "0.03em", color: "var(--accent)" }}>רשתות</p>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h2 className="headline-section mb-3">כל הרשתות בישראל.</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mt-4">
              <span className="headline-hero" style={{ color: "var(--accent)" }}>
                <Counter target={847} prefix="₪" />
              </span>
              <p className="caption mt-2">חיסכון ממוצע למשפחה בחודש</p>
            </div>
          </FadeIn>
        </div>

        <div className="container-1200">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {STORES.map((s, i) => (
              <FadeIn key={s.key} delay={i * 0.03}>
                <div className="flex flex-col items-center gap-2 py-4 px-2 rounded-[14px] transition-transform duration-200 hover:-translate-y-0.5" style={{ background: "var(--bg-alt)" }}>
                  <Image src={`/stores/${s.key}.png`} alt={s.name} width={40} height={40} className="w-9 h-9 object-contain rounded-lg" />
                  <span style={{ fontSize: 12, color: "var(--text-sub)", fontWeight: 500 }}>{s.name}</span>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <p className="text-center caption mt-5">
              ועוד 21 רשתות נוספות
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  MORE FEATURES                                             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: "var(--bg-alt)" }}>
        <div className="container-980 text-center mb-10">
          <FadeIn>
            <h2 className="headline-section mb-3">ועוד הרבה יותר.</h2>
          </FadeIn>
        </div>
        <div className="container-980 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {[
            { t: "מעקב הוצאות", d: "הגדירו תקציב חודשי, עקבו אחרי הוצאות לפי קטגוריה, וקבלו התראות חריגה." },
            { t: "קניות משפחתיות", d: "רשימה משותפת, קניות חיות בזמן אמת, דשבורד הוצאות משפחתי." },
            { t: "מעקב מזון", d: "הוסיפו מוצרים למזווה, עקבו אחרי תאריכי תפוגה, קבלו התראות." },
            { t: "סריקת ברקוד", d: "סרקו מוצר בסופר וראו מיד את המחיר ב-33 רשתות." },
            { t: "ספר מתכונים", d: "שמרו מתכונים, צרו ספרים, שתפו עם חברים ומשפחה." },
            { t: "עוזר AI — מיקי", d: "שאלו כל שאלה על מתכונים, מרכיבים, תחליפים ובישול." },
          ].map((item, i) => (
            <FadeIn key={item.t} delay={i * 0.05}>
              <div className="text-right">
                <h3 style={{ fontSize: 19, fontWeight: 600, marginBottom: 4 }}>{item.t}</h3>
                <p className="body-elevated">{item.d}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  THEMES                                                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="themes" className="section-pad">
        <div className="container-980 text-center mb-10">
          <FadeIn>
            <h2 className="headline-section">
              ארבע ערכות נושא.
              <br />
              <span style={{ color: "var(--accent)" }}>הסגנון שלכם.</span>
            </h2>
          </FadeIn>
        </div>
        <div className="container-980 grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.keys(THEMES) as ThemeName[]).map((k, i) => {
            const t = THEMES[k];
            return (
              <FadeIn key={k} delay={i * 0.06}>
                <button
                  onClick={() => setTheme(k)}
                  className="w-full rounded-[18px] overflow-hidden transition-transform duration-200 hover:-translate-y-1 active:scale-[0.98] text-start"
                  style={{ background: t.bg, border: `1.5px solid ${t.accent}25` }}
                >
                  <div className="p-5">
                    <div className="space-y-2 mb-4">
                      <div className="h-5 rounded-lg" style={{ background: t.accent + "18" }} />
                      <div className="h-2.5 w-3/4 rounded" style={{ background: t.accent + "0D" }} />
                      <div className="flex gap-2">
                        <div className="flex-1 h-8 rounded-lg" style={{ background: t.accent + "0D" }} />
                        <div className="flex-1 h-8 rounded-lg" style={{ background: t.accent + "0D" }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-4 h-4 rounded-full" style={{ background: t.accent }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: t.accent }}>{t.label}</span>
                    </div>
                  </div>
                </button>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  DOWNLOAD CTA                                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="download" className="section-pad" style={{ background: "var(--accent)" }}>
        <div className="container-980 text-center">
          <FadeIn>
            <h2 className="headline-section text-white mb-4">מוכנים לחסוך?</h2>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p style={{ fontSize: 19, color: "rgba(255,255,255,0.8)", maxWidth: "36ch", margin: "0 auto 32px" }}>
              הצטרפו לאלפי ישראלים שכבר חוסכים עם IsraBis.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="btn-primary" style={{ background: "#fff", color: "var(--accent)" }}>
                App Store
              </button>
              <button className="btn-secondary" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}>
                Google Play
              </button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
