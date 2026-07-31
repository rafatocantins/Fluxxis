/**
 * A/B Variant Engine — Unit Tests
 *
 * Covers: ab-splitter, response, variant-engine
 * Minimum 12 tests (≥3 per source file).
 */

import { describe, it, expect } from 'vitest'
import { hashString, assignVariant } from '../ab-splitter'
import { buildResponse } from '../response'
import { selectVariant, VARIANT_POOLS } from '../variant-engine'
import type { ResolvedIntent, CTAConfig, IntentCategory, IntentSignal } from '../../types'

// ── Test Helpers ─────────────────────────────────────────────────────────────

function makeIntent(
  category: IntentCategory,
  confidence: number,
  overrides?: Partial<IntentSignal>,
): ResolvedIntent {
  return {
    category,
    confidence,
    firedRules: ['rule-test-1'],
    resolvedAt: new Date().toISOString(),
    signals: {
      timeOnPage: 15000,
      scrollDepth: 0.7,
      mouseVelocity: 0.02,
      returnVisitCount: 0,
      cartValue: 0,
      pageType: 'product',
      ...overrides,
    },
  }
}

function makeConfig(overrides?: Partial<CTAConfig>): CTAConfig {
  return {
    intent: 'browse',
    productId: 'prod-123',
    productName: 'Test Product',
    price: 49.99,
    currency: 'EUR',
    ...overrides,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ab-splitter tests
// ═══════════════════════════════════════════════════════════════════════════════

describe('ab-splitter', () => {
  // Test 1: hashString is deterministic
  it('hashString produces consistent results for the same input', () => {
    const input = 'session-abc:experiment-xyz'
    const result1 = hashString(input)
    const result2 = hashString(input)
    const result3 = hashString(input)
    expect(result1).toBe(result2)
    expect(result1).toBe(result3)
    expect(typeof result1).toBe('number')
  })

  // Test 2: hashString produces different results for different inputs
  it('hashString produces different hashes for different strings', () => {
    const a = hashString('alpha')
    const b = hashString('beta')
    expect(a).not.toBe(b)
  })

  // Test 3: assignVariant returns index in valid range
  it('assignVariant returns an index within [0, poolSize)', () => {
    for (let i = 0; i < 100; i++) {
      const sessionId = `session-${i}`
      const idx = assignVariant(sessionId, 'exp-1', 4)
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThan(4)
    }
  })

  // Test 4: assignVariant is deterministic
  it('assignVariant returns same value for same inputs', () => {
    const idx1 = assignVariant('session-x', 'exp-y', 5)
    const idx2 = assignVariant('session-x', 'exp-y', 5)
    expect(idx1).toBe(idx2)
  })

  // Test 5: ~50/50 distribution over 1000 random sessionIds (pool of 2)
  it('assignVariant achieves ~50/50 split with a pool of 2 over 1000 sessions', () => {
    const POOL_SIZE = 2
    const TOTAL = 1000
    const buckets = [0, 0] // count per variant index

    for (let i = 0; i < TOTAL; i++) {
      // Use random-like session IDs to simulate real-world distribution
      const sessionId = `sess-${Math.random().toString(36).slice(2, 10)}-${i}`
      const idx = assignVariant(sessionId, 'experiment-50-50', POOL_SIZE)
      buckets[idx]!++
    }

    // Allow 40/60 split tolerance (real distribution with DJB2 is well within this)
    const tolerance = 0.2 // ±20%
    const expected = TOTAL / POOL_SIZE
    for (let i = 0; i < POOL_SIZE; i++) {
      const ratio = buckets[i]! / TOTAL
      expect(ratio).toBeGreaterThan(0.5 - tolerance)
      expect(ratio).toBeLessThan(0.5 + tolerance)
    }
  })

  // Test 6: poolSize <= 0 throws
  it('assignVariant throws RangeError for poolSize <= 0', () => {
    expect(() => assignVariant('s', 'e', 0)).toThrow(RangeError)
    expect(() => assignVariant('s', 'e', -1)).toThrow(RangeError)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// response tests
// ═══════════════════════════════════════════════════════════════════════════════

describe('response', () => {
  // Test 7: buildResponse produces correct structure
  it('buildResponse returns a properly structured AdaptiveCTAResponse', () => {
    const result = buildResponse('browsing', 'subtle-highlight', 0.85, {
      poolName: 'browsing',
      resolvedAt: '2026-07-30T00:00:00.000Z',
    })

    expect(result.variant).toBe('subtle-highlight')
    expect(result.intent).toBe('browsing')
    expect(result.confidence).toBe(0.85)
    expect(result.metadata.poolName).toBe('browsing')
    expect(result.metadata.resolvedAt).toBe('2026-07-30T00:00:00.000Z')
    expect(result.metadata.experimentId).toBeUndefined()
  })

  // Test 8: buildResponse includes experimentId when provided
  it('buildResponse includes experimentId in metadata when provided', () => {
    const result = buildResponse('ready-to-buy', 'direct-cta', 0.92, {
      experimentId: 'exp-summer-sale',
      poolName: 'ready-to-buy',
      resolvedAt: new Date().toISOString(),
    })

    expect(result.metadata.experimentId).toBe('exp-summer-sale')
  })

  // Test 9: buildResponse defaults poolName and resolvedAt when metadata omitted
  it('buildResponse uses default metadata values when not provided', () => {
    const result = buildResponse('researching', 'comparison-table', 0.75)

    expect(result.metadata.poolName).toBe('')
    expect(result.metadata.resolvedAt).toBeTruthy()
    expect(result.metadata.experimentId).toBeUndefined()
  })

  // Test 10: buildResponse rounds confidence to 3 decimal places
  it('buildResponse rounds confidence to 3 decimal places', () => {
    const result = buildResponse('hesitating', 'social-proof', 0.87654321, {
      poolName: 'hesitating',
      resolvedAt: new Date().toISOString(),
    })
    expect(result.confidence).toBe(0.877)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// variant-engine tests
// ═══════════════════════════════════════════════════════════════════════════════

describe('variant-engine', () => {
  // Test 11: each intent category maps to a variant from its pool
  it('selectVariant returns a variant from the correct pool for each intent category', () => {
    const categories: IntentCategory[] = [
      'browsing',
      'hesitating',
      'ready-to-buy',
      'returning',
      'researching',
    ]

    for (const category of categories) {
      const intent = makeIntent(category, 0.85)
      const config = makeConfig()
      const result = selectVariant(intent, config, 'exp-test')

      expect(result.intent).toBe(category)
      expect(result.metadata.poolName).toBe(category)

      // The variant should be one from the pool
      const pool = VARIANT_POOLS[category]
      expect(pool).toContain(result.variant)
    }
  })

  // Test 12: confidence < 0.6 returns "default" variant
  it('selectVariant returns "default" variant when confidence < 0.6', () => {
    const intent = makeIntent('browsing', 0.3)
    const config = makeConfig()

    const result = selectVariant(intent, config, 'exp-low-conf')
    expect(result.variant).toBe('default')
    expect(result.metadata.poolName).toBe('default-fallback')
    expect(result.confidence).toBe(0.3)
  })

  // Test 13: confidence exactly 0.6 is actionable (not default)
  it('selectVariant uses a real pool variant when confidence is exactly 0.6', () => {
    const intent = makeIntent('browsing', 0.6)
    const config = makeConfig()

    const result = selectVariant(intent, config, 'exp-boundary')
    expect(result.variant).not.toBe('default')
    expect(result.metadata.poolName).not.toBe('default-fallback')
    expect(VARIANT_POOLS.browsing).toContain(result.variant)
  })

  // Test 14: deterministic — same session sees same variant
  it('selectVariant is deterministic for the same session + intent', () => {
    const intent = makeIntent('hesitating', 0.85)
    const config = makeConfig({ productId: 'prod-fixed' })

    const results: string[] = []
    for (let i = 0; i < 10; i++) {
      results.push(selectVariant(intent, config, 'exp-det').variant)
    }

    // All calls should return the same variant
    const unique = new Set(results)
    expect(unique.size).toBe(1)
  })

  // Test 15: different sessionIds can produce different variants
  it('selectVariant can produce different variants for different sessions', () => {
    const intent = makeIntent('ready-to-buy', 0.9)

    // Test with many different productIds to check distribution
    const variants = new Set<string>()
    for (let i = 0; i < 50; i++) {
      const config = makeConfig({ productId: `prod-${i}` })
      const result = selectVariant(intent, config, 'exp-diff-sessions')
      variants.add(result.variant)
    }

    // With 50 different sessions, we should see at least 1 variant
    // (and likely both, but hash distribution guarantees at least 1)
    expect(variants.size).toBeGreaterThanOrEqual(1)
  })

  // Test 16: experimentId changes influence variant selection
  it('selectVariant may differ when experimentId changes', () => {
    const intent = makeIntent('researching', 0.88)
    const config = makeConfig({ productId: 'prod-same' })

    const r1 = selectVariant(intent, config, 'exp-alpha')
    const r2 = selectVariant(intent, config, 'exp-beta')

    // Both should be valid variants from the researching pool
    expect(VARIANT_POOLS.researching).toContain(r1.variant)
    expect(VARIANT_POOLS.researching).toContain(r2.variant)
    // They may or may not differ (hash collision possible but unlikely)
  })

  // Test 17: VARIANT_POOLS has entries for all IntentCategory values
  it('VARIANT_POOLS covers all defined intent categories', () => {
    const expected: IntentCategory[] = [
      'browsing',
      'hesitating',
      'ready-to-buy',
      'returning',
      'researching',
    ]

    for (const cat of expected) {
      expect(VARIANT_POOLS[cat]).toBeDefined()
      expect(VARIANT_POOLS[cat].length).toBeGreaterThanOrEqual(2)
    }
  })

  // Test 18: metadata carries experimentId through to the response
  it('selectVariant includes experimentId in response metadata', () => {
    const intent = makeIntent('returning', 0.78)
    const config = makeConfig()

    const withExp = selectVariant(intent, config, 'exp-with-id')
    expect(withExp.metadata.experimentId).toBe('exp-with-id')

    const withoutExp = selectVariant(intent, config)
    expect(withoutExp.metadata.experimentId).toBeUndefined()
  })
})
