/**
 * UMD Entry Point — Fluxxis Variant Engine
 *
 * Bundled via tsup as an IIFE that attaches to `window.FluxxisVariantEngine`.
 * Designed for CDN distribution: a single self-contained script that
 * Shopify/WooCommerce plugins can consume via `<script src="...">`.
 *
 * Exposes: resolveIntent, selectVariant, VARIANT_POOLS, assignVariant
 *
 * Part of @fluxxis/adaptive-cta — UMD Bundle Pipeline
 */

import { resolveIntent } from './resolver/index'
import { selectVariant, VARIANT_POOLS } from './engine/variant-engine'
import { assignVariant } from './engine/ab-splitter'

// Re-export all public APIs
export { resolveIntent, selectVariant, VARIANT_POOLS, assignVariant }

// Attach to window for CDN/UMD consumption
if (typeof window !== 'undefined') {
  ;(window as any).FluxxisVariantEngine = {
    resolveIntent,
    selectVariant,
    VARIANT_POOLS,
    assignVariant,
  }
}
