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

// Hooks
export { useBehaviorObserver } from './hooks/useBehaviorObserver';
export { useDwellTime } from './hooks/useDwellTime';
export { useIntersectionObserver } from './hooks/useIntersectionObserver';

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

// Utils
export { goalValidator } from './utils/goalValidation';

// Version
export const VERSION = '0.1.0';
