import type { Metadata } from "next";
import Link from "next/link";
import ArticleJsonLd from "@/components/ArticleJsonLd";

export const metadata: Metadata = {
  title: "השוואת מחירי סופר בישראל 2026 — מדריך מלא | 33 רשתות",
  description: "מדריך מקיף להשוואת מחירי סופרמרקט בישראל. למה הפרשי המחירים מגיעים ל-21% בין רשתות? איך להשוות מחירי מזון בין רמי לוי, שופרסל, ויקטורי, אושר עד ועוד 29 רשתות — עם IsraBis.",
  alternates: { canonical: "/guides/hashvaat-mechirei-super" },
};

export default function GuideHashvaa() {
  return (
    <>
    <ArticleJsonLd
      title="השוואת מחירי סופר בישראל — מדריך מלא 2026"
      description="מדריך מקיף להשוואת מחירי סופרמרקט בישראל בין 33 רשתות שיווק"
      url="/guides/hashvaat-mechirei-super"
      howTo={{
        name: "איך להשוות מחירי סופר בין 33 רשתות בישראל",
        description: "מדריך שלב אחרי שלב להשוואת מחירי סופרמרקט בישראל עם IsraBis",
        totalTime: "PT5M",
        step: [
          { "@type": "HowToStep", name: "הורידו את IsraBis", text: "הורידו את האפליקציה מ-App Store או Google Play — חינם", position: 1 },
          { "@type": "HowToStep", name: "הפעילו מיקום", text: "אפשרו גישה למיקום כדי לקבל מחירים של הסניף הקרוב אליכם", position: 2 },
          { "@type": "HowToStep", name: "בנו עגלת קניות", text: "חפשו מוצרים, סרקו ברקוד, או הוסיפו ממתכון", position: 3 },
          { "@type": "HowToStep", name: "ראו השוואה מלאה", text: "המערכת מחשבת את עלות העגלה בכל 33 הרשתות ומדרגת מהזולה ליקרה", position: 4 },
          { "@type": "HowToStep", name: "חסכו כסף", text: "בחרו את הרשת הזולה לעגלה שלכם ותחסכו ₪200-500 בחודש", position: 5 },
        ],
      }}
    />
    <article className="sec">
      <div className="w-980" style={{ maxWidth: 760 }}>
        <div className="badge" style={{ marginBottom: "var(--space-4)" }}>השוואת מחירים</div>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
          השוואת מחירי סופר בישראל — מדריך מלא 2026
        </h1>
        <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>עדכון אחרון: אפריל 2026 &middot; 5 דקות קריאה</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>למה חשוב להשוות מחירי סופר?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              ישראל היא המדינה השנייה הכי יקרה ב-OECD בתחום המזון — <strong style={{ color: "var(--text)" }}>52% מעל הממוצע</strong>. המשמעות: משפחה ממוצעת מוציאה ₪5,300-5,570 בחודש על מזון. אבל הנה הנתון החשוב באמת — <strong style={{ color: "var(--accent)" }}>הפרש של 21%</strong> קיים בין הרשת הזולה ליקרה על אותם מוצרים בדיוק. סל של 50 מוצרים בסיסיים עולה ₪452 ברמי לוי ו-₪548 בשופרסל דיל. זה הפרש של כמעט ₪100 על קנייה אחת.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>חוק שקיפות מחירי מזון 2014</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              ב-2014 נכנס לתוקף חוק שקיפות מחירי מזון בישראל. החוק מחייב את כל רשתות השיווק לפרסם את מחירי כל המוצרים בפורמט XML פתוח ונגיש. המשמעות: כל המחירים של כל הרשתות זמינים לציבור. הבעיה? הנתונים הגולמיים לא נגישים לצרכן הרגיל — הם בפורמט טכני שדורש עיבוד. כאן IsraBis נכנסת לתמונה.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>33 רשתות שיווק — כולן במקום אחד</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              IsraBis מעבדת מחירים מ-33 רשתות שיווק בישראל: רמי לוי, שופרסל, ויקטורי, טיב טעם, מחסני השוק, יוחננוף, אושר עד, חצי חינם, מגה, יינות ביתן, סטופ מרקט, קינג סטור, גוד פארם, סופר-פארם, ברקת, קשת, קופיקס, סופר ספיר, קוויק, מעיין 2000, שפע ברכת, שוק העיר, פרש מרקט, ועוד. המחירים מתעדכנים מדי יום.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>איך IsraBis עושה את זה?</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              הוסיפו מוצרים לעגלה — מקטגוריות, ממתכונים, מסריקת ברקוד, או מסריקת קבלה. המערכת מחשבת את עלות העגלה המלאה בכל 33 הרשתות ומדרגת מהזולה ליקרה. אתם בוחרים איפה לקנות ובאמת חוסכים. לא ניחושים, לא תחושות בטן — נתונים אמיתיים.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>בואו תתחילו לחסוך</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
              הורידו את IsraBis בחינם ותתחילו להשוות מחירי סופרמרקט עוד היום. iOS + Android, עברית מלאה.
            </p>
            <Link href="/download" className="btn btn-accent">הורידו בחינם</Link>
          </section>
        </div>
      </div>
    </article>
    </>
  );
}
