/**
 * Signal Types
 *
 * Proxy to core types to avoid duplicate definitions
 */

export type {
  SignalType,
  ActorType,
  SignalContext,
  Signal
} from '../types';

import type { Signal, ActorType } from '../types';

/**
 * Aggregated signal metrics
 */
export interface SignalAggregates {
  /** Total signals */
  total: number;
  /** Average hover time (ms) */
  avgHoverTime: number;
  /** Total clicks */
  clickCount: number;
  /** Average scroll depth (%) */
  avgScrollDepth: number;
  /** Total dwell time (ms) */
  totalDwellTime: number;
  /** First signal timestamp */
  firstSignal: number;
  /** Last signal timestamp */
  lastSignal: number;
  /** Detected actor type */
  actorType: ActorType;
  /** Detection confidence */
  confidence: number;
}

/**
 * Signal processor interface
 */
export interface SignalProcessor {
  /** Capture a new signal */
  capture(signal: Signal): void;
  /** Get signal history for component */
  getHistory(componentId: string): Signal[];
  /** Get aggregated metrics */
  getAggregates(componentId: string): SignalAggregates;
  /** Clear signals */
  clear(componentId?: string): void;
}
