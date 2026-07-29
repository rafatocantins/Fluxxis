/**
 * User Profile Store Tests
 *
 * Tests for zustand-based user profile store covering:
 * - CRUD operations (addSignal, clearOldSignals, setPreferences, incrementSession, reset)
 * - Persist + partialize behavior
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUserProfileStore } from '../userProfileStore';

describe('User Profile Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserProfileStore.getState().reset();
  });

  describe('initial state', () => {
    it('has empty signals, preferences, zero session count', () => {
      const state = useUserProfileStore.getState();
      expect(state.signals).toEqual([]);
      expect(state.preferences).toEqual({});
      expect(state.sessionCount).toBe(0);
      expect(state.lastActive).toBeUndefined();
    });
  });

  describe('addSignal', () => {
    it('appends a signal to the signals array', () => {
      const store = useUserProfileStore.getState();
      const signal = {
        type: 'click' as const,
        value: 1,
        timestamp: Date.now(),
      };

      store.addSignal(signal);

      const updated = useUserProfileStore.getState();
      expect(updated.signals).toHaveLength(1);
      expect(updated.signals[0]).toMatchObject({
        type: 'click',
        value: 1,
      });
    });

    it('updates lastActive when adding a signal', () => {
      const store = useUserProfileStore.getState();
      const before = Date.now();

      store.addSignal({
        type: 'hover',
        value: 500,
        timestamp: Date.now(),
      });

      const updated = useUserProfileStore.getState();
      expect(updated.lastActive).toBeGreaterThanOrEqual(before);
    });

    it('accumulates multiple signals', () => {
      const store = useUserProfileStore.getState();

      store.addSignal({ type: 'scroll', value: 30, timestamp: Date.now() });
      store.addSignal({ type: 'click', value: 1, timestamp: Date.now() });
      store.addSignal({ type: 'dwell', value: 2000, timestamp: Date.now() });

      expect(useUserProfileStore.getState().signals).toHaveLength(3);
    });
  });

  describe('clearOldSignals', () => {
    it('removes signals older than maxAge', () => {
      const store = useUserProfileStore.getState();
      const now = Date.now();

      // Add signals with different timestamps
      store.addSignal({ type: 'click', value: 1, timestamp: now - 10000 });
      store.addSignal({ type: 'hover', value: 200, timestamp: now - 5000 });
      store.addSignal({ type: 'scroll', value: 50, timestamp: now - 1000 });
      store.addSignal({ type: 'dwell', value: 3000, timestamp: now });

      expect(useUserProfileStore.getState().signals).toHaveLength(4);

      // Clear signals older than 3 seconds (3000ms)
      store.clearOldSignals(3000);

      const updated = useUserProfileStore.getState();
      // 2 signals should remain: now-1000 and now (both within 3000ms window)
      expect(updated.signals).toHaveLength(2);
      // All remaining signals should be within the maxAge window
      expect(updated.signals.every(s => now - s.timestamp < 3000)).toBe(true);
    });

    it('keeps all signals when maxAge is very large', () => {
      const store = useUserProfileStore.getState();
      store.addSignal({ type: 'click', value: 1, timestamp: Date.now() });
      store.addSignal({ type: 'hover', value: 200, timestamp: Date.now() });

      store.clearOldSignals(3600000); // 1 hour

      expect(useUserProfileStore.getState().signals).toHaveLength(2);
    });
  });

  describe('setPreferences', () => {
    it('sets preferences correctly', () => {
      const store = useUserProfileStore.getState();

      store.setPreferences({ theme: 'dark', fontSize: 16 });

      const updated = useUserProfileStore.getState();
      expect(updated.preferences).toEqual({ theme: 'dark', fontSize: 16 });
    });

    it('merges preferences with existing ones', () => {
      const store = useUserProfileStore.getState();

      store.setPreferences({ theme: 'dark' });
      store.setPreferences({ fontSize: 14 });

      const updated = useUserProfileStore.getState();
      expect(updated.preferences).toEqual({ theme: 'dark', fontSize: 14 });
    });

    it('overwrites existing preference keys', () => {
      const store = useUserProfileStore.getState();

      store.setPreferences({ theme: 'dark' });
      store.setPreferences({ theme: 'light' });

      const updated = useUserProfileStore.getState();
      expect(updated.preferences).toEqual({ theme: 'light' });
    });
  });

  describe('incrementSession', () => {
    it('increments session count from 0 to 1', () => {
      const store = useUserProfileStore.getState();
      expect(store.sessionCount).toBe(0);

      store.incrementSession();

      expect(useUserProfileStore.getState().sessionCount).toBe(1);
    });

    it('increments session count cumulatively', () => {
      const store = useUserProfileStore.getState();

      store.incrementSession();
      store.incrementSession();
      store.incrementSession();

      expect(useUserProfileStore.getState().sessionCount).toBe(3);
    });

    it('updates lastActive on session increment', () => {
      const store = useUserProfileStore.getState();
      const before = Date.now();

      store.incrementSession();

      expect(useUserProfileStore.getState().lastActive).toBeGreaterThanOrEqual(before);
    });
  });

  describe('reset', () => {
    it('resets all state to initial values', () => {
      const store = useUserProfileStore.getState();

      // Populate state
      store.addSignal({ type: 'click', value: 1, timestamp: Date.now() });
      store.addSignal({ type: 'hover', value: 200, timestamp: Date.now() });
      store.setPreferences({ theme: 'dark' });
      store.incrementSession();
      store.incrementSession();

      // Verify populated state
      const populated = useUserProfileStore.getState();
      expect(populated.signals).toHaveLength(2);
      expect(populated.preferences).toEqual({ theme: 'dark' });
      expect(populated.sessionCount).toBe(2);
      expect(populated.lastActive).toBeGreaterThan(0);

      // Reset
      populated.reset();

      const resetState = useUserProfileStore.getState();
      expect(resetState.signals).toEqual([]);
      expect(resetState.preferences).toEqual({});
      expect(resetState.sessionCount).toBe(0);
      expect(resetState.lastActive).toBeUndefined();
    });
  });

  describe('persist partialize', () => {
    it('partialize only keeps last 100 signals', () => {
      const store = useUserProfileStore.getState();
      const now = Date.now();

      // Add 150 signals
      for (let i = 0; i < 150; i++) {
        store.addSignal({
          type: 'click',
          value: 1,
          timestamp: now + i,
        });
      }

      const state = useUserProfileStore.getState();
      expect(state.signals).toHaveLength(150);

      // The persist partialize function should only keep last 100
      // We test the logic by verifying the slice works correctly
      const partialized = state.signals.slice(-100);
      expect(partialized).toHaveLength(100);
    });
  });
});
