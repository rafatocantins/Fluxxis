/**
 * Fluxxis Adaptive CTA — Shopify Script Tag
 *
 * Injects the SmartCTA widget into every Shopify storefront page.
 * This script is loaded asynchronously via Shopify's script_tag API.
 *
 * Usage:
 *   Shopify Admin → Online Store → Themes → Edit Code → theme.liquid
 *   Add: {% render 'fluxxis-cta' %}
 *
 * Or via Shopify ScriptTag API:
 *   POST /admin/api/2024-01/script_tags.json
 *   { "script_tag": { "event": "onload", "src": "https://cdn.fluxxis.dev/adaptive-cta/v0.1.0/smart-cta.umd.js" } }
 *
 * @version 0.1.0
 */

(function () {
  'use strict'

  // ── Configuration ──────────────────────────────────────────────────────
  var CONFIG = {
    // Your SaaS endpoint for analytics events
    analyticsEndpoint: 'https://api.fluxxis.dev/v1/cta-events',
    // Your SaaS license key
    licenseKey: '',
    // Selector for the CTA container (Shopify product page)
    productFormSelector: '.product-form__buttons, .product__info-wrapper form',
    // Selector for cart page
    cartSelector: '.cart__ctas, .cart__checkout-button',
  }

  // ── Intent Detection ───────────────────────────────────────────────────
  var pathname = window.location.pathname.toLowerCase()

  function detectIntent() {
    if (/\/cart|\/checkout/.test(pathname)) return 'buy'
    if (/\/compare/.test(pathname)) return 'compare'
    if (/\/blogs?\/|\/pages\/guide/.test(pathname)) return 'learn'
    return 'browse'
  }

  // ── CTA Variants ───────────────────────────────────────────────────────
  var CTA_MAP = {
    browse: { text: 'Explorar Produtos', color: '#2EE6D6', textColor: '#0a0a1a', icon: '🔍' },
    buy: { text: 'Comprar Agora', color: '#FF5C9D', textColor: '#ffffff', icon: '🛒', subtext: 'Frete Grátis' },
    compare: { text: 'Comparar Modelos', color: '#FFB454', textColor: '#0a0a1a', icon: '⚖️' },
    learn: { text: 'Saber Mais', color: '#8B6DFF', textColor: '#ffffff', icon: '📚' },
  }

  // ── Render CTA ─────────────────────────────────────────────────────────
  var intent = detectIntent()
  var cta = CTA_MAP[intent]

  function createCTA() {
    var button = document.createElement('button')
    button.type = 'button'
    button.className = 'flux-cta flux-cta--' + intent

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
      'background: ' + cta.color,
      'color: ' + cta.textColor,
      'box-shadow: 0 4px 20px ' + cta.color + '40',
      'width: 100%',
      'justify-content: center',
      'margin-top: 1rem',
    ].join(';')

    // Button content
    var content = document.createElement('span')
    content.style.cssText = 'display:flex;flex-direction:column;align-items:center;text-align:center;'

    var label = document.createElement('span')
    label.style.cssText = 'display:flex;align-items:center;gap:0.375rem;'
    label.textContent = (cta.icon ? cta.icon + ' ' : '') + cta.text

    content.appendChild(label)

    if (cta.subtext) {
      var sub = document.createElement('span')
      sub.style.cssText = 'font-size:0.7rem;font-weight:400;opacity:0.85;margin-top:0.125rem;'
      sub.textContent = cta.subtext
      content.appendChild(sub)
    }

    button.appendChild(content)

    // Accessibility
    button.setAttribute('aria-label', cta.text + (cta.subtext ? ' — ' + cta.subtext : ''))

    // Click handler
    button.addEventListener('click', function (e) {
      e.preventDefault()
      trackEvent('cta_click')
      // Navigate based on intent
      if (intent === 'buy') {
        var addToCart = document.querySelector('[name="add"], [data-add-to-cart]')
        if (addToCart) addToCart.click()
      }
    })

    // Hover effect
    button.addEventListener('mouseenter', function () {
      button.style.transform = 'translateY(-1px)'
      button.style.boxShadow = '0 8px 30px ' + cta.color + '60'
    })
    button.addEventListener('mouseleave', function () {
      button.style.transform = 'none'
      button.style.boxShadow = '0 4px 20px ' + cta.color + '40'
    })

    // Focus
    button.addEventListener('focus', function () {
      button.style.outline = '3px solid #8B6DFF'
      button.style.outlineOffset = '2px'
    })
    button.addEventListener('blur', function () {
      button.style.outline = 'none'
    })

    return button
  }

  // ── Analytics ─────────────────────────────────────────────────────────
  function trackEvent(event) {
    var payload = {
      event: event,
      intent: intent,
      productId: window.ShopifyAnalytics
        ? window.ShopifyAnalytics.meta.product.id
        : undefined,
      timestamp: new Date().toISOString(),
      metadata: {
        url: window.location.href,
        referrer: document.referrer,
        platform: 'shopify',
      },
    }

    // Fire as DOM event
    window.dispatchEvent(
      new CustomEvent('fluxxis:cta', { detail: payload, bubbles: true })
    )

    // Beacon to SaaS backend
    if (CONFIG.analyticsEndpoint && navigator.sendBeacon) {
      var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      navigator.sendBeacon(CONFIG.analyticsEndpoint, blob)
    }
  }

  // ── Injection ─────────────────────────────────────────────────────────
  function injectCTA() {
    var target

    // Try product form first
    target = document.querySelector(CONFIG.productFormSelector)
    if (target) {
      target.appendChild(createCTA())
      trackEvent('cta_impression')
      return
    }

    // Try cart page
    target = document.querySelector(CONFIG.cartSelector)
    if (target) {
      target.appendChild(createCTA())
      trackEvent('cta_impression')
      return
    }

    // Fallback: inject after the main product image
    target = document.querySelector('.product__media, .product-single__media, .product__image')
    if (target) {
      target.insertAdjacentElement('afterend', createCTA())
      trackEvent('cta_impression')
      return
    }
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCTA)
  } else {
    injectCTA()
  }
})()
