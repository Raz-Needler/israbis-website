interface Step {
  number: number;
  text: string;
  duration?: number | null;
  temperature?: string | null;
  tip?: string | null;
}

interface Props {
  steps: Step[];
}

export default function StepList({ steps }: Props) {
  return (
    <div className="glass-card-premium" style={{ padding: "var(--space-7)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" /></svg>
        <h3 className="text-h4">הוראות הכנה</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        {steps.map((step) => (
          <div key={step.number} style={{ display: "flex", gap: "var(--space-4)" }}>
            {/* Step number circle */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-pill)",
                background: "var(--accent)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "var(--font-body-sm)",
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {step.number}
            </div>

            <div style={{ flex: 1 }}>
              <p className="text-body" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: step.tip || step.duration ? "var(--space-2)" : 0 }}>
                {step.text}
              </p>

              {/* Meta badges */}
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                {step.duration && (
                  <span className="text-caption" style={{ color: "var(--accent)", fontWeight: 600 }}>
                    &#9201; {step.duration} {step.duration === 1 ? "דקה" : "דקות"}
                  </span>
                )}
                {step.temperature && (
                  <span className="text-caption c-muted" style={{ fontWeight: 500 }}>
                    &#127777;&#65039; {step.temperature}
                  </span>
                )}
              </div>

              {/* Tip */}
              {step.tip && (
                <div
                  style={{
                    marginTop: "var(--space-2)",
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--accent-10)",
                    borderInlineStart: "3px solid var(--accent)",
                  }}
                >
                  <p className="text-caption" style={{ fontWeight: 600, color: "var(--accent)", marginBottom: 2 }}>
                    &#128161; טיפ
                  </p>
                  <p className="text-caption c-muted">{step.tip}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
