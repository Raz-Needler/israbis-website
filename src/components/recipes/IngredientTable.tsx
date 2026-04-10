interface Ingredient {
  item: string;
  amount: string;
}

interface Props {
  ingredients: Ingredient[];
  servings: number;
}

export default function IngredientTable({ ingredients, servings }: Props) {
  return (
    <div className="glass-card-premium" style={{ padding: "var(--space-7)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z" /><path d="M6 9.01V9" /></svg>
          <h3 className="text-h4">מרכיבים</h3>
        </div>
        <span className="badge">{servings} מנות</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        {ingredients.map((ing, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-md)",
              background: i % 2 === 0 ? "var(--bg-secondary)" : "transparent",
            }}
          >
            <span className="text-body-sm" style={{ fontWeight: 500 }}>{ing.item}</span>
            <span className="text-body-sm c-muted" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
              {ing.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
