"use client";

import { usePathname } from "next/navigation";

const BASE = "https://www.israbis.com";

/* ── Organization ── */
function OrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IsraBis",
    alternateName: "ישראביס",
    url: BASE,
    logo: `${BASE}/images/israbis-logo.png`,
    description: "אפליקציית השוואת מחירי סופרמרקט, מתכונים, וכלי AI חכמים בישראל",
    foundingDate: "2025",
    sameAs: [
      // Add all social profiles here when created — critical for Knowledge Panel
      // "https://www.facebook.com/IsraBis",
      // "https://www.instagram.com/IsraBis",
      // "https://www.linkedin.com/company/IsraBis",
      // "https://twitter.com/IsraBis",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@israbis.com",
      contactType: "customer support",
      availableLanguage: ["Hebrew"],
    },
  };
}

/* ── WebSite + SearchAction (enables sitelinks search box in Google) ── */
function WebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "IsraBis",
    alternateName: "ישראביס",
    url: BASE,
    inLanguage: "he",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE}/guides?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ── SiteNavigationElement (hints sitelinks to Google) ── */
function SiteNavigationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      { "@type": "SiteNavigationElement", position: 1, name: "תכונות", description: "השוואת מחירים, עגלה חכמה, מתכונים, סריקת ברקוד", url: `${BASE}/features` },
      { "@type": "SiteNavigationElement", position: 2, name: "כלים חכמים", description: "סריקת מקרר, מתכון מסרטון, סריקת קלוריות, AI", url: `${BASE}/ai` },
      { "@type": "SiteNavigationElement", position: 3, name: "רשתות", description: "33 רשתות שיווק — רמי לוי, שופרסל, ויקטורי", url: `${BASE}/stores` },
      { "@type": "SiteNavigationElement", position: 4, name: "מדריכים", description: "השוואת מחירי סופר, מתכונים, חיסכון", url: `${BASE}/guides` },
      { "@type": "SiteNavigationElement", position: 5, name: "הורדה", description: "הורידו את IsraBis בחינם ל-iOS ו-Android", url: `${BASE}/download` },
    ],
  };
}

/* ── SoftwareApplication ── */
function AppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "IsraBis",
    operatingSystem: "iOS, ANDROID",
    applicationCategory: "FoodApplication",
    applicationSubCategory: "השוואת מחירי סופרמרקט",
    description: "אפליקציית השוואת מחירי סופר בין 33 רשתות שיווק בישראל, מתכונים ללא הגבלה עם מחירים, כלי AI חכמים, וניהול קניות משפחתי.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ILS",
    },
    inLanguage: "he",
    countryOfOrigin: {
      "@type": "Country",
      name: "Israel",
    },
  };
}

/* ── FAQ (homepage only) ── */
function FAQSchema() {
  const faqs = [
    { q: "האם השירות חינמי?", a: "כן, IsraBis מציעה גרסה חינמית עם גישה בסיסית. תכונות מתקדמות זמינות במנויים: Basic (29.90 ₪/חודש), Premium (49.90 ₪/חודש), ו-Max (69.90 ₪/חודש)." },
    { q: "מאיפה מגיעים המחירים?", a: "המחירים מגיעים ממאגר המחירים הממשלתי לפי חוק שקיפות מחירי מזון 2014. הנתונים מתעדכנים מדי יום." },
    { q: "אילו רשתות נתמכות?", a: "33 רשתות שיווק כולל רמי לוי, שופרסל, ויקטורי, טיב טעם, מחסני השוק, יוחננוף, אושר עד, חצי חינם, מגה, יינות ביתן, ועוד." },
    { q: "מהם כלי ה-AI?", a: "סריקת מקרר, סריקת קלוריות, מתכון מסרטון יוטיוב או טיקטוק, סריקת קבלה מהסופר, וישרא שף — עוזר AI שעונה על כל שאלה בבישול ותזונה." },
    { q: "על אילו מכשירים זה עובד?", a: "IsraBis זמינה ל-iOS ול-Android. האפליקציה תומכת בעברית מלאה עם ממשק RTL." },
    { q: "איך עובדת העגלה החכמה?", a: "מוסיפים מוצרים מקטגוריות, ממתכונים, מסריקת ברקוד, או מסריקת קבלה. המערכת משווה את העלות הכוללת בכל 33 הרשתות ומציגה את הזולה ביותר." },
    { q: "האם אפשר להשתמש עם המשפחה?", a: "בהחלט! ניתן לשתף רשימות קניות עם בני המשפחה, לעקוב אחרי הוצאות משותפות, ולקנות יחד בזמן אמת." },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/* ── BreadcrumbList (for subpages) ── */
function BreadcrumbSchema(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const nameMap: Record<string, string> = {
    features: "תכונות",
    ai: "כלים חכמים",
    stores: "רשתות",
    download: "הורדה",
    guides: "מדריכים",
    terms: "תנאי שימוש",
    privacy: "מדיניות פרטיות",
    contact: "צור קשר",
    "hashvaat-mechirei-super": "השוואת מחירי סופר",
    "matkonot-im-mechirim": "מתכונים עם מחירים",
    "aplikatziya-lematkonot": "אפליקציית מתכונים",
    "hisachon-bekniyot": "חיסכון בקניות",
    "srikat-makrer-ai": "סריקת מקרר AI",
    "matkon-misirton": "מתכון מסרטון",
  };

  const items = [
    { "@type": "ListItem" as const, position: 1, name: "בית", item: BASE },
  ];

  let currentPath = "";
  segments.forEach((seg, i) => {
    currentPath += `/${seg}`;
    items.push({
      "@type": "ListItem" as const,
      position: i + 2,
      name: nameMap[seg] || seg,
      item: `${BASE}${currentPath}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export default function JsonLd() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const breadcrumb = BreadcrumbSchema(pathname);

  return (
    <>
      {/* Always render: Organization + WebSite + Navigation + App */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(OrganizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebSiteSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SiteNavigationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(AppSchema()) }} />

      {/* Homepage: FAQ schema */}
      {isHome && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQSchema()) }} />
      )}

      {/* Subpages: Breadcrumb schema */}
      {breadcrumb && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      )}
    </>
  );
}
