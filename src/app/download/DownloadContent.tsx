"use client";

import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { useTheme, THEMES, type ThemeName } from "@/components/ThemeProvider";

export default function DownloadContent() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Hero download */}
      <section className="sec relative overflow-hidden" style={{ background: "var(--accent)", minHeight: "60vh", display: "flex", alignItems: "center" }}>
        <div className="absolute top-[10%] right-[5%] w-40 h-40 opacity-10 float">
          <Image src="/svg/composition_12.svg" alt="" width={160} height={160} />
        </div>
        <div className="w-980 text-center relative z-10">
          <FadeIn>
            <Image src="/images/israbis-logo.png" alt="IsraBis" width={120} height={48} className="mx-auto mb-6 brightness-0 invert opacity-90" />
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, color: "#fff", lineHeight: 1.08, marginBottom: 16 }}>
              הורידו את IsraBis.
              <br />
              התחילו לחסוך.
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p style={{ fontSize: 19, color: "rgba(255,255,255,0.8)", maxWidth: "40ch", margin: "0 auto 32px" }}>
              חינם. בלי פרסומות. בלי מעקב. פשוט חיסכון.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="btn btn-white" style={{ fontSize: 16 }}>App Store</button>
              <button className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", fontSize: 16 }}>
                Google Play
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What you get */}
      <section className="sec">
        <div className="w-980 text-center mb-10">
          <FadeIn>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800 }}>מה מקבלים?</h2>
          </FadeIn>
        </div>
        <div className="w-980 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { title: "השוואת מחירים", desc: "33 רשתות, 255,000+ מוצרים" },
            { title: "עגלה חכמה", desc: "מוצאת את הרשת הזולה אוטומטית" },
            { title: "1,000+ מתכונים", desc: "עם מרכיבים מתומחרים ומצב בישול" },
            { title: "כלי AI חכמים", desc: "סריקת מקרר, קלוריות, קבלה, סרטון" },
            { title: "מעקב הוצאות", desc: "תקציב, קטגוריות, תובנות" },
            { title: "קניות משפחתיות", desc: "רשימה משותפת בזמן אמת" },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.05}>
              <div className="glass-card p-6 text-right">
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Theme picker */}
      <section className="sec" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-980 text-center mb-10">
          <FadeIn>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800 }}>
              בחרו את הסגנון שלכם.
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 6 }}>לחצו כדי לשנות את ערכת הנושא של האתר.</p>
          </FadeIn>
        </div>
        <div className="w-980 grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.keys(THEMES) as ThemeName[]).map((k, i) => {
            const t = THEMES[k];
            const active = theme === k;
            return (
              <FadeIn key={k} delay={i * 0.05}>
                <button
                  onClick={() => setTheme(k)}
                  className="w-full rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]"
                  style={{ background: t.bg, border: active ? `2.5px solid ${t.accent}` : "2px solid var(--glass-border)" }}
                >
                  <div className="p-5 text-center">
                    <div className="space-y-1.5 mb-3">
                      <div className="h-4 rounded-lg" style={{ background: t.accent + "20" }} />
                      <div className="h-2 w-2/3 mx-auto rounded" style={{ background: t.accent + "10" }} />
                    </div>
                    <div className="w-5 h-5 rounded-full mx-auto mb-2" style={{ background: t.accent }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>{t.label}</span>
                  </div>
                </button>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </>
  );
}
