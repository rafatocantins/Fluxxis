/// <reference types="vite/client" />
/**
 * PricingSection — Fluxxis Adaptive CTA Engine pricing.
 *
 * Fluxxis v2.1 dark theme, WCAG 2.1 AA compliant.
 * Two-tier plans (Free + Pro) + Early Access flow + integration footer.
 * Responsive (mobile-first), inline styles, no external deps.
 */
import React, { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

interface Feature {
  label: string
}

interface Plan {
  name: string
  description: string
  price: string
  period: string
  features: Feature[]
  cta: string
  featured?: boolean
  featuredBadge?: string
}

// ── Feature check icon (WCAG: decorative, aria-hidden) ───────────────────────

const CheckIcon: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flexShrink: 0, marginTop: 1 }}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// ── Plan data ────────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
  {
    name: 'Free',
    description: 'Para testar e validar o conceito.',
    price: '0€',
    period: '/mês',
    features: [
      { label: 'Até 5.000 impressões/mês' },
      { label: '3 variantes de CTA' },
      { label: 'Adaptação por dispositivo' },
      { label: 'Integração 1-click Shopify & WooCommerce' },
      { label: 'Dashboard básico' },
      { label: 'Suporte por email' },
    ],
    cta: 'Começar Grátis',
  },
  {
    name: 'Pro',
    description: 'Para negócios em crescimento que querem escala.',
    price: '29€',
    period: '/mês',
    features: [
      { label: '50.000 impressões/mês' },
      { label: 'Variantes de CTA ilimitadas' },
      { label: 'Analytics avançado com segmentação' },
      { label: 'A/B testing automatizado' },
      { label: 'Adaptação por intenção (AI-powered)' },
      { label: 'Integração 1-click Shopify & WooCommerce' },
      { label: 'Suporte prioritário 24/7' },
      { label: 'API access' },
    ],
    cta: 'Começar Pro',
    featured: true,
    featuredBadge: 'Recomendado',
  },
]

