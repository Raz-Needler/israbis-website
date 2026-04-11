import { NextRequest, NextResponse } from "next/server";
import { postBackend } from "@/lib/backend";
import { SearchQuerySchema } from "@/lib/validate";

interface ChainPrice {
  chainKey: string;
  nameHe: string;
  color: string;
  price: number;
  productName: string;
}

interface ProductResult {
  barcode: string;
  name: string;
  chainCount: number;
  minPrice: number;
  maxPrice: number;
  savings: number;
  savingsPct: number;
  imageUrl: string;
  hasRLImage: boolean;
  chains: ChainPrice[];
}

interface CompareSearchResponse {
  data: {
    products: ProductResult[];
    total: number;
    hasMore: boolean;
  };
}

/**
 * GET /api/products/search?q=חלב — Product search with real barcode data
 * Step 1 of the two-step flow: name → products with barcodes + prices
 * Uses API key auth to call backend POST /api/prices/compare-search
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing 'q' parameter" }, { status: 400 });
  }

  const parsed = SearchQuerySchema.safeParse(q);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid search query" }, { status: 400 });
  }

  try {
    const data = await postBackend<CompareSearchResponse>(
      "/api/prices/compare-search",
      { query: parsed.data, limit: 8, offset: 0 }
    );

    // Strip to minimal fields — speed over completeness for web search
    const products = data.data.products.map((p) => ({
      barcode: p.barcode,
      name: p.name,
      image: p.hasRLImage && p.imageUrl ? p.imageUrl : null,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      savings: p.savings,
      savingsPct: p.savingsPct,
      chainCount: p.chainCount,
      chains: p.chains.slice(0, 6).map((c) => ({
        key: c.chainKey,
        nameHe: c.nameHe,
        color: c.color,
        price: c.price,
        product: c.productName,
      })),
    }));

    return NextResponse.json(
      { products, total: data.data.total },
      {
        headers: {
          "Cache-Control": "public, s-maxage=14400, stale-while-revalidate=28800",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }
}
