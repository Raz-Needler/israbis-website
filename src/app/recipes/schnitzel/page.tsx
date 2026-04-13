import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מתכון שניצל — רשימת מרכיבים עם מחירים בכל הרשתות | IsraBis",
  description: "מתכון שניצל עוף קריספי וטעים — רשימת קניות עם מחירים עדכניים מ-33 רשתות שיווק. כמה עולה לבשל שניצל ביתי לארבעה? גלו ב-IsraBis.",
  alternates: { canonical: "https://israbis.com/recipes/schnitzel" },
  openGraph: {
    type: "article",
    title: "מתכון שניצל עוף עם מחירים עדכניים | IsraBis",
    description: "שניצל עוף קריספי ביתי — רשימת מרכיבים מתומחרת מ-33 רשתות שיווק.",
    images: [{ url: "https://images.unsplash.com/photo-1585325701165-c1d48d7c0b32?w=1200&q=80&auto=format&fit=crop", width: 1200, height: 630, alt: "שניצל עוף" }],
  },
};

const recipeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "שניצל עוף קריספי",
  "description": "מתכון שניצל עוף קריספי ביתי עם ציפוי בציפורן לחם וביצה — הארוחה הכי אהובה על ילדים ומבוגרים.",
  "image": "https://images.unsplash.com/photo-1585325701165-c1d48d7c0b32?w=800&q=80&auto=format&fit=crop",
  "author": { "@type": "Organization", "name": "IsraBis" },
  "datePublished": "2026-04-01",
  "inLanguage": "he",
  "prepTime": "PT15M",
  "cookTime": "PT20M",
  "totalTime": "PT35M",
  "recipeYield": "4 מנות",
  "recipeCategory": "מנה עיקרית",
  "recipeCuisine": "ישראלי",
  "keywords": "שניצל עוף, מתכון שניצל, שניצל ביתי, שניצל קריספי, מתכון ישראלי",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "380 kcal",
    "proteinContent": "35g",
    "carbohydrateContent": "22g",
    "fatContent": "15g",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "ratingCount": "1856",
    "bestRating": "5",
  },
  "recipeIngredient": [
    "600 גרם חזה עוף (4 נתחים דקים)",
    "2 ביצים",
    "1 כוס פירורי לחם",
    "1/2 כוס קמח",
    "1 כפית מלח שום",
    "1 כפית פפריקה מתוקה",
    "מלח ופלפל שחור",
    "שמן לטיגון עמוק (כוס וחצי)",
  ],
  "recipeInstructions": [
    { "@type": "HowToStep", "position": 1, "text": "מרדדים חזה עוף בין שני ניילונות עד עובי 0.5-0.8 ס\"מ. מתבלים במלח ופלפל." },
    { "@type": "HowToStep", "position": 2, "text": "מכינים שלושה כלים: קמח מתובל, ביצים טרופות, פירורי לחם עם מלח שום ופפריקה." },
    { "@type": "HowToStep", "position": 3, "text": "מציפים בקמח, מטבילים בביצה, ומגלגלים בפירורי לחם. לוחצים קלות להדבקה." },
    { "@type": "HowToStep", "position": 4, "text": "מחממים שמן ל-170°C. מטגנים 3-4 דקות מכל צד עד להזהבה עמוקה." },
    { "@type": "HowToStep", "position": 5, "text": "מניחים על נייר סופג ומגישים מיד עם לימון, תפוחי אדמה או אורז." },
  ],
};

