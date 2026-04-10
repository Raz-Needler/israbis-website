import type { Metadata } from "next";
import Link from "next/link";
import ArticleJsonLd from "@/components/ArticleJsonLd";

export const metadata: Metadata = {
  title: "איך לחסוך בקניות סופר — 10 טיפים שעובדים | 2026",
  description: "10 טיפים מעשיים לחיסכון בקניות סופרמרקט בישראל: השוואת מחירים בין רשתות, תכנון ארוחות, שימוש בעגלה חכמה, סריקת מבצעים, מעקב הוצאות, וכלי AI שחוסכים זמן וכסף.",
  alternates: { canonical: "/guides/hisachon-bekniyot" },
};

export default function GuideHisachon() {
  return (
    <>
    <ArticleJsonLd title="איך לחסוך בקניות סופר — 10 טיפים שעובדים" description="10 טיפים מעשיים לחיסכון בקניות סופרמרקט בישראל" url="/guides/hisachon-bekniyot" />
    <article className="sec">
      <div className="w-980" style={{ maxWidth: 760 }}>
        <div className="badge" style={{ marginBottom: "var(--space-4)" }}>חיסכון</div>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
          איך לחסוך בקניות סופר — 10 טיפים שעובדים
        </h1>
        <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>עדכון אחרון: אפריל 2026 &middot; 6 דקות קריאה</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          {[
            { n: "1", t: "השוו מחירים בין רשתות — לא בהרגשה, בנתונים", b: "הפרש של 21% קיים בין רשתות על אותם מוצרים. אפליקציה כמו IsraBis משווה מחירים בין 33 רשתות שיווק ומוצאת את הזולה ביותר עבור סל הקניות שלכם. לא צריך לנחש." },
            { n: "2", t: "תכננו ארוחות מראש", b: "קנייה בלי תכנון מובילה לבזבוז של ₪2,400-3,600 בשנה על מזון שנזרק. תכננו תפריט שבועי ותקנו רק מה שצריך." },
            { n: "3", t: "השתמשו בעגלה חכמה", b: "במקום לרשום רשימה על נייר — בנו עגלה דיגיטלית שמשווה מחירים אוטומטית. ב-IsraBis, כל מוצר שמוסיפים מיד מחושב בכל הרשתות." },
            { n: "4", t: "סרקו ברקודים בסופר", b: "לפני שמוסיפים מוצר לעגלה הפיזית — סרקו את הברקוד ובדקו אם הוא זול יותר ברשת אחרת." },
            { n: "5", t: "בשלו מהמקרר, לא מהסופר", b: "סריקת מקרר AI מזהה מה שיש ומציעה מתכונים — בלי לקנות מרכיבים חדשים." },
            { n: "6", t: "הפכו סרטוני בישול למתכונים מתומחרים", b: "ראיתם מתכון ביוטיוב? הדביקו את הלינק ב-IsraBis ותקבלו מתכון כתוב עם מחירים בכל הרשתות." },
            { n: "7", t: "עקבו אחרי הוצאות מזון חודשיות", b: "הגדירו תקציב חודשי וקבלו התראות כשמתקרבים לגבול. רוב המשפחות לא יודעות כמה הן מוציאות." },
            { n: "8", t: "קנו ביחד כמשפחה", b: "קניות משפחתיות בזמן אמת — כל אחד רואה מה נוסף ומה נמחק. בלי כפילויות." },
            { n: "9", t: "עקבו אחרי תפוגה", b: "השתמשו במזווה דיגיטלית כדי לעקוב אחרי תאריכי תפוגה ולקבל התראות לפני שמוצרים מתקלקלים." },
            { n: "10", t: "הורידו את IsraBis", b: "כל הטיפים שפירטנו כאן — זמינים באפליקציה אחת, בחינם, בעברית." },
          ].map((tip) => (
            <section key={tip.n}>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                <span className="c-accent">{tip.n}.</span> {tip.t}
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>{tip.b}</p>
            </section>
          ))}

          <section>
            <Link href="/download" className="btn btn-accent">הורידו את IsraBis בחינם</Link>
          </section>
        </div>
      </div>
    </article>
    </>
  );
}
