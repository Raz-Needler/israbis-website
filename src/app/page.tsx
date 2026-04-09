"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import SectionHeader from "@/components/SectionHeader";
import PhoneMockup from "@/components/PhoneMockup";
import SocialProof from "@/components/SocialProof";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";

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

/* ── Data ── */
const HIGHLIGHTS = [
  { title: "השוואת מחירים", desc: "33 רשתות. מחיר אחד הכי זול.", color: "#06B6D4", href: "/features" },
  { title: "עגלה חכמה", desc: "בנו עגלה, המערכת מוצאת את הזול.", color: "#34C759", href: "/features" },
  { title: "מתכון מסרטון", desc: "לינק מיוטיוב = מתכון + מחירים.", color: "#9B59B6", href: "/ai" },
  { title: "סריקת מקרר", desc: "צלמו את המקרר, קבלו מתכונים.", color: "#10B981", href: "/ai" },
  { title: "מעקב הוצאות", desc: "תקציב, תובנות, התראות חריגה.", color: "#14B8A6", href: "/features" },
  { title: "קניות משפחתיות", desc: "כל המשפחה. רשימה אחת. בזמן אמת.", color: "#EC4899", href: "/features" },
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
      <section className="sec-lg relative overflow-hidden">
        <div className="glow" style={{ width: 500, height: 500, top: -120, right: -180, background: "var(--accent)", opacity: 0.08 }} />
        <div className="glow" style={{ width: 350, height: 350, bottom: 0, left: -120, background: "var(--secondary)", opacity: 0.05, animationDelay: "2.5s" }} />

        <div className="w-980 flex flex-col md:flex-row items-center relative z-10" style={{ gap: "var(--space-9)" }}>
          {/* Text */}
          <div className="flex-1 text-center md:text-right">
            <FadeIn>
              <Image src="/images/israbis-logo.png" alt="IsraBis" width={110} height={44} className="mx-auto md:mx-0 md:mr-0" style={{ marginBottom: "var(--space-5)" }} priority />
            </FadeIn>
            <FadeIn delay={0.06}>
              <h1 className="text-display" style={{ marginBottom: "var(--space-4)" }}>
                חסכו עד <span className="grad-text">₪1,000 בחודש</span>
                <br />על קניות הסופר.
              </h1>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="text-body c-muted" style={{ maxWidth: "46ch", margin: "0 auto var(--space-7)", lineHeight: "var(--leading-relaxed)" }}>
                השוו מחירים בין 33 רשתות שיווק, בנו עגלה חכמה, גלו מתכונים, סרקו מוצרים, ועקבו אחרי ההוצאות — הכל באפליקציה אחת.
              </p>
            </FadeIn>
            <FadeIn delay={0.18}>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
                <Link href="/features" className="btn btn-outline">גלו את התכונות</Link>
              </div>
            </FadeIn>
          </div>

          {/* Phone mockup */}
          <FadeIn className="flex-shrink-0 mt-8 md:mt-0" delay={0.2} y={30}>
            <PhoneMockup />
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. SOCIAL PROOF ═══ */}
      <SocialProof />

      {/* ═══ 3. STATS ═══ */}
      <section style={{ borderTop: "1px solid var(--glass-border)", borderBottom: "1px solid var(--glass-border)", padding: "var(--space-6) 0" }}>
        <div className="w-1120 grid grid-cols-3 text-center" style={{ gap: "var(--space-4)" }}>
          {[
            { n: 33, s: "", l: "רשתות שיווק" },
            { n: 255000, s: "+", l: "מוצרים" },
            { n: 90, s: "+", l: "מתכונים" },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="text-h1" style={{ fontWeight: 900 }}><Counter target={s.n} suffix={s.s} /></div>
              <div className="text-caption c-muted" style={{ marginTop: "var(--space-1)" }}>{s.l}</div>
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
            title={<>מה <span className="grad-text">IsraBis</span> עושה בשבילך</>}
          />
        </div>

        <div className="w-1120 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "var(--space-4)" }}>
          {HIGHLIGHTS.map((h, i) => (
            <FadeIn key={h.title} delay={i * 0.05}>
              <Link href={h.href} className="glass-card block group" style={{ padding: "var(--space-6) var(--space-7)", textDecoration: "none", color: "inherit" }}>
                <div className="feat-icon" style={{ background: h.color + "15", marginBottom: "var(--space-4)" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "var(--radius-sm)", background: h.color }} />
                </div>
                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>{h.title}</h3>
                <p className="text-body-sm c-muted" style={{ marginBottom: "var(--space-4)" }}>{h.desc}</p>
                <span className="card-cta">
                  למידע נוסף <ArrowLeft size={14} />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="text-center" style={{ marginTop: "var(--space-7)" }}>
            <Link href="/features" className="text-body c-accent" style={{ fontWeight: 500, textDecoration: "none" }}>
              כל התכונות <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "middle" }} />
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ═══ 6. AI PREVIEW ═══ */}
      <section className="sec">
        <div className="w-980 flex flex-col md:flex-row items-center" style={{ gap: "var(--space-9)" }}>
          <FadeIn className="flex-1 order-2 md:order-1">
            <Image src="/svg/composition_3.svg" alt="AI tools" width={320} height={320} className="w-full max-w-[280px] mx-auto h-auto float" />
          </FadeIn>
          <FadeIn className="flex-1 order-1 md:order-2" delay={0.1}>
            <SectionHeader
              label="AI"
              title={<>כלים חכמים <span className="c-accent">שעובדים בשבילך.</span></>}
              subtitle="סריקת מקרר, סריקת קלוריות, מתכון מסרטון, סריקת קבלה — צלמו, הדביקו, וקבלו תוצאות מיידיות."
              align="right"
            />
            <Link href="/ai" className="btn btn-accent">גלו את הכלים החכמים</Link>
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
            <div className="text-center" style={{ marginTop: "calc(-1 * var(--space-4))", marginBottom: "var(--space-8)" }}>
              <span className="text-display" style={{ fontWeight: 900, color: "var(--accent)" }}>
                <Counter target={847} prefix="₪" />
              </span>
              <p className="text-caption c-muted" style={{ marginTop: "var(--space-1)" }}>חיסכון ממוצע למשפחה בחודש</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6" style={{ gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
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
              <Link href="/stores" className="text-body-sm c-accent" style={{ fontWeight: 500, textDecoration: "none" }}>
                כל 33 הרשתות <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "middle" }} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 8. FAQ ═══ */}
      <FAQ />

      {/* ═══ 9. CTA ═══ */}
      <section className="sec relative overflow-hidden" style={{ background: "var(--accent)" }}>
        <div className="absolute top-[10%] right-[5%] w-36 h-36 opacity-10 float hidden md:block">
          <Image src="/svg/composition_12.svg" alt="" width={144} height={144} />
        </div>
        <div className="w-980 text-center relative z-10">
          <FadeIn>
            <h2 className="text-h1" style={{ color: "#fff", marginBottom: "var(--space-3)" }}>מוכנים לחסוך?</h2>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p className="text-body" style={{ color: "rgba(255,255,255,0.8)", maxWidth: "38ch", margin: "0 auto var(--space-7)" }}>
              הצטרפו לאלפי ישראלים שכבר חוסכים עם IsraBis. חינם. פשוט. חכם.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/download" className="btn btn-white">App Store</Link>
              <button className="btn btn-ghost">Google Play</button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
