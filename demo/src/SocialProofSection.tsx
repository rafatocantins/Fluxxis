import React, { useState, useEffect } from 'react'

// ── SVG Logos ────────────────────────────────────────────────────────────────

const ShopifyIcon: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" fill="currentColor">
    <rect x="6" y="4" width="28" height="7" rx="2" opacity="0.7" />
    <rect x="6" y="13" width="20" height="7" rx="2" opacity="0.85" />
    <rect x="6" y="22" width="26" height="7" rx="2" />
    <circle cx="20" cy="32" r="5" opacity="0.55" />
  </svg>
)

const VercelIcon: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" fill="currentColor">
    <polygon points="20,3 3,33 15,33 20,24 25,33 37,33" />
  </svg>
)

const ProductHuntIcon: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="3.5" />
    <text x="20" y="27" textAnchor="middle" fontSize="22" fontWeight="800" fill="currentColor" fontFamily="sans-serif">P</text>
  </svg>
)

const GithubLogoIcon: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" fill="currentColor">
    <path d="M20 3C10.5 3 3 10.7 3 20.4c0 7.7 4.9 14.2 11.6 16.5.8.2 1.1-.4 1.1-.8v-2.8c-4.7 1-5.7-2.3-5.7-2.3-.8-2-1.9-2.5-1.9-2.5-1.5-1 .1-1 .1-1 1.7.1 2.6 1.7 2.6 1.7 1.5 2.6 3.9 1.9 4.9 1.4.2-1.1.6-1.9 1.1-2.3-3.7-.4-7.7-1.9-7.7-8.4 0-1.9.7-3.4 1.7-4.6-.2-.4-.7-2.2.2-4.5 0 0 1.4-.5 4.7 1.7 1.4-.4 2.8-.6 4.3-.6 1.5 0 2.9.2 4.3.6 3.3-2.2 4.7-1.7 4.7-1.7.9 2.3.4 4.1.2 4.5 1.1 1.2 1.7 2.7 1.7 4.6 0 6.6-4 8-7.8 8.4.6.5 1.2 1.6 1.2 3.2v4.7c0 .5.3 1 1.1.8C32.2 34.5 37 28 37 20.4 37 10.7 29.5 3 20 3z" />
  </svg>
)

const NpmIcon: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
    <rect x="4" y="12" width="32" height="16" rx="2" fill="currentColor" />
    <rect x="4" y="12" width="12" height="16" fill="#0a0a1a" rx="2" />
    <rect x="16" y="12" width="4" height="16" fill="#0a0a1a" />
  </svg>
)

// ── Types ────────────────────────────────────────────────────────────────────

interface TrustLogo {
  name: string
  Icon: React.FC
}

interface Testimonial {
  quote: string
  initials: string
  name: string
  role: string
}

// ── Data ─────────────────────────────────────────────────────────────────────

const trustLogos: TrustLogo[] = [
  { name: 'Shopify Partner', Icon: ShopifyIcon },
  { name: 'Vercel', Icon: VercelIcon },
  { name: 'Product Hunt', Icon: ProductHuntIcon },
  { name: 'GitHub', Icon: GithubLogoIcon },
  { name: 'npm', Icon: NpmIcon },
]

const testimonials: Testimonial[] = [
  {
    quote: 'Fluxxis increased our conversion by 34% in the first week. The adaptive CTAs just work.',
    initials: 'MC',
    name: 'Marcus Chen',
    role: 'CTO @ EcomGmbH',
  },
  {
    quote: 'Finally, a UI that understands our users. The intent detection is eerily accurate.',
    initials: 'SP',
    name: 'Sarah Palmer',
    role: 'Product Lead @ DataVista',
  },
  {
    quote: 'We shipped adaptive product pages in 2 days. Our dev team was stunned.',
    initials: 'AR',
    name: 'Alex Rivera',
    role: 'Engineering Manager @ ShopStream',
  },
]

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

// ── TrustLogoItem ────────────────────────────────────────────────────────────

