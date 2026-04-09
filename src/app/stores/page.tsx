import type { Metadata } from "next";
import StoresContent from "./StoresContent";

export const metadata: Metadata = {
  title: "33 רשתות שיווק | IsraBis - כל הסופרים במקום אחד",
  description: "השוו מחירים בין כל 33 רשתות השיווק בישראל: רמי לוי, שופרסל, ויקטורי, טיב טעם, מחסני השוק, יוחננוף, ועוד 27 רשתות.",
};

export default function StoresPage() {
  return <StoresContent />;
}
