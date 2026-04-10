import type { Metadata } from "next";
import FeaturesContent from "./FeaturesContent";

export const metadata: Metadata = {
  title: "תכונות — השוואת מחירי סופר, עגלת קניות חכמה, מתכונים, סריקת ברקוד",
  description: "כל התכונות של IsraBis: השוואת מחירי סופרמרקט בין 33 רשתות שיווק, עגלת קניות חכמה שמוצאת את הרשת הזולה, 60,000+ מתכונים עם מחירים, מעקב הוצאות מזון ותקציב, קניות משפחתיות בזמן אמת, סריקת ברקוד, ומעקב מזווה דיגיטלי.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return <FeaturesContent />;
}
