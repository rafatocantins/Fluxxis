import React, { useState, useEffect, useRef } from 'react'

// ── SVG Icons ────────────────────────────────────────────────────────────────

const RadarIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <line x1="12" y1="2" x2="12" y2="6" />
  </svg>
)

const MorphIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
)

const ChartIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

// ── Types ────────────────────────────────────────────────────────────────────

interface StepData {
  variant: 'detect' | 'morph' | 'convert'
  number: string
  title: string
  description: string
}

// ── Accent Colors per step ───────────────────────────────────────────────────

const stepAccentColors: Record<StepData['variant'], string> = {
  detect: '#7c5cfc',
  morph: '#00d4aa',
  convert: '#ff6b9d',
}

const stepAccentGlow: Record<StepData['variant'], string> = {
  detect: 'rgba(124, 92, 252, 0.35)',
  morph: 'rgba(0, 212, 170, 0.35)',
  convert: 'rgba(255, 107, 157, 0.35)',
}

// ── Hook: useMediaQuery ──────────────────────────────────────────────────────

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

// ── Hook: useIntersectionObserver ────────────────────────────────────────────

function useIsVisible(ref: React.RefObject<HTMLElement | null>): boolean {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(node)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])

  return isVisible
}

// ── Step Card ────────────────────────────────────────────────────────────────

const StepCard: React.FC<{
  step: StepData
  icon: React.ReactNode
  index: number
}> = ({ step, icon }) => {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const isVisible = useIsVisible(cardRef)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const accent = stepAccentColors[step.variant]
  const glow = stepAccentGlow[step.variant]

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    background: 'var(--flux-bg-card, #16161f)',
    border: hovered
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '40px 32px 36px',
    cursor: 'default',
    overflow: 'hidden',
    boxShadow: hovered
      ? `0 20px 48px ${glow}, 0 0 0 1px ${accent}26`
      : 'none',
    transition: prefersReducedMotion ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? (hovered && !prefersReducedMotion ? 'translateY(-4px)' : 'translateY(0)')
      : 'translateY(24px)',
  }

  const accentBarStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: `linear-gradient(90deg, ${accent}, ${accent}33)`,
    borderRadius: '16px 16px 0 0',
    opacity: hovered ? 1 : 0,
    transition: prefersReducedMotion ? 'none' : 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }

  const numberGlowStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: accent,
    filter: 'blur(36px)',
    opacity: hovered ? 0.5 : 0,
    transition: prefersReducedMotion ? 'none' : 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 0,
    pointerEvents: 'none' as const,
  }

  return (
    <article
      ref={cardRef}
      role="listitem"
      tabIndex={0}
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-labelledby={`step-${step.variant}-title`}
    >
      <div style={accentBarStyle} aria-hidden="true" />

      {/* Icon */}
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          position: 'relative',
          background: `${accent}1a`,
          color: accent,
        }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Number (big) */}
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          marginBottom: '8px',
        }}
      >
        <div style={numberGlowStyle} aria-hidden="true" />
        <span
          style={{
            fontSize: '4rem',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: accent,
            position: 'relative',
            zIndex: 1,
          }}
          aria-hidden="true"
        >
          {step.number}
        </span>
      </div>

      {/* Title */}
      <h3
        id={`step-${step.variant}-title`}
        style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--flux-text-primary, #f0f0f5)',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
        }}
      >
        {step.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.95rem',
          color: 'var(--flux-text-secondary, #b0b0c0)',
          lineHeight: 1.6,
          marginBottom: '20px',
        }}
      >
        {step.description}
      </p>

      {/* Highlight box */}
      <div
        style={{
          borderRadius: '10px',
          padding: '14px 16px',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: `${accent}14`,
          color: accent,
        }}
        aria-label={
          step.variant === 'detect'
            ? 'Intent classifications: Browse, Compare, Buy'
            : step.variant === 'morph'
              ? 'CTA transformation: Saiba Mais to Comparar Preços to Adicionar ao Carrinho'
              : '34 percent increase in conversion rate'
        }
      >
        {step.variant === 'detect' && (
          <>
            <span>Browse</span>
            <span style={{ color: 'var(--flux-text-muted, #6b6b80)' }}>→</span>
            <span>Compare</span>
            <span style={{ color: 'var(--flux-text-muted, #6b6b80)' }}>→</span>
            <span style={{ fontWeight: 700 }}>Buy</span>
          </>
        )}
        {step.variant === 'morph' && (
          <span style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: `1px solid ${accent}40`,
              background: `${accent}0f`,
              color: accent,
              whiteSpace: 'nowrap' as const,
            }}>
              Saiba Mais
            </span>
            <span style={{ color: 'var(--flux-text-muted, #6b6b80)', fontSize: '0.75rem', margin: '0 2px' }}>→</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: `1px solid ${accent}40`,
              background: `${accent}0f`,
              color: accent,
              whiteSpace: 'nowrap' as const,
            }}>
              Comparar Preços
            </span>
            <span style={{ color: 'var(--flux-text-muted, #6b6b80)', fontSize: '0.75rem', margin: '0 2px' }}>→</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: `1px solid ${accent}40`,
              background: `${accent}0f`,
              color: accent,
              whiteSpace: 'nowrap' as const,
            }}>
              Adicionar ao Carrinho
            </span>
          </span>
        )}
        {step.variant === 'convert' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SparklineBars />
            <span aria-hidden="true">↑</span>
            +34%
          </span>
        )}
      </div>

      {step.variant === 'convert' && (
        <p style={{ fontSize: '0.78rem', color: 'var(--flux-text-muted, #6b6b80)', marginTop: '8px' }}>
          conversion rate
        </p>
      )}
    </article>
  )
}

