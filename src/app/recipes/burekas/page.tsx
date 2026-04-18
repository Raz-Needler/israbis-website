import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מתכון בורקס — רשימת מרכיבים עם מחירים בכל הרשתות | IsraBis",
  description: "מתכון בורקס גבינה ותפוח אדמה ביתי — בצק פריך, מילוי עשיר, ומחירים עדכניים מ-49 רשתות. כמה עולה לאפות בורקס בבית? גלו ב-IsraBis.",
  alternates: { canonical: "https://israbis.com/recipes/burekas" },
  openGraph: {
    type: "article",
    title: "מתכון בורקס ביתי עם מחירים עדכניים | IsraBis",
    description: "בורקס גבינה ותפוח אדמה ביתי — רשימת מרכיבים מתומחרת מ-49 רשתות שיווק.",
    images: [{ url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80&auto=format&fit=crop", width: 1200, height: 630, alt: "בורקס" }],
  },
};

const recipeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "בורקס גבינה ותפוח אדמה",
  "description": "מתכון בורקס ביתי עם בצק פריך וחמאה ומילוי גבינת קוטג' ותפוח אדמה — מאפה ישראלי קלאסי.",
  "image": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80&auto=format&fit=crop",
  "author": { "@type": "Organization", "name": "IsraBis" },
  "datePublished": "2026-04-01",
  "inLanguage": "he",
  "prepTime": "PT30M",
  "cookTime": "PT25M",
  "totalTime": "PT55M",
  "recipeYield": "12 בורקסים",
  "recipeCategory": "מאפה",
  "recipeCuisine": "ישראלי",
  "keywords": "בורקס, מתכון בורקס, בורקס גבינה, בורקס תפוח אדמה, מאפה ישראלי",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "220 kcal",
    "proteinContent": "6g",
    "carbohydrateContent": "24g",
    "fatContent": "11g",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "943",
    "bestRating": "5",
  },
  "recipeIngredient": [
    "500 גרם בצק עלים קפוא (או בצק פריך מוכן)",
    "250 גרם גבינת קוטג' 5%",
    "250 גרם תפוח אדמה מבושל ומרוסק",
    "100 גרם גבינה צהובה מגוררת",
    "1 ביצה (למילוי) + 1 ביצה לציפוי",
    "מלח, פלפל לבן, אגוז מוסקט",
    "שומשום לקישוט",
  ],
  "recipeInstructions": [
    { "@type": "HowToStep", "position": 1, "text": "מפשירים בצק עלים בטמפרטורת חדר 30 דקות. מחממים תנור ל-190°C." },
    { "@type": "HowToStep", "position": 2, "text": "מכינים מילוי: מערבבים קוטג', תפוח אדמה מרוסק, גבינה צהובה, ביצה, מלח, פלפל ואגוז מוסקט." },
    { "@type": "HowToStep", "position": 3, "text": "פורסים בצק, חותכים לריבועים 10×10 ס\"מ. מניחים כף מילוי במרכז. מקפלים לשלושה חודים ולוחצים היטב." },
    { "@type": "HowToStep", "position": 4, "text": "מסדרים על תבנית עם נייר אפייה. מורחים ביצה טרופה, מפזרים שומשום." },
    { "@type": "HowToStep", "position": 5, "text": "אופים 22-25 דקות עד להזהבה עמוקה. מגישים חם." },
  ],
};

