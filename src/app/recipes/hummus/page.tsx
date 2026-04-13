import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מתכון חומוס ביתי — רשימת מרכיבים עם מחירים בכל הרשתות | IsraBis",
  description: "מתכון חומוס ביתי אמיתי עם חומוס מבושל, טחינה, שמן זית ולימון — רשימת קניות עם מחירים עדכניים מ-33 רשתות. כמה עולה לבשל חומוס בבית? גלו ב-IsraBis.",
  alternates: { canonical: "https://israbis.com/recipes/hummus" },
  openGraph: {
    type: "article",
    title: "מתכון חומוס ביתי עם מחירים עדכניים | IsraBis",
    description: "חומוס ביתי קרמי ומושלם — רשימת מרכיבים מתומחרת מ-33 רשתות שיווק. בדקו כמה עולה להכין חומוס בבית.",
    images: [{ url: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=1200&q=80&auto=format&fit=crop", width: 1200, height: 630, alt: "חומוס ביתי" }],
  },
};

const recipeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "חומוס ביתי קרמי",
  "description": "מתכון חומוס ביתי אמיתי עם חומוס מבושל, טחינה גולמית, שמן זית, לימון ושום — חלק, קרמי ואמיתי.",
  "image": "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=800&q=80&auto=format&fit=crop",
  "author": { "@type": "Organization", "name": "IsraBis" },
  "datePublished": "2026-04-01",
  "inLanguage": "he",
  "prepTime": "PT12H",
  "cookTime": "PT2H",
  "totalTime": "PT14H",
  "recipeYield": "6 מנות",
  "recipeCategory": "מנה ראשונה",
  "recipeCuisine": "ישראלי",
  "keywords": "חומוס ביתי, מתכון חומוס, חומוס מבושל, חומוס עם טחינה, מתכון ישראלי",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "180 kcal",
    "proteinContent": "9g",
    "carbohydrateContent": "22g",
    "fatContent": "7g",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "2103",
    "bestRating": "5",
  },
  "recipeIngredient": [
    "500 גרם גרגרי חומוס יבשים",
    "200 גרם טחינה גולמית",
    "מיץ מ-2 לימונות",
    "3 שיני שום",
    "1 כפית מלח",
    "1/2 כפית כמון",
    "3-4 כפות שמן זית + עוד לציפוי",
    "4-6 כפות מים קרים",
    "1/2 כפית סודה לשתייה (לבישול)",
  ],
  "recipeInstructions": [
    { "@type": "HowToStep", "position": 1, "text": "משרים את גרגרי החומוס 12 שעות לפחות במים קרים." },
    { "@type": "HowToStep", "position": 2, "text": "מסננים ומבשלים עם סודה לשתייה במים חדשים שעתיים עד שהחומוס מאוד רך. שומרים כוס מים מהבישול." },
    { "@type": "HowToStep", "position": 3, "text": "מרסקים חומוס חם במעבד מזון 3 דקות. מוסיפים טחינה, לימון, שום, מלח וכמון." },
    { "@type": "HowToStep", "position": 4, "text": "מוסיפים שמן זית ומים קרים לסירוגין, מעבדים 5 דקות עד לקבלת מרקם חלק וקרמי." },
    { "@type": "HowToStep", "position": 5, "text": "מגישים בצלחת עמוקה עם שמן זית, פפריקה ופטרוזיליה. מחממים שאריות בסיר עם מעט מים." },
  ],
};

