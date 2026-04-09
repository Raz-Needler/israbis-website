"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import FadeIn from "@/components/FadeIn";

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

/* ── Quick features for homepage ── */
const HIGHLIGHTS = [
  { title: "השוואת מחירים", desc: "33 רשתות. מחיר אחד הכי זול.", color: "#06B6D4", href: "/features" },
  { title: "עגלה חכמה", desc: "בנו עגלה, המערכת מוצאת את הזול.", color: "#34C759", href: "/features" },
  { title: "מתכון מסרטון", desc: "לינק מיוטיוב = מתכון + מחירים.", color: "#9B59B6", href: "/ai" },
  { title: "סריקת מקרר", desc: "צלמו את המקרר, קבלו מתכונים.", color: "#10B981", href: "/ai" },
  { title: "מעקב הוצאות", desc: "תקציב, תובנות, התראות חריגה.", color: "#14B8A6", href: "/features" },
  { title: "קניות משפחתיות", desc: "כל המשפחה. רשימה אחת. בזמן אמת.", color: "#EC4899", href: "/features" },
];

const TOP_STORES = [
  { key: "rami_levy", name: "רמי לוי" },
  { key: "shufersal", name: "שופרסל" },
  { key: "victory", name: "ויקטורי" },
  { key: "tiv_taam", name: "טיב טעם" },
  { key: "machsanei_hashuk", name: "מחסני השוק" },
  { key: "yochananof", name: "יוחננוף" },
];

export default function HomePage() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="sec relative overflow-hidden" style={{ paddingTop: 48 }}>
        {/* Ambient glow */}
        <div className="glow" style={{ width: 500, height: 500, top: -120, right: -180, background: "var(--accent)", opacity: 0.08 }} />
        <div className="glow" style={{ width: 350, height: 350, bottom: 0, left: -120, background: "var(--secondary)", opacity: 0.05, animationDelay: "2.5s" }} />

        <div className="w-980 text-center relative z-10">
          <FadeIn>
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={120} height={48} className="mx-auto mb-5" priority />
          </FadeIn>

          <FadeIn delay={0.06}>
            <h1 style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 16 }}>
              חסכו עד{" "}
              <span className="grad-text">₪1,000 בחודש</span>
              <br />
              על קניות הסופר.
            </h1>
          </FadeIn>

          <FadeIn delay={0.12}>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "var(--text-muted)", maxWidth: "46ch", margin: "0 auto 32px", lineHeight: 1.6 }}>
              השוו מחירים בין 33 רשתות שיווק, בנו עגלה חכמה, גלו מתכונים מדהימים, סרקו קבלות ומוצרים, ועקבו אחרי ההוצאות — הכל באפליקציה אחת.
            </p>
          </FadeIn>

          <FadeIn delay={0.18}>
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
              <Link href="/features" className="btn btn-outline">גלו את התכונות</Link>
            </div>
          </FadeIn>

          {/* Hero SVG */}
          <FadeIn delay={0.24} y={30}>
            <div className="relative inline-block">
              <Image src="/svg/composition_12.svg" alt="IsraBis app" width={420} height={340} className="mx-auto w-full max-w-sm h-auto float" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="sec-sm" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-1120 grid grid-cols-3 text-center gap-4">
          {[
            { n: 33, s: "", l: "רשתות שיווק" },
            { n: 255000, s: "+", l: "מוצרים" },
            { n: 1000, s: "+", l: "מתכונים" },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "var(--text)" }}>
                <Counter target={s.n} suffix={s.s} />
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{s.l}</div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══ HIGHLIGHTS GRID ═══ */}
      <section className="sec">
        <div className="w-980 text-center mb-12">
          <FadeIn>
            <p className="sec-label">תכונות</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.1 }}>
              מה <span className="grad-text">IsraBis</span> עושה בשבילך
            </h2>
          </FadeIn>
        </div>

        <div className="w-1120 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HIGHLIGHTS.map((h, i) => (
            <FadeIn key={h.title} delay={i * 0.05}>
              <Link href={h.href} className="glass-card block p-7 group" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="feat-icon mb-4" style={{ background: h.color + "15" }}>
                  <div className="w-6 h-6 rounded-md" style={{ background: h.color }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{h.title}</h3>
                <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.5 }}>{h.desc}</p>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="text-center mt-8">
            <Link href="/features" style={{ fontSize: 17, fontWeight: 500, color: "var(--accent)", textDecoration: "none" }}>
              כל התכונות &larr;
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ═══ AI PREVIEW ═══ */}
      <section className="sec" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-980 flex flex-col md:flex-row items-center gap-12">
          <FadeIn className="flex-1 order-2 md:order-1">
            <Image src="/svg/composition_3.svg" alt="AI tools" width={360} height={360} className="w-full max-w-xs mx-auto h-auto float" />
          </FadeIn>
          <FadeIn className="flex-1 order-1 md:order-2 text-right" delay={0.1}>
            <p className="sec-label">AI</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.12, marginBottom: 12 }}>
              כלים חכמים
              <br />
              <span style={{ color: "var(--accent)" }}>שעובדים בשבילך.</span>
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 20 }}>
              סריקת מקרר, סריקת קלוריות, מתכון מסרטון, סריקת קבלה — צלמו, הדביקו, וקבלו תוצאות מיידיות.
            </p>
            <Link href="/ai" className="btn btn-accent" style={{ padding: "10px 24px", fontSize: 15 }}>
              גלו את הכלים החכמים
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══ STORES PREVIEW ═══ */}
      <section className="sec">
        <div className="w-980 text-center mb-10">
          <FadeIn>
            <p className="sec-label">רשתות</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 8 }}>
              <span style={{ color: "var(--accent)" }}>33 רשתות.</span> מחיר אחד הכי זול.
            </h2>
          </FadeIn>
          <FadeIn delay={0.05}>
            <div className="mt-6 mb-8">
              <span style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, color: "var(--accent)" }}>
                <Counter target={847} prefix="₪" />
              </span>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>חיסכון ממוצע למשפחה בחודש</p>
            </div>
          </FadeIn>
        </div>

        <div className="w-980 grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {TOP_STORES.map((s, i) => (
            <FadeIn key={s.key} delay={i * 0.04}>
              <div className="store-chip">
                <Image src={`/stores/${s.key}.png`} alt={s.name} width={36} height={36} className="w-8 h-8 object-contain rounded-lg" />
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>{s.name}</span>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.2}>
          <div className="text-center">
            <Link href="/stores" style={{ fontSize: 15, fontWeight: 500, color: "var(--accent)", textDecoration: "none" }}>
              כל 33 הרשתות &larr;
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="sec" style={{ background: "var(--accent)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", marginBottom: 12 }}>
              מוכנים לחסוך?
            </h2>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: "38ch", margin: "0 auto 28px" }}>
              הצטרפו לאלפי ישראלים שכבר חוסכים עם IsraBis. חינם. פשוט. חכם.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="btn btn-white">App Store</button>
              <button className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                Google Play
              </button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
