import type { Metadata } from "next";
import FeaturesContent from "./FeaturesContent";

export const metadata: Metadata = {
  title: "תכונות | IsraBis - כל מה שהאפליקציה יודעת לעשות",
  description: "השוואת מחירים בין 33 רשתות, עגלת קניות חכמה, מתכונים, מעקב הוצאות, קניות משפחתיות, סריקת ברקוד, מעקב מזון, ועוד.",
};

export default function FeaturesPage() {
  return <FeaturesContent />;
}
