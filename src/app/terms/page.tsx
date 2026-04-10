import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "תנאי שימוש",
  description: "תנאי השימוש של אפליקציית IsraBis — השוואת מחירי מזון בישראל.",
};

export default function TermsPage() {
  return (
    <section className="sec">
      <div className="w-980">
        <h1 className="text-h1" style={{ marginBottom: "var(--space-8)" }}>תנאי שימוש</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          <div>
            <p className="text-caption c-muted" style={{ marginBottom: "var(--space-6)" }}>
              עדכון אחרון: אפריל 2026
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              ברוכים הבאים ל-IsraBis. תנאי שימוש אלו מסדירים את השימוש באפליקציה ובאתר. השימוש בשירותים מהווה הסכמה לתנאים אלו.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>1. השירות</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              IsraBis מספקת כלי השוואת מחירים בין רשתות שיווק בישראל, המבוסס על נתוני מחירים ציבוריים לפי חוק שקיפות מחירי מזון 2014. המחירים מתעדכנים באופן יומי ומוצגים כפי שהם. IsraBis אינה אחראית לדיוק המחירים בפועל בסניפים — המחירים המחייבים הם אלו המוצגים בקופה.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>2. חשבון משתמש</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              חלק מהתכונות דורשות הרשמה. המשתמש אחראי לשמירה על סודיות פרטי הכניסה. אין לשתף חשבונות עם גורמים חיצוניים. IsraBis שומרת לעצמה את הזכות להשעות חשבונות שמפרים את תנאי השימוש.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>3. קניין רוחני</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              כל התוכן, העיצוב, הקוד, והמתכונים (למעט תוכן שנוצר על ידי משתמשים) הם קניינה של IsraBis Inc. אין להעתיק, לשכפל, או להפיץ תוכן מהאפליקציה ללא אישור מפורש בכתב.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>4. מנוי פרימיום</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              IsraBis מציעה שירות בסיסי חינמי ומנוי פרימיום בתשלום. ביטול מנוי ייכנס לתוקף בסוף תקופת החיוב הנוכחית. החזרים יינתנו בהתאם למדיניות חנויות האפליקציות (App Store / Google Play).
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>5. הגבלת אחריות</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              השירות מסופק &quot;כפי שהוא&quot; (as is). IsraBis אינה מתחייבת לזמינות רציפה, לדיוק מוחלט של המחירים, או להתאמה לצרכים ספציפיים. השימוש בשירות הוא על אחריות המשתמש.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>6. שינויים בתנאים</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              IsraBis שומרת לעצמה את הזכות לעדכן תנאים אלו. שינויים מהותיים יפורסמו באפליקציה ובאתר. המשך השימוש לאחר עדכון מהווה הסכמה לתנאים המעודכנים.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>7. יצירת קשר</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              לשאלות בנוגע לתנאי שימוש אלו, ניתן לפנות אלינו בכתובת support@israbis.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
