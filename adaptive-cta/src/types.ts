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
