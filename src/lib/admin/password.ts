/**
 * Password hashing + verification — pure WASM argon2id via hash-wasm.
 * Works on Vercel serverless Node runtime (no native bindings).
 * Hashes are standard argon2id format strings, so they interoperate
 * with any other argon2id library we might use elsewhere.
 */

import { argon2id, argon2Verify } from 'hash-wasm';

const PARAMS = {
  iterations: 3,
  memorySize: 65536,     // 64 MB
  parallelism: 4,
  hashLength: 32,
  outputType: 'encoded' as const, // returns the $argon2id$... encoded string
};

/** Hash a plaintext password to the standard encoded argon2id string. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return argon2id({ password, salt, ...PARAMS });
}

/** Verify a plaintext against an encoded argon2id hash. Returns true on match. */
export async function verifyPassword(encodedHash: string, password: string): Promise<boolean> {
  try {
    return await argon2Verify({ password, hash: encodedHash });
  } catch {
    return false;
  }
}
