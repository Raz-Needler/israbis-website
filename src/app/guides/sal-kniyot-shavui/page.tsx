import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "סל קניות שבועי ישראל 2026 — כמה עולה ואיפה הכי זול | IsraBis",
  description:
    "כמה עולה סל קניות שבועי לארבעה נפשות בישראל? לפי נתוני IsraBis — השוואה בין כל הרשתות. טיפים לחיסכון של ₪300-500 בחודש.",
  alternates: { canonical: "https://israbis.com/guides/sal-kniyot-shavui" },
  openGraph: {
    type: "article",
    title: "סל קניות שבועי ישראל 2026 — כמה עולה ואיפה הכי זול",
    description:
      "כמה עולה סל קניות שבועי לארבעה נפשות? השוואת מחירים בין הרשתות וטיפים לחיסכון.",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "איך לתכנן סל קניות שבועי חסכוני",
  description:
    "מדריך שלב אחרי שלב לתכנון סל קניות שבועי שחוסך ₪300-500 בחודש",
  totalTime: "PT15M",
  step: [
    {
      "@type": "HowToStep",
      name: "תכננו תפריט שבועי",
      text: "לפני הקנייה, תכננו את הארוחות לכל שבוע. ידיעה מה תבשלו מונעת קניות מיותרות ובזבוז מזון.",
      position: 1,
    },
    {
      "@type": "HowToStep",
      name: "בנו רשימת קניות מדויקת",
      text: "כתבו רשימה עם כמויות מדויקות לכל מוצר. אל תסמכו על זיכרון — רשימה מדויקת חוסכת קנייה כפולה.",
      position: 2,
    },
    {
      "@type": "HowToStep",
      name: "הוסיפו את הסל ל-IsraBis",
      text: "פתחו את IsraBis והוסיפו את כל המוצרים מהרשימה לעגלה הדיגיטלית.",
      position: 3,
    },
    {
      "@type": "HowToStep",
      name: "השוו מחירים בין הרשתות",
      text: "IsraBis מציגה את עלות העגלה הכוללת בכל 33 הרשתות — בחרו את הזולה ביותר עבור הסל שלכם.",
      position: 4,
    },
    {
      "@type": "HowToStep",
      name: "צאו לקנות בביטחון",
      text: "כעת יש לכם: רשימה מדויקת, מחיר ידוע מראש, והרשת הזולה ביותר לסל שלכם. חסכתם זמן, כסף, ועצבים.",
      position: 5,
    },
  ],
};

