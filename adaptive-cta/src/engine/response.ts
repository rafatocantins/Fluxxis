/**
 * Response Builder — Constructs AdaptiveCTAResponse objects.
 *
 * Single-purpose utility consumed by the variant engine.
 * Ensures consistent response shape across all variant selection paths.
 *
 * Part of @fluxxis/adaptive-cta — A/B Variant Engine
 */

import type { IntentCategory, AdaptiveCTAResponse, VariantName } from '../types'

/**
 * Build a standardized AdaptiveCTAResponse.
 *
 * @param category - The resolved intent category
 * @param variantName - The selected variant name
 * @param confidence - Confidence score from the intent resolver (0-1)
 * @param metadata - Optional metadata override (experimentId, poolName, resolvedAt)
 * @returns A fully-formed AdaptiveCTAResponse
 */
export function buildResponse(
  category: IntentCategory,
  variantName: VariantName,
  confidence: number,
  metadata?: {
    experimentId?: string
    poolName: string
    resolvedAt: string
  },
): AdaptiveCTAResponse {
  return {
    variant: variantName,
    intent: category,
    confidence: Math.round(confidence * 1000) / 1000,
    metadata: {
      experimentId: metadata?.experimentId,
      poolName: metadata?.poolName ?? '',
      resolvedAt: metadata?.resolvedAt ?? new Date().toISOString(),
    },
  }
}
