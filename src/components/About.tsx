"use client";

import Image from "next/image";
import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";

export default function About() {
  return (
    <section className="sec" style={{ background: "var(--bg-secondary)" }}>
      <div className="w-980">
        <SectionHeader
          label="הסיפור שלנו"
          title={<>למה <span className="grad-text">IsraBis</span> קיימת</>}
        />

        <div className="flex flex-col md:flex-row items-start" style={{ gap: "var(--space-9)" }}>
          <FadeIn className="flex-1">
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
              <p className="text-body" style={{ lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)" }}>
                ב-2011, <strong style={{ color: "var(--text)" }}>300,000 ישראלים יצאו לרחובות</strong> במחאה על יוקר המחיה. מחאת הקוטג&apos; הובילה לחוק שקיפות מחירי מזון 2014 — שמחייב כל רשת שיווק לפרסם מחירים בזמן אמת.
              </p>
              <p className="text-body" style={{ lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)" }}>
                עכשיו, ב-2026, ישראלים עדיין משלמים <strong style={{ color: "var(--text)" }}>52% יותר מהממוצע ב-OECD</strong> על מזון. הנתונים הפתוחים קיימים — אבל אף אחד לא הפך אותם לכלי שבאמת עוזר למשפחות.
              </p>
              <p className="text-body" style={{ lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)" }}>
                IsraBis נולדה כדי לסגור את הפער הזה. אנחנו לוקחים את מאגר המחירים הממשלתי, מחברים אותו למתכונים, לכלי AI חכמים, ולניהול קניות משפחתי — ומחזירים לכם את הכוח לבחור איפה לקנות ולמה.
              </p>
            </div>
          </FadeIn>

          <FadeIn className="flex-1" delay={0.1}>
            <div className="glass-card" style={{ padding: "var(--space-7)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "var(--radius-lg)", background: "var(--accent-15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div>
                    <p className="text-body-sm" style={{ fontWeight: 700 }}>נתונים ממשלתיים רשמיים</p>
                    <p className="text-caption c-muted">חוק שקיפות מחירי מזון 2014</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "var(--radius-lg)", background: "var(--accent-15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <div>
                    <p className="text-body-sm" style={{ fontWeight: 700 }}>עדכון יומי</p>
                    <p className="text-caption c-muted">מחירים כל 4 שעות, מבצעים כל יום</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "var(--radius-lg)", background: "var(--accent-15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div>
                    <p className="text-body-sm" style={{ fontWeight: 700 }}>נבנה בישראל, למשפחות בישראל</p>
                    <p className="text-caption c-muted">עברית מלאה, RTL, כשרות</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "var(--radius-lg)", background: "var(--accent-15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <div>
                    <p className="text-body-sm" style={{ fontWeight: 700 }}>פרטיות מלאה</p>
                    <p className="text-caption c-muted">בלי מעקב, בלי מכירת מידע</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
