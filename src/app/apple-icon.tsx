import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #34C759, #248A3D)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            color: "#fff",
            fontFamily: "sans-serif",
            letterSpacing: "-0.05em",
          }}
        >
          IB
        </div>
      </div>
    ),
    { ...size }
  );
}
