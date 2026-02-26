/**
 * Core type definitions for the AI Design System
 */

/**
 * Goal types that components can declare
 */
export type GoalType = 'convert' | 'inform' | 'engage';

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
