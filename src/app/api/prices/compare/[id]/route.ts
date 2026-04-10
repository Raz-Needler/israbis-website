import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";
import { RecipeIdSchema } from "@/lib/validate";
import type { RecipeCompareResponse } from "@/lib/types";

/**
 * GET /api/prices/compare/:id — Price comparison for a recipe
 * Returns cost at top chains, sorted cheapest first
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const parsed = RecipeIdSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid recipe ID" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchBackend<RecipeCompareResponse>(
      `/api/compare/recipe/${parsed.data}`,
      { revalidate: 14400, tags: ["prices"] }
    );

    // Only return top 6 priority chains sorted by cost
    const PRIORITY_CHAINS = [
      "RAMI_LEVY", "SHUFERSAL", "OSHER_AD",
      "VICTORY", "YEINOT_BITAN", "HAZI_HINAM",
    ];

    const chainCosts = PRIORITY_CHAINS
      .filter((key) => data.stores[key])
      .map((key) => ({
        key,
        cost: data.stores[key].totalCost,
        verified: data.stores[key].isVerified,
        scraped: data.stores[key].lastScrapedAt,
      }))
      .sort((a, b) => a.cost - b.cost);

    const cheapest = chainCosts[0];
    const mostExpensive = chainCosts[chainCosts.length - 1];

    return NextResponse.json(
      {
        recipeId: data.recipeId,
        currency: "ILS",
        chains: chainCosts,
        cheapestChain: cheapest?.key ?? null,
        savings: cheapest && mostExpensive
          ? +(mostExpensive.cost - cheapest.cost).toFixed(2)
          : 0,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=14400, stale-while-revalidate=28800",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Price comparison unavailable" },
      { status: 502 }
    );
  }
}
