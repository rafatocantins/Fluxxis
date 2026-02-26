/**
 * SmartCTA Component Types
 */

import type { GoalType } from '../../types';
import type { BrandVoiceConfig } from '../../types/brandVoice';

/**
 * Props for the SmartCTA component
 */
export interface SmartCTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Primary goal of the CTA */
  goal: GoalType;
  /** Default copy text (fallback when LLM unavailable) */
  defaultCopy: string;
  /** Page context for intent classification */
  pageContext?: string;
  /** Brand voice configuration for copy generation */
  brandVoice?: BrandVoiceConfig;
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'text';
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SmartCTA state interface
 */
export interface SmartCTAState {
  /** Current copy text */
  copy: string;
  /** Is loading copy from LLM */
  isLoading: boolean;
  /** Did LLM request fail */
  hasError: boolean;
  /** Current emphasis level */
  emphasis: 'subtle' | 'normal' | 'strong';
  /** Is component in floating state */
  isFloating: boolean;
}
