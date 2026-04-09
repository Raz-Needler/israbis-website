"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import FadeIn from "@/components/FadeIn";

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
      <section className="sec" style={{ paddingBottom: 24, background: "var(--bg-secondary)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <p className="sec-label">רשתות</p>
            <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.08 }}>
              כל <span style={{ color: "var(--accent)" }}>33 הרשתות</span>
              <br />במקום אחד.
            </h1>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "var(--text-muted)", maxWidth: "48ch", margin: "12px auto 0" }}>
              IsraBis סורקת מחירים מכל רשתות השיווק בישראל מדי יום, ישירות ממאגר המחירים הממשלתי לפי חוק שקיפות מחירי מזון 2014.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Savings counter */}
      <section className="sec-sm" style={{ background: "var(--bg)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <span style={{ fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 900, color: "var(--accent)" }}>
              <Counter target={847} prefix="₪" />
            </span>
            <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 4 }}>חיסכון ממוצע למשפחה בחודש</p>
          </FadeIn>
        </div>
      </section>

      {/* All stores grid */}
      <section className="sec" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-1120">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ALL_STORES.map((s, i) => (
              <FadeIn key={s.key} delay={i * 0.02}>
                <div className="store-chip" style={{ borderColor: s.color + "25" }}>
                  <Image src={`/stores/${s.key}.png`} alt={s.name} width={44} height={44} className="w-10 h-10 object-contain rounded-xl" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>{s.name}</span>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <p className="text-center mt-8" style={{ fontSize: 14, color: "var(--text-muted)" }}>
              ועוד 9 רשתות נוספות. המחירים מתעדכנים מדי יום.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section className="sec">
        <div className="w-980 text-center mb-10">
          <FadeIn>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800 }}>איך זה עובד?</h2>
          </FadeIn>
        </div>
        <div className="w-980 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { num: "1", title: "בנו עגלה", desc: "הוסיפו מוצרים מהקטגוריות, סרקו ברקוד, או הוסיפו ממתכון." },
            { num: "2", title: "השוו מחירים", desc: "המערכת מחשבת את העלות בכל 33 הרשתות ומדרגת מהזול ליקר." },
            { num: "3", title: "חסכו כסף", desc: "בחרו את הרשת הזולה, שמרו את העגלה, ובצעו קנייה חכמה." },
          ].map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.08}>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mb-4" style={{ background: "var(--accent)" }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 6 }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="sec" style={{ background: "var(--accent)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
              התחילו לחסוך היום
            </h2>
            <Link href="/download" className="btn btn-white">הורידו בחינם</Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
