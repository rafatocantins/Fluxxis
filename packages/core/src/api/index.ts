/**
 * API Layer
 *
 * LLM integration for copy generation with privacy-first design
 */

// Privacy Filter
export { PrivacyFilter, filterPII, validateNoPII } from './PrivacyFilter';
export type { PrivacyFilterOptions } from './PrivacyFilter';

// Copy Generation
export { generateCopy } from './copyGeneration';
export { clearCopyCache } from './copyCache';
export type {
  CopyGenerationRequest,
  CopyGenerationResponse,
  CopyGenerationConfig,
} from './copyGeneration';

// Prompts
export {
  createCTAPrompt,
  createHeadlinePrompt,
  createMicrocopyPrompt,
  COPY_GENERATION_SYSTEM_PROMPT,
} from './copyPrompts';

// Constants
export const API_BASE_URL = process.env.REACT_APP_API_URL ?? '/api';

/**
 * API response type
 */
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}
