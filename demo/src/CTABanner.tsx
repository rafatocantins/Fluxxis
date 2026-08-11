import React, { useState, useEffect } from 'react'

// ── SVG Icons ────────────────────────────────────────────────────────────────

const GithubIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0Z" />
  </svg>
)

const StarIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

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

// ── CTABanner ────────────────────────────────────────────────────────────────

const CTABanner: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 639px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <section
      aria-label="Call to action"
      style={{
        position: 'relative',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        background: 'linear-gradient(135deg, #6c5ce7 0%, #0a0a1a 100%)',
        padding: isMobile ? '4rem 1.5rem' : '5rem 2rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Radial glow behind heading */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108, 92, 231, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Central content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '720px',
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? '1.875rem' : '2.5rem',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Ready to make every CTA count?
        </h2>

        <p
          style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            color: '#ccc',
            lineHeight: 1.6,
            margin: '1rem 0 0 0',
          }}
        >
          Join the waitlist. No credit card required.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '1rem',
            marginTop: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: isMobile ? 'center' : 'flex-start',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          {/* Primary: Get Early Access */}
          <a
            href="#pricing"
            aria-label="Get Early Access — join the waitlist"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--flux-space-2, 0.5rem)',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              background: '#fff',
              color: '#0a0a1a',
              border: 'none',
              transition: prefersReducedMotion ? 'none' : 'transform 80ms ease, filter 80ms ease',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '320px' : 'none',
              textAlign: 'center' as const,
            }}
            onMouseEnter={(e) => {
              if (prefersReducedMotion) return
              ;(e.currentTarget as HTMLAnchorElement).style.filter = 'brightness(1.1)'
              ;(e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              if (prefersReducedMotion) return
              ;(e.currentTarget as HTMLAnchorElement).style.filter = 'brightness(1)'
              ;(e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'
            }}
            onMouseDown={(e) => {
              if (prefersReducedMotion) return
              ;(e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.98)'
            }}
            onMouseUp={(e) => {
              if (prefersReducedMotion) return
              ;(e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.02)'
            }}
          >
            <StarIcon />
            Get Early Access
          </a>

          {/* Secondary: View on GitHub */}
          <a
            href="https://github.com/rafatocantins/Fluxxis"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Fluxxis source code on GitHub (opens in new tab)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--flux-space-2, 0.5rem)',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              background: 'transparent',
              color: '#ccc',
              border: '1px solid #555',
              transition: prefersReducedMotion ? 'none' : 'transform 80ms ease, filter 80ms ease, background 80ms ease, border-color 80ms ease, box-shadow 80ms ease',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '320px' : 'none',
              textAlign: 'center' as const,
            }}
            onMouseEnter={(e) => {
              if (prefersReducedMotion) return
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#888'
              ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255, 255, 255, 0.05)'
            }}
            onMouseLeave={(e) => {
              if (prefersReducedMotion) return
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#555'
              ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
            }}
          >
            <GithubIcon />
            View on GitHub
          </a>
        </div>
      </div>

      {/* Bottom separator line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #6c5ce7, transparent)',
        }}
        aria-hidden="true"
      />
    </section>
  )
}

export default CTABanner
