import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות פרטיות — IsraBis | הגנה על המידע שלכם",
  description: "מדיניות הפרטיות המלאה של IsraBis. כיצד אנו אוספים, מעבדים, ושומרים על המידע שלכם. תאימות לחוק הגנת הפרטיות הישראלי ו-GDPR.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="sec">
      <div className="w-980" style={{ maxWidth: 760 }}>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-3)" }}>מדיניות פרטיות — IsraBis</h1>
        <p className="text-caption c-muted" style={{ marginBottom: "var(--space-4)" }}>תאריך עדכון אחרון: מרץ 2026 &middot; גרסה: 2.0</p>
        <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-8)" }}>
          IsraBis (&quot;אנחנו&quot;, &quot;שלנו&quot;) מחויבת להגנה על פרטיותכם. מדיניות זו מסבירה אילו נתונים אנו אוספים, מדוע, כיצד אנו משתמשים בהם, למי הם מועברים, ומהן זכויותיכם — בהתאם לחוק הגנת הפרטיות, התשמ&quot;א-1981 ותיקון 13 שלו.
          <br /><br />
          בעל מאגר המידע ואחראי הפרטיות: IsraBis — <a href="mailto:privacy@israbis.com" className="c-accent" style={{ textDecoration: "none" }}>privacy@israbis.com</a>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>1. מידע שאנו אוספים</h2>
            <h3 className="text-h4" style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-2)" }}>א. מידע שאתם מספקים (מסירה וולונטרית):</h3>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingInlineStart: "var(--space-5)" }}>
              <li>פרטי חשבון — שם, כתובת דוא&quot;ל, סיסמה (מאוחסנת בהצפנה חד-כיוונית בלבד)</li>
              <li>מיקום — עיר או מיקום GPS (לצורך מציאת סניפים קרובים ומחירים מדויקים)</li>
              <li>רשימות קניות — מוצרים שהוספתם לעגלה, כמויות, העדפות מוצרים</li>
              <li>תוכן — מתכונים שנשמרו, דירוגים, הערות</li>
              <li>שיחות עם ישרא שף — טקסט שיחות AI (נשמר לצורך המשכיות שיחה)</li>
              <li>הקלטות קוליות — מתומללות לטקסט ונמחקות מיד לאחר התמלול</li>
              <li>תמונות מזון — מעובדות בזמן אמת לצורך סריקה ואינן נשמרות בשרתינו</li>
              <li>נתוני משפחה — שם, שייכות לקבוצה משפחתית</li>
            </ul>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
              מסירת מידע זה הינה וולונטרית. ללא מסירת פרטי חשבון בסיסיים, לא ניתן יהיה להשתמש באפליקציה.
            </p>

            <h3 className="text-h4" style={{ marginTop: "var(--space-4)", marginBottom: "var(--space-2)" }}>ב. מידע שנאסף אוטומטית:</h3>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingInlineStart: "var(--space-5)" }}>
              <li>נתוני שימוש — מסכים שנצפו, תכונות שנוצלו, זמני שימוש</li>
              <li>מידע על המכשיר — סוג מכשיר, מערכת הפעלה, גרסת אפליקציה</li>
              <li>טוקן התראות — לצורך שליחת עדכונים (Expo Push Notifications)</li>
              <li>מזהה פרסום — לצורך הצגת פרסומות (Google AdMob) — בגרסה החינמית בלבד</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>2. מטרות השימוש במידע</h2>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingInlineStart: "var(--space-5)" }}>
              <li>מתן השירות — השוואת מחירים, ניהול עגלה, סריקות AI, חיפוש מתכונים</li>
              <li>התאמה אישית — מחירים לפי סניפים קרובים, המלצות מבוססות העדפות</li>
              <li>ניהול מנויים — עיבוד תשלומים, אימות רמת שירות</li>
              <li>שיפור השירות — ניתוח דפוסי שימוש מצרפיים לשיפור חוויית המשתמש</li>
              <li>תקשורת — עדכונים על השירות. לא נשלח דיוור שיווקי ללא הסכמה מפורשת.</li>
              <li>הצגת פרסומות — בגרסה החינמית בלבד, באמצעות Google AdMob</li>
              <li>אבטחה — זיהוי ומניעת שימוש לרעה</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>3. עיבוד באמצעות בינה מלאכותית (AI)</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              אנו משתמשים בטכנולוגיית AI (Google Gemini) לעיבוד: שיחות טקסט, תמונות מזון, תמונות מקרר, סרטוני וידאו, קלט קולי, וחיפוש מתכונים באינטרנט.
              <br /><br />
              אתם מודעים לכך שאתם מנהלים אינטראקציה עם מערכת AI. תוצאות AI הן הערכות בלבד ואינן תחליף לייעוץ מקצועי. תמונות וקלט קולי אינם נשמרים לאחר העיבוד.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>4. שיתוף מידע עם צדדים שלישיים</h2>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingInlineStart: "var(--space-5)" }}>
              <li>Google (Gemini AI) — עיבוד AI, תמלול, חיפוש. מיקום: ארה&quot;ב.</li>
              <li>Google (AdMob) — הצגת פרסומות (בגרסה החינמית). מיקום: ארה&quot;ב.</li>
              <li>RevenueCat — ניהול מנויים. מיקום: ארה&quot;ב.</li>
              <li>Apple App Store / Google Play Store — עיבוד תשלומים.</li>
              <li>Supabase — אחסון מאגר המידע. מיקום: אוסטרליה.</li>
              <li>Expo — שליחת התראות. מיקום: ארה&quot;ב.</li>
            </ul>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
              איננו מוכרים, משכירים או מעבירים מידע אישי לצדדים שלישיים למטרות שיווקיות.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>5. העברת מידע בינלאומית</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              המידע שלכם מעובד ומאוחסן בשרתים מחוץ לישראל: אוסטרליה (Supabase) וארצות הברית (Google, RevenueCat, Expo). העברות אלה מתבצעות בהתאם לתקנות הגנת הפרטיות ובכפוף להסכמים חוזיים המחייבים רמת הגנה שאינה פחותה מזו הנדרשת בדין הישראלי.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>6. נתוני משפחה וקניות משותפות</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              בשימוש בתכונות המשפחה: שמכם משותף עם חברי הקבוצה, רשימות קניות והוצאות משותפות בתוך הקבוצה, ופעילות קניות בזמן אמת גלויה לחברי הקבוצה. ניתן לעזוב קבוצה בכל עת.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>7. חיבור לחשבונות סופרמרקט</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              פרטי הכניסה לסופרמרקטים נשמרים מקומית במכשירכם בלבד. IsraBis אינה שומרת את סיסמאותיכם. ניתן להתנתק מכל סופר בכל עת.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>8. שמירת נתונים ומחיקה</h2>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingInlineStart: "var(--space-5)" }}>
              <li>נתוני חשבון — נשמרים כל עוד החשבון פעיל</li>
              <li>שיחות AI — נשמרות למשך 90 יום או עד מחיקת השיחה</li>
              <li>היסטוריית קניות — נשמרת למשך 24 חודשים</li>
              <li>תמונות וקלט קולי — אינם נשמרים לאחר עיבוד</li>
              <li>לאחר מחיקת חשבון — כל הנתונים האישיים יימחקו תוך 30 יום</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>9. אבטחת מידע</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              סיסמאות מוצפנות בהצפנה חד-כיוונית (bcrypt). תקשורת מוצפנת באמצעות HTTPS/TLS. טוקני גישה מאובטחים (JWT) עם תוקף מוגבל. אחסון מאובטח במכשיר (SecureStore) לטוקני רענון. בקרת גישה מוגבלת למאגרי המידע.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>10. זכויותיכם</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-2)" }}>בהתאם לחוק הגנת הפרטיות ותיקון 13:</p>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingInlineStart: "var(--space-5)" }}>
              <li>זכות עיון — לצפות במידע האישי שנאסף עליכם</li>
              <li>זכות תיקון — לתקן מידע שגוי או לא מעודכן</li>
              <li>זכות מחיקה — למחוק את החשבון ואת כל הנתונים</li>
              <li>זכות התנגדות — לדרוש שמידע לא יועבר לצדדים שלישיים מסוימים</li>
              <li>זכות הסרה מרשימת דיוור — להסיר את עצמכם מכל דיוור שיווקי</li>
            </ul>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
              למימוש זכויותיכם: <a href="mailto:privacy@israbis.com" className="c-accent" style={{ textDecoration: "none" }}>privacy@israbis.com</a>
              <br />
              אם אינכם שבעי רצון, עומדת לכם הזכות להגיש תלונה לרשות להגנת הפרטיות.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>11. פרטיות ילדים וקטינים</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              IsraBis אינה מיועדת לילדים מתחת לגיל 13. שימוש על ידי קטינים בגילאי 13-18 מותנה בהסכמת הורה או אפוטרופוס.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>12. קובצי Cookie ומעקב</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              האפליקציה עצמה אינה משתמשת בקובצי Cookie. קובצי Cookie של סופרמרקטים נשמרים מקומית במכשירכם בלבד. שירות AdMob עשוי להשתמש במזהה פרסום לצורך התאמת פרסומות.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>13-14. שינויים במדיניות ויצירת קשר</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              שינויים מהותיים יפורסמו באפליקציה לפחות 14 יום לפני כניסתם לתוקף.
              <br /><br />
              לשאלות בנוגע לפרטיות: <a href="mailto:privacy@israbis.com" className="c-accent" style={{ textDecoration: "none" }}>privacy@israbis.com</a>
              <br />
              לשאלות כלליות: <a href="mailto:support@israbis.com" className="c-accent" style={{ textDecoration: "none" }}>support@israbis.com</a>
            </p>
          </section>

        </div>
      </div>
    </section>
  );
}
