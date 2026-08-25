/**
 * Intent Analytics Pipeline
 *
 * Records intent events in an in-memory buffer and aggregates them by
 * intent, template, and fixed time windows. Exports a fully
 * JSON-serializable snapshot (no Map/Set/class instances inside).
 */

import type {
  IntentEvent,
  IntentAggregate,
  IntentAnalyticsExport,
} from './types';
import type { GoalType, ActorType } from '../types';

/** Default window size for time bucketing (1 hour in milliseconds). */
export const DEFAULT_WINDOW_MS = 3600000;

/**
 * In-memory intent analytics pipeline.
 */
export class IntentAnalytics {
  private events: IntentEvent[] = [];

  /**
   * Append an intent event to the internal buffer.
   *
   * The event is cloned on ingest so later mutation of the caller's object
   * does not corrupt the buffer.
   */
  record(event: IntentEvent): void {
    this.events.push(cloneEvent(event));
  }

  /**
   * Aggregate recorded events.
   *
   * @param options.since  Only include events whose timestamp is >= since.
   * @param options.windowMs  Fixed window size for byWindow bucketing (default 1h).
   * @throws {RangeError} if `windowMs` is not a positive finite number.
   */
  aggregate(
    options?: { since?: number; windowMs?: number }
  ): IntentAnalyticsExport['aggregates'] {
    const { since, windowMs = DEFAULT_WINDOW_MS } = options ?? {};

    if (!Number.isFinite(windowMs) || windowMs <= 0) {
      throw new RangeError(
        `windowMs must be a positive finite number, got ${windowMs}`
      );
    }

    const events =
      since === undefined
        ? this.events
        : this.events.filter((event) => event.timestamp >= since);

    return {
      byIntent: this.aggregateByIntent(events),
      byTemplate: this.aggregateByTemplate(events),
      byWindow: this.aggregateByWindow(events, windowMs),
    };
  }

  /**
   * Export a JSON-serializable snapshot of events and aggregates.
   *
   * Events are deep-copied so mutating the returned snapshot does not affect
   * the internal buffer.
   */
  export(): IntentAnalyticsExport {
    return {
      generatedAt: new Date().toISOString(),
      events: this.events.map((event) => cloneEvent(event)),
      aggregates: this.aggregate(),
    };
  }

  /**
   * Clear the internal event buffer.
   */
  reset(): void {
    this.events = [];
  }

  private aggregateByIntent(events: IntentEvent[]): IntentAggregate[] {
    const byIntent = new Map<
      GoalType,
      {
        count: number;
        templateCounts: Map<string, number>;
        actorCounts: Map<ActorType, number>;
      }
    >();

    for (const event of events) {
      let aggregate = byIntent.get(event.intent);
      if (!aggregate) {
        aggregate = {
          count: 0,
          templateCounts: new Map(),
          actorCounts: new Map(),
        };
        byIntent.set(event.intent, aggregate);
      }

      aggregate.count += 1;
      aggregate.templateCounts.set(
        event.templateId,
        (aggregate.templateCounts.get(event.templateId) ?? 0) + 1
      );
      aggregate.actorCounts.set(
        event.actorType,
        (aggregate.actorCounts.get(event.actorType) ?? 0) + 1
      );
    }

    return Array.from(byIntent.entries()).map(([intent, aggregate]) => ({
      intent,
      count: aggregate.count,
      templateCounts: Object.fromEntries(aggregate.templateCounts),
      actorCounts: Object.fromEntries(aggregate.actorCounts),
    }));
  }

  private aggregateByTemplate(
    events: IntentEvent[]
  ): Array<{ templateId: string; count: number; intents: GoalType[] }> {
    const byTemplate = new Map<
      string,
      { templateId: string; count: number; intents: Set<GoalType> }
    >();

    for (const event of events) {
      let aggregate = byTemplate.get(event.templateId);
      if (!aggregate) {
        aggregate = {
          templateId: event.templateId,
          count: 0,
          intents: new Set<GoalType>(),
        };
        byTemplate.set(event.templateId, aggregate);
      }

      aggregate.count += 1;
      aggregate.intents.add(event.intent);
    }

    return Array.from(byTemplate.values()).map((aggregate) => ({
      templateId: aggregate.templateId,
      count: aggregate.count,
      intents: Array.from(aggregate.intents),
    }));
  }

  private aggregateByWindow(
    events: IntentEvent[],
    windowMs: number
  ): Array<{ windowStart: number; windowEnd: number; count: number }> {
    const buckets = new Map<
      number,
      { windowStart: number; windowEnd: number; count: number }
    >();

    for (const event of events) {
      const windowStart = Math.floor(event.timestamp / windowMs) * windowMs;
      let bucket = buckets.get(windowStart);
      if (!bucket) {
        bucket = { windowStart, windowEnd: windowStart + windowMs, count: 0 };
        buckets.set(windowStart, bucket);
      }

      bucket.count += 1;
    }

    return Array.from(buckets.values()).sort(
      (a, b) => a.windowStart - b.windowStart
    );
  }
}

/**
 * Shallow-clone an event (top-level fields + metadata) so callers cannot
 * alias internal buffer state through object references.
 */
function cloneEvent(event: IntentEvent): IntentEvent {
  return {
    ...event,
    metadata: event.metadata ? { ...event.metadata } : undefined,
  };
}
