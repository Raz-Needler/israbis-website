"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

const FEATURES = [
  {
    title: "השוואת מחירים",
    headline: "33 רשתות.\nמחיר אחד הכי זול.",
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
    body: "מעל 1,000 מתכונים עם רשימת מרכיבים מתומחרת, מצב בישול מונחה צעד אחרי צעד עם טיימרים חכמים. אהבתם מתכון? כל המרכיבים לעגלה בלחיצה.",
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
    body: "סרקו כל מוצר בסופר וראו מיד את המחיר בכל 33 הרשתות. התראות על ירידות מחיר למוצרים שאתם עוקבים אחריהם.",
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
      <section className="sec" style={{ paddingBottom: 32, background: "var(--bg-secondary)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <p className="sec-label">תכונות</p>
            <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
              כל מה ש-<span className="grad-text">IsraBis</span>
              <br />יודעת לעשות.
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Feature sections — alternating */}
      {FEATURES.map((f, i) => (
        <section key={f.title} className="sec" style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--bg-secondary)" }}>
          <div className={`w-980 flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-10 md:gap-16`}>
            <FadeIn className="flex-1">
              <Image src={`/svg/${f.svg}.svg`} alt={f.title} width={380} height={380} className="w-full max-w-[320px] mx-auto h-auto" />
            </FadeIn>
            <FadeIn className="flex-1 text-right" delay={0.1}>
              <div className="feat-icon mb-4" style={{ background: f.color + "15" }}>
                <div className="w-5 h-5 rounded" style={{ background: f.color }} />
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 12, whiteSpace: "pre-line" }}>
                {f.headline}
              </h2>
              <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.65 }}>{f.body}</p>
            </FadeIn>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="sec" style={{ background: "var(--accent)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
              רוצים לנסות?
            </h2>
            <Link href="/download" className="btn btn-white">הורידו בחינם</Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
