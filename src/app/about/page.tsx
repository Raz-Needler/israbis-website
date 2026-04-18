import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "אודות IsraBis — הסיפור שמאחורי האפליקציה | IsraBis",
  description:
    "IsraBis היא אפליקציית השוואת מחירי הסופר החכמה של ישראל. גלו את הסיפור שמאחורינו, המשימה שלנו, הטכנולוגיה שפיתחנו, ולמה 255,000 מוצרים מ-49 רשתות זמינים בחינם.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "אודות IsraBis — מי אנחנו ומה המשימה שלנו",
    description:
      "IsraBis — אפליקציית השוואת מחירים שנבנתה על נתוני הממשלה לטובת הצרכן הישראלי.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "IsraBis",
  alternateName: "ישראביס",
  description:
    "IsraBis היא אפליקציית השוואת מחירי סופרמרקט בישראל, המשווה מחירים בין 49 רשתות שיווק על בסיס נתוני הממשלה.",
  foundingDate: "2025",
  url: "https://israbis.com",
  email: "support@israbis.com",
  areaServed: { "@type": "Country", name: "Israel" },
  knowsAbout: [
    "supermarket price comparison",
    "grocery shopping",
    "food prices in Israel",
    "recipe AI",
  ],
  slogan: "חוסכים לכם כסף אמיתי",
};

