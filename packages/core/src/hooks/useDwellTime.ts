/**
 * Dwell Time Hook
 *
 * Tracks how long an element remains in the viewport
 */

import { useEffect, useRef, useState } from 'react';

export interface UseDwellTimeOptions {
  /** Intersection threshold (0-1) */
  threshold?: number;
  /** Callback when dwell time updates */
  onDwellUpdate?: (dwellTime: number) => void;
}

/**
 * Hook to track dwell time of an element in viewport
 */
export function useDwellTime<T extends HTMLElement>(
  options: UseDwellTimeOptions = {}
): {
  ref: React.RefObject<T>;
  dwellTime: number;
  inViewport: boolean;
  resetDwellTime: () => void;
} {
  const ref = useRef<T>(null);
  const [dwellTime, setDwellTime] = useState(0);
  const [inViewport, setInViewport] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);

  const { threshold = 0.5, onDwellUpdate } = options;

  const resetDwellTime = () => {
    setDwellTime(0);
    accumulatedRef.current = 0;
    startTimeRef.current = null;
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setInViewport(entry.isIntersecting);

          if (entry.isIntersecting) {
            startTimeRef.current = Date.now();
          } else {
            if (startTimeRef.current) {
              const sessionDwell = Date.now() - startTimeRef.current;
              accumulatedRef.current += sessionDwell;
              setDwellTime(accumulatedRef.current);
              startTimeRef.current = null;
              onDwellUpdate?.(accumulatedRef.current);
            }
          }
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (startTimeRef.current) {
        const sessionDwell = Date.now() - startTimeRef.current;
        accumulatedRef.current += sessionDwell;
        setDwellTime(accumulatedRef.current);
      }
      observer.disconnect();
    };
  }, [threshold, onDwellUpdate]);

  return { ref, dwellTime, inViewport, resetDwellTime };
}
