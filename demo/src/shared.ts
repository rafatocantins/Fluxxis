// ──────────────────────────────────────
// Shared design tokens & style helpers — Fluxxis v2.0
// Consumes CSS tokens via var(--flux-*)
// ──────────────────────────────────────

// Canonical palette (fallback for non-CSS contexts)
export const PALETTE = {
  violet: 'var(--flux-violet, #8B6DFF)',
  cyan:   'var(--flux-cyan, #2EE6D6)',
  pink:   'var(--flux-pink, #FF5C9D)',
  amber:  'var(--flux-amber, #FFB454)',
  darkBg:       'var(--flux-bg-primary, #0a0a0f)',
  cardBg:       'var(--flux-bg-card, #14141f)',
  cardBorder:   'var(--flux-border-default, #1e1e2e)',
  textPrimary:  'var(--flux-text-primary, #e4e4ed)',
  textSecondary:'var(--flux-text-secondary, #9d9db5)',
  textMuted:    'var(--flux-text-muted, #8b8ba0)',
}

// Intent-to-colour mapping (canonical Fluxxis v2.0)
export const INTENT_COLORS: Record<string, string> = {
  browse:  PALETTE.cyan,
  buy:     PALETTE.violet,
  compare: PALETTE.pink,
  learn:   PALETTE.amber,
}

// Goal-to-colour mapping
export const GOAL_COLORS: Record<string, string> = {
  convert: PALETTE.violet,
  inform:  PALETTE.cyan,
  engage:  PALETTE.pink,
}

// ── Common inline styles (using CSS tokens) ──

export const card: React.CSSProperties = {
  background: PALETTE.cardBg,
  border: '1px solid ' + PALETTE.cardBorder,
  borderRadius: 'var(--flux-radius-xl, 1rem)',
  padding: 'var(--flux-space-xl, 2rem)',
  marginBottom: '1.5rem',
}

export const cardTitle: React.CSSProperties = {
  fontFamily: 'var(--flux-font-display, Sora, sans-serif)',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: PALETTE.textPrimary,
  marginBottom: '0.5rem',
}

export const cardSubtitle: React.CSSProperties = {
  fontSize: '0.95rem',
  color: PALETTE.textSecondary,
  marginBottom: '1.5rem',
  lineHeight: 1.6,
}

export const badge: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: 'var(--flux-radius-full, 9999px)',
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  marginBottom: '0.5rem',
}

export const sectionHeading: React.CSSProperties = {
  fontFamily: 'var(--flux-font-display, Sora, sans-serif)',
  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
  fontWeight: 700,
  color: PALETTE.textPrimary,
  textAlign: 'center' as const,
  marginBottom: '0.75rem',
}

export const sectionSubheading: React.CSSProperties = {
  fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
  color: PALETTE.textSecondary,
  textAlign: 'center' as const,
  maxWidth: '620px',
  margin: '0 auto 2.5rem',
  lineHeight: 1.7,
}
