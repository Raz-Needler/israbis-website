import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";
import type { RecipeListResponse } from "@/lib/types";

/**
 * GET /api/recipes — Public recipe list (trending)
 * BFF proxy: strips internal fields, caches 5 min
 * NO POST/PUT/DELETE — read-only endpoint
 */
export async function GET() {
  try {
    const data = await fetchBackend<RecipeListResponse>(
      "/api/recipes/trending?limit=10",
      { revalidate: 14400, tags: ["recipes"] }
    );

    // Strip internal fields before sending to client
    const safe = data.recipes.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      categoryId: r.categoryId,
      imageUrl: r.imageUrl,
      prepTime: r.prepTime,
      cookTime: r.cookTime,
      servings: r.servings,
      difficulty: r.difficulty,
      isKosher: r.isKosher,
      tags: r.tags,
      calories: r.calories,
      protein: r.protein,
      carbs: r.carbs,
      fat: r.fat,
      category: { name: r.category.name, color: r.category.color },
      stats: {
        likes: r.socialStats.likeCount,
        cooked: r.socialStats.timesCooked,
        rating: r.socialStats.rating,
      },
    }));

    return NextResponse.json(
      { recipes: safe },
      {
        headers: {
          "Cache-Control": "public, s-maxage=14400, stale-while-revalidate=28800",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("Backend not configured")) {
      return NextResponse.json(
        { error: "Service unavailable — backend not configured" },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Unable to fetch recipes" },
      { status: 502 }
    );
  }
}
