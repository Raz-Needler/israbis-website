import { NextRequest, NextResponse } from "next/server";
import { postBackend } from "@/lib/backend";
import { z } from "zod";

const BarcodeSchema = z.string().min(7).max(20).regex(/^\d+$/);

interface ChainPrice {
  chainKey: string;
  nameHe: string;
  color: string;
  price: number;
  productName: string;
}

interface BarcodeScanResponse {
  data: {
    found: boolean;
    barcode: string;
    productName: string;
    imageUrl: string;
    chainCount: number;
    minPrice: number;
    maxPrice: number;
    chains: ChainPrice[];
  };
}

/**
 * GET /api/products/barcode?code=7290000123456 — Price by barcode
 * Step 2: barcode → prices at all stores
 * Uses API key auth to call backend POST /api/prices/barcode-scan
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing 'code' parameter" }, { status: 400 });
  }

  const parsed = BarcodeSchema.safeParse(code);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid barcode" }, { status: 400 });
  }

  try {
    const data = await postBackend<BarcodeScanResponse>(
      "/api/prices/barcode-scan",
      { barcode: parsed.data }
    );

    if (!data.data.found) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        barcode: data.data.barcode,
        name: data.data.productName,
        image: data.data.imageUrl || null,
        chainCount: data.data.chainCount,
        minPrice: data.data.minPrice,
        maxPrice: data.data.maxPrice,
        chains: data.data.chains.map((c) => ({
          key: c.chainKey,
          nameHe: c.nameHe,
          color: c.color,
          price: c.price,
          product: c.productName,
        })),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=14400, stale-while-revalidate=28800",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Barcode lookup failed" }, { status: 502 });
  }
}
