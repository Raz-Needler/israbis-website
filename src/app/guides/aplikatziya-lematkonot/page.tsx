import type { Metadata } from "next";
import Link from "next/link";
import ArticleJsonLd from "@/components/ArticleJsonLd";

export const metadata: Metadata = {
  title: "אפליקציית מתכונים בעברית — המדריך המלא לבחירה 2026",
  description: "מחפשים אפליקציה למתכונים בעברית? מדריך השוואה בין אפליקציות המתכונים בישראל: IsraBis עם השוואת מחירים, מתכונים מסרטונים, AI חכם, וניהול קניות משפחתי.",
  alternates: { canonical: "/guides/aplikatziya-lematkonot" },
};

export default function GuideAppMatkonot() {
  return (
    <>
    <ArticleJsonLd title="אפליקציית מתכונים בעברית — המדריך המלא לבחירה" description="מדריך השוואה בין אפליקציות המתכונים בישראל" url="/guides/aplikatziya-lematkonot" />
    <article className="sec">
      <div className="w-980" style={{ maxWidth: 760 }}>
        <div className="badge" style={{ marginBottom: "var(--space-4)" }}>אפליקציה</div>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
          אפליקציית מתכונים בעברית — המדריך לבחירה הנכונה
        </h1>
        <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>עדכון אחרון: אפריל 2026 &middot; 4 דקות קריאה</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>מה לחפש באפליקציית מתכונים?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              אפליקציית מתכונים טובה צריכה להיות יותר מאוסף מתכונים. היא צריכה עברית מלאה, תמיכה ב-RTL, מתכונים שמתאימים לקהל הישראלי (כשרות, מרכיבים מקומיים), ואינטגרציה עם הסופרמרקט — כי מתכון בלי רשימת קניות זה רק חצי עבודה.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>למה IsraBis שונה מכל אפליקציית מתכונים?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              IsraBis היא אפליקציית אוכל חכמה שמחברת בין הבישול לקניות. מתכונים ללא הגבלה, כולם עם רשימת מרכיבים מתומחרת בין 49 רשתות שיווק. כלי AI שממירים סרטוני בישול למתכונים, סריקת מקרר שמציעה מתכונים ממה שיש, וסריקת קלוריות מתמונה. ומעל הכל — עגלת קניות חכמה שמוצאת את הרשת הזולה ביותר.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>תכונות שלא תמצאו במקום אחר</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              מתכון מסרטון — הדביקו לינק מיוטיוב, טיקטוק, או אינסטגרם ותקבלו מתכון כתוב מסודר עם מחירים. סריקת מקרר — צלמו את המקרר ו-AI מזהה מרכיבים ומציע מתכונים. מצב בישול מונחה — צעד אחרי צעד עם טיימרים חכמים. קניות משפחתיות — כל המשפחה רואה את רשימת הקניות בזמן אמת.
            </p>
          </section>

          <section>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
              הורידו את IsraBis בחינם וגלו למה זו אפליקציית המתכונים הטובה ביותר בישראל.
            </p>
            <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
          </section>
        </div>
      </div>
    </article>
    </>
  );
}
