"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, ShoppingCart, ChefHat, ScanLine, Refrigerator, Wallet, Users, Cpu, BarChart3, Camera, Receipt, Bot } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import SectionHeader from "@/components/SectionHeader";
import PhoneMockup from "@/components/PhoneMockup";
import SocialProof from "@/components/SocialProof";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import TypeWriter from "@/components/TypeWriter";

/* ── Counter ── */
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

/* ── Hero typewriter lines ── */
const HERO_LINES = [
  "השוואת מחירים בין 33 רשתות",
  "מתכון מסרטון ביוטיוב בלחיצה",
  "סריקת מקרר וקבלת מתכונים",
  "עגלת קניות חכמה שחוסכת לכם",
  "מעקב הוצאות ותקציב משפחתי",
  "60,000+ מתכונים עם מחירים",
  "סריקת קלוריות מתמונה",
  "קניות משפחתיות בזמן אמת",
];

/* ── AI typewriter lines ── */
const AI_LINES = [
  "צלמו את המקרר — קבלו מתכונים",
  "צלמו צלחת — קבלו ערכים תזונתיים",
  "הדביקו לינק — קבלו מתכון + מחירים",
  "צלמו קבלה — הכל בעגלה",
  "שאלו את ישרא שף — כל שאלה",
];

/* ── Feature data ── */
const FEATURES = [
  { title: "השוואת מחירים", desc: "33 רשתות. 255,000+ מוצרים. מחיר אחד הכי זול — מיד.", icon: BarChart3, color: "#06B6D4", href: "/features" },
  { title: "עגלה חכמה", desc: "בנו עגלה מכל מקור. המערכת מוצאת את הרשת הזולה אוטומטית.", icon: ShoppingCart, color: "#34C759", href: "/features" },
  { title: "מתכון מסרטון", desc: "לינק מיוטיוב, טיקטוק, אינסטגרם = מתכון כתוב + רשימת קניות + מחירים.", icon: Camera, color: "#9B59B6", href: "/ai" },
  { title: "סריקת מקרר", desc: "צלמו את המקרר. AI מזהה מרכיבים ומציע מתכונים ממה שיש.", icon: Refrigerator, color: "#10B981", href: "/ai" },
  { title: "מעקב הוצאות", desc: "תקציב חודשי, פירוט לפי קטגוריה, התראות חריגה, תובנות חכמות.", icon: Wallet, color: "#14B8A6", href: "/features" },
  { title: "קניות משפחתיות", desc: "רשימה משותפת בזמן אמת. כל המשפחה רואה מה נוסף ומה נמחק.", icon: Users, color: "#EC4899", href: "/features" },
];

const TOP_STORES = [
  { key: "rami_levy", name: "רמי לוי" }, { key: "shufersal", name: "שופרסל" },
  { key: "victory", name: "ויקטורי" }, { key: "tiv_taam", name: "טיב טעם" },
  { key: "machsanei_hashuk", name: "מחסני השוק" }, { key: "yochananof", name: "יוחננוף" },
];

