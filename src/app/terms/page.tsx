import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "תנאי שימוש",
  description: "תנאי השימוש של אפליקציית IsraBis — השוואת מחירי מזון בישראל.",
};

export default function TermsPage() {
  return (
    <section className="sec">
      <div className="w-980" style={{ maxWidth: 760 }}>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-3)" }}>תנאי שימוש — IsraBis</h1>
        <p className="text-caption c-muted" style={{ marginBottom: "var(--space-8)" }}>תאריך עדכון אחרון: מרץ 2026 &middot; גרסה: 2.0</p>

        <div className="legal-content" style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>1. הגדרות וקבלת התנאים</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              &quot;IsraBis&quot; או &quot;האפליקציה&quot; — אפליקציית IsraBis לניהול קניות, השוואת מחירים, וגילוי מתכונים. &quot;אנחנו&quot;, &quot;שלנו&quot; — בעלי ומפעילי IsraBis. &quot;משתמש&quot;, &quot;אתם&quot; — כל אדם המוריד, מתקין או משתמש באפליקציה.
            </p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
              בהורדה, התקנה או שימוש באפליקציה, אתם מסכימים לתנאי שימוש אלה (&quot;התנאים&quot;). אם אינכם מסכימים — אל תשתמשו באפליקציה. האפליקציה מיועדת למשתמשים בגילאי 13 ומעלה. שימוש על ידי קטינים מתחת לגיל 18 מותנה בהסכמת הורה או אפוטרופוס חוקי.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>2. תיאור השירות</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>IsraBis היא פלטפורמה המאפשרת:</p>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingInlineStart: "var(--space-5)", marginTop: "var(--space-2)" }}>
              <li>השוואת מחירי מוצרי מזון ב-33 רשתות סופרמרקט בישראל</li>
              <li>ניהול רשימות קניות ועגלות קניות חכמות</li>
              <li>חיפוש וגילוי מתכונים מהאפליקציה ומהאינטרנט</li>
              <li>סריקת ערכים תזונתיים מתמונות מזון באמצעות בינה מלאכותית (AI)</li>
              <li>חילוץ מתכונים מסרטוני וידאו (TikTok, Instagram, YouTube)</li>
              <li>סריקת מקרר לזיהוי מרכיבים והצעת מתכונים</li>
              <li>מעקב הוצאות קניות אישיות ומשפחתיות</li>
              <li>קנייה חיה (Live Shopping) עם שיתוף משפחתי</li>
              <li>שיחה עם &quot;ישרא שף&quot; — עוזר AI חכם לקניות ובישול</li>
            </ul>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
              נתוני מחירים מבוססים על מידע ציבורי המפורסם מכוח חוק קידום התחרות בענף המזון, התשע&quot;ד-2014 (חוק שקיפות מחירים).
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>3. חשבון משתמש</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              עליכם לספק מידע מדויק ועדכני בעת ההרשמה. אתם אחראים לשמירה על סודיות הסיסמה ולכל הפעילות בחשבונכם. יש לדווח מיד על כל שימוש לא מורשה. IsraBis רשאית להשעות חשבון בגין חשד לשימוש לא מורשה.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>4. מנויים ותשלומים</h2>

            <h3 className="text-h4" style={{ marginTop: "var(--space-4)", marginBottom: "var(--space-2)" }}>4.1 רמות שירות</h3>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>IsraBis מציעה את רמות השירות הבאות (מחירים בשקלים חדשים, כולל מע&quot;מ):</p>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingInlineStart: "var(--space-5)", marginTop: "var(--space-2)" }}>
              <li>חינם — גישה בסיסית עם מגבלות שימוש יומיות</li>
              <li>Basic — 29.90 &#8362; לחודש / 299.90 &#8362; לשנה</li>
              <li>Premium — 49.90 &#8362; לחודש / 499.90 &#8362; לשנה</li>
              <li>Max — 69.90 &#8362; לחודש / 699.90 &#8362; לשנה</li>
            </ul>

            <h3 className="text-h4" style={{ marginTop: "var(--space-4)", marginBottom: "var(--space-2)" }}>4.2 חידוש אוטומטי</h3>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              המנוי מתחדש אוטומטית בתום כל תקופת חיוב (חודשית או שנתית), אלא אם בוטל לפני כן. התשלום מחויב דרך Apple App Store או Google Play Store.
            </p>

            <h3 className="text-h4" style={{ marginTop: "var(--space-4)", marginBottom: "var(--space-2)" }}>4.3 ביטול מנוי — זכויותיכם על פי חוק הגנת הצרכן</h3>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>בהתאם לחוק הגנת הצרכן, התשמ&quot;א-1981:</p>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingInlineStart: "var(--space-5)", marginTop: "var(--space-2)" }}>
              <li>זכות ביטול תוך 14 ימים — ניתן לבטל את המנוי תוך 14 ימים ממועד ההרשמה, ללא צורך בנימוק.</li>
              <li>זכות ביטול בכל עת — ניתן לבטל את המנוי בכל עת. הביטול ייכנס לתוקף בסוף תקופת החיוב הנוכחית.</li>
              <li>זכות מורחבת — עולים חדשים, אזרחים ותיקים (מעל גיל 65) ואנשים עם מוגבלות זכאים לתקופת ביטול של 4 חודשים מיום ההרשמה.</li>
              <li>הפסקת חיוב — החיוב ייפסק תוך 3 ימי עסקים מקבלת הודעת הביטול.</li>
              <li>החזר — תינתן החזר יחסי עבור חלק השירות שלא נוצל.</li>
              <li>דמי ביטול — לא יגבו דמי ביטול העולים על 5% מסכום העסקה או 100 &#8362;, הנמוך מביניהם.</li>
            </ul>

            <h3 className="text-h4" style={{ marginTop: "var(--space-4)", marginBottom: "var(--space-2)" }}>4.4 דרכי ביטול</h3>
            <ul className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", paddingInlineStart: "var(--space-5)" }}>
              <li>באפליקציה — דרך הגדרות &gt; פרופיל &gt; ניהול מנוי</li>
              <li>בדוא&quot;ל — support@israbis.com</li>
              <li>דרך Apple App Store או Google Play Store — בהגדרות המנויים של חנות האפליקציות</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>5. פרסומות</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              הגרסה החינמית עשויה להציג פרסומות באמצעות Google AdMob, כולל באנרים, פרסומות מסך מלא ופרסומות תגמול (בהן ניתן לצפות בפרסומת כדי לקבל שימוש נוסף בתכונה). משתמשים במנויים בתשלום לא יראו פרסומות.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>6. תכונות בינה מלאכותית (AI)</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>האפליקציה משתמשת בטכנולוגיית בינה מלאכותית (Google Gemini) עבור: &quot;ישרא שף&quot; — עוזר שיחה חכם, סריקת קלוריות וערכים תזונתיים מתמונות מזון, זיהוי מרכיבים מתמונות מקרר, חילוץ מתכונים מסרטוני וידאו, ותמלול קלט קולי לטקסט.</p>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginTop: "var(--space-3)" }}>
              כל תוצאות ה-AI הן הערכות בלבד ואינן מדויקות ב-100%. ערכי קלוריות ותזונה הם קירובים. תוצאות AI אינן מהוות ייעוץ תזונתי, רפואי או בריאותי. IsraBis אינה אחראית לכל נזק הנובע מהסתמכות על תוצאות AI.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>7. עיבוד תמונות וקלט קולי</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              תמונות מזון שנשלחות לסריקה מעובדות בזמן אמת ואינן נשמרות בשרתינו לאחר העיבוד. הקלטות קוליות מתומללות לטקסט ונמחקות מיד לאחר התמלול. Google עשויה לעבד תמונות וקלט קולי בהתאם לתנאי השימוש ומדיניות הפרטיות שלה.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>8. תוכן משתמשים</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              אתם שומרים על הבעלות על תוכן שאתם יוצרים (מתכונים, תמונות, דירוגים). בשימוש באפליקציה, אתם מעניקים ל-IsraBis רישיון לא בלעדי, ללא תשלום, להשתמש, להציג ולהפיץ את התוכן שלכם במסגרת השירות.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>9. קניין רוחני</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              כל הזכויות באפליקציה, כולל עיצוב, קוד מקור, לוגו, סימנים מסחריים ואלגוריתמים, שייכות ל-IsraBis. מתכונים שנאספו ממקורות ציבוריים מוצגים לצרכי מידע בלבד ואינם שייכים ל-IsraBis.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>10. דיוק מחירים ומידע</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              נתוני מחירים מבוססים על מידע ציבורי המתפרסם בהתאם לחוק שקיפות מחירים. מחירים עשויים להשתנות בין סניפים ולהתעדכן מעת לעת. IsraBis אינה מתחייבת לדיוק מוחלט של המחירים ואין להסתמך עליהם כמחירים מחייבים. המחיר הסופי ייקבע בקופת הסופרמרקט בלבד.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>11. חיבור לחשבונות סופרמרקט</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              כאשר אתם מתחברים לחשבון סופרמרקט, הפעולה מתבצעת ישירות מול אתר הסופרמרקט באמצעות דפדפן מוטמע. IsraBis אינה שומרת את סיסמאותיכם. פרטי הכניסה נשמרים מקומית במכשירכם בלבד. פעולות הוספה לעגלה מתבצעות בשמכם ובחשבונכם ברשת הסופרמרקט.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>12. שירותי צד שלישי</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              האפליקציה משתמשת בשירותים הבאים: Google Gemini (עיבוד AI), Google AdMob (פרסומות בגרסה החינמית), RevenueCat (ניהול מנויים), Apple App Store / Google Play Store (עיבוד תשלומים). השימוש בשירותים אלה כפוף לתנאי השימוש ומדיניות הפרטיות שלהם.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>13. הגבלת אחריות</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              השירות מוצע &quot;כמות שהוא&quot; (AS IS). בכפוף לכל דין, IsraBis אינה אחראית לכל נזק ישיר, עקיף, מקרי או תוצאתי הנובע מהשימוש באפליקציה. סעיף זה אינו מגביל אחריות במקרים של רשלנות חמורה או זדון מצד IsraBis, בהתאם לדין הישראלי.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>14-16. שיפוי, סיום שירות, שינויים בתנאים</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              אתם מתחייבים לשפות את IsraBis מפני כל תביעה הנובעת מהפרת תנאים אלה. IsraBis רשאית להשעות חשבונות בגין הפרת תנאים. ניתן למחוק חשבון בכל עת דרך הגדרות הפרופיל. שינויים מהותיים בתנאים יפורסמו לפחות 14 יום לפני כניסתם לתוקף.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>17. הדין החל ויישוב סכסוכים</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              תנאים אלה כפופים לדיני מדינת ישראל. כל מחלוקת תידון בבתי המשפט המוסמכים במחוז תל אביב-יפו.
            </p>
          </section>

          <section>
            <h2 className="text-h3" style={{ marginBottom: "var(--space-3)" }}>18. יצירת קשר</h2>
            <p className="text-body c-muted" style={{ lineHeight: "var(--leading-relaxed)" }}>
              לשאלות בנוגע לתנאי השימוש: <a href="mailto:support@israbis.com" className="c-accent" style={{ textDecoration: "none" }}>support@israbis.com</a>
            </p>
          </section>

        </div>
      </div>
    </section>
  );
}
