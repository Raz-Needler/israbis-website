import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";
import { RecipeIdSchema } from "@/lib/validate";
import type { RecipeDetail } from "@/lib/types";

/**
 * GET /api/recipes/:id — Single recipe with full details
 * BFF proxy: validates ID, strips internal UUIDs, caches 10 min
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate recipe ID format
  const parsed = RecipeIdSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid recipe ID" },
      { status: 400 }
    );
  }

  try {
    const recipe = await fetchBackend<RecipeDetail>(
      `/api/recipes/${parsed.data}`,
      { revalidate: 14400, tags: [`recipe-${parsed.data}`] }
    );

    // Strip UUIDs and internal fields
    const safe = {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      category: { name: recipe.category.name, color: recipe.category.color },
      imageUrl: recipe.imageUrl,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      isKosher: recipe.isKosher,
      tags: recipe.tags,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      ingredients: recipe.ingredients.map((i) => ({
        item: i.item,
        amount: i.amount,
      })),
      steps: recipe.steps
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s) => ({
          number: s.stepNumber,
          text: s.text,
          duration: s.duration,
          temperature: s.temperature,
          tip: s.tip,
        })),
      stats: {
        likes: recipe.socialStats.likeCount,
        cooked: recipe.socialStats.timesCooked,
        rating: recipe.socialStats.rating,
        ratingCount: recipe.socialStats.ratingCount,
      },
    };

    return NextResponse.json(safe, {
      headers: {
        "Cache-Control": "public, s-maxage=14400, stale-while-revalidate=28800",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Recipe not found" },
      { status: 404 }
    );
  }
}
