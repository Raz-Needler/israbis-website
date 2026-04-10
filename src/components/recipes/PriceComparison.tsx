import Image from "next/image";

const CHAIN_META: Record<string, { nameHe: string; color: string; logo: string }> = {
  RAMI_LEVY: { nameHe: "רמי לוי", color: "#5B8C5A", logo: "/stores/rami_levy.png" },
  SHUFERSAL: { nameHe: "שופרסל", color: "#D4A254", logo: "/stores/shufersal.png" },
  OSHER_AD: { nameHe: "אושר עד", color: "#E85D04", logo: "/stores/osher_ad.png" },
  VICTORY: { nameHe: "ויקטורי", color: "#FF6B00", logo: "/stores/victory.png" },
  YEINOT_BITAN: { nameHe: "יינות ביתן", color: "#8B2252", logo: "/stores/yeinot_bitan.png" },
  HAZI_HINAM: { nameHe: "חצי חינם", color: "#FF1493", logo: "/stores/hazi_hinam.png" },
  TIV_TAAM: { nameHe: "טיב טעם", color: "#8B0000", logo: "/stores/tiv_taam.png" },
  YOCHANANOF: { nameHe: "יוחננוף", color: "#7B8FA1", logo: "/stores/yochananof.png" },
};

interface ChainCost {
  key: string;
  cost: number;
  verified: boolean;
}

interface Props {
  chains: ChainCost[];
  cheapestChain: string | null;
  savings: number;
  currency?: string;
}

export default function PriceComparison({ chains, cheapestChain, savings }: Props) {
  if (!chains.length) return null;

  return (
    <div className="glass-card-premium" style={{ padding: "var(--space-7)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        <h3 className="text-h4">השוואת מחירים בין רשתות</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {chains.map((chain, i) => {
          const meta = CHAIN_META[chain.key];
          const isCheapest = chain.key === cheapestChain;
          if (!meta) return null;

          return (
            <div
              key={chain.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-lg)",
                background: isCheapest ? "var(--accent-10)" : i % 2 === 0 ? "var(--bg-secondary)" : "transparent",
                border: isCheapest ? "1.5px solid var(--accent-20)" : "1.5px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              {/* Rank */}
              {isCheapest && (
                <span style={{ fontSize: 18 }}>&#x1F3C6;</span>
              )}

              {/* Logo */}
              <Image
                src={meta.logo}
                alt={meta.nameHe}
                width={28}
                height={28}
                style={{ borderRadius: "var(--radius-sm)", objectFit: "contain" }}
              />

              {/* Name */}
              <span className="text-body-sm" style={{ flex: 1, fontWeight: isCheapest ? 700 : 500 }}>
                {meta.nameHe}
              </span>

              {/* Price */}
              <span
                className="text-body"
                style={{
                  fontWeight: 800,
                  color: isCheapest ? "var(--accent)" : "var(--text)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                &#8362;{chain.cost.toFixed(2)}
              </span>

              {/* Cheapest badge */}
              {isCheapest && (
                <span className="badge" style={{ fontSize: "var(--font-label)" }}>
                  הכי זול
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Savings callout */}
      {savings > 0 && (
        <div
          style={{
            marginTop: "var(--space-5)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-lg)",
            background: "var(--accent-10)",
            textAlign: "center",
          }}
        >
          <p className="text-body" style={{ fontWeight: 700, color: "var(--accent)" }}>
            חוסכים &#8362;{savings.toFixed(2)} בקנייה ברשת הזולה
          </p>
          <p className="text-caption c-muted" style={{ marginTop: "var(--space-1)" }}>
            מחירים מתעדכנים יומית ממאגר המחירים הממשלתי
          </p>
        </div>
      )}
    </div>
  );
}
