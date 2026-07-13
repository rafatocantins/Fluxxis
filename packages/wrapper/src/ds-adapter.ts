// DS Adapter — Camada 1: Token Mapping Deterministico
// Traduz IntentSchema para ResolvedTokens usando os tokens do design system alvo

import type { DesignTokens } from './tokens/material'
import type { IntentSchema, ResolvedTokens, EmphasisLevel, AnimationStyle, HierarchyLevel } from './intent-schema'

// Mapeamento deterministico: emphasis -> cor do DS
function mapEmphasisToColor(emphasis: EmphasisLevel, tokens: DesignTokens): {
  bg: string
  text: string
} {
  switch (emphasis) {
    case 'high':
      return { bg: tokens.palette.primary, text: tokens.palette.onPrimary }
    case 'medium':
      return { bg: tokens.palette.secondaryContainer, text: tokens.palette.onSecondaryContainer }
    case 'low':
      return { bg: tokens.palette.surfaceVariant, text: tokens.palette.onSurfaceVariant }
  }
}

// Mapeamento: hierarchy -> elevacao + tamanho
function mapHierarchyToElevation(hierarchy: HierarchyLevel, tokens: DesignTokens): {
  shadow: string
  padding: string
} {
  switch (hierarchy) {
    case 'primary':
      return { shadow: tokens.elevation.level3, padding: tokens.spacing.lg }
    case 'secondary':
      return { shadow: tokens.elevation.level1, padding: tokens.spacing.md }
    case 'tertiary':
      return { shadow: tokens.elevation.level0, padding: tokens.spacing.sm }
  }
}

// Mapeamento: animation -> CSS transition
function mapAnimationToTransition(animation: AnimationStyle, tokens: DesignTokens): {
  property: string
  duration: string
  easing: string
  hoverTransform: string
  activeTransform: string
} {
  switch (animation) {
    case 'subtle_pulse':
      return {
        property: 'all',
        duration: tokens.animation.durationMedium,
        easing: tokens.animation.easingStandard,
        hoverTransform: 'scale(1.02)',
        activeTransform: 'scale(0.98)'
      }
    case 'shimmer':
      return {
        property: 'all',
        duration: tokens.animation.durationLong,
        easing: tokens.animation.easingEmphasized,
        hoverTransform: 'scale(1.03)',
        activeTransform: 'scale(0.97)'
      }
    case 'rainbow':
      return {
        property: 'all',
        duration: tokens.animation.durationLong,
        easing: tokens.animation.easingDecelerate,
        hoverTransform: 'scale(1.04)',
        activeTransform: 'scale(0.96)'
      }
    case 'blur_fade':
      return {
        property: 'all',
        duration: tokens.animation.durationMedium,
        easing: tokens.animation.easingStandard,
        hoverTransform: 'none',
        activeTransform: 'scale(0.98)'
      }
    case 'none':
    default:
      return {
        property: 'none',
        duration: '0ms',
        easing: 'linear',
        hoverTransform: 'none',
        activeTransform: 'none'
      }
  }
}

// Mapeamento: hover state -> hover background
function mapHoverBackground(emphasis: EmphasisLevel, tokens: DesignTokens): string {
  const color = mapEmphasisToColor(emphasis, tokens)
  // Aplica hover overlay (state.hoverOpacity) sobre o background
  if (emphasis === 'high') {
    return `color-mix(in srgb, ${color.bg} 92%, #FFFFFF)`
  }
  return `color-mix(in srgb, ${color.bg} 88%, #FFFFFF)`
}

function mapActiveBackground(emphasis: EmphasisLevel, tokens: DesignTokens): string {
  const color = mapEmphasisToColor(emphasis, tokens)
  return `color-mix(in srgb, ${color.bg} 88%, #000000)`
}

// Mapeamento: focus outline
function mapFocusOutline(tokens: DesignTokens): string {
  return `2px solid ${tokens.palette.primary}`
}

// Adapter principal
export function resolveTokens(intent: IntentSchema, tokens: DesignTokens): ResolvedTokens {
  const emphasis = intent.component.visual.emphasis
  const hierarchy = intent.component.visual.hierarchy
  const animation = intent.component.visual.animation

  const colors = mapEmphasisToColor(emphasis, tokens)
  const elevation = mapHierarchyToElevation(hierarchy, tokens)
  const transition = mapAnimationToTransition(animation, tokens)

  return {
    // Base
    backgroundColor: colors.bg,
    textColor: colors.text,
    borderColor: emphasis === 'low' ? tokens.palette.outline : 'transparent',
    borderRadius: tokens.shape.full,
    padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
    fontFamily: tokens.typography.fontFamily,
    fontSize: tokens.typography.label.size,
    fontWeight: tokens.typography.label.weight,
    lineHeight: tokens.typography.label.lineHeight,
    boxShadow: elevation.shadow,

    // Transition
    transition: transition.property !== 'none'
      ? `${transition.property} ${transition.duration} ${transition.easing}`
      : 'none',

    // Hover
    hoverBackgroundColor: mapHoverBackground(emphasis, tokens),
    hoverBoxShadow: hierarchy === 'primary'
      ? tokens.elevation.level4
      : hierarchy === 'secondary'
        ? tokens.elevation.level2
        : tokens.elevation.level1,
    hoverTransform: transition.hoverTransform,

    // Active
    activeBackgroundColor: mapActiveBackground(emphasis, tokens),
    activeTransform: transition.activeTransform,

    // Focus
    focusOutline: mapFocusOutline(tokens),

    // Disabled
    disabledOpacity: tokens.state.disabledOpacity,

    // Copy (Camada 2 — por enquanto deterministico, mantem original)
    copy: intent.component.copy
  }
}
