import type { Metadata } from "next";
import DownloadContent from "./DownloadContent";

export const metadata: Metadata = {
  title: "הורדה | IsraBis - הורידו את האפליקציה בחינם",
  description: "הורידו את IsraBis בחינם מ-App Store ו-Google Play. השוו מחירים, חסכו כסף, גלו מתכונים.",
};

export default function DownloadPage() {
  return <DownloadContent />;
}
