/**
 * useIntent Hook Tests
 *
 * Tests for the useIntent hook covering:
 * - Returns valid intent resolution from context
 * - Registers/unregisters components with the engine
 * - Returns computed resolution based on declaration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to set up the mocks before any imports that use them
const mockRegisterComponent = vi.fn();
const mockUnregisterComponent = vi.fn();
const mockResolve = vi.fn();

// Mock the FluxxisProvider context
vi.mock('../../components/FluxxisProvider', () => ({
  useFluxxis: () => ({
    resolver: {
      resolve: mockResolve,
      clearCache: vi.fn(),
    },
    registerComponent: mockRegisterComponent,
    unregisterComponent: mockUnregisterComponent,
    options: {},
    components: new Map(),
  }),
  FluxxisContext: {
    Provider: ({ children }: any) => children,
    Consumer: ({ children }: any) => children(null),
  },
}));

// Mock @fluxxis/core for types only
vi.mock('@fluxxis/core', () => ({
  IntentDeclaration: {} as any,
  IntentResolution: {} as any,
  Signal: {} as any,
}));

import { useIntent } from '../useIntent';

// Simple test component wrapper for hook testing
import { renderHook, act } from '@testing-library/react';

describe('useIntent', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockResolve.mockReturnValue({
      emphasis: 'normal',
      animation: 'default',
      componentId: 'test-comp',
      goal: 'convert',
      priority: 'normal',
    });
  });

  it('returns a valid intent resolution object', () => {
    const { result } = renderHook(() =>
      useIntent({
        goal: 'convert',
        priority: 'normal',
        context: { page: 'pricing' },
      })
    );

    expect(result.current).toBeDefined();
    expect(result.current.goal).toBe('convert');
    expect(result.current.emphasis).toBe('normal');
    expect(result.current.priority).toBe('normal');
  });

  it('registers component on mount and unregisters on unmount', () => {
    const { unmount } = renderHook(() =>
      useIntent({
        goal: 'convert',
        priority: 'normal',
      })
    );

    expect(mockRegisterComponent).toHaveBeenCalledTimes(1);
    expect(mockRegisterComponent).toHaveBeenCalledWith(
      expect.any(String),
      'convert',
      'normal'
    );

    act(() => {
      unmount();
    });

    expect(mockUnregisterComponent).toHaveBeenCalledTimes(1);
    expect(mockUnregisterComponent).toHaveBeenCalledWith(expect.any(String));
  });

  it('calls resolver.resolve with correct declaration', () => {
    const declaration = {
      goal: 'inform' as const,
      priority: 'high' as const,
      context: { page: 'docs' },
    };

    renderHook(() => useIntent(declaration));

    expect(mockResolve).toHaveBeenCalledTimes(1);
    expect(mockResolve).toHaveBeenCalledWith(
      expect.objectContaining({
        goal: 'inform',
        priority: 'high',
        context: { page: 'docs' },
      }),
      expect.any(Array)
    );
  });

  it('uses custom componentId when provided', () => {
    renderHook(() =>
      useIntent(
        {
          goal: 'convert',
          priority: 'normal',
        },
        'my-custom-id'
      )
    );

    expect(mockRegisterComponent).toHaveBeenCalledWith(
      'my-custom-id',
      'convert',
      'normal'
    );
  });
});
