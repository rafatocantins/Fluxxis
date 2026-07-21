/**
 * DS Adapter — Design System Adapter for multi-platform support.
 *
 * Translates Fluxxis v2.0 design tokens into platform-specific class names
 * and style mappings for Shopify Polaris, WooCommerce, and vanilla CSS.
 *
 * All adapters use the same Intent taxonomy and produce WCAG 2.1 AA-compliant output.
 */

import type { DSAdapter, Intent, CTAVariantStyle } from './types'

// ── Fluxxis Native (CSS Custom Properties) ──────────────────────────────────

/**
 * Default adapter that uses Fluxxis v2.0 CSS custom properties.
 * Requires the tokens.css stylesheet to be loaded on the page.
 */
class FluxxisAdapter implements DSAdapter {
  resolveClass(intent: Intent, variant: CTAVariantStyle): string {
    const classes = ['flux-cta']

    // Intent class
    classes.push(`flux-cta--${intent}`)

    // Variant class
    classes.push(`flux-cta--${variant}`)

    return classes.join(' ')
  }

  getTokenCSS(): string {
    return `
      .flux-cta {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: var(--flux-radius-lg);
        font-family: var(--flux-font-display);
        font-weight: 700;
        font-size: 0.9375rem;
        border: none;
        cursor: pointer;
        text-decoration: none;
        transition: all var(--flux-duration-normal) var(--flux-easing-standard);
        position: relative;
        overflow: hidden;
      }
      .flux-cta:focus-visible {
        outline: 3px solid var(--flux-cyan);
        outline-offset: 2px;
      }
      .flux-cta:hover {
        transform: translateY(-1px);
      }
      .flux-cta:active {
        transform: translateY(0) scale(0.98);
      }
      .flux-cta--browse {
        background: var(--flux-cyan);
        color: #0a0a1a;
        box-shadow: var(--flux-glow-cyan);
      }
      .flux-cta--buy {
        background: var(--flux-pink);
        color: #ffffff;
        box-shadow: var(--flux-glow-pink);
      }
      .flux-cta--compare {
        background: var(--flux-amber);
        color: #0a0a1a;
        box-shadow: var(--flux-glow-amber);
      }
      .flux-cta--learn {
        background: var(--flux-violet);
        color: #ffffff;
        box-shadow: var(--flux-glow-violet);
      }
      .flux-cta--secondary {
        background: transparent;
        border: 2px solid currentColor;
        box-shadow: none;
        color: inherit;
      }
      .flux-cta--inline {
        background: transparent;
        box-shadow: none;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }
      .flux-cta__subtext {
        display: block;
        font-size: 0.75rem;
        font-weight: 400;
        opacity: 0.85;
        margin-top: 0.125rem;
      }
      @media (prefers-reduced-motion: reduce) {
        .flux-cta { transition: none; }
        .flux-cta:hover, .flux-cta:active { transform: none; }
      }
    `
  }
}

// ── Shopify Polaris Adapter ─────────────────────────────────────────────────

/**
 * Shopify Polaris adapter — outputs Polaris-compatible class names.
 */
class ShopifyPolarisAdapter implements DSAdapter {
  resolveClass(intent: Intent, variant: CTAVariantStyle): string {
    const classes = ['Polaris-Button', 'flux-cta']

    // Map variant to Polaris button variants
    if (variant === 'primary') classes.push('Polaris-Button--primary')
    else if (variant === 'secondary') classes.push('Polaris-Button--outline')
    else classes.push('Polaris-Button--plain')

    // Intent class for custom CSS overrides
    classes.push(`flux-cta--${intent}`)

    return classes.join(' ')
  }

  getTokenCSS(): string {
    return `
      .flux-cta--browse.Polaris-Button--primary {
        --pc-button-color: #0a0a1a;
        --pc-button-color-hover: #0a0a1a;
        --pc-button-color-active: #0a0a1a;
        background: var(--flux-cyan, #1FA89E);
        box-shadow: 0 0 20px rgba(46, 230, 214, 0.4);
      }
      .flux-cta--buy.Polaris-Button--primary {
        background: var(--flux-pink, #C84074);
        box-shadow: 0 0 20px rgba(255, 92, 157, 0.4);
      }
      .flux-cta--compare.Polaris-Button--primary {
        --pc-button-color: #0a0a1a;
        background: var(--flux-amber, #D4912E);
        box-shadow: 0 0 20px rgba(255, 180, 84, 0.4);
      }
      .flux-cta--learn.Polaris-Button--primary {
        background: var(--flux-violet, #6D4FE0);
        box-shadow: 0 0 20px rgba(139, 109, 255, 0.4);
      }
    `
  }
}

// ── WooCommerce Adapter ─────────────────────────────────────────────────────

/**
 * WooCommerce adapter — outputs Storefront-compatible class names.
 */
class WooCommerceAdapter implements DSAdapter {
  resolveClass(intent: Intent, variant: CTAVariantStyle): string {
    const classes = ['button', 'flux-cta']

    // WooCommerce uses .button + .alt for outline style
    if (variant === 'secondary') classes.push('alt')

    classes.push(`flux-cta--${intent}`)

    return classes.join(' ')
  }

  getTokenCSS(): string {
    // WooCommerce adapter reuses Fluxxis native token CSS
    return new FluxxisAdapter().getTokenCSS()
  }
}

// ── Adapter Registry ────────────────────────────────────────────────────────

const adapters: Record<string, DSAdapter> = {
  fluxxis: new FluxxisAdapter(),
  shopify: new ShopifyPolarisAdapter(),
  woocommerce: new WooCommerceAdapter(),
}

/**
 * Get a DS adapter by platform name.
 *
 * @param platform - 'fluxxis' | 'shopify' | 'woocommerce'
 * @returns The platform-specific DSAdapter instance
 */
export function getAdapter(platform: 'fluxxis' | 'shopify' | 'woocommerce' = 'fluxxis'): DSAdapter {
  return adapters[platform]!
}

export { FluxxisAdapter, ShopifyPolarisAdapter, WooCommerceAdapter }
