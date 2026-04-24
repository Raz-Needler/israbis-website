/**
 * Deterministic PRNG — mulberry32 seeded from a 32-bit integer.
 * Same seed = same sequence, so reseeding is idempotent and diff-able.
 */
export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return function() {
    a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick a random element from an array. */
export function pickOne<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Pick N distinct elements — returns the entire array if N >= length. */
export function pickN<T>(arr: readonly T[], n: number, rng: () => number): T[] {
  if (n >= arr.length) return [...arr];
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return out;
}

/** Uniform int in [lo, hi] inclusive. */
export function randInt(rng: () => number, lo: number, hi: number): number {
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}

/** Uniform float in [lo, hi]. */
export function randFloat(rng: () => number, lo: number, hi: number): number {
  return rng() * (hi - lo) + lo;
}
