/**
 * A/B Splitter — Deterministic variant assignment using DJB2 hashing.
 *
 * Pure functions with zero dependencies. Used by the variant engine
 * to assign users to A/B test buckets deterministically so that the
 * same session always sees the same variant.
 *
 * Part of @fluxxis/adaptive-cta — A/B Variant Engine
 */

/**
 * DJB2 hash algorithm — produces a deterministic 32-bit integer hash
 * from an arbitrary string. Thread-safe, no side effects.
 *
 * Chosen because:
 * - Ultra-fast (< 1 µs per call)
 * - Good distribution for A/B split use cases
 * - Zero dependencies
 * - Same output for same input across all JS engines
 */
export function hashString(str: string): number {
  let hash = 5381 // DJB2 initial value
  for (let i = 0; i < str.length; i++) {
    // hash * 33 + charCode, with 32-bit integer overflow
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/**
 * Assign a variant index for a given session + experiment combination.
 * Uses deterministic hashing so the same session always lands
 * in the same bucket for the same experiment.
 *
 * @param sessionId - A unique session identifier
 * @param experimentId - The experiment identifier
 * @param poolSize - Number of variants in the pool (must be > 0)
 * @returns An integer index in [0, poolSize)
 */
export function assignVariant(
  sessionId: string,
  experimentId: string,
  poolSize: number,
): number {
  if (poolSize <= 0) {
    throw new RangeError(`poolSize must be positive, got ${poolSize}`)
  }
  return hashString(`${sessionId}:${experimentId}`) % poolSize
}
