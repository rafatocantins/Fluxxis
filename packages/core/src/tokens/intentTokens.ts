import type { AnimationType } from '../_internal/types';

/**
 * Intent Tokens
 * 
 * Goal-driven design tokens for visual adaptations
 * Each goal type has its own set of tokens for colors, animations, and emphasis
 */

import type { GoalType } from '../types';

/**
 * Emphasis levels for visual intensity
 */
export type EmphasisLevel = 'subtle' | 'normal' | 'strong';

/**
 * Animation types for different goals
 * Note: AnimationType is imported from _shared/types
 */
// export type AnimationType = 'direct' | 'subtle' | 'playful' | 'urgent';

/**
 * Intent token values for different goals
 */
export interface IntentTokens {
  /** Primary color for the goal */
  color: string;
  /** Secondary/accent color */
  accentColor: string;
  /** Background color */
  backgroundColor: string;
  /** Text color */
  textColor: string;
  /** Animation style */
  animation: AnimationType;
  /** Emphasis level */
  emphasis: EmphasisLevel;
  /** Border radius */
  borderRadius: string;
  /** Shadow intensity */
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Transition duration */
  transitionDuration: string;
  /** Scale on hover */
  hoverScale: number;
  /** Glow effect color */
  glowColor?: string;
}

/**
 * Default intent tokens by goal type
 */
export const INTENT_TOKENS: Record<GoalType, IntentTokens> = {
  convert: {
    color: 'rgb(59, 130, 246)', // blue-500
    accentColor: 'rgb(37, 99, 235)', // blue-600
    backgroundColor: 'rgb(239, 246, 255)', // blue-50
    textColor: 'rgb(17, 24, 39)', // gray-900
    animation: 'direct',
    emphasis: 'strong',
    borderRadius: '0.5rem',
    shadow: 'md',
    transitionDuration: '200ms',
    hoverScale: 1.05,
    glowColor: 'rgba(59, 130, 246, 0.4)',
  },
  inform: {
    color: 'rgb(107, 114, 128)', // gray-500
    accentColor: 'rgb(75, 85, 99)', // gray-600
    backgroundColor: 'rgb(249, 250, 251)', // gray-50
    textColor: 'rgb(31, 41, 55)', // gray-800
    animation: 'subtle',
    emphasis: 'normal',
    borderRadius: '0.375rem',
    shadow: 'sm',
    transitionDuration: '150ms',
    hoverScale: 1.02,
  },
  engage: {
    color: 'rgb(168, 85, 247)', // purple-500
    accentColor: 'rgb(147, 51, 234)', // purple-600
    backgroundColor: 'rgb(250, 245, 255)', // purple-50
    textColor: 'rgb(17, 24, 39)', // gray-900
    animation: 'playful',
    emphasis: 'normal',
    borderRadius: '0.75rem',
    shadow: 'md',
    transitionDuration: '300ms',
    hoverScale: 1.08,
    glowColor: 'rgba(168, 85, 247, 0.4)',
  },
};

/**
 * Emphasis-based token modifiers
 */
export const EMPHASIS_MODIFIERS: Record<EmphasisLevel, Partial<IntentTokens>> = {
  subtle: {
    shadow: 'sm',
    hoverScale: 1.02,
    transitionDuration: '150ms',
  },
  normal: {
    shadow: 'md',
    hoverScale: 1.05,
    transitionDuration: '200ms',
  },
  strong: {
    shadow: 'lg',
    hoverScale: 1.08,
    transitionDuration: '300ms',
    glowColor: 'rgba(255, 255, 255, 0.3)',
  },
};

/**
 * Animation keyframes by type
 */
