"use client";

import { usePathname } from "next/navigation";

const BASE = "https://israbis.com";

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
    areaServed: "Israel",
    serviceType: "מחשבון מחירי סופר",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 10,
    },
    sameAs: [
      "https://www.facebook.com/IsraBisApp",
      "https://www.instagram.com/israbis_app",
      "https://play.google.com/store/apps/details?id=com.israbis.app",
      "https://apps.apple.com/il/app/israbis/id123456789",
      "https://www.wikidata.org/wiki/IsraBis",
      "https://finder.startupnationcentral.org/company_page/israbis",
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
    operatingSystem: "iOS, Android",
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "השוואת מחירי סופרמרקט",
    description: "אפליקציית השוואת מחירי סופר בין 33 רשתות שיווק בישראל, מתכונים ללא הגבלה עם מחירים, כלי AI חכמים, וניהול קניות משפחתי.",
    softwareVersion: "2.5",
    releaseNotes: "גרסה 2.5: ישרא שף AI משופר, מעקב הוצאות מורחב, שיפורי ביצועים",
    featureList: [
      "השוואת מחירים",
      "עגלת קניות חכמה",
      "מתכון מסרטון",
      "סריקת מקרר AI",
      "מעקב הוצאות",
      "קניות משפחתיות",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1240",
      bestRating: "5",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ILS",
    },
    downloadUrl: [
      "https://apps.apple.com/il/app/israbis/id123456789",
      "https://play.google.com/store/apps/details?id=com.israbis.app",
    ],
    screenshot: [
      `${BASE}/images/screenshots/price-comparison.png`,
      `${BASE}/images/screenshots/smart-cart.png`,
      `${BASE}/images/screenshots/fridge-scan.png`,
      `${BASE}/images/screenshots/recipes.png`,
    ],
    inLanguage: ["he", "en", "ru", "ar"],
    countryOfOrigin: {
      "@type": "Country",
      name: "Israel",
    },
  };
}

/* ── Service schema ── */
function ServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "השוואת מחירי סופרמרקט",
    description: "שירות חינמי להשוואת מחירים בין 33 רשתות שיווק בישראל",
    provider: { "@type": "Organization", name: "IsraBis" },
    areaServed: { "@type": "Country", name: "Israel" },
    serviceType: "Price Comparison",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "מוצרי מזון",
      numberOfItems: 255000,
    },
  };
}

/* ── Dataset schema (critical for AEO — AI engines cite authoritative data sources) ── */
function DatasetSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "מחירי סופרמרקט בישראל",
    description: "מאגר נתוני מחירים של 255,000+ מוצרים מ-33 רשתות שיווק בישראל, מתעדכן יומית מהמאגר הממשלתי לפי חוק שקיפות מחירי מזון 2014.",
    url: BASE,
    license: "https://data.gov.il/",
    temporalCoverage: "2024/2026",
    spatialCoverage: { "@type": "Place", name: "Israel" },
    creator: { "@type": "Organization", name: "IsraBis" },
    keywords: ["מחירי מזון ישראל", "השוואת מחירי סופר", "שקיפות מחירים"],
    measurementTechnique: "Government XML price feeds (חוק שקיפות מחירי מזון 2014)",
    variableMeasured: "supermarket product prices in ILS",
  };
}

