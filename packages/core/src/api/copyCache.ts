/**
 * Copy Cache
 * 
 * LocalStorage-based caching for AI-generated copy
 * Provides offline fallback and reduces API calls
 */

import type { CopyGenerationResponse } from '../api/copyGeneration';

const CACHE_PREFIX = '@ia-design-system/copy-cache:';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CachedCopy {
  response: CopyGenerationResponse;
  timestamp: number;
  expiresAt: number;
  key: string;
}

/**
 * Generate cache key from request parameters
 */
export function generateCacheKey(
  goal: string,
  pageContext: string,
  defaultCopy: string,
  brandVoiceHash: string,
  provider?: string
): string {
  // Include provider in cache key so different providers have separate caches
  return `${provider || 'default'}:${goal}:${pageContext}:${defaultCopy}:${brandVoiceHash}`;
}

/**
 * Simple hash function for brand voice
 */
function hashBrandVoice(brandVoice: any): string {
  const str = JSON.stringify(brandVoice);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Get cached copy
 */
export function getCachedCopy(
  goal: string,
  pageContext: string,
  defaultCopy: string,
  brandVoice: any,
  provider?: string
): CopyGenerationResponse | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const key = generateCacheKey(goal, pageContext, defaultCopy, hashBrandVoice(brandVoice), provider);
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    
    if (!cached) {
      return null;
    }

    const parsed: CachedCopy = JSON.parse(cached);
    
    // Check if expired
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return parsed.response;
  } catch (error) {
    console.warn('[CopyCache] Failed to retrieve cached copy:', error);
    return null;
  }
}

/**
 * Set cached copy
 */
export function setCachedCopy(
  goal: string,
  pageContext: string,
  defaultCopy: string,
  brandVoice: any,
  response: CopyGenerationResponse,
  ttl: number = DEFAULT_TTL,
  provider?: string
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = generateCacheKey(goal, pageContext, defaultCopy, hashBrandVoice(brandVoice), provider);
    const cached: CachedCopy = {
      response,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      key,
    };

    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cached));
  } catch (error) {
    console.warn('[CopyCache] Failed to cache copy:', error);
    // Storage might be full, try to clean old entries
    cleanExpiredCache();
  }
}

/**
 * Clean expired cache entries
 */
export function cleanExpiredCache(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        try {
          const cached: CachedCopy = JSON.parse(localStorage.getItem(key) || '');
          if (now > cached.expiresAt) {
            keysToRemove.push(key);
          }
        } catch {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('[CopyCache] Failed to clean expired cache:', error);
  }
}

/**
 * Clear all cached copy
 */
export function clearCopyCache(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('[CopyCache] Failed to clear cache:', error);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  count: number;
  size: number;
  oldestEntry: number | null;
  newestEntry: number | null;
} {
  if (typeof window === 'undefined') {
    return { count: 0, size: 0, oldestEntry: null, newestEntry: null };
  }

  try {
    let count = 0;
    let size = 0;
    let oldestEntry: number | null = null;
    let newestEntry: number | null = null;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        try {
          const cached: CachedCopy = JSON.parse(localStorage.getItem(key) || '');
          count++;
          size += localStorage.getItem(key)?.length || 0;
          
          if (oldestEntry === null || cached.timestamp < oldestEntry) {
            oldestEntry = cached.timestamp;
          }
          if (newestEntry === null || cached.timestamp > newestEntry) {
            newestEntry = cached.timestamp;
          }
        } catch {
          // Skip invalid entries
        }
      }
    }

    return { count, size, oldestEntry, newestEntry };
  } catch (error) {
    console.warn('[CopyCache] Failed to get stats:', error);
    return { count: 0, size: 0, oldestEntry: null, newestEntry: null };
  }
}
