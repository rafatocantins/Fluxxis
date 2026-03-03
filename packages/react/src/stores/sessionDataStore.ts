/**
 * Session Data Store
 *
 * Manages session-level behavior metrics and dwell times
 */

import { create } from 'zustand';

export interface SessionMetrics {
  /** Total scroll depth across all nodes */
  totalScrollDepth: number;
  /** Total hover time across all nodes (ms) */
  totalHoverTime: number;
  /** Total dwell time across all nodes (ms) */
  totalDwellTime: number;
  /** Number of interactions */
  interactionCount: number;
  /** Session start timestamp */
  sessionStart: number;
  /** Last activity timestamp */
  lastActivity: number;
}

interface SessionDataState {
  /** Current session metrics */
  metrics: SessionMetrics;
  /** Is session active */
  isActive: boolean;
  /** Session ID */
  sessionId: string;
}

interface SessionDataActions {
  /** Update scroll depth */
  addScrollDepth: (depth: number) => void;
  /** Add hover time */
  addHoverTime: (time: number) => void;
  /** Add dwell time */
  addDwellTime: (time: number) => void;
  /** Record interaction */
  recordInteraction: () => void;
  /** Update last activity */
  touchActivity: () => void;
  /** Start new session */
  startSession: () => void;
  /** End session */
  endSession: () => void;
  /** Reset session data */
  reset: () => void;
}

const createSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const initialMetrics: SessionMetrics = {
  totalScrollDepth: 0,
  totalHoverTime: 0,
  totalDwellTime: 0,
  interactionCount: 0,
  sessionStart: 0,
  lastActivity: 0,
};

const initialState: SessionDataState = {
  metrics: initialMetrics,
  isActive: false,
  sessionId: '',
};

export const useSessionDataStore = create<SessionDataState & SessionDataActions>()((set, _get) => ({
  ...initialState,

  addScrollDepth: (depth) =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        totalScrollDepth: state.metrics.totalScrollDepth + depth,
        lastActivity: Date.now(),
      },
    })),

  addHoverTime: (time) =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        totalHoverTime: state.metrics.totalHoverTime + time,
        lastActivity: Date.now(),
      },
    })),

  addDwellTime: (time) =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        totalDwellTime: state.metrics.totalDwellTime + time,
        lastActivity: Date.now(),
      },
    })),

  recordInteraction: () =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        interactionCount: state.metrics.interactionCount + 1,
        lastActivity: Date.now(),
      },
    })),

  touchActivity: () =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        lastActivity: Date.now(),
      },
    })),

  startSession: () =>
    set({
      isActive: true,
      sessionId: createSessionId(),
      metrics: {
        ...initialMetrics,
        sessionStart: Date.now(),
        lastActivity: Date.now(),
      },
    }),

  endSession: () =>
    set((state) => ({
      ...state,
      isActive: false,
    })),

  reset: () => set(initialState),
}));
