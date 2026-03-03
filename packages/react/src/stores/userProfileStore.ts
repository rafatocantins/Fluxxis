/**
 * User Profile Store
 *
 * Manages user signals, preferences, and personalization data
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Signal } from '@fluxxis/core';

/**
 * User signal (store-specific)
 */
export interface UserSignal {
  /** Signal type */
  type: 'scroll' | 'hover' | 'click' | 'dwell';
  /** Signal value */
  value: number;
  /** Timestamp */
  timestamp: number;
  /** Node ID where signal occurred */
  nodeId: string;
}

export interface UserProfile {
  /** Accumulated behavior signals */
  signals: Signal[];
  /** User preferences */
  preferences: Record<string, unknown>;
  /** Session count */
  sessionCount: number;
  /** Last active timestamp */
  lastActive?: number;
}

interface UserProfileActions {
  /** Add a new signal */
  addSignal: (signal: Signal) => void;
  /** Clear old signals */
  clearOldSignals: (maxAge: number) => void;
  /** Update preferences */
  setPreferences: (preferences: Record<string, unknown>) => void;
  /** Increment session count */
  incrementSession: () => void;
  /** Reset profile */
  reset: () => void;
}

const initialState: UserProfile = {
  signals: [],
  preferences: {},
  sessionCount: 0,
  lastActive: undefined,
};

export const useUserProfileStore = create<UserProfile & UserProfileActions>()(
  persist(
    (set, _get) => ({
      ...initialState,

      addSignal: (signal) =>
        set((state) => ({
          signals: [...state.signals, signal],
          lastActive: Date.now(),
        })),

      clearOldSignals: (maxAge) => {
        const now = Date.now();
        set((state) => ({
          signals: state.signals.filter((s) => now - s.timestamp < maxAge),
        }));
      },

      setPreferences: (preferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),

      incrementSession: () =>
        set((state) => ({
          sessionCount: state.sessionCount + 1,
          lastActive: Date.now(),
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'ia-design-system-user-profile',
      partialize: (state) => ({
        signals: state.signals.slice(-100), // Keep last 100 signals
        preferences: state.preferences,
        sessionCount: state.sessionCount,
      }),
    }
  )
);
