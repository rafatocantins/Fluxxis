import React, { useState } from 'react'
import { PALETTE, sectionHeading, sectionSubheading } from './shared'

const codeBlock: React.CSSProperties = {
  background: PALETTE.darkBg,
  border: `1px solid ${PALETTE.cardBorder}`,
  borderRadius: '12px',
  padding: 'clamp(14px, 2vw, 20px) clamp(16px, 3vw, 24px)',
  fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
  fontSize: 'clamp(0.78rem, 1.2vw, 0.88rem)',
  lineHeight: 1.6,
  color: PALETTE.cyan,
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  position: 'relative',
}

const GetStartedSection: React.FC = () => {
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [copiedImport, setCopiedImport] = useState(false)

  const copy = async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setter(true)
    setTimeout(() => setter(false), 2000)
  }

  return (
    <section aria-labelledby="get-started-heading" style={{ padding: 'clamp(32px, 6vw, 64px) 0' }}>
      <h2 id="get-started-heading" style={sectionHeading}>
        Get Started
      </h2>
      <p style={sectionSubheading}>
        Two packages, zero friction. Install and start building adaptive interfaces in minutes.
      </p>

      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(16px, 2vw, 24px)',
        }}
      >
        {/* Install */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: PALETTE.textSecondary,
              }}
            >
              Install
            </span>
            <button
              onClick={() => copy('npm install @fluxxis/react @fluxxis/core', setCopiedInstall)}
              aria-label={copiedInstall ? 'Copied!' : 'Copy install command'}
              style={{
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: `1px solid ${PALETTE.cardBorder}`,
                background: PALETTE.cardBg,
                color: PALETTE.textSecondary,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = PALETTE.cyan
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = `${PALETTE.cyan}40`
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = PALETTE.textSecondary
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = PALETTE.cardBorder
              }}
            >
              {copiedInstall ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <pre style={codeBlock}>
            <code>npm install @fluxxis/react @fluxxis/core</code>
          </pre>
        </div>

        {/* Import */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: PALETTE.textSecondary,
              }}
            >
              Import &amp; Use
            </span>
            <button
              onClick={() =>
                copy(
                  "import { FluxxisProvider, useIntent, SmartCTA } from '@fluxxis/react'",
                  setCopiedImport,
                )
              }
              aria-label={copiedImport ? 'Copied!' : 'Copy import statement'}
              style={{
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: `1px solid ${PALETTE.cardBorder}`,
                background: PALETTE.cardBg,
                color: PALETTE.textSecondary,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = PALETTE.violet
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = `${PALETTE.violet}40`
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = PALETTE.textSecondary
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = PALETTE.cardBorder
              }}
            >
              {copiedImport ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <pre style={codeBlock}>
            <code>
              {'import { FluxxisProvider, useIntent, SmartCTA } from \'@fluxxis/react\''}
            </code>
          </pre>
        </div>

        {/* View Docs CTA */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <a
            href="https://github.com/rafatocantins/Fluxxis#readme"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View FLUXXIS documentation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: '12px',
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: `${PALETTE.violet}10`,
              color: PALETTE.violet,
              border: `1px solid ${PALETTE.violet}30`,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = `${PALETTE.violet}18`
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = `${PALETTE.violet}50`
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = `${PALETTE.violet}10`
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = `${PALETTE.violet}30`
            }}
          >
            View Docs →
          </a>
        </div>
      </div>
    </section>
  )
}

export default GetStartedSection
