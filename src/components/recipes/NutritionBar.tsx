interface Props {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

const NUTRIENTS = [
  { key: "calories", label: "קלוריות", unit: "", color: "#E8773A" },
  { key: "protein", label: "חלבון", unit: "g", color: "#34C759" },
  { key: "carbs", label: "פחמימות", unit: "g", color: "#007AFF" },
  { key: "fat", label: "שומן", unit: "g", color: "#EC4899" },
] as const;

export default function NutritionBar({ calories, protein, carbs, fat }: Props) {
  const values: Record<string, number | null> = { calories, protein, carbs, fat };
  const hasData = Object.values(values).some((v) => v !== null && v > 0);
  if (!hasData) return null;

  return (
    <div className="glass-card-premium" style={{ padding: "var(--space-6)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
        <h3 className="text-h4">ערכים תזונתיים</h3>
        <span className="text-caption c-muted">(למנה)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "var(--space-3)" }}>
        {NUTRIENTS.map((n) => {
          const value = values[n.key];
          if (value === null || value === 0) return null;

          return (
            <div
              key={n.key}
              style={{
                textAlign: "center",
                padding: "var(--space-4)",
                borderRadius: "var(--radius-lg)",
                background: `${n.color}08`,
                border: `1px solid ${n.color}15`,
              }}
            >
              <div style={{ fontSize: "var(--font-h3)", fontWeight: 800, color: n.color }}>
                {value}{n.unit}
              </div>
              <div className="text-caption c-muted" style={{ marginTop: 2, fontWeight: 500 }}>
                {n.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
