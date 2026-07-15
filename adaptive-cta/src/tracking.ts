/**
 * Tracking Module — Lightweight analytics for CTA events.
 *
 * Fires `cta_impression`, `cta_click`, and `cta_conversion` events.
 * Designed to work in browser, Shopify storefront, and WooCommerce contexts.
 *
 * Events are dispatched via:
 *   1. `navigator.sendBeacon()` (non-blocking, preferred)
 *   2. `window.dispatchEvent(new CustomEvent(...))` for in-page listeners
 */

import type { CTAAnalytics, Intent } from './types'

// ── Configuration ───────────────────────────────────────────────────────────

let _endpoint: string | null = null

/**
 * Set the analytics collection endpoint (e.g., your SaaS backend).
 * If not set, events are only dispatched as DOM CustomEvents.
 */
export function setTrackingEndpoint(url: string): void {
  _endpoint = url
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildPayload(
  event: CTAAnalytics['event'],
  intent: Intent,
  productId?: string,
  productName?: string,
): CTAAnalytics {
  return {
    event,
    intent,
    productId,
    productName,
    timestamp: new Date().toISOString(),
    metadata: {
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    },
  }
}

function send(payload: CTAAnalytics): void {
  // 1. Fire as DOM CustomEvent so in-page handlers can react
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('fluxxis:cta', {
        detail: payload,
        bubbles: true,
      }),
    )
  }

  // 2. Beacon to analytics endpoint (fire-and-forget)
  if (_endpoint && typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    navigator.sendBeacon(_endpoint, blob)
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Fire a `cta_impression` event.
 * Call once when the SmartCTA component mounts.
 */
export function trackImpression(intent: Intent, productId?: string, productName?: string): void {
  send(buildPayload('cta_impression', intent, productId, productName))
}

/**
 * Fire a `cta_click` event.
 * Call when the user clicks the CTA button.
 */
export function trackClick(intent: Intent, productId?: string, productName?: string): void {
  send(buildPayload('cta_click', intent, productId, productName))
}

/**
 * Fire a `cta_conversion` event.
 * Call after a successful purchase / lead capture.
 */
export function trackConversion(intent: Intent, productId?: string, productName?: string): void {
  send(buildPayload('cta_conversion', intent, productId, productName))
}
