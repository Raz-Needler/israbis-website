import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";
import { IngredientNameSchema } from "@/lib/validate";
import type { IngredientPriceResponse } from "@/lib/types";

/**
 * GET /api/prices/ingredient?name=chicken — Ingredient price across stores
 * Validates input, proxies to backend, returns top 6 chains
 */
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "Missing 'name' parameter" },
      { status: 400 }
    );
  }

  const parsed = IngredientNameSchema.safeParse(name);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid ingredient name" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchBackend<IngredientPriceResponse>(
      `/api/prices/ingredient?name=${encodeURIComponent(parsed.data)}`,
      { revalidate: 14400, tags: ["prices"] }
    );

    // Only return priority chains with real (non-estimated) prices first
    const PRIORITY_CHAINS = [
      "RAMI_LEVY", "SHUFERSAL", "OSHER_AD",
      "VICTORY", "TIV_TAAM", "YOCHANANOF",
    ];

    const stores = PRIORITY_CHAINS
      .filter((key) => data.stores[key])
      .map((key) => ({
        chain: key,
        price: data.stores[key].price,
        product: data.stores[key].matched ?? null,
        estimated: data.stores[key].estimated ?? false,
      }))
      .sort((a, b) => a.price - b.price);

    return NextResponse.json(
      {
        name: data.base.nameHe,
        basePrice: data.base.priceNIS,
        unit: data.base.unit,
        stores,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=14400, stale-while-revalidate=28800",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "המוצר לא נמצא" },
      { status: 404 }
    );
  }
}
