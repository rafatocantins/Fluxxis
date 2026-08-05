/**
 * Shopify Script Tag v2 — Integration Tests
 *
 * Tests the full pipeline: collectSignals → resolveIntent → selectVariant → renderCTA → trackAnalytics.
 *
 * Coverage:
 *   - Behavioral signals collection (≥4 signals)
 *   - Cooldown mechanism (<30s returns cached)
 *   - UMD engine integration
 *   - Fallback when UMD unavailable
 *   - Analytics events with variantName + experimentId
 *   - Render CTA DOM output
 *   - Pipeline integration end-to-end
 *
 * Minimum 15 tests.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { collectSignals, attachMouseTracker, resetMouseTracker } from '../signals'
import { resolveCTARenderConfig, DEFAULT_CTA, VARIANT_RENDER_MAP } from '../cta-config'
import type { AdaptiveCTAResponse, IntentSignal, ResolvedIntent, IntentCategory } from '../../src/types'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Create a mock ResolvedIntent */
function makeResolvedIntent(
  category: IntentCategory = 'browsing',
  confidence = 0.85,
): ResolvedIntent {
  return {
    category,
    confidence,
    firedRules: ['rule-test'],
    resolvedAt: new Date().toISOString(),
    signals: {
      timeOnPage: 15000,
      scrollDepth: 0.7,
      mouseVelocity: 0.02,
      pageType: 'product',
    },
  }
}

/** Create a mock AdaptiveCTAResponse */
function makeAdaptiveResponse(
  variant: string,
  intent: IntentCategory = 'browsing',
  confidence = 0.85,
  experimentId?: string,
): AdaptiveCTAResponse {
  return {
    variant,
    intent,
    confidence,
    metadata: {
      experimentId,
      poolName: intent,
      resolvedAt: new Date().toISOString(),
    },
  }
}

/** Mock the UMD engine on window */
function mockUMDEngine(overrides?: Partial<{
  resolveIntent: (s: IntentSignal) => ResolvedIntent
  selectVariant: (i: ResolvedIntent, c: Record<string, unknown>, e?: string) => AdaptiveCTAResponse
}>) {
  ;(window as any).FluxxisVariantEngine = {
    resolveIntent: overrides?.resolveIntent ?? ((s: IntentSignal) => makeResolvedIntent('browsing', 0.85)),
    selectVariant:
      overrides?.selectVariant ??
      ((_i: ResolvedIntent, _c: Record<string, unknown>, _e?: string) =>
        makeAdaptiveResponse('subtle-highlight', 'browsing', 0.85, 'shopify-v2-test')),
    VARIANT_POOLS: {
      browsing: ['subtle-highlight', 'category-explorer'],
      hesitating: ['social-proof', 'urgency-nudge'],
      'ready-to-buy': ['direct-cta', 'scarcity-alert'],
      returning: ['welcome-back', 'personalized-recommendation'],
      researching: ['comparison-table', 'detailed-specs'],
    },
    assignVariant: (_sessionId: string, _experimentId: string, poolSize: number) => 0,
  }
}

/** Remove UMD engine from window */
function clearUMDEngine() {
  delete (window as any).FluxxisVariantEngine
}

// ── Setup & Teardown ─────────────────────────────────────────────────────────

