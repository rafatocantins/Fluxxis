import React, { useState, useCallback } from 'react'

// ── SVG Icons ────────────────────────────────────────────────────────────────

const CopyIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const CheckIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const CodeIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const GithubIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0Z" />
  </svg>
)

// ── Badge Component ──────────────────────────────────────────────────────────

interface BadgeProps {
  variant: 'ts' | 'mit' | 'wcag'
  children: React.ReactNode
}

const dotColors: Record<BadgeProps['variant'], string> = {
  ts: '#3178c6',
  mit: '#f7b93e',
  wcag: '#00d4aa',
}

const Badge: React.FC<BadgeProps> = ({ variant, children }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--flux-space-2, 0.5rem)',
      padding: 'var(--flux-space-1, 0.25rem) var(--flux-space-3, 0.75rem)',
      borderRadius: 'var(--flux-radius-full, 9999px)',
      fontSize: 'var(--flux-font-size-xs, 0.75rem)',
      fontWeight: 500,
      border: '1px solid var(--flux-border-strong, rgba(255,255,255,0.14))',
      background: 'var(--flux-bg-glass, rgba(20,20,35,0.72))',
      backdropFilter: 'blur(8px)',
      color: 'var(--flux-text-secondary, #b0b0c0)',
    }}
  >
    <span
      style={{
        display: 'inline-block',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: dotColors[variant],
      }}
      aria-hidden="true"
    />
    {children}
  </span>
)

// ── HeroSection ───────────────────────────────────────────────────────────────

