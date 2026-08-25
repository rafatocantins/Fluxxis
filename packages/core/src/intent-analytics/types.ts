/**
 * Intent Analytics Module — Types
 *
 * Type definitions for the intent analytics pipeline. Records raw intent
 * events and produces JSON-serializable aggregates for export.
 */

import type { GoalType, ActorType } from '../types';

/**
 * A single recorded intent signal event.
 */
export interface IntentEvent {
  /** The goal type the event maps to */
  intent: GoalType;
  /** Identifier of the template that produced the event */
  templateId: string;
  /** Who triggered the event */
  actorType: ActorType;
  /** Unix epoch milliseconds when the event occurred */
  timestamp: number;
  /** Optional confidence (0-1) assigned to the intent classification */
  confidence?: number;
  /** Optional free-form metadata attached to the event */
  metadata?: Record<string, any>;
}

/**
 * Aggregated counts for a single intent.
 */
export interface IntentAggregate {
  /** The goal type this aggregate describes */
  intent: GoalType;
  /** Total number of events for this intent */
  count: number;
  /** Number of events per template */
  templateCounts: Record<string, number>;
  /** Number of events per actor type (only present actors are included) */
  actorCounts: Partial<Record<ActorType, number>>;
}

/**
 * Fully JSON-serializable export snapshot of the analytics pipeline.
 */
export interface IntentAnalyticsExport {
  /** ISO-8601 timestamp of when the export was generated */
  generatedAt: string;
  /** Snapshot of all recorded events */
  events: IntentEvent[];
  /** Aggregations over the recorded events */
  aggregates: {
    byIntent: IntentAggregate[];
    byTemplate: Array<{ templateId: string; count: number; intents: GoalType[] }>;
    byWindow: Array<{ windowStart: number; windowEnd: number; count: number }>;
  };
}