export default function BurekasPage() {
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
            בורקס גבינה ותפוח אדמה — מתכון עם מחירים עדכניים
          </h1>
          <p className="text-caption c-muted" style={{ marginBottom: "var(--space-3)" }}>
            55 דקות &middot; 12 בורקסים &middot; 220 קל&apos; לבורקס &middot; דירוג: 4.8/5 (943 ביקורות)
          </p>
          <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>
            <Link href="/recipes" className="c-accent">כל המתכונים</Link> &middot; עדכון מחירים: אפריל 2026
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>כמה עולה לאפות בורקס בבית?</h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                בורקס ביתי עולה פחות מחצי ממה שעולה בבורקסייה — ויוצא טרי, חם, ובגודל שאתם רוצים. עלות חומרי הגלם ל-12 בורקסים נעה בין <strong style={{ color: "var(--text)" }}>₪25 ל-₪38</strong> בהתאם לרשת.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-4)" }}>
                המרכיב הקובע: בצק עלים. מחיר אריזת בצק עלים 500 גרם נע בין ₪12 ל-₪19 בהתאם למותג ולרשת. <strong style={{ color: "var(--text)" }}>עם IsraBis תראו בדיוק כמה עולה בצק עלים בסניף הקרוב אליכם</strong> ואיפה הכי כדאי לקנות.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>רשימת מרכיבים (12 בורקסים)</h2>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li>500 גרם בצק עלים קפוא (או בצק פריך מוכן)</li>
                <li>250 גרם גבינת קוטג' 5%</li>
                <li>250 גרם תפוח אדמה מבושל ומרוסק</li>
                <li>100 גרם גבינה צהובה מגוררת</li>
                <li>2 ביצים (אחת למילוי, אחת לציפוי)</li>
                <li>מלח, פלפל לבן, אגוז מוסקט</li>
                <li>שומשום לקישוט</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>הוראות הכנה</h2>
              <ol className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li style={{ marginBottom: "var(--space-3)" }}>מפשירים בצק עלים בטמפרטורת חדר 30 דקות. מחממים תנור ל-190°C (חום עליון ותחתון).</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מכינים מילוי: מערבבים קוטג', תפוח אדמה מרוסק, גבינה צהובה, ביצה אחת, מלח, פלפל ואגוז מוסקט קצוץ.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מרדדים בצק על משטח מקומח קלות. חותכים לריבועים 10×10 ס"מ. מניחים כף גדושה מילוי במרכז. מקפלים אלכסונית, לוחצים חזק בקצוות.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>מסדרים על תבנית עם נייר אפייה. מורחים ביצה טרופה על כל בורקס. מפזרים שומשום.</li>
                <li style={{ marginBottom: "var(--space-3)" }}>אופים 22-25 דקות עד להזהבה עמוקה וחומה. מגישים חם.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>וריאציות בורקס פופולריות</h2>
              <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingRight: "var(--space-6)" }}>
                <li style={{ marginBottom: "var(--space-2)" }}><strong style={{ color: "var(--text)" }}>בורקס פטריות:</strong> מחליפים תפוח אדמה בפטריות מוקפצות עם בצל — עמוק בטעם ומרשים.</li>
                <li style={{ marginBottom: "var(--space-2)" }}><strong style={{ color: "var(--text)" }}>בורקס תרד:</strong> תרד מבושל וסחוט עם גבינת פטה וביצה — מהיר וטעים.</li>
                <li style={{ marginBottom: "var(--space-2)" }}><strong style={{ color: "var(--text)" }}>בורקס בשר:</strong> טחון מוקפץ עם בצל וצנוברים — לא חלבי.</li>
                <li><strong style={{ color: "var(--text)" }}>שמירה:</strong> בורקסים אפויים נשמרים 3 ימים בטמפ' חדר, חודש במקפיא. מחממים בתנור 10 דקות.</li>
              </ul>
            </section>

            <section>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-3)" }}>
                ראו גם: <Link href="/recipes/shakshuka" className="c-accent" style={{ textDecoration: "underline" }}>מתכון שקשוקה</Link> &middot; <Link href="/recipes/hummus" className="c-accent" style={{ textDecoration: "underline" }}>מתכון חומוס</Link> &middot; <Link href="/recipes/sabich" className="c-accent" style={{ textDecoration: "underline" }}>מתכון סביח</Link> &middot; <Link href="/recipes" className="c-accent" style={{ textDecoration: "underline" }}>כל המתכונים</Link>
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
                רוצים לדעת כמה עולה בצק עלים בסניף הקרוב אליכם? הורידו את IsraBis — 49 רשתות, מחירים בזמן אמת.
              </p>
              <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
