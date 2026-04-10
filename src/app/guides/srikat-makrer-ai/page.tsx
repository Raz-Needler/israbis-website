import type { Metadata } from "next";
import Link from "next/link";
import ArticleJsonLd from "@/components/ArticleJsonLd";

export const metadata: Metadata = {
  title: "סריקת מקרר AI — צלמו את המקרר, קבלו מתכונים | IsraBis",
  description: "סריקת מקרר עם בינה מלאכותית: צלמו את המקרר, AI מזהה את כל המרכיבים ומציע מתכונים מותאמים ממה שיש. צמצום בזבוז מזון וחיסכון בקניות סופר.",
  alternates: { canonical: "/guides/srikat-makrer-ai" },
};

export default function GuideSrikatMakrer() {
  return (
    <>
    <ArticleJsonLd title="סריקת מקרר AI — איך זה עובד ולמה זה משנה" description="סריקת מקרר עם בינה מלאכותית לחיסכון בקניות" url="/guides/srikat-makrer-ai" />
    <article className="sec">
      <div className="w-980" style={{ maxWidth: 760 }}>
        <div className="badge" style={{ marginBottom: "var(--space-4)" }}>AI</div>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
          סריקת מקרר AI — איך זה עובד ולמה זה משנה
        </h1>
        <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>עדכון אחרון: אפריל 2026 &middot; 3 דקות קריאה</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>הבעיה: מה לבשל ממה שיש?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              כולנו פותחים את המקרר, מביטים פנימה, ולא יודעים מה לעשות עם מה שיש. התוצאה: אנחנו יוצאים לסופר ומבזבזים כסף על מרכיבים חדשים — בעוד שהמקרר כבר מלא. משפחות ישראליות זורקות ₪2,400-3,600 של מזון בשנה.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>הפתרון: סריקת מקרר AI</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              ב-IsraBis, צלמו תמונה אחת של המקרר. מערכת AI מתקדמת מזהה את כל המרכיבים — ירקות, חלב, גבינות, בשר, רטבים — ומציעה מתכונים שאפשר לבשל ממה שיש, בלי לקנות דבר נוסף. כל מתכון כולל הנחיות בישול מלאות, זמני הכנה, וערכים תזונתיים.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>החיסכון הכפול</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              סריקת מקרר חוסכת פעמיים: פעם אחת כי אתם לא קונים מרכיבים מיותרים, ופעם שנייה כי אתם לא זורקים מזון שנשכח במקרר. זה כלי שמשלם על עצמו מיד.
            </p>
          </section>

          <section>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
              נסו את סריקת המקרר ב-IsraBis — חינם, מיידי, מבוסס AI.
            </p>
            <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
          </section>
        </div>
      </div>
    </article>
    </>
  );
}
