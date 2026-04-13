import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "השוואת מחירים יוחננוף — מחירי יוחננוף מול 32 רשתות שיווק | IsraBis",
  description: "מחירי יוחננוף עם השוואה אוטומטית ל-32 רשתות שיווק נוספות. יוחננוף — הרשת האיכותית בדרום — כמה עולה לקנות שם? IsraBis, 255,000 מוצרים, עדכון יומי.",
  alternates: { canonical: "https://israbis.com/stores/yochananof" },
  openGraph: {
    title: "מחירים ביוחננוף לעומת 32 רשתות",
    description: "בדקו מחירי יוחננוף מול שופרסל, רמי לוי, ועוד 30 רשתות — בלחיצה אחת.",
  },
};

export default function YochananofPage() {
  return (
    <article className="sec">
      <div className="w-980" style={{ maxWidth: 760 }}>
        <div className="badge" style={{ marginBottom: "var(--space-4)" }}>יוחננוף</div>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
          מחירי יוחננוף — השוואה ל-32 רשתות שיווק
        </h1>
        <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>עדכון אחרון: אפריל 2026 &middot; 4 דקות קריאה</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>יוחננוף — הרשת הדרומית המובילה</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              יוחננוף היא רשת שיווק ישראלית ותיקה ומבוססת, שמרכז פעילותה בדרום הארץ — באר שבע, אשדוד, אשקלון, קריית גת, ואזורים נוספים. הרשת ידועה באיכות המוצרים, בפורמט החנות הנוחה, ובקהל לקוחות נאמן. <strong style={{ color: "var(--text)" }}>ליוחננוף כ-25 סניפים</strong>, חלקם בפורמט גדול וחלקם שכונתי.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
              מבחינת מחירים, יוחננוף נחשבת לרשת ברמת מחירים בינונית — לא הזולה ביותר, אבל עם יתרונות משמעותיים בשירות, זמינות, ואיכות מוצרים. לפי נתוני IsraBis, ישנן קטגוריות שבהן יוחננוף מפתיעה לטובה.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>נתוני יוחננוף ב-IsraBis</h2>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
              <li>מספר מוצרים: מעל 28,000 מוצרים ייחודיים מיוחננוף</li>
              <li>עדכון מחירים: כל 4 שעות, ישירות מהמאגר הממשלתי</li>
              <li>סניפים: כ-25 סניפים ברחבי הדרום ומרכז ישראל</li>
              <li>מסמך XML: מתפרסם יומיומית לפי חוק שקיפות מחירי מזון 2014</li>
              <li>דיוק: נתוני מחיר ספציפיים לסניף</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>יוחננוף מול שאר הרשתות — מה מגלים הנתונים?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              לפי ניתוח נתוני IsraBis, יוחננוף מציגה מחירים תחרותיים ב:
            </p>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)", marginTop: "var(--space-3)" }}>
              <li><strong style={{ color: "var(--text)" }}>מוצרי מאפייה טריים:</strong> לחמים, חלות, ומוצרי מאפה — לעיתים תחרותיים</li>
              <li><strong style={{ color: "var(--text)" }}>מוצרי דלי:</strong> גבינות, מעדנייה — איכות גבוהה במחיר סביר</li>
              <li><strong style={{ color: "var(--text)" }}>ירקות ופירות:</strong> טריות גבוהה, מחירים קרובים לממוצע השוק</li>
              <li><strong style={{ color: "var(--text)" }}>בשר ועוף:</strong> מבחר טוב ואיכות גבוהה</li>
            </ul>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
              על מוצרי מזון מתועשים ויבש, יוחננוף פחות תחרותית ביחס לדיסקאונטריות כמו רמי לוי ואושר עד. IsraBis תציג לכם את הפרשי המחירים המדויקים על העגלה הספציפית שלכם.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>יוחננוף לתושבי הדרום — האם כדאי?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              עבור תושבי אזורי הדרום שיוחננוף היא הרשת הנגישה ביותר — IsraBis עוזרת לקבל החלטה מושכלת. לעיתים, גם אם יוחננוף מעט יקרה יותר על חלק מהמוצרים, עלות הנסיעה לרמי לוי או שופרסל דיל מבטלת את החיסכון.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
              IsraBis מחשבת לכם את ה"שווי" הנטו של הנסיעה לרשת אחרת: כמה תחסכו על המוצרים פחות עלות הדלק והזמן. כך תוכלו להחליט בצורה מבוססת נתונים — לא לפי תחושה.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>איך להשוות מחירי יוחננוף עם IsraBis?</h2>
            <ol className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
              <li style={{ marginBottom: "var(--space-3)" }}>הורידו את IsraBis בחינם (iOS או Android)</li>
              <li style={{ marginBottom: "var(--space-3)" }}>הפעילו מיקום — IsraBis תמצא את הסניף הקרוב ביותר לכם</li>
              <li style={{ marginBottom: "var(--space-3)" }}>בנו עגלת קניות עם כל המוצרים הרגילים שלכם</li>
              <li style={{ marginBottom: "var(--space-3)" }}>ראו את יוחננוף בהשוואה לכל 32 הרשתות האחרות</li>
              <li style={{ marginBottom: "var(--space-3)" }}>קבלו החלטה מושכלת על בסיס נתונים — לא על בסיס מוניטין</li>
            </ol>
          </section>

          <section>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-3)" }}>
              ראו גם: <Link href="/stores/osher-ad" className="c-accent" style={{ textDecoration: "underline" }}>מחירי אושר עד</Link> &middot; <Link href="/stores/shufersal" className="c-accent" style={{ textDecoration: "underline" }}>מחירי שופרסל</Link> &middot; <Link href="/stores" className="c-accent" style={{ textDecoration: "underline" }}>כל הרשתות</Link>
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
              רוצים לדעת מה מחיר מוצר ספציפי ביוחננוף? הורידו את IsraBis — השוואת מחירים בין 33 רשתות, בחינם, בעברית.
            </p>
            <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
          </section>
        </div>
      </div>
    </article>
  );
}
