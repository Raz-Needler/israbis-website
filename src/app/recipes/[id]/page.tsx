import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBackend } from "@/lib/backend";
import type { RecipeDetail, RecipeCompareResponse } from "@/lib/types";
import FadeIn from "@/components/FadeIn";
import PriceComparison from "@/components/recipes/PriceComparison";
import IngredientTable from "@/components/recipes/IngredientTable";
import StepList from "@/components/recipes/StepList";
import NutritionBar from "@/components/recipes/NutritionBar";

/* ── Allowlisted recipes (ONLY these 3 IDs are valid) ── */
const RECIPE_IMAGES: Record<string, string> = {
  "big-mac": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop",
  "pad-thai": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80&auto=format&fit=crop",
  "falafel": "https://images.unsplash.com/photo-1593001874117-c99c800e3eb6?w=800&q=80&auto=format&fit=crop",
};

const RECIPE_NAMES_HE: Record<string, string> = {
  "big-mac": "המבורגר קלאסי",
  "pad-thai": "פאד תאי",
  "falafel": "פלאפל",
};

const FEATURED_IDS = ["big-mac", "pad-thai", "falafel"];

export async function generateStaticParams() {
  return FEATURED_IDS.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const nameHe = RECIPE_NAMES_HE[id] || id;
  const imageUrl = RECIPE_IMAGES[id] || null;

  return {
    title: `${nameHe} — מתכון עם מחירים בכל הרשתות`,
    description: `מתכון ${nameHe} עם רשימת מרכיבים מתומחרת, השוואת מחירים בין רשתות שיווק, הוראות הכנה צעד אחרי צעד, וערכים תזונתיים. גלו באיזו רשת הכי זול להכין את המנה.`,
    alternates: { canonical: `/recipes/${id}` },
    openGraph: imageUrl
      ? {
          type: "article",
          images: [{ url: imageUrl, width: 1200, height: 630, alt: nameHe }],
        }
      : undefined,
  };
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // SECURITY: Only allow our 3 featured recipe IDs — no arbitrary backend queries
  if (!FEATURED_IDS.includes(id)) {
    notFound();
  }

  let recipe: RecipeDetail | null = null;
  let comparison: RecipeCompareResponse | null = null;

  try {
    [recipe, comparison] = await Promise.all([
      fetchBackend<RecipeDetail>(`/api/recipes/${id}`, { revalidate: 14400, tags: [`recipe-${id}`] }),
      fetchBackend<RecipeCompareResponse>(`/api/compare/recipe/${id}`, { revalidate: 14400, tags: ["prices"] }),
    ]);
  } catch {
    return (
      <section className="sec">
        <div className="w-980 text-center">
          <h1 className="text-h1">המתכון לא זמין כרגע</h1>
          <p className="text-body c-muted" style={{ marginTop: "var(--space-4)" }}>
            נסו שוב מאוחר יותר או <Link href="/recipes" className="c-accent">חזרו לכל המתכונים</Link>
          </p>
        </div>
      </section>
    );
  }

  const nameHe = RECIPE_NAMES_HE[id] || recipe.name;
  const imageUrl = RECIPE_IMAGES[id] || null;

  // Process price comparison
  const PRIORITY_CHAINS = ["RAMI_LEVY", "SHUFERSAL", "OSHER_AD", "VICTORY", "YEINOT_BITAN", "HAZI_HINAM"];
  const chainCosts = comparison
    ? PRIORITY_CHAINS
        .filter((key) => comparison!.stores[key])
        .map((key) => ({
          key,
          cost: comparison!.stores[key].totalCost,
          verified: comparison!.stores[key].isVerified,
        }))
        .sort((a, b) => a.cost - b.cost)
    : [];
  const cheapest = chainCosts[0];
  const mostExpensive = chainCosts[chainCosts.length - 1];
  const savings = cheapest && mostExpensive ? +(mostExpensive.cost - cheapest.cost).toFixed(2) : 0;

  const steps = recipe.steps
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => ({
      number: s.stepNumber,
      text: s.text,
      duration: s.duration,
      temperature: s.temperature,
      tip: s.tip,
    }));

  const otherRecipes = FEATURED_IDS.filter((r) => r !== id);

  /* ── Recipe JSON-LD schema ── */
  const recipeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": nameHe,
    "description": recipe.description,
    "image": imageUrl || undefined,
    "author": { "@type": "Organization", "name": "IsraBis" },
    "datePublished": "2026-04-01",
    "inLanguage": "he",
    "cookTime": `PT${recipe.cookTime}M`,
    "prepTime": `PT${recipe.prepTime}M`,
    "totalTime": `PT${recipe.prepTime + recipe.cookTime}M`,
    "recipeYield": `${recipe.servings} מנות`,
    "recipeCategory": recipe.category?.name || "מנה עיקרית",
    "recipeCuisine": recipe.category?.name || "ישראלי",
    "keywords": `${nameHe}, מתכון ${nameHe}, ${recipe.category?.name || "בישול ישראלי"}`,
    ...(recipe.calories != null || recipe.protein != null || recipe.carbs != null || recipe.fat != null
      ? {
          "nutrition": {
            "@type": "NutritionInformation",
            ...(recipe.calories != null && { "calories": `${recipe.calories} kcal` }),
            ...(recipe.protein != null && { "proteinContent": `${recipe.protein}g` }),
            ...(recipe.carbs != null && { "carbohydrateContent": `${recipe.carbs}g` }),
            ...(recipe.fat != null && { "fatContent": `${recipe.fat}g` }),
          },
        }
      : {}),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": recipe.socialStats.rating.toFixed(1),
      "ratingCount": String(recipe.socialStats.ratingCount),
      "bestRating": "5",
    },
    "recipeIngredient": recipe.ingredients
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((i) => `${i.amount} ${i.item}`),
    "recipeInstructions": steps.map((s) => ({
      "@type": "HowToStep",
      "position": s.number,
      "text": s.text,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 340, background: "var(--bg-secondary)" }}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={nameHe}
            fill
            style={{ objectFit: "cover", opacity: 0.25 }}
            priority
          />
        )}
        <div className="w-980 relative z-10" style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-9)" }}>
          <FadeIn>
            <Link href="/recipes" className="text-caption c-accent link-underline" style={{ fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              כל המתכונים
            </Link>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="text-display" style={{ marginTop: "var(--space-4)", marginBottom: "var(--space-3)" }}>
              {nameHe}
            </h1>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p className="text-body c-muted" style={{ maxWidth: "50ch", marginBottom: "var(--space-5)" }}>
              {recipe.description}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-2">
              <span className="badge">&#9201; {recipe.prepTime + recipe.cookTime} דק&apos;</span>
              <span className="badge">&#127869; {recipe.servings} מנות</span>
              {recipe.calories && <span className="badge">&#9889; {recipe.calories} קל&apos;</span>}
              <span className="badge">{recipe.difficulty}</span>
              {recipe.isKosher && <span className="badge">&#10003; כשר</span>}
            </div>
          </FadeIn>

          {/* Social stats */}
          <FadeIn delay={0.12}>
            <div className="flex gap-4 flex-wrap" style={{ marginTop: "var(--space-5)" }}>
              <span className="text-caption c-muted">&#10084;&#65039; {recipe.socialStats.likeCount.toLocaleString()} לייקים</span>
              <span className="text-caption c-muted">&#127859; בושל {recipe.socialStats.timesCooked.toLocaleString()} פעמים</span>
              <span className="text-caption c-muted">&#11088; {recipe.socialStats.rating} ({recipe.socialStats.ratingCount} דירוגים)</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="sec">
        <div className="w-980">
          <div className="grid grid-cols-1 lg:grid-cols-5" style={{ gap: "var(--space-6)" }}>
            {/* Main column */}
            <div className="lg:col-span-3" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              {/* Price Comparison */}
              {chainCosts.length > 0 && (
                <FadeIn>
                  <PriceComparison
                    chains={chainCosts}
                    cheapestChain={cheapest?.key ?? null}
                    savings={savings}
                  />
                </FadeIn>
              )}

              {/* Steps */}
              <FadeIn delay={0.05}>
                <StepList steps={steps} />
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              {/* Ingredients */}
              <FadeIn delay={0.03}>
                <IngredientTable
                  ingredients={recipe.ingredients.map((i) => ({ item: i.item, amount: i.amount }))}
                  servings={recipe.servings}
                />
              </FadeIn>

              {/* Nutrition */}
              <FadeIn delay={0.06}>
                <NutritionBar
                  calories={recipe.calories}
                  protein={recipe.protein}
                  carbs={recipe.carbs}
                  fat={recipe.fat}
                />
              </FadeIn>

              {/* Recipe image */}
              {imageUrl && (
                <FadeIn delay={0.08}>
                  <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
                    <Image
                      src={imageUrl}
                      alt={nameHe}
                      width={600}
                      height={400}
                      style={{ width: "100%", height: "auto", display: "block" }}
                              />
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec" style={{ background: "var(--accent)" }}>
        <div className="w-980 text-center">
          <FadeIn>
            <h2 className="text-h2" style={{ color: "#fff", marginBottom: "var(--space-3)" }}>
              רוצים טיימרים, רשימת קניות, ו-49 רשתות?
            </h2>
            <p className="text-body" style={{ color: "rgba(255,255,255,0.85)", maxWidth: "42ch", margin: "0 auto var(--space-6)" }}>
              באפליקציה יש אלפי מתכונים נוספים, מצב בישול מונחה, סריקת מקרר, ועוד.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://apps.apple.com/app/israbi/id0000000000" target="_blank" rel="noopener noreferrer" className="btn btn-white btn-lg">
                App Store
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.israbis.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
                Google Play
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* More recipes */}
      <section className="sec">
        <div className="w-980">
          <h2 className="text-h2 text-center" style={{ marginBottom: "var(--space-7)" }}>מתכונים נוספים</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "var(--space-5)", maxWidth: 640, margin: "0 auto" }}>
            {otherRecipes.map((rid) => (
              <FadeIn key={rid}>
                <Link
                  href={`/recipes/${rid}`}
                  className="glass-card-premium block overflow-hidden"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {RECIPE_IMAGES[rid] && (
                    <Image
                      src={RECIPE_IMAGES[rid]}
                      alt={RECIPE_NAMES_HE[rid] || rid}
                      width={400}
                      height={220}
                      style={{ width: "100%", height: 180, objectFit: "cover" }}
                              />
                  )}
                  <div style={{ padding: "var(--space-5)" }}>
                    <h3 className="text-h4">{RECIPE_NAMES_HE[rid] || rid}</h3>
                    <p className="text-caption c-accent" style={{ marginTop: "var(--space-1)", fontWeight: 600 }}>
                      צפו במתכון &#8592;
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
