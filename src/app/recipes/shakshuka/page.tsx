import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מתכון שקשוקה ישראלית קלאסית — עם מחירים ב-33 רשתות | IsraBis",
  description: "מתכון שקשוקה ישראלית קלאסית עם ביצים, עגבניות, ופלפלים. עלות: ₪15-20 לפי IsraBis. זמן הכנה: 30 דקות. ל-2 מנות. ראו מחירים בזמן אמת.",
  alternates: { canonical: "https://israbis.com/recipes/shakshuka" },
  openGraph: {
    title: "מתכון שקשוקה ישראלית קלאסית — עם מחירים",
    description: "מתכון שקשוקה מושלמת ב-30 דקות. עגבניות, ביצים, ופלפלים. עלות: ₪15-20.",
    images: ["https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800"],
  },
};

const recipeSchema = {
  "@context": "https://schema.org",
  "@type": "Recipe",
  name: "שקשוקה",
  description: "מתכון שקשוקה ישראלית קלאסית עם ביצים, עגבניות, ופלפלים — ארוחת בוקר/ערב פופולרית. עלות: ₪15-20 לפי IsraBis.",
  image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800",
  author: { "@type": "Organization", name: "IsraBis", url: "https://israbis.com" },
  datePublished: "2026-04-01",
  inLanguage: "he",
  cookTime: "PT20M",
  prepTime: "PT10M",
  totalTime: "PT30M",
  recipeYield: "2 מנות",
  recipeCategory: "ארוחת בוקר",
  recipeCuisine: "Israeli",
  keywords: "שקשוקה, מתכון שקשוקה, שקשוקה ישראלית, ביצים ברוטב עגבניות",
  nutrition: {
    "@type": "NutritionInformation",
    calories: "280 kcal",
    proteinContent: "14g",
    carbohydrateContent: "18g",
    fatContent: "16g",
  },
  recipeIngredient: [
    "4 ביצים",
    "3 עגבניות בשלות",
    "2 פלפלים אדומים",
    "1 בצל בינוני",
    "3 שיני שום",
    "2 כפות רסק עגבניות",
    "1 כפית פפריקה מתוקה",
    "1/2 כפית כמון",
    "1/4 כפית פפריקה חריפה (אופציונלי)",
    "מלח ופלפל לפי הטעם",
    "2 כפות שמן זית",
  ],
  recipeInstructions: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "הכנת הירקות",
      text: "קוצצים את הבצל לקוביות קטנות, פורסים את הפלפלים לרצועות, וקוצצים את השום. חורצים X על העגבניות וחולטים 30 שניות במים רותחים לקילוף קל יותר, ואז קוצצים לקוביות גסות.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "טיגון הבסיס",
      text: "מחממים את שמן הזית בנחישייה רחבה על אש בינונית-גבוהה. מטגנים את הבצל כ-5 דקות עד שקיפות. מוסיפים את הפלפלים ומטגנים 3 דקות נוספות.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "הוספת השום והתבלינים",
      text: "מוסיפים את השום הכתוש ומטגנים 1 דקה. מוסיפים את הפפריקה, הכמון, והפפריקה החריפה אם משתמשים. מערבבים היטב.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "הוספת העגבניות",
      text: "מוסיפים את העגבניות הקצוצות ואת רסק העגבניות. מתבלים במלח ופלפל. מבשלים על אש בינונית-נמוכה 10-12 דקות עד שהרוטב מסמיך.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "הוספת הביצים",
      text: "יוצרים גומות קטנות ברוטב ושוברים ביצה לתוך כל גומה. מכסים ומבשלים 5-7 דקות עד שהחלבון קפא אבל החלמון עדיין רך. מגישים עם לחם.",
    },
  ],
};

