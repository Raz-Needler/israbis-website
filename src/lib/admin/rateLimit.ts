/**
 * Tiny in-memory sliding-window rate limiter.
 *
 * Intended for per-route abuse prevention — NOT a replacement for a proper
 * edge/WAF rate limiter. Each Vercel function instance has its own map, so
 * under heavy fan-out (many concurrent invocations) the effective limit can
 * be multiplied by the instance count. That's fine for curbing single-IP
 * spray attacks; for global coordination use Upstash Redis or similar.
 */

interface Bucket { hits: number[]; }

const BUCKETS = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000; // cap memory; evict oldest

/**
 * Returns true if the key is under the limit (allowed), false if it's been rate-limited.
 * windowSeconds = sliding window length.
 * maxHits       = allowed hits within the window.
 */
export function rateLimit(key: string, maxHits: number, windowSeconds: number): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let bucket = BUCKETS.get(key);
  if (!bucket) {
    if (BUCKETS.size >= MAX_BUCKETS) {
      // Evict a random fraction — cheap and correct enough for this use
      let evicted = 0;
      for (const k of BUCKETS.keys()) {
        BUCKETS.delete(k);
        if (++evicted > 200) break;
      }
    }
    bucket = { hits: [] };
    BUCKETS.set(key, bucket);
  }

  // Drop hits older than the window
  const cutoff = now - windowMs;
  bucket.hits = bucket.hits.filter(t => t > cutoff);

  if (bucket.hits.length >= maxHits) {
    const oldest = bucket.hits[0];
    const retryAfterMs = Math.max(0, windowMs - (now - oldest));
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
  }

  bucket.hits.push(now);
  return { allowed: true, remaining: maxHits - bucket.hits.length, retryAfterSeconds: 0 };
}

/** Convenience: derive a key from request IP + an optional suffix. */
export function ipKey(ip: string | null, suffix = ''): string {
  return `${ip ?? 'unknown'}::${suffix}`;
}
