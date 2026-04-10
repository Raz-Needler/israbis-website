import { ImageResponse } from "next/og";

export const alt = "IsraBis — השוואת מחירי סופר בישראל | 33 רשתות | מתכונים ללא הגבלה";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fffe 0%, #e8f5e9 30%, #c8e6c9 70%, #a5d6a7 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Accent circles */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(52,199,89,0.12)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(0,122,255,0.08)" }} />

        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #34C759, #248A3D)",
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 900, color: "#fff" }}>IB</div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#1A1A1A",
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          IsraBis
        </div>

        {/* Hebrew subtitle */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#3C3C43",
            textAlign: "center",
            direction: "rtl",
            marginBottom: 32,
          }}
        >
          השוואת מחירי סופר | מתכונים | AI חכם
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 40 }}>
          {[
            { n: "33", l: "רשתות" },
            { n: "255K+", l: "מוצרים" },
            { n: "∞", l: "מתכונים" },
          ].map((s) => (
            <div key={s.n} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#34C759" }}>{s.n}</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: "#8E8E93", direction: "rtl" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #34C759, #007AFF, #34C759)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
