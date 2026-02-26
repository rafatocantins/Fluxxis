/**
 * API Layer
 */

// Placeholder for API utilities
// To be implemented in P1-14: Copy generation via Edge Function

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
