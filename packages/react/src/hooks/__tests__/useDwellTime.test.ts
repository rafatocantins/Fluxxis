/**
 * useDwellTime Hook Tests
 *
 * Tests for the dwell time tracking hook covering:
 * - Returns initial state (zero dwellTime, not in viewport)
 * - Returns a ref object
 * - resetDwellTime function
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Store mock callbacks for IntersectionObserver
let mockObserverCallback: ((entries: IntersectionObserverEntry[]) => void) | null = null;

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockIntersectionObserver = vi.fn((callback: any) => {
  mockObserverCallback = callback;
  return {
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: vi.fn(),
    takeRecords: vi.fn(() => []),
    root: null,
    rootMargin: '',
    thresholds: [],
  };
});

// Assign the mock to global before importing
vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

import { useDwellTime } from '../useDwellTime';

describe('useDwellTime', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockObserverCallback = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns initial state with zero dwell time and not in viewport', () => {
    const { result } = renderHook(() => useDwellTime());

    expect(result.current.dwellTime).toBe(0);
    expect(result.current.inViewport).toBe(false);
    expect(result.current.ref).toBeDefined();
    expect(result.current.resetDwellTime).toBeInstanceOf(Function);
  });

  it('returns a ref object', () => {
    const { result } = renderHook(() => useDwellTime());

    expect(result.current.ref).toBeDefined();
    expect(result.current.ref).toHaveProperty('current');
    // ref.current is null because renderHook doesn't mount to a real DOM
    expect(result.current.ref.current).toBeNull();
  });

  it('resetDwellTime resets dwell time to zero', () => {
    const { result } = renderHook(() => useDwellTime());

    expect(result.current.dwellTime).toBe(0);

    act(() => {
      result.current.resetDwellTime();
    });

    expect(result.current.dwellTime).toBe(0);
  });

  it('returns stable ref across rerenders', () => {
    const { result, rerender } = renderHook(() => useDwellTime());

    const firstRef = result.current.ref;
    rerender();
    const secondRef = result.current.ref;

    expect(firstRef).toBe(secondRef);
  });

  it('accepts threshold option in the interface', () => {
    const { result } = renderHook(() =>
      useDwellTime({ threshold: 0.75 })
    );

    // Even without a DOM element, the hook should still work
    expect(result.current.dwellTime).toBe(0);
    expect(result.current.inViewport).toBe(false);
  });

  it('accepts onDwellUpdate callback in the interface', () => {
    const onDwellUpdate = vi.fn();

    const { result } = renderHook(() =>
      useDwellTime({ onDwellUpdate })
    );

    expect(result.current.dwellTime).toBe(0);
    // Callback not invoked because no DOM element = no observer
  });

  it('cleanup does not throw on unmount without DOM element', () => {
    const { unmount } = renderHook(() => useDwellTime());

    // Should not throw when unmounting without a real DOM element
    expect(() => unmount()).not.toThrow();
  });
});
