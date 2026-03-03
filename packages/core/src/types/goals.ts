/**
 * Goal types and declarations for the AI Design System
 */

import { GoalType, GoalDeclaration, GoalMetrics, InterventionLevel } from './index';

export type { GoalType, GoalDeclaration, GoalMetrics, InterventionLevel };

/**
 * Mapping of goal types to their success metrics
 */
export const GOAL_SUCCESS_METRICS: Record<GoalType, string> = {
  convert: 'Click-through rate',
  inform: 'Scroll depth, dwell time',
  engage: 'Interaction rate',
};

/**
 * Validate if a goal type is valid
 */
export function isValidGoalType(goal: string): goal is GoalType {
  return ['convert', 'inform', 'engage'].includes(goal);
}

/**
 * Get the primary success metric for a goal type
 */
export function getGoalSuccessMetric(goal: GoalType): string {
  return GOAL_SUCCESS_METRICS[goal] || 'Unknown';
}

/**
 * Check if intervention is allowed based on protection level
 */
export function canIntervene(
  currentLevel: InterventionLevel,
  protectionLevel: InterventionLevel
): boolean {
  // Higher protection levels block more interventions
  if (protectionLevel >= 6) {
    return currentLevel >= 6; // Only human-approved interventions
  }
  if (protectionLevel >= 4) {
    return currentLevel >= 4; // No automatic copy/variant changes
  }
  return true; // All interventions allowed
}
