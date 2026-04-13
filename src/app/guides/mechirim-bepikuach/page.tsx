import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מוצרים בפיקוח מחירים ישראל — הרשימה המלאה ואיפה הכי זול | IsraBis",
  description:
    "אילו מוצרים בפיקוח מחירים בישראל? לחם, חלב, ביצים, שמן — המחיר החוקי, ומה קורה כשחנות מחייבת יותר. גלו עם IsraBis מי מכבד את הפיקוח.",
  alternates: { canonical: "https://israbis.com/guides/mechirim-bepikuach" },
  openGraph: {
    type: "article",
    title: "מוצרים בפיקוח מחירים ישראל — הרשימה המלאה",
    description:
      "אילו מוצרים בפיקוח מחירים בישראל? לחם, חלב, ביצים, שמן — המחיר החוקי ומה קורה כשחנות מחייבת יותר.",
  },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "איך לבדוק אם סופר מחייב מעל המחיר המפוקח",
  description:
    "שלב אחרי שלב — כיצד לבדוק אם הסופר שלכם מכבד את מחירי הפיקוח הרשמיים",
  totalTime: "PT3M",
  step: [
    {
      "@type": "HowToStep",
      name: "פתחו את IsraBis",
      text: "פתחו את אפליקציית IsraBis ב-iOS או ב-Android",
      position: 1,
    },
    {
      "@type": "HowToStep",
      name: "חפשו את המוצר המפוקח",
      text: "הקלידו את שם המוצר המפוקח — לדוגמה 'חלב 3%' או 'לחם אחיד'",
      position: 2,
    },
    {
      "@type": "HowToStep",
      name: "בדקו מחיר לפי הסניף שלכם",
      text: "הפעילו מיקום כדי לראות את המחיר בסניף הקרוב אליכם",
      position: 3,
    },
    {
      "@type": "HowToStep",
      name: "השוו למחיר הפיקוח הרשמי",
      text: "השוו את המחיר המוצג ב-IsraBis למחיר הפיקוח הרשמי שפרסמה משרד הכלכלה",
      position: 4,
    },
    {
      "@type": "HowToStep",
      name: "דווחו לממשלה אם יש חריגה",
      text: "אם המחיר בסניף גבוה ממחיר הפיקוח — דווחו לאגף הפיקוח על מחירים במשרד הכלכלה",
      position: 5,
    },
  ],
};

