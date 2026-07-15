/**
 * @fluxxis/adaptive-cta — Entry Points
 *
 * Exports the SmartCTA component, intent resolver, tracking, and DS adapters.
 * Supports ESM, CJS, and UMD builds.
 */

// ── Component (default export for convenience) ──────────────────────────────
export { SmartCTA } from './SmartCTA'

// ── Types ───────────────────────────────────────────────────────────────────
export type {
  Intent,
  CTAVariant,
  CTAConfig,
  CTAAnalytics,
  SmartCTAProps,
  CTAVariantStyle,
  DSAdapter,
} from './types'

// ── Intent Resolver ─────────────────────────────────────────────────────────
export {
  CTA_MAP,
  resolveCTA,
  detectIntentFromURL,
  ALL_INTENTS,
} from './intent-resolver'

// ── Tracking ────────────────────────────────────────────────────────────────
export {
  setTrackingEndpoint,
  trackImpression,
  trackClick,
  trackConversion,
} from './tracking'

// ── DS Adapters ─────────────────────────────────────────────────────────────
export {
  getAdapter,
  FluxxisAdapter,
  ShopifyPolarisAdapter,
  WooCommerceAdapter,
} from './ds-adapter'

// ── Default export ──────────────────────────────────────────────────────────
export { SmartCTA as default } from './SmartCTA'