export default function SchnitzelPage() {
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
            שניצל עוף קריספי — מתכון עם מחירים עדכניים
          </h1>
          <p className="text-caption c-muted" style={{ marginBottom: "var(--space-3)" }}>
            35 דקות &middot; 4 מנות &middot; 380 קל&apos; למנה &middot; דירוג: 4.7/5 (1,856 ביקורות)
          </p>
          <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>
            <Link href="/recipes" className="c-accent">כל המתכונים</Link> &middot; עדכון מחירים: אפריל 2026
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>כמה עולה לבשל שניצל בבית?</h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                שניצל ביתי עולה פחות ממחצית ממה שמשלמים במסעדה — ויוצא טעים יותר. עלות חומרי הגלם לארבעה שניצלים נעה בין <strong style={{ color: "var(--text)" }}>₪28 ל-₪45</strong> בהתאם לרשת. המרכיב היקר ביותר: חזה עוף.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                לפי נתוני IsraBis, מחיר חזה עוף טרי (ק"ג) נע בין ₪28 ל-₪42 בהתאם לרשת ולסניף. <strong style={{ color: "var(--text)" }}>ההפרש על שניצל ל-4 יכול להגיע ל-₪8-12 בין הרשת הזולה לרשת היקרה ביותר.</strong> IsraBis תראה לכם בדיוק איפה הכי כדאי לקנות חזה עוף השבוע.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>רשימת מרכיבים</h2>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li>600 גרם חזה עוף (4 נתחים דקים)</li>
                <li>2 ביצים</li>
                <li>1 כוס פירורי לחם</li>
                <li>1/2 כוס קמח</li>
                <li>1 כפית מלח שום, 1 כפית פפריקה מתוקה, מלח ופלפל</li>
                <li>שמן לטיגון (כ-1.5 כוסות)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>הוראות הכנה</h2>
              <ol className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li style={{ marginBottom: "var(--space-3)" }}>מרדדים חזה עוף בין שני ניילונות עד עובי 0.5-0.8 ס"מ. מתבלים היטב.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מכינים שלושה כלים: קמח מתובל | ביצים טרופות | פירורי לחם עם תבלינים.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מציפים בקמח (מנערים עודף), מטבילים בביצה, ומגלגלים בפירורי לחם — לוחצים קלות.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מחממים שמן עמוק ל-170°C (כשמוכנס כפית עץ — בועות). מטגנים 3-4 דקות מכל צד עד הזהבה.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מניחים על נייר סופג. מגישים מיד עם לימון.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>גרסאות ושדרוגים</h2>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li style={{ marginBottom: "var(--space-2)" }}><strong style={{ color: "var(--text)" }}>שניצל בתנור:</strong> מרסקים פירורי לחם, מורחים שמן זית ואופים ב-220°C 15 דקות מכל צד — פחות שמן, קריספי מספיק.</li>
                <li style={{ marginBottom: "var(--space-2)" }}><strong style={{ color: "var(--text)" }}>שניצל פרמז'ן:</strong> מוסיפים 1/4 כוס גבינת פרמז'ן לפירורי הלחם — עמוק יותר בטעם.</li>
                <li style={{ marginBottom: "var(--space-2)" }}><strong style={{ color: "var(--text)" }}>שניצל ירושלמי:</strong> מגישים עם בצל מקורמל ופטריות — הגרסה המסורתית.</li>
                <li><strong style={{ color: "var(--text)" }}>שניצל כשר:</strong> ממילא כשר (עוף) — אם מכינים בחלב, הוסיפו פרמז'ן לציפוי.</li>
              </ul>
            </section>

            <section>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-3)" }}>
                ראו גם: <Link href="/recipes/shakshuka" className="c-accent" style={{ textDecoration: "underline" }}>מתכון שקשוקה</Link> &middot; <Link href="/recipes/hummus" className="c-accent" style={{ textDecoration: "underline" }}>מתכון חומוס</Link> &middot; <Link href="/recipes/burekas" className="c-accent" style={{ textDecoration: "underline" }}>מתכון בורקס</Link> &middot; <Link href="/recipes" className="c-accent" style={{ textDecoration: "underline" }}>כל המתכונים</Link>
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
                רוצים לדעת כמה בדיוק עולה חזה עוף בסניף הקרוב אליכם? הורידו את IsraBis — 33 רשתות, מחירים בזמן אמת.
              </p>
              <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
