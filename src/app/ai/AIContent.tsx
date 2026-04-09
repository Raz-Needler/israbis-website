"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import SectionHeader from "@/components/SectionHeader";

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
      <section className="sec" style={{ paddingBottom: "var(--space-6)", background: "var(--bg-secondary)" }}>
        <div className="w-980 text-center">
          <SectionHeader
            label="AI"
            title={<>כלים חכמים <span className="c-accent">שעובדים בשבילך.</span></>}
            subtitle="צלמו, סרקו, הדביקו — והמערכת עושה את השאר. כל הכלים מבוססי Gemini AI."
          />
        </div>
      </section>

      {/* Tools — alternating layout */}
      {TOOLS.map((t, i) => (
        <section key={t.title} className="sec" style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--bg-secondary)" }}>
          <div className={`w-980 flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center`} style={{ gap: "var(--space-9)" }}>
            <FadeIn className="flex-1 relative">
              <div className="glow" style={{ width: 200, height: 200, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--accent)", opacity: 0.06 }} />
              <Image src={`/svg/${t.svg}.svg`} alt={t.title} width={340} height={340} className="relative z-10 w-full max-w-[300px] mx-auto h-auto" />
            </FadeIn>
            <FadeIn className="flex-1 text-right" delay={0.1}>
              <h2 className="text-h2" style={{ marginBottom: "var(--space-1)" }}>
                {t.title}
              </h2>
              <p className="text-h4" style={{ fontWeight: 600, color: "var(--accent)", marginBottom: "var(--space-3)" }}>{t.sub}</p>
              <p className="text-body c-muted">{t.body}</p>
              <Link href="/download" className="card-cta" style={{ marginTop: "var(--space-4)" }}>
                גלו עוד <ArrowLeft size={14} />
              </Link>
            </FadeIn>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="sec" style={{ background: "var(--accent)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <h2 className="text-h1" style={{ color: "#fff", marginBottom: "var(--space-4)" }}>
              נסו את הכלים החכמים
            </h2>
            <Link href="/download" className="btn btn-white">הורידו בחינם</Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
