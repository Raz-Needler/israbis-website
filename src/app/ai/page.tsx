import type { Metadata } from "next";
import AIContent from "./AIContent";

export const metadata: Metadata = {
  title: "כלי AI חכמים — סריקת מקרר, מתכון מסרטון, סריקת קלוריות, עוזר בישול",
  description: "כלי בינה מלאכותית של IsraBis: סריקת מקרר שמזהה מרכיבים ומציעה מתכונים, סריקת קלוריות מתמונת מנה, מתכון מסרטון יוטיוב או טיקטוק בלחיצה, סריקת קבלה מהסופר, ועוזר AI ישרא שף שעונה על כל שאלה בבישול ותזונה.",
  alternates: { canonical: "/ai" },
};

export default function AIPage() {
  return <AIContent />;
}
