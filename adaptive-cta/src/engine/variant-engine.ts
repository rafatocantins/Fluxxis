/**
 * A/B Variant Engine — Core variant selection logic.
 *
 * Consumes a ResolvedIntent from the intent resolver and produces
 * an AdaptiveCTAResponse for Shopify/WooCommerce plugins to render.
 *
 * Flow: ResolvedIntent → variant pool lookup → A/B split → build response
 *
 * Features:
 * - Deterministic assignment per session (same session sees same variant)
 * - Cooldown: 30-second time-bucketed stability (prevents flickering)
 * - Low-confidence fallback: returns "default" variant when confidence < 0.6
 * - Extensible: add new intents by extending VARIANT_POOLS
 *
 * Part of @fluxxis/adaptive-cta — A/B Variant Engine
 */

import type {
  IntentCategory,
  VariantName,
  ResolvedIntent,
  AdaptiveCTAResponse,
  CTAConfig,
} from '../types'
import { assignVariant } from './ab-splitter'
import { buildResponse } from './response'

// ── Variant Pools ────────────────────────────────────────────────────────────

/**
 * Predefined variant pools for each intent category.
 *
 * Each pool contains 2 variants to enable clean 50/50 A/B splits.
 * Variants are named descriptively for analytics and debugging.
 */
export const VARIANT_POOLS: Record<IntentCategory, readonly VariantName[]> = {
  browsing: ['subtle-highlight', 'category-explorer'] as const,
  hesitating: ['social-proof', 'urgency-nudge'] as const,
  'ready-to-buy': ['direct-cta', 'scarcity-alert'] as const,
  returning: ['welcome-back', 'personalized-recommendation'] as const,
  researching: ['comparison-table', 'detailed-specs'] as const,
}

/** Variant returned when confidence is below the actionable threshold */
const DEFAULT_VARIANT: VariantName = 'default'

/** Minimum confidence required to select a variant from the pool */
const MIN_CONFIDENCE = 0.6

/** Cooldown window in seconds — same session sees the same variant within this period */
const COOLDOWN_SECONDS = 30

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Compute the current cooldown time bucket.
 * Floors the current timestamp to the nearest 30-second window,
 * ensuring the same session gets the same variant within each window.
 */
function getCooldownBucket(): number {
  return Math.floor(Date.now() / (COOLDOWN_SECONDS * 1000))
}

/**
 * Derive a session identifier from available context.
 * Uses experimentId first, falls back to productId, then a constant.
 */
function deriveSessionId(config: CTAConfig, experimentId?: string): string {
  return experimentId ?? config.productId ?? 'anonymous'
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Select a CTA variant based on resolved intent and configuration.
 *
 * Algorithm:
 * 1. If confidence < 0.6 → return "default" variant (low-confidence fallback)
 * 2. Look up the variant pool for the resolved intent category
 * 3. Apply deterministic A/B split using session + experiment hash
 * 4. Cooldown: time-bucketed key ensures stability within 30-second windows
 * 5. Build and return the AdaptiveCTAResponse
 *
 * @param intent - ResolvedIntent from the intent resolver pipeline
 * @param config - CTA render-time configuration (product context)
 * @param experimentId - Optional experiment identifier for A/B tracking
 * @returns AdaptiveCTAResponse with selected variant and metadata
 */
export function selectVariant(
  intent: ResolvedIntent,
  config: CTAConfig,
  experimentId?: string,
): AdaptiveCTAResponse {
  const { category, confidence } = intent
  const resolvedAt = new Date().toISOString()

  // ── Low-confidence fallback ──────────────────────────────────────────────
  if (confidence < MIN_CONFIDENCE) {
    return buildResponse(category, DEFAULT_VARIANT, confidence, {
      experimentId,
      poolName: 'default-fallback',
      resolvedAt,
    })
  }

  // ── Look up variant pool ─────────────────────────────────────────────────
  const pool = VARIANT_POOLS[category]

  if (!pool || pool.length === 0) {
    return buildResponse(category, DEFAULT_VARIANT, confidence, {
      experimentId,
      poolName: 'unknown-category',
      resolvedAt,
    })
  }

  // ── Deterministic A/B split with cooldown ────────────────────────────────
  const sessionId = deriveSessionId(config, experimentId)
  const bucket = getCooldownBucket()

  // Cooldown key includes the time bucket so the variant is stable
  // within each 30-second window for the same session + intent combo
  const cooldownKey = `${sessionId}:${category}:${bucket}`
  const variantIndex = assignVariant(cooldownKey, experimentId ?? 'default', pool.length)
  const variantName = pool[variantIndex] ?? DEFAULT_VARIANT

  // ── Build response ───────────────────────────────────────────────────────
  return buildResponse(category, variantName, confidence, {
    experimentId,
    poolName: category,
    resolvedAt,
  })
}