const HeroSection: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const installCmd = 'npm install @fluxxis/core'

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(installCmd)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for insecure contexts
      const ta = document.createElement('textarea')
      ta.value = installCmd
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  return (
    <section
      aria-labelledby="hero-title"
      style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center' as const,
        paddingTop: 'clamp(80px, 12vw, 120px)',
        paddingBottom: 'clamp(48px, 8vw, 80px)',
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
        {/* ── Badges ──────────────────────────────────────── */}
        <div
          role="group"
          aria-label="Project badges"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'var(--flux-space-3, 0.75rem)',
            marginBottom: 'var(--flux-space-8, 2rem)',
          }}
        >
          <Badge variant="ts">TypeScript</Badge>
          <Badge variant="mit">MIT License</Badge>
          <Badge variant="wcag">WCAG 2.1 AA</Badge>
        </div>

        {/* ── Title ───────────────────────────────────────── */}
        <h1
          id="hero-title"
          style={{
            fontSize: 'clamp(2.2rem, 6vw, var(--flux-font-size-5xl, 3.5rem))',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            marginBottom: 'var(--flux-space-6, 1.5rem)',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <span
            style={{
              background:
                'linear-gradient(135deg, var(--flux-accent-primary, #00d4aa) 0%, var(--flux-accent-secondary, #22d3ee) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Fluxxis
          </span>
          <br />
          Interfaces that Morph with Intent
        </h1>

        {/* ── Subtitle ────────────────────────────────────── */}
        <p
          style={{
            fontSize: 'var(--flux-font-size-lg, 1.125rem)',
            lineHeight: 1.35,
            color: 'var(--flux-text-secondary, #b0b0c0)',
            maxWidth: '640px',
            margin: '0 auto var(--flux-space-10, 2.5rem)',
          }}
        >
          Adaptive UI that changes structure based on how users think.
          Built for humans <span aria-hidden="true">🧑‍💻</span> and AI agents{' '}
          <span aria-hidden="true">🤖</span>.
        </p>

        {/* ── Install Code Block CTA ──────────────────────── */}
        <div
          role="group"
          aria-label="Install command"
          style={{
            position: 'relative',
            maxWidth: '520px',
            margin: '0 auto var(--flux-space-6, 1.5rem)',
            background: 'var(--flux-bg-elevated, #1a1a2e)',
            border: '1px solid var(--flux-border-accent, rgba(0,212,170,0.35))',
            borderRadius: 'var(--flux-radius-lg, 14px)',
            padding: 'var(--flux-space-4, 1rem) var(--flux-space-5, 1.25rem)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--flux-space-3, 0.75rem)',
            boxShadow: 'var(--flux-shadow-glow-sm, 0 0 16px rgba(0,212,170,0.28))',
            transition: 'box-shadow var(--flux-transition-base, 200ms ease)',
            flexWrap: 'wrap',
          }}
          onMouseOver={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.boxShadow =
              'var(--flux-shadow-glow, 0 0 40px rgba(0,212,170,0.28))'
          }}
          onMouseOut={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.boxShadow =
              'var(--flux-shadow-glow-sm, 0 0 16px rgba(0,212,170,0.28))'
          }}
        >
          <code
            id="install-cmd"
            style={{
              flex: 1,
              fontFamily: 'var(--flux-font-mono, JetBrains Mono, monospace)',
              fontSize: 'var(--flux-font-size-sm, 0.875rem)',
              color: 'var(--flux-accent-primary, #00d4aa)',
              textAlign: 'left' as const,
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              padding: 'var(--flux-space-1, 0.25rem) 0',
            }}
          >
            {installCmd}
          </code>
          <button
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : 'Copy install command to clipboard'}
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--flux-space-1, 0.25rem)',
              padding: 'var(--flux-space-2, 0.5rem) var(--flux-space-4, 1rem)',
              background: copied
                ? '#166534'
                : 'var(--flux-accent-soft, rgba(0,212,170,0.10))',
              border: copied
                ? '1px solid #22c55e'
                : '1px solid var(--flux-border-accent, rgba(0,212,170,0.35))',
              borderRadius: 'var(--flux-radius-md, 10px)',
              color: copied
                ? '#bbf7d0'
                : 'var(--flux-accent-primary, #00d4aa)',
              fontSize: 'var(--flux-font-size-xs, 0.75rem)',
              fontWeight: 600,
              fontFamily: 'var(--flux-font-sans, Inter, sans-serif)',
              transition: 'all var(--flux-transition-fast, 120ms ease)',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => {
              if (!copied) {
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = 'var(--flux-accent-primary, #00d4aa)'
                el.style.color = 'var(--flux-text-inverse, #08080f)'
              }
            }}
            onMouseOut={(e) => {
              if (!copied) {
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = 'var(--flux-accent-soft, rgba(0,212,170,0.10))'
                el.style.color = 'var(--flux-accent-primary, #00d4aa)'
              }
            }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* ── Actions ─────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--flux-space-4, 1rem)',
            flexWrap: 'wrap',
          }}
        >
          {/* Start Building (primary) */}
          <a
            href="#morph-stage"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--flux-space-2, 0.5rem)',
              padding: 'var(--flux-space-3, 0.75rem) var(--flux-space-6, 1.5rem)',
              borderRadius: 'var(--flux-radius-full, 9999px)',
              fontWeight: 600,
              fontSize: 'var(--flux-font-size-sm, 0.875rem)',
              transition: 'all var(--flux-transition-base, 200ms ease)',
              border: '1px solid transparent',
              background: 'var(--flux-accent-primary, #00d4aa)',
              color: 'var(--flux-text-inverse, #08080f)',
              boxShadow: '0 0 20px rgba(0, 212, 170, 0.25)',
              textDecoration: 'none',
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = '#00e8bb'
              el.style.boxShadow = '0 0 32px rgba(0, 212, 170, 0.45)'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--flux-accent-primary, #00d4aa)'
              el.style.boxShadow = '0 0 20px rgba(0, 212, 170, 0.25)'
              el.style.transform = 'translateY(0)'
            }}
          >
            <CodeIcon />
            Start Building
          </a>

          {/* View on GitHub (outline) */}
          <a
            href="https://github.com/rafatocantins/Fluxxis"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--flux-space-2, 0.5rem)',
              padding: 'var(--flux-space-3, 0.75rem) var(--flux-space-6, 1.5rem)',
              borderRadius: 'var(--flux-radius-full, 9999px)',
              fontWeight: 600,
              fontSize: 'var(--flux-font-size-sm, 0.875rem)',
              transition: 'all var(--flux-transition-base, 200ms ease)',
              border: '1px solid var(--flux-border-strong, rgba(255,255,255,0.14))',
              background: 'transparent',
              color: 'var(--flux-text-primary, #f0f0f5)',
              textDecoration: 'none',
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--flux-accent-primary, #00d4aa)'
              el.style.color = 'var(--flux-accent-primary, #00d4aa)'
              el.style.background = 'var(--flux-accent-soft, rgba(0,212,170,0.10))'
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--flux-border-strong, rgba(255,255,255,0.14))'
              el.style.color = 'var(--flux-text-primary, #f0f0f5)'
              el.style.background = 'transparent'
            }}
          >
            <GithubIcon />
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
