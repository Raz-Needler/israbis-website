"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import SectionHeader from "@/components/SectionHeader";
import HowItWorks from "@/components/HowItWorks";

function Counter({ target, prefix = "" }: { target: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 40, damping: 28 });
  const [d, setD] = useState("0");
  useEffect(() => { if (inView) mv.set(target); }, [inView, target, mv]);
  useEffect(() => { const u = sp.on("change", v => setD(Math.round(v).toLocaleString("he-IL"))); return u; }, [sp]);
  return <span ref={ref}>{prefix}{d}</span>;
}

const ALL_STORES = [
  { key: "rami_levy", name: "רמי לוי", color: "#5B8C5A" },
  { key: "shufersal", name: "שופרסל", color: "#D4A254" },
  { key: "victory", name: "ויקטורי", color: "#FF6B00" },
  { key: "tiv_taam", name: "טיב טעם", color: "#8B0000" },
  { key: "machsanei_hashuk", name: "מחסני השוק", color: "#2E8B57" },
  { key: "yochananof", name: "יוחננוף", color: "#7B8FA1" },
  { key: "osher_ad", name: "אושר עד", color: "#E85D04" },
  { key: "yeinot_bitan", name: "יינות ביתן", color: "#8B2252" },
  { key: "hazi_hinam", name: "חצי חינם", color: "#FF1493" },
  { key: "mega", name: "מגה", color: "#2196F3" },
  { key: "stop_market", name: "סטופ מרקט", color: "#F44336" },
  { key: "king_store", name: "קינג סטור", color: "#9C27B0" },
  { key: "good_pharm", name: "גוד פארם", color: "#4DB6AC" },
  { key: "super_pharm", name: "סופר-פארם", color: "#00BCD4" },
  { key: "bareket", name: "ברקת", color: "#795548" },
  { key: "keshet", name: "קשת", color: "#E91E63" },
  { key: "het_cohen", name: "ח. כהן", color: "#8D6E63" },
  { key: "cofix", name: "קופיקס", color: "#3F51B5" },
  { key: "super_sapir", name: "סופר ספיר", color: "#42A5F5" },
  { key: "quik", name: "קוויק", color: "#66BB6A" },
  { key: "maayan_2000", name: "מעיין 2000", color: "#5C6BC0" },
  { key: "shefa_birkat", name: "שפע ברכת", color: "#7E57C2" },
  { key: "shuk_hair", name: "שוק העיר", color: "#EF5350" },
  { key: "fresh_market", name: "פרש מרקט", color: "#26C6DA" },
];

export default function StoresContent() {
  return (
    <>
      {/* Header */}
      <section className="sec" style={{ paddingBottom: "var(--space-6)", background: "var(--bg-secondary)" }}>
        <div className="w-980 text-center">
          <SectionHeader
            label="רשתות"
            title={<>כל <span className="c-accent">33 הרשתות</span> במקום אחד.</>}
            subtitle="IsraBis סורקת מחירים מכל רשתות השיווק בישראל מדי יום, ישירות ממאגר המחירים הממשלתי לפי חוק שקיפות מחירי מזון 2014."
          />
        </div>
      </section>

      {/* Savings counter */}
      <section className="sec-sm" style={{ background: "var(--bg)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <span className="text-display" style={{ fontWeight: 900, color: "var(--accent)" }}>
              <Counter target={847} prefix="₪" />
            </span>
            <p className="text-body-sm c-muted" style={{ marginTop: "var(--space-1)" }}>חיסכון ממוצע למשפחה בחודש</p>
          </FadeIn>
        </div>
      </section>

      {/* All stores grid */}
      <section className="sec" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-1120">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {ALL_STORES.map((s, i) => (
              <FadeIn key={s.key} delay={i * 0.02}>
                <div className="store-chip" style={{ borderColor: s.color + "25", padding: "var(--space-5) var(--space-3)" }}>
                  <Image src={`/stores/${s.key}.png`} alt={s.name} width={44} height={44} className="w-10 h-10 object-contain rounded-xl" />
                  <span className="text-caption" style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{s.name}</span>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <p className="text-center text-caption c-muted" style={{ marginTop: "var(--space-8)" }}>
              ועוד 9 רשתות נוספות. המחירים מתעדכנים מדי יום.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* CTA */}
      <section className="sec" style={{ background: "var(--accent)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <h2 className="text-h1" style={{ color: "#fff", marginBottom: "var(--space-4)" }}>
              התחילו לחסוך היום
            </h2>
            <Link href="/download" className="btn btn-white">הורידו בחינם</Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
