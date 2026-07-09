import React, { useState } from 'react'
import {
  FluxxisProvider,
  useIntent,
  SmartCTA,
  SmartSection,
  PrimaryAnimatedButton,
  SecondaryAnimatedButton,
  AccentAnimatedButton,
  ShimmerButton,
  RainbowButton,
  BlurFadeButton,
} from '@fluxxis/react'
import type { IntentResolution, GoalType, PriorityType } from '@fluxxis/core'

// ──────────────────────────────────────
// Design tokens (Lena's palette)
// ──────────────────────────────────────
const PALETTE = {
  violet: '#7C5CFF',
  cyan: '#2EE6D6',
  pink: '#FF5C9D',
  amber: '#FFB454',
  darkBg: '#0a0a0f',
  cardBg: '#14141f',
  cardBorder: '#1e1e2e',
  textPrimary: '#e4e4ed',
  textSecondary: '#9d9db5',
  textMuted: '#6b6b80',
}

const INTENT_COLORS: Record<string, string> = {
  browse: PALETTE.cyan,
  buy: PALETTE.violet,
  compare: PALETTE.pink,
  learn: PALETTE.amber,
}

const GOAL_COLORS: Record<string, string> = {
  convert: PALETTE.violet,
  inform: PALETTE.cyan,
  engage: PALETTE.pink,
}

// ──────────────────────────────────────
// Shared inline style helpers
// ──────────────────────────────────────
const card: React.CSSProperties = {
  background: PALETTE.cardBg,
  border: `1px solid ${PALETTE.cardBorder}`,
  borderRadius: '16px',
  padding: '32px',
  marginBottom: '24px',
}

const cardTitle: React.CSSProperties = {
  fontFamily: 'Sora, sans-serif',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: PALETTE.textPrimary,
  marginBottom: '8px',
}

const cardSubtitle: React.CSSProperties = {
  fontSize: '0.95rem',
  color: PALETTE.textSecondary,
  marginBottom: '24px',
  lineHeight: 1.6,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: PALETTE.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '6px',
}

const selectStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: '0.9rem',
  borderRadius: '8px',
  border: `1px solid ${PALETTE.cardBorder}`,
  background: PALETTE.darkBg,
  color: PALETTE.textPrimary,
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  minWidth: '160px',
}

const controlGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}

const controlRow: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  marginBottom: '24px',
}

const resolutionGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '12px',
}

const resolutionItem: React.CSSProperties = {
  background: PALETTE.darkBg,
  borderRadius: '10px',
  padding: '14px 16px',
  border: `1px solid ${PALETTE.cardBorder}`,
}

const resolutionLabel: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: PALETTE.textMuted,
  marginBottom: '4px',
}

const resolutionValue: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 500,
  color: PALETTE.textPrimary,
  fontFamily: 'Inter, monospace',
  wordBreak: 'break-word',
}

const badge: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '9999px',
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '8px',
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

const microcopyBox: React.CSSProperties = {
  background: `linear-gradient(135deg, ${PALETTE.violet}15, ${PALETTE.cyan}10)`,
  border: `1px solid ${PALETTE.violet}40`,
  borderRadius: '10px',
  padding: '16px 20px',
  marginTop: '12px',
}

const structuredDataBox: React.CSSProperties = {
  background: PALETTE.darkBg,
  border: `1px solid ${PALETTE.cardBorder}`,
  borderRadius: '10px',
  padding: '16px',
  marginTop: '12px',
  fontFamily: '"Fira Code", "Cascadia Code", monospace',
  fontSize: '0.78rem',
  lineHeight: 1.5,
  color: PALETTE.cyan,
  overflowX: 'auto',
  maxHeight: '220px',
  overflowY: 'auto',
  whiteSpace: 'pre-wrap',
}

// ──────────────────────────────────────
// Intent Playground (inner — uses useIntent)
// ──────────────────────────────────────
interface PlaygroundControls {
  goal: GoalType
  priority: PriorityType
  actorType: 'human' | 'agent'
}

