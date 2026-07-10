import React, { useState } from 'react'
import {
  SmartCTA,
  SmartSection,
  PrimaryAnimatedButton,
  SecondaryAnimatedButton,
  AccentAnimatedButton,
  ShimmerButton,
  RainbowButton,
  BlurFadeButton,
} from '@fluxxis/react'
import type { GoalType } from '@fluxxis/core'
import {
  PALETTE,
  INTENT_COLORS,
  GOAL_COLORS,
  card,
  cardTitle,
  cardSubtitle,
  badge,
} from './shared'

const controlRow: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  marginBottom: '24px',
}

const buttonDemoCard: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '20px',
  background: PALETTE.darkBg,
  borderRadius: '12px',
  border: `1px solid ${PALETTE.cardBorder}`,
}

const buttonDemoName: React.CSSProperties = {
  fontFamily: 'Sora, sans-serif',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: PALETTE.textPrimary,
}

const buttonDemoDesc: React.CSSProperties = {
  fontSize: '0.8rem',
  color: PALETTE.textMuted,
}

const ComponentGallery: React.FC = () => {
  const [clickCount, setClickCount] = useState(0)
  const handleClick = () => setClickCount((prev) => prev + 1)

  return (
    <div style={card}>
      <h2 style={cardTitle}>🧩 Component Gallery</h2>
      <p style={cardSubtitle}>
        Production-ready primitives that respond to intent. Each adapts its
        appearance and behavior based on the resolved context.
      </p>

      {/* SmartCTA by goal */}
      <h3
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1rem',
          fontWeight: 600,
          color: PALETTE.textPrimary,
          marginBottom: '16px',
          marginTop: '8px',
        }}
      >
        SmartCTA — Goal-driven call-to-action
      </h3>
      <div style={controlRow}>
        {(['convert', 'inform', 'engage'] as GoalType[]).map((goal) => (
          <div key={goal} style={buttonDemoCard}>
            <span
              style={{
                ...badge,
                background: `${GOAL_COLORS[goal]}20`,
                color: GOAL_COLORS[goal],
                border: `1px solid ${GOAL_COLORS[goal]}40`,
              }}
            >
              {goal}
            </span>
            <SmartCTA
              goal={goal}
              defaultCopy={
                goal === 'convert'
                  ? 'Get Started'
                  : goal === 'inform'
                    ? 'Learn More'
                    : 'Try It Now'
              }
              variant={
                goal === 'convert'
                  ? 'primary'
                  : goal === 'inform'
                    ? 'secondary'
                    : 'primary'
              }
              onClick={handleClick}
            />
            <span style={buttonDemoDesc}>Clicks: {clickCount}</span>
          </div>
        ))}
      </div>

      {/* Animated Buttons */}
      <h3
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1rem',
          fontWeight: 600,
          color: PALETTE.textPrimary,
          marginBottom: '16px',
          marginTop: '32px',
        }}
      >
        Animated Buttons
      </h3>
      <div style={controlRow}>
        <div style={buttonDemoCard}>
          <span style={buttonDemoName}>Shimmer</span>
          <ShimmerButton onClick={handleClick}>Hover Me</ShimmerButton>
          <span style={buttonDemoDesc}>Subtle shimmer effect on hover</span>
        </div>

        <div style={buttonDemoCard}>
          <span style={buttonDemoName}>Rainbow</span>
          <RainbowButton onClick={handleClick}>Rainbow</RainbowButton>
          <span style={buttonDemoDesc}>Animated rainbow border glow</span>
        </div>

        <div style={buttonDemoCard}>
          <span style={buttonDemoName}>Blur Fade</span>
          <BlurFadeButton onClick={handleClick}>Fade In</BlurFadeButton>
          <span style={buttonDemoDesc}>Blur fade entrance animation</span>
        </div>
      </div>

      {/* Goal-based Animated Buttons */}
      <h3
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1rem',
          fontWeight: 600,
          color: PALETTE.textPrimary,
          marginBottom: '16px',
          marginTop: '32px',
        }}
      >
        Goal-Animated Buttons
      </h3>
      <div style={controlRow}>
        <div style={buttonDemoCard}>
          <span
            style={{
              ...badge,
              background: `${GOAL_COLORS.convert}20`,
              color: GOAL_COLORS.convert,
              border: `1px solid ${GOAL_COLORS.convert}40`,
            }}
          >
            Convert
          </span>
          <PrimaryAnimatedButton onClick={handleClick}>
            Start Free Trial
          </PrimaryAnimatedButton>
          <span style={buttonDemoDesc}>Shimmer + scale effect</span>
        </div>

        <div style={buttonDemoCard}>
          <span
            style={{
              ...badge,
              background: `${GOAL_COLORS.inform}20`,
              color: GOAL_COLORS.inform,
              border: `1px solid ${GOAL_COLORS.inform}40`,
            }}
          >
            Inform
          </span>
          <SecondaryAnimatedButton onClick={handleClick}>
            View Docs
          </SecondaryAnimatedButton>
          <span style={buttonDemoDesc}>Clean, professional</span>
        </div>

        <div style={buttonDemoCard}>
          <span
            style={{
              ...badge,
              background: `${GOAL_COLORS.engage}20`,
              color: GOAL_COLORS.engage,
              border: `1px solid ${GOAL_COLORS.engage}40`,
            }}
          >
            Engage
          </span>
          <AccentAnimatedButton onClick={handleClick}>
            ✨ Explore
          </AccentAnimatedButton>
          <span style={buttonDemoDesc}>Playful with particles</span>
        </div>
      </div>

      {/* SmartSection */}
      <h3
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1rem',
          fontWeight: 600,
          color: PALETTE.textPrimary,
          marginBottom: '16px',
          marginTop: '32px',
        }}
      >
        📦 SmartSection
      </h3>
      <p style={{ ...cardSubtitle, marginBottom: '16px' }}>
        Behavior-aware sections that observe scroll, hover, and dwell signals.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SmartSection
          goal="inform"
          pageContext="showcase-info"
          style={{
            padding: '24px',
            border: `1px dashed ${PALETTE.cyan}40`,
            borderRadius: '12px',
            background: `${PALETTE.cyan}08`,
          }}
        >
          <h3
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              color: PALETTE.cyan,
              marginBottom: '8px',
            }}
          >
            📘 Inform Section
          </h3>
          <p
            style={{
              color: PALETTE.textSecondary,
              fontSize: '0.9rem',
              lineHeight: 1.6,
            }}
          >
            Scroll to or hover this section — it dispatches behavior signals to the
            FLUXXIS engine for real-time adaptation.
          </p>
        </SmartSection>

        <SmartSection
          goal="convert"
          pageContext="showcase-pricing"
          style={{
            padding: '24px',
            border: `1px dashed ${PALETTE.violet}40`,
            borderRadius: '12px',
            background: `${PALETTE.violet}08`,
          }}
        >
          <h3
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              color: PALETTE.violet,
              marginBottom: '8px',
            }}
          >
            🔄 Convert Section
          </h3>
          <p
            style={{
              color: PALETTE.textSecondary,
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginBottom: '12px',
            }}
          >
            High-intent zone. Dwell time here signals buying intent.
          </p>
          <SmartCTA
            goal="convert"
            defaultCopy="Buy Now"
            variant="primary"
            onClick={handleClick}
          />
        </SmartSection>
      </div>

      {/* Intent Color Reference */}
      <h3
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1rem',
          fontWeight: 600,
          color: PALETTE.textPrimary,
          marginBottom: '16px',
          marginTop: '32px',
        }}
      >
        🎨 Intent Color Mapping
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
        }}
      >
        {Object.entries(INTENT_COLORS).map(([intent, color]) => (
          <div
            key={intent}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: `${color}10`,
              border: `1px solid ${color}30`,
              borderRadius: '10px',
            }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '4px',
                background: color,
                boxShadow: `0 0 8px ${color}60`,
              }}
            />
            <span
              style={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                color,
                textTransform: 'capitalize',
              }}
            >
              {intent}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComponentGallery
