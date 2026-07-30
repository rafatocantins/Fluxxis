/**
 * Weighted Rule Definitions — Intent Resolver v2
 *
 * Each rule maps behavioral signal patterns to intent categories
 * with associated confidence weights. Rules are deterministic,
 * auditable, and organized by category.
 *
 * Architecture: Strategy-pattern ready — the rule set can be swapped
 * for an ML model without changing the resolver interface.
 *
 * Part of @fluxxis/adaptive-cta
 */

import type { IntentCategory, IntentSignal } from '../types'
import type { RuleMatch } from './confidence'

/**
 * A single weighted rule definition.
 */
export interface IntentRule {
  /** Unique rule identifier (e.g. 'ready-to-buy-001') */
  id: string
  /** Intent category this rule supports */
  category: IntentCategory
  /** Description for audit logs */
  description: string
  /** Weight contributed when condition is met (0-1 range typical) */
  weight: number
  /** Evaluate whether this rule fires given the current signals */
  evaluate: (signals: IntentSignal) => boolean
}

// ── Signal Thresholds ────────────────────────────────────────────────────────

/** Time thresholds in milliseconds */
const TIME = {
  SHORT: 30_000,   // 30 seconds
  MODERATE: 60_000, // 60 seconds
  LONG: 120_000,    // 120 seconds (2 min)
} as const

/** Mouse velocity thresholds in px/ms */
const VELOCITY = {
  LOW: 0.5,   // slow, hesitant movement
  HIGH: 2.0,  // fast, decisive movement
} as const

/** Scroll depth thresholds (fraction 0-1) */
const SCROLL = {
  HALF: 0.5,
  DEEP: 0.7,
  VERY_DEEP: 0.8,
} as const

// ── Rule Definitions ─────────────────────────────────────────────────────────

/**
 * All weighted intent rules.
 *
 * Minimum 3 rules per intent category (15+ total).
 * Each rule is independent — they can fire simultaneously
 * and their weights are summed during confidence computation.
 */
