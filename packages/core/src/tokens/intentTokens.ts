import type { AnimationType } from '../_internal/types';

/**
 * Intent Tokens — Fluxxis Design Tokens v2.0
 *
 * Goal-driven design tokens for visual adaptations.
 * Each intent type has its own canonical colour from the Fluxxis palette.
 *
 * Canonical Palette:
 *   browse  → cyan   #2EE6D6
 *   buy     → violet #7C5CFF
 *   compare → pink   #FF5C9D
 *   learn   → amber  #FFB454
 */

import type { GoalType } from '../types';

/**
 * Intent types (Fluxxis v2.0)
 * Maps page-intent to a canonical colour token.
 */
export type IntentType = 'browse' | 'buy' | 'compare' | 'learn';

/**
 * Emphasis levels for visual intensity
 */
export type EmphasisLevel = 'subtle' | 'normal' | 'strong';

/**
 * Intent token values for different goals
 */
export interface IntentTokens {
  /** Primary colour for the goal */
  color: string;
  /** Secondary/accent colour */
  accentColor: string;
  /** Background colour */
  backgroundColor: string;
  /** Text colour */
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
  /** Glow effect colour */
  glowColor?: string;
}

// ── Fluxxis v2.0 Canonical Palette ──
const FLUXXIS = {
  violet: 'rgb(139, 109, 255)',   // #8B6DFF
  cyan:   'rgb(46, 230, 214)',   // #2EE6D6
  pink:   'rgb(255, 92, 157)',   // #FF5C9D
  amber:  'rgb(255, 180, 84)',   // #FFB454
} as const;

const FLUXXIS_HEX = {
  violet: '#8B6DFF',
  cyan:   '#2EE6D6',
  pink:   '#FF5C9D',
  amber:  '#FFB454',
} as const;

// ── Intent Tokens v2.0 (browse / buy / compare / learn) ──

export const FLUXXIS_INTENT_TOKENS: Record<IntentType, IntentTokens> = {
  browse: {
    color: FLUXXIS.cyan,
    accentColor: 'rgb(5, 200, 185)',
    backgroundColor: 'rgba(46, 230, 214, 0.08)',
    textColor: 'rgb(17, 24, 39)',
    animation: 'subtle',
    emphasis: 'normal',
    borderRadius: '0.5rem',
    shadow: 'sm',
    transitionDuration: '200ms',
    hoverScale: 1.04,
    glowColor: 'rgba(46, 230, 214, 0.4)',
  },
  buy: {
    color: FLUXXIS.violet,
    accentColor: 'rgb(100, 65, 230)',
    backgroundColor: 'rgba(139, 109, 255, 0.08)',
    textColor: 'rgb(17, 24, 39)',
    animation: 'direct',
    emphasis: 'strong',
    borderRadius: '0.5rem',
    shadow: 'md',
    transitionDuration: '200ms',
    hoverScale: 1.05,
    glowColor: 'rgba(139, 109, 255, 0.4)',
  },
  compare: {
    color: FLUXXIS.pink,
    accentColor: 'rgb(230, 60, 130)',
    backgroundColor: 'rgba(255, 92, 157, 0.08)',
    textColor: 'rgb(17, 24, 39)',
    animation: 'playful',
    emphasis: 'normal',
    borderRadius: '0.5rem',
    shadow: 'md',
    transitionDuration: '250ms',
    hoverScale: 1.06,
    glowColor: 'rgba(255, 92, 157, 0.4)',
  },
  learn: {
    color: FLUXXIS.amber,
    accentColor: 'rgb(235, 155, 45)',
    backgroundColor: 'rgba(255, 180, 84, 0.08)',
    textColor: 'rgb(17, 24, 39)',
    animation: 'subtle',
    emphasis: 'normal',
    borderRadius: '0.5rem',
    shadow: 'sm',
    transitionDuration: '200ms',
    hoverScale: 1.03,
    glowColor: 'rgba(255, 180, 84, 0.4)',
  },
};

/**
 * Default intent tokens by GoalType (convert / inform / engage)
 * Aligned with Fluxxis v2.0 palette.
 */
