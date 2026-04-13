import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "השוואת מחירים רמי לוי — כל מוצרי רמי לוי עם השוואה ל-32 רשתות | IsraBis",
  description: "מחירי רמי לוי עם השוואה אוטומטית ל-32 רשתות שיווק נוספות. האם רמי לוי באמת הכי זול? גלו עם IsraBis — 255,000 מוצרים, עדכון יומי.",
  alternates: { canonical: "https://israbis.com/stores/rami-levy" },
  openGraph: {
    title: "מחירים ב-רמי לוי לעומת 32 רשתות",
    description: "בדקו מחירי רמי לוי מול שופרסל, ויקטורי, ועוד 30 רשתות — בלחיצה אחת.",
  },
};

export default function RamiLevyPage() {
  return (
    <article className="sec">
      <div className="w-980" style={{ maxWidth: 760 }}>
        <div className="badge" style={{ marginBottom: "var(--space-4)" }}>רמי לוי</div>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
          מחירי רמי לוי — השוואה ל-32 רשתות שיווק
        </h1>
        <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>עדכון אחרון: אפריל 2026 &middot; 4 דקות קריאה</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>האם רמי לוי באמת הכי זול?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              רמי לוי שיווק הוא אחת מרשתות השיווק הגדולות בישראל, עם מוניטין של מחירים נמוכים. אך האמת המפתיעה: <strong style={{ color: "var(--text)" }}>לא תמיד רמי לוי הכי זול</strong> על כל מוצר. על חלב ולחם — לעיתים כן. על מוצרי ניקוי, ממתקים, ומוצרי טיפוח — לעיתים ויקטורי, אושר עד, או מחסני השוק זולים יותר.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
              IsraBis מאפשרת לכם לבדוק כל מוצר ספציפי מרמי לוי מול 32 הרשתות האחרות — בזמן אמת, לפי הסניף הקרוב אליכם. לפי נתוני IsraBis, כ-60% מהמוצרים הבסיסיים אכן זולים יותר ברמי לוי, אך 40% מהמוצרים — בעיקר מותגי יוקרה ומוצרי ניקוי — ניתן למצוא בזול יותר ברשתות אחרות.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>נתוני רמי לוי ב-IsraBis</h2>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
              <li>מספר מוצרים: מעל 50,000 מוצרים ייחודיים מרמי לוי</li>
              <li>עדכון מחירים: כל 4 שעות, ישירות מהמאגר הממשלתי</li>
              <li>סניפים: כ-30 סניפים ברחבי ישראל (כולל סניפי גדרה, נתניה, ירושלים, ועוד)</li>
              <li>מסמך XML: מתפרסם יומיומית לפי חוק שקיפות מחירי מזון 2014</li>
              <li>דיוק: נתוני מחיר ספציפיים לסניף — לא ממוצע רשת</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>איך משווים מחירי רמי לוי עם IsraBis?</h2>
            <ol className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
              <li style={{ marginBottom: "var(--space-3)" }}>הורידו את IsraBis בחינם (iOS או Android)</li>
              <li style={{ marginBottom: "var(--space-3)" }}>הפעילו מיקום — האפליקציה תמצא את סניף רמי לוי הקרוב אליכם</li>
              <li style={{ marginBottom: "var(--space-3)" }}>חפשו מוצר לפי שם או סרקו ברקוד</li>
              <li style={{ marginBottom: "var(--space-3)" }}>ראו את המחיר ברמי לוי לצד המחיר בכל 32 הרשתות האחרות</li>
              <li style={{ marginBottom: "var(--space-3)" }}>בנו עגלת קניות שלמה ומצאו אחת לתמיד איפה כדאי לקנות</li>
            </ol>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>רמי לוי מול שאר הרשתות — מה הנתונים אומרים?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              לפי נתוני IsraBis, סל בסיסי של 50 מוצרים יומיומיים ברמי לוי עולה בממוצע <strong style={{ color: "var(--text)" }}>₪452</strong>. אותו סל עולה ₪548 בשופרסל דיל — הפרש של כמעט ₪100. אבל בויקטורי ובמחסני השוק ישנם קטגוריות שבהן המחירים נמוכים אפילו מרמי לוי. ההשוואה חייבת להיות ברמת המוצר, לא רק ברמת הרשת.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
              דוגמה אמיתית: חלב תנובה 3% (1 ליטר) עולה ₪6.90 ברמי לוי, ₪7.40 בשופרסל, ו-₪6.50 במחסני השוק. שמפו פנטין 400 מ"ל עולה ₪19.90 ברמי לוי אבל רק ₪16.90 בויקטורי. כלומר — לא קיימת "הרשת הכי זולה" באופן גורף. הכל תלוי במוצרים שאתם קונים.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>קניות חכמות ברמי לוי עם IsraBis</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              IsraBis לא רק מראה לכם מחירים — היא עוזרת לכם לתכנן קניות חכמות. בנו עגלת קניות שלמה עם כל המוצרים שאתם צריכים השבוע, ו-IsraBis תחשב את העלות הכוללת בכל 33 הרשתות. אם רמי לוי הכי זולה לעגלה שלכם — תדעו. אם ויקטורי חוסכת לכם ₪80 על אותה עגלה — תדעו גם את זה.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
              בנוסף, IsraBis מציעה מתכונים ללא הגבלה עם מחירים בזמן אמת — כך שכשאתם מתכננים ארוחה, אתם יודעים מראש כמה היא תעלה ברמי לוי לעומת שאר הרשתות. חיסכון ממוצע למשפחה: ₪200-500 בחודש.
            </p>
          </section>

          <section>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-3)" }}>
              ראו גם: <Link href="/stores/shufersal" className="c-accent" style={{ textDecoration: "underline" }}>מחירי שופרסל</Link> &middot; <Link href="/stores/victory" className="c-accent" style={{ textDecoration: "underline" }}>מחירי ויקטורי</Link> &middot; <Link href="/stores" className="c-accent" style={{ textDecoration: "underline" }}>כל הרשתות</Link>
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
              רוצים לדעת מה מחיר מוצר ספציפי ברמי לוי? הורידו את IsraBis — השוואת מחירים בין 33 רשתות, בחינם, בעברית.
            </p>
            <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
          </section>
        </div>
      </div>
    </article>
  );
}
