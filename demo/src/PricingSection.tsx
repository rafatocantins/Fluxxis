/**
 * PricingSection — Fluxxis Adaptive CTA Engine pricing.
 *
 * Fluxxis v2.0 dark theme, WCAG 2.1 AA compliant.
 * Single plan: €29/mês with 8 features.
 */
import React from 'react'

// ── Feature list ─────────────────────────────────────────────────────────────

const FEATURES = [
  'Smart CTAs with intent detection',
  'Shopify & WooCommerce plugin included',
  'A/B testing built-in',
  'Real-time intent detection engine',
  'MorphStage™ adaptive layouts',
  'Unlimited morph variants',
  'Analytics dashboard',
  'Email support (Slack for Pro)',
]

// ── Component ────────────────────────────────────────────────────────────────

const PricingSection: React.FC = () => {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      style={{
        position: 'relative',
        zIndex: 1,
        padding: 'var(--fx-space-20, 5rem) 0 var(--fx-space-24, 6rem)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 'var(--fx-max-width, 1200px)',
          margin: '0 auto',
          padding: '0 var(--fx-space-6, 1.5rem)',
        }}
      >
        {/* ── Section Header ────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--fx-space-12, 3rem)' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: 'var(--fx-font-size-xs, 0.75rem)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--fx-accent-primary, #00d4aa)',
              marginBottom: 'var(--fx-space-3, 0.75rem)',
            }}
          >
            Pricing
          </span>
          <h2
            id="pricing-title"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, var(--fx-font-size-4xl, 2.75rem))',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: 'var(--fx-space-4, 1rem)',
            }}
          >
            Adaptive CTA Engine
          </h2>
          <p
            style={{
              fontSize: 'var(--fx-font-size-lg, 1.125rem)',
              color: 'var(--fx-text-secondary, #b0b0c0)',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            Smart CTAs that adapt to user intent. One simple plan with everything included.
          </p>
        </div>

        {/* ── Pricing Card ──────────────────────────────────── */}
        <div
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            background: 'var(--fx-bg-secondary, #0e0e18)',
            border: '1px solid var(--fx-border-strong, rgba(255,255,255,0.14))',
            borderRadius: 'var(--fx-radius-xl, 20px)',
            padding: 'var(--fx-space-8, 2rem)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color var(--fx-transition-base, 200ms ease), box-shadow var(--fx-transition-base, 200ms ease)',
          }}
          onMouseOver={(e) => {
            const el = e.currentTarget as HTMLDivElement
            el.style.borderColor = 'var(--fx-border-accent, rgba(0,212,170,0.35))'
            el.style.boxShadow = 'var(--fx-shadow-glow, 0 0 40px rgba(0,212,170,0.28))'
          }}
          onMouseOut={(e) => {
            const el = e.currentTarget as HTMLDivElement
            el.style.borderColor = 'var(--fx-border-strong, rgba(255,255,255,0.14))'
            el.style.boxShadow = 'none'
          }}
        >
          {/* Top accent bar */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background:
                'linear-gradient(90deg, var(--fx-accent-primary, #00d4aa), var(--fx-accent-secondary, #22d3ee))',
            }}
          />

          {/* Badge */}
          <span
            style={{
              display: 'inline-block',
              padding: 'var(--fx-space-1, 0.25rem) var(--fx-space-3, 0.75rem)',
              background: 'var(--fx-accent-soft, rgba(0,212,170,0.10))',
              border: '1px solid var(--fx-border-accent, rgba(0,212,170,0.35))',
              borderRadius: 'var(--fx-radius-full, 9999px)',
              fontSize: 'var(--fx-font-size-xs, 0.75rem)',
              fontWeight: 600,
              color: 'var(--fx-accent-primary, #00d4aa)',
              marginBottom: 'var(--fx-space-5, 1.25rem)',
            }}
          >
            Most Popular
          </span>

          {/* Plan name */}
          <h3
            style={{
              fontSize: 'var(--fx-font-size-2xl, 1.5rem)',
              fontWeight: 700,
              marginBottom: 'var(--fx-space-4, 1rem)',
            }}
          >
            Adaptive CTA Engine
          </h3>

          {/* Price */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--fx-space-2, 0.5rem)',
              marginBottom: 'var(--fx-space-6, 1.5rem)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--fx-font-size-5xl, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1,
                color: 'var(--fx-accent-primary, #00d4aa)',
              }}
            >
              €29
            </span>
            <span
              style={{
                fontSize: 'var(--fx-font-size-lg, 1.125rem)',
                color: 'var(--fx-text-secondary, #b0b0c0)',
              }}
            >
              /mês
            </span>
          </div>

          {/* Features */}
          <ul
            style={{
              listStyle: 'none',
              marginBottom: 'var(--fx-space-8, 2rem)',
            }}
          >
            {FEATURES.map((feature) => (
              <li
                key={feature}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--fx-space-3, 0.75rem)',
                  padding: 'var(--fx-space-2, 0.5rem) 0',
                  fontSize: 'var(--fx-font-size-sm, 0.875rem)',
                  color: 'var(--fx-text-secondary, #b0b0c0)',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    color: 'var(--fx-accent-primary, #00d4aa)',
                    fontWeight: 700,
                    fontSize: 'var(--fx-font-size-sm, 0.875rem)',
                  }}
                  aria-hidden="true"
                >
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button
            onClick={() => {
              window.open('https://fluxxis.dev/adaptive-cta', '_blank', 'noopener')
            }}
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              padding: 'var(--fx-space-4, 1rem) var(--fx-space-8, 2rem)',
              background: 'var(--fx-accent-primary, #00d4aa)',
              color: 'var(--fx-text-inverse, #08080f)',
              borderRadius: 'var(--fx-radius-full, 9999px)',
              fontWeight: 700,
              fontSize: 'var(--fx-font-size-base, 1rem)',
              transition: 'all var(--fx-transition-base, 200ms ease)',
              boxShadow: '0 0 20px rgba(0, 212, 170, 0.25)',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = '#00e8bb'
              el.style.boxShadow = '0 0 36px rgba(0, 212, 170, 0.5)'
              el.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'var(--fx-accent-primary, #00d4aa)'
              el.style.boxShadow = '0 0 20px rgba(0, 212, 170, 0.25)'
              el.style.transform = 'translateY(0)'
            }}
          >
            Start Free Trial →
          </button>

          {/* Guarantee */}
          <p
            style={{
              textAlign: 'center',
              marginTop: 'var(--fx-space-4, 1rem)',
              fontSize: 'var(--fx-font-size-xs, 0.75rem)',
              color: 'var(--fx-text-tertiary, #787890)',
            }}
          >
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
