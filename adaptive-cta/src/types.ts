/**
 * Adaptive CTA Engine — Types
 *
 * Type definitions for the intent-driven CTA system.
 * Part of @fluxxis/adaptive-cta — a monetizable e-commerce plugin (Shopify + WooCommerce).
 */

/**
 * User intent categories detected from browsing behavior.
 * Mirrors the Fluxxis MorphStage Intent type for interoperability.
 */
export type Intent = 'browse' | 'buy' | 'compare' | 'learn'

/**
 * Visual variant of a CTA button.
 * Determines background, text color, optional icon, and subtext.
 */
export interface CTAVariant {
  /** Button label text */
  text: string
  /** Background color (CSS value) */
  color: string
  /** Foreground/text color (CSS value) */
  textColor: string
  /** Optional secondary text displayed below the main label */
  subtext?: string
  /** Emoji icon displayed before the label */
  icon?: string
}

/**
 * Style variant for the button shell.
 */
export type CTAVariantStyle = 'primary' | 'secondary' | 'inline'

/**
 * Configuration passed to SmartCTA at render time.
 */
export interface CTAConfig {
  /** Detected user intent (required) */
  intent: Intent
  /** Product identifier for tracking */
  productId?: string
  /** Human-readable product name for dynamic text */
  productName?: string
  /** Product price (used in buy CTA text) */
  price?: number
  /** ISO 4217 currency code (default: EUR) */
  currency?: string
  /** Visual style of the button */
  variant?: CTAVariantStyle
  /** Additional CSS class names */
  className?: string
}

/**
 * Analytics event payload fired by the tracking module.
 */
export interface CTAAnalytics {
  /** Event type */
  event: 'cta_impression' | 'cta_click' | 'cta_conversion'
  /** Intent at time of event */
  intent: Intent
  /** Product ID if available */
  productId?: string
  /** Product name if available */
  productName?: string
  /** ISO timestamp */
  timestamp: string
  /** Optional metadata (e.g. page URL, referrer) */
  metadata?: Record<string, string>
}

/**
 * Props for the SmartCTA React component.
 */
export interface SmartCTAProps {
  /** Detected user intent (required) */
  intent: Intent
  /** Product identifier for tracking */
  productId?: string
  /** Human-readable product name for dynamic text */
  productName?: string
  /** Product price (used in buy CTA text) */
  price?: number
  /** ISO 4217 currency code (default: '€') */
  currency?: string
  /** Callback fired on click, receives the current intent */
  onCTAClick?: (intent: Intent) => void
  /** Visual style of the button */
  variant?: CTAVariantStyle
  /** Additional CSS class names */
  className?: string
}

/**
 * Design-system adapter interface.
 * Implementations map intent → platform-specific tokens.
 */
export interface DSAdapter {
  /** Resolve a CSS class or style object for the given intent + variant */
  resolveClass(intent: Intent, variant: CTAVariantStyle): string
  /** Return the CSS custom property definitions */
  getTokenCSS(): string
}

// ── Intent Resolver v2 Types ─────────────────────────────────────────────────

/**
 * Behavioral intent categories produced by the signal processing engine.
 * These are richer than the legacy 'Intent' type and represent the user's
 * current shopping phase based on behavioral signals.
 */
export type IntentCategory =
  | 'browsing'
  | 'hesitating'
  | 'ready-to-buy'
  | 'returning'
  | 'researching'

/**
 * A behavioral signal collected from the user's browsing session.
 * Each signal contributes evidence toward a particular intent category.
 */
export interface IntentSignal {
  /** Time spent on the current page in milliseconds */
  timeOnPage?: number
  /** Scroll depth as a fraction of total page height (0-1) */
  scrollDepth?: number
  /** Mouse movement velocity in pixels per millisecond */
  mouseVelocity?: number
  /** Number of return visits (0 = first visit) */
  returnVisitCount?: number
  /** Current cart value in euros (0 = empty cart) */
  cartValue?: number
  /** Type of page the user is currently on */
  pageType?: 'product' | 'cart' | 'checkout' | 'blog' | 'unknown'
}

/**
 * The result of intent resolution, combining the predicted category
 * with a confidence score and metadata for auditing/debugging.
 */
export interface ResolvedIntent {
  /** The predicted intent category */
  category: IntentCategory
  /** Confidence score (0-1), values ≥ 0.6 are considered actionable */
  confidence: number
  /** List of rule IDs that fired during resolution (for auditability) */
  firedRules: string[]
  /** Timestamp of resolution (ISO 8601) */
  resolvedAt: string
  /** Map of active signals used in resolution */
  signals: IntentSignal
}

/**
 * Strategy interface for intent resolution.
 * Default implementation uses rule-based engine; can be swapped
 * for ML-based resolver without changing consumers.
 */
export interface IntentResolverStrategy {
  resolve(signals: IntentSignal): ResolvedIntent
}