const TrustLogoItem: React.FC<{ logo: TrustLogo; index: number }> = ({ logo, index }) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#555555',
        fontSize: '0.9rem',
        fontWeight: 600,
        transition: prefersReducedMotion ? 'none' : 'color 0.15s ease',
        animation: prefersReducedMotion
          ? 'none'
          : `fadeInStagger 0.5s ease-out forwards ${index * 0.1}s`,
        opacity: prefersReducedMotion ? 1 : 0,
        animationFillMode: prefersReducedMotion ? 'none' : 'forwards',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.color = '#6c5ce7' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.color = '#555555' }}
    >
      <span
        style={{
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <logo.Icon />
      </span>
      <span>{logo.name}</span>
    </div>
  )
}

// ── TestimonialCard ──────────────────────────────────────────────────────────

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [hovered, setHovered] = useState(false)

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.025)',
    border: hovered
      ? '1px solid rgba(108, 92, 231, 0.25)'
      : '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '2rem 1.75rem 1.75rem',
    overflow: 'hidden',
    transform: hovered && !prefersReducedMotion ? 'translateY(-4px)' : 'none',
    boxShadow: hovered
      ? '0 12px 40px -12px rgba(108, 92, 231, 0.25), 0 4px 16px -4px rgba(108, 92, 231, 0.1)'
      : 'none',
    transition: prefersReducedMotion
      ? 'none'
      : 'transform 0.1s ease, box-shadow 0.1s ease, border-color 0.1s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '260px',
    cursor: 'default',
  }

  return (
    <article
      role="listitem"
      tabIndex={0}
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* Decorative quote mark */}
      <span
        style={{
          position: 'absolute',
          top: '0.3rem',
          left: '1.25rem',
          fontSize: '6rem',
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: '#ffffff',
          opacity: 0.07,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        {'\u201C'}
      </span>

      <blockquote
        style={{
          position: 'relative',
          zIndex: 1,
          fontStyle: 'italic',
          fontSize: '1.1rem',
          color: '#e0e0e0',
          lineHeight: 1.65,
          marginBottom: '1.75rem',
          flexGrow: 1,
          margin: 0,
        }}
      >
        {testimonial.quote}
      </blockquote>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#444444',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#aaaaaa',
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          {testimonial.initials}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
            {testimonial.name}
          </span>
          <span style={{ fontSize: '0.9rem', color: '#888888', lineHeight: 1.3 }}>
            {testimonial.role}
          </span>
        </div>
      </div>
    </article>
  )
}

// ── SocialProofSection ───────────────────────────────────────────────────────

const SocialProofSection: React.FC = () => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(max-width: 1023px)') && !useMediaQuery('(max-width: 767px)')

  // We need to detect tablet range properly. Let's use a more precise approach.
  const isTabletOnly = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')

  const gridColumns = isMobile ? 1 : isTabletOnly ? 2 : 3

  return (
    <section
      aria-labelledby="social-proof-heading"
      style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: isMobile ? '4rem 1.25rem' : '6rem 2rem',
      }}
    >
      {/* Section Header */}
      <header style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2
          id="social-proof-heading"
          style={{
            fontSize: isMobile ? '1.65rem' : '2.2rem',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
            marginTop: 0,
          }}
        >
          What Early Adopters Say
        </h2>
        <p
          style={{
            fontSize: isMobile ? '0.9rem' : '1rem',
            color: '#888888',
            fontWeight: 400,
            margin: 0,
          }}
        >
          Join teams already transforming their conversion rates
        </p>
      </header>

      {/* Trust Bar */}
      <div style={{ marginBottom: '4.5rem' }} aria-label="Trusted by teams">
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: '#959595',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '2rem',
            marginTop: 0,
          }}
        >
          Trusted by teams using
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '1.5rem' : isTabletOnly ? '2.25rem' : '3rem',
            rowGap: isMobile ? '1.25rem' : isTabletOnly ? '1.5rem' : '2rem',
          }}
        >
          {trustLogos.map((logo, idx) => (
            <TrustLogoItem key={logo.name} logo={logo} index={idx} />
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div
        role="list"
        aria-label="Testimonials from early adopters"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          gap: isMobile ? '1.25rem' : '1.5rem',
        }}
      >
        {testimonials.map((t) => (
          <TestimonialCard key={t.initials} testimonial={t} />
        ))}
      </div>

      {/* Inject keyframe animations (non-reduced-motion only) */}
      {!prefersReducedMotion && (
        <style>{`
          @keyframes fadeInStagger {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      )}
    </section>
  )
}

export default SocialProofSection
