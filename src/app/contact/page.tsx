import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "צור קשר",
  description: "צרו קשר עם צוות IsraBis — נשמח לשמוע מכם.",
};

export default function ContactPage() {
  return (
    <section className="sec">
      <div className="w-980" style={{ maxWidth: 640 }}>
        <h1 className="text-h1" style={{ marginBottom: "var(--space-3)" }}>צרו קשר</h1>
        <p className="text-body c-muted" style={{ marginBottom: "var(--space-9)", lineHeight: "var(--leading-relaxed)" }}>
          נשמח לשמוע מכם. שלחו לנו הודעה ונחזור אליכם בהקדם.
        </p>

        <form
          action="mailto:support@israbi.app"
          method="POST"
          encType="text/plain"
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}
        >
          <div>
            <label htmlFor="name" className="text-body-sm" style={{ fontWeight: 600, display: "block", marginBottom: "var(--space-2)" }}>
              שם מלא
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="text-body"
              style={{
                width: "100%",
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-secondary)",
                border: "1px solid var(--glass-border)",
                color: "var(--text)",
                fontFamily: "inherit",
                outline: "none",
                direction: "rtl",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          <div>
            <label htmlFor="email" className="text-body-sm" style={{ fontWeight: 600, display: "block", marginBottom: "var(--space-2)" }}>
              אימייל
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="text-body"
              style={{
                width: "100%",
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-secondary)",
                border: "1px solid var(--glass-border)",
                color: "var(--text)",
                fontFamily: "inherit",
                outline: "none",
                direction: "ltr",
                textAlign: "right",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          <div>
            <label htmlFor="subject" className="text-body-sm" style={{ fontWeight: 600, display: "block", marginBottom: "var(--space-2)" }}>
              נושא
            </label>
            <select
              id="subject"
              name="subject"
              className="text-body"
              style={{
                width: "100%",
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-secondary)",
                border: "1px solid var(--glass-border)",
                color: "var(--text)",
                fontFamily: "inherit",
                outline: "none",
                direction: "rtl",
                cursor: "pointer",
              }}
            >
              <option value="general">שאלה כללית</option>
              <option value="bug">דיווח על באג</option>
              <option value="feature">בקשת תכונה</option>
              <option value="business">שיתוף פעולה עסקי</option>
              <option value="press">מדיה ועיתונות</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="text-body-sm" style={{ fontWeight: 600, display: "block", marginBottom: "var(--space-2)" }}>
              הודעה
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="text-body"
              style={{
                width: "100%",
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-secondary)",
                border: "1px solid var(--glass-border)",
                color: "var(--text)",
                fontFamily: "inherit",
                outline: "none",
                direction: "rtl",
                resize: "vertical",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          <button type="submit" className="btn btn-accent btn-lg" style={{ alignSelf: "flex-start" }}>
            שליחה
          </button>
        </form>

        {/* Direct contact */}
        <div style={{ marginTop: "var(--space-11)", paddingTop: "var(--space-8)", borderTop: "1px solid var(--glass-border)" }}>
          <h2 className="text-h3" style={{ marginBottom: "var(--space-5)" }}>דרכים נוספות ליצור קשר</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <p className="text-body-sm" style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>אימייל כללי</p>
              <a href="mailto:support@israbi.app" className="text-body c-accent" style={{ textDecoration: "none" }}>support@israbi.app</a>
            </div>
            <div>
              <p className="text-body-sm" style={{ fontWeight: 600, marginBottom: "var(--space-1)" }}>שיתופי פעולה ומדיה</p>
              <a href="mailto:hello@israbi.app" className="text-body c-accent" style={{ textDecoration: "none" }}>hello@israbi.app</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
