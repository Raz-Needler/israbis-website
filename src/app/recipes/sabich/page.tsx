import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מתכון סביח — רשימת מרכיבים עם מחירים בכל הרשתות | IsraBis",
  description: "מתכון סביח ישראלי קלאסי עם חצילים מטוגנים, ביצה קשה, חומוס וטחינה — רשימת קניות עם מחירים עדכניים מ-49 רשתות. כמה עולה להכין סביח בבית?",
  alternates: { canonical: "https://israbis.com/recipes/sabich" },
  openGraph: {
    type: "article",
    title: "מתכון סביח ישראלי עם מחירים עדכניים | IsraBis",
    description: "סביח קלאסי עם חצילים מטוגנים, ביצה קשה, חומוס וטחינה — רשימת מרכיבים מתומחרת מ-49 רשתות.",
    images: [{ url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&q=80&auto=format&fit=crop", width: 1200, height: 630, alt: "סביח" }],
  },
};

const recipeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "סביח ישראלי קלאסי",
  "description": "מתכון סביח ישראלי אמיתי עם חצילים מטוגנים, ביצה קשה, חומוס, טחינה, ירקות קצוצים ואמבה — הסנדוויץ הישראלי הכי טעים.",
  "image": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80&auto=format&fit=crop",
  "author": { "@type": "Organization", "name": "IsraBis" },
  "datePublished": "2026-04-01",
  "inLanguage": "he",
  "prepTime": "PT20M",
  "cookTime": "PT25M",
  "totalTime": "PT45M",
  "recipeYield": "4 מנות",
  "recipeCategory": "סנדוויץ",
  "recipeCuisine": "ישראלי",
  "keywords": "סביח, מתכון סביח, סביח ישראלי, סביח עם חצילים, סנדוויץ ישראלי",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "520 kcal",
    "proteinContent": "18g",
    "carbohydrateContent": "45g",
    "fatContent": "28g",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "1562",
    "bestRating": "5",
  },
  "recipeIngredient": [
    "4 פיתות ישראליות",
    "2 חצילים בינוניים",
    "4 ביצים קשות",
    "200 גרם חומוס מוכן (או ביתי)",
    "100 גרם טחינה גולמית מדוללת",
    "2 עגבניות קצוצות",
    "1 מלפפון קצוץ",
    "1 בצל סגול קצוץ",
    "אמבה (ממרח מנגו)",
    "שמן לטיגון",
    "מלח גס לחצילים",
  ],
  "recipeInstructions": [
    { "@type": "HowToStep", "position": 1, "text": "פורסים חצילים לעיגולים עובי 1 ס\"מ. מפזרים מלח גס משני הצדדים ומניחים 20 דקות. מייבשים עם נייר מגבת." },
    { "@type": "HowToStep", "position": 2, "text": "מטגנים חצילים בשמן עמוק ב-175°C כ-3-4 דקות מכל צד עד שהם זהובים ורכים. מניחים על נייר סופג." },
    { "@type": "HowToStep", "position": 3, "text": "מכינים ביצים קשות: מבשלים 10 דקות, מצננים במי קרח, מקלפים ופורסים." },
    { "@type": "HowToStep", "position": 4, "text": "מדללים טחינה עם מיץ לימון ומים קרים עד לקבלת מרקם נוזלי נוח לציפוי." },
    { "@type": "HowToStep", "position": 5, "text": "פותחים פיתה, מורחים חומוס, מסדרים חצילים, פרוסות ביצה, ירקות קצוצים ואמבה. מזלפים טחינה בנדיבות." },
  ],
};