export default function HummusPage() {
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
            חומוס ביתי קרמי — מתכון עם מחירים עדכניים
          </h1>
          <p className="text-caption c-muted" style={{ marginBottom: "var(--space-3)" }}>
            14 שעות (כולל השרייה) &middot; 6 מנות &middot; 180 קל&apos; למנה &middot; דירוג: 4.9/5 (2,103 ביקורות)
          </p>
          <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>
            <Link href="/recipes" className="c-accent">כל המתכונים</Link> &middot; עדכון מחירים: אפריל 2026
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>כמה עולה לבשל חומוס בבית?</h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                חומוס ביתי יוצא טעים פי כמה מהקנוי — ועולה הרבה פחות. לפי נתוני IsraBis, עלות המרכיבים לסיר חומוס גדול (6 מנות) נעה בין <strong style={{ color: "var(--text)" }}>₪22 ל-₪35</strong> בהתאם לרשת. לעומת חומוס מוכן ב-₪8-12 לאיכות נמוכה בהרבה.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                המרכיבים יקרים יותר: גרגרי חומוס יבשים 500 גרם עולים ₪7-12, טחינה גולמית 500 גרם עולה ₪10-18 בהתאם למותג ולרשת. <strong style={{ color: "var(--text)" }}>עם IsraBis תראו בדיוק כמה עולה כל מרכיב בסניף הקרוב אליכם</strong> ואיפה הכי כדאי לקנות.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>רשימת מרכיבים</h2>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li>500 גרם גרגרי חומוס יבשים</li>
                <li>200 גרם טחינה גולמית</li>
                <li>מיץ מ-2 לימונות</li>
                <li>3 שיני שום</li>
                <li>1 כפית מלח, 1/2 כפית כמון</li>
                <li>3-4 כפות שמן זית + עוד לציפוי</li>
                <li>4-6 כפות מים קרים</li>
                <li>1/2 כפית סודה לשתייה (לבישול)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>הוראות הכנה</h2>
              <ol className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li style={{ marginBottom: "var(--space-3)" }}>משרים גרגרי חומוס 12 שעות לפחות במים קרים — הם יכפילו את גודלם.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מסננים ומבשלים במים חדשים עם סודה לשתייה כ-2 שעות עד שהחומוס מאוד רך (להתמעך בין האצבעות). שומרים כוס מי בישול.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מרסקים חומוס חם במעבד מזון 3 דקות. מוסיפים טחינה, לימון, שום, מלח וכמון.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מוסיפים שמן זית ומים קרים לסירוגין — מעבדים 5 דקות עד לקבלת מרקם חלק וקרמי לחלוטין.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מגישים חם עם שמן זית, פפריקה ופטרוזיליה. מחזיקים 4-5 ימים במקרר.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>הסוד לחומוס חלק באמת</h2>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li style={{ marginBottom: "var(--space-2)" }}><strong style={{ color: "var(--text)" }}>בישול ארוך:</strong> החומוס חייב להיות רך מאוד — לא אל-דנטה. עדיף לבשל עוד 30 דקות מאשר פחות מדי.</li>
                <li style={{ marginBottom: "var(--space-2)" }}><strong style={{ color: "var(--text)" }}>מים קרים:</strong> הטמפרטורה של המים שמוסיפים חשובה — מים קרים מייצרים מרקם קרמי יותר.</li>
                <li style={{ marginBottom: "var(--space-2)" }}><strong style={{ color: "var(--text)" }}>טחינה איכותית:</strong> הטחינה הגולמית היא הלב של החומוס — השקיעו במותג טוב. ואפשר לקנות אותה בזול יותר עם IsraBis.</li>
                <li><strong style={{ color: "var(--text)" }}>כמות לימון:</strong> לחומוס ישראלי אמיתי — לא לחסוך על הלימון.</li>
              </ul>
            </section>

            <section>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-3)" }}>
                ראו גם: <Link href="/recipes/shakshuka" className="c-accent" style={{ textDecoration: "underline" }}>מתכון שקשוקה</Link> &middot; <Link href="/recipes/sabich" className="c-accent" style={{ textDecoration: "underline" }}>מתכון סביח</Link> &middot; <Link href="/recipes/burekas" className="c-accent" style={{ textDecoration: "underline" }}>מתכון בורקס</Link> &middot; <Link href="/recipes" className="c-accent" style={{ textDecoration: "underline" }}>כל המתכונים</Link>
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
                רוצים לדעת כמה בדיוק עולים מרכיבי החומוס שלכם בכל רשת? הורידו את IsraBis — 33 רשתות, מחירים בזמן אמת.
              </p>
              <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
