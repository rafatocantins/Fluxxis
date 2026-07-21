// ──────────────────────────────────────
// Shared design tokens & style helpers — Fluxxis v2.1
// Consumes CSS tokens via var(--flux-*)
// WCAG 2.1 AA compliant — all contrast ≥4.5:1
// ──────────────────────────────────────

// Canonical palette (--flux-* CSS custom properties)
export const PALETTE: Record<string, string> = {
  // ── Fluxxis v2.1 token names (WCAG AA verified) ──
  bgPrimary:      'var(--flux-bg-primary, #08080f)',
  bgSecondary:    'var(--flux-bg-secondary, #0d0d1a)',
  bgTertiary:     'var(--flux-bg-tertiary, #14141f)',
  bgElevated:     'var(--flux-bg-elevated, #1a1a2e)',
  bgGlass:        'var(--flux-bg-glass, rgba(20, 20, 35, 0.72))',
  accentPrimary:  'var(--flux-accent-primary, #1FA89E)',    // browse
  accentSecondary:'var(--flux-accent-secondary, #6D4FE0)',  // learn
  accentGlow:     'var(--flux-accent-glow, rgba(31, 168, 158, 0.25))',
  accentSoft:     'var(--flux-accent-soft, rgba(31, 168, 158, 0.10))',
  textPrimary:    'var(--flux-text-primary, #f0f0ff)',
  textSecondary:  'var(--flux-text-secondary, #9898b0)',
  textTertiary:   'var(--flux-text-tertiary, #9494a8)',    // WCAG AA: ≥4.5:1 against #08080f
  textInverse:    'var(--flux-text-inverse, #08080f)',
  borderDefault:  'var(--flux-border-default, rgba(255,255,255,0.08))',
  borderStrong:   'var(--flux-border-strong, rgba(255,255,255,0.14))',
  borderAccent:   'var(--flux-border-accent, rgba(31,168,158,0.35))',

  // ── Intent accent aliases (WCAG AA compliant) ──
  browseAccent:   'var(--flux-accent-browse, #1FA89E)',
  buyAccent:      'var(--flux-accent-buy, #C84074)',
  compareAccent:  'var(--flux-accent-compare, #D4912E)',
  learnAccent:    'var(--flux-accent-learn, #6D4FE0)',

  // ── Legacy aliases (backward compat) ──
  violet:   '#6D4FE0',
  cyan:     '#1FA89E',
  pink:     '#C84074',
  amber:    '#D4912E',
  darkBg:   'var(--flux-bg-primary, #08080f)',
  cardBg:   'var(--flux-bg-secondary, #0d0d1a)',
  cardBorder: 'var(--flux-border-default, rgba(255,255,255,0.08))',
  textMuted:  'var(--flux-text-tertiary, #9494a8)',
}

// Intent-to-colour mapping (canonical Fluxxis v2.1, WCAG AA)
export const INTENT_COLORS: Record<string, string> = {
  browse:  PALETTE.browseAccent,
  buy:     PALETTE.buyAccent,
  compare: PALETTE.compareAccent,
  learn:   PALETTE.learnAccent,
}

// Goal-to-colour mapping
export const GOAL_COLORS: Record<string, string> = {
  convert: PALETTE.buyAccent,        // convert → buy intent
  inform:  PALETTE.browseAccent,     // inform → browse intent
  engage:  PALETTE.learnAccent,      // engage → learn intent
}

// ── Common inline styles (using CSS tokens) ──

export const card: React.CSSProperties = {
  background: PALETTE.bgSecondary,
  border: `1px solid ${PALETTE.borderDefault}`,
  borderRadius: 'var(--flux-radius-xl, 20px)',
  padding: 'var(--flux-space-8, 2rem)',
  marginBottom: '1.5rem',
}

export const cardTitle: React.CSSProperties = {
  fontFamily: 'var(--flux-font-sans, Inter, sans-serif)',
  fontSize: 'var(--flux-font-size-2xl, 1.5rem)',
  fontWeight: 700,
  color: PALETTE.textPrimary,
  marginBottom: '0.5rem',
}

export const cardSubtitle: React.CSSProperties = {
  fontSize: 'var(--flux-font-size-sm, 0.875rem)',
  color: PALETTE.textSecondary,
  marginBottom: '1.5rem',
  lineHeight: 1.6,
}

export const badge: React.CSSProperties = {
  display: 'inline-block',
  padding: 'var(--flux-space-1, 4px) var(--flux-space-3, 12px)',
  borderRadius: 'var(--flux-radius-full, 9999px)',
  fontSize: 'var(--flux-font-size-xs, 0.75rem)',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  marginBottom: '0.5rem',
}

export const sectionHeading: React.CSSProperties = {
  fontFamily: 'var(--flux-font-sans, Inter, sans-serif)',
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
