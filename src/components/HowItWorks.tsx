"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import FadeIn from "./FadeIn";
import SectionHeader from "./SectionHeader";

const STEPS = [
  { num: "1", title: "בנו עגלה", desc: "הוסיפו מוצרים מקטגוריות, ממתכונים, או סרקו ברקוד.", svg: "/svg/composition_7.svg" },
  { num: "2", title: "השוו בין 33 רשתות", desc: "המערכת מחשבת את העלות בכל רשת ומדרגת מהזול ליקר.", svg: "/svg/composition_1.svg" },
  { num: "3", title: "חסכו כסף", desc: "בחרו את הרשת הזולה, שמרו את העגלה, ובצעו קנייה חכמה.", svg: "/svg/composition_4.svg" },
];

export default function HowItWorks() {
  return (
    <section className="sec">
      <div className="w-980">
        <SectionHeader
          label="איך זה עובד"
          title="3 צעדים לחיסכון חכם"
          subtitle="מהעגלה לקופה — פשוט, מהיר, וחוסך."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {STEPS.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.1}>
              <div className="glass-card text-center relative" style={{ padding: "var(--space-7)" }}>
                {/* Step number */}
                <div
                  style={{
                    position: "absolute", top: "var(--space-3)", right: "var(--space-3)",
                    width: 36, height: 36, borderRadius: "var(--radius-pill)",
                    background: "var(--accent)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "var(--font-body-sm)",
                  }}
                >
                  {step.num}
                </div>

                {/* SVG */}
                <div style={{ marginBottom: "var(--space-4)" }}>
                  <Image src={step.svg} alt={step.title} width={100} height={100} className="mx-auto" style={{ width: 100, height: 100 }} />
                </div>

                <h3 className="text-h4" style={{ marginBottom: "var(--space-2)" }}>{step.title}</h3>
                <p className="text-body-sm c-muted">{step.desc}</p>
              </div>
            </FadeIn>
          ))}

          {/* Connector arrows — desktop only */}
          <div className="hidden md:flex absolute inset-0 items-center justify-around pointer-events-none" style={{ paddingInline: "18%" }}>
            <ArrowLeft size={22} style={{ color: "var(--accent)", opacity: 0.3 }} />
            <ArrowLeft size={22} style={{ color: "var(--accent)", opacity: 0.3 }} />
          </div>
        </div>
      </div>
    </section>
  );
}
