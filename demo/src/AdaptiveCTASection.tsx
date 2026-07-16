/**
 * AdaptiveCTASection — Showcase do Adaptive CTA Engine na landing page.
 *
 * Demonstra os 4 intents (browse, buy, compare, learn) lado a lado,
 * com alternador de variantes (primary, secondary, inline) e
 * indicador de tracking (impression/click via console).
 *
 * Integração do Adaptive CTA Engine (PR #21) na Fluxxis Landing.
 */

import React, { useState } from 'react'
import { SmartCTA, ALL_INTENTS, resolveCTA } from '@fluxxis/adaptive-cta'
import type { Intent, CTAVariantStyle } from '@fluxxis/adaptive-cta'
import { PALETTE, sectionHeading, sectionSubheading, INTENT_COLORS, card } from './shared'

// ── Producto de exemplo ─────────────────────────────────────────────────────

const SAMPLE_PRODUCT = { id: 'flux-001', name: 'Fluxxis Pro', price: 29.99 }

// ── Variant labels ───────────────────────────────────────────────────────────

const VARIANT_LABELS: { value: CTAVariantStyle; label: string }[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'inline', label: 'Inline' },
]

// ── Component ────────────────────────────────────────────────────────────────

const AdaptiveCTASection: React.FC = () => {
  const [variant, setVariant] = useState<CTAVariantStyle>('primary')
  const [lastClick, setLastClick] = useState<string | null>(null)

  const handleClick = (intent: Intent) => {
    const cta = resolveCTA(intent)
    setLastClick(`🖱️ ${cta.icon} "${cta.text}" (${intent}) — ${new Date().toLocaleTimeString('pt-PT')}`)
  }

  return (
    <section
      id="adaptive-cta"
      style={{ marginTop: 'clamp(40px, 8vw, 80px)', paddingTop: 'clamp(24px, 4vw, 48px)' }}
    >
      {/* ── Heading ─────────────────────────────────────────── */}
      <h2 style={sectionHeading}>
        🎯 Adaptive CTA Engine
      </h2>
      <p style={sectionSubheading}>
        CTAs inteligentes que adaptam texto, cor e ícone com base na intenção do
        utilizador. SaaS-ready — Shopify + WooCommerce.
      </p>

      {/* ── Variant Selector ───────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: 'clamp(24px, 3vw, 36px)',
          flexWrap: 'wrap',
        }}
        role="radiogroup"
        aria-label="Estilo do botão CTA"
      >
        {VARIANT_LABELS.map(({ value, label }) => (
          <button
            key={value}
            role="radio"
            aria-checked={variant === value}
            onClick={() => setVariant(value)}
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: variant === value
                ? `2px solid ${PALETTE.violet}`
                : `1px solid ${PALETTE.cardBorder}`,
              background: variant === value
                ? `${PALETTE.violet}20`
                : PALETTE.cardBg,
              color: variant === value
                ? PALETTE.violet
                : PALETTE.textSecondary,
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              if (variant !== value) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = PALETTE.violet + '60'
              }
            }}
            onMouseOut={(e) => {
              if (variant !== value) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = PALETTE.cardBorder
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Intent Grid (mobile + desktop) ─────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'clamp(16px, 2vw, 24px)',
          marginBottom: '24px',
        }}
      >
        {ALL_INTENTS.map((intent) => {
          const ctaVariant = resolveCTA(intent)
          const intentColor = INTENT_COLORS[intent] || PALETTE.violet

          return (
            <div
              key={intent}
              style={{
                ...card,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                padding: 'clamp(20px, 3vw, 28px)',
                textAlign: 'center',
              }}
            >
              {/* Intent label */}
              <span
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: intentColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: `${intentColor}15`,
                  border: `1px solid ${intentColor}30`,
                }}
              >
                {ctaVariant.icon} {intent}
              </span>

              {/* SmartCTA component */}
              <SmartCTA
                intent={intent}
                productId={SAMPLE_PRODUCT.id}
                productName={SAMPLE_PRODUCT.name}
                price={SAMPLE_PRODUCT.price}
                variant={variant}
                onCTAClick={handleClick}
              />

              {/* Description */}
              <p
                style={{
                  fontSize: '0.78rem',
                  color: PALETTE.textMuted,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {intent === 'browse' && 'Visitantes que exploram o catálogo sem urgência de compra.'}
                {intent === 'buy' && 'Compradores prontos para finalizar — alta intenção de compra.'}
                {intent === 'compare' && 'Utilizadores que avaliam opções antes de decidir.'}
                {intent === 'learn' && 'Visitantes que procuram informação antes de considerar comprar.'}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── Tracking Indicator ──────────────────────────────── */}
      <div
        style={{
          textAlign: 'center',
          padding: '16px 24px',
          borderRadius: '12px',
          background: `${PALETTE.cyan}08`,
          border: `1px solid ${PALETTE.cyan}20`,
          fontSize: '0.82rem',
          color: lastClick ? PALETTE.cyan : PALETTE.textMuted,
          fontFamily: 'Sora, sans-serif',
          fontWeight: 500,
          transition: 'color 0.3s',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '1rem' }}>📊</span>
        {lastClick || 'Clique num CTA para ver o evento de tracking →'}
      </div>

      {/* ── Feature Tags ────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginTop: 'clamp(24px, 3vw, 32px)',
        }}
      >
        {[
          { text: 'WCAG 2.1 AA', color: PALETTE.cyan },
          { text: '4 intents', color: PALETTE.violet },
          { text: 'noscript fallback', color: PALETTE.amber },
          { text: 'Shopify + WooCommerce', color: PALETTE.pink },
          { text: 'Tracking built-in', color: PALETTE.cyan },
          { text: 'SaaS €29/mês', color: PALETTE.violet },
        ].map(({ text, color }) => (
          <span
            key={text}
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 600,
              color,
              padding: '4px 12px',
              borderRadius: '9999px',
              background: `${color}12`,
              border: `1px solid ${color}25`,
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  )
}

export default AdaptiveCTASection