export default function MechirimBepikuachPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <article className="sec">
        <div className="w-980" style={{ maxWidth: 760 }}>
          <div className="badge" style={{ marginBottom: "var(--space-4)" }}>פיקוח מחירים</div>
          <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
            מוצרים בפיקוח מחירים בישראל — הרשימה המלאה
          </h1>
          <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>
            עדכון אחרון: אפריל 2026 &middot; 7 דקות קריאה
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                מה זה פיקוח מחירים?
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                פיקוח מחירים הוא מנגנון ממשלתי שבו המדינה קובעת מחיר מקסימום על מוצרי מזון בסיסיים — מחיר שמעליו חל איסור חוקי למכור. המטרה: להבטיח שמוצרי מזון חיוניים יישארו בהישג יד של כל האוכלוסייה, גם בתקופות של עליות מחירים.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                בישראל, פיקוח המחירים על מוצרי מזון מתנהל תחת <strong style={{ color: "var(--text)" }}>חוק הפיקוח על מחירי סחורות ושירותים</strong>, עם עדכונים שוטפים הנקבעים על ידי אגף הפיקוח על מחירים במשרד הכלכלה. הפיקוח חל על מספר מוגבל של מוצרי ליבה שנקבעו כ"מוצרים חיוניים".
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                חוק שקיפות מחירי מזון 2014 הוסיף שכבת מידע נוספת: הוא חייב את כל רשתות השיווק לפרסם את כל מחיריהן בפומבי, כך שצרכנים — ואפליקציות כמו IsraBis — יכולים לראות בזמן אמת אם רשת מוכרת מוצר מפוקח מעל המחיר המותר.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                המוצרים בפיקוח — הרשימה המלאה
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
                נכון לשנת 2026, המוצרים הבאים נמצאים תחת פיקוח מחירים פורמלי או מעקב מחירים מוגבר בישראל:
              </p>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>לחם אחיד</strong> — כיכר לחם לבן סטנדרטי (750 גרם). אחד מהמוצרים הוותיקים ביותר בפיקוח.
                </li>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>חלב טרי מלא 3%</strong> — חלב פרה סטנדרטי 1 ליטר. אחד מסמלי הפיקוח הישראלי.
                </li>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>ביצים</strong> — ביצה בגודל M. מחיר לתריסר ולמארזים מפוקח.
                </li>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>שמן קנולה</strong> — בקבוק 1 ליטר. מפוקח כמוצר יסוד בישולי.
                </li>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>קוטג' 5%</strong> — גביע 250 גרם סטנדרטי. "מחאת הקוטג'" ב-2011 הביאה להגברת הפיקוח על קטגוריה זו.
                </li>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>שמנת חמוצה 15%</strong> — גביע 200 גרם סטנדרטי.
                </li>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>גבינה לבנה 5%</strong> — אריזה סטנדרטית. מוצר חלב בסיסי תחת עקב עין ממשלתית.
                </li>
              </ul>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                חשוב להבין: פיקוח המחירים חל על גרסאות ה"סטנדרד" של המוצרים. גרסאות פרמיום, אורגניות, או בגדלי אריזה שונים אינן בהכרח מפוקחות.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                מחירי הפיקוח הרשמיים
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                מחירי הפיקוח נקבעים על ידי משרד הכלכלה ומתעדכנים מעת לעת. ממשרד הכלכלה מפרסם את המחירים המפוקחים באתר הרשמי שלו. לפי הנתונים האחרונים שפורסמו, מחירי הפיקוח המרביים כוללים:
              </p>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)", marginTop: "var(--space-3)" }}>
                <li style={{ marginBottom: "var(--space-2)" }}>לחם אחיד 750 גרם — מחיר מפוקח שנקבע על ידי המשרד</li>
                <li style={{ marginBottom: "var(--space-2)" }}>חלב טרי 3% ליטר — מחיר מרבי קבוע</li>
                <li style={{ marginBottom: "var(--space-2)" }}>ביצה בינונית M — מחיר לתריסר כפי שנקבע</li>
                <li style={{ marginBottom: "var(--space-2)" }}>שמן קנולה 1 ליטר — מחיר מרבי עדכני</li>
                <li style={{ marginBottom: "var(--space-2)" }}>קוטג' 250 גרם 5% — כפי שמפרסמת רשות המחירים</li>
              </ul>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                לרשימת המחירים המעודכנת והרשמית, בקרו באתר{" "}
                <a
                  href="https://www.gov.il/he/departments/topics/consumer-product-prices"
                  className="c-accent"
                  style={{ textDecoration: "underline" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  gov.il — פיקוח מחירי מוצרי צרכנות
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                מי מחייב מעל המחיר המפוקח?
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                מכיוון ש-IsraBis מקבלת מחירים עדכניים מכל 33 הרשתות בישראל — ניתן לראות בזמן אמת אם רשת כלשהי מוכרת מוצר מפוקח מעל המחיר המקסימלי המותר. זה לא תמיד קורה, אך בתקופות של עליות מחירים או שיבושים בשרשרת האספקה — לעיתים מוצרים מפוקחים נמכרים מעל הסף.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                IsraBis מציגה את המחיר בכל רשת וסניף, ומאפשרת לכם להשוות לא רק מי זול — אלא גם מי עומד בחוק. לחיסכון ולשקיפות כאחד.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                חוק שקיפות מחירי המזון 2014
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                חוק שקיפות מחירי המזון נכנס לתוקף ב-2014 לאחר גל מחאות הצרכנים ב-2011. החוק מחייב כל רשת שיווק עם למעלה מ-6 סניפים לפרסם את כל מחיריה בפורמט XML פתוח, הנגיש לכולם. הנתונים חייבים להתעדכן לפחות פעם ביום.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                החוק הוא הבסיס לקיומה של IsraBis: הנתונים שמאפשרים השוואת מחירים בין 33 רשתות מגיעים ישירות ממאגרי ה-XML שהרשתות מחויבות לפרסם. בלי החוק הזה, השוואה כזו לא הייתה אפשרית.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                רשת שלא מפרסמת מחיריה כנדרש — חשופה לעיצום כספי. הציבור יכול לדווח על הפרות לאגף הפיקוח על מחירים.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                מה לעשות אם הסופר מחייב יותר מהמחיר המפוקח?
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                אם גיליתם שסופרמרקט מוכר מוצר מפוקח מעל המחיר החוקי, יש לכם מה לעשות:
              </p>
              <ol className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)", marginTop: "var(--space-3)" }}>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>תעדו את הממצא</strong> — צלמו את מדף המחיר ואת הקבלה.
                </li>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>פנו למנהל הסניף</strong> — לעיתים מדובר בטעות במחירון ולא בכוונת מרמה.
                </li>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>הגישו תלונה לאגף הפיקוח על מחירים</strong> — דרך אתר gov.il של משרד הכלכלה. ניתן להגיש תלונה מקוונת עם תיעוד.
                </li>
                <li style={{ marginBottom: "var(--space-3)" }}>
                  <strong style={{ color: "var(--text)" }}>פנו למועצה הישראלית לצרכנות</strong> — גוף שמלווה צרכנים בתלונות מהסוג הזה.
                </li>
              </ol>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                חשוב: פיקוח מחירים פועל רק כשהצרכנים מכירים אותו ומשתמשים בו. כל דיווח תורם לאכיפה ולשמירה על המחירים.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                ראו מחירים בזמן אמת עם IsraBis
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                IsraBis מציגה את מחירי כל המוצרים — כולל המפוקחים — בכל 33 הרשתות, בזמן אמת. בדקו כל מוצר לפי הסניף הקרוב אליכם, ראו אם המחיר עומד בגבולות הפיקוח, וגלו איפה הכי זול.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                ראו גם:{" "}
                <Link href="/guides/hisachon-bekniyot" className="c-accent" style={{ textDecoration: "underline" }}>
                  10 טיפים לחיסכון בקניות
                </Link>{" "}
                &middot;{" "}
                <Link href="/guides/hashvaat-mechirei-super" className="c-accent" style={{ textDecoration: "underline" }}>
                  מדריך השוואת מחירי סופר
                </Link>
              </p>
            </section>

            <section>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
                הורידו את IsraBis וראו בזמן אמת אם הסופר שלכם מכבד את מחירי הפיקוח — ואיפה כדאי יותר לקנות.
              </p>
              <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
            </section>

          </div>
        </div>
      </article>
    </>
  );
}