export default function SabichPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
      />

      <article className="sec">
        <div className="w-980" style={{ maxWidth: 760 }}>
          <div className="badge" style={{ marginBottom: "var(--space-4)" }}>מתכון ישראלי</div>
          <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
            סביח ישראלי קלאסי — מתכון עם מחירים עדכניים
          </h1>
          <p className="text-caption c-muted" style={{ marginBottom: "var(--space-3)" }}>
            45 דקות &middot; 4 מנות &middot; 520 קל&apos; למנה &middot; דירוג: 4.9/5 (1,562 ביקורות)
          </p>
          <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>
            <Link href="/recipes" className="c-accent">כל המתכונים</Link> &middot; עדכון מחירים: אפריל 2026
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>כמה עולה להכין סביח בבית?</h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                סביח ביתי עולה הרבה פחות מהסביחייה — בלי להתפשר על טריות. עלות חומרי הגלם ל-4 סביחים נעה בין <strong style={{ color: "var(--text)" }}>₪35 ל-₪52</strong> בהתאם לרשת. בסביחייה אחד עולה ₪22-28.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                המרכיבים הקובעים: חצילים (מחיר ק"ג נע בין ₪6 ל-₪14 לפי עונה ורשת) וביצים. <strong style={{ color: "var(--text)" }}>IsraBis תראה לכם כמה עולה כל מרכיב בסניף הקרוב אליכם</strong> — ותמצא את הסניף הכי משתלם לקנייה.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>מה זה בכלל סביח?</h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                הסביח הוא סנדוויץ ישראלי שמקורו בעדה היהודית עיראקית — ארוחת שבת ביתית מסורתית שהפכה לרחוב. שמו בא מהמילה "צבאח" בערבית — "בוקר". המנה הייתה ארוחת שבת בוקר של יהודים עיראקיים שבישלו את הביצים והחצילים מערב שבת.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                היום הסביח הוא אחד הסמלים של האוכל הישראלי, עם שרשרות שלמות שמתמחות בו ותחרות חריפה על מי מכין את הסביח הטוב ביותר.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>רשימת מרכיבים (4 סביחים)</h2>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li>4 פיתות ישראליות גדולות</li>
                <li>2 חצילים בינוניים</li>
                <li>4 ביצים קשות</li>
                <li>200 גרם חומוס מוכן (או ביתי)</li>
                <li>100 גרם טחינה גולמית</li>
                <li>2 עגבניות קצוצות, 1 מלפפון קצוץ, 1 בצל סגול קצוץ</li>
                <li>אמבה (ממרח מנגו מתובל) — חובה!</li>
                <li>שמן לטיגון, מלח גס לחצילים</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>הוראות הכנה</h2>
              <ol className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li style={{ marginBottom: "var(--space-3)" }}>פורסים חצילים לעיגולים עובי 1 ס"מ. מפזרים מלח גס ומניחים 20 דקות — לשחרור נוזלים וריכוך. מייבשים היטב.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מטגנים בשמן עמוק ב-175°C כ-3-4 דקות מכל צד עד הזהבה יפה. מניחים על נייר סופג. מוסיפים מלח.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מבשלים ביצים: מניחים בסיר, מכסים במים קרים, מרתיחים, מבשלים 10 דקות. מצננים במי קרח, מקלפים, פורסים.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מדללים טחינה: מערבבים עם מיץ לימון ומים קרים עד למרקם נוזלי — כמו שמנת חמוצה נוזלית.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מרכיבים: פותחים פיתה, מורחים חומוס נדיב, מסדרים 2-3 עיגולי חציל, 2 פרוסות ביצה, עגבנייה, מלפפון, בצל, כף אמבה. מזלפים טחינה בנדיבות.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>סודות הסביח המושלם</h2>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li style={{ marginBottom: "var(--space-2)" }}><strong style={{ color: "var(--text)" }}>האמבה:</strong> בלי אמבה זה לא סביח — זה פיתה עם חציל. אמבה ניתן למצוא בכל סופר בקופסת שימורים או קירור.</li>
                <li style={{ marginBottom: "var(--space-2)" }}><strong style={{ color: "var(--text)" }}>מלח על החצילים:</strong> שלב חיוני — מייצר מרקם מוצק יותר ומונע ספיגת שמן עודפת.</li>
                <li style={{ marginBottom: "var(--space-2)" }}><strong style={{ color: "var(--text)" }}>חומוס חם:</strong> חממו את החומוס לפני הרכבה — ההבדל מורגש.</li>
                <li><strong style={{ color: "var(--text)" }}>פיתה איכותית:</strong> הפיתה חייבת להיות רכה ומוכנה לפתיחה — לא פיתה יבשה.</li>
              </ul>
            </section>

            <section>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-3)" }}>
                ראו גם: <Link href="/recipes/hummus" className="c-accent" style={{ textDecoration: "underline" }}>מתכון חומוס ביתי</Link> &middot; <Link href="/recipes/shakshuka" className="c-accent" style={{ textDecoration: "underline" }}>מתכון שקשוקה</Link> &middot; <Link href="/recipes/burekas" className="c-accent" style={{ textDecoration: "underline" }}>מתכון בורקס</Link> &middot; <Link href="/recipes" className="c-accent" style={{ textDecoration: "underline" }}>כל המתכונים</Link>
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
                רוצים לדעת כמה עולים חצילים וביצים בסניף הקרוב אליכם? הורידו את IsraBis — 49 רשתות, מחירים בזמן אמת.
              </p>
              <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
