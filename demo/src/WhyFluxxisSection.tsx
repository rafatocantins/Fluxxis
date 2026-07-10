import React from 'react'
import { PALETTE, sectionHeading, sectionSubheading } from './shared'

interface WhyCardProps {
  icon: string
  title: string
  description: string
  accent: string
}

const WhyCard: React.FC<WhyCardProps> = ({ icon, title, description, accent }) => (
  <div
    style={{
      background: PALETTE.cardBg,
      border: `1px solid ${PALETTE.cardBorder}`,
      borderRadius: '16px',
      padding: 'clamp(20px, 3vw, 32px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
    tabIndex={0}
    onMouseOver={(e) => {
      (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}40`
      ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px ${accent}10`
    }}
    onMouseOut={(e) => {
      (e.currentTarget as HTMLDivElement).style.borderColor = PALETTE.cardBorder
      ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
    }}
    onFocus={(e) => {
      (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}40`
      ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px ${accent}10`
    }}
    onBlur={(e) => {
      (e.currentTarget as HTMLDivElement).style.borderColor = PALETTE.cardBorder
      ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
    }}
  >
    <span
      style={{
        fontSize: '2rem',
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `${accent}15`,
        border: `1px solid ${accent}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </span>
    <h3
      style={{
        fontFamily: 'Sora, sans-serif',
        fontSize: '1.1rem',
        fontWeight: 700,
        color: PALETTE.textPrimary,
        margin: 0,
      }}
    >
      {title}
    </h3>
    <p
      style={{
        fontSize: '0.9rem',
        color: PALETTE.textSecondary,
        lineHeight: 1.65,
        margin: 0,
      }}
    >
      {description}
    </p>
  </div>
)

const WhyFluxxisSection: React.FC = () => {
  return (
    <section aria-labelledby="why-fluxxis-heading" style={{ padding: 'clamp(32px, 6vw, 64px) 0' }}>
      <h2 id="why-fluxxis-heading" style={sectionHeading}>
        Why FLUXXIS
      </h2>
      <p style={sectionSubheading}>
        A new paradigm for building interfaces — reactive, adaptive, and agent-friendly by design.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(16px, 3vw, 24px)',
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        <WhyCard
          icon="🎯"
          title="Intent-Driven"
          description="Interfaces adapt their structure based on user goals — not hard-coded rules. Every interaction is interpreted and morphed in real time."
          accent={PALETTE.violet}
        />
        <WhyCard
          icon="🤖"
          title="Agent-Native"
          description="The same UI serves humans and AI agents simultaneously. JSON-LD structured data and API surfaces come built-in with every morph."
          accent={PALETTE.cyan}
        />
        <WhyCard
          icon="⚡"
          title="Production-Ready"
          description="TypeScript-first, under 100ms morph latency, WCAG 2.1 AA compliant, and zero-dependency core. Built for real-world scale."
          accent={PALETTE.pink}
        />
      </div>
    </section>
  )
}

export default WhyFluxxisSection
