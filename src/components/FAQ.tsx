"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import SectionHeader from "./SectionHeader";
import FadeIn from "./FadeIn";

const ITEMS = [
  { q: "האם השירות חינמי?", a: "כן, IsraBis מציעה גרסה חינמית עם גישה בסיסית. תכונות מתקדמות זמינות במנויים: Basic (29.90 ₪/חודש), Premium (49.90 ₪/חודש), ו-Max (69.90 ₪/חודש)." },
  { q: "מאיפה מגיעים המחירים?", a: "המחירים מגיעים ממאגר המחירים הממשלתי לפי חוק שקיפות מחירי מזון 2014. הנתונים מתעדכנים מדי יום — מחירי מוצרים כל 4 שעות, מבצעים כל יום." },
  { q: "אילו רשתות נתמכות?", a: "33 רשתות שיווק כולל רמי לוי, שופרסל, ויקטורי, טיב טעם, מחסני השוק, יוחננוף, אושר עד, חצי חינם, מגה, יינות ביתן, ועוד 23 רשתות נוספות." },
  { q: "איך עובדת העגלה החכמה?", a: "מוסיפים מוצרים (מקטגוריות, ממתכונים, מסריקת ברקוד, או מסריקת קבלה), והמערכת משווה את העלות הכוללת בכל 33 הרשתות ומציגה את הזולה ביותר." },
  { q: "האם אפשר להשתמש עם המשפחה?", a: "בהחלט! ניתן לשתף רשימות קניות עם בני המשפחה, לעקוב אחרי הוצאות משותפות, ולקנות יחד בזמן אמת — כל אחד רואה מה נוסף ומה נמחק." },
  { q: "מהם כלי ה-AI?", a: "סריקת מקרר (צלמו, קבלו מתכונים), סריקת קלוריות (צלמו מנה, קבלו מידע תזונתי), מתכון מסרטון (לינק ליוטיוב/טיקטוק = מתכון מלא), סריקת קבלה (קבלה מהסופר = פריטים בעגלה), וישרא שף — עוזר AI שעונה על כל שאלה." },
  { q: "על אילו מכשירים זה עובד?", a: "IsraBis זמינה ל-iOS ול-Android. הורידו מ-App Store או Google Play. האפליקציה תומכת בעברית מלאה עם ממשק RTL." },
];

export default function FAQ() {
  return (
    <section className="sec">
      <div className="w-980">
        <SectionHeader
          label="שאלות נפוצות"
          title="יש שאלות? יש תשובות."
        />

        <Accordion.Root type="single" collapsible>
          {ITEMS.map((item, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <Accordion.Item
                value={`q-${i}`}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "var(--radius-lg)",
                  marginBottom: "var(--space-3)",
                  overflow: "hidden",
                }}
              >
                <Accordion.Trigger
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "var(--space-5) var(--space-6)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "var(--font-h4)",
                    fontWeight: 600,
                    color: "var(--text)",
                    textAlign: "right",
                    direction: "rtl",
                  }}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      color: "var(--text-muted)",
                      transition: "transform 0.25s ease",
                      flexShrink: 0,
                      marginInlineStart: "var(--space-4)",
                    }}
                    className="accordion-chevron"
                  />
                </Accordion.Trigger>
                <Accordion.Content className="accordion-content">
                  <div
                    style={{
                      padding: "0 var(--space-6) var(--space-5)",
                      fontSize: "var(--font-body)",
                      color: "var(--text-muted)",
                      lineHeight: "var(--leading-relaxed)",
                      textAlign: "right",
                      direction: "rtl",
                    }}
                  >
                    {item.a}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </FadeIn>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
