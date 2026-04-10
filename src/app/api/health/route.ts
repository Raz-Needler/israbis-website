import { NextResponse } from "next/server";

/**
 * GET /api/health — Diagnostic endpoint
 * Shows whether BACKEND_URL is configured (without revealing the value)
 */
export async function GET() {
  const backendUrl = process.env.BACKEND_URL;
  const hasBackend = !!backendUrl && backendUrl.length > 0;

  let backendReachable = false;
  if (hasBackend) {
    try {
      const res = await fetch(`${backendUrl}/api/prices/chains`, {
        method: "GET",
        signal: AbortSignal.timeout(10000),
      });
      backendReachable = res.ok;
    } catch {
      backendReachable = false;
    }
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    backend: {
      configured: hasBackend,
      urlPrefix: hasBackend ? backendUrl!.substring(0, 20) + "..." : null,
      reachable: backendReachable,
    },
    env: {
      nodeEnv: process.env.NODE_ENV,
    },
  });
}
