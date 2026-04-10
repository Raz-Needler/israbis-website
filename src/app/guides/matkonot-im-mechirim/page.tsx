import type { Metadata } from "next";
import Link from "next/link";
import ArticleJsonLd from "@/components/ArticleJsonLd";

export const metadata: Metadata = {
  title: "מתכונים עם מחירים — בשלו חכם וקנו בזול | IsraBis",
  description: "מתכונים עם השוואת מחירים בין 33 רשתות שיווק. כל מתכון כולל רשימת מרכיבים מתומחרת — דעו בדיוק כמה עולה לבשל כל מנה ובאיזו רשת הכי זול.",
  alternates: { canonical: "/guides/matkonot-im-mechirim" },
};

export default function GuideMatkonot() {
  return (
    <>
    <ArticleJsonLd title="מתכונים עם מחירים — בשלו חכם וקנו בזול" description="מתכונים עם השוואת מחירים בין 33 רשתות שיווק" url="/guides/matkonot-im-mechirim" />
    <article className="sec">
      <div className="w-980" style={{ maxWidth: 760 }}>
        <div className="badge" style={{ marginBottom: "var(--space-4)" }}>מתכונים</div>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
          מתכונים עם מחירים — בשלו חכם, קנו בזול
        </h1>
        <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>עדכון אחרון: אפריל 2026 &middot; 4 דקות קריאה</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>הבעיה: מתכונים בלי מחירים</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              אתם מוצאים מתכון שנראה מעולה — בטיקטוק, ביוטיוב, באתר מתכונים. אבל כמה זה עולה לבשל? ובאיזו רשת זה הכי זול? אין דרך לדעת בלי לבדוק מוצר אחרי מוצר, רשת אחרי רשת. IsraBis פותרת את הבעיה הזו.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>מתכונים ללא הגבלה — כולם עם מחירים</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              ב-IsraBis, כל מתכון כולל רשימת מרכיבים עם מחירים משווים בין 33 רשתות. אתם רואים בדיוק כמה עולה לבשל סמאש בורגר ברמי לוי לעומת שופרסל. כל מרכיב מתומחר, כל העגלה מחושבת.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>ממתכון לעגלה בלחיצה אחת</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              אהבתם מתכון? לחצו &quot;הוסף לעגלה&quot; וכל המרכיבים עוברים לעגלת הקניות החכמה. המערכת מחשבת את הרשת הזולה ביותר לכל העגלה. לא צריך לרשום רשימה, לא צריך לחפש מוצרים — הכל אוטומטי.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>מצב בישול מונחה</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              IsraBis כוללת מצב בישול מונחה צעד-אחרי-צעד עם טיימרים חכמים, רמת קושי, זמן הכנה, כמויות, ומידע תזונתי. כל מתכון הופך לחוויית בישול מלאה.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>התחילו לבשל חכם</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
              הורידו את IsraBis וגלו מתכונים עם מחירים, מצב בישול מונחה, ועגלת קניות חכמה.
            </p>
            <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
          </section>
        </div>
      </div>
    </article>
    </>
  );
}
