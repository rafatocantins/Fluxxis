/**
 * Intent Tokens
 *
 * Design tokens for goal-driven visual treatments
 */

import type { GoalType } from '../types';

/**
 * Intent token values for different goals
 */
export interface IntentTokens {
  /** Primary color for the goal */
  color: string;
  /** Secondary/accent color */
  accentColor: string;
  /** Animation style */
  animation: 'direct' | 'subtle' | 'playful';
  /** Emphasis level */
  emphasis: 'subtle' | 'normal' | 'strong';
  /** Border radius */
  borderRadius: string;
  /** Shadow intensity */
  shadow: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Default intent tokens by goal type
 */
export const INTENT_TOKENS: Record<GoalType, IntentTokens> = {
  convert: {
    color: 'rgb(59, 130, 246)', // blue-500
    accentColor: 'rgb(37, 99, 235)', // blue-600
    animation: 'direct',
    emphasis: 'strong',
    borderRadius: '0.5rem',
    shadow: 'md',
  },
  inform: {
    color: 'rgb(107, 114, 128)', // gray-500
    accentColor: 'rgb(75, 85, 99)', // gray-600
    animation: 'subtle',
    emphasis: 'normal',
    borderRadius: '0.375rem',
    shadow: 'sm',
  },
  engage: {
    color: 'rgb(168, 85, 247)', // purple-500
    accentColor: 'rgb(147, 51, 234)', // purple-600
    animation: 'playful',
    emphasis: 'normal',
    borderRadius: '0.75rem',
    shadow: 'md',
  },
};

/**
 * Get intent tokens for a goal type
 */
export function getIntentTokens(goal: GoalType): IntentTokens {
  return INTENT_TOKENS[goal];
}

/**
 * Get CSS custom properties for intent tokens
 */
export function getIntentCSSVariables(goal: GoalType): Record<string, string> {
  const tokens = INTENT_TOKENS[goal];
  return {
    '--intent-color': tokens.color,
    '--intent-accent-color': tokens.accentColor,
    '--intent-animation': tokens.animation,
    '--intent-emphasis': tokens.emphasis,
    '--intent-border-radius': tokens.borderRadius,
    '--intent-shadow': tokens.shadow,
  };
}
