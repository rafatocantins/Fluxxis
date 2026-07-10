// ──────────────────────────────────────
// Shared design tokens & style helpers
// ──────────────────────────────────────

export const PALETTE = {
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

export const INTENT_COLORS: Record<string, string> = {
  browse: PALETTE.cyan,
  buy: PALETTE.violet,
  compare: PALETTE.pink,
  learn: PALETTE.amber,
}

export const GOAL_COLORS: Record<string, string> = {
  convert: PALETTE.violet,
  inform: PALETTE.cyan,
  engage: PALETTE.pink,
}

// ── Common inline styles ──

export const card: React.CSSProperties = {
  background: PALETTE.cardBg,
  border: `1px solid ${PALETTE.cardBorder}`,
  borderRadius: '16px',
  padding: '32px',
  marginBottom: '24px',
}

export const cardTitle: React.CSSProperties = {
  fontFamily: 'Sora, sans-serif',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: PALETTE.textPrimary,
  marginBottom: '8px',
}

export const cardSubtitle: React.CSSProperties = {
  fontSize: '0.95rem',
  color: PALETTE.textSecondary,
  marginBottom: '24px',
  lineHeight: 1.6,
}

export const badge: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '9999px',
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '8px',
}

export const sectionHeading: React.CSSProperties = {
  fontFamily: 'Sora, sans-serif',
  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
  fontWeight: 700,
  color: PALETTE.textPrimary,
  textAlign: 'center',
  marginBottom: '12px',
}

export const sectionSubheading: React.CSSProperties = {
  fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
  color: PALETTE.textSecondary,
  textAlign: 'center',
  maxWidth: '620px',
  margin: '0 auto 40px',
  lineHeight: 1.7,
}
