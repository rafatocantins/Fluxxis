/**
 * Tokens
 *
 * Design tokens for goal-driven styling
 */

export {
  INTENT_TOKENS,
  EMPHASIS_MODIFIERS,
  ANIMATION_KEYFRAMES,
  getIntentTokens,
  getIntentCSSVariables,
  getIntentAnimation,
  getShadowCSS,
  generateIntentStylesheet,
  injectIntentStyles,
  applyIntentTokens,
} from './intentTokens';

export type { IntentTokens, EmphasisLevel } from './intentTokens';
export type { AnimationType } from '../_internal/types';
