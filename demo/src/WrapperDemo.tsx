import React from 'react'
import { SmartCTA, createIntent, materialTokens } from '@fluxxis/wrapper'
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

const WrapperDemo: React.FC = () => {
  const [clickCount, setClickCount] = React.useState(0)

  const intents = [
    {
      label: 'Intent: BUY → Goal: CONVERT',
      schema: createIntent('buy', 'convert', 'Buy Now — $29', 'high', 'primary', 'subtle_pulse'),
      color: PALETTE.pink
    },
    {
      label: 'Intent: LEARN → Goal: INFORM',
      schema: createIntent('learn', 'inform', 'Read the Docs', 'medium', 'secondary', 'none'),
      color: PALETTE.cyan
    },
    {
      label: 'Intent: BROWSE → Goal: ENGAGE',
      schema: createIntent('browse', 'engage', 'Try Demo', 'low', 'tertiary', 'blur_fade'),
      color: PALETTE.violet
    }
  ]

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
        Cada botao abaixo partilha o mesmo <code style={{ color: PALETTE.cyan }}>SmartCTA</code> wrapper.
        A unica diferenca e o <strong>IntentSchema</strong>. Os tokens visuais
        (cor, elevacao, animacao, padding) sao resolvidos deterministicamente
        pelo DS Adapter a partir dos <strong>Material Design 3 tokens</strong>.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        maxWidth: '960px',
        margin: '0 auto'
      }}>
        {intents.map(({ label, schema, color }) => (
          <div key={label} style={wrapperDemoCard}>
            <span style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 600,
              color
            }}>
              {label}
            </span>
            <SmartCTA
              intent={schema}
              designTokens={materialTokens}
              onClick={() => setClickCount(c => c + 1)}
            />
            <span style={wrapperMeta}>
              emphasis={schema.component.visual.emphasis}
              {'\n'}hierarchy={schema.component.visual.hierarchy}
              {'\n'}animation={schema.component.visual.animation}
              {'\n'}bg={materialTokens.palette.primary.slice(0, 7)}
              {'\n'}shape={materialTokens.shape.full}
            </span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span style={{ color: PALETTE.textSecondary, fontSize: '0.9rem' }}>
          Total clicks: <strong style={{ color: PALETTE.cyan }}>{clickCount}</strong>
        </span>
      </div>

      <div style={{
        marginTop: '32px',
        padding: '16px 20px',
        background: `${PALETTE.violet}10`,
        border: `1px solid ${PALETTE.violet}30`,
        borderRadius: '10px',
        maxWidth: '680px',
        margin: '32px auto 0'
      }}>
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: PALETTE.violet,
          display: 'block',
          marginBottom: '8px'
        }}>
          DS Adapter — Token Mapping em Accao
        </span>
        <span style={{ ...wrapperMeta, display: 'block' }}>
          intent.emphasis="high" → DS.colors.primary (#6750A4)<br/>
          intent.emphasis="medium" → DS.colors.secondaryContainer<br/>
          intent.emphasis="low" → DS.colors.surfaceVariant<br/>
          intent.hierarchy="primary" → DS.elevation.level3<br/>
          intent.hierarchy="secondary" → DS.elevation.level1<br/>
          intent.hierarchy="tertiary" → DS.elevation.level0<br/>
          intent.animation="subtle_pulse" → hover:scale(1.02) active:scale(0.98)<br/>
          intent.animation="none" → hover/active sem animacao
        </span>
      </div>
    </div>
  )
}

export default WrapperDemo