// ── Sparkline Bars (mini chart) ──────────────────────────────────────────────

const SparklineBars: React.FC = () => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const barHeights = ['40%', '55%', '45%', '60%', '50%', '70%', '65%', '100%']
  const delays = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]

  return (
    <span style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '28px', marginRight: '6px' }} aria-hidden="true">
      {barHeights.map((h, i) => (
        <span
          key={i}
          style={{
            width: '4px',
            borderRadius: '2px',
            background: 'var(--flux-accent-3, #ff6b9d)',
            height: prefersReducedMotion ? h : '0%',
            animation: prefersReducedMotion
              ? 'none'
              : `sparkGrow 1.5s ease-out both ${delays[i]}s`,
            opacity: prefersReducedMotion ? 1 : undefined,
          }}
        />
      ))}
    </span>
  )
}

// ── Connector (Desktop — horizontal) ─────────────────────────────────────────

const HorizontalConnector: React.FC = () => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px', alignSelf: 'center', position: 'relative' }} aria-hidden="true">
      <div style={{
        width: '100%',
        height: '2px',
        background: 'var(--flux-connector, #2a2a3a)',
        borderRadius: '2px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {!prefersReducedMotion && (
          <span style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, var(--flux-accent-1, #7c5cfc) 30%, var(--flux-accent-2, #00d4aa) 60%, var(--flux-accent-1, #7c5cfc) 100%)',
            animation: 'connectorFlow 2.5s ease-in-out infinite',
          }} />
        )}
      </div>
      {!prefersReducedMotion && [0, 0.8, 1.6].map((delay, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: i === 0 ? 'var(--flux-accent-1, #7c5cfc)' : i === 1 ? 'var(--flux-accent-2, #00d4aa)' : 'var(--flux-accent-3, #ff6b9d)',
            boxShadow: i === 0
              ? '0 0 10px rgba(124, 92, 252, 0.35), 0 0 20px rgba(124, 92, 252, 0.35)'
              : i === 1
                ? '0 0 10px rgba(0, 212, 170, 0.35), 0 0 20px rgba(0, 212, 170, 0.35)'
                : '0 0 10px rgba(255, 107, 157, 0.35), 0 0 20px rgba(255, 107, 157, 0.35)',
            animation: `dotTravel 2.5s ease-in-out infinite ${delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// ── Connector (Mobile — vertical) ────────────────────────────────────────────

const VerticalConnector: React.FC = () => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <div style={{ display: 'flex', width: '100%', height: '48px', justifyContent: 'center', alignItems: 'center' }} aria-hidden="true">
      <div style={{
        width: '2px',
        height: '100%',
        background: 'var(--flux-connector, #2a2a3a)',
        borderRadius: '2px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {!prefersReducedMotion && (
          <span style={{
            position: 'absolute',
            top: '-100%',
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, transparent 0%, var(--flux-accent-1, #7c5cfc) 30%, var(--flux-accent-2, #00d4aa) 60%, var(--flux-accent-3, #ff6b9d) 100%)',
            animation: 'connectorFlowVertical 2.5s ease-in-out infinite',
          }} />
        )}
      </div>
    </div>
  )
}

// ── Section Badge ────────────────────────────────────────────────────────────

const SectionBadge: React.FC = () => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 16px',
      borderRadius: '100px',
      background: 'rgba(124, 92, 252, 0.1)',
      border: '1px solid rgba(124, 92, 252, 0.2)',
      color: 'var(--flux-accent-1, #7c5cfc)',
      fontSize: '0.8rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      marginBottom: '20px',
    }}
    aria-hidden="true"
  >
    <span
      style={{
        display: 'inline-block',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'var(--flux-accent-1, #7c5cfc)',
        boxShadow: '0 0 8px rgba(124, 92, 252, 0.35)',
      }}
    />
    How It Works
  </div>
)

// ── HowItWorksSection ────────────────────────────────────────────────────────

const HowItWorksSection: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const steps: StepData[] = [
    {
      variant: 'detect',
      number: '01',
      title: 'Detect Intent',
      description: 'Fluxxis analyzes user behavior — scroll depth, hover patterns, time on page — and classifies intent in real time.',
    },
    {
      variant: 'morph',
      number: '02',
      title: 'Morph the CTA',
      description: 'Your call-to-action transforms automatically as user intent shifts. No manual variants, no A/B tests — just one intelligent CTA.',
    },
    {
      variant: 'convert',
      number: '03',
      title: 'Convert',
      description: 'Users see the right CTA at the right moment — and conversion rates soar. The data speaks for itself.',
    },
  ]

  const icons = [<RadarIcon key="radar" />, <MorphIcon key="morph" />, <ChartIcon key="chart" />]

  return (
    <section
      aria-labelledby="how-it-works-title"
      style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: 'var(--flux-max-width, 1200px)',
        padding: isMobile ? '64px 20px' : '100px 24px',
        margin: '0 auto',
      }}
    >
      {/* Section Header */}
      <header style={{ textAlign: 'center', marginBottom: isMobile ? '48px' : '72px' }}>
        <SectionBadge />
        <h2
          id="how-it-works-title"
          style={{
            fontSize: isMobile ? '1.8rem' : 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: 'var(--flux-text-primary, #f0f0f5)',
            marginBottom: '16px',
            marginTop: 0,
          }}
        >
          AI-Powered CTA in{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--flux-accent-1, #7c5cfc), var(--flux-accent-2, #00d4aa))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            3 Steps
          </span>
        </h2>
        <p
          style={{
            fontSize: isMobile ? '0.95rem' : '1.1rem',
            color: 'var(--flux-text-secondary, #b0b0c0)',
            maxWidth: '560px',
            margin: '0 auto',
            fontWeight: 400,
          }}
        >
          Fluxxis detects user intent in real time and morphs your call-to-action
          to match — no coding, no rules, pure intelligence.
        </p>
      </header>

      {/* Steps Grid */}
      <div
        role="list"
        aria-label="Three steps of Fluxxis"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 80px 1fr 80px 1fr',
          alignItems: 'start',
          gap: 0,
          position: 'relative',
        }}
      >
        {steps.map((step, idx) => (
          <React.Fragment key={step.variant}>
            <StepCard step={step} icon={icons[idx]} index={idx} />
            {idx < steps.length - 1 && (
              isMobile
                ? <VerticalConnector />
                : <HorizontalConnector />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Inject keyframe animations */}
      {!prefersReducedMotion && (
        <style>{`
          @keyframes connectorFlow {
            0%   { left: -100%; }
            100% { left: 100%; }
          }
          @keyframes connectorFlowVertical {
            0%   { top: -100%; }
            100% { top: 100%; }
          }
          @keyframes dotTravel {
            0%   { left: 0%; opacity: 0; transform: scale(0.5); }
            10%  { opacity: 1; transform: scale(1); }
            40%  { opacity: 1; transform: scale(1); }
            50%  { left: 50%; opacity: 1; transform: scale(1.3); }
            60%  { opacity: 1; transform: scale(1); }
            90%  { opacity: 1; transform: scale(1); }
            100% { left: 100%; opacity: 0; transform: scale(0.5); }
          }
          @keyframes sparkGrow {
            from { height: 0%; opacity: 0; }
            to   { opacity: 1; }
          }
        `}</style>
      )}
    </section>
  )
}

export default HowItWorksSection
