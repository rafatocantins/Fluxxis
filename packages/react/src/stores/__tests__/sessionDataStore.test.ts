/**
 * Session Data Store Tests
 *
 * Tests for zustand-based session metrics store CRUD operations.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useSessionDataStore } from '../sessionDataStore';

describe('Session Data Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useSessionDataStore.getState().reset();
  });

  describe('startSession', () => {
    it('activates session and sets sessionId', () => {
      const store = useSessionDataStore.getState();

      expect(store.isActive).toBe(false);
      expect(store.sessionId).toBe('');

      store.startSession();

      const updated = useSessionDataStore.getState();
      expect(updated.isActive).toBe(true);
      expect(updated.sessionId).toMatch(/^session_\d+_\w+$/);
      expect(updated.metrics.sessionStart).toBeGreaterThan(0);
      expect(updated.metrics.lastActivity).toBeGreaterThan(0);
    });
  });

  describe('endSession', () => {
    it('deactivates session without clearing metrics', () => {
      const store = useSessionDataStore.getState();
      store.startSession();
      store.addDwellTime(5000);

      const beforeEnd = useSessionDataStore.getState();
      expect(beforeEnd.isActive).toBe(true);
      expect(beforeEnd.metrics.totalDwellTime).toBe(5000);

      beforeEnd.endSession();

      const afterEnd = useSessionDataStore.getState();
      expect(afterEnd.isActive).toBe(false);
      // Metrics should be preserved
      expect(afterEnd.metrics.totalDwellTime).toBe(5000);
    });
  });

  describe('addDwellTime', () => {
    it('accumulates dwell time correctly', () => {
      const store = useSessionDataStore.getState();
      store.startSession();

      store.addDwellTime(1000);
      expect(useSessionDataStore.getState().metrics.totalDwellTime).toBe(1000);

      store.addDwellTime(2500);
      expect(useSessionDataStore.getState().metrics.totalDwellTime).toBe(3500);

      store.addDwellTime(500);
      expect(useSessionDataStore.getState().metrics.totalDwellTime).toBe(4000);
    });

    it('updates lastActivity on each addition', () => {
      const store = useSessionDataStore.getState();
      store.startSession();

      const before = Date.now();
      store.addDwellTime(500);
      const after = useSessionDataStore.getState().metrics.lastActivity;

      expect(after).toBeGreaterThanOrEqual(before);
    });
  });

  describe('addScrollDepth', () => {
    it('accumulates scroll depth correctly', () => {
      const store = useSessionDataStore.getState();
      store.startSession();

      store.addScrollDepth(25);
      store.addScrollDepth(50);
      store.addScrollDepth(25);

      expect(useSessionDataStore.getState().metrics.totalScrollDepth).toBe(100);
    });
  });

  describe('addHoverTime', () => {
    it('accumulates hover time correctly', () => {
      const store = useSessionDataStore.getState();
      store.startSession();

      store.addHoverTime(300);
      store.addHoverTime(200);

      expect(useSessionDataStore.getState().metrics.totalHoverTime).toBe(500);
    });
  });

  describe('recordInteraction', () => {
    it('increments interaction count', () => {
      const store = useSessionDataStore.getState();
      store.startSession();

      store.recordInteraction();
      store.recordInteraction();
      store.recordInteraction();

      expect(useSessionDataStore.getState().metrics.interactionCount).toBe(3);
    });

    it('updates lastActivity on interaction', () => {
      const store = useSessionDataStore.getState();
      store.startSession();

      const before = Date.now();
      store.recordInteraction();

      expect(useSessionDataStore.getState().metrics.lastActivity).toBeGreaterThanOrEqual(before);
    });
  });

  describe('touchActivity', () => {
    it('updates lastActivity timestamp', () => {
      const store = useSessionDataStore.getState();
      store.startSession();

      const before = Date.now();
      store.touchActivity();

      expect(useSessionDataStore.getState().metrics.lastActivity).toBeGreaterThanOrEqual(before);
    });
  });

  describe('reset', () => {
    it('resets all state to initial values', () => {
      const store = useSessionDataStore.getState();
      store.startSession();
      store.addDwellTime(5000);
      store.addScrollDepth(100);
      store.addHoverTime(300);
      store.recordInteraction();
      store.recordInteraction();

      // Verify state is populated
      const active = useSessionDataStore.getState();
      expect(active.isActive).toBe(true);
      expect(active.metrics.totalDwellTime).toBe(5000);

      // Reset
      active.reset();

      const resetState = useSessionDataStore.getState();
      expect(resetState.isActive).toBe(false);
      expect(resetState.sessionId).toBe('');
      expect(resetState.metrics.totalDwellTime).toBe(0);
      expect(resetState.metrics.totalScrollDepth).toBe(0);
      expect(resetState.metrics.totalHoverTime).toBe(0);
      expect(resetState.metrics.interactionCount).toBe(0);
      expect(resetState.metrics.sessionStart).toBe(0);
      expect(resetState.metrics.lastActivity).toBe(0);
    });
  });
});
