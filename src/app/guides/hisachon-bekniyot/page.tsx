import type { Metadata } from "next";
import Link from "next/link";
import ArticleJsonLd from "@/components/ArticleJsonLd";

export const metadata: Metadata = {
  title: "איך לחסוך בקניות סופר — 10 טיפים שעובדים | 2026",
  description: "10 טיפים מעשיים לחיסכון בקניות סופרמרקט בישראל: השוואת מחירים בין רשתות, תכנון ארוחות, שימוש בעגלה חכמה, סריקת מבצעים, מעקב הוצאות, וכלי AI שחוסכים זמן וכסף.",
  alternates: { canonical: "/guides/hisachon-bekniyot" },
};

export default function GuideHisachon() {
  return (
    <>
      <ArticleJsonLd
        title="איך לחסוך בקניות סופר — 10 טיפים שעובדים"
        description="10 טיפים מעשיים לחיסכון בקניות סופרמרקט בישראל"
        url="/guides/hisachon-bekniyot"
        howTo={{
          name: "10 טיפים לחיסכון בקניות סופרמרקט בישראל",
          description: "טיפים מעשיים שיחסכו לכם ₪200-500 בחודש על קניות מזון",
          totalTime: "PT10M",
          step: [
            { "@type": "HowToStep", name: "השוו מחירים בין רשתות", text: "השתמשו ב-IsraBis להשוואת מחירים בין 49 רשתות שיווק על כל מוצר", position: 1 },
            { "@type": "HowToStep", name: "תכננו ארוחות מראש", text: "תכננו תפריט שבועי לפני הקנייה ובנו רשימה מדויקת", position: 2 },
            { "@type": "HowToStep", name: "השתמשו בעגלה חכמה", text: "בנו עגלה דיגיטלית ב-IsraBis שמשווה מחירים אוטומטית", position: 3 },
            { "@type": "HowToStep", name: "סרקו ברקודים בסופר", text: "לפני שמכניסים מוצר לעגלה — סרקו ברקוד ובדקו אם יש אותו זול יותר", position: 4 },
            { "@type": "HowToStep", name: "עקבו אחרי הוצאות", text: "הגדירו תקציב חודשי ב-IsraBis וקבלו התראות כשמתקרבים לגבול", position: 5 },
          ],
        }}
      />
      <article className="sec">
        <div className="w-980" style={{ maxWidth: 760 }}>
          <div className="badge" style={{ marginBottom: "var(--space-4)" }}>חיסכון</div>
          <h1 className="text-h1" style={{ marginBottom: "var(--space-4)" }}>
            איך לחסוך בקניות סופר — 10 טיפים שעובדים
          </h1>
          <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>עדכון אחרון: אפריל 2026 &middot; 7 דקות קריאה</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                <span className="c-accent">1.</span> השוו מחירים בין רשתות — לא בהרגשה, בנתונים
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                הפרש של <strong style={{ color: "var(--text)" }}>21%</strong> קיים בין הרשת הזולה ליקרה על אותם מוצרים בדיוק. זה לא מיתוס — זה נתון שמבוסס על נתוני המאגר הממשלתי שאותם IsraBis מעבדת מדי יום. סל בסיסי של 50 מוצרים יומיומיים עולה ₪452 ברמי לוי ו-₪548 בשופרסל דיל. הפרש של ₪96 על קנייה אחת — ₪1,152 בשנה.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
                אפליקציה כמו IsraBis משווה מחירים בין 49 רשתות שיווק ומוצאת את הזולה ביותר עבור סל הקניות הספציפי שלכם. לא ממוצעים כלליים — הסל המדויק שלכם, בסניף הקרוב אליכם.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                <span className="c-accent">2.</span> תכננו ארוחות מראש
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                קנייה בלי תכנון מובילה לבזבוז של <strong style={{ color: "var(--text)" }}>₪2,400-3,600 בשנה</strong> על מזון שנזרק. מדובר בכ-30% מהמזון שמשפחה ממוצעת קונה — שנזרק ישר לאשפה. תכנון תפריט שבועי מראש לא רק חוסך כסף, הוא גם מפחית לחץ: כשיש תפריט, אין שאלת "מה מבשלים היום?".
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
                IsraBis מציעה מאות מתכונים בעברית עם מחירים בזמן אמת — כך שאפשר לתכנן תפריט שבועי ולדעת מראש כמה תעלה כל ארוחה, ובאיזו רשת הכי כדאי לקנות את המרכיבים.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                <span className="c-accent">3.</span> השתמשו בעגלה חכמה
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                במקום לרשום רשימה על נייר — בנו עגלה דיגיטלית שמשווה מחירים אוטומטית. ב-IsraBis, כל מוצר שמוסיפים מיד מחושב בכל הרשתות. כשהעגלה מוכנה — המערכת מציגה את עלות העגלה הכוללת בכל 49 הרשתות, מהזולה ליקרה.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
                הפיצ'ר החכם ביותר: "עגלה מפוצלת". IsraBis מציעה לכם לקנות חלק מהמוצרים ברשת אחת וחלק ברשת שנייה — אם החיסכון מצדיק את הנסיעה הנוספת. עבור משפחה עם עגלה גדולה, זה לפעמים חיסכון של ₪50-80 נוספים.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                <span className="c-accent">4.</span> סרקו ברקודים בסופר
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                לפני שמוסיפים מוצר לעגלה הפיזית בסופר — סרקו את הברקוד עם IsraBis ובדקו אם הוא זול יותר ברשת אחרת. אולי השמפו שמחזיקים בידיים עולה ₪32 בשופרסל, אבל ₪24 בויקטורי שנמצאת 2 דקות נסיעה. כל סריקה עשויה לחסוך ₪5-15.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
                לפי נתוני IsraBis, המוצרים עם הפרשי מחירים הגדולים ביותר בין הרשתות הם: מוצרי טיפוח ויגנה (הפרש עד 35%), ממתקים ומוצרי חטיף (עד 28%), ומוצרי ניקוי (עד 25%). בקטגוריות אלו — סריקת ברקוד שווה במיוחד.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                <span className="c-accent">5.</span> בשלו מהמקרר, לא מהסופר
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                כמה פעמים פתחתם מקרר עם מוצרים ולא ידעתם מה לבשל? סריקת מקרר AI של IsraBis מזהה את המוצרים שיש לכם ומציעה מתכונים מתאימים — בלי לקנות מרכיבים חדשים. זה לא רק חיסכון כסף — זה מניעת בזבוז מזון.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
                נתון מפתיע: משפחה ישראלית ממוצעת זורקת מזון בשווי <strong style={{ color: "var(--text)" }}>₪300-450 בחודש</strong>. אם תשתמשו בסריקת מקרר פעמיים בשבוע, תוכלו להפחית את הבזבוז ב-40-60%. כך גם קל יותר לתכנן קנייה הבאה — רק מה שחסר.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                <span className="c-accent">6.</span> הפכו סרטוני בישול למתכונים מתומחרים
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                ראיתם מתכון ביוטיוב או בטיקטוק? הדביקו את הלינק ב-IsraBis ותקבלו תוך שניות: מתכון כתוב בעברית + רשימת מרכיבים + מחירי כל מרכיב בכל 49 הרשתות. לא עוד מתכונים שנראים מדהים אבל אז מגלים שהמרכיבים עולים ₪200.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
                הפיצ'ר תומך בסרטוני יוטיוב, טיקטוק, ואינסטגרם. הוא גם מציע תחליפים זולים יותר למרכיבים יקרים — לדוגמה, גבינת קשקבל במקום מוצרלה, קמח רגיל במקום קמח שקדים, וכדומה.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                <span className="c-accent">7.</span> עקבו אחרי הוצאות מזון חודשיות
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                רוב המשפחות לא יודעות כמה הן מוציאות על מזון בחודש. הגדירו תקציב חודשי ב-IsraBis וקבלו התראות כשמתקרבים לגבול. ניתוח ההוצאות מציג לכם גם פירוט לפי קטגוריות: בשר ועוף, ירקות ופירות, חטיפים, ניקיון ועוד.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
                המשתמשים שמפעילים מעקב הוצאות מדווחים על חיסכון ממוצע של <strong style={{ color: "var(--text)" }}>₪180 בחודש</strong> כבר בחודש הראשון — פשוט מתוך המודעות הגדולה יותר להוצאות.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                <span className="c-accent">8.</span> קנו ביחד כמשפחה
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                קניות משפחתיות בזמן אמת — כל אחד רואה מה נוסף ומה נמחק. בלי כפילויות (שני חבילות חמאה, שתי קופסאות דגני בוקר), בלי שיחות טלפון מהסופר. IsraBis מאפשרת שיתוף עגלת קניות בין בני המשפחה עם עדכון בזמן אמת.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
                נוסף על כך, ניתן להגדיר "מזווה משפחתי" — רשימת מוצרים שתמיד צריכים להיות בבית. כשמוצר אוזל, IsraBis מוסיפה אותו אוטומטית לעגלה הבאה.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                <span className="c-accent">9.</span> עקבו אחרי תפוגה ומנעו זריקת מזון
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                השתמשו במזווה דיגיטלית של IsraBis כדי לעקוב אחרי תאריכי תפוגה ולקבל התראות לפני שמוצרים מתקלקלים. כשהאפליקציה מתריעה שהגבינה פגה בעוד יומיים — זה הזמן לבשל לזנייה, לא להזמין פיצה.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
                ניהול מלאי בית חוסך בממוצע <strong style={{ color: "var(--text)" }}>₪120-200 בחודש</strong> למשפחה — זה מזון שלא נזרק. בשנה זה ₪1,440-2,400 שנשארים בכיס.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>
                <span className="c-accent">10.</span> הורידו את IsraBis — כל הטיפים בפלטפורמה אחת
              </h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                כל 9 הטיפים שפירטנו כאן — זמינים באפליקציה אחת, בחינם, בעברית. השוואת מחירים בין 49 רשתות, עגלה חכמה, סריקת ברקוד, סריקת מקרר AI, מתכון מסרטון, מעקב הוצאות, ניהול משפחתי, ומזווה דיגיטלית.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
                ממוצע חיסכון של משפחות שמשתמשות ב-IsraBis: <strong style={{ color: "var(--text)" }}>₪200-500 בחודש</strong>. בשנה זה ₪2,400-6,000 — כסף שניתן להוציא על חופשה, חינוך, או פשוט לחסוך לעתיד.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
                IsraBis זמינה ל-iOS ו-Android. גרסה בסיסית בחינם. תכונות מתקדמות מ-₪29.90 לחודש — פחות מהחיסכון שהאפליקציה תחולל כבר בקנייה הראשונה.
              </p>
            </section>

            <section>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>סיכום — כמה אפשר לחסוך?</h2>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
                בואו נחשב: השוואת מחירים חוסכת ₪80-120 בחנייה; מניעת בזבוז מזון — ₪150-300; תכנון ארוחות — ₪60-120; סריקת ברקודים — ₪30-60. יחד: <strong style={{ color: "var(--text)" }}>₪320-600 בחודש למשפחה ממוצעת</strong>. זה לא מדמה — זה מה שמשתמשי IsraBis מדווחים.
              </p>
              <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
                ראו גם: <Link href="/guides/hashvaat-mechirei-super" className="c-accent" style={{ textDecoration: "underline" }}>מדריך השוואת מחירי סופר</Link> &middot; <Link href="/guides/matkonot-im-mechirim" className="c-accent" style={{ textDecoration: "underline" }}>מתכונים עם מחירים</Link>
              </p>
            </section>

            <section>
              <Link href="/download" className="btn btn-accent">הורידו את IsraBis בחינם</Link>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
