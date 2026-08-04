/**
 * Behavioral Signal Collection — Shopify Script Tag
 *
 * KEEP IN SYNC WITH script-tag.js
 *
 * Collects ≥4 behavioral signals from the user's browsing session
 * for the intent resolver pipeline:
 *   1. timeOnPage   — milliseconds since page load
 *   2. scrollDepth  — fraction of page scrolled (0-1)
 *   3. mouseVelocity — average mouse movement speed (px/ms)
 *   4. pageType     — inferred from URL pathname
 *
 * Part of @fluxxis/adaptive-cta — Shopify v2 Pipeline
 */

import type { IntentSignal } from '../src/types'

/**
 * Map URL pathname segments to page types recognized by the resolver.
 */
function inferPageType(): IntentSignal['pageType'] {
  try {
    const path = window.location.pathname.toLowerCase()

    if (/\/checkout/.test(path)) return 'checkout'
    if (/\/cart/.test(path)) return 'cart'
    if (/\/products?\//.test(path)) return 'product'
    if (/\/blogs?\//.test(path) || /\/pages\//.test(path)) return 'blog'

    return 'unknown'
  } catch {
    return 'unknown'
  }
}

/**
 * Compute scroll depth as a fraction of the total scrollable height.
 * Returns a value between 0 (top) and 1 (bottom).
 */
function computeScrollDepth(): number {
  try {
    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0

    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.clientHeight,
    )

    if (docHeight <= 0) return 0

    const viewportHeight = window.innerHeight || docHeight
    const maxScroll = docHeight - viewportHeight

    if (maxScroll <= 0) return 1 // Page fits in viewport

    return Math.min(1, Math.max(0, scrollTop / maxScroll))
  } catch {
    return 0
  }
}

/**
 * Mouse velocity tracker (singleton).
 * Accumulates mouse movements and computes average velocity in px/ms.
 */
let lastMouseX = -1
let lastMouseY = -1
let lastMouseTime = 0
let totalDistance = 0
let totalTime = 0
let movementCount = 0

function trackMouseMove(e: MouseEvent): void {
  const now = performance.now()

  if (lastMouseX >= 0 && lastMouseY >= 0 && now > lastMouseTime) {
    const dx = e.clientX - lastMouseX
    const dy = e.clientY - lastMouseY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const dt = now - lastMouseTime

    if (dt > 0) {
      totalDistance += distance
      totalTime += dt
      movementCount++
    }
  }

  lastMouseX = e.clientX
  lastMouseY = e.clientY
  lastMouseTime = now
}

/**
 * Compute average mouse velocity from accumulated data.
 * Returns velocity in pixels per millisecond.
 */
function computeMouseVelocity(): number {
  if (totalTime <= 0 || movementCount < 2) return 0
  return totalDistance / totalTime
}

/**
 * Whether the mouse tracker has been attached to the document yet.
 */
let trackerAttached = false

/**
 * Attach the mouse movement listener if not already attached.
 */
export function attachMouseTracker(): void {
  if (trackerAttached) return
  if (typeof document === 'undefined') return

  document.addEventListener('mousemove', trackMouseMove, { passive: true })
  trackerAttached = true
}

/**
 * Collect all behavioral signals from the current browsing session.
 *
 * Signals collected:
 * - timeOnPage: ms since navigation start (performance.now())
 * - scrollDepth: 0-1 fraction of page scrolled
 * - mouseVelocity: average mouse speed in px/ms
 * - pageType: inferred from URL (product | cart | checkout | blog | unknown)
 *
 * @returns IntentSignal object ready for the resolver pipeline
 */
export function collectSignals(): IntentSignal {
  return {
    timeOnPage: performance.now(),
    scrollDepth: computeScrollDepth(),
    mouseVelocity: computeMouseVelocity(),
    pageType: inferPageType(),
  }
}

/**
 * Reset the mouse velocity tracker state.
 * Useful for testing to get clean measurements.
 */
export function resetMouseTracker(): void {
  lastMouseX = -1
  lastMouseY = -1
  lastMouseTime = 0
  totalDistance = 0
  totalTime = 0
  movementCount = 0
}
