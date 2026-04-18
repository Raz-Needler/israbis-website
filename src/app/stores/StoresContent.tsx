"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import SectionHeader from "@/components/SectionHeader";
import HowItWorks from "@/components/HowItWorks";
import HeroCard from "@/components/HeroCard";

const ALL_STORES = [
  { key: "rami_levy",        name: "רמי לוי",        color: "#5B8C5A", img: "rami_levy.png" },
  { key: "shufersal",        name: "שופרסל",          color: "#D4A254", img: "shufersal.png" },
  { key: "victory",          name: "ויקטורי",         color: "#FF6B00", img: "victory.png" },
  { key: "tiv_taam",         name: "טיב טעם",         color: "#8B0000", img: "טיב טעם.png" },
  { key: "machsanei_hashuk", name: "מחסני השוק",      color: "#2E8B57", img: "מחסני השוק.png" },
  { key: "yochananof",       name: "יוחננוף",         color: "#7B8FA1", img: "yochananof.png" },
  { key: "osher_ad",         name: "אושר עד",         color: "#E85D04", img: "osher_ad.png" },
  { key: "yeinot_bitan",     name: "יינות ביתן",      color: "#8B2252", img: "yeinot_bitan.png" },
  { key: "hazi_hinam",       name: "חצי חינם",        color: "#FF1493", img: "hazi_hinam.png" },
  { key: "mega",             name: "מגה",             color: "#2196F3", img: "mega.png" },
  { key: "dor_alon",         name: "דור אלון",        color: "#FF8C00", img: "dor_alon.png" },
  { key: "zol_vebegadol",    name: "זול ובגדול",      color: "#1565C0", img: "zol_vebegadol.png" },
  { key: "stop_market",      name: "סטופ מרקט",       color: "#F44336", img: "stop_market.png" },
  { key: "king_store",       name: "קינג סטור",       color: "#9C27B0", img: "קינג סטור.png" },
  { key: "good_pharm",       name: "גוד פארם",        color: "#4DB6AC", img: "good_pharm.png" },
  { key: "super_pharm",      name: "סופר-פארם",       color: "#00BCD4", img: "super_pharm.png" },
  { key: "bareket",          name: "ברקת",            color: "#795548", img: "סופר ברקת.png" },
  { key: "polizer",          name: "פוליצר",          color: "#607D8B", img: "פוליצר.png" },
  { key: "keshet",           name: "קשת",             color: "#E91E63", img: "keshet.png" },
  { key: "het_cohen",        name: "ח. כהן",          color: "#8D6E63", img: "ח. כהן.png" },
  { key: "cofix",            name: "קופיקס",          color: "#3F51B5", img: "cofix.png" },
  { key: "salach_dabach",    name: "סאלח דבאח",       color: "#388E3C", img: "salach_dabach.png" },
  { key: "super_yuda",       name: "סופר יהודה",      color: "#F57C00", img: "סופר יהודה.png" },
  { key: "super_sapir",      name: "סופר ספיר",       color: "#42A5F5", img: "super_sapir.png" },
  { key: "quik",             name: "קוויק",           color: "#66BB6A", img: "קוויק.png" },
  { key: "maayan_2000",      name: "מעיין 2000",      color: "#5C6BC0", img: "מעיין 2000.png" },
  { key: "netiv_hased",      name: "נתיב החסד",       color: "#00897B", img: "נתיב החסד.png" },
  { key: "shefa_birkat",     name: "שפע ברכת",        color: "#7E57C2", img: "שפע ברכת השם.png" },
  { key: "shuk_hair",        name: "שוק העיר",        color: "#EF5350", img: "שוק העיר.png" },
  { key: "yellow",           name: "יילו",            color: "#FDD835", img: "יילו.png" },
  { key: "fresh_market",     name: "פרש מרקט",        color: "#26C6DA", img: "פרש מרקט.png" },
  { key: "meshnat_yosef",    name: "משנת יוסף",       color: "#4E342E", img: "משנת יוסף.png" },
  { key: "wolt",             name: "וולט",            color: "#00B2FF", img: "wolt.png" },
];

export default function StoresContent() {
  return (
    <>
      {/* Header — HeroCard */}
      <section className="sec" style={{ paddingBottom: "var(--space-6)", background: "var(--bg-secondary)" }}>
        <div className="w-1120" style={{ marginBottom: "var(--space-7)" }}>
          <FadeIn>
            <HeroCard
              variant="topography"
              eyebrow="IsraBis · רשתות"
              title={<>כל <span className="c-accent">33 הרשתות</span> במקום אחד.</>}
              subtitle="רמי לוי, שופרסל, ויקטורי, טיב טעם, מחסני השוק, יוחננוף, אושר עד, חצי חינם, מגה, יינות ביתן — ועוד 23 רשתות. עדכון יומי, ישירות ממאגר המחירים הממשלתי."
              cta={{ label: "הורידו חינם", href: "/download" }}
            />
          </FadeIn>
        </div>
      </section>

      {/* Savings context */}
      <section className="sec-sm" style={{ background: "var(--bg)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <span className="text-h1" style={{ fontWeight: 900, color: "var(--accent)" }}>
              עד 21% הפרש
            </span>
            <p className="text-body-sm c-muted" style={{ marginTop: "var(--space-2)", maxWidth: "52ch", margin: "var(--space-2) auto 0" }}>
              הפרש בין הרשת הזולה ליקרה על סל זהה של 50 מוצרים בסיסיים. סל של ₪452 ברמי לוי עולה ₪548 בשופרסל דיל.
              <br />
              <span className="text-caption c-dimmer">(מקור: סקר Anglo-List, נתוני חוק שקיפות מחירי מזון 2014)</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* All stores grid */}
      <section className="sec" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-1120">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {ALL_STORES.map((s, i) => (
              <FadeIn key={s.key} delay={i * 0.02}>
                <div className="store-chip" style={{ borderColor: s.color + "25", padding: "var(--space-5) var(--space-3)" }}>
                  <Image src={`/stores/${s.img}`} alt={s.name} width={44} height={44} className="w-10 h-10 object-contain rounded-xl" />
                  <span className="text-caption" style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{s.name}</span>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <p className="text-center text-caption c-muted" style={{ marginTop: "var(--space-8)" }}>
              33 רשתות שיווק. המחירים מתעדכנים מדי יום.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* CTA */}
      <section className="sec" style={{ background: "var(--accent)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <h2 className="text-h1" style={{ color: "#fff", marginBottom: "var(--space-4)" }}>
              התחילו לחסוך היום
            </h2>
            <Link href="/download" className="btn btn-white">הורידו בחינם</Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
