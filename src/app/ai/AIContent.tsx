"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

const TOOLS = [
  {
    title: "סריקת מקרר",
    sub: "צלמו. המערכת מבשלת.",
    body: "צלמו את המקרר — AI מזהה את כל המרכיבים ומציע מתכונים מותאמים בדיוק למה שיש. בלי לקנות דבר נוסף. בלי בזבוז מזון.",
    svg: "composition_3",
  },
  {
    title: "סריקת קלוריות",
    sub: "צלמו את הצלחת.",
    body: "מערכת זיהוי AI מנתחת תמונות של מנות ומחשבת קלוריות, חלבון, פחמימות ושומנים. מעקב תזונתי מדויק בצילום אחד.",
    svg: "composition_5",
  },
  {
    title: "מתכון מסרטון",
    sub: "לינק אחד. מתכון מלא.",
    body: "ראיתם מתכון ביוטיוב, טיקטוק, או אינסטגרם? הדביקו את הלינק ותקבלו מתכון כתוב מסודר עם רשימת מרכיבים, כמויות, ומחירים בכל הרשתות.",
    svg: "composition_8",
  },
  {
    title: "סריקת קבלה",
    sub: "מהקבלה לעגלה.",
    body: "צלמו קבלה מהסופר והמערכת מזהה אוטומטית את כל המוצרים, ברקודים, ומחירים. הוסיפו הכל לעגלה או למעקב הוצאות בלחיצה.",
    svg: "composition_11",
  },
  {
    title: "עוזר AI — מיקי",
    sub: "שאלו הכל.",
    body: "מיקי הוא העוזר החכם שלכם במטבח. שאלו כל שאלה על מתכונים, תחליפים, כמויות, טכניקות בישול, ותזונה. תמיד זמין, תמיד מדויק.",
    svg: "composition_2",
  },
];

export default function AIContent() {
  return (
    <>
      {/* Header */}
      <section className="sec" style={{ paddingBottom: 24, background: "var(--bg-secondary)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <p className="sec-label">AI</p>
            <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
              כלים חכמים
              <br />
              <span style={{ color: "var(--accent)" }}>שעובדים בשבילך.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "var(--text-muted)", maxWidth: "44ch", margin: "12px auto 0", lineHeight: 1.6 }}>
              צלמו, סרקו, הדביקו — והמערכת עושה את השאר. כל הכלים מבוססי Gemini AI.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Tools — alternating layout */}
      {TOOLS.map((t, i) => (
        <section key={t.title} className="sec" style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--bg-secondary)" }}>
          <div className={`w-980 flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-10 md:gap-16`}>
            <FadeIn className="flex-1 relative">
              <div className="glow" style={{ width: 200, height: 200, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--accent)", opacity: 0.06 }} />
              <Image src={`/svg/${t.svg}.svg`} alt={t.title} width={340} height={340} className="relative z-10 w-full max-w-[300px] mx-auto h-auto" />
            </FadeIn>
            <FadeIn className="flex-1 text-right" delay={0.1}>
              <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 6 }}>
                {t.title}
              </h2>
              <p style={{ fontSize: 19, fontWeight: 600, color: "var(--accent)", marginBottom: 12 }}>{t.sub}</p>
              <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.65 }}>{t.body}</p>
            </FadeIn>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="sec" style={{ background: "var(--accent)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
              נסו את הכלים החכמים
            </h2>
            <Link href="/download" className="btn btn-white">הורידו בחינם</Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
