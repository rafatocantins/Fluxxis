/**
 * Intent Resolver — Lightweight intent detection for e-commerce.
 *
 * Reuses the same Intent taxonomy as Fluxxis core (browse | buy | compare | learn)
 * but provides a standalone, dependency-free implementation suitable for
 * Shopify script-tags and WooCommerce plugin contexts.
 */

import type { Intent } from './types'

// ── Intent → CTA Variant Mapping ────────────────────────────────────────────

/**
 * Predefined CTA variants for each intent.
 * Colors use Fluxxis v2.0 design tokens mapped to their raw hex values
 * for environments where CSS custom properties are not available.
 */
export const CTA_MAP: Record<Intent, import('./types').CTAVariant> = {
  browse: {
    text: 'Explorar Produtos',
    color: '#2EE6D6',       // --flux-cyan
    textColor: '#0a0a1a',   // dark, WCAG AA on cyan
    icon: '🔍',
  },
  buy: {
    text: 'Comprar Agora',
    color: '#FF5C9D',       // --flux-pink
    textColor: '#ffffff',   // white, WCAG AA on pink
    icon: '🛒',
    subtext: 'Frete Grátis',
  },
  compare: {
    text: 'Comparar Modelos',
    color: '#FFB454',       // --flux-amber
    textColor: '#0a0a1a',   // dark, WCAG AA on amber
    icon: '⚖️',
  },
  learn: {
    text: 'Saber Mais',
    color: '#8B6DFF',       // --flux-violet
    textColor: '#ffffff',   // white, WCAG AA on violet
    icon: '📚',
  },
}

// ── Contextual Resolvers ────────────────────────────────────────────────────

/**
 * Resolve the CTA variant for a given intent, with optional price interpolation.
 *
 * When `price` is provided for 'buy' intent, it is injected into the button text.
 * Example: "Comprar Agora — 29,99 €"
 */
export function resolveCTA(intent: Intent, price?: number, currency?: string): import('./types').CTAVariant {
  const variant = { ...CTA_MAP[intent] }

  if (intent === 'buy' && price !== undefined) {
    const curr = currency || '€'
    const formatted = new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: curr === '€' ? 'EUR' : curr,
    }).format(price)
    variant.text = `Comprar Agora — ${formatted}`
  }

  return variant
}

/**
 * Heuristic intent detection from URL pathname or page context.
 * Returns a best-guess intent for pages that haven't gone through
 * the full Fluxxis behavior pipeline.
 *
 * Rules (in priority order):
 *   /cart, /checkout         → buy
 *   /product/, /products/    → browse
 *   /compare                 → compare
 *   /blog, /guides, /learn   → learn
 *   fallback                 → browse
 */
export function detectIntentFromURL(pathname: string): Intent {
  const p = pathname.toLowerCase()

  if (/\/cart|\/checkout|\/carrinho|\/finalizar/.test(p)) return 'buy'
  if (/\/compare|\/comparar/.test(p)) return 'compare'
  if (/\/blog|\/guides|\/learn|\/guia|\/aprender/.test(p)) return 'learn'
  if (/\/product|\/products|\/produto|\/produtos/.test(p)) return 'browse'

  // Default: assume browsing
  return 'browse'
}

/**
 * All supported intents as an array (useful for iteration).
 */
export const ALL_INTENTS: Intent[] = ['browse', 'buy', 'compare', 'learn']
