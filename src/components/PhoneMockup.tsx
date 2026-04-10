"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, type ReactNode } from "react";

const SCREENSHOTS = [
  { src: "/images/Home_SCreen.jpg", alt: "IsraBis - מסך הבית" },
  { src: "/images/Build_Cart.jpg", alt: "IsraBis - בניית עגלה" },
  { src: "/images/Recipe_Screen.jpg", alt: "IsraBis - מתכונים" },
  { src: "/images/Start_Cooking.jpg", alt: "IsraBis - מצב בישול" },
  { src: "/images/Add_Recipe.jpg", alt: "IsraBis - הוספת מתכון" },
];

interface Props {
  children?: ReactNode;
  className?: string;
  screenshot?: string;
}

export default function PhoneMockup({ children, className = "", screenshot }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % SCREENSHOTS.length);
  }, []);

  useEffect(() => {
    if (children || screenshot) return;
    const id = setInterval(next, 3200);
    return () => clearInterval(id);
  }, [children, screenshot, next]);

  return (
    <div className={`float ${className}`} style={{ width: "clamp(200px, 32vw, 280px)" }}>
      <div
        style={{
          aspectRatio: "9 / 19.5",
          borderRadius: "clamp(30px, 4.5vw, 40px)",
          border: "clamp(4px, 0.8vw, 6px) solid #1a1a1a",
          background: "#000",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(70px, 12vw, 100px)",
            height: "clamp(20px, 3vw, 28px)",
            borderRadius: "var(--radius-pill)",
            background: "#000",
            zIndex: 10,
          }}
        />

        {/* Interior */}
        <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", borderRadius: "inherit" }}>
          {children ? (
            children
          ) : screenshot ? (
            <Image src={screenshot} alt="IsraBis" fill style={{ objectFit: "cover" }} />
          ) : (
            <>
              {SCREENSHOTS.map((s, i) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  fill
                  style={{
                    objectFit: "cover",
                    opacity: i === current ? 1 : 0,
                    transition: "opacity 0.6s ease-in-out",
                  }}
                  priority={i === 0}
                />
              ))}
              {/* Dots indicator */}
              <div style={{
                position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
                display: "flex", gap: 4, zIndex: 10,
              }}>
                {SCREENSHOTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Screenshot ${i + 1}`}
                    style={{
                      width: i === current ? 16 : 6, height: 6,
                      borderRadius: "var(--radius-pill)",
                      background: i === current ? "#fff" : "rgba(255,255,255,0.4)",
                      border: "none", cursor: "pointer", padding: 0,
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
