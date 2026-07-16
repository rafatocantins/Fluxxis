import React, { useState } from 'react'
import { PALETTE } from './shared'
import { SmartCTA } from '@fluxxis/adaptive-cta'

const HeroSection: React.FC = () => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('npm install @fluxxis/react @fluxxis/core')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for insecure contexts
      const ta = document.createElement('textarea')
      ta.value = 'npm install @fluxxis/react @fluxxis/core'
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <header style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 80px) 0 clamp(24px, 5vw, 56px)' }}>
      {/* Version badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: `${PALETTE.violet}15`,
          border: `1px solid ${PALETTE.violet}30`,
          borderRadius: '9999px',
          padding: '6px 18px',
          marginBottom: '24px',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: PALETTE.violet,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: PALETTE.cyan,
            boxShadow: `0 0 8px ${PALETTE.cyan}`,
          }}
        />
        v0.2.0 · Adaptive Structural Interface Engine
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: 'clamp(2.5rem, 6vw, 4.8rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '20px',
          background: `linear-gradient(135deg, ${PALETTE.violet} 0%, ${PALETTE.cyan} 50%, ${PALETTE.pink} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        FLUXXIS — Interfaces Are Living Systems
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
          color: PALETTE.textSecondary,
          maxWidth: '720px',
          margin: '0 auto 16px',
          lineHeight: 1.7,
        }}
      >
        An open-source engine that interprets user intent in real time, morphing
        interface structure for every visitor — human or AI agent.
      </p>

      {/* Pipeline */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(6px, 1.5vw, 14px)',
          flexWrap: 'wrap',
          marginTop: '24px',
          marginBottom: '32px',
        }}
      >
        {[
          { label: 'signal', color: PALETTE.cyan },
          { label: 'interpret', color: PALETTE.violet },
          { label: 'morph', color: PALETTE.pink },
          { label: 'render', color: PALETTE.amber },
        ].map((step, i) => (
          <React.Fragment key={step.label}>
            <span
              style={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: step.color,
                background: `${step.color}15`,
                padding: '8px 18px',
                borderRadius: '8px',
                border: `1px solid ${step.color}30`,
              }}
            >
              {step.label}
            </span>
            {i < 3 && (
              <span
                style={{
                  color: PALETTE.textMuted,
                  alignSelf: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                }}
              >
                →
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* CTAs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(10px, 2vw, 16px)',
          flexWrap: 'wrap',
          marginTop: '8px',
        }}
      >
        {/* Star on GitHub */}
        <a
          href="https://github.com/rafatocantins/Fluxxis"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star FLUXXIS on GitHub"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: 'clamp(10px, 1.5vw, 14px) clamp(18px, 3vw, 28px)',
            borderRadius: '12px',
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)',
            fontWeight: 700,
            textDecoration: 'none',
            background: `linear-gradient(135deg, #5A3FD4, #B82D6A)`,
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: `0 4px 20px ${PALETTE.violet}40`,
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.04)'
            ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 6px 28px ${PALETTE.violet}60`
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'
            ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 20px ${PALETTE.violet}40`
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.04)'
            ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 6px 28px ${PALETTE.violet}60`
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'
            ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 20px ${PALETTE.violet}40`
          }}
        >
          ⭐ Star on GitHub
        </a>

        {/* Adaptive CTA — SmartCTA (buy intent) */}
        <SmartCTA
          intent="buy"
          productId="fluxxis-pro"
          productName="Fluxxis Pro"
          price={29.99}
          variant="primary"
          onCTAClick={() => {
            window.open('https://fluxxis.dev/adaptive-cta', '_blank', 'noopener')
          }}
        />

        {/* npm install copy */}
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied!' : 'Copy npm install command'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: 'clamp(10px, 1.5vw, 14px) clamp(18px, 3vw, 28px)',
            borderRadius: '12px',
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(0.82rem, 1.1vw, 0.9rem)',
            fontWeight: 600,
            cursor: 'pointer',
            background: `${PALETTE.cyan}10`,
            color: PALETTE.cyan,
            border: `1px solid ${PALETTE.cyan}30`,
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = `${PALETTE.cyan}18`
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = `${PALETTE.cyan}10`
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = `${PALETTE.cyan}18`
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = `${PALETTE.cyan}10`
          }}
        >
          {copied ? '✅ Copied!' : '📋'} <code style={{ background: 'transparent', fontSize: 'inherit' }}>npm install @fluxxis/react @fluxxis/core</code>
        </button>
      </div>
    </header>
  )
}

export default HeroSection
