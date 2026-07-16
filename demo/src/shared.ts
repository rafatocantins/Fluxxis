// ──────────────────────────────────────
// Shared design tokens & style helpers — Fluxxis v2.0
// Consumes CSS tokens via var(--fx-*)
// Aligned with Fluxxis v2.0 dark theme design spec
// ──────────────────────────────────────

// Canonical palette (--fx-* CSS custom properties)
// Uses 'any' to support legacy property aliases for backward compat
export const PALETTE: Record<string, string> = {
  // ── New Fluxxis v2.0 token names ──
  bgPrimary:      'var(--fx-bg-primary, #08080f)',
  bgSecondary:    'var(--fx-bg-secondary, #0e0e18)',
  bgTertiary:     'var(--fx-bg-tertiary, #14141f)',
  bgElevated:     'var(--fx-bg-elevated, #1a1a2e)',
  bgGlass:        'var(--fx-bg-glass, rgba(20, 20, 35, 0.72))',
  accentPrimary:  'var(--fx-accent-primary, #00d4aa)',
  accentSecondary:'var(--fx-accent-secondary, #22d3ee)',
  accentGlow:     'var(--fx-accent-glow, rgba(0, 212, 170, 0.28))',
  accentSoft:     'var(--fx-accent-soft, rgba(0, 212, 170, 0.10))',
  textPrimary:    'var(--fx-text-primary, #f0f0f5)',
  textSecondary:  'var(--fx-text-secondary, #b0b0c0)',
  textTertiary:   'var(--fx-text-tertiary, #787890)',
  textInverse:    'var(--fx-text-inverse, #08080f)',
  borderDefault:  'var(--fx-border-default, rgba(255,255,255,0.08))',
  borderStrong:   'var(--fx-border-strong, rgba(255,255,255,0.14))',
  borderAccent:   'var(--fx-border-accent, rgba(0,212,170,0.35))',

  // ── Legacy aliases (backward compat with existing components) ──
  violet:   'var(--fx-accent-primary, #00d4aa)',
  cyan:     'var(--fx-accent-secondary, #22d3ee)',
  pink:     'var(--fx-accent-secondary, #22d3ee)',
  amber:    '#f7b93e',
  darkBg:   'var(--fx-bg-primary, #08080f)',
  cardBg:   'var(--fx-bg-secondary, #0e0e18)',
  cardBorder: 'var(--fx-border-default, rgba(255,255,255,0.08))',
  textMuted:  'var(--fx-text-tertiary, #787890)',
}

// Intent-to-colour mapping (canonical Fluxxis v2.0)
export const INTENT_COLORS: Record<string, string> = {
  browse:  PALETTE.accentPrimary,
  buy:     PALETTE.accentSecondary,
  compare: '#f7b93e',   // amber/gold for compare
  learn:   PALETTE.accentPrimary,
}

// Goal-to-colour mapping
export const GOAL_COLORS: Record<string, string> = {
  convert: PALETTE.accentPrimary,
  inform:  PALETTE.accentSecondary,
  engage:  '#f7b93e',
}

// ── Common inline styles (using CSS tokens) ──

export const card: React.CSSProperties = {
  background: PALETTE.bgSecondary,
  border: `1px solid ${PALETTE.borderDefault}`,
  borderRadius: 'var(--fx-radius-xl, 20px)',
  padding: 'var(--fx-space-8, 2rem)',
  marginBottom: '1.5rem',
}

export const cardTitle: React.CSSProperties = {
  fontFamily: 'var(--fx-font-sans, Inter, sans-serif)',
  fontSize: 'var(--fx-font-size-2xl, 1.5rem)',
  fontWeight: 700,
  color: PALETTE.textPrimary,
  marginBottom: '0.5rem',
}

export const cardSubtitle: React.CSSProperties = {
  fontSize: 'var(--fx-font-size-sm, 0.875rem)',
  color: PALETTE.textSecondary,
  marginBottom: '1.5rem',
  lineHeight: 1.6,
}

export const badge: React.CSSProperties = {
  display: 'inline-block',
  padding: 'var(--fx-space-1, 4px) var(--fx-space-3, 12px)',
  borderRadius: 'var(--fx-radius-full, 9999px)',
  fontSize: 'var(--fx-font-size-xs, 0.75rem)',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  marginBottom: '0.5rem',
}

export const sectionHeading: React.CSSProperties = {
  fontFamily: 'var(--fx-font-sans, Inter, sans-serif)',
  fontSize: 'clamp(1.6rem, 3vw, 2.75rem)',
  fontWeight: 800,
  color: PALETTE.textPrimary,
  textAlign: 'center' as const,
  marginBottom: '0.75rem',
  letterSpacing: '-0.02em',
}

export const sectionSubheading: React.CSSProperties = {
  fontSize: 'clamp(0.9rem, 1.5vw, 1.125rem)',
  color: PALETTE.textSecondary,
  textAlign: 'center' as const,
  maxWidth: '620px',
  margin: '0 auto 2.5rem',
  lineHeight: 1.7,
}
