import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend";
import type { ChainsResponse } from "@/lib/types";

/**
 * GET /api/chains — List all supermarket chains
 * Cached for 1 hour (chain list rarely changes)
 */
export async function GET() {
  try {
    const data = await fetchBackend<ChainsResponse>(
      "/api/prices/chains",
      { revalidate: 3600, tags: ["chains"] }
    );

    // Only return safe public fields
    const chains = data.data.map((c) => ({
      key: c.key,
      nameHe: c.nameHe,
      nameEn: c.nameEn,
      color: c.color,
      initials: c.initials,
      priority: c.priority,
    }));

    return NextResponse.json(
      { chains },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
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
      { error: "Unable to fetch chains" },
      { status: 502 }
    );
  }
}
