"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import SectionHeader from "@/components/SectionHeader";

const FEATURES = [
  {
    title: "השוואת מחירים",
    headline: "49 רשתות.\nמחיר אחד הכי זול.",
    body: "בדקו את המחיר של כל מוצר בכל הרשתות בישראל. המערכת מחשבת את העגלה המלאה ומוצאת את הרשת הכי זולה עבורכם — עם פירוט מלא לכל רשת.",
    svg: "composition_1",
    color: "#06B6D4",
  },
  {
    title: "עגלת קניות חכמה",
    headline: "בנו עגלה.\nהמערכת חוסכת.",
    body: "הוסיפו מוצרים מהקטגוריות, מהמתכונים, או מסריקת ברקוד. המערכת משווה אוטומטית בין כל הרשתות ומציעה את העגלה הזולה ביותר. שמרו עגלות, שתפו עם המשפחה, ובצעו קנייה.",
    svg: "composition_7",
    color: "#34C759",
  },
  {
    title: "מתכונים ובישול",
    headline: "מהמתכון.\nלעגלה. לסיר.",
    body: "עשרות מתכונים עם רשימת מרכיבים מתומחרת, מצב בישול מונחה צעד אחרי צעד עם טיימרים חכמים. אהבתם מתכון? כל המרכיבים לעגלה בלחיצה.",
    svg: "composition_12",
    color: "#EC4899",
  },
  {
    title: "מעקב הוצאות ותקציב",
    headline: "דעו לאן\nהכסף הולך.",
    body: "הגדירו תקציב חודשי, עקבו אחרי הוצאות לפי קטגוריה (חלב, בשר, ירקות), וקבלו התראות כשמתקרבים לגבול. תובנות חכמות בעברית.",
    svg: "composition_4",
    color: "#14B8A6",
  },
  {
    title: "קניות משפחתיות",
    headline: "כל המשפחה.\nרשימה אחת.",
    body: "שתפו רשימות קניות עם בני המשפחה בזמן אמת. קניות חיות — כל אחד רואה מה נוסף ומה נמחק. דשבורד הוצאות משפחתי משותף.",
    svg: "composition_9",
    color: "#EC4899",
  },
  {
    title: "סריקת ברקוד",
    headline: "סרקו.\nדעו. חסכו.",
    body: "סרקו כל מוצר בסופר וראו מיד את המחיר בכל 49 הרשתות. התראות על ירידות מחיר למוצרים שאתם עוקבים אחריהם.",
    svg: "composition_6",
    color: "#0891B2",
  },
  {
    title: "מעקב מזון ומזווה",
    headline: "אפס\nבזבוז מזון.",
    body: "הוסיפו מוצרים למזווה הדיגיטלית, עקבו אחרי תאריכי תפוגה, וקבלו התראות לפני שמשהו מתקלקל. חסכו כסף ומנעו בזבוז.",
    svg: "composition_10",
    color: "#10B981",
  },
];

export default function FeaturesContent() {
  return (
    <>
      {/* Header */}
      <section className="sec" style={{ paddingBottom: "var(--space-7)", background: "var(--bg-secondary)" }}>
        <div className="w-980 text-center">
          <SectionHeader
            label="תכונות"
            title={<>כל מה ש-<span className="grad-text">IsraBis</span> יודעת לעשות.</>}
            subtitle="7 כלים שהופכים קניות לחוויה חכמה"
          />
        </div>
      </section>

      {/* Feature sections — alternating */}
      {FEATURES.map((f, i) => (
        <section key={f.title} className="sec" style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--bg-secondary)" }}>
          <div className={`w-980 flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center`} style={{ gap: "var(--space-9)" }}>
            <FadeIn className="flex-1">
              <Image src={`/svg/${f.svg}.svg`} alt={f.title} width={380} height={380} className="w-full max-w-[320px] mx-auto h-auto" />
            </FadeIn>
            <FadeIn className="flex-1 text-right" delay={0.1}>
              <div className="feat-icon" style={{ background: f.color + "15", marginBottom: "var(--space-4)" }}>
                <div className="w-5 h-5 rounded" style={{ background: f.color }} />
              </div>
              <h2 className="text-h2" style={{ marginBottom: "var(--space-3)", whiteSpace: "pre-line" }}>
                {f.headline}
              </h2>
              <p className="text-body c-muted">{f.body}</p>
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
              רוצים לנסות?
            </h2>
            <Link href="/download" className="btn btn-white">הורידו בחינם</Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
