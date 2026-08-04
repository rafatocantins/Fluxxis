/**
 * CTA Configuration — Shopify Script Tag
 *
 * Type definitions for the rendered CTA button config.
 * Maps AdaptiveCTAResponse variant names to visual properties
 * consumed by the DOM renderer in script-tag.js.
 *
 * Part of @fluxxis/adaptive-cta — Shopify v2 Pipeline
 */

/**
 * Visual configuration for a rendered CTA button.
 */
export interface CTARenderConfig {
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
 * Default CTA configuration used as fallback when the UMD engine
 * is unavailable or confidence is too low.
 */
export const DEFAULT_CTA: CTARenderConfig = {
  text: 'Explorar Produtos',
  color: '#2EE6D6',
  textColor: '#0a0a1a',
  icon: '🔍',
}

/**
 * Visual mappings from variant names to render configurations.
 *
 * Maps the variant names produced by the A/B variant engine
 * (e.g., 'subtle-highlight', 'direct-cta') to their visual
 * properties for DOM rendering.
 *
 * Groups variants by intent category for easy lookup.
 */
export const VARIANT_RENDER_MAP: Record<string, CTARenderConfig> = {
  // ── Browsing variants ──────────────────────────────────────────────
  'subtle-highlight': {
    text: 'Explorar Produtos',
    color: '#2EE6D6',
    textColor: '#0a0a1a',
    icon: '🔍',
  },
  'category-explorer': {
    text: 'Ver Categorias',
    color: '#3DD9C9',
    textColor: '#0a0a1a',
    icon: '📂',
  },

  // ── Hesitating variants ────────────────────────────────────────────
  'social-proof': {
    text: 'Mais Vendido',
    color: '#FF5C9D',
    textColor: '#ffffff',
    icon: '⭐',
    subtext: 'Recomendado por outros clientes',
  },
  'urgency-nudge': {
    text: 'Últimas Unidades',
    color: '#FF3B6E',
    textColor: '#ffffff',
    icon: '⚡',
    subtext: 'Estoque limitado',
  },

  // ── Ready-to-buy variants ──────────────────────────────────────────
  'direct-cta': {
    text: 'Comprar Agora',
    color: '#FF5C9D',
    textColor: '#ffffff',
    icon: '🛒',
    subtext: 'Frete Grátis',
  },
  'scarcity-alert': {
    text: 'Garantir o Meu',
    color: '#E8457A',
    textColor: '#ffffff',
    icon: '🔥',
    subtext: 'Oferta por tempo limitado',
  },

  // ── Returning variants ─────────────────────────────────────────────
  'welcome-back': {
    text: 'Bem-vindo de Volta',
    color: '#8B6DFF',
    textColor: '#ffffff',
    icon: '👋',
    subtext: 'Continue de onde parou',
  },
  'personalized-recommendation': {
    text: 'Recomendado para Si',
    color: '#7B5DE6',
    textColor: '#ffffff',
    icon: '🎯',
  },

  // ── Researching variants ───────────────────────────────────────────
  'comparison-table': {
    text: 'Comparar Modelos',
    color: '#FFB454',
    textColor: '#0a0a1a',
    icon: '⚖️',
  },
  'detailed-specs': {
    text: 'Ver Especificações',
    color: '#FFA033',
    textColor: '#0a0a1a',
    icon: '📋',
  },

  // ── Default / Fallback ─────────────────────────────────────────────
  default: {
    text: 'Explorar Produtos',
    color: '#2EE6D6',
    textColor: '#0a0a1a',
    icon: '🔍',
  },
}

/**
 * Resolve visual CTA config from a variant name.
 *
 * Falls back to DEFAULT_CTA if the variant name is not found in the map.
 *
 * @param variantName - The variant name from AdaptiveCTAResponse
 * @returns CTARenderConfig with visual properties
 */
export function resolveCTARenderConfig(variantName: string): CTARenderConfig {
  return VARIANT_RENDER_MAP[variantName] ?? DEFAULT_CTA
}
