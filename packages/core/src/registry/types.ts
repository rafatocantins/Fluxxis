/**
 * Node Registry Types
 */

import type { GoalType, InterventionLevel } from '../types';
import type { BrandVoiceConfig } from '../types/brandVoice';

/**
 * Node contract that all smart components must implement
 */
export interface NodeContract {
  /** Unique node identifier */
  id: string;
  /** Primary goal */
  goal: GoalType;
  /** Page context */
  pageContext: string;
  /** Brand voice configuration */
  brandVoice?: BrandVoiceConfig;
  /** Node metrics */
  metrics: NodeMetrics;
  /** Protection level (1-8) */
  protectionLevel: InterventionLevel;
  /** Is node currently protected */
  isProtected: boolean;
  /** Section ID (optional) */
  sectionId?: string;
}

/**
 * Node metrics tracking
 */
export interface NodeMetrics {
  /** Baseline performance (set at registration) */
  baseline: number;
  /** Current performance */
  current: number;
  /** Goal completion rate */
  goalCompletionRate: number;
  /** Total interactions */
  interactions: number;
  /** Average dwell time (ms) */
  avgDwellTime: number;
  /** Last interaction timestamp */
  lastInteraction?: number;
  /** Performance above baseline percentage */
  performanceAboveBaseline: number;
}

/**
 * Create initial node metrics
 */
export function createInitialMetrics(): NodeMetrics {
  return {
    baseline: 0,
    current: 0,
    goalCompletionRate: 0,
    interactions: 0,
    avgDwellTime: 0,
    lastInteraction: undefined,
    performanceAboveBaseline: 0,
  };
}

/**
 * Check if node should be protected
 */
export function shouldProtect(metrics: NodeMetrics, threshold: number = 0.2): boolean {
  return metrics.performanceAboveBaseline >= threshold;
}
