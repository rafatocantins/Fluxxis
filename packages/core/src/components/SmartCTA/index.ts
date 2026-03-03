/**
 * SmartCTA Component
 *
 * An intent-driven CTA component with beautiful animated button variants.
 * Supports three goal-driven variants:
 * - Primary (convert): Bold, attention-grabbing with shimmer effects
 * - Secondary (inform): Clean, professional with subtle animations
 * - Accent (engage): Playful, interactive with rainbow and particle effects
 */

export { SmartCTA } from './SmartCTA';
export {
  AnimatedButton,
  PrimaryAnimatedButton,
  SecondaryAnimatedButton,
  AccentAnimatedButton,
  ShimmerButton,
  RainbowButton,
  BlurFadeButton,
  IconButton,
} from './AnimatedButtonVariants';
export type {
  SmartCTAProps,
  SmartCTAState,
} from './types';
export type {
  AnimatedButtonProps,
  ShimmerButtonProps,
  RainbowButtonProps,
  BlurFadeButtonProps,
  IconButtonProps,
} from './AnimatedButtonVariants';
