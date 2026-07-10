import React from 'react'
import { FluxxisProvider } from '@fluxxis/react'
import { PALETTE } from './shared'
import HeroSection from './HeroSection'
import WhyFluxxisSection from './WhyFluxxisSection'
import GetStartedSection from './GetStartedSection'
import IntentPlayground from './IntentPlayground'
import ComponentGallery from './ComponentGallery'
import WrapperDemo from './WrapperDemo'

// ──────────────────────────────────────
// Footer
// ──────────────────────────────────────
const Footer: React.FC = () => (
  <footer
    style={{
      textAlign: 'center',
      padding: 'clamp(32px, 6vw, 60px) 24px 32px',
      borderTop: `1px solid ${PALETTE.cardBorder}`,
      marginTop: 'clamp(32px, 6vw, 64px)',
    }}
  >
    {/* Links */}
    <nav
      aria-label="Footer navigation"
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 'clamp(16px, 3vw, 32px)',
        marginBottom: '20px',
      }}
    >
      <a
        href="https://github.com/rafatocantins/Fluxxis"
        target="_blank"
        rel="noopener noreferrer"
        style={footerLink}
      >
        GitHub
      </a>
      <a
        href="https://www.npmjs.com/search?q=%40fluxxis"
        target="_blank"
        rel="noopener noreferrer"
        style={footerLink}
      >
        npm
      </a>
      <a
        href="https://github.com/rafatocantins/Fluxxis#readme"
        target="_blank"
        rel="noopener noreferrer"
        style={footerLink}
      >
        Docs
      </a>
      <a
        href="https://github.com/rafatocantins/Fluxxis/blob/main/LICENSE"
        target="_blank"
        rel="noopener noreferrer"
        style={footerLink}
      >
        License (MIT)
      </a>
    </nav>

    {/* Tagline */}
    <p
      style={{
        fontSize: '0.85rem',
        color: PALETTE.textMuted,
        margin: 0,
        lineHeight: 1.7,
      }}
    >
      Made with{' '}
      <span style={{ color: PALETTE.pink }}>❤️</span> by the{' '}
      <span style={{ color: PALETTE.violet }}>FLUXXIS Research Team</span>
    </p>
  </footer>
)

const footerLink: React.CSSProperties = {
  fontFamily: 'Sora, sans-serif',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: PALETTE.textSecondary,
  textDecoration: 'none',
  transition: 'color 0.15s',
}

// ──────────────────────────────────────
// Main App
// ──────────────────────────────────────
function App() {
  return (
    <FluxxisProvider options={{ includeAgentFields: true }}>
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: 'clamp(24px, 4vw, 40px) clamp(16px, 4vw, 24px) 80px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <HeroSection />
        <WhyFluxxisSection />
        <GetStartedSection />
        <IntentPlayground />
        <ComponentGallery />
        <WrapperDemo />
        <Footer />
      </div>
    </FluxxisProvider>
  )
}

export default App
