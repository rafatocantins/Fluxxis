// SmartCTA — Intent-Driven Call-to-Action Wrapper
// Recebe um IntentSchema, resolve tokens via DS Adapter,
// renderiza com os tokens do design system alvo

import React from 'react'
import type { IntentSchema, ResolvedTokens } from './intent-schema'
import { resolveTokens } from './ds-adapter'
import { materialTokens } from './tokens/material'
import type { DesignTokens } from './tokens/material'

interface SmartCTAProps {
  intent: IntentSchema
  onClick?: () => void
  disabled?: boolean
  designTokens?: DesignTokens
  className?: string
}

export const SmartCTA: React.FC<SmartCTAProps> = ({
  intent,
  onClick,
  disabled = false,
  designTokens = materialTokens,
  className
}) => {
  const tokens: ResolvedTokens = resolveTokens(intent, designTokens)

  const [isHovered, setIsHovered] = React.useState(false)
  const [isPressed, setIsPressed] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)

  const getCurrentStyle = (): React.CSSProperties => {
    let style: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: tokens.padding,
      backgroundColor: tokens.backgroundColor,
      color: tokens.textColor,
      border: `1px solid ${tokens.borderColor}`,
      borderRadius: tokens.borderRadius,
      fontFamily: tokens.fontFamily,
      fontSize: tokens.fontSize,
      fontWeight: tokens.fontWeight,
      lineHeight: tokens.lineHeight,
      boxShadow: tokens.boxShadow,
      transition: tokens.transition,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? tokens.disabledOpacity : 1,
      outline: 'none',
      textDecoration: 'none',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent'
    }

    if (isPressed && !disabled) {
      style = {
        ...style,
        backgroundColor: tokens.activeBackgroundColor,
        transform: tokens.activeTransform,
        boxShadow: 'none'
      }
    } else if (isHovered && !disabled) {
      style = {
        ...style,
        backgroundColor: tokens.hoverBackgroundColor,
        boxShadow: tokens.hoverBoxShadow,
        transform: tokens.hoverTransform
      }
    }

    if (isFocused && !disabled) {
      style = {
        ...style,
        outline: tokens.focusOutline,
        outlineOffset: '2px'
      }
    }

    return style
  }

  const copy = tokens.copy.primary

  return (
    <button
      className={className}
      style={getCurrentStyle()}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-label={copy}
      role="button"
    >
      {intent.goal === 'convert' && '🚀 '}
      {intent.goal === 'inform' && '📘 '}
      {intent.goal === 'engage' && '✨ '}
      {copy}
    </button>
  )
}

// Helper: criar IntentSchema para um intent especifico
export function createIntent(
  intent: IntentSchema['intent'],
  goal: IntentSchema['goal'],
  copy: string,
  emphasis: IntentSchema['component']['visual']['emphasis'] = 'high',
  hierarchy: IntentSchema['component']['visual']['hierarchy'] = 'primary',
  animation: IntentSchema['component']['visual']['animation'] = 'subtle_pulse'
): IntentSchema {
  return {
    intent,
    goal,
    priority: 'normal',
    actor: 'human',
    component: {
      type: 'cta',
      copy: {
        primary: copy,
        secondary: undefined,
        microcopy: undefined
      },
      visual: {
        emphasis,
        hierarchy,
        animation
      },
      state: {
        default: 'visible',
        hover: 'elevate+glow',
        active: 'depress',
        focus: 'ring',
        disabled: 'muted'
      }
    }
  }
}

export type { SmartCTAProps }