export const INTENT_TOKENS: Record<GoalType, IntentTokens> = {
  convert: {
    color: FLUXXIS.violet,
    accentColor: 'rgb(100, 65, 230)',
    backgroundColor: 'rgba(139, 109, 255, 0.08)',
    textColor: 'rgb(17, 24, 39)',
    animation: 'direct',
    emphasis: 'strong',
    borderRadius: '0.5rem',
    shadow: 'md',
    transitionDuration: '200ms',
    hoverScale: 1.05,
    glowColor: 'rgba(139, 109, 255, 0.4)',
  },
  inform: {
    color: FLUXXIS.cyan,
    accentColor: 'rgb(5, 200, 185)',
    backgroundColor: 'rgba(46, 230, 214, 0.08)',
    textColor: 'rgb(17, 24, 39)',
    animation: 'subtle',
    emphasis: 'normal',
    borderRadius: '0.375rem',
    shadow: 'sm',
    transitionDuration: '150ms',
    hoverScale: 1.02,
  },
  engage: {
    color: FLUXXIS.pink,
    accentColor: 'rgb(230, 60, 130)',
    backgroundColor: 'rgba(255, 92, 157, 0.08)',
    textColor: 'rgb(17, 24, 39)',
    animation: 'playful',
    emphasis: 'normal',
    borderRadius: '0.75rem',
    shadow: 'md',
    transitionDuration: '300ms',
    hoverScale: 1.08,
    glowColor: 'rgba(255, 92, 157, 0.4)',
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

// ── Helper functions ──

export function getIntentTokens(goal: GoalType, emphasis?: EmphasisLevel): IntentTokens {
  const baseTokens = INTENT_TOKENS[goal];
  if (!emphasis || emphasis === baseTokens.emphasis) return baseTokens;
  return { ...baseTokens, ...EMPHASIS_MODIFIERS[emphasis] };
}

export function getFluxxisIntentTokens(intent: IntentType, emphasis?: EmphasisLevel): IntentTokens {
  const baseTokens = FLUXXIS_INTENT_TOKENS[intent];
  if (!emphasis || emphasis === baseTokens.emphasis) return baseTokens;
  return { ...baseTokens, ...EMPHASIS_MODIFIERS[emphasis] };
}

export function getIntentCSSVariables(goal: GoalType, emphasis?: EmphasisLevel): Record<string, string> {
  const tokens = getIntentTokens(goal, emphasis);
  return mapTokensToCSSVars(tokens);
}

export function getFluxxisCSSVariables(intent: IntentType, emphasis?: EmphasisLevel): Record<string, string> {
  const tokens = getFluxxisIntentTokens(intent, emphasis);
  return mapTokensToCSSVars(tokens);
}

function mapTokensToCSSVars(tokens: IntentTokens): Record<string, string> {
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

export function getIntentAnimation(animation: AnimationType, duration = '2s'): string {
  return `${animation} ${duration} ease-in-out infinite`;
}

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
 * Generate complete intent stylesheet for GoalType intents
 */
export function generateIntentStylesheet(): string {
  const goalTypes: GoalType[] = ['convert', 'inform', 'engage'];
  const emphasisLevels: EmphasisLevel[] = ['subtle', 'normal', 'strong'];
  let css = `/* Intent Tokens — Auto-generated (Fluxxis v2.0) */\n\n`;

  Object.entries(ANIMATION_KEYFRAMES).forEach(([, keyframes]) => { css += keyframes; });

  goalTypes.forEach(goal => {
    const tokens = INTENT_TOKENS[goal];
    css += `\n.intent--${goal} {\n`;
    Object.entries(mapTokensToCSSVars(tokens)).forEach(([k, v]) => { css += `  ${k}: ${v};\n`; });
    css += '}\n';

    emphasisLevels.forEach(emphasis => {
      const modifiers = EMPHASIS_MODIFIERS[emphasis];
      css += `\n.intent--${goal}.intent--emphasis-${emphasis} {\n  --intent-emphasis: ${emphasis};\n  --intent-shadow: ${modifiers.shadow || tokens.shadow};\n  --intent-hover-scale: ${modifiers.hoverScale || tokens.hoverScale};\n  --intent-transition-duration: ${modifiers.transitionDuration || tokens.transitionDuration};\n${modifiers.glowColor ? `  --intent-glow-color: ${modifiers.glowColor};\n` : ''}}\n`;
    });
  });

  css += `\n/* Intent Utility Classes */\n.intent-color { color: var(--intent-color); }\n.intent-bg { background-color: var(--intent-background-color); }\n.intent-border { border-color: var(--intent-color); }\n.intent-glow { box-shadow: 0 0 20px var(--intent-glow-color); }\n.intent-hover:hover { transform: scale(var(--intent-hover-scale)); }\n`;
  return css;
}

/**
 * Generate intent stylesheet for Fluxxis intent types (browse/buy/compare/learn)
 */
export function generateFluxxisStylesheet(): string {
  const intentTypes: IntentType[] = ['browse', 'buy', 'compare', 'learn'];
  const emphasisLevels: EmphasisLevel[] = ['subtle', 'normal', 'strong'];
  let css = `/* Fluxxis Intent Tokens v2.0 — Auto-generated */\n\n`;

  Object.entries(ANIMATION_KEYFRAMES).forEach(([, keyframes]) => { css += keyframes; });

  intentTypes.forEach(intent => {
    const tokens = FLUXXIS_INTENT_TOKENS[intent];
    css += `\n.fluxxis-intent--${intent} {\n`;
    Object.entries(mapTokensToCSSVars(tokens)).forEach(([k, v]) => { css += `  ${k}: ${v};\n`; });
    css += '}\n';

    emphasisLevels.forEach(emphasis => {
      const modifiers = EMPHASIS_MODIFIERS[emphasis];
      css += `\n.fluxxis-intent--${intent}.fluxxis-intent--emphasis-${emphasis} {\n  --intent-emphasis: ${emphasis};\n  --intent-shadow: ${modifiers.shadow || tokens.shadow};\n  --intent-hover-scale: ${modifiers.hoverScale || tokens.hoverScale};\n  --intent-transition-duration: ${modifiers.transitionDuration || tokens.transitionDuration};\n${modifiers.glowColor ? `  --intent-glow-color: ${modifiers.glowColor};\n` : ''}}\n`;
    });
  });

  css += `\n/* Fluxxis Utility Classes */\n.fluxxis-intent-color { color: var(--intent-color); }\n.fluxxis-intent-bg { background-color: var(--intent-background-color); }\n.fluxxis-intent-border { border-color: var(--intent-color); }\n.fluxxis-intent-glow { box-shadow: 0 0 20px var(--intent-glow-color); }\n.fluxxis-intent-hover:hover { transform: scale(var(--intent-hover-scale)); }\n`;
  return css;
}

export function injectIntentStyles(): void {
  if (typeof document === 'undefined') return;
  const existingStyle = document.getElementById('intent-tokens-style');
  if (existingStyle) return;
  const style = document.createElement('style');
  style.id = 'intent-tokens-style';
  style.textContent = generateIntentStylesheet();
  document.head.appendChild(style);
}

export function applyIntentTokens(element: HTMLElement, goal: GoalType, emphasis?: EmphasisLevel): void {
  const variables = getIntentCSSVariables(goal, emphasis);
  Object.entries(variables).forEach(([property, value]) => { element.style.setProperty(property, value); });
  element.classList.add(`intent--${goal}`);
  if (emphasis) element.classList.add(`intent--emphasis-${emphasis}`);
}

export function applyFluxxisIntentTokens(element: HTMLElement, intent: IntentType, emphasis?: EmphasisLevel): void {
  const variables = getFluxxisCSSVariables(intent, emphasis);
  Object.entries(variables).forEach(([property, value]) => { element.style.setProperty(property, value); });
  element.classList.add(`fluxxis-intent--${intent}`);
  if (emphasis) element.classList.add(`fluxxis-intent--emphasis-${emphasis}`);
}

// Re-export canonical palette for direct use
export { FLUXXIS, FLUXXIS_HEX };
