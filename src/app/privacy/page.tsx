import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description: "מדיניות הפרטיות של IsraBis — כיצד אנו שומרים על המידע שלכם.",
};

export default function PrivacyPage() {
  return (
    <section className="sec">
      <div className="w-980">
        <h1 className="text-h1" style={{ marginBottom: "var(--space-8)" }}>מדיניות פרטיות</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
          <div>
            <p className="text-caption c-muted" style={{ marginBottom: "var(--space-6)" }}>
              עדכון אחרון: אפריל 2026
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              ב-IsraBis, פרטיות המשתמשים היא ערך עליון. מדיניות זו מפרטת אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם, וכיצד אנו מגנים עליהם.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>1. מידע שאנו אוספים</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              <strong style={{ color: "var(--text)" }}>מידע שנמסר על ידכם:</strong> כתובת אימייל בעת הרשמה, העדפות רשתות, מיקום עיר (לא מיקום מדויק), ורשימות קניות.
              <br /><br />
              <strong style={{ color: "var(--text)" }}>מידע שנאסף אוטומטית:</strong> סוג המכשיר, גרסת מערכת ההפעלה, ונתוני שימוש אנונימיים לשיפור השירות. איננו אוספים נתוני מיקום מדויקים, היסטוריית גלישה, או מידע פיננסי.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>2. כיצד אנו משתמשים במידע</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              המידע משמש אך ורק לספק ולשפר את השירות: הצגת מחירים רלוונטיים לפי אזור, שמירת העדפות אישיות, ושיפור חוויית המשתמש. איננו מוכרים מידע אישי לצדדים שלישיים. איננו מציגים פרסומות מותאמות אישית.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>3. אחסון ואבטחה</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              הנתונים מאוחסנים בשרתים מאובטחים עם הצפנה. אנו משתמשים בפרוטוקולי אבטחה מקובלים בתעשייה כולל HTTPS, הצפנת נתונים במנוחה, וניהול גישה מבוסס תפקידים.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>4. שיתוף מידע</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              איננו משתפים מידע אישי מזהה עם צדדים שלישיים, למעט: ספקי שירות טכניים הנדרשים להפעלת האפליקציה (כגון שירותי אחסון ענן), או כאשר נדרש על פי חוק.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>5. הזכויות שלכם</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              באפשרותכם בכל עת: לבקש עותק של המידע שלכם, לבקש מחיקת החשבון והמידע, לבטל הסכמה לקבלת הודעות שיווקיות, ולעדכן את פרטיכם האישיים באפליקציה.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>6. עוגיות (Cookies)</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              האתר משתמש בעוגיות בסיסיות לתפעול (שמירת ערכת נושא, העדפות שפה). איננו משתמשים בעוגיות מעקב או עוגיות פרסום.
            </p>
          </div>

          <div>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>7. יצירת קשר</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              לשאלות בנוגע לפרטיות, פנו אלינו בכתובת privacy@israbis.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
