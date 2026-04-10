/**
 * Server-side only backend client.
 * This file is NEVER bundled for the browser because:
 * 1. It reads process.env.BACKEND_URL (no NEXT_PUBLIC_ prefix)
 * 2. It's only imported in Server Components and Route Handlers
 *
 * The BACKEND_URL is invisible to any client-side code.
 */

/** Default ISR cache: 4 hours (prices update daily, recipes rarely change) */
const DEFAULT_REVALIDATE = 14400;

/** Request timeout: 15 seconds max */
const FETCH_TIMEOUT_MS = 15000;

/** Max response body: 2MB (prevents OOM from malformed responses) */
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;

/** Service API key for authenticated endpoints (compare-search, barcode-scan) */
const WEBSITE_API_KEY = process.env.WEBSITE_API_KEY || "9003d5ed20650c866cf0cafce2ae86e1affddd4fad258424410adfb0c38ff062";

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

/** GET request to backend (public endpoints) */
export async function fetchBackend<T>(
  path: string,
  options?: FetchOptions
): Promise<T> {
  return fetchBackendInternal<T>("GET", path, undefined, options);
}

/** POST request to backend with API key auth (protected endpoints) */
export async function postBackend<T>(
  path: string,
  body: Record<string, unknown>,
  options?: FetchOptions
): Promise<T> {
  return fetchBackendInternal<T>("POST", path, body, options);
}

async function fetchBackendInternal<T>(
  method: "GET" | "POST",
  path: string,
  body?: Record<string, unknown>,
  options?: FetchOptions
): Promise<T> {
  const backendUrl = process.env.BACKEND_URL || "https://israbis-production.up.railway.app";

  if (!backendUrl) {
    throw new Error("Backend not configured");
  }

  if (path.includes("..") || path.includes("//") || !path.startsWith("/api/")) {
    throw new Error("Invalid API path");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  const headers: Record<string, string> = {
    "Accept": "application/json",
    "User-Agent": "IsraBis-Website/1.0",
  };

  // Add API key for POST requests (authenticated endpoints)
  if (method === "POST") {
    headers["Content-Type"] = "application/json";
    headers["X-API-Key"] = WEBSITE_API_KEY;
  }

  try {
    const res = await fetch(`${backendUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      ...(method === "GET" ? {
        next: {
          revalidate: options?.revalidate ?? DEFAULT_REVALIDATE,
          tags: options?.tags,
        },
      } : {}),
    });

    if (!res.ok) {
      throw new Error(`Upstream ${res.status}`);
    }

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
