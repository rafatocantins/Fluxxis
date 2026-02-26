/**
 * Event System Types
 */

import type { NodeContract } from '../registry/types';

/**
 * Event types supported by the EventBus
 */
export type EventType =
  | 'NODE_REGISTER'
  | 'NODE_DEREGISTER'
  | 'BEHAVIOR_SIGNAL'
  | 'INTERVENTION_REQUEST'
  | 'INTERVENTION_APPLY'
  | 'INTERVENTION_COMPLETE';

/**
 * Event payload types
 */
export interface EventPayloads {
  NODE_REGISTER: {
    node: NodeContract;
  };
  NODE_DEREGISTER: {
    nodeId: string;
    reason?: string;
  };
  BEHAVIOR_SIGNAL: {
    nodeId: string;
    signalType: 'scroll' | 'hover' | 'click' | 'dwell';
    value: number;
    timestamp: number;
  };
  INTERVENTION_REQUEST: {
    nodeId: string;
    level: number;
    type: string;
    rationale: string;
  };
  INTERVENTION_APPLY: {
    nodeId: string;
    changes: Record<string, unknown>;
  };
  INTERVENTION_COMPLETE: {
    nodeId: string;
    success: boolean;
    metrics?: Record<string, number>;
  };
}

/**
 * Generic event structure
 */
export interface Event<T extends EventType> {
  type: T;
  payload: EventPayloads[T];
  timestamp: number;
  source: string;
}

/**
 * Event handler function type
 */
export type EventHandler<T extends EventType> = (event: Event<T>) => void | Promise<void>;

/**
 * Event subscription interface
 */
export interface EventSubscription {
  /** Unsubscribe from event */
  unsubscribe: () => void;
}