export default function AboutPage() {
  return (
    <article className="sec">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <div className="w-980" style={{ maxWidth: 760 }}>

        {/* Header */}
        <div className="badge" style={{ marginBottom: "var(--space-4)" }}>אודות</div>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-6)" }}>
          IsraBis — האפליקציה שחוסכת לישראלים כסף אמיתי
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>

          {/* Section 1: Mission */}
          <section>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-4)" }}>המשימה שלנו</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              IsraBis (ישראביס) נוסדה עם מטרה אחת ברורה: לתת לכל צרכן ישראלי את הכוח להחליט בחוכמה
              היכן לקנות. ישראל היא אחת המדינות היקרות ביותר ב-OECD בתחום המזון — מחירי הסופר
              הישראלי גבוהים בעשרות אחוזים מהממוצע הגלובלי, ורשתות השיווק לא תמיד מקלות על הצרכן
              לדעת מה המחיר האמיתי בכל מוצר.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
              אנחנו מאמינים שמידע זמין, עדכני ומדויק הוא הכלי הטוב ביותר לשינוי. כשכל אחד יכול
              לבדוק בשנייה אחת כמה עולה ליטר שמן בשופרסל לעומת רמי לוי, כוח המשא ומתן עובר
              לצרכן. זו לא רק נוחות — זו זכות בסיסית.
            </p>
          </section>

          {/* Section 2: Data */}
          <section>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-4)" }}>הנתונים שמאחורינו</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              IsraBis בנויה על גבי נתוני הממשלה הפתוחים — מחירי הרשתות מדווחים לפי חוק שקיפות המחירים
              ומפורסמים בפורמט XML מדי כמה שעות. אנחנו מעבדים את הקבצים האלו, מנרמלים אותם,
              ומאחדים את השמות הסחורה כך שתוכלו להשוות תפוחים לתפוחים — גם כשכל רשת קוראת למוצר
              בשם אחר.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
              הבסיס כולל כ-255,000 מוצרים פעילים מ-49 רשתות שיווק, כולל שופרסל, רמי לוי, ויקטורי,
              אושר עד, יינות ביתן, חצי חינם, מחסני השוק, קארפור, וכן פרמקס, ניקו מרקט, ורשתות
              נוספות. המחירים מתרעננים כל 4 שעות לכל היותר.
            </p>
          </section>

          {/* Section 3: Technology */}
          <section>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-4)" }}>הטכנולוגיה</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              מאחורי הממשק הפשוט של IsraBis מסתתרת תשתית מתוחכמת: מנוע עיבוד נתונים שמוריד,
              מנתח ומנרמל XML feeds ממאות קבצי רשתות מדי יום. המוצרים עוברים תהליך אחדה חכם
              שמבוסס על שם, ברקוד, ויצרן — כדי שתוכלו לחפש "קוטג' 250 גרם" ולראות מחיר אמיתי
              ומשוואה ישרה בכל הרשתות.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
              מעבר להשוואת המחירים, IsraBis משתמשת ב-AI (Google Gemini) ליכולות מתקדמות: ישרא שף
              — העוזר האישי שלכם במטבח — מנתח תמונות מקרר, מציע מתכונים לפי מה שיש בבית, עוזר
              בבישול צעד אחר צעד, ומחשב את עלות המנה ברשתות השונות בזמן אמת.
            </p>
          </section>

          {/* Section 4: What sets us apart */}
          <section>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-4)" }}>מה מייחד אותנו</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              כלי השוואת מחירים קיימים. אבל IsraBis היא הראשונה שמשלבת את כולם: השוואת מחירים
              מקיפה לפי סניף הקרוב אליכם, מתכונים עם עלות ריאלית ברשתות, AI שמסייע בניהול הבית,
              ניהול עגלת קניות חכמה, ותכנון תפריט שבועי — הכל במקום אחד.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
              לאפליקציה יש גם מצב משפחתי מלא: ניתן לנהל עגלת קניות משותפת, לפצל הוצאות, ולתאם
              קניות בין בני הבית בזמן אמת. אין אפליקציה אחרת בישראל שמציעה את השילוב הזה בחינם
              ובאיכות כזו.
            </p>
          </section>

          {/* Section 5: Who we are */}
          <section>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-4)" }}>מי אנחנו</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              IsraBis נבנתה על ידי צוות קטן של מפתחים ואנשי מוצר ישראלים שנמאס להם לשלם יותר
              מדי בסופר. אנחנו לא תאגיד גדול ולא קרן ממומנת — אנחנו צוות ממוקד עם רעיון פשוט:
              לבנות כלי שאנחנו עצמנו היינו רוצים להשתמש בו.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
              המוצר מתפתח בהתאם לפידבק של המשתמשים. כל בקשת תכונה, כל דיווח על בעיה, וכל הצעה
              לשיפור — נקראים ונלקחים ברצינות. כי בסוף, IsraBis קיימת בשביל הצרכן הישראלי, לא
              בשבילנו.
            </p>
          </section>

          {/* Section 6: Stats */}
          <section>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-5)" }}>עובדות ומספרים</h2>
            <div
              className="grid grid-cols-2 sm:grid-cols-3"
              style={{ gap: "var(--space-4)" }}
            >
              {[
                { value: "49", label: "רשתות שיווק" },
                { value: "255,000+", label: "מוצרים פעילים" },
                { value: "4 שעות", label: "עדכון מחירים מקסימלי" },
                { value: "יומי", label: "עיבוד נתוני ממשלה" },
                { value: "חינם", label: "גישה בסיסית" },
                { value: "2025", label: "שנת הקמה" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card-premium"
                  style={{ padding: "var(--space-5)", textAlign: "center" }}
                >
                  <p
                    className="text-h2"
                    style={{ color: "var(--accent)", marginBottom: "var(--space-1)", fontWeight: 700 }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-caption c-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7: CTA */}
          <section style={{ textAlign: "center", paddingTop: "var(--space-4)" }}>
            <h2 className="text-h2" style={{ marginBottom: "var(--space-3)" }}>
              מוכנים לחסוך?
            </h2>
            <p
              className="text-body c-muted"
              style={{ maxWidth: "44ch", margin: "0 auto var(--space-6)", lineHeight: "var(--leading-relaxed)" }}
            >
              הורידו את IsraBis בחינם ותתחילו לחסוך כבר בקניה הבאה שלכם.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://apps.apple.com/app/israbi/id0000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent btn-lg"
              >
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.israbis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                Google Play
              </a>
            </div>
          </section>

        </div>
      </div>
    </article>
  );
}
