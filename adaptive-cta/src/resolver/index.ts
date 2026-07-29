/**
 * @fluxxis/adaptive-cta/resolver
 *
 * Intent Resolver v2 — Behavioral Signal Processing Engine.
 * Replaces the legacy URL-based detectIntentFromURL() with a
 * multi-signal fusion engine that classifies user intent with
 * confidence scoring.
 */

export { resolveIntent, ruleBasedStrategy, createResolverStrategy, ACTIONABLE_THRESHOLD } from './resolver'
export { INTENT_RULES, evaluateRules, getRulesForCategory } from './rules'
export type { IntentRule } from './rules'
export { computeConfidence, isActionable, clamp } from './confidence'
export type { RuleMatch, ConfidenceResult } from './confidence'