export default function ShakshukaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }} />
      <article className="sec">
        <div className="w-980" style={{ maxWidth: 760 }}>
          <div className="badge" style={{ marginBottom: "var(--space-4)" }}>מתכון</div>
          <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
            שקשוקה ישראלית קלאסית
          </h1>
          <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>
            30 דקות &middot; 2 מנות &middot; ₪15-20 &middot; ארוחת בוקר/ערב
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>על השקשוקה</h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                שקשוקה היא אחת המנות הסמליות ביותר של המטבח הישראלי — ביצים עלומות ברוטב עגבניות עשיר ומתובל. מוצא המנה שנוי במחלוקת (תוניסיה? לוב? ישראל?), אבל אין ספק שהיא הפכה לאחת מארוחות הבוקר הפופולריות ביותר בישראל, ולאחד המאכלים הישראליים המוכרים בעולם.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                <strong style={{ color: "var(--text)" }}>עלות המנה: ₪15-20</strong> לפי נתוני IsraBis, בהתאם לרשת בה תקנו את המרכיבים. הפרש המחירים בין הרשת הזולה ליקרה על אותם מרכיבים יכול להגיע ל-₪4-6 למנה.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>מרכיבים (2 מנות)</h2>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li>4 ביצים (בינוניות-גדולות)</li>
                <li>3 עגבניות בשלות (או קופסת עגבניות מרוסקות 400 גרם)</li>
                <li>2 פלפלים אדומים</li>
                <li>1 בצל בינוני</li>
                <li>3 שיני שום</li>
                <li>2 כפות רסק עגבניות</li>
                <li>1 כפית פפריקה מתוקה</li>
                <li>1/2 כפית כמון</li>
                <li>1/4 כפית פפריקה חריפה (אופציונלי)</li>
                <li>מלח ופלפל לפי הטעם</li>
                <li>2 כפות שמן זית</li>
                <li>לגישה: לחם טרי או פיתה</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>הוראות הכנה</h2>
              <ol className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li style={{ marginBottom: "var(--space-4)" }}>
                  <strong style={{ color: "var(--text)" }}>הכנת הירקות:</strong> קוצצים את הבצל לקוביות קטנות. פורסים את הפלפלים לרצועות ואז קוצצים גס. כותשים את השום. חורצים X על העגבניות וחולטים 30 שניות במים רותחים לקילוף קל, ואז קוצצים לקוביות גסות.
                </li>
                <li style={{ marginBottom: "var(--space-4)" }}>
                  <strong style={{ color: "var(--text)" }}>טיגון הבסיס:</strong> מחממים שמן זית בנחישייה רחבה ועמוקה על אש בינונית-גבוהה. מטגנים את הבצל 5 דקות עד שמתרכך ומשקיף. מוסיפים פלפלים ומטגנים 3 דקות נוספות.
                </li>
                <li style={{ marginBottom: "var(--space-4)" }}>
                  <strong style={{ color: "var(--text)" }}>השום והתבלינים:</strong> מוסיפים שום כתוש ומטגנים דקה. שופכים את הפפריקה, כמון, וחריף. מערבבים היטב — 30 שניות, עד שהתבלינים מבושמים.
                </li>
                <li style={{ marginBottom: "var(--space-4)" }}>
                  <strong style={{ color: "var(--text)" }}>הרוטב:</strong> מוסיפים עגבניות קצוצות ורסק עגבניות. מתבלים במלח ופלפל. מבשלים על אש בינונית-נמוכה 10-12 דקות עד שהרוטב מסמיך ומעמיק בטעם. מנמיכים את האש.
                </li>
                <li style={{ marginBottom: "var(--space-4)" }}>
                  <strong style={{ color: "var(--text)" }}>הביצים:</strong> יוצרים 4 גומות ברוטב בעזרת כף. שוברים ביצה בעדינות לתוך כל גומה. מפזרים קצת מלח על הביצים. מכסים עם מכסה ומבשלים 5-7 דקות — עד שהחלבון לבן ומוצק אך החלמון עדיין זז קלות.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>טיפים לשקשוקה מושלמת</h2>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li><strong style={{ color: "var(--text)" }}>נחישייה רחבה:</strong> השתמשו בנחישייה ברזל יצוק אם יש — היא מחזיקה חום אחיד ומעניקה קרסיבות לרוטב.</li>
                <li><strong style={{ color: "var(--text)" }}>עגבניות טריות לעומת קופסה:</strong> בעונת הקיץ — עגבניות טריות. ביתר העונות — עגבניות מרוסקות מקופסת שימורים ייתנו טעם טוב יותר.</li>
                <li><strong style={{ color: "var(--text)" }}>מחם הביצה:</strong> אל תאטמו מדי — חלמון רך הוא סימן ה-DNA של שקשוקה טובה.</li>
                <li><strong style={{ color: "var(--text)" }}>וריאציות:</strong> אפשר להוסיף גבינת פטה מפוררת, זיתים קלמטה, או גבינת עיזים לרוטב לפני הביצים.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>ערכים תזונתיים (למנה)</h2>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li>קלוריות: 280 kcal</li>
                <li>חלבון: 14 גרם</li>
                <li>פחמימות: 18 גרם</li>
                <li>שומן: 16 גרם</li>
                <li>סיבים תזונתיים: 4 גרם</li>
                <li>נתרן: 380 מ"ג</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>מחירי המרכיבים — ראו בזמן אמת</h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                עלות מתכון השקשוקה לפי IsraBis: <strong style={{ color: "var(--text)" }}>₪15-20</strong> ל-2 מנות, בהתאם לרשת הקנייה. ביצים (4): כ-₪4.5-6 בהתאם לגודל ורשת. עגבניות (3): כ-₪3-5. פלפלים (2): כ-₪4-7. ביצאו מכך עלות של כ-₪7.50-10 למנה.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                הורידו את IsraBis וראו את המחיר המדויק של כל מרכיב בכל 33 הרשתות — בזמן אמת, לפי הסניף הקרוב אליכם.
              </p>
            </section>

            <section>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-3)" }}>
                מתכונים נוספים: <Link href="/recipes/hummus" className="c-accent" style={{ textDecoration: "underline" }}>חומוס ביתי</Link> &middot; <Link href="/recipes/schnitzel" className="c-accent" style={{ textDecoration: "underline" }}>שניצל ביתי</Link> &middot; <Link href="/recipes/sabich" className="c-accent" style={{ textDecoration: "underline" }}>סביח</Link>
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
                הורידו את IsraBis — גלו מחירי מרכיבים בזמן אמת, גישה למאות מתכונים ישראליים, וחסכו ₪200-500 בחודש.
              </p>
              <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
