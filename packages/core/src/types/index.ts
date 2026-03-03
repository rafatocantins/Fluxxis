/**
 * Core type definitions for the AI Design System
 */

/**
 * Data format types for structured data
 */
export type DataFormatType = 'json-ld' | 'microdata' | 'rdfa' | 'api' | 'html';

/**
 * Animation types for intent-driven UI
 */
export type AnimationType = 'none' | 'subtle' | 'playful' | 'urgent' | 'direct';

/**
 * Priority levels
 */
export type PriorityType = 'low' | 'normal' | 'high';

/**
 * Goal types that components can declare
 */
export type GoalType = 'convert' | 'inform' | 'engage';

/**
 * Signal types
 */
export type SignalType =
  | 'hover'
  | 'click'
  | 'scroll'
  | 'dwell'
  | 'viewport'
  | 'focus'
  | 'blur'
  | 'api-call';

/**
 * Actor type (human or agent)
 */
export type ActorType = 'human' | 'agent' | 'unknown';

/**
 * Signal context
 */
export interface SignalContext {
  /** Component ID where signal originated */
  componentId?: string;
  /** Page/URL where signal occurred */
  page?: string;
  /** Device type */
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  /** User type (if known) */
  userType?: 'new' | 'returning' | 'power';
  /** Position (for hover/click) */
  position?: {
    x: number;
    y: number;
  };
  /** Scroll velocity (pixels/second) */
  scrollVelocity?: number;
  /** Scroll depth (0-100%) */
  scrollDepth?: number;
  /** API endpoint (for api-call signals) */
  endpoint?: string;
  /** Source of signal */
  source?: 'ui' | 'api' | 'system';
  /** Additional context */
  [key: string]: any;
}

/**
 * Signal interface (shared between signals and structured-data)
 */
export interface Signal {
  type: SignalType;
  value: number;
  timestamp: number;
  actorType?: ActorType;
  detectionConfidence?: number;
  context?: SignalContext;
  sessionId?: string;
  intent?: {
    goal: GoalType;
    priority: PriorityType;
  };
}

/**
 * Goal declaration contract that all smart components must implement
 */
export interface GoalDeclaration {
  /** Primary goal of the component */
  goal: GoalType;
  /** Secondary goal (optional) */
  secondaryGoal?: GoalType;
  /** Page context where component is rendered */
  pageContext: string;
  /** Section identifier */
  sectionId?: string;
  /** Unique node identifier */
  nodeId: string;
}

/**
 * Success metrics for different goal types
 */
export interface GoalMetrics {
  /** Goal completion rate (0-1) */
  completionRate: number;
  /** Number of interactions */
  interactions: number;
  /** Average dwell time in milliseconds */
  avgDwellTime: number;
  /** Last interaction timestamp */
  lastInteraction?: number;
}

/**
 * Intervention levels (1-8)
 * 1-3: Automatic (Token, Emphasis, Animation)
 * 4-5: Automatic monitored (Copy, Component Variant)
 * 6-8: Human approval required (Section, Layout, Page Structure)
 */
export type InterventionLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Protection status for high-performing nodes
 */
export interface ProtectionStatus {
  /** Is node protected from modifications */
  isProtected: boolean;
  /** Performance above baseline percentage */
  performanceAboveBaseline: number;
  /** Protection level (1-8) */
  protectionLevel: InterventionLevel;
}

// Re-export BrandVoice types
export type {
  BrandTone,
  CTAStyle,
  VocabularyLevel,
  BrandPersonality,
  BrandVoiceConfig,
} from './brandVoice';

export {
  validateBrandVoice,
  mergeBrandVoiceConfig,
  getToneDescription,
  getCTAStyleDescription,
  formatBrandVoiceForDisplay,
  DEFAULT_BRAND_VOICE,
} from './brandVoice';

// Re-export presets
export {
  BRAND_VOICE_PRESETS,
  TONE_PRESETS,
  AUDIENCE_PRESETS,
  getBrandVoicePreset,
  getTonePreset,
  getAudiencePreset,
  createBrandVoice,
} from './brandVoicePresets';