export const ANIMATION_KEYFRAMES: Record<AnimationType, string> = {
  none: '',
  direct: `
    @keyframes intent-direct {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  subtle: `
    @keyframes intent-subtle {
      0% { opacity: 0.95; }
      50% { opacity: 1; }
      100% { opacity: 0.95; }
    }
  `,
  playful: `
    @keyframes intent-playful {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(-2deg); }
      75% { transform: rotate(2deg); }
      100% { transform: rotate(0deg); }
    }
  `,
  urgent: `
    @keyframes intent-urgent {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `,
};

/**
 * Get intent tokens for a goal type
 */
export function getIntentTokens(goal: GoalType, emphasis?: EmphasisLevel): IntentTokens {
  const baseTokens = INTENT_TOKENS[goal];

  if (!emphasis || emphasis === baseTokens.emphasis) {
    return baseTokens;
  }

  // Apply emphasis modifiers
  const modifiers = EMPHASIS_MODIFIERS[emphasis];
  return {
    ...baseTokens,
    ...modifiers,
  };
}

/**
 * Get CSS custom properties for intent tokens
 */
export function getIntentCSSVariables(
  goal: GoalType,
  emphasis?: EmphasisLevel
): Record<string, string> {
  const tokens = getIntentTokens(goal, emphasis);

  return {
    '--intent-color': tokens.color,
    '--intent-accent-color': tokens.accentColor,
    '--intent-background-color': tokens.backgroundColor,
    '--intent-text-color': tokens.textColor,
    '--intent-animation': tokens.animation,
    '--intent-emphasis': tokens.emphasis,
    '--intent-border-radius': tokens.borderRadius,
    '--intent-shadow': tokens.shadow,
    '--intent-transition-duration': tokens.transitionDuration,
    '--intent-hover-scale': tokens.hoverScale.toString(),
    '--intent-glow-color': tokens.glowColor || 'transparent',
  };
}

/**
 * Get animation CSS for intent type
 */
export function getIntentAnimation(animation: AnimationType, duration: string = '2s'): string {
  return `${animation} ${duration} ease-in-out infinite`;
}

/**
 * Get shadow CSS for shadow level
 */
export function getShadowCSS(shadow: IntentTokens['shadow']): string {
  const shadows: Record<IntentTokens['shadow'], string> = {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  };
  return shadows[shadow];
}

/**
 * Generate complete intent stylesheet
 */
export function generateIntentStylesheet(): string {
  const goalTypes: GoalType[] = ['convert', 'inform', 'engage'];
  const emphasisLevels: EmphasisLevel[] = ['subtle', 'normal', 'strong'];

  let css = `
/* Intent Tokens - Auto-generated */
/* Goal-based design tokens for adaptive components */

`;

  // Generate animation keyframes
  Object.entries(ANIMATION_KEYFRAMES).forEach(([, keyframes]) => {
    css += keyframes;
  });

  // Generate goal-based CSS variables
  goalTypes.forEach(goal => {
    const tokens = INTENT_TOKENS[goal];

    css += `
.intent--${goal} {
  --intent-color: ${tokens.color};
  --intent-accent-color: ${tokens.accentColor};
  --intent-background-color: ${tokens.backgroundColor};
  --intent-text-color: ${tokens.textColor};
  --intent-animation: ${tokens.animation};
  --intent-emphasis: ${tokens.emphasis};
  --intent-border-radius: ${tokens.borderRadius};
  --intent-shadow: ${tokens.shadow};
  --intent-transition-duration: ${tokens.transitionDuration};
  --intent-hover-scale: ${tokens.hoverScale};
  --intent-glow-color: ${tokens.glowColor || 'transparent'};
}
`;

    // Generate emphasis variants
    emphasisLevels.forEach(emphasis => {
      const modifiers = EMPHASIS_MODIFIERS[emphasis];
      css += `
.intent--${goal}.intent--emphasis-${emphasis} {
  --intent-emphasis: ${emphasis};
  --intent-shadow: ${modifiers.shadow || tokens.shadow};
  --intent-hover-scale: ${modifiers.hoverScale || tokens.hoverScale};
  --intent-transition-duration: ${modifiers.transitionDuration || tokens.transitionDuration};
  ${modifiers.glowColor ? `--intent-glow-color: ${modifiers.glowColor};` : ''}
}
`;
    });
  });

  // Generate utility classes
  css += `
/* Intent Utility Classes */
.intent-color { color: var(--intent-color); }
.intent-bg { background-color: var(--intent-background-color); }
.intent-border { border-color: var(--intent-color); }
.intent-glow { box-shadow: 0 0 20px var(--intent-glow-color); }
.intent-hover:hover { transform: scale(var(--intent-hover-scale)); }
`;

  return css;
}

/**
 * Inject intent styles into document head
 */
export function injectIntentStyles(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const existingStyle = document.getElementById('intent-tokens-style');
  if (existingStyle) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'intent-tokens-style';
  style.textContent = generateIntentStylesheet();
  document.head.appendChild(style);
}

/**
 * Apply intent tokens to an element
 */
export function applyIntentTokens(
  element: HTMLElement,
  goal: GoalType,
  emphasis?: EmphasisLevel
): void {
  const variables = getIntentCSSVariables(goal, emphasis);
  Object.entries(variables).forEach(([property, value]) => {
    element.style.setProperty(property, value);
  });

  // Add goal class
  element.classList.add(`intent--${goal}`);

  // Add emphasis class if specified
  if (emphasis) {
    element.classList.add(`intent--emphasis-${emphasis}`);
  }
}
