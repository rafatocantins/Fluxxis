/**
 * Tokens
 *
 * Design tokens for goal-driven styling — Fluxxis v2.0
 */

export {
  FLUXXIS,
  FLUXXIS_HEX,
  FLUXXIS_INTENT_TOKENS,
  INTENT_TOKENS,
  EMPHASIS_MODIFIERS,
  ANIMATION_KEYFRAMES,
  getIntentTokens,
  getFluxxisIntentTokens,
  getIntentCSSVariables,
  getFluxxisCSSVariables,
  getIntentAnimation,
  getShadowCSS,
  generateIntentStylesheet,
  generateFluxxisStylesheet,
  injectIntentStyles,
  applyIntentTokens,
  applyFluxxisIntentTokens,
} from './intentTokens';

export type { IntentTokens, EmphasisLevel, IntentType } from './intentTokens';
export type { AnimationType } from '../_internal/types';
