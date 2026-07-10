// Fluxxis Wrapper — Intent-Driven Design System Adaptation Layer
// Phase 0: Material Design 3 Proof of Concept
// Phase 0.5: Tracking + Consent

export { SmartCTA, createIntent } from './SmartCTA'
export { resolveTokens } from './ds-adapter'
export { materialTokens } from './tokens/material'
export type { DesignTokens } from './tokens/material'
export type {
  IntentSchema,
  ResolvedTokens,
  IntentType,
  GoalType,
  PriorityType,
  ActorType,
  EmphasisLevel,
  AnimationStyle,
  HierarchyLevel,
  CopyVariants,
  ComponentState,
  IntentVisual,
  IntentComponent
} from './intent-schema'
export {
  Tracker,
  initTracker,
  getTracker,
  ConsentManager,
  IntentProvider,
  useFluxxisIntent,
  recordSignal
} from './tracking'
export type { SignalType, SignalPayload, TrackerConfig, ConsentConfig } from './tracking'
