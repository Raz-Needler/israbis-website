import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "השוואת מחירים שופרסל — מחירי שופרסל מול 32 רשתות שיווק | IsraBis",
  description: "מחירי שופרסל עם השוואה אוטומטית ל-32 רשתות שיווק נוספות. שופרסל דיל, שופרסל אונליין, שופרסל שלי — כמה אפשר לחסוך? 255,000 מוצרים, עדכון יומי.",
  alternates: { canonical: "https://israbis.com/stores/shufersal" },
  openGraph: {
    title: "מחירים בשופרסל לעומת 32 רשתות",
    description: "בדקו מחירי שופרסל מול רמי לוי, ויקטורי, ועוד 46 רשתות — בלחיצה אחת.",
  },
};

export default function ShufersalPage() {
  return (
    <article className="sec">
      <div className="w-980" style={{ maxWidth: 760 }}>
        <div className="badge" style={{ marginBottom: "var(--space-4)" }}>שופרסל</div>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
          מחירי שופרסל — השוואה ל-32 רשתות שיווק
        </h1>
        <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>עדכון אחרון: אפריל 2026 &middot; 4 דקות קריאה</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>שופרסל — הרשת הגדולה ביותר בישראל</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              שופרסל היא הרשת הגדולה ביותר בישראל מבחינת מספר סניפים ומחזור מכירות, עם למעלה מ-300 סניפים ברחבי הארץ. הרשת פועלת תחת מספר מותגים: שופרסל דיל (הפורמט הדיסקאונט), שופרסל שלי (שכונתי), ושופרסל אקספרס (נוחות). לכל פורמט מחירים שונים — ואת ההבדל הזה IsraBis מראה לכם בדיוק.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
              העובדה שיש לשופרסל 300+ סניפים לא אומרת שהמחירים זהים בכולם. לפי נתוני IsraBis, <strong style={{ color: "var(--text)" }}>הפרש מחירים של עד 12% קיים בין סניפי שופרסל</strong> שונים באותו אזור גיאוגרפי. לכן חשוב לא רק להשוות שופרסל לרשתות אחרות, אלא גם לדעת איזה סניף שופרסל זול יותר עבורכם.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>נתוני שופרסל ב-IsraBis</h2>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
              <li>מספר מוצרים: מעל 80,000 מוצרים ייחודיים משופרסל</li>
              <li>עדכון מחירים: כל 4 שעות, ישירות מהמאגר הממשלתי</li>
              <li>סניפים: 300+ סניפים בכל הארץ (דיל, שלי, אקספרס)</li>
              <li>מסמך XML: מתפרסם יומיומית לפי חוק שקיפות מחירי מזון 2014</li>
              <li>דיוק: נתוני מחיר ספציפיים לסניף ולפורמט</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>שופרסל מול שאר הרשתות — מה האמת?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              לפי נתוני IsraBis, שופרסל דיל הוא הפורמט התחרותי ביותר של הרשת מבחינת מחירים. סל בסיסי של 50 מוצרים בשופרסל דיל עולה <strong style={{ color: "var(--text)" }}>₪510 בממוצע</strong>, לעומת ₪452 ברמי לוי — הפרש של כ-13%. שופרסל שלי, לעומת זאת, עשוי להיות יקר יותר ב-8-15% בגלל הפורמט השכונתי.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
              עם זאת, שופרסל מוביל בקטגוריות מסוימות: מוצרי מאפייה טריים, מוצרי דלי, ומבצעי "2+1" על מוצרי ניקוי ויגנה — שלעיתים הופכים אותו לתחרותי מאוד כשמחשבים את מחיר ליחידה. IsraBis לוקחת מבצעים כאלה בחשבון בחישוב העגלה החכמה.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>איך לחסוך בשופרסל עם IsraBis</h2>
            <ol className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
              <li style={{ marginBottom: "var(--space-3)" }}>הורידו את IsraBis בחינם (iOS או Android)</li>
              <li style={{ marginBottom: "var(--space-3)" }}>הפעילו מיקום — IsraBis תזהה את הסניף הקרוב אליכם ואת הפורמט שלו</li>
              <li style={{ marginBottom: "var(--space-3)" }}>בנו עגלת קניות שלמה עם כל המוצרים שאתם צריכים</li>
              <li style={{ marginBottom: "var(--space-3)" }}>ראו השוואה מלאה: שופרסל לעומת כל 32 הרשתות האחרות</li>
              <li style={{ marginBottom: "var(--space-3)" }}>גלו כמה תחסכו אם תעברו לרשת אחרת — או המשיכו בשופרסל בידיעה שהחלטתם בצורה מושכלת</li>
            </ol>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>שופרסל אונליין — האם עדיף להזמין מהבית?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              שופרסל מציעה שירות הזמנה אונליין עם משלוח עד הבית. מחירי האונליין עשויים להיות שונים ממחירי הסניף הפיזי. IsraBis מציגה את מחירי הסניפים הפיזיים לפי נתוני XML הממשלתיים, ולכן מאפשרת לכם לעשות השוואה בסיסית. לפני הזמנה אונליין, כדאי לוודא שהמחיר המקוון לא גבוה יותר מהמחיר הפיזי.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
              תכנון חכם: השתמשו ב-IsraBis לבניית רשימת הקניות עם השוואת מחירים, ואז הזמינו ישירות מהפלטפורמה שנוחה לכם ביותר. העיקר — שתדעו מה המחיר הצפוי.
            </p>
          </section>

          <section>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-3)" }}>
              ראו גם: <Link href="/stores/rami-levy" className="c-accent" style={{ textDecoration: "underline" }}>מחירי רמי לוי</Link> &middot; <Link href="/stores/victory" className="c-accent" style={{ textDecoration: "underline" }}>מחירי ויקטורי</Link> &middot; <Link href="/stores" className="c-accent" style={{ textDecoration: "underline" }}>כל הרשתות</Link>
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
              רוצים לדעת מה מחיר מוצר ספציפי בשופרסל? הורידו את IsraBis — השוואת מחירים בין 49 רשתות, בחינם, בעברית.
            </p>
            <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
          </section>
        </div>
      </div>
    </article>
  );
}
