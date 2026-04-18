import type { Metadata } from "next";
import Link from "next/link";
import ArticleJsonLd from "@/components/ArticleJsonLd";

export const metadata: Metadata = {
  title: "מתכון מסרטון — מיוטיוב וטיקטוק למטבח שלכם | IsraBis",
  description: "הדביקו לינק של סרטון בישול מיוטיוב, טיקטוק, או אינסטגרם — וקבלו מתכון כתוב מסודר עם רשימת מרכיבים, כמויות, הוראות בישול, ומחירים בכל 49 הרשתות.",
  alternates: { canonical: "/guides/matkon-misirton" },
};

export default function GuideMatkonMisirton() {
  return (
    <>
    <ArticleJsonLd title="מתכון מסרטון — מיוטיוב וטיקטוק למטבח שלכם" description="הפכו סרטוני בישול מיוטיוב וטיקטוק למתכונים כתובים עם מחירים" url="/guides/matkon-misirton" />
    <article className="sec">
      <div className="w-980" style={{ maxWidth: 760 }}>
        <div className="badge" style={{ marginBottom: "var(--space-4)" }}>AI</div>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
          מתכון מסרטון — מיוטיוב וטיקטוק למטבח שלכם
        </h1>
        <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>עדכון אחרון: אפריל 2026 &middot; 3 דקות קריאה</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>הבעיה: סרטון בישול = אין מתכון כתוב</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              רואים סרטון בישול מדהים ביוטיוב, בטיקטוק, או באינסטגרם. רוצים לבשל את זה. אבל אין מתכון כתוב מסודר. אין רשימת מרכיבים. אין כמויות מדויקות. אין רשימת קניות. ואין מושג כמה זה עולה.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>הפתרון: לינק אחד = מתכון מלא</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              ב-IsraBis, פשוט הדביקו את הלינק של הסרטון. מערכת AI מנתחת את הסרטון ומפיקה מתכון כתוב מלא: שם המנה, רשימת מרכיבים עם כמויות, הוראות בישול צעד-אחרי-צעד, זמן הכנה, רמת קושי, וערכים תזונתיים.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>וגם מחירים בכל הרשתות</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              הפיצ&apos;ר הייחודי: כל מרכיב שה-AI מזהה מקושר אוטומטית למוצר המתאים ב-49 רשתות השיווק. אתם רואים מיד כמה עולה לבשל את המנה, באיזו רשת הכי זול, ויכולים להוסיף הכל לעגלה בלחיצה אחת.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>אילו פלטפורמות נתמכות?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              YouTube, TikTok, Instagram Reels, ואתרי מתכונים. כל לינק שמכיל סרטון בישול עובד. AI מתקדם שמבין עברית ואנגלית.
            </p>
          </section>

          <section>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
              נסו את הפיצ&apos;ר של מתכון מסרטון ב-IsraBis — חינם, מיידי, מדויק.
            </p>
            <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
          </section>
        </div>
      </div>
    </article>
    </>
  );
}
