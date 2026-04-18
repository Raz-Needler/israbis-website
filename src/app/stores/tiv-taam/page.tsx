import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "השוואת מחירים טיב טעם — מחירי טיב טעם מול 32 רשתות שיווק | IsraBis",
  description: "מחירי טיב טעם עם השוואה אוטומטית ל-32 רשתות שיווק נוספות. מוצרי non-kosher, ים תיכוני, ואורגני — כמה עולים? IsraBis, 255,000 מוצרים, עדכון יומי.",
  alternates: { canonical: "https://israbis.com/stores/tiv-taam" },
  openGraph: {
    title: "מחירים בטיב טעם לעומת 32 רשתות",
    description: "בדקו מחירי טיב טעם מול שופרסל, ויקטורי, ועוד 46 רשתות — בלחיצה אחת.",
  },
};

export default function TivTaamPage() {
  return (
    <article className="sec">
      <div className="w-980" style={{ maxWidth: 760 }}>
        <div className="badge" style={{ marginBottom: "var(--space-4)" }}>טיב טעם</div>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
          מחירי טיב טעם — השוואה ל-32 רשתות שיווק
        </h1>
        <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>עדכון אחרון: אפריל 2026 &middot; 4 דקות קריאה</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>טיב טעם — הרשת הייחודית</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              טיב טעם היא רשת שיווק ישראלית ייחודית המתמחה במוצרים שאינם כשרים, ים תיכוניים, ואורגניים. הרשת פנתה מאז ומתמיד לקהל שמחפש מגוון גדול יותר של מוצרים, כולל בשר חזיר, פירות ים, ומוצרים בינלאומיים שאינם זמינים ברשתות כשרות.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
              <strong style={{ color: "var(--text)" }}>לטיב טעם כ-35 סניפים</strong> ברחבי ישראל, עם ריכוז גבוה בגוש דן, חיפה, ואזורים עם אוכלוסייה לא דתית. מבחינת מחירים, טיב טעם נמצאת לרוב בטווח הבינוני — לא הזולה ביותר, אבל גם לא היקרה. הייחוד שלה הוא המגוון.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>נתוני טיב טעם ב-IsraBis</h2>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
              <li>מספר מוצרים: מעל 30,000 מוצרים ייחודיים מטיב טעם</li>
              <li>עדכון מחירים: כל 4 שעות, ישירות מהמאגר הממשלתי</li>
              <li>סניפים: כ-35 סניפים ברחבי ישראל</li>
              <li>מסמך XML: מתפרסם יומיומית לפי חוק שקיפות מחירי מזון 2014</li>
              <li>דיוק: נתוני מחיר ספציפיים לסניף</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>טיב טעם מול שאר הרשתות — ניתוח שוק</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              לפי נתוני IsraBis, השוואת מחירים בטיב טעם מול שאר הרשתות מציגה תמונה מורכבת:
            </p>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)", marginTop: "var(--space-3)" }}>
              <li><strong style={{ color: "var(--text)" }}>מוצרים בסיסיים:</strong> מחירים דומים לשופרסל, לרוב יקרים יותר מרמי לוי</li>
              <li><strong style={{ color: "var(--text)" }}>מוצרים ייחודיים/יבוא:</strong> מחירים תחרותיים כיוון שטיב טעם מתמחה בהם</li>
              <li><strong style={{ color: "var(--text)" }}>בשר ועוף:</strong> מחירים לעיתים תחרותיים, עם מבחר גדול יותר</li>
              <li><strong style={{ color: "var(--text)" }}>ירקות ופירות:</strong> איכות גבוהה לרוב, מחירים בינוניים-גבוהים</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>מי מתאים לקנות בטיב טעם?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              טיב טעם מתאימה בעיקר לצרכנים שמחפשים:
            </p>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)", marginTop: "var(--space-3)" }}>
              <li>מוצרים שאינם כשרים (בשר חזיר, שרימפס, מאכלי ים)</li>
              <li>מוצרים ים תיכוניים ובינלאומיים שאינם זמינים במקום אחר</li>
              <li>מוצרים אורגניים ובריאות עם מגוון רחב</li>
              <li>יינות ומשקאות עם מגוון גדול</li>
            </ul>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
              לקנייה של מוצרי יסוד כשרים בלבד — ייתכן שרמי לוי, ויקטורי, או מחסני השוק ייצאו זולים יותר. IsraBis תאפשר לכם לראות בדיוק את ההשוואה על המוצרים שלכם.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>איך להשוות מחירי טיב טעם עם IsraBis?</h2>
            <ol className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
              <li style={{ marginBottom: "var(--space-3)" }}>הורידו את IsraBis בחינם (iOS או Android)</li>
              <li style={{ marginBottom: "var(--space-3)" }}>הפעילו מיקום — IsraBis תמצא את הסניף הקרוב</li>
              <li style={{ marginBottom: "var(--space-3)" }}>חפשו מוצרים ספציפיים שאתם קונים בטיב טעם</li>
              <li style={{ marginBottom: "var(--space-3)" }}>ראו השוואה מלאה לכל 49 הרשתות</li>
              <li style={{ marginBottom: "var(--space-3)" }}>חסכו כסף על מה שאפשר, קנו בטיב טעם מה שייחודי לה</li>
            </ol>
          </section>

          <section>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-3)" }}>
              ראו גם: <Link href="/stores/victory" className="c-accent" style={{ textDecoration: "underline" }}>מחירי ויקטורי</Link> &middot; <Link href="/stores/yochananof" className="c-accent" style={{ textDecoration: "underline" }}>מחירי יוחננוף</Link> &middot; <Link href="/stores" className="c-accent" style={{ textDecoration: "underline" }}>כל הרשתות</Link>
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
              רוצים לדעת מה מחיר מוצר ספציפי בטיב טעם? הורידו את IsraBis — השוואת מחירים בין 49 רשתות, בחינם, בעברית.
            </p>
            <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
          </section>
        </div>
      </div>
    </article>
  );
}
