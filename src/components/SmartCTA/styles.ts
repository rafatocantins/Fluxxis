/**
 * SmartCTA Styles
 *
 * Intent-driven styles that adapt based on goal type
 */

import type { GoalType } from '../../types';

/**
 * Base styles for SmartCTA component
 */
export const smartCTAStyles = `
.smart-cta {
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: var(--intent-border-radius, 0.5rem);
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Intent tokens */
  background-color: var(--intent-color);
  color: white;
  box-shadow: var(--intent-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  
  /* Animation */
  animation: var(--intent-animation, none);
}

.smart-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.smart-cta:active {
  transform: translateY(0);
}

.smart-cta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Variant styles */
.smart-cta--primary {
  font-weight: 700;
  padding: 0.875rem 1.75rem;
}

.smart-cta--secondary {
  background-color: transparent;
  color: var(--intent-color);
  border: 2px solid var(--intent-color);
}

.smart-cta--text {
  background-color: transparent;
  color: var(--intent-color);
  box-shadow: none;
  padding: 0.5rem 1rem;
}

.smart-cta--text:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: none;
  box-shadow: none;
}

/* Emphasis levels */
.smart-cta--emphasis-subtle {
  opacity: 0.8;
  transform: scale(0.95);
}

.smart-cta--emphasis-normal {
  opacity: 1;
  transform: scale(1);
}

.smart-cta--emphasis-strong {
  opacity: 1;
  transform: scale(1.05);
  animation: pulse 2s infinite;
}

/* Floating state */
.smart-cta--floating {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Goal-specific animations */
@keyframes pulse {
  0%, 100% {
    transform: scale(1.05);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* Accessibility */
.smart-cta:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.smart-cta:focus:not(:focus-visible) {
  outline: none;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .smart-cta {
    animation: none;
    transition: none;
  }
  
  .smart-cta:hover,
  .smart-cta:active {
    transform: none;
  }
  
  .smart-cta--emphasis-strong {
    animation: none;
  }
}
`;

/**
 * Get goal-specific CSS custom properties
 */
export function getGoalStyles(goal: GoalType): Record<string, string> {
  const styles: Record<GoalType, Record<string, string>> = {
    convert: {
      '--intent-color': 'rgb(59, 130, 246)',
      '--intent-accent-color': 'rgb(37, 99, 235)',
      '--intent-animation': 'none',
      '--intent-border-radius': '0.5rem',
      '--intent-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    inform: {
      '--intent-color': 'rgb(107, 114, 128)',
      '--intent-accent-color': 'rgb(75, 85, 99)',
      '--intent-animation': 'none',
      '--intent-border-radius': '0.375rem',
      '--intent-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    engage: {
      '--intent-color': 'rgb(168, 85, 247)',
      '--intent-accent-color': 'rgb(147, 51, 234)',
      '--intent-animation': 'pulse 2s infinite',
      '--intent-border-radius': '0.75rem',
      '--intent-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
  };

  return styles[goal];
}
