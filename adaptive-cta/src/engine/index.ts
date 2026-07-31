/**
 * @fluxxis/adaptive-cta/engine
 *
 * A/B Variant Engine — Intent-driven variant selection for e-commerce CTAs.
 * Consumes ResolvedIntent from the resolver pipeline and produces
 * AdaptiveCTAResponse for Shopify/WooCommerce plugins.
 */

export { selectVariant, VARIANT_POOLS } from './variant-engine'
export { assignVariant, hashString } from './ab-splitter'
export { buildResponse } from './response'
