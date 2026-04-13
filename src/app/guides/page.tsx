import type { Metadata } from "next";
import Link from "next/link";

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "מדריכים לחיסכון בקניות סופרמרקט",
  description: "מדריכים מקיפים להשוואת מחירים, חיסכון בסופר, ומתכונים עם מחירים",
  itemListElement: [
    { "@type": "ListItem", position: 1, url: "https://israbis.com/guides/hashvaat-mechirei-super", name: "השוואת מחירי סופר בישראל — מדריך מלא 2026" },
    { "@type": "ListItem", position: 2, url: "https://israbis.com/guides/matkonot-im-mechirim", name: "מתכונים עם מחירים — בשלו חכם, קנו בזול" },
    { "@type": "ListItem", position: 3, url: "https://israbis.com/guides/aplikatziya-lematkonot", name: "אפליקציית מתכונים בעברית — המדריך לבחירה הנכונה" },
    { "@type": "ListItem", position: 4, url: "https://israbis.com/guides/hisachon-bekniyot", name: "איך לחסוך בקניות סופר — 10 טיפים שעובדים" },
    { "@type": "ListItem", position: 5, url: "https://israbis.com/guides/srikat-makrer-ai", name: "סריקת מקרר AI — איך זה עובד ולמה זה משנה" },
    { "@type": "ListItem", position: 6, url: "https://israbis.com/guides/matkon-misirton", name: "מתכון מסרטון — מיוטיוב וטיקטוק למטבח שלכם" },
  ],
};

export const metadata: Metadata = {
  title: "מדריכים — השוואת מחירי סופר, מתכונים, חיסכון, AI",
  description: "מדריכים מקיפים לחיסכון בקניות סופרמרקט בישראל, השוואת מחירים בין רשתות שיווק, מתכונים חכמים עם מחירים, כלי AI לבישול, וטיפים לניהול תקציב מזון משפחתי.",
  alternates: { canonical: "/guides" },
};

const GUIDES = [
  {
    href: "/guides/hashvaat-mechirei-super",
    title: "השוואת מחירי סופר בישראל — מדריך מלא 2026",
    desc: "כל מה שצריך לדעת על השוואת מחירי סופרמרקט בין 33 רשתות שיווק בישראל. למה ואיך.",
    tag: "השוואת מחירים",
  },
  {
    href: "/guides/matkonot-im-mechirim",
    title: "מתכונים עם מחירים — בשלו חכם, קנו בזול",
    desc: "איך מתכונים עם השוואת מחירים משולבת חוסכים לכם מאות שקלים בחודש.",
    tag: "מתכונים",
  },
  {
    href: "/guides/aplikatziya-lematkonot",
    title: "אפליקציית מתכונים בעברית — המדריך לבחירה הנכונה",
    desc: "סקירת אפליקציות המתכונים הטובות בישראל וההבדלים ביניהן.",
    tag: "אפליקציה",
  },
  {
    href: "/guides/hisachon-bekniyot",
    title: "איך לחסוך בקניות סופר — 10 טיפים שעובדים",
    desc: "טיפים מעשיים לחיסכון של מאות שקלים בחודש על קניות מזון בסופרמרקט.",
    tag: "חיסכון",
  },
  {
    href: "/guides/srikat-makrer-ai",
    title: "סריקת מקרר AI — איך זה עובד ולמה זה משנה",
    desc: "טכנולוגיית AI שמזהה מה יש במקרר ומציעה מתכונים — צמצום בזבוז מזון וחיסכון.",
    tag: "AI",
  },
  {
    href: "/guides/matkon-misirton",
    title: "מתכון מסרטון — מיוטיוב וטיקטוק למטבח שלכם",
    desc: "איך להפוך כל סרטון בישול לינק למתכון כתוב עם רשימת קניות ומחירים.",
    tag: "AI",
  },
];

export default function GuidesPage() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    <section className="sec">
      <div className="w-980">
        <h1 className="text-h1" style={{ marginBottom: "var(--space-3)" }}>
          מדריכים
        </h1>
        <p className="text-body c-muted" style={{ marginBottom: "var(--space-9)", maxWidth: "55ch", lineHeight: "var(--leading-relaxed)" }}>
          מדריכים מקיפים על השוואת מחירי סופרמרקט, מתכונים חכמים, כלי AI לבישול, וטיפים לחיסכון בקניות מזון בישראל.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="glass-card-premium block"
              style={{ padding: "var(--space-6) var(--space-7)", textDecoration: "none", color: "inherit" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
                <span className="badge">{g.tag}</span>
              </div>
              <h2 className="text-h3" style={{ marginBottom: "var(--space-2)" }}>{g.title}</h2>
              <p className="text-body-sm c-muted">{g.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
