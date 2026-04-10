/**
 * Server-side only backend client.
 * This file is NEVER bundled for the browser because:
 * 1. It reads process.env.BACKEND_URL (no NEXT_PUBLIC_ prefix)
 * 2. It's only imported in Server Components and Route Handlers
 *
 * The BACKEND_URL is invisible to any client-side code.
 */

const BACKEND_URL = process.env.BACKEND_URL;

/** Default ISR cache: 4 hours (prices update daily, recipes rarely change) */
const DEFAULT_REVALIDATE = 14400;

/** Request timeout: 15 seconds max */
const FETCH_TIMEOUT_MS = 15000;

/** Max response body: 2MB (prevents OOM from malformed responses) */
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

export async function fetchBackend<T>(
  path: string,
  options?: FetchOptions
): Promise<T> {
  if (!BACKEND_URL) {
    throw new Error("Backend not configured");
  }

  // Prevent path traversal
  if (path.includes("..") || path.includes("//") || !path.startsWith("/api/")) {
    throw new Error("Invalid API path");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "IsraBis-Website/1.0",
      },
      signal: controller.signal,
      next: {
        revalidate: options?.revalidate ?? DEFAULT_REVALIDATE,
        tags: options?.tags,
      },
    });

    if (!res.ok) {
      throw new Error(`Upstream ${res.status}`);
    }

    // Check content-length if available
    const contentLength = res.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_BYTES) {
      throw new Error("Response too large");
    }

    const text = await res.text();
    if (text.length > MAX_RESPONSE_BYTES) {
      throw new Error("Response too large");
    }

    return JSON.parse(text) as T;
  } finally {
    clearTimeout(timeout);
  }
}
