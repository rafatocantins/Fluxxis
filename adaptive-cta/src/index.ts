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
  // Intent Resolver v2 types
  IntentCategory,
  IntentSignal,
  ResolvedIntent,
  IntentResolverStrategy,
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

// ── A/B Variant Engine ───────────────────────────────────────────────────────
export { selectVariant, VARIANT_POOLS } from './engine/variant-engine'
export { assignVariant, hashString } from './engine/ab-splitter'
export { buildResponse } from './engine/response'
export type {
  VariantName,
  VariantPool,
  AdaptiveCTAResponse,
} from './types'

// ── Default export ──────────────────────────────────────────────────────────
export { SmartCTA as default } from './SmartCTA'
