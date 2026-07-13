import React from 'react'
import {
  SmartCTA,
  createIntent,
  materialTokens,
  ConsentManager,
  IntentProvider,
  useFluxxisIntent
} from '@fluxxis/wrapper'
import { PALETTE, sectionSubheading, card } from './shared'

const wrapperDemoCard: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '24px',
  background: PALETTE.darkBg,
  borderRadius: '12px',
  border: `1px solid ${PALETTE.cardBorder}`,
  alignItems: 'center',
}

const wrapperMeta: React.CSSProperties = {
  fontSize: '0.8rem',
  color: PALETTE.textMuted,
  fontFamily: '"Fira Code", monospace',
  textAlign: 'center',
  lineHeight: 1.6,
}

// ── Inner demo (uses intent from provider) ──

const WrapperDemoInner: React.FC = () => {
  const { intent, confidence, signals } = useFluxxisIntent()
  const [clickCount, setClickCount] = React.useState(0)

  return (
    <div style={card}>
      <h2 style={{
        fontFamily: 'Sora, sans-serif',
        fontSize: '1.5rem',
        fontWeight: 700,
        color: PALETTE.textPrimary,
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        🧩 Fluxxis Wrapper — Material Design 3 PoC
      </h2>
      <p style={{ ...sectionSubheading, marginBottom: '24px' }}>
        O botao abaixo adapta-se ao teu <strong>comportamento</strong>. O{' '}
        <code style={{ color: PALETTE.cyan }}>IntentProvider</code> analisa
        sinais locais (page views, scroll, clicks, dwell) e ajusta o intent em
        tempo real. Clica nos botoes da pagina e ve o CTA mudar.
      </p>

      {/* Current intent display */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '24px',
        padding: '16px',
        background: `${PALETTE.violet}10`,
        borderRadius: '10px',
        border: `1px solid ${PALETTE.violet}30`,
        maxWidth: '600px',
        margin: '0 auto 24px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: PALETTE.textMuted, textTransform: 'uppercase' }}>Intent</div>
          <div style={{ fontWeight: 700, color: PALETTE.cyan, fontSize: '1.1rem' }}>{intent.intent.toUpperCase()}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: PALETTE.textMuted, textTransform: 'uppercase' }}>Goal</div>
          <div style={{ fontWeight: 700, color: PALETTE.pink, fontSize: '1.1rem' }}>{intent.goal.toUpperCase()}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: PALETTE.textMuted, textTransform: 'uppercase' }}>Confidence</div>
          <div style={{ fontWeight: 700, color: PALETTE.amber, fontSize: '1.1rem' }}>{(confidence * 100).toFixed(0)}%</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: PALETTE.textMuted, textTransform: 'uppercase' }}>Signals</div>
          <div style={{ fontWeight: 700, color: PALETTE.violet, fontSize: '1.1rem' }}>{signals.pageViews}</div>
        </div>
      </div>

      {/* Live CTA */}
      <div style={wrapperDemoCard}>
        <span style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: PALETTE.textSecondary
        }}>
          Adaptive CTA — driven by your behavior
        </span>
        <SmartCTA
          intent={intent}
          designTokens={materialTokens}
          onClick={() => setClickCount(c => c + 1)}
        />
        <span style={wrapperMeta}>
          intent={intent.intent} goal={intent.goal}{'\n'}
          emphasis={intent.component.visual.emphasis}{'\n'}
          copy="{intent.component.copy.primary}"{'\n'}
          clicks on CTA: {clickCount}
        </span>
      </div>

      {/* Reference: static variants */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1rem',
          fontWeight: 600,
          color: PALETTE.textSecondary,
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          Static reference (what each intent looks like)
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {[
            { label: 'Buy/Convert', schema: createIntent('buy', 'convert', 'Buy Now', 'high', 'primary', 'subtle_pulse'), color: PALETTE.pink },
            { label: 'Learn/Inform', schema: createIntent('learn', 'inform', 'Read Docs', 'medium', 'secondary', 'none'), color: PALETTE.cyan },
            { label: 'Browse/Engage', schema: createIntent('browse', 'engage', 'Try Demo', 'low', 'tertiary', 'blur_fade'), color: PALETTE.violet }
          ].map(({ label, schema, color }) => (
            <div key={label} style={{
              ...wrapperDemoCard,
              border: `1px solid ${color}30`
            }}>
              <span style={{ fontSize: '0.75rem', color, fontWeight: 600 }}>{label}</span>
              <SmartCTA intent={schema} designTokens={materialTokens} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Outer wrapper with ConsentManager + IntentProvider ──

const WrapperDemo: React.FC = () => {
  return (
    <>
      <ConsentManager clientName="FLUXXIS Demo" />
      <IntentProvider refreshIntervalMs={5000}>
        <WrapperDemoInner />
      </IntentProvider>
    </>
  )
}

export default WrapperDemo