// ── Email validation ─────────────────────────────────────────────────────────

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// ── Component ────────────────────────────────────────────────────────────────

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const PricingSection: React.FC = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setEmailError('Introduza o seu email.')
      return
    }
    if (!isValidEmail(trimmedEmail)) {
      setEmailError('Email inválido. Verifique o formato.')
      return
    }
    setEmailError('')
    setStatus('submitting')

    const endpoint = import.meta.env.VITE_EARLY_ACCESS_ENDPOINT as string | undefined
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 8000)

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: trimmedEmail,
            source: 'fluxxis-landing',
            page: 'pricing',
            ts: new Date().toISOString(),
          }),
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
      } else {
        // Fallback sem endpoint: nunca descartar o lead em silêncio.
        window.location.href = `mailto:early-access@fluxxis.dev?subject=Early%20Access&body=${encodeURIComponent(
          trimmedEmail,
        )}`
      }
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      window.clearTimeout(timeout)
    }
  }

  return (
    <>
      {/*
        Responsive media queries injected once via <style>.
        Inline styles don't support @media natively.
      */}
      <style>{`
        @media (max-width: 768px) {
          .pricing-grid-responsive {
            grid-template-columns: 1fr !important;
            max-width: 400px !important;
          }
          .pricing-card-featured-responsive {
            transform: none !important;
          }
          .pricing-card-featured-responsive:hover {
            transform: none !important;
          }
          .early-access-form-responsive {
            flex-direction: column !important;
          }
          .integration-bar-responsive {
            flex-direction: column !important;
            gap: 0.75rem !important;
            text-align: center !important;
          }
        }
        @media (max-width: 480px) {
          .hero-metrics-responsive {
            gap: 1.5rem !important;
          }
          .pricing-card-responsive {
            padding: 1.75rem 1.25rem !important;
          }
          .early-access-card-responsive {
            padding: 2rem 1.25rem !important;
          }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="pricing-hero-title"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: 'var(--flux-space-20, 5rem) 0 var(--flux-space-12, 3rem)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 'var(--flux-max-width, 1200px)',
            margin: '0 auto',
            padding: '0 var(--flux-space-6, 1.5rem)',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--flux-accent-soft, rgba(31,168,158,0.10))',
              border: '1px solid var(--flux-border-accent, rgba(31,168,158,0.35))',
              color: 'var(--flux-accent-primary, #00d4aa)',
              fontSize: 'var(--flux-font-size-xs, 0.75rem)',
              fontWeight: 600,
              padding: '0.375rem 1rem',
              borderRadius: 'var(--flux-radius-full, 9999px)',
              marginBottom: 'var(--flux-space-6, 1.5rem)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                background: 'var(--flux-accent-primary, #00d4aa)',
                borderRadius: '50%',
                display: 'inline-block',
              }}
            />
            Nova Geração de CTAs
          </div>

          {/* Headline */}
          <h1
            id="pricing-hero-title"
            style={{
              maxWidth: 820,
              margin: '0 auto var(--flux-space-5, 1.25rem)',
              fontSize: 'clamp(1.75rem, 5vw, 3.25rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              color: 'var(--flux-text-primary, #f0f0f5)',
            }}
          >
            CTAs que se adaptam à{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, var(--flux-accent-secondary, #22d3ee) 0%, var(--flux-accent-primary, #00d4aa) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              intenção de cada visitante
            </span>
            . Aumente conversões 15–30%.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              maxWidth: 620,
              margin: '0 auto var(--flux-space-10, 2.5rem)',
              fontSize: 'var(--flux-font-size-lg, 1.125rem)',
              color: 'var(--flux-text-secondary, #b0b0c0)',
              lineHeight: 1.7,
            }}
          >
            O Adaptive CTA analisa comportamento em tempo real e serve o call-to-action certo,
            no momento certo, para cada segmento de audiência. Sem A/B testing manual. Sem guesswork.
          </p>

          {/* Hero metrics */}
          <div
            className="hero-metrics-responsive"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              marginTop: 'var(--flux-space-12, 3rem)',
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '+23%', label: 'Avg. Conversion Lift' },
              { value: '<50ms', label: 'Decision Latency' },
              { value: '1-click', label: 'Shopify/Woo Integration' },
            ].map((m) => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'var(--flux-text-primary, #f0f0f5)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                    color: 'var(--flux-text-tertiary, #787890)',
                    fontWeight: 500,
                    marginTop: '0.25rem',
                  }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PRICING CARDS
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="pricing"
        aria-labelledby="pricing-title"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: 'var(--flux-space-12, 3rem) 0 var(--flux-space-24, 6rem)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 'var(--flux-max-width, 1200px)',
            margin: '0 auto',
            padding: '0 var(--flux-space-6, 1.5rem)',
          }}
        >
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--flux-space-12, 3rem)' }}>
            <h2
              id="pricing-title"
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: 'var(--flux-text-primary, #f0f0f5)',
                marginBottom: 'var(--flux-space-3, 0.75rem)',
              }}
            >
              Planos simples e transparentes
            </h2>
            <p
              style={{
                maxWidth: 500,
                margin: '0 auto',
                fontSize: 'var(--flux-font-size-base, 1rem)',
                color: 'var(--flux-text-secondary, #b0b0c0)',
              }}
            >
              Comece grátis. Escale quando precisar. Cancele a qualquer momento.
            </p>
          </div>

          {/* Card grid */}
          <div
            className="pricing-grid-responsive"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 'var(--flux-space-6, 1.5rem)',
              maxWidth: 880,
              margin: '0 auto',
              alignItems: 'start',
            }}
          >
            {PLANS.map((plan) => {
              const isFeatured = plan.featured
              return (
                <div
                  key={plan.name}
                  className={`pricing-card-responsive${isFeatured ? ' pricing-card-featured-responsive' : ''}`}
                  style={{
                    background: isFeatured
                      ? 'var(--flux-bg-elevated, #1a1a2e)'
                      : 'var(--flux-bg-secondary, #0d0d1a)',
                    border: isFeatured
                      ? '1px solid var(--flux-accent-secondary, #22d3ee)'
                      : '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
                    borderRadius: 'var(--flux-radius-xl, 20px)',
                    padding: 'var(--flux-space-8, 2.25rem) var(--flux-space-8, 2rem)',
                    position: 'relative',
                    transition: 'all var(--flux-transition-base, 200ms ease)',
                    transform: isFeatured ? 'scale(1.03)' : undefined,
                    boxShadow: isFeatured
                      ? '0 0 30px rgba(109, 79, 224, 0.2)'
                      : undefined,
                  }}
                  onMouseOver={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    if (isFeatured) {
                      el.style.transform = 'scale(1.04)'
                      el.style.borderColor = 'var(--flux-accent-secondary, #22d3ee)'
                      el.style.boxShadow = '0 0 40px rgba(109, 79, 224, 0.3)'
                    } else {
                      el.style.borderColor = 'var(--flux-border-strong, rgba(255,255,255,0.14))'
                      el.style.background = 'var(--flux-bg-elevated, #1a1a2e)'
                    }
                  }}
                  onMouseOut={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    if (isFeatured) {
                      el.style.transform = 'scale(1.03)'
                      el.style.borderColor = 'var(--flux-accent-secondary, #22d3ee)'
                      el.style.boxShadow = '0 0 30px rgba(109, 79, 224, 0.2)'
                    } else {
                      el.style.borderColor = 'var(--flux-border-default, rgba(255,255,255,0.08))'
                      el.style.background = 'var(--flux-bg-secondary, #0d0d1a)'
                    }
                  }}
                >
                  {/* Featured badge */}
                  {isFeatured && plan.featuredBadge && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -14,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background:
                          'linear-gradient(135deg, var(--flux-accent-secondary, #22d3ee) 0%, var(--flux-accent-primary, #00d4aa) 100%)',
                        color: '#fff',
                        fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                        fontWeight: 700,
                        padding: '0.3rem 1.25rem',
                        borderRadius: 'var(--flux-radius-full, 9999px)',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {plan.featuredBadge}
                    </div>
                  )}

                  {/* Plan name */}
                  <h3
                    style={{
                      fontSize: 'var(--flux-font-size-xl, 1.25rem)',
                      fontWeight: 700,
                      color: 'var(--flux-text-primary, #f0f0f5)',
                      marginBottom: 'var(--flux-space-2, 0.5rem)',
                    }}
                  >
                    {plan.name}
                  </h3>

                  {/* Plan description */}
                  <p
                    style={{
                      fontSize: 'var(--flux-font-size-sm, 0.875rem)',
                      color: 'var(--flux-text-tertiary, #787890)',
                      marginBottom: 'var(--flux-space-8, 2rem)',
                    }}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 'var(--flux-space-1, 0.25rem)',
                      marginBottom: 'var(--flux-space-8, 2rem)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                        color: isFeatured
                          ? 'var(--flux-accent-secondary, #22d3ee)'
                          : 'var(--flux-text-primary, #f0f0f5)',
                      }}
                    >
                      {plan.price}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--flux-font-size-base, 1rem)',
                        color: 'var(--flux-text-tertiary, #787890)',
                        fontWeight: 500,
                      }}
                    >
                      {plan.period}
                    </span>
                  </div>

                  {/* Features */}
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0 0 var(--flux-space-8, 2rem)',
                    }}
                  >
                    {plan.features.map((f) => (
                      <li
                        key={f.label}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 'var(--flux-space-2, 0.625rem)',
                          padding: 'var(--flux-space-2, 0.5rem) 0',
                          fontSize: 'var(--flux-font-size-sm, 0.875rem)',
                          color: 'var(--flux-text-secondary, #b0b0c0)',
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: 'var(--flux-accent-primary, #00d4aa)' }}>
                          <CheckIcon />
                        </span>
                        {f.label}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('early-access')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: 'var(--flux-space-3, 0.75rem) var(--flux-space-8, 2rem)',
                      fontFamily: 'var(--flux-font-sans, Inter, sans-serif)',
                      fontWeight: 600,
                      fontSize: 'var(--flux-font-size-base, 1rem)',
                      borderRadius: 'var(--flux-radius-md, 10px)',
                      border: isFeatured ? 'none' : '1.5px solid var(--flux-border-strong, rgba(255,255,255,0.14))',
                      background: isFeatured
                        ? 'linear-gradient(135deg, var(--flux-accent-secondary, #22d3ee) 0%, var(--flux-accent-primary, #00d4aa) 100%)'
                        : 'transparent',
                      color: isFeatured ? '#fff' : 'var(--flux-text-primary, #f0f0f5)',
                      cursor: 'pointer',
                      transition: 'all var(--flux-transition-fast, 120ms ease)',
                    }}
                    onMouseOver={(e) => {
                      const el = e.currentTarget as HTMLButtonElement
                      if (isFeatured) {
                        el.style.boxShadow = '0 0 24px rgba(109, 79, 224, 0.35)'
                        el.style.transform = 'translateY(-1px)'
                      } else {
                        el.style.borderColor = 'var(--flux-accent-secondary, #22d3ee)'
                        el.style.color = 'var(--flux-accent-secondary, #22d3ee)'
                        el.style.background = 'var(--flux-accent-soft, rgba(31,168,158,0.10))'
                      }
                    }}
                    onMouseOut={(e) => {
                      const el = e.currentTarget as HTMLButtonElement
                      if (isFeatured) {
                        el.style.boxShadow = 'none'
                        el.style.transform = 'translateY(0)'
                      } else {
                        el.style.borderColor = 'var(--flux-border-strong, rgba(255,255,255,0.14))'
                        el.style.color = 'var(--flux-text-primary, #f0f0f5)'
                        el.style.background = 'transparent'
                      }
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          EARLY ACCESS
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="early-access"
        aria-labelledby="early-access-title"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: 'var(--flux-space-12, 3rem) 0 var(--flux-space-20, 5rem)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 'var(--flux-max-width, 1200px)',
            margin: '0 auto',
            padding: '0 var(--flux-space-6, 1.5rem)',
          }}
        >
          <div
            className="early-access-card-responsive"
            style={{
              background: 'var(--flux-bg-secondary, #0d0d1a)',
              border: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
              borderRadius: 'var(--flux-radius-xl, 20px)',
              padding: 'var(--flux-space-12, 3rem)',
              maxWidth: 720,
              margin: '0 auto',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top gradient accent */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background:
                  'linear-gradient(90deg, var(--flux-accent-secondary, #22d3ee), var(--flux-accent-primary, #00d4aa))',
              }}
            />

            <h3
              id="early-access-title"
              style={{
                fontSize: 'var(--flux-font-size-2xl, 1.5rem)',
                fontWeight: 700,
                color: 'var(--flux-text-primary, #f0f0f5)',
                marginBottom: 'var(--flux-space-2, 0.5rem)',
              }}
            >
              Early Access — 50% off vitalício
            </h3>
            <p
              style={{
                fontSize: 'var(--flux-font-size-base, 1rem)',
                color: 'var(--flux-text-secondary, #b0b0c0)',
                marginBottom: 'var(--flux-space-8, 2rem)',
                lineHeight: 1.7,
              }}
            >
              Seja um dos primeiros 500 utilizadores e garanta o plano Pro por{' '}
              <strong style={{ color: 'var(--flux-accent-primary, #00d4aa)' }}>19€/mês</strong> para
              sempre. Acesso antecipado a novas features e influência direta no roadmap.
            </p>

            {/* Form */}
            {status === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  padding: 'var(--flux-space-6, 1.5rem)',
                  background: 'var(--flux-accent-soft, rgba(31,168,158,0.10))',
                  border: '1px solid var(--flux-border-accent, rgba(31,168,158,0.35))',
                  borderRadius: 'var(--flux-radius-md, 10px)',
                  color: 'var(--flux-accent-primary, #00d4aa)',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                ✅ Obrigado! Entraremos em contacto em breve.
              </div>
            ) : (
              <form
                className="early-access-form-responsive"
                onSubmit={handleSubmit}
                noValidate
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <label htmlFor="early-access-email" style={{ position: 'absolute', left: -9999 }}>
                    Endereço de email
                  </label>
                  <input
                    id="early-access-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError('')
                    }}
                    placeholder="o seu@email.com"
                    required
                    disabled={status === 'submitting'}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? 'early-access-email-error' : undefined}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      background: 'var(--flux-bg-primary, #08080f)',
                      border: `1.5px solid ${emailError ? 'var(--flux-accent-primary, #00d4aa)' : 'var(--flux-border-default, rgba(255,255,255,0.08))'}`,
                      borderRadius: 'var(--flux-radius-md, 10px)',
                      padding: '0.8125rem 1rem',
                      color: 'var(--flux-text-primary, #f0f0f5)',
                      fontFamily: 'var(--flux-font-sans, Inter, sans-serif)',
                      fontSize: 'var(--flux-font-size-base, 1rem)',
                      outline: 'none',
                      transition: 'border-color var(--flux-transition-fast, 120ms ease), box-shadow var(--flux-transition-fast, 120ms ease)',
                    }}
                    onFocus={(e) => {
                      if (!emailError) {
                        e.currentTarget.style.borderColor = 'var(--flux-accent-secondary, #22d3ee)'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(109, 79, 224, 0.15)'
                      }
                    }}
                    onBlur={(e) => {
                      if (!emailError) {
                        e.currentTarget.style.borderColor = 'var(--flux-border-default, rgba(255,255,255,0.08))'
                        e.currentTarget.style.boxShadow = 'none'
                      }
                    }}
                  />
                  {emailError && (
                    <span
                      id="early-access-email-error"
                      role="alert"
                      style={{
                        display: 'block',
                        marginTop: '0.375rem',
                        fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                        color: 'var(--flux-accent-primary, #00d4aa)',
                      }}
                    >
                      {emailError}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 2.25rem',
                    fontFamily: 'var(--flux-font-sans, Inter, sans-serif)',
                    fontWeight: 600,
                    fontSize: 'var(--flux-font-size-base, 1rem)',
                    borderRadius: 'var(--flux-radius-md, 10px)',
                    border: 'none',
                    background:
                      'linear-gradient(135deg, var(--flux-accent-secondary, #22d3ee) 0%, var(--flux-accent-primary, #00d4aa) 100%)',
                    color: '#fff',
                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                    opacity: status === 'submitting' ? 0.75 : 1,
                    whiteSpace: 'nowrap',
                    transition: 'all var(--flux-transition-fast, 120ms ease)',
                  }}
                  onMouseOver={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.boxShadow = '0 0 24px rgba(109, 79, 224, 0.35)'
                    el.style.transform = 'translateY(-1px)'
                  }}
                  onMouseOut={(e) => {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.boxShadow = 'none'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  {status === 'submitting' ? 'A enviar…' : 'Reservar Early Access — 19€/mês'}
                </button>
                {status === 'error' && (
                  <div
                    role="alert"
                    style={{
                      flexBasis: '100%',
                      marginTop: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255, 99, 112, 0.12)',
                      border: '1px solid rgba(255, 99, 112, 0.4)',
                      borderRadius: 'var(--flux-radius-md, 10px)',
                      color: '#ff8a93',
                      fontSize: 'var(--flux-font-size-sm, 0.875rem)',
                      fontWeight: 500,
                    }}
                  >
                    ⚠️ Não foi possível enviar o seu pedido. Verifique a ligação e tente novamente.
                  </div>
                )}
              </form>
            )}

            {/* Note */}
            <p
              style={{
                marginTop: 'var(--flux-space-4, 1rem)',
                fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                color: 'var(--flux-text-tertiary, #787890)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <span aria-hidden="true" style={{ color: 'var(--flux-accent-primary, #00d4aa)' }}>
                🔒
              </span>
              Sem compromisso. Cancele a qualquer momento. Sem letras pequenas.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          INTEGRATION BAR
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="integration-bar-responsive"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.75rem',
          padding: 'var(--flux-space-8, 2rem) 0 var(--flux-space-20, 5rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'var(--flux-bg-secondary, #0d0d1a)',
            border: '1px solid var(--flux-border-default, rgba(255,255,255,0.08))',
            borderRadius: 'var(--flux-radius-md, 10px)',
            padding: '0.75rem 1.5rem',
            fontSize: 'var(--flux-font-size-base, 1rem)',
            color: 'var(--flux-text-primary, #f0f0f5)',
            fontWeight: 500,
            transition: 'border-color var(--flux-transition-fast, 120ms ease)',
          }}
          onMouseOver={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.borderColor =
              'var(--flux-border-strong, rgba(255,255,255,0.14))'
          }}
          onMouseOut={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.borderColor =
              'var(--flux-border-default, rgba(255,255,255,0.08))'
          }}
        >
          <span>Integração 1-click com</span>
          <span style={{ display: 'flex', gap: '0.5rem' }}>
            <span
              aria-label="Shopify"
              title="Shopify"
              style={{
                width: 28,
                height: 28,
                background: 'var(--flux-bg-elevated, #1a1a2e)',
                borderRadius: 'var(--flux-radius-sm, 6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                fontWeight: 700,
                color: 'var(--flux-text-secondary, #b0b0c0)',
              }}
            >
              S
            </span>
            <span
              aria-label="WooCommerce"
              title="WooCommerce"
              style={{
                width: 28,
                height: 28,
                background: 'var(--flux-bg-elevated, #1a1a2e)',
                borderRadius: 'var(--flux-radius-sm, 6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--flux-font-size-xs, 0.75rem)',
                fontWeight: 700,
                color: 'var(--flux-text-secondary, #b0b0c0)',
              }}
            >
              W
            </span>
          </span>
          <span
            style={{
              color: 'var(--flux-accent-primary, #00d4aa)',
              fontWeight: 600,
            }}
          >
            — sem código
          </span>
        </div>
      </div>
    </>
  )
}

export default PricingSection
