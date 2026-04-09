"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { Star, Shield } from "lucide-react";
import FadeIn from "./FadeIn";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 40, damping: 28 });
  const [d, setD] = useState("0");
  useEffect(() => { if (inView) mv.set(target); }, [inView, target, mv]);
  useEffect(() => { const u = sp.on("change", v => setD(Math.round(v).toLocaleString("he-IL"))); return u; }, [sp]);
  return <span ref={ref}>{d}{suffix}</span>;
}

export default function SocialProof() {
  return (
    <section className="sec-sm" style={{ background: "var(--bg-secondary)" }}>
      <div className="w-1120 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
        {/* Rating */}
        <FadeIn>
          <div style={{ padding: "var(--space-5) var(--space-4)" }}>
            <div className="flex justify-center gap-1 mb-2" style={{ direction: "ltr" }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={18} fill="var(--accent)" color="var(--accent)" />
              ))}
            </div>
            <div className="text-h4" style={{ fontWeight: 700 }}>4.9 מתוך 5</div>
            <div className="text-caption c-muted" style={{ marginTop: "var(--space-1)" }}>דירוג ב-App Store</div>
          </div>
        </FadeIn>

        {/* Users */}
        <FadeIn delay={0.08}>
          <div style={{ padding: "var(--space-5) var(--space-4)" }}>
            <div className="text-h2" style={{ fontWeight: 900, color: "var(--accent)", marginBottom: "var(--space-1)" }}>
              <Counter target={50000} suffix="+" />
            </div>
            <div className="text-caption c-muted">משתמשים פעילים</div>
          </div>
        </FadeIn>

        {/* Privacy */}
        <FadeIn delay={0.16}>
          <div style={{ padding: "var(--space-5) var(--space-4)" }}>
            <div className="flex justify-center mb-2">
              <Shield size={28} style={{ color: "var(--accent)" }} />
            </div>
            <div className="text-h4" style={{ fontWeight: 700 }}>מאובטח ופרטי</div>
            <div className="text-caption c-muted" style={{ marginTop: "var(--space-1)" }}>בלי מעקב. בלי פרסומות.</div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
