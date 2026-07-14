// Design Token System — Fluxxis v2.0
// Aligned with canonical palette: violet #7C5CFF, cyan #2EE6D6, pink #FF5C9D, amber #FFB454

export interface DesignTokens {
  palette: {
    primary: string
    onPrimary: string
    primaryContainer: string
    onPrimaryContainer: string
    secondary: string
    onSecondary: string
    secondaryContainer: string
    onSecondaryContainer: string
    tertiary: string
    onTertiary: string
    error: string
    onError: string
    surface: string
    onSurface: string
    surfaceVariant: string
    onSurfaceVariant: string
    outline: string
    background: string
    onBackground: string
  }
  typography: {
    fontFamily: string
    display: { size: string; weight: string; lineHeight: string }
    headline: { size: string; weight: string; lineHeight: string }
    title: { size: string; weight: string; lineHeight: string }
    body: { size: string; weight: string; lineHeight: string }
    label: { size: string; weight: string; lineHeight: string }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
  }
  shape: {
    extraSmall: string
    small: string
    medium: string
    large: string
    extraLarge: string
    full: string
  }
  elevation: {
    level0: string
    level1: string
    level2: string
    level3: string
    level4: string
    level5: string
  }
  state: {
    hoverOpacity: number
    focusOpacity: number
    pressedOpacity: number
    disabledOpacity: number
    draggedOpacity: number
  }
  animation: {
    durationShort: string
    durationMedium: string
    durationLong: string
    easingStandard: string
    easingEmphasized: string
    easingDecelerate: string
    easingAccelerate: string
  }
}

// Fluxxis v2.0 — Canonical Palette aligned
// Consume CSS tokens via var(--flux-*) for runtime theming
export const materialTokens: DesignTokens = {
  palette: {
    primary: '#8B6DFF',        // violet
    onPrimary: '#2D1060',
    primaryContainer: '#EBE5FF',
    onPrimaryContainer: '#1E0060',
    secondary: '#2EE6D6',       // cyan
    onSecondary: '#003733',
    secondaryContainer: '#D4FBFA',
    onSecondaryContainer: '#00201D',
    tertiary: '#FF5C9D',        // pink
    onTertiary: '#4A0020',
    error: '#B3261E',
    onError: '#FFFFFF',
    surface: '#FFFBFE',
    onSurface: '#1C1B1F',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
    background: '#FFFBFE',
    onBackground: '#1C1B1F'
  },
  typography: {
    fontFamily: 'Sora, sans-serif',
    display: { size: '36px', weight: '400', lineHeight: '44px' },
    headline: { size: '24px', weight: '400', lineHeight: '32px' },
    title: { size: '16px', weight: '500', lineHeight: '24px' },
    body: { size: '14px', weight: '400', lineHeight: '20px' },
    label: { size: '12px', weight: '500', lineHeight: '16px' }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  shape: {
    extraSmall: '4px',
    small: '8px',
    medium: '12px',
    large: '16px',
    extraLarge: '24px',
    full: '9999px'
  },
  elevation: {
    level0: 'none',
    level1: '0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
    level2: '0 1px 2px 0 rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)',
    level3: '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px 0 rgba(0,0,0,0.3)',
    level4: '0 6px 10px 4px rgba(0,0,0,0.15), 0 2px 3px 0 rgba(0,0,0,0.3)',
    level5: '0 8px 12px 6px rgba(0,0,0,0.15), 0 4px 4px 0 rgba(0,0,0,0.3)'
  },
  state: {
    hoverOpacity: 0.08,
    focusOpacity: 0.12,
    pressedOpacity: 0.12,
    disabledOpacity: 0.38,
    draggedOpacity: 0.16
  },
  animation: {
    durationShort: '100ms',
    durationMedium: '250ms',
    durationLong: '400ms',
    easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
    easingEmphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    easingDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    easingAccelerate: 'cubic-bezier(0.2, 0, 1, 1)'
  }
}