const IntentPlayground: React.FC = () => {
  const [controls, setControls] = useState<PlaygroundControls>({
    goal: 'convert',
    priority: 'normal',
    actorType: 'human',
  })

  const resolution: IntentResolution = useIntent({
    goal: controls.goal,
    priority: controls.priority,
    actorType: controls.actorType,
  })

  const update = (field: keyof PlaygroundControls, value: string) => {
    setControls((prev) => ({ ...prev, [field]: value }))
  }

  const goalColor = GOAL_COLORS[controls.goal] || PALETTE.violet

  return (
    <div style={card}>
      <h2 style={cardTitle}>🎛️ Intent Resolution Playground</h2>
      <p style={cardSubtitle}>
        Tune the intent parameters below and observe how FLUXXIS resolves them in
        real time. Every combination of <strong style={{ color: PALETTE.cyan }}>goal</strong>,{' '}
        <strong style={{ color: PALETTE.pink }}>priority</strong>, and{' '}
        <strong style={{ color: PALETTE.amber }}>actorType</strong> produces a unique{' '}
        <code
          style={{
            background: `${PALETTE.violet}20`,
            color: PALETTE.violet,
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.85rem',
          }}
        >
          IntentResolution
        </code>
        .
      </p>

      {/* Controls */}
      <div style={controlRow}>
        <div style={controlGroup}>
          <label style={labelStyle}>Goal</label>
          <select
            style={{ ...selectStyle, borderColor: goalColor }}
            value={controls.goal}
            onChange={(e) => update('goal', e.target.value)}
          >
            <option value="convert">🔄 Convert</option>
            <option value="inform">📘 Inform</option>
            <option value="engage">✨ Engage</option>
          </select>
        </div>

        <div style={controlGroup}>
          <label style={labelStyle}>Priority</label>
          <select
            style={selectStyle}
            value={controls.priority}
            onChange={(e) => update('priority', e.target.value)}
          >
            <option value="low">🟢 Low</option>
            <option value="normal">🟡 Normal</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div style={controlGroup}>
          <label style={labelStyle}>Actor Type</label>
          <select
            style={selectStyle}
            value={controls.actorType}
            onChange={(e) => update('actorType', e.target.value as 'human' | 'agent')}
          >
            <option value="human">👤 Human</option>
            <option value="agent">🤖 Agent</option>
          </select>
        </div>
      </div>

      {/* Resolution Grid */}
      <div style={resolutionGrid}>
        <Field label="Emphasis" value={resolution.emphasis} />
        <Field label="Animation" value={resolution.animation} />
        <Field label="Hierarchy" value={resolution.hierarchy} />
        <Field label="Density" value={resolution.density} />
        {resolution.dataFormat && <Field label="Data Format" value={resolution.dataFormat} />}
      </div>

      {/* Microcopy */}
      {resolution.microcopy && (
        <div style={microcopyBox}>
          <span style={{ ...labelStyle, marginBottom: '4px' }}>Microcopy</span>
          <span
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: PALETTE.textPrimary,
            }}
          >
            "{resolution.microcopy}"
          </span>
        </div>
      )}

      {/* API Surface (agent-only) */}
      {resolution.apiSurface && (
        <div style={{ ...card, marginTop: '16px', background: PALETTE.darkBg }}>
          <span style={{ ...labelStyle, marginBottom: '8px' }}>API Surface</span>
          <div style={resolutionGrid}>
            <Field label="Schema" value={resolution.apiSurface.schemaType} />
            <Field label="Batch" value={String(resolution.apiSurface.batchSupport)} />
            <Field label="Streaming" value={String(resolution.apiSurface.streamingSupport)} />
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.82rem', color: PALETTE.textMuted }}>
            Endpoint: <code style={{ color: PALETTE.cyan }}>{resolution.apiSurface.endpoint}</code>
          </div>
        </div>
      )}

      {/* Negotiation Protocol (agent-only) */}
      {resolution.negotiationProtocol && (
        <div style={{ ...card, marginTop: '16px', background: PALETTE.darkBg }}>
          <span style={{ ...labelStyle, marginBottom: '8px' }}>Negotiation Protocol</span>
          <div style={resolutionGrid}>
            <Field label="Protocol" value={resolution.negotiationProtocol.protocol} />
            <Field label="Max Rounds" value={String(resolution.negotiationProtocol.maxRounds)} />
            <Field label="Enabled" value={String(resolution.negotiationProtocol.enabled)} />
          </div>
        </div>
      )}

      {/* Structured Data */}
      {resolution.structuredData && (
        <div style={structuredDataBox}>
          <span style={{ ...labelStyle, marginBottom: '8px', color: PALETTE.amber }}>
            Structured Data (JSON-LD)
          </span>
          {JSON.stringify(resolution.structuredData, null, 2)}
        </div>
      )}

      {/* Cache Headers */}
      {resolution.cacheHeaders && (
        <div style={{ marginTop: '12px', fontSize: '0.82rem', color: PALETTE.textMuted }}>
          Cache: max-age={resolution.cacheHeaders.maxAge}s, etag={resolution.cacheHeaders.etag}
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────
// Tiny field component for resolution grid
// ──────────────────────────────────────
const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={resolutionItem}>
    <div style={resolutionLabel}>{label}</div>
    <div style={resolutionValue}>{value}</div>
  </div>
)

// ──────────────────────────────────────
// Main App
// ──────────────────────────────────────
function App() {
  const [clickCount, setClickCount] = useState(0)

  const handleClick = () => {
    setClickCount((prev) => prev + 1)
  }

  return (
    <FluxxisProvider options={{ includeAgentFields: true }}>
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '40px 24px 80px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* ── HERO ── */}
        <header style={{ textAlign: 'center', padding: '64px 0 48px' }}>
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
            Adaptive Structural Interface Engine
          </div>

          <h1
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '20px',
              background: `linear-gradient(135deg, ${PALETTE.violet} 0%, ${PALETTE.cyan} 50%, ${PALETTE.pink} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            FLUXXIS
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              color: PALETTE.textSecondary,
              maxWidth: '680px',
              margin: '0 auto 16px',
              lineHeight: 1.7,
            }}
          >
            Interfaces are living systems. FLUXXIS interprets intent signals in
            real time, morphing structure and microcopy for every user — human
            or agent.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '24px',
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
        </header>

        {/* ── INTENT PLAYGROUND ── */}
        <IntentPlayground />

        {/* ── COMPONENT GALLERY ── */}
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
                  defaultCopy={goal === 'convert' ? 'Get Started' : goal === 'inform' ? 'Learn More' : 'Try It Now'}
                  variant={goal === 'convert' ? 'primary' : goal === 'inform' ? 'secondary' : 'primary'}
                  onClick={handleClick}
                />
                <span style={buttonDemoDesc}>
                  Clicks: {clickCount}
                </span>
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
              <PrimaryAnimatedButton onClick={handleClick}>Start Free Trial</PrimaryAnimatedButton>
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
              <SecondaryAnimatedButton onClick={handleClick}>View Docs</SecondaryAnimatedButton>
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
              <AccentAnimatedButton onClick={handleClick}>✨ Explore</AccentAnimatedButton>
              <span style={buttonDemoDesc}>Playful with particles</span>
            </div>
          </div>
        </div>

        {/* SmartSection */}
        <div style={card}>
          <h2 style={cardTitle}>📦 SmartSection</h2>
          <p style={cardSubtitle}>
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
              <p style={{ color: PALETTE.textSecondary, fontSize: '0.9rem', lineHeight: 1.6 }}>
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
              <p style={{ color: PALETTE.textSecondary, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '12px' }}>
                High-intent zone. Dwell time here signals buying intent.
              </p>
              <SmartCTA goal="convert" defaultCopy="Buy Now" variant="primary" onClick={handleClick} />
            </SmartSection>
          </div>
        </div>

        {/* Intent Color Reference */}
        <div style={card}>
          <h2 style={cardTitle}>🎨 Intent Color Mapping</h2>
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

        {/* Footer */}
        <footer
          style={{
            textAlign: 'center',
            padding: '40px 0 0',
            color: PALETTE.textMuted,
            fontSize: '0.85rem',
          }}
        >
          <p>
            FLUXXIS · Adaptive Structural Interface Engine ·{' '}
            <span style={{ color: PALETTE.violet }}>Dia 2 Showcase</span>
          </p>
        </footer>
      </div>
    </FluxxisProvider>
  )
}

export default App
