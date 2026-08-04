/**
 * Fluxxis Adaptive CTA — Shopify Script Tag (v2)
 *
 * Injects the SmartCTA widget into every Shopify storefront page.
 * Uses the UMD FluxxisVariantEngine for intent-driven variant selection.
 *
 * Pipeline:
 *   collectSignals() → resolveIntent() → selectVariant() → renderCTA() → trackAnalytics()
 *
 * Features:
 *   - 4+ behavioral signals: timeOnPage, scrollDepth, mouseVelocity, pageType
 *   - Cooldown: repeated calls within 30s return cached variant
 *   - Fallback: graceful static CTA when UMD engine is unavailable
 *   - Analytics: tracks variantName + experimentId
 *
 * Usage:
 *   Shopify Admin → Online Store → Themes → Edit Code → theme.liquid
 *   Add: {% render 'fluxxis-cta' %}
 *
 * Or via Shopify ScriptTag API:
 *   POST /admin/api/2024-01/script_tags.json
 *   { "script_tag": { "event": "onload", "src": "https://cdn.fluxxis.dev/adaptive-cta/v0.2.0/smart-cta.umd.js" } }
 *
 * @version 0.2.0
 */

(function () {
  'use strict'

  // ── Configuration ──────────────────────────────────────────────────────
  var CONFIG = {
    // Your SaaS endpoint for analytics events
    analyticsEndpoint: 'https://api.fluxxis.dev/v1/cta-events',
    // Your SaaS license key
    licenseKey: '',
    // Experiment ID for A/B testing
    experimentId: 'shopify-v2-default',
    // Selector for the CTA container (Shopify product page)
    productFormSelector: '.product-form__buttons, .product__info-wrapper form',
    // Selector for cart page
    cartSelector: '.cart__ctas, .cart__checkout-button',
    // Cooldown window in seconds
    cooldownSeconds: 30,
  }

  // ── Default CTA (fallback when UMD unavailable) ────────────────────────
  var DEFAULT_CTA = {
    text: 'Explorar Produtos',
    color: '#2EE6D6',
    textColor: '#0a0a1a',
    icon: '🔍',
  }

  // ── Variant render map (maps variant names to visual configs) ──────────
  var VARIANT_RENDER_MAP = {
    // Browsing
    'subtle-highlight': {
      text: 'Explorar Produtos', color: '#2EE6D6', textColor: '#0a0a1a', icon: '🔍',
    },
    'category-explorer': {
      text: 'Ver Categorias', color: '#3DD9C9', textColor: '#0a0a1a', icon: '📂',
    },
    // Hesitating
    'social-proof': {
      text: 'Mais Vendido', color: '#FF5C9D', textColor: '#ffffff', icon: '⭐',
      subtext: 'Recomendado por outros clientes',
    },
    'urgency-nudge': {
      text: 'Últimas Unidades', color: '#FF3B6E', textColor: '#ffffff', icon: '⚡',
      subtext: 'Estoque limitado',
    },
    // Ready-to-buy
    'direct-cta': {
      text: 'Comprar Agora', color: '#FF5C9D', textColor: '#ffffff', icon: '🛒',
      subtext: 'Frete Grátis',
    },
    'scarcity-alert': {
      text: 'Garantir o Meu', color: '#E8457A', textColor: '#ffffff', icon: '🔥',
      subtext: 'Oferta por tempo limitado',
    },
    // Returning
    'welcome-back': {
      text: 'Bem-vindo de Volta', color: '#8B6DFF', textColor: '#ffffff', icon: '👋',
      subtext: 'Continue de onde parou',
    },
    'personalized-recommendation': {
      text: 'Recomendado para Si', color: '#7B5DE6', textColor: '#ffffff', icon: '🎯',
    },
    // Researching
    'comparison-table': {
      text: 'Comparar Modelos', color: '#FFB454', textColor: '#0a0a1a', icon: '⚖️',
    },
    'detailed-specs': {
      text: 'Ver Especificações', color: '#FFA033', textColor: '#0a0a1a', icon: '📋',
    },
    // Default
    'default': {
      text: 'Explorar Produtos', color: '#2EE6D6', textColor: '#0a0a1a', icon: '🔍',
    },
  }

  // ── Cooldown Cache ─────────────────────────────────────────────────────
  var _cachedVariant = null
  var _cachedTimestamp = 0

  function isCooldownActive() {
    if (!_cachedVariant) return false
    var elapsed = (Date.now() - _cachedTimestamp) / 1000
    return elapsed < CONFIG.cooldownSeconds
  }

  // ── Signal Collection ──────────────────────────────────────────────────

  // Mouse velocity tracking
  var _lastMouseX = -1
  var _lastMouseY = -1
  var _lastMouseTime = 0
  var _totalDistance = 0
  var _totalTime = 0
  var _movementCount = 0
  var _mouseTrackerAttached = false

  function trackMouseMove(e) {
    var now = typeof performance !== 'undefined' ? performance.now() : Date.now()
    if (_lastMouseX >= 0 && _lastMouseY >= 0 && now > _lastMouseTime) {
      var dx = e.clientX - _lastMouseX
      var dy = e.clientY - _lastMouseY
      var dist = Math.sqrt(dx * dx + dy * dy)
      var dt = now - _lastMouseTime
      if (dt > 0) {
        _totalDistance += dist
        _totalTime += dt
        _movementCount++
      }
    }
    _lastMouseX = e.clientX
    _lastMouseY = e.clientY
    _lastMouseTime = now
  }

  function attachMouseTracker() {
    if (_mouseTrackerAttached || typeof document === 'undefined') return
    document.addEventListener('mousemove', trackMouseMove, { passive: true })
    _mouseTrackerAttached = true
  }

  function computeMouseVelocity() {
    if (_totalTime <= 0 || _movementCount < 2) return 0
    return _totalDistance / _totalTime
  }

  function computeScrollDepth() {
    try {
      var scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
      var docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.clientHeight
      )
      if (docHeight <= 0) return 0
      var viewportHeight = window.innerHeight || docHeight
      var maxScroll = docHeight - viewportHeight
      if (maxScroll <= 0) return 1
      return Math.min(1, Math.max(0, scrollTop / maxScroll))
    } catch (e) {
      return 0
    }
  }

  function inferPageType() {
    try {
      var path = window.location.pathname.toLowerCase()
      if (/\/checkout/.test(path)) return 'checkout'
      if (/\/cart/.test(path)) return 'cart'
      if (/\/products?\//.test(path)) return 'product'
      if (/\/blogs?\//.test(path) || /\/pages\//.test(path)) return 'blog'
      return 'unknown'
    } catch (e) {
      return 'unknown'
    }
  }

  /**
   * Collect all behavioral signals.
   * Returns: { timeOnPage, scrollDepth, mouseVelocity, pageType }
   */
  function collectSignals() {
    return {
      timeOnPage: typeof performance !== 'undefined' ? performance.now() : 0,
      scrollDepth: computeScrollDepth(),
      mouseVelocity: computeMouseVelocity(),
      pageType: inferPageType(),
    }
  }

  // ── UMD Integration ────────────────────────────────────────────────────

  /**
   * Check if the FluxxisVariantEngine UMD bundle is loaded.
   */
  function hasUMDEngine() {
    return (
      typeof window !== 'undefined' &&
      window.FluxxisVariantEngine &&
      typeof window.FluxxisVariantEngine.resolveIntent === 'function' &&
      typeof window.FluxxisVariantEngine.selectVariant === 'function'
    )
  }

  /**
   * Get a unique user/session identifier.
   * Uses Shopify customer ID if available, otherwise generates a persistent ID.
   */
  function getUserId() {
    try {
      // Try Shopify customer ID
      if (
        window.ShopifyAnalytics &&
        window.ShopifyAnalytics.meta &&
        window.ShopifyAnalytics.meta.customerId
      ) {
        return 'cust-' + window.ShopifyAnalytics.meta.customerId
      }
      if (
        window.ShopifyAnalytics &&
        window.ShopifyAnalytics.meta &&
        window.ShopifyAnalytics.meta.product &&
        window.ShopifyAnalytics.meta.product.id
      ) {
        // Fallback: product-based session
        return 'prod-' + window.ShopifyAnalytics.meta.product.id
      }
    } catch (e) {
      // Ignore
    }

    // Last resort: localStorage-based persistent ID
    try {
      var stored = localStorage.getItem('fluxxis_session_id')
      if (stored) return stored
      var newId = 'anon-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
      localStorage.setItem('fluxxis_session_id', newId)
      return newId
    } catch (e) {
      return 'anon-' + Date.now()
    }
  }

  /**
   * Resolve the CTA variant config using the full pipeline.
   *
   * Pipeline:
   *   1. Check cooldown → return cached if < 30s
   *   2. collectSignals() → behavioral signals
   *   3. If UMD: resolveIntent(signals) → ResolvedIntent
   *   4. selectVariant(intent, userId) → AdaptiveCTAResponse
   *   5. Look up visual config from VARIANT_RENDER_MAP
   *   6. Fallback: DEFAULT_CTA if UMD unavailable
   */
  function resolveCTA() {
    // ── Cooldown check ──────────────────────────────────────────────────
    if (isCooldownActive()) {
      return _cachedVariant
    }

    var signals = collectSignals()

    // ── UMD Engine path ─────────────────────────────────────────────────
    if (hasUMDEngine()) {
      try {
        var engine = window.FluxxisVariantEngine
        var resolvedIntent = engine.resolveIntent(signals)
        var userId = getUserId()

        var ctaConfig = {
          intent: 'browse',
          productId: userId,
          productName: undefined,
        }

        var response = engine.selectVariant(resolvedIntent, ctaConfig, CONFIG.experimentId)
        var variantName = response.variant
        var renderConfig = VARIANT_RENDER_MAP[variantName] || DEFAULT_CTA

        var result = {
          config: renderConfig,
          variantName: variantName,
          experimentId: CONFIG.experimentId,
          confidence: response.confidence,
          intentCategory: response.intent,
        }

        // Cache for cooldown
        _cachedVariant = result
        _cachedTimestamp = Date.now()

        return result
      } catch (e) {
        // Engine error → fall through to default
      }
    }

    // ── Fallback: static default CTA ────────────────────────────────────
    var fallback = {
      config: DEFAULT_CTA,
      variantName: 'default',
      experimentId: CONFIG.experimentId,
      confidence: 0,
      intentCategory: 'browsing',
    }

    _cachedVariant = fallback
    _cachedTimestamp = Date.now()

    return fallback
  }

  // ── Render CTA ─────────────────────────────────────────────────────────

  function createButton(ctaConfig) {
    var cfg = ctaConfig.config || DEFAULT_CTA

    var button = document.createElement('button')
    button.type = 'button'
    button.className = 'flux-cta flux-cta--v2 flux-cta--' + (ctaConfig.variantName || 'default')

    // Inline styles (WCAG 2.1 AA compliant)
    button.style.cssText = [
      'display: inline-flex',
      'align-items: center',
      'gap: 0.5rem',
      'padding: 0.875rem 2rem',
      'border-radius: 0.75rem',
      'font-family: Sora, Inter, system-ui, sans-serif',
      'font-weight: 700',
      'font-size: 1rem',
      'border: none',
      'cursor: pointer',
      'text-decoration: none',
      'transition: all 200ms ease',
      'background: ' + cfg.color,
      'color: ' + cfg.textColor,
      'box-shadow: 0 4px 20px ' + cfg.color + '40',
      'width: 100%',
      'justify-content: center',
      'margin-top: 1rem',
    ].join(';')

    // Button content
    var content = document.createElement('span')
    content.style.cssText =
      'display:flex;flex-direction:column;align-items:center;text-align:center;'

    var label = document.createElement('span')
    label.style.cssText = 'display:flex;align-items:center;gap:0.375rem;'
    label.textContent = (cfg.icon ? cfg.icon + ' ' : '') + cfg.text
    content.appendChild(label)

    if (cfg.subtext) {
      var sub = document.createElement('span')
      sub.style.cssText =
        'font-size:0.7rem;font-weight:400;opacity:0.85;margin-top:0.125rem;'
      sub.textContent = cfg.subtext
      content.appendChild(sub)
    }

    button.appendChild(content)

    // Accessibility
    button.setAttribute(
      'aria-label',
      cfg.text + (cfg.subtext ? ' — ' + cfg.subtext : '')
    )

    // Click handler
    button.addEventListener('click', function (e) {
      e.preventDefault()
      trackEvent('cta_click', ctaConfig)

      // Smart add-to-cart: detect if on product page
      if (ctaConfig.intentCategory === 'ready-to-buy') {
        var addToCart = document.querySelector('[name="add"], [data-add-to-cart]')
        if (addToCart) addToCart.click()
      }
    })

    // Hover effect
    button.addEventListener('mouseenter', function () {
      button.style.transform = 'translateY(-1px)'
      button.style.boxShadow = '0 8px 30px ' + cfg.color + '60'
    })
    button.addEventListener('mouseleave', function () {
      button.style.transform = 'none'
      button.style.boxShadow = '0 4px 20px ' + cfg.color + '40'
    })

    // Focus (WCAG 2.1 AA)
    button.addEventListener('focus', function () {
      button.style.outline = '3px solid #8B6DFF'
      button.style.outlineOffset = '2px'
    })
    button.addEventListener('blur', function () {
      button.style.outline = 'none'
    })

    return button
  }

  // ── DOM Injection ──────────────────────────────────────────────────────

  function renderCTA(ctaConfig) {
    var button = createButton(ctaConfig)
    var target

    // Try product form first
    target = document.querySelector(CONFIG.productFormSelector)
    if (target) {
      target.appendChild(button)
      return
    }

    // Try cart page
    target = document.querySelector(CONFIG.cartSelector)
    if (target) {
      target.appendChild(button)
      return
    }

    // Fallback: inject after the main product image
    target = document.querySelector(
      '.product__media, .product-single__media, .product__image'
    )
    if (target) {
      target.insertAdjacentElement('afterend', button)
      return
    }

    // Last resort: append to body
    document.body.appendChild(button)
  }

  // ── Analytics ─────────────────────────────────────────────────────────

  function trackEvent(eventType, ctaConfig) {
    var variantName = ctaConfig ? ctaConfig.variantName : 'unknown'
    var experimentId = ctaConfig ? ctaConfig.experimentId : undefined

    var productId
    try {
      productId =
        window.ShopifyAnalytics && window.ShopifyAnalytics.meta
          ? window.ShopifyAnalytics.meta.product
            ? window.ShopifyAnalytics.meta.product.id
            : undefined
          : undefined
    } catch (e) {
      productId = undefined
    }

    var payload = {
      event: eventType,
      variantName: variantName,
      experimentId: experimentId,
      intentCategory: ctaConfig ? ctaConfig.intentCategory : 'browsing',
      confidence: ctaConfig ? ctaConfig.confidence : 0,
      productId: productId,
      timestamp: new Date().toISOString(),
      metadata: {
        url: window.location.href,
        referrer: document.referrer,
        platform: 'shopify',
        version: '0.2.0',
      },
    }

    // Fire as DOM event
    try {
      window.dispatchEvent(
        new CustomEvent('fluxxis:cta', { detail: payload, bubbles: true })
      )
    } catch (e) {
      // CustomEvent not supported — ignore
    }

    // Beacon to SaaS backend
    if (CONFIG.analyticsEndpoint && navigator.sendBeacon) {
      try {
        var blob = new Blob([JSON.stringify(payload)], {
          type: 'application/json',
        })
        navigator.sendBeacon(CONFIG.analyticsEndpoint, blob)
      } catch (e) {
        // Beacon failed — fire-and-forget, no impact on UX
      }
    }
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────

  function injectCTA() {
    // Attach mouse tracker early to collect velocity data
    attachMouseTracker()

    // Resolve CTA variant through the pipeline
    var ctaConfig = resolveCTA()

    // Render the button
    renderCTA(ctaConfig)

    // Track impression (includes variantName + experimentId)
    trackEvent('cta_impression', ctaConfig)
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCTA)
  } else {
    injectCTA()
  }
})()