export default function SalKniyotShavuiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <article className="sec">
        <div className="w-980" style={{ maxWidth: 760 }}>
          <div className="badge" style={{ marginBottom: "var(--space-4)" }}>תכנון קניות</div>
          <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
            סל קניות שבועי ישראל 2026 — כמה עולה ואיפה הכי זול
          </h1>
          <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>
            עדכון אחרון: אפריל 2026 &middot; 8 דקות קריאה
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                כמה עולה סל קניות שבועי בישראל?
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                משפחה ישראלית ממוצעת בת ארבע נפשות מוציאה <strong style={{ color: "var(--text)" }}>₪2,200-3,100 בחודש</strong> על מזון ומוצרי בית — זה ₪550-780 בשבוע. ישראל היא אחת המדינות היקרות ב-OECD בתחום המזון, עם הוצאות מזון הגבוהות ב-52% מהממוצע האירופי.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                הנתון המפתיע: <strong style={{ color: "var(--text)" }}>אותו סל קניות שבועי יכול לעלות ₪200-400 פחות</strong> ברשת אחת לעומת אחרת. לפי נתוני IsraBis, ההפרש בין הרשת הזולה ליקרה על סל בסיסי של 50 מוצרים הוא 21%. זה ₪2,400-4,800 בשנה שנשארים בכיס — אם בוחרים נכון.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                סל קניות שבועי לארבעה נפשות — הרכב מומלץ
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
                להלן הרכב מומלץ לסל קניות שבועי ריאלי לארבעה נפשות:
              </p>

              <p className="text-body" style={{ color: "var(--text)", fontWeight: 600, marginBottom: "var(--space-2)" }}>מוצרי חלב:</p>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                <li>חלב 2L (x2)</li>
                <li>קוטג' 250 גרם (x2)</li>
                <li>יוגורט 150 גרם (x4)</li>
                <li>גבינה צהובה 250 גרם</li>
                <li>שמנת חמוצה 200 גרם</li>
              </ul>

              <p className="text-body" style={{ color: "var(--text)", fontWeight: 600, marginBottom: "var(--space-2)" }}>ירקות ופירות:</p>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                <li>עגבנייה 1 ק"ג</li>
                <li>מלפפון 1 ק"ג</li>
                <li>פלפל צהוב/אדום (x3)</li>
                <li>גזר 1 ק"ג</li>
                <li>בצל 1 ק"ג</li>
                <li>תפוח 1 ק"ג</li>
                <li>בננה 1 ק"ג</li>
              </ul>

              <p className="text-body" style={{ color: "var(--text)", fontWeight: 600, marginBottom: "var(--space-2)" }}>בשר ועוף:</p>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                <li>חזה עוף 1 ק"ג</li>
                <li>בקר טחון 500 גרם</li>
              </ul>

              <p className="text-body" style={{ color: "var(--text)", fontWeight: 600, marginBottom: "var(--space-2)" }}>מוצרי יסוד:</p>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                <li>לחם כיכר (x2)</li>
                <li>ביצים x12</li>
                <li>שמן קנולה 1 ליטר</li>
                <li>פסטה 500 גרם (x2)</li>
                <li>אורז 1 ק"ג</li>
                <li>קפה גרגרים/טחון 250 גרם</li>
              </ul>

              <p className="text-body" style={{ color: "var(--text)", fontWeight: 600, marginBottom: "var(--space-2)" }}>קפואים ושימורים:</p>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                <li>גרגרי תירס קפוא 400 גרם</li>
                <li>עגבניות מרוסקות 400 גרם (x2)</li>
                <li>טונה בשמן (x4)</li>
              </ul>

              <p className="text-body" style={{ color: "var(--text)", fontWeight: 600, marginBottom: "var(--space-2)" }}>מוצרי ניקוי:</p>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li>סבון כלים 750 מ"ל</li>
                <li>נייר טואלט x9</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                עלות הסל לפי רשת — כמה תחסכו?
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                לפי נתוני IsraBis, אותה עגלה שבועית עשויה לעלות סכומים שונים מאוד בין הרשתות. ההפרש בין הרשת הזולה ביותר לרשת היקרה ביותר על עגלה שבועית מלאה נע בין <strong style={{ color: "var(--text)" }}>₪200 ל-₪400</strong>.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                המשמעות: משפחה שעוברת מהרשת הממוצעת לרשת הזולה ביותר לעגלה שלה — חוסכת <strong style={{ color: "var(--text)" }}>₪300-500 בחודש</strong>, ובשנה זה ₪3,600-6,000.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                כדי לדעת מה הרשת הזולה לעגלה הספציפית שלכם — השתמשו ב-IsraBis. ההשוואה היא על הסל שלכם, בסניפים הקרובים אליכם, עם המחירים של היום.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                5 טיפים לחיסכון על סל הקניות השבועי
              </h2>
              <ol className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li style={{ marginBottom: "var(--space-4)" }}>
                  <strong style={{ color: "var(--text)" }}>קנו מותג פרטי על מוצרי יסוד</strong> — קמח, סוכר, אורז, פסטה, שמן — ההבדל האיכותי בין מותג פרטי לממותג הוא מינימלי, אבל ההפרש במחיר מגיע ל-30-40%.
                </li>
                <li style={{ marginBottom: "var(--space-4)" }}>
                  <strong style={{ color: "var(--text)" }}>קנו בכמות על מוצרים לא מתכלים</strong> — נייר טואלט, שימורים, קפה, אורז — קנייה בכמות מורידה את המחיר ליחידה ב-15-25%.
                </li>
                <li style={{ marginBottom: "var(--space-4)" }}>
                  <strong style={{ color: "var(--text)" }}>תכננו ארוחות לפני הקנייה</strong> — קנייה ללא תפריט מוגדר מובילה לרכישות מיותרות ובזבוז מזון. תפריט שבועי מראש חוסך ₪100-200 על סל ממוצע.
                </li>
                <li style={{ marginBottom: "var(--space-4)" }}>
                  <strong style={{ color: "var(--text)" }}>השוו עם IsraBis לפני היציאה מהבית</strong> — 5 דקות של השוואה לפני היציאה לסופר חוסכות יותר זמן וכסף מכל דבר אחר. בנו את העגלה, ראו איפה הזולה, ואז צאו.
                </li>
                <li style={{ marginBottom: "var(--space-4)" }}>
                  <strong style={{ color: "var(--text)" }}>קנו ירקות ופירות עונתיים</strong> — עגבניות בקיץ, תפוזים בחורף, קישואים בסתיו — מחיר הירקות העונתיים יכול להיות פי 2-3 נמוך ממחירם מחוץ לעונה.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                סל שבת — קניות לשבת בפחות
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                ארוחות שבת הן אחת ההוצאות הגדולות ביותר בסל השבועי הישראלי. בשר, דגים, עוגות, יין — כל אלה מצטרפים לסכום משמעותי. הנה כמה דרכים לצמצם:
              </p>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)", marginTop: "var(--space-3)" }}>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>קנו בשר ביום חמישי בערב</strong> — רבים מהמשחטות והסופרמרקטים מוזילים בשר שצריך להגיע לסוף יום העבודה לפני שבת.
                </li>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>השוו מחיר יין ושתייה ברשתות</strong> — הפרשי המחירים על יין ושתייה בין הרשתות גדולים במיוחד. IsraBis תמצא את המחיר הטוב ביותר.
                </li>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>אפו בבית במקום לקנות עוגות</strong> — עוגה ביתית עולה כשליש ממחיר עוגה קנויה, ובדרך כלל טעימה יותר.
                </li>
              </ul>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                שבת היא ארוחה שמשפחות רבות מרגישות "חייבות" להשקיע בה — וזה לגיטימי לחלוטין. אבל עם תכנון נכון, ניתן להוציא ₪100-150 פחות על ארוחת שבת בלי לפגוע ברמה.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                תכנון תפריט שבועי לפי תקציב
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                תכנון תפריט שבועי לפי תקציב הוא אחד הכלים החזקים ביותר לחיסכון. המתכון הפשוט:
              </p>
              <ol className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)", marginTop: "var(--space-3)" }}>
                <li style={{ marginBottom: "var(--space-3)" }}>קבעו תקציב שבועי: לדוגמה, ₪600 לארבע נפשות.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>תכננו 5 ארוחות ערב, 5 ארוחות צהריים, 7 ארוחות בוקר.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>בנו רשימה מדויקת על בסיס התפריט.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>הוסיפו ל-IsraBis ובדקו אם הסל עומד בתקציב.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>אם חורגים — החליפו מוצרים ממותגים בפרטי, או הפחיתו בכמויות בשר.</li>
              </ol>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                IsraBis מציעה מאות מתכונים עם מחירים בזמן אמת — כך שאתם יכולים לתכנן ארוחות ולדעת מראש כמה כל ארוחה תעלה, ובאיזו רשת הכי כדאי לקנות את המרכיבים.
              </p>
            </section>

            <section>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-3)" }}>
                ראו גם:{" "}
                <Link href="/guides/hisachon-bekniyot" className="c-accent" style={{ textDecoration: "underline" }}>
                  10 טיפים לחיסכון בקניות
                </Link>{" "}
                &middot;{" "}
                <Link href="/guides/mivtzaim-shavua" className="c-accent" style={{ textDecoration: "underline" }}>
                  איך לנצל מבצעים חכם
                </Link>{" "}
                &middot;{" "}
                <Link href="/stores" className="c-accent" style={{ textDecoration: "underline" }}>
                  השוואת מחירים בין רשתות
                </Link>
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
                רוצים לדעת כמה יעלה הסל השבועי שלכם? הורידו את IsraBis — בנו עגלה וראו השוואה מלאה בין 33 רשתות.
              </p>
              <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
            </section>

          </div>
        </div>
      </article>
    </>
  );
}
