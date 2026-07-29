/**
 * Confidence Scoring Engine
 *
 * Aggregates weighted rule matches into a 0-1 confidence score.
 * Scores ≥ ACTIONABLE_THRESHOLD (0.6) indicate intent strong enough
 * to trigger a CTA morph.
 *
 * Part of @fluxxis/adaptive-cta — Intent Resolver v2
 */

import type { IntentCategory } from '../types'

/** Minimum confidence required to consider an intent actionable */
export const ACTIONABLE_THRESHOLD = 0.6

/** Maximum possible confidence (upper bound) */
export const MAX_CONFIDENCE = 1.0

/** Minimum possible confidence (lower bound) */
export const MIN_CONFIDENCE = 0.0

/**
 * A single rule match result produced during signal evaluation.
 */
export interface RuleMatch {
  /** Unique rule identifier (e.g. 'ready-to-buy-001') */
  ruleId: string
  /** The intent category this rule supports */
  category: IntentCategory
  /** Weight contributed by this rule (gets summed, then normalized) */
  weight: number
}

/**
 * Result of confidence aggregation.
 */
export interface ConfidenceResult {
  /** Normalized confidence score (0-1) */
  score: number
  /** Whether the confidence exceeds the actionable threshold */
  isActionable: boolean
}

/**
 * Normalize a value to the [0, 1] range using min-max scaling.
 * If min === max, returns 0 to avoid division by zero.
 */
export function clamp(value: number, min: number = 0, max: number = 1): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Compute confidence from a set of rule matches.
 *
 * Algorithm:
 * 1. Sum weights per category
 * 2. Apply sigmoid-like normalization to the winning category's score
 * 3. Clamp result to [0, 1]
 * 4. Return score + actionable flag
 *
 * The normalization uses tanh to smooth the transition: tanh(sum / 2)
 * This means ~2.0 raw weight → ~0.76 confidence, ~0.5 → ~0.24
 *
 * @param matches - Array of rule matches from the signal evaluation
 * @param category - The winning intent category
 * @returns ConfidenceResult with normalized score and actionable flag
 */
export function computeConfidence(
  matches: RuleMatch[],
  category: IntentCategory,
): ConfidenceResult {
  if (matches.length === 0) {
    return { score: MIN_CONFIDENCE, isActionable: false }
  }

  // Sum weights for the winning category only
  const totalWeight = matches
    .filter((m) => m.category === category)
    .reduce((sum, m) => sum + m.weight, 0)

  // Apply sigmoid-like normalization: tanh(x / 2) maps [0, ∞) → [0, ~1)
  // tanh(2/2) = tanh(1) ≈ 0.76
  // tanh(4/2) = tanh(2) ≈ 0.96
  const rawScore = Math.tanh(totalWeight / 2)
  const score = clamp(rawScore, MIN_CONFIDENCE, MAX_CONFIDENCE)

  return {
    score: Math.round(score * 1000) / 1000, // round to 3 decimal places
    isActionable: score >= ACTIONABLE_THRESHOLD,
  }
}

/**
 * Determine if a given confidence score is actionable (≥ threshold).
 * Convenience function for consumers that already have a score.
 */
export function isActionable(score: number): boolean {
  return score >= ACTIONABLE_THRESHOLD
}
