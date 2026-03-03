/**
 * Behavior Observer Hook
 *
 * Tracks user behavior on components (scroll, hover, dwell)
 */

import { useEffect, useRef, useState } from 'react';

export interface BehaviorObserverOptions {
  /** Enable scroll tracking */
  trackScroll?: boolean;
  /** Enable hover tracking */
  trackHover?: boolean;
  /** Enable dwell time tracking */
  trackDwell?: boolean;
  /** Callback on behavior change */
  onBehaviorChange?: (behavior: BehaviorMetrics) => void;
}

export interface BehaviorMetrics {
  /** Scroll depth percentage (0-100) */
  scrollDepth: number;
  /** Hover time in milliseconds */
  hoverTime: number;
  /** Dwell time in milliseconds */
  dwellTime: number;
  /** Is currently in viewport */
  inViewport: boolean;
  /** Is currently being hovered */
  isHovered: boolean;
}

const DEFAULT_METRICS: BehaviorMetrics = {
  scrollDepth: 0,
  hoverTime: 0,
  dwellTime: 0,
  inViewport: false,
  isHovered: false,
};

/**
 * Hook to observe user behavior on a component
 */
export function useBehaviorObserver<T extends HTMLElement>(
  options: BehaviorObserverOptions = {}
): {
  ref: React.RefObject<T>;
  metrics: BehaviorMetrics;
  resetMetrics: () => void;
} {
  const ref = useRef<T>(null);
  const [metrics, setMetrics] = useState<BehaviorMetrics>(DEFAULT_METRICS);
  const dwellStartRef = useRef<number | null>(null);
  const hoverStartRef = useRef<number | null>(null);

  const { trackHover = true, trackDwell = true, onBehaviorChange } = options;

  // Reset metrics function
  const resetMetrics = () => {
    setMetrics(DEFAULT_METRICS);
    dwellStartRef.current = null;
    hoverStartRef.current = null;
  };

  // Track dwell time when in viewport
  useEffect(() => {
    const element = ref.current;
    if (!element || !trackDwell) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          dwellStartRef.current = Date.now();
          setMetrics((prev) => ({ ...prev, inViewport: true }));
        } else {
          if (dwellStartRef.current) {
            const dwellTime = Date.now() - dwellStartRef.current;
            setMetrics((prev) => ({
              ...prev,
              dwellTime: prev.dwellTime + dwellTime,
              inViewport: false,
            }));
            dwellStartRef.current = null;
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [trackDwell]);

  // Track hover
  useEffect(() => {
    const element = ref.current;
    if (!element || !trackHover) {
      return;
    }

    const handleMouseEnter = () => {
      hoverStartRef.current = Date.now();
      setMetrics((prev) => ({ ...prev, isHovered: true }));
    };

    const handleMouseLeave = () => {
      if (hoverStartRef.current) {
        const hoverTime = Date.now() - hoverStartRef.current;
        setMetrics((prev) => ({
          ...prev,
          hoverTime: prev.hoverTime + hoverTime,
          isHovered: false,
        }));
        hoverStartRef.current = null;
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [trackHover]);

  // Callback on metrics change
  useEffect(() => {
    onBehaviorChange?.(metrics);
  }, [metrics, onBehaviorChange]);

  return { ref, metrics, resetMetrics };
}