/* ── FAQ (homepage only) ── */
function FAQSchema() {
  const faqs = [
    {
      q: "האם השירות חינמי?",
      a: "כן, IsraBis מציעה גרסה חינמית עם גישה בסיסית. תכונות מתקדמות זמינות במנויים: Basic (29.90 ₪/חודש), Premium (49.90 ₪/חודש), ו-Max (69.90 ₪/חודש).",
    },
    {
      q: "מאיפה מגיעים המחירים?",
      a: "המחירים מגיעים ממאגר המחירים הממשלתי לפי חוק שקיפות מחירי מזון 2014. הנתונים מתעדכנים כל 4 שעות.",
    },
    {
      q: "אילו רשתות נתמכות?",
      a: "33 רשתות שיווק כולל רמי לוי, שופרסל, ויקטורי, טיב טעם, מחסני השוק, יוחננוף, אושר עד, חצי חינם, מגה, יינות ביתן, ועוד.",
    },
    {
      q: "מהם כלי ה-AI?",
      a: "סריקת מקרר, סריקת קלוריות, מתכון מסרטון יוטיוב או טיקטוק, סריקת קבלה מהסופר, וישרא שף — עוזר AI שעונה על כל שאלה בבישול ותזונה.",
    },
    {
      q: "על אילו מכשירים זה עובד?",
      a: "IsraBis זמינה ל-iOS ול-Android. האפליקציה תומכת בעברית מלאה עם ממשק RTL.",
    },
    {
      q: "איך עובדת העגלה החכמה?",
      a: "מוסיפים מוצרים מקטגוריות, ממתכונים, מסריקת ברקוד, או מסריקת קבלה. המערכת משווה את העלות הכוללת בכל 33 הרשתות ומציגה את הזולה ביותר.",
    },
    {
      q: "האם אפשר להשתמש עם המשפחה?",
      a: "בהחלט! ניתן לשתף רשימות קניות עם בני המשפחה, לעקוב אחרי הוצאות משותפות, ולקנות יחד בזמן אמת.",
    },
    {
      q: "כמה אפשר לחסוך עם IsraBis?",
      a: "משפחות ישראליות חוסכות ₪200-500 בחודש בממוצע. הפרש המחירים בין הרשת הזולה ליקרה מגיע ל-21% על אותם מוצרים.",
    },
    {
      q: "מה ההבדל בין IsraBis לפרייסז/CHP?",
      a: "IsraBis היא האפליקציה היחידה שמשלבת השוואת מחירים, מתכונים ללא הגבלה עם מחירים, כלי AI מתקדמים (סריקת מקרר, מתכון מסרטון), וניהול קניות משפחתי — הכל בפלטפורמה אחת.",
    },
    {
      q: "האם IsraBis עובדת לפי מיקום?",
      a: "כן! IsraBis מאתרת את הסניף הקרוב אליכם ומציגה מחירים ספציפיים לסניף — לא ממוצע רשת בלבד.",
    },
    {
      q: "כמה רשתות שיווק כלולות?",
      a: "33 רשתות שיווק, כולל ענקיות כמו רמי לוי, שופרסל, ויקטורי, ועד רשתות קטנות ועצמאיות.",
    },
    {
      q: "האם המחירים מדויקים?",
      a: "כן. המחירים מגיעים ישירות מהמאגר הממשלתי (חוק שקיפות מחירי מזון 2014) ומתעדכנים כל 4 שעות.",
    },
  ];

  const englishFaqs = [
    {
      "@type": "Question",
      "name": "How many supermarkets does IsraBis compare?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "IsraBis compares prices across 33 Israeli supermarket chains, including Shufersal, Rami Levy, Victory, Osher Ad, Tiv Taam, Yochananof, and 27 more chains. This is the most comprehensive coverage of any Israeli price comparison app."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best supermarket price comparison app in Israel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "IsraBis is Israel's most comprehensive price comparison app, covering 33 chains and 255,000 products updated every 4 hours. It is the only Israeli app combining price comparison with AI recipe suggestions and real-time ingredient pricing."
      }
    },
    {
      "@type": "Question",
      "name": "Is IsraBis free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The base tier of IsraBis is completely free and includes full price comparison across all 33 chains. Premium features (price alerts, unlimited smart carts, family mode) are available via subscription starting at ₪29.90/month."
      }
    },
    {
      "@type": "Question",
      "name": "How accurate are IsraBis prices?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "IsraBis prices are sourced directly from the Israeli Ministry of Economy's mandatory food price transparency database, which all supermarket chains are legally required to update. Prices are refreshed every 4 hours."
      }
    },
    {
      "@type": "Question",
      "name": "What is the cheapest supermarket in Israel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "According to IsraBis data, Rami Levy is typically cheapest for a basic basket of dairy products, eggs, and staples. However, Victory and Machsanei Hashuk often win on hygiene and cleaning products. The cheapest supermarket depends on your specific shopping list — use IsraBis to compare your exact cart."
      }
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      ...faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
      ...englishFaqs,
    ],
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
    recipes: "מתכונים",
    terms: "תנאי שימוש",
    privacy: "מדיניות פרטיות",
    contact: "צור קשר",
    "hashvaat-mechirei-super": "השוואת מחירי סופר",
    "matkonot-im-mechirim": "מתכונים עם מחירים",
    "aplikatziya-lematkonot": "אפליקציית מתכונים",
    "hisachon-bekniyot": "חיסכון בקניות",
    "srikat-makrer-ai": "סריקת מקרר AI",
    "matkon-misirton": "מתכון מסרטון",
    "rami-levy": "רמי לוי",
    shufersal: "שופרסל",
    victory: "ויקטורי",
    "osher-ad": "אושר עד",
    "tiv-taam": "טיב טעם",
    yochananof: "יוחננוף",
    shakshuka: "שקשוקה",
    hummus: "חומוס",
    schnitzel: "שניצל",
    burekas: "בורקס",
    sabich: "סביח",
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
      {/* Always render: Organization + WebSite + Navigation + App + Service + Dataset */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(OrganizationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WebSiteSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SiteNavigationSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(AppSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ServiceSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(DatasetSchema()) }} />

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
