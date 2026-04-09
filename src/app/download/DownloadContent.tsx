"use client";

import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import SectionHeader from "@/components/SectionHeader";
import SocialProof from "@/components/SocialProof";
import FAQ from "@/components/FAQ";
import PhoneMockup from "@/components/PhoneMockup";
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
        <div className="w-980 flex flex-col md:flex-row items-center relative z-10" style={{ gap: "var(--space-9)" }}>
          <div className="flex-1 text-center md:text-right">
            <FadeIn>
              <Image src="/images/israbis-logo.png" alt="IsraBis" width={120} height={48} className="mx-auto md:mx-0 brightness-0 invert opacity-90" style={{ marginBottom: "var(--space-6)" }} />
            </FadeIn>
            <FadeIn delay={0.05}>
              <h1 className="text-h1" style={{ color: "#fff", marginBottom: "var(--space-4)" }}>
                הורידו את IsraBis.
                <br />
                התחילו לחסוך.
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-body" style={{ color: "rgba(255,255,255,0.8)", maxWidth: "40ch", margin: "0 auto var(--space-7) auto" }}>
                חינם. בלי פרסומות. בלי מעקב. פשוט חיסכון.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button className="btn btn-white">App Store</button>
                <button className="btn btn-ghost">Google Play</button>
              </div>
            </FadeIn>
          </div>
          <FadeIn className="hidden md:block flex-shrink-0" delay={0.2}>
            <PhoneMockup />
          </FadeIn>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* What you get */}
      <section className="sec">
        <div className="w-980">
          <SectionHeader
            label="מה כולל"
            title="כל מה שצריך. חינם."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { title: "השוואת מחירים", desc: "33 רשתות, 255,000+ מוצרים" },
              { title: "עגלה חכמה", desc: "מוצאת את הרשת הזולה אוטומטית" },
              { title: "90+ מתכונים", desc: "עם מרכיבים מתומחרים ומצב בישול" },
              { title: "כלי AI חכמים", desc: "סריקת מקרר, קלוריות, קבלה, סרטון" },
              { title: "מעקב הוצאות", desc: "תקציב, קטגוריות, תובנות" },
              { title: "קניות משפחתיות", desc: "רשימה משותפת בזמן אמת" },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.05}>
                <div className="glass-card p-6 text-right">
                  <h3 className="text-h4" style={{ marginBottom: "var(--space-1)" }}>{item.title}</h3>
                  <p className="text-body-sm c-muted">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Theme picker */}
      <section className="sec" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-980">
          <SectionHeader
            label="עיצוב"
            title="בחרו את הסגנון שלכם."
            subtitle="לחצו כדי לשנות את ערכת הנושא של האתר."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <div style={{ padding: "var(--space-5)", textAlign: "center" }}>
                      <div className="space-y-1.5" style={{ marginBottom: "var(--space-3)" }}>
                        <div className="h-4 rounded-lg" style={{ background: t.accent + "20" }} />
                        <div className="h-2 w-2/3 mx-auto rounded" style={{ background: t.accent + "10" }} />
                      </div>
                      <div className="w-5 h-5 rounded-full mx-auto" style={{ background: t.accent, marginBottom: "var(--space-2)" }} />
                      <span className="text-caption" style={{ fontWeight: 700, color: t.accent }}>{t.label}</span>
                    </div>
                  </button>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