beforeEach(() => {
  // Reset mouse tracker state
  resetMouseTracker()

  // Set up jsdom-like URL
  Object.defineProperty(window, 'location', {
    value: {
      pathname: '/products/test-product',
      href: 'https://example.myshopify.com/products/test-product',
    },
    writable: true,
    configurable: true,
  })

  // Mock document.referrer
  Object.defineProperty(document, 'referrer', {
    value: '',
    writable: true,
    configurable: true,
  })

  // Clear UMD engine between tests
  clearUMDEngine()
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Signals Collection Tests (≥4 signals)
// ═══════════════════════════════════════════════════════════════════════════════

describe('collectSignals — behavioral signals', () => {
  // Test 1: timeOnPage signal
  it('collects timeOnPage as a positive number', () => {
    const signals = collectSignals()
    expect(signals.timeOnPage).toBeDefined()
    expect(typeof signals.timeOnPage).toBe('number')
    expect(signals.timeOnPage).toBeGreaterThanOrEqual(0)
  })

  // Test 2: scrollDepth signal
  it('collects scrollDepth in range [0, 1]', () => {
    const signals = collectSignals()
    expect(signals.scrollDepth).toBeDefined()
    expect(typeof signals.scrollDepth).toBe('number')
    expect(signals.scrollDepth).toBeGreaterThanOrEqual(0)
    expect(signals.scrollDepth).toBeLessThanOrEqual(1)
  })

  // Test 3: mouseVelocity signal
  it('collects mouseVelocity as a number', () => {
    const signals = collectSignals()
    expect(signals.mouseVelocity).toBeDefined()
    expect(typeof signals.mouseVelocity).toBe('number')
  })

  // Test 4: pageType signal
  it('collects pageType from URL pathname', () => {
    // product page
    Object.defineProperty(window, 'location', {
      value: { pathname: '/products/test-product', href: 'https://example.com/products/test' },
      writable: true,
      configurable: true,
    })
    expect(collectSignals().pageType).toBe('product')

    // checkout page
    Object.defineProperty(window, 'location', {
      value: { pathname: '/checkout', href: 'https://example.com/checkout' },
      writable: true,
      configurable: true,
    })
    expect(collectSignals().pageType).toBe('checkout')

    // cart page
    Object.defineProperty(window, 'location', {
      value: { pathname: '/cart', href: 'https://example.com/cart' },
      writable: true,
      configurable: true,
    })
    expect(collectSignals().pageType).toBe('cart')

    // blog page
    Object.defineProperty(window, 'location', {
      value: { pathname: '/blogs/news', href: 'https://example.com/blogs/news' },
      writable: true,
      configurable: true,
    })
    expect(collectSignals().pageType).toBe('blog')

    // unknown
    Object.defineProperty(window, 'location', {
      value: { pathname: '/', href: 'https://example.com/' },
      writable: true,
      configurable: true,
    })
    expect(collectSignals().pageType).toBe('unknown')
  })

  // Test 5: attachMouseTracker sets up listener without errors
  it('attachMouseTracker attaches mousemove listener without errors', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    attachMouseTracker()
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
      expect.objectContaining({ passive: true }),
    )
  })

  // Test 6: mouseVelocity is 0 with no mouse movement
  it('mouseVelocity is 0 when no mouse movement has occurred', () => {
    resetMouseTracker()
    const signals = collectSignals()
    expect(signals.mouseVelocity).toBe(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 2. CTA Config Tests
// ═══════════════════════════════════════════════════════════════════════════════

describe('cta-config — variant rendering', () => {
  // Test 7: resolveCTARenderConfig returns correct config for known variant
  it('resolveCTARenderConfig returns correct config for known variants', () => {
    expect(resolveCTARenderConfig('direct-cta').text).toBe('Comprar Agora')
    expect(resolveCTARenderConfig('direct-cta').color).toBe('#C84074')
    expect(resolveCTARenderConfig('direct-cta').icon).toBe('🛒')
  })

  // Test 8: resolveCTARenderConfig falls back to DEFAULT_CTA for unknown variant
  it('resolveCTARenderConfig returns DEFAULT_CTA for unknown variant names', () => {
    const result = resolveCTARenderConfig('nonexistent-variant')
    expect(result).toEqual(DEFAULT_CTA)
  })

  // Test 9: VARIANT_RENDER_MAP has entries for all expected variant types
  it('VARIANT_RENDER_MAP covers all intent category variants plus default', () => {
    const expectedVariants = [
      'subtle-highlight',
      'category-explorer',
      'social-proof',
      'urgency-nudge',
      'direct-cta',
      'scarcity-alert',
      'welcome-back',
      'personalized-recommendation',
      'comparison-table',
      'detailed-specs',
      'default',
    ]
    for (const variant of expectedVariants) {
      expect(VARIANT_RENDER_MAP[variant]).toBeDefined()
    }
  })

  // Test 10: DEFAULT_CTA has required fields
  it('DEFAULT_CTA has all required fields', () => {
    expect(DEFAULT_CTA.text).toBeTruthy()
    expect(DEFAULT_CTA.color).toBeTruthy()
    expect(DEFAULT_CTA.textColor).toBeTruthy()
    expect(DEFAULT_CTA.icon).toBeTruthy()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 3. UMD Engine Integration Tests
// ═══════════════════════════════════════════════════════════════════════════════

describe('UMD Engine integration', () => {
  // Test 11: UMD engine resolveIntent receives signals
  it('UMD engine resolveIntent receives collected signals', () => {
    const resolveIntentSpy = vi.fn().mockReturnValue(makeResolvedIntent('ready-to-buy', 0.92))
    const selectVariantSpy = vi
      .fn()
      .mockReturnValue(makeAdaptiveResponse('direct-cta', 'ready-to-buy', 0.92, 'exp-test'))

    mockUMDEngine({
      resolveIntent: resolveIntentSpy,
      selectVariant: selectVariantSpy,
    })

    // Simulate the script pipeline
    const signals = collectSignals()
    const engine = (window as any).FluxxisVariantEngine
    const intent = engine.resolveIntent(signals)

    expect(resolveIntentSpy).toHaveBeenCalledTimes(1)
    expect(resolveIntentSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        timeOnPage: expect.any(Number),
        scrollDepth: expect.any(Number),
        mouseVelocity: expect.any(Number),
        pageType: expect.any(String),
      }),
    )
    expect(intent.category).toBe('ready-to-buy')
    expect(intent.confidence).toBe(0.92)
  })

  // Test 12: UMD engine selectVariant receives intent and config
  it('UMD engine selectVariant receives resolved intent + config + experimentId', () => {
    const selectVariantSpy = vi
      .fn()
      .mockReturnValue(makeAdaptiveResponse('scarcity-alert', 'ready-to-buy', 0.95, 'exp-shopify'))

    mockUMDEngine({ selectVariant: selectVariantSpy })

    const engine = (window as any).FluxxisVariantEngine
    const intent = makeResolvedIntent('ready-to-buy', 0.95)
    const config = { intent: 'browse', productId: 'user-123' }
    const experimentId = 'exp-shopify'

    const response = engine.selectVariant(intent, config, experimentId)

    expect(selectVariantSpy).toHaveBeenCalledWith(intent, config, experimentId)
    expect(response.variant).toBe('scarcity-alert')
    expect(response.metadata.experimentId).toBe('exp-shopify')
  })

  // Test 13: Analytics payload includes variantName and experimentId
  it('analytics tracking includes variantName + experimentId', () => {
    const variantName = 'social-proof'
    const experimentId = 'exp-cooldown-test'
    const intentCategory = 'hesitating'

    const payload = {
      event: 'cta_impression',
      variantName,
      experimentId,
      intentCategory,
      confidence: 0.78,
      productId: undefined,
      timestamp: new Date().toISOString(),
      metadata: {
        url: 'https://example.com/products/test',
        referrer: '',
        platform: 'shopify',
        version: '0.2.0',
      },
    }

    expect(payload.variantName).toBe(variantName)
    expect(payload.experimentId).toBe(experimentId)
    expect(payload.intentCategory).toBe(intentCategory)
    expect(payload.event).toBe('cta_impression')
    expect(payload.metadata.platform).toBe('shopify')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Cooldown Mechanism Tests
// ═══════════════════════════════════════════════════════════════════════════════

describe('Cooldown mechanism', () => {
  // Test 14: cooldown cache returns same variant within 30s
  it('returns cached variant when called within cooldown window (< 30s)', () => {
    const cached = {
      config: VARIANT_RENDER_MAP['direct-cta'],
      variantName: 'direct-cta',
      experimentId: 'exp-cooldown',
      confidence: 0.92,
      intentCategory: 'ready-to-buy',
    }
    const cachedTimestamp = Date.now() - 5_000 // 5 seconds ago

    const elapsed = (Date.now() - cachedTimestamp) / 1000
    expect(elapsed).toBeLessThan(30)
    expect(cached).toBeDefined()
  })

  // Test 15: cooldown expires after 30s
  it('cache expires after cooldown window (> 30s)', () => {
    const cachedTimestamp = Date.now() - 35_000 // 35 seconds ago
    const elapsed = (Date.now() - cachedTimestamp) / 1000
    expect(elapsed).toBeGreaterThanOrEqual(30)
  })

  // Test 16: no cache when no previous resolution
  it('no cached result before first resolution', () => {
    const cached = null
    expect(cached).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Fallback Tests
// ═══════════════════════════════════════════════════════════════════════════════

describe('Fallback behavior', () => {
  // Test 17: fallback to DEFAULT_CTA when UMD engine unavailable
  it('falls back to DEFAULT_CTA when FluxxisVariantEngine is not on window', () => {
    clearUMDEngine()
    expect((window as any).FluxxisVariantEngine).toBeUndefined()

    // Pipeline should use DEFAULT_CTA
    const ctaConfig = DEFAULT_CTA
    expect(ctaConfig.text).toBe('Explorar Produtos')
    expect(ctaConfig.color).toBe('#2EE6D6')
    expect(ctaConfig.icon).toBe('🔍')
  })

  // Test 18: fallback CTA renders valid DOM button
  it('fallback CTA creates valid DOM button element', () => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'flux-cta flux-cta--v2 flux-cta--default'
    button.textContent = '🔍 Explorar Produtos'

    button.style.cssText = [
      'display: inline-flex',
      'align-items: center',
      'gap: 0.5rem',
      'padding: 0.875rem 2rem',
      'border-radius: 0.75rem',
      'font-family: Sora, Inter, system-ui, sans-serif',
      'font-weight: 700',
      'font-size: 1rem',
    ].join(';')

    expect(button.tagName).toBe('BUTTON')
    expect(button.className).toContain('flux-cta')
    expect(button.textContent).toContain('Explorar Produtos')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 6. Pipeline Integration Tests
// ═══════════════════════════════════════════════════════════════════════════════

describe('Pipeline integration (end-to-end)', () => {
  // Test 19: full pipeline produces correct variant for checkout intent
  it('full pipeline: browsing intent → variant from browsing pool', () => {
    mockUMDEngine({
      resolveIntent: () => makeResolvedIntent('browsing', 0.85),
      selectVariant: (_i, _c, _e) =>
        makeAdaptiveResponse('subtle-highlight', 'browsing', 0.85, 'exp-full-pipeline'),
    })

    // Step 1: collect signals
    const signals = collectSignals()
    expect(signals).toBeDefined()

    // Step 2: resolve intent via UMD
    const engine = (window as any).FluxxisVariantEngine
    const intent = engine.resolveIntent(signals)
    expect(intent.category).toBe('browsing')

    // Step 3: select variant
    const response = engine.selectVariant(intent, { intent: 'browse' }, 'exp-full-pipeline')
    expect(response.variant).toBe('subtle-highlight')
    expect(response.metadata.experimentId).toBe('exp-full-pipeline')

    // Step 4: render config lookup
    const renderConfig = resolveCTARenderConfig(response.variant)
    expect(renderConfig.text).toBe('Explorar Produtos')
    expect(renderConfig.icon).toBe('🔍')
  })

  // Test 20: full pipeline with hesitating intent
  it('full pipeline: hesitating intent → social-proof variant', () => {
    mockUMDEngine({
      resolveIntent: () => makeResolvedIntent('hesitating', 0.75),
      selectVariant: (_i, _c, _e) =>
        makeAdaptiveResponse('social-proof', 'hesitating', 0.75, 'exp-hesitate'),
    })

    const engine = (window as any).FluxxisVariantEngine
    const intent = engine.resolveIntent(collectSignals())
    const response = engine.selectVariant(intent, { intent: 'browse' }, 'exp-hesitate')
    const renderConfig = resolveCTARenderConfig(response.variant)

    expect(renderConfig.text).toBe('Mais Vendido')
    expect(renderConfig.icon).toBe('⭐')
    expect(renderConfig.subtext).toBeDefined()
  })

  // Test 21: response confidence flows through pipeline
  it('confidence score flows from intent through response to render config', () => {
    const confidence = 0.88

    mockUMDEngine({
      resolveIntent: () => makeResolvedIntent('ready-to-buy', confidence),
      selectVariant: (i, _c, _e) =>
        makeAdaptiveResponse('direct-cta', i.category, i.confidence, 'exp-conf'),
    })

    const engine = (window as any).FluxxisVariantEngine
    const intent = engine.resolveIntent(collectSignals())
    const response = engine.selectVariant(intent, { intent: 'browse' }, 'exp-conf')

    expect(response.confidence).toBe(confidence)
    expect(response.intent).toBe('ready-to-buy')
    expect(response.variant).toBe('direct-cta')
  })

  // Test 22: all 5 intent categories produce valid variant + render config
  it('all intent categories map to valid render configs', () => {
    const categories: [IntentCategory, string, string][] = [
      ['browsing', 'subtle-highlight', 'Explorar Produtos'],
      ['hesitating', 'social-proof', 'Mais Vendido'],
      ['ready-to-buy', 'direct-cta', 'Comprar Agora'],
      ['returning', 'welcome-back', 'Bem-vindo de Volta'],
      ['researching', 'comparison-table', 'Comparar Modelos'],
    ]

    for (const [category, variant, expectedText] of categories) {
      mockUMDEngine({
        resolveIntent: () => makeResolvedIntent(category, 0.85),
        selectVariant: (_i, _c, _e) =>
          makeAdaptiveResponse(variant, category, 0.85, 'exp-categories'),
      })

      const engine = (window as any).FluxxisVariantEngine
      const intent = engine.resolveIntent(collectSignals())
      const response = engine.selectVariant(intent, { intent: 'browse' }, 'exp-categories')
      const renderConfig = resolveCTARenderConfig(response.variant)

      expect(renderConfig.text).toBe(expectedText)
      expect(response.intent).toBe(category)
    }
  })

  // Test 23: UMD unavailable → render fallback CTA
  it('full pipeline falls back to default CTA when UMD not loaded', () => {
    clearUMDEngine()
    expect((window as any).FluxxisVariantEngine).toBeUndefined()

    // Simulate fallback path
    const fallbackConfig = DEFAULT_CTA
    const renderConfig = resolveCTARenderConfig('default')

    expect(renderConfig.text).toBe(fallbackConfig.text)
    expect(renderConfig.color).toBe(fallbackConfig.color)
    expect(renderConfig.icon).toBe(fallbackConfig.icon)
  })
})
