/**
 * Intersection Observer Hook
 *
 * Custom hook for observing element visibility
 */

import { useEffect, useRef, useState } from 'react';

export interface UseIntersectionObserverOptions {
  /** Intersection threshold (0-1) */
  threshold?: number | number[];
  /** Root margin for intersection */
  rootMargin?: string;
  /** Callback when intersection changes */
  onChange?: (entry: IntersectionObserverEntry) => void;
}

/**
 * Hook to observe intersection of an element with viewport
 */
export function useIntersectionObserver<T extends HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): {
  ref: React.RefObject<T>;
  isIntersecting: boolean;
  intersectionRatio: number;
} {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);

  const { threshold = 0.5, rootMargin = '0px', onChange } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
          setIntersectionRatio(entry.intersectionRatio);
          onChange?.(entry);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, onChange]);

  return { ref, isIntersecting, intersectionRatio };
}
