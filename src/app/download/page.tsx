import type { Metadata } from "next";
import DownloadContent from "./DownloadContent";

export const metadata: Metadata = {
  title: "הורדה חינם — אפליקציית השוואת מחירי סופר ומתכונים לאייפון ואנדרואיד",
  description: "הורידו את IsraBis בחינם מ-App Store ו-Google Play. אפליקציית השוואת מחירי סופרמרקט, מתכונים ללא הגבלה, כלי AI חכמים, קניות משפחתיות ומעקב הוצאות — הכל בעברית.",
  alternates: { canonical: "/download" },
};

export default function DownloadPage() {
  return <DownloadContent />;
}
