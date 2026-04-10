"use client";

import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";

const QUOTES = [
  {
    text: "מאז שהתחלנו להשתמש ב-IsraBis, אנחנו חוסכים בערך 600 שקל בחודש. פשוט בונים עגלה ורואים איפה הכי זול.",
    name: "רונית כ.",
    detail: "אמא לשלושה, רמת גן",
    initial: "ר",
    color: "#EC4899",
  },
  {
    text: "הפיצ׳ר של מתכון מסרטון שינה לי את החיים. רואה מתכון בטיקטוק, מדביק לינק, ותוך שניות יש לי מתכון + רשימת קניות עם מחירים.",
    name: "יובל מ.",
    detail: "סטודנט, תל אביב",
    initial: "י",
    color: "#06B6D4",
  },
  {
    text: "כבעלת עסק קטן אני צריכה לנהל תקציב מזון בזהירות. ה-AI של IsraBis עוזר לי לתכנן תפריט שבועי ולקנות בחכמה.",
    name: "שירה ל.",
    detail: "שפית ובעלת קייטרינג, ירושלים",
    initial: "ש",
    color: "#34C759",
  },
];

export default function Testimonials() {
  return (
    <section className="sec">
      <div className="w-1120">
        <SectionHeader
          label="מה אומרים עלינו"
          title="משפחות שכבר חוסכות"
        />

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "var(--space-5)" }}>
          {QUOTES.map((q, i) => (
            <FadeIn key={q.name} delay={i * 0.08}>
              <div className="glass-card" style={{ padding: "var(--space-7)", height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Stars */}
                <div className="flex" style={{ gap: 2, marginBottom: "var(--space-4)", direction: "ltr" }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-body" style={{ lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)", flex: 1, marginBottom: "var(--space-5)" }}>
                  &ldquo;{q.text}&rdquo;
                </p>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "var(--radius-pill)",
                    background: q.color + "20", color: q.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "var(--font-body)",
                    flexShrink: 0,
                  }}>
                    {q.initial}
                  </div>
                  <div>
                    <p className="text-body-sm" style={{ fontWeight: 700 }}>{q.name}</p>
                    <p className="text-caption c-muted">{q.detail}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
