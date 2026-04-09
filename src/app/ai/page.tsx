import type { Metadata } from "next";
import AIContent from "./AIContent";

export const metadata: Metadata = {
  title: "כלים חכמים | IsraBis - AI שחוסך לך זמן וכסף",
  description: "סריקת מקרר, סריקת קלוריות, מתכון מסרטון, סריקת קבלה, עוזר AI — כלים מבוססי בינה מלאכותית שעושים את העבודה בשבילך.",
};

export default function AIPage() {
  return <AIContent />;
}
