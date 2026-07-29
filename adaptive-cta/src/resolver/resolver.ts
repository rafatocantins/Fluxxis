/**
 * Intent Resolver Engine — Behavioral Signal Processing
 *
 * Accepts a set of IntentSignals and produces a ResolvedIntent
 * with category prediction and confidence scoring.
 *
 * Architecture:
 * - Default strategy: Rule-based (rules.ts) + confidence scoring (confidence.ts)
 * - Strategy pattern: implements IntentResolverStrategy for easy ML swap-in
 * - Deterministic: same signals always produce the same result
 * - Performance: <5ms per resolution (no I/O, pure computation)
 *
 * Part of @fluxxis/adaptive-cta — Intent Resolver v2
 */

import type { IntentCategory, IntentSignal, ResolvedIntent, IntentResolverStrategy } from '../types'
import { evaluateRules } from './rules'
import { computeConfidence, ACTIONABLE_THRESHOLD, clamp } from './confidence'
import type { RuleMatch } from './confidence'

// ── Default Intent ───────────────────────────────────────────────────────────

/**
 * Fallback intent when no rules fire.
 * 'browsing' is the safest default — assumes casual exploration.
 */
const DEFAULT_INTENT: IntentCategory = 'browsing'

// ── Resolver Implementation ──────────────────────────────────────────────────

/**
 * Resolve intent from a set of behavioral signals.
 *
 * Algorithm:
 * 1. Evaluate all rules against the signals
 * 2. Sum weights per intent category
 * 3. Pick the category with the highest total weight
 * 4. Compute confidence for the winning category
 * 5. If no rules fire, return default (browsing, confidence 0)
 *
 * Performance target: <5ms (pure computation, no I/O)
 * Fallback guarantee: always returns a valid ResolvedIntent (never undefined)
 *
 * @param signals - Behavioral signals collected from the user session
 * @returns ResolvedIntent with category, confidence, and metadata
 */
export function resolveIntent(signals: IntentSignal): ResolvedIntent {
  // Normalize signals (fill defaults for missing values)
  const normalized: IntentSignal = normalizeSignals(signals)

  // Evaluate all rules
  const matches: RuleMatch[] = evaluateRules(normalized)

  // If no rules fired, return default with zero confidence
  if (matches.length === 0) {
    return buildResult(DEFAULT_INTENT, 0, [], normalized)
  }

  // Aggregate weights by category and pick the winner
  const category = pickWinningCategory(matches)

  // Compute confidence for the winning category
  const { score } = computeConfidence(matches, category)

  return buildResult(category, score, matches, normalized)
}

// ── Strategy Pattern ─────────────────────────────────────────────────────────

/**
 * Default rule-based intent resolver strategy.
 * Implements IntentResolverStrategy so consumers can swap in
 * an ML-based resolver without changing their code.
 */
export const ruleBasedStrategy: IntentResolverStrategy = {
  resolve: resolveIntent,
}

/**
 * Create a custom resolver strategy.
 * Useful for injecting ML models or custom logic while
 * maintaining the same interface.
 *
 * @param resolveFn - Custom resolution function
 * @returns IntentResolverStrategy
 */
export function createResolverStrategy(
  resolveFn: (signals: IntentSignal) => ResolvedIntent,
): IntentResolverStrategy {
  return { resolve: resolveFn }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Fill in defaults for any missing signal values.
 * Ensures all rules have defined values to evaluate against.
 */
function normalizeSignals(signals: IntentSignal): IntentSignal {
  return {
    timeOnPage: signals.timeOnPage ?? 0,
    scrollDepth: clamp(signals.scrollDepth ?? 0, 0, 1),
    mouseVelocity: signals.mouseVelocity ?? 0,
    returnVisitCount: signals.returnVisitCount ?? 0,
    cartValue: signals.cartValue ?? 0,
    pageType: signals.pageType ?? 'unknown',
  }
}

/**
 * Pick the intent category with the highest aggregate weight.
 * In case of a tie, the first category encountered wins.
 */
function pickWinningCategory(matches: RuleMatch[]): IntentCategory {
  const scores = new Map<IntentCategory, number>()

  for (const match of matches) {
    const current = scores.get(match.category) ?? 0
    scores.set(match.category, current + match.weight)
  }

  let bestCategory: IntentCategory = DEFAULT_INTENT
  let bestScore = -1

  for (const [category, score] of scores) {
    if (score > bestScore) {
      bestScore = score
      bestCategory = category
    }
  }

  return bestCategory
}

/**
 * Build a ResolvedIntent result object.
 */
function buildResult(
  category: IntentCategory,
  confidence: number,
  matches: RuleMatch[],
  signals: IntentSignal,
): ResolvedIntent {
  return {
    category,
    confidence: Math.round(confidence * 1000) / 1000,
    firedRules: matches.map((m) => m.ruleId),
    resolvedAt: new Date().toISOString(),
    signals,
  }
}

// ── Utility Exports ──────────────────────────────────────────────────────────

export { ACTIONABLE_THRESHOLD }
