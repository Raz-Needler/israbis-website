import type { Metadata } from "next";
import StoresContent from "./StoresContent";

export const metadata: Metadata = {
  title: "השוואת מחירים בין 49 רשתות שיווק — רמי לוי, שופרסל, ויקטורי, אושר עד",
  description: "השוו מחירי סופרמרקט בין כל 49 רשתות השיווק בישראל: רמי לוי, שופרסל, ויקטורי, טיב טעם, מחסני השוק, יוחננוף, אושר עד, חצי חינם, מגה, יינות ביתן ועוד. מחירים מתעדכנים יומית ממאגר המחירים הממשלתי.",
  alternates: { canonical: "/stores" },
};

export default function StoresPage() {
  return <StoresContent />;
}
