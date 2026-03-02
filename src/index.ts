/**
 * AI Design System - React Components
 *
 * An intent-driven, goal-first design system with adaptive components powered by AI.
 *
 * @packageDocumentation
 */

// Components
export { SmartCTA } from './components/SmartCTA';
export type { SmartCTAProps } from './components/SmartCTA/types';

// Animated Buttons
export {
  AnimatedButton,
  PrimaryAnimatedButton,
  SecondaryAnimatedButton,
  AccentAnimatedButton,
  ShimmerButton,
  RainbowButton,
  BlurFadeButton,
  IconButton,
} from './components/SmartCTA/AnimatedButtonVariants';
export type { 
  AnimatedButtonProps, 
  ShimmerButtonProps,
  RainbowButtonProps,
  BlurFadeButtonProps,
  IconButtonProps,
} from './components/SmartCTA/AnimatedButtonVariants';

// Hooks
export { useBehaviorObserver } from './hooks/useBehaviorObserver';
export { useDwellTime } from './hooks/useDwellTime';
export { useIntersectionObserver } from './hooks/useIntersectionObserver';
export { useNetworkStatus } from './hooks/useNetworkStatus';

// Stores
export { useUserProfileStore } from './stores/userProfileStore';
export { useNodeRegistryStore } from './stores/nodeRegistryStore';
export { useSessionDataStore } from './stores/sessionDataStore';

// Events
export { EventBus } from './events/EventBus';
export type { EventPayloads, EventHandler, EventSubscription } from './events/types';

// Registry
export { NodeRegistry } from './registry/NodeRegistry';
export type { NodeContract, NodeMetrics } from './registry/types';

// Types
export type { GoalType, GoalDeclaration } from './types/goals';
export type { BrandVoiceConfig } from './types/brandVoice';

// BrandVoice Presets & Utilities
export {
  BRAND_VOICE_PRESETS,
  TONE_PRESETS,
  AUDIENCE_PRESETS,
  getBrandVoicePreset,
  getTonePreset,
  getAudiencePreset,
  createBrandVoice,
  validateBrandVoice,
  mergeBrandVoiceConfig,
  getToneDescription,
  getCTAStyleDescription,
  formatBrandVoiceForDisplay,
  DEFAULT_BRAND_VOICE,
} from './types';

// Tokens
export {
  INTENT_TOKENS,
  getIntentTokens,
  getIntentCSSVariables,
  getIntentAnimation,
  getShadowCSS,
  injectIntentStyles,
  applyIntentTokens,
  generateIntentStylesheet,
} from './tokens';
export type { IntentTokens, EmphasisLevel, AnimationType } from './tokens';

// Accessibility
export {
  checkColorContrast,
  generateAriaLabel,
  isKeyboardAccessible,
  getFocusableElements,
  trapFocus,
  announceToScreenReader,
  prefersReducedMotion,
  validateAccessibilityProps,
  generateAccessibilityReport,
  WCAG_CHECKLIST,
} from './utils/accessibility';
export { injectAccessibilityStyles, addSkipLink, checkTouchTargetSize } from './styles/accessibility';

// Version
export const VERSION = '0.1.0';
