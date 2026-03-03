/**
 * Goal validation utilities
 */

import type { GoalType, GoalDeclaration } from '../types';

/**
 * Valid goal types
 */
const VALID_GOALS: GoalType[] = ['convert', 'inform', 'engage'];

/**
 * Validate if a goal type is valid
 */
export function isValidGoal(goal: string): goal is GoalType {
  return VALID_GOALS.includes(goal as GoalType);
}

/**
 * Validate a goal declaration
 */
export function validateGoalDeclaration(declaration: Partial<GoalDeclaration>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!declaration.goal) {
    errors.push('Goal is required');
  } else if (!isValidGoal(declaration.goal)) {
    errors.push(
      `Invalid goal: ${declaration.goal as string}. Must be one of: ${VALID_GOALS.join(', ')}`
    );
  }

  if (!declaration.pageContext) {
    errors.push('Page context is required');
  }

  if (!declaration.nodeId) {
    errors.push('Node ID is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get goal description
 */
export function getGoalDescription(goal: GoalType): string {
  const descriptions: Record<GoalType, string> = {
    convert: 'Drive user action (clicks, signups, purchases)',
    inform: 'Provide information and educate users',
    engage: 'Build interest and interaction',
  };
  return descriptions[goal];
}

/**
 * Get recommended interventions for a goal
 */
export function getRecommendedInterventions(goal: GoalType): string[] {
  const recommendations: Record<GoalType, string[]> = {
    convert: [
      'Emphasize CTA with color and animation',
      'Use direct, action-oriented copy',
      'Position prominently in viewport',
    ],
    inform: [
      'Use clear, readable typography',
      'Provide progressive disclosure',
      'Highlight key information',
    ],
    engage: ['Add interactive elements', 'Use playful animations', 'Encourage exploration'],
  };
  return recommendations[goal];
}

/**
 * Goal validator object for easy import
 */
export const goalValidator = {
  isValid: isValidGoal,
  validateDeclaration: validateGoalDeclaration,
  getDescription: getGoalDescription,
  getRecommendedInterventions,
};
