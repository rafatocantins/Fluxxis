import React, { useState } from 'react'
import { useIntent } from '@fluxxis/react'
import type { IntentResolution, GoalType, PriorityType } from '@fluxxis/core'
import {
  PALETTE,
  GOAL_COLORS,
  card,
  cardTitle,
  cardSubtitle,
} from './shared'

// ── Styles ──

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

// ── Tiny field component ──

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={resolutionItem}>
    <div style={resolutionLabel}>{label}</div>
    <div style={resolutionValue}>{value}</div>
  </div>
)

// ── Playground Controls ──

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
        real time. Every combination of{' '}
        <strong style={{ color: PALETTE.cyan }}>goal</strong>,{' '}
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
            &ldquo;{resolution.microcopy}&rdquo;
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
            Endpoint:{' '}
            <code style={{ color: PALETTE.cyan }}>{resolution.apiSurface.endpoint}</code>
          </div>
        </div>
      )}

      {/* Negotiation Protocol (agent-only) */}
      {resolution.negotiationProtocol && (
        <div style={{ ...card, marginTop: '16px', background: PALETTE.darkBg }}>
          <span style={{ ...labelStyle, marginBottom: '8px' }}>Negotiation Protocol</span>
          <div style={resolutionGrid}>
            <Field label="Protocol" value={resolution.negotiationProtocol.protocol} />
            <Field
              label="Max Rounds"
              value={String(resolution.negotiationProtocol.maxRounds)}
            />
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
          Cache: max-age={resolution.cacheHeaders.maxAge}s, etag=
          {resolution.cacheHeaders.etag}
        </div>
      )}
    </div>
  )
}

export default IntentPlayground