export default function HomePage() {
  return (
    <>
      {/* ═══ 1. HERO ═══ */}
      <section className="sec-lg relative overflow-hidden hero-mesh">
        <div className="glow" style={{ width: 600, height: 600, top: -200, right: -200, background: "var(--accent)", opacity: 0.1 }} />
        <div className="glow" style={{ width: 400, height: 400, bottom: -100, left: -150, background: "var(--secondary)", opacity: 0.06, animationDelay: "2.5s" }} />

        <div className="w-1120 flex flex-col md:flex-row items-center relative z-10" style={{ gap: "var(--space-9)" }}>
          {/* Text */}
          <div className="flex-1 text-center md:text-right">
            <FadeIn>
              <div className="badge" style={{ marginBottom: "var(--space-5)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--accent)"><circle cx="12" cy="12" r="5"/></svg>
                מבוסס על מאגר המחירים הממשלתי
              </div>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h1 className="text-display" style={{ marginBottom: "var(--space-5)" }}>
                האפליקציה שחוסכת
                <br />
                <span className="grad-text">לכם כסף אמיתי.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div style={{ minHeight: "2.2em", marginBottom: "var(--space-5)" }}>
                <TypeWriter
                  lines={HERO_LINES}
                  className="text-h3 c-accent"
                  typingSpeed={45}
                  deletingSpeed={25}
                  pauseDuration={2000}
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.14}>
              <p className="text-body c-muted" style={{ maxWidth: "48ch", margin: "0 auto var(--space-7)", lineHeight: "var(--leading-relaxed)" }}>
                IsraBis משווה מחירים בין 33 רשתות שיווק בישראל, מוצאת את העגלה הזולה ביותר, מציעה 60,000+ מתכונים עם מחירים, וכוללת כלי AI חכמים — הכל בעברית, הכל בחינם.
              </p>
            </FadeIn>
            <FadeIn delay={0.18}>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link href="/download" className="btn btn-accent btn-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  הורידו בחינם
                </Link>
                <Link href="/features" className="btn btn-outline btn-lg">גלו את התכונות</Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.22}>
              <p className="text-caption c-dimmer" style={{ marginTop: "var(--space-4)" }}>
                iOS + Android &middot; עברית מלאה &middot; בלי פרסומות &middot; בלי מעקב
              </p>
            </FadeIn>
          </div>

          {/* Phone mockup */}
          <FadeIn className="flex-shrink-0 mt-8 md:mt-0" delay={0.15} y={30}>
            <PhoneMockup />
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. SOCIAL PROOF ═══ */}
      <SocialProof />

      {/* ═══ 3. STATS ═══ */}
      <section style={{ borderTop: "1px solid var(--glass-border)", borderBottom: "1px solid var(--glass-border)", padding: "var(--space-7) 0" }}>
        <div className="w-1120 grid grid-cols-3 text-center" style={{ gap: "var(--space-4)" }}>
          {[
            { n: 33, s: "", l: "רשתות שיווק", sub: "עדכון יומי" },
            { n: 255000, s: "+", l: "מוצרים", sub: "מכל הרשתות" },
            { n: 60000, s: "+", l: "מתכונים", sub: "עם השוואת מחירים" },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="stat-number"><Counter target={s.n} suffix={s.s} /></div>
              <div className="text-body-sm" style={{ fontWeight: 600, marginTop: "var(--space-1)" }}>{s.l}</div>
              <div className="text-caption c-dimmer" style={{ marginTop: 2 }}>{s.sub}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══ 4. HOW IT WORKS ═══ */}
      <HowItWorks />

      {/* ═══ 5. FEATURES GRID ═══ */}
      <section className="sec" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-980">
          <SectionHeader
            label="תכונות"
            title={<>כל מה שצריך.<br /><span className="grad-text">באפליקציה אחת.</span></>}
            subtitle="IsraBis היא לא רק השוואת מחירים. היא מערכת שלמה לניהול קניות, בישול, ותקציב משפחתי."
          />
        </div>

        <div className="w-1120 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "var(--space-5)" }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.title} delay={i * 0.05}>
                <Link href={f.href} className="glass-card-premium block group" style={{ padding: "var(--space-7)", textDecoration: "none", color: "inherit", height: "100%" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "var(--radius-lg)",
                    background: `linear-gradient(135deg, ${f.color}20, ${f.color}08)`,
                    border: `1px solid ${f.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "var(--space-4)",
                  }}>
                    <Icon size={24} color={f.color} strokeWidth={2} />
                  </div>
                  <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>{f.title}</h3>
                  <p className="text-body-sm c-muted" style={{ marginBottom: "var(--space-5)", lineHeight: "var(--leading-relaxed)" }}>{f.desc}</p>
                  <span className="card-cta">
                    למידע נוסף <ArrowLeft size={14} />
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.3}>
          <div className="text-center" style={{ marginTop: "var(--space-8)" }}>
            <Link href="/features" className="btn btn-outline">
              כל 7 התכונות <ArrowLeft size={14} />
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ═══ 6. AI SECTION — with typewriter ═══ */}
      <section className="sec relative overflow-hidden">
        <div className="glow" style={{ width: 400, height: 400, top: "10%", left: -100, background: "var(--accent)", opacity: 0.06 }} />
        <div className="w-1120">
          <div className="text-center" style={{ marginBottom: "var(--space-10)" }}>
            <FadeIn>
              <div className="badge" style={{ marginBottom: "var(--space-4)" }}>
                <Cpu size={12} />
                בינה מלאכותית מתקדמת
              </div>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h2 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
                כלים חכמים ש<span className="c-accent">עושים את העבודה.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div style={{ minHeight: "1.8em" }}>
                <TypeWriter
                  lines={AI_LINES}
                  className="text-h3 c-muted"
                  typingSpeed={40}
                  deletingSpeed={20}
                  pauseDuration={1800}
                />
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5" style={{ gap: "var(--space-4)" }}>
            {[
              { icon: Refrigerator, title: "סריקת מקרר", desc: "צלמו, קבלו מתכונים ממה שיש", color: "#10B981" },
              { icon: Camera, title: "סריקת קלוריות", desc: "צלמו מנה, קבלו ערכים תזונתיים", color: "#06B6D4" },
              { icon: ScanLine, title: "מתכון מסרטון", desc: "לינק = מתכון + רשימת קניות", color: "#9B59B6" },
              { icon: Receipt, title: "סריקת קבלה", desc: "קבלה מהסופר = פריטים בעגלה", color: "#E8773A" },
              { icon: Bot, title: "ישרא שף", desc: "עוזר AI שעונה על כל שאלה", color: "#EC4899" },
            ].map((tool, i) => {
              const Icon = tool.icon;
              return (
                <FadeIn key={tool.title} delay={i * 0.06}>
                  <Link href="/ai" className="gradient-border block text-center group" style={{ padding: "var(--space-6) var(--space-4)", textDecoration: "none", color: "inherit", height: "100%" }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "var(--radius-pill)",
                      background: `${tool.color}15`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto var(--space-3)",
                      transition: "transform 0.3s ease",
                    }}>
                      <Icon size={22} color={tool.color} strokeWidth={2} />
                    </div>
                    <h3 className="text-h4" style={{ marginBottom: "var(--space-1)" }}>{tool.title}</h3>
                    <p className="text-caption c-muted">{tool.desc}</p>
                  </Link>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.3}>
            <div className="text-center" style={{ marginTop: "var(--space-8)" }}>
              <Link href="/ai" className="btn btn-accent">
                <Cpu size={16} />
                גלו את כל הכלים החכמים
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 7. STORES PREVIEW ═══ */}
      <section className="sec" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-980">
          <SectionHeader
            label="רשתות"
            title={<><span className="c-accent">33 רשתות.</span> מחיר אחד הכי זול.</>}
          />

          <FadeIn>
            <div className="text-center" style={{ marginTop: "calc(-1 * var(--space-4))", marginBottom: "var(--space-3)" }}>
              <p className="text-body c-muted" style={{ maxWidth: "52ch", margin: "0 auto", lineHeight: "var(--leading-relaxed)" }}>
                הפרש של <strong style={{ color: "var(--accent)" }}>21%</strong> על סל של 50 מוצרים בסיסיים בין הרשתות הזולות ליקרות.
                <br />
                <span className="text-caption c-dimmer">לפי סקר Anglo-List ונתוני חוק שקיפות מחירי מזון</span>
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6" style={{ gap: "var(--space-3)", marginTop: "var(--space-6)", marginBottom: "var(--space-5)" }}>
            {TOP_STORES.map((s, i) => (
              <FadeIn key={s.key} delay={i * 0.04}>
                <div className="store-chip">
                  <Image src={`/stores/${s.key}.png`} alt={s.name} width={36} height={36} className="rounded-lg" style={{ width: 32, height: 32, objectFit: "contain" }} />
                  <span className="text-caption" style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{s.name}</span>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center">
              <Link href="/stores" className="text-body-sm c-accent link-underline" style={{ fontWeight: 500 }}>
                כל 33 הרשתות <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "middle" }} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 8. COMPETITOR COMPARISON ═══ */}
      <section className="sec">
        <div className="w-980">
          <SectionHeader
            label="למה IsraBis?"
            title={<>מה שאחרים <span className="grad-text">לא נותנים לכם.</span></>}
            subtitle="שום אפליקציה אחרת בישראל לא משלבת השוואת מחירים, מתכונים, AI, וניהול משפחתי — במקום אחד."
          />

          <FadeIn>
            <div className="overflow-x-auto" style={{ marginTop: "var(--space-2)" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 var(--space-2)", textAlign: "center" }}>
                <thead>
                  <tr>
                    <th className="text-body-sm" style={{ textAlign: "right", padding: "var(--space-3) var(--space-4)", fontWeight: 600 }}>תכונה</th>
                    <th className="text-body-sm" style={{ padding: "var(--space-3) var(--space-2)", fontWeight: 800, color: "var(--accent)" }}>IsraBis</th>
                    <th className="text-body-sm c-muted" style={{ padding: "var(--space-3) var(--space-2)", fontWeight: 500 }}>Pricez</th>
                    <th className="text-body-sm c-muted" style={{ padding: "var(--space-3) var(--space-2)", fontWeight: 500 }}>MySupermarket</th>
                    <th className="text-body-sm c-muted" style={{ padding: "var(--space-3) var(--space-2)", fontWeight: 500 }}>אפליקציות רשתות</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feat: "השוואת מחירים בין רשתות", us: true, p: true, m: true, c: false },
                    { feat: "33 רשתות שיווק", us: true, p: false, m: false, c: false },
                    { feat: "60,000+ מתכונים", us: true, p: false, m: false, c: false },
                    { feat: "מתכון מסרטון (AI)", us: true, p: false, m: false, c: false },
                    { feat: "סריקת מקרר (AI)", us: true, p: false, m: false, c: false },
                    { feat: "סריקת קלוריות (AI)", us: true, p: false, m: false, c: false },
                    { feat: "מצב בישול מונחה", us: true, p: false, m: false, c: false },
                    { feat: "קניות משפחתיות בזמן אמת", us: true, p: false, m: false, c: false },
                    { feat: "מעקב הוצאות ותקציב", us: true, p: false, m: false, c: false },
                    { feat: "סריקת ברקוד", us: true, p: true, m: false, c: true },
                    { feat: "עברית מלאה + RTL", us: true, p: true, m: true, c: true },
                  ].map((row, i) => (
                    <tr key={i} className={i < 9 ? "compare-row-winner" : ""} style={i >= 9 ? { background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)" } : {}}>
                      <td className="text-body-sm" style={{ textAlign: "right", padding: "var(--space-3) var(--space-4)", fontWeight: 500, borderRadius: "0 var(--radius-lg) var(--radius-lg) 0" }}>{row.feat}</td>
                      <td style={{ padding: "var(--space-3) var(--space-2)" }}>
                        {row.us
                          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dimmer)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        }
                      </td>
                      <td style={{ padding: "var(--space-3) var(--space-2)" }}>
                        {row.p
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dimmer)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        }
                      </td>
                      <td style={{ padding: "var(--space-3) var(--space-2)" }}>
                        {row.m
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dimmer)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        }
                      </td>
                      <td style={{ padding: "var(--space-3) var(--space-2)", borderRadius: "var(--radius-lg) 0 0 var(--radius-lg)" }}>
                        {row.c
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dimmer)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9. APP SCREENSHOTS ═══ */}
      <section className="sec" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-1120">
          <SectionHeader
            label="צפו באפליקציה"
            title="ראו את IsraBis בפעולה"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5" style={{ gap: "var(--space-4)" }}>
            {[
              { src: "/images/Home_SCreen.jpg", label: "מסך הבית" },
              { src: "/images/Build_Cart.jpg", label: "בניית עגלה" },
              { src: "/images/Recipe_Screen.jpg", label: "מתכונים" },
              { src: "/images/Start_Cooking.jpg", label: "מצב בישול" },
              { src: "/images/Add_Recipe.jpg", label: "הוספת מתכון" },
            ].map((img, i) => (
              <FadeIn key={img.src} delay={i * 0.06}>
                <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-lg)", transition: "transform 0.3s ease, box-shadow 0.3s ease", border: "1px solid var(--glass-border)" }} className="hover:-translate-y-2 hover:shadow-xl">
                  <Image src={img.src} alt={img.label} width={260} height={563} style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
                <p className="text-caption c-muted text-center" style={{ marginTop: "var(--space-2)", fontWeight: 500 }}>{img.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 10. ABOUT ═══ */}
      <About />

      {/* ═══ 11. TESTIMONIALS ═══ */}
      <Testimonials />

      {/* ═══ 12. FAQ ═══ */}
      <FAQ />

      {/* ═══ 13. CTA ═══ */}
      <section className="sec relative overflow-hidden" style={{ background: "var(--accent)" }}>
        <div className="absolute top-[10%] right-[5%] w-36 h-36 opacity-10 float hidden md:block">
          <Image src="/svg/composition_12.svg" alt="" width={144} height={144} />
        </div>
        <div className="absolute bottom-[15%] left-[8%] w-24 h-24 opacity-10 float hidden md:block" style={{ animationDelay: "2s" }}>
          <Image src="/svg/composition_7.svg" alt="" width={96} height={96} />
        </div>
        <div className="w-980 text-center relative z-10">
          <FadeIn>
            <h2 className="text-h1" style={{ color: "#fff", marginBottom: "var(--space-3)" }}>מוכנים לחסוך?</h2>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p className="text-body" style={{ color: "rgba(255,255,255,0.85)", maxWidth: "42ch", margin: "0 auto var(--space-7)" }}>
              הורידו את IsraBis וגלו כמה אתם יכולים לחסוך. חינם. פשוט. חכם.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://apps.apple.com/app/israbi/id0000000000" target="_blank" rel="noopener noreferrer" className="btn btn-white btn-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                App Store
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.israbi.app" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm.91-.91L19.59 12 17.72 9.79l-2.27 2.27 2.27 2.15zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z"/></svg>
                Google Play
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
