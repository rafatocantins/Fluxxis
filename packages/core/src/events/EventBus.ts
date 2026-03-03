/**
 * EventBus - Minimal Viable Pub/Sub System
 *
 * Type-safe event system for component communication
 */

import type { EventType, Event, EventHandler, EventSubscription, EventPayloads } from './types';

/**
 * EventBus class for pub/sub communication
 */
export class EventBus {
  private subscribers: Map<EventType, Set<EventHandler<EventType>>> = new Map();
  private eventLog: Event<EventType>[] = [];
  private maxLogSize = 1000;

  /**
   * Subscribe to an event type
   */
  subscribe<T extends EventType>(eventType: T, handler: EventHandler<T>): EventSubscription {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }

    const handlers = this.subscribers.get(eventType)!;
    handlers.add(handler as EventHandler<EventType>);

    return {
      unsubscribe: () => {
        handlers.delete(handler as EventHandler<EventType>);
      },
    };
  }

  /**
   * Publish an event
   */
  async publish<T extends EventType>(
    eventType: T,
    payload: EventPayloads[T],
    source: string = 'unknown'
  ): Promise<void> {
    const event: Event<T> = {
      type: eventType,
      payload,
      timestamp: Date.now(),
      source,
    };

    // Log event
    this.eventLog.push(event as Event<EventType>);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }

    // Notify subscribers
    const handlers = this.subscribers.get(eventType);
    if (handlers) {
      const promises = Array.from(handlers).map((handler) => handler(event as Event<EventType>));
      await Promise.all(promises);
    }
  }

  /**
   * Get recent events
   */
  getRecentEvents(count: number = 100): Event<EventType>[] {
    return this.eventLog.slice(-count);
  }

  /**
   * Clear event log
   */
  clearLog(): void {
    this.eventLog = [];
  }

  /**
   * Get subscriber count for an event type
   */
  getSubscriberCount(eventType: EventType): number {
    return this.subscribers.get(eventType)?.size ?? 0;
  }

  /**
   * Remove all subscribers for an event type
   */
  clearSubscribers(eventType: EventType): void {
    this.subscribers.delete(eventType);
  }
}

// Singleton instance
export const eventBus = new EventBus();