export const INTENT_RULES: IntentRule[] = [
  // ═══ READY-TO-BUY (high purchase intent) ═══
  {
    id: 'ready-to-buy-001',
    category: 'ready-to-buy',
    description: 'Cart has value AND user spent >30s on page',
    weight: 0.4,
    evaluate: (s) =>
      (s.cartValue ?? 0) > 0 && (s.timeOnPage ?? 0) > TIME.SHORT,
  },
  {
    id: 'ready-to-buy-002',
    category: 'ready-to-buy',
    description: 'User is on checkout page',
    weight: 0.5,
    evaluate: (s) => s.pageType === 'checkout',
  },
  {
    id: 'ready-to-buy-003',
    category: 'ready-to-buy',
    description: 'Cart value > €50 AND returning visitor',
    weight: 0.3,
    evaluate: (s) =>
      (s.cartValue ?? 0) > 50 && (s.returnVisitCount ?? 0) >= 1,
  },
  {
    id: 'ready-to-buy-004',
    category: 'ready-to-buy',
    description: 'On cart page with items AND fast mouse movement (decisive)',
    weight: 0.35,
    evaluate: (s) =>
      s.pageType === 'cart' &&
      (s.cartValue ?? 0) > 0 &&
      (s.mouseVelocity ?? 0) > VELOCITY.HIGH,
  },

  // ═══ HESITATING (uncertain, needs nudge) ═══
  {
    id: 'hesitating-001',
    category: 'hesitating',
    description: 'Low mouse velocity AND scrolled >50% AND >60s on page',
    weight: 0.3,
    evaluate: (s) =>
      (s.mouseVelocity ?? Infinity) < VELOCITY.LOW &&
      (s.scrollDepth ?? 0) > SCROLL.HALF &&
      (s.timeOnPage ?? 0) > TIME.MODERATE,
  },
  {
    id: 'hesitating-002',
    category: 'hesitating',
    description: 'Moderate time on page (30-60s) with low scroll depth',
    weight: 0.25,
    evaluate: (s) => {
      const t = s.timeOnPage ?? 0
      return (
        t > TIME.SHORT &&
        t <= TIME.MODERATE &&
        (s.scrollDepth ?? 1) < SCROLL.HALF
      )
    },
  },
  {
    id: 'hesitating-003',
    category: 'hesitating',
    description: 'First-time visitor with >60s on product page and low velocity',
    weight: 0.35,
    evaluate: (s) =>
      (s.returnVisitCount ?? 0) === 0 &&
      (s.timeOnPage ?? 0) > TIME.MODERATE &&
      s.pageType === 'product' &&
      (s.mouseVelocity ?? Infinity) < VELOCITY.LOW,
  },

  // ═══ BROWSING (casual exploration) ═══
  {
    id: 'browsing-001',
    category: 'browsing',
    description: 'Scrolled >70% AND <30s on page AND first visit',
    weight: 0.5,
    evaluate: (s) =>
      (s.scrollDepth ?? 0) > SCROLL.DEEP &&
      (s.timeOnPage ?? Infinity) < TIME.SHORT &&
      (s.returnVisitCount ?? 0) === 0,
  },
  {
    id: 'browsing-002',
    category: 'browsing',
    description: 'High mouse velocity (quick scanning) with low time on page',
    weight: 0.4,
    evaluate: (s) =>
      (s.mouseVelocity ?? 0) > VELOCITY.HIGH &&
      (s.timeOnPage ?? Infinity) < TIME.SHORT,
  },
  {
    id: 'browsing-003',
    category: 'browsing',
    description: 'On blog page with short dwell time',
    weight: 0.45,
    evaluate: (s) =>
      s.pageType === 'blog' && (s.timeOnPage ?? Infinity) < TIME.SHORT,
  },

  // ═══ RETURNING (familiar, loyal) ═══
  {
    id: 'returning-001',
    category: 'returning',
    description: '3+ return visits',
    weight: 0.4,
    evaluate: (s) => (s.returnVisitCount ?? 0) >= 3,
  },
  {
    id: 'returning-002',
    category: 'returning',
    description: 'Returning visitor (1+) with fast decision velocity',
    weight: 0.3,
    evaluate: (s) =>
      (s.returnVisitCount ?? 0) >= 1 &&
      (s.mouseVelocity ?? 0) > VELOCITY.HIGH,
  },
  {
    id: 'returning-003',
    category: 'returning',
    description: 'Returning visitor on product page with short time',
    weight: 0.35,
    evaluate: (s) =>
      (s.returnVisitCount ?? 0) >= 1 &&
      s.pageType === 'product' &&
      (s.timeOnPage ?? Infinity) < TIME.SHORT,
  },

  // ═══ RESEARCHING (deep evaluation, comparing) ═══
  {
    id: 'researching-001',
    category: 'researching',
    description: '>120s on page AND scrolled >80% AND empty cart',
    weight: 0.3,
    evaluate: (s) =>
      (s.timeOnPage ?? 0) > TIME.LONG &&
      (s.scrollDepth ?? 0) > SCROLL.VERY_DEEP &&
      (s.cartValue ?? 0) === 0,
  },
  {
    id: 'researching-002',
    category: 'researching',
    description: 'Very long dwell time (>180s) regardless of scroll',
    weight: 0.35,
    evaluate: (s) => (s.timeOnPage ?? 0) > 180_000,
  },
  {
    id: 'researching-003',
    category: 'researching',
    description: 'Deep scroll AND moderate time on product page',
    weight: 0.25,
    evaluate: (s) =>
      (s.scrollDepth ?? 0) > SCROLL.DEEP &&
      (s.timeOnPage ?? 0) > TIME.MODERATE &&
      s.pageType === 'product',
  },
  {
    id: 'researching-004',
    category: 'researching',
    description: 'Returning visitor spending >60s studying the page',
    weight: 0.3,
    evaluate: (s) =>
      (s.returnVisitCount ?? 0) >= 1 &&
      (s.timeOnPage ?? 0) > TIME.MODERATE &&
      (s.scrollDepth ?? 0) > SCROLL.HALF,
  },
]

/**
 * Evaluate all rules against a signal set and return matching RuleMatch entries.
 *
 * @param signals - The behavioral signals to evaluate
 * @returns Array of rule matches (only rules whose conditions are met)
 */
export function evaluateRules(signals: IntentSignal): RuleMatch[] {
  const matches: RuleMatch[] = []

  for (const rule of INTENT_RULES) {
    if (rule.evaluate(signals)) {
      matches.push({
        ruleId: rule.id,
        category: rule.category,
        weight: rule.weight,
      })
    }
  }

  return matches
}

/**
 * Get all rules for a specific intent category.
 * Useful for debugging and audit displays.
 */
export function getRulesForCategory(category: IntentCategory): IntentRule[] {
  return INTENT_RULES.filter((r) => r.category === category)
}
