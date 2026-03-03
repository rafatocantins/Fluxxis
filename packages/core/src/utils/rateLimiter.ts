/**
 * Rate Limiter
 * 
 * Prevents excessive API calls with exponential backoff
 */

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  nextAllowed: number;
  backoffMs: number;
  isLimited: boolean;
}

const DEFAULT_BACKOFF_MS = 1000; // 1 second
const MAX_BACKOFF_MS = 60000; // 1 minute
const MAX_ATTEMPTS = 5;

class RateLimiter {
  private state: Map<string, RateLimitState> = new Map();

  /**
   * Check if request is allowed
   */
  canRequest(key: string = 'default'): { allowed: boolean; retryAfter?: number } {
    const state = this.state.get(key);
    
    if (!state) {
      return { allowed: true };
    }

    if (!state.isLimited) {
      return { allowed: true };
    }

    const now = Date.now();
    if (now >= state.nextAllowed) {
      // Reset after backoff period
      this.state.delete(key);
      return { allowed: true };
    }

    return {
      allowed: false,
      retryAfter: Math.ceil((state.nextAllowed - now) / 1000),
    };
  }

  /**
   * Record a failed request (rate limited)
   */
  recordFailure(key: string = 'default'): void {
    const existing = this.state.get(key);
    const now = Date.now();

    if (!existing) {
      // First failure
      this.state.set(key, {
        attempts: 1,
        lastAttempt: now,
        nextAllowed: now + DEFAULT_BACKOFF_MS,
        backoffMs: DEFAULT_BACKOFF_MS,
        isLimited: true,
      });
    } else {
      // Exponential backoff
      const newBackoff = Math.min(existing.backoffMs * 2, MAX_BACKOFF_MS);
      const newAttempts = existing.attempts + 1;

      if (newAttempts >= MAX_ATTEMPTS) {
        // Max attempts reached, long cooldown
        this.state.set(key, {
          attempts: newAttempts,
          lastAttempt: now,
          nextAllowed: now + MAX_BACKOFF_MS,
          backoffMs: MAX_BACKOFF_MS,
          isLimited: true,
        });
      } else {
        this.state.set(key, {
          attempts: newAttempts,
          lastAttempt: now,
          nextAllowed: now + newBackoff,
          backoffMs: newBackoff,
          isLimited: true,
        });
      }
    }
  }

  /**
   * Record a successful request
   */
  recordSuccess(key: string = 'default'): void {
    // Reset on success
    this.state.delete(key);
  }

  /**
   * Get current rate limit status
   */
  getStatus(key: string = 'default'): RateLimitState | undefined {
    return this.state.get(key);
  }

  /**
   * Clear rate limit for a key
   */
  clear(key: string = 'default'): void {
    this.state.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.state.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Hook-friendly rate limit check
 */
export function checkRateLimit(key: string = 'default'): {
  allowed: boolean;
  retryAfter?: number;
  attempts?: number;
} {
  const result = rateLimiter.canRequest(key);
  const status = rateLimiter.getStatus(key);

  return {
    allowed: result.allowed,
    retryAfter: result.retryAfter,
    attempts: status?.attempts,
  };
}
