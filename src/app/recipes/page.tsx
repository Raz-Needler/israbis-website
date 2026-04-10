import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "מתכונים עם מחירים — גלו כמה עולה לבשל כל מנה",
  description: "מתכונים עם השוואת מחירים בין רשתות שיווק בישראל. כל מתכון כולל מרכיבים, הוראות הכנה, ערכים תזונתיים, ומחירים בכל הרשתות. גלו באיזו רשת הכי זול.",
  alternates: { canonical: "/recipes" },
};

const FEATURED = [
  {
    id: "big-mac",
    nameHe: "המבורגר קלאסי",
    desc: "המבורגר כפול עסיסי עם גבינה אמריקאית, חסה, וסאוס מיוחד על לחמנייה קלויה.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80&auto=format&fit=crop",
    time: 20,
    servings: 2,
    difficulty: "קל",
    cuisine: "American",
    cuisineHe: "אמריקאי",
    color: "#7A8B6F",
  },
  {
    id: "pad-thai",
    nameHe: "פאד תאי",
    desc: "אטריות אורז מוקפצות עם שרימפס, טופו, בוטנים, וטמרינד — הקלאסיקה התאילנדית.",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=80&auto=format&fit=crop",
    time: 30,
    servings: 4,
    difficulty: "בינוני",
    cuisine: "Thai",
    cuisineHe: "תאילנדי",
    color: "#6B7C4E",
  },
  {
    id: "falafel",
    nameHe: "פלאפל",
    desc: "קציצות חומוס פריכות עם עשבי תיבול, מוגשות בפיתה עם טחינה, חמוצים, וסלט טרי.",
    image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb6?w=600&q=80&auto=format&fit=crop",
    time: 25,
    servings: 4,
    difficulty: "בינוני",
    cuisine: "Middle Eastern",
    cuisineHe: "מזרח תיכוני",
    color: "#A0522D",
  },
];

export default function RecipesPage() {
  return (
    <>
      {/* Hero */}
      <section className="sec" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-980 text-center">
          <SectionHeader
            label="מתכונים"
            title={<>מתכונים עם <span className="grad-text">מחירים אמיתיים</span></>}
            subtitle="כל מתכון כולל רשימת מרכיבים מתומחרת, השוואת מחירים בין רשתות השיווק, הוראות הכנה, וערכים תזונתיים."
          />
        </div>
      </section>

      {/* Featured recipe cards */}
      <section className="sec">
        <div className="w-1120">
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "var(--space-6)" }}>
            {FEATURED.map((recipe, i) => (
              <FadeIn key={recipe.id} delay={i * 0.08}>
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="glass-card-premium block overflow-hidden group"
                  style={{ textDecoration: "none", color: "inherit", height: "100%" }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                    <Image
                      src={recipe.image}
                      alt={recipe.nameHe}
                      fill
                      style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                      className="group-hover:scale-105"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "var(--space-3)",
                        right: "var(--space-3)",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-pill)",
                        background: recipe.color,
                        color: "#fff",
                        fontSize: "var(--font-label)",
                        fontWeight: 700,
                      }}
                    >
                      {recipe.cuisineHe}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "var(--space-5) var(--space-6)" }}>
                    <h2 className="text-h3" style={{ marginBottom: "var(--space-2)" }}>
                      {recipe.nameHe}
                    </h2>
                    <p className="text-body-sm c-muted" style={{ lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)" }}>
                      {recipe.desc}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className="badge">&#9201; {recipe.time} דק&apos;</span>
                      <span className="badge">&#127869; {recipe.servings} מנות</span>
                      <span className="badge">{recipe.difficulty}</span>
                    </div>

                    {/* CTA */}
                    <p className="text-body-sm c-accent" style={{ fontWeight: 600, marginTop: "var(--space-4)" }}>
                      צפו במתכון + מחירים &#8592;
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* More in app */}
      <section className="sec" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <div style={{
              padding: "var(--space-9)",
              borderRadius: "var(--radius-2xl)",
              background: "var(--card)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--shadow-lg)",
            }}>
              <h2 className="text-h2" style={{ marginBottom: "var(--space-3)" }}>
                אלפי מתכונים נוספים באפליקציה
              </h2>
              <p className="text-body c-muted" style={{ maxWidth: "50ch", margin: "0 auto var(--space-6)", lineHeight: "var(--leading-relaxed)" }}>
                מתכונים מהאפליקציה, מתכונים מסרטוני יוטיוב וטיקטוק, מתכונים שהמשתמשים יצרו, ומתכונים מכל העולם — כולם עם השוואת מחירים בין 33 רשתות.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/download" className="btn btn-accent btn-lg">
                  הורידו בחינם
                </Link>
                <Link href="/features" className="btn btn-outline btn-lg">
                  גלו את כל התכונות
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
