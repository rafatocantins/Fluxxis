/**
 * Intent Analytics Pipeline Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { IntentAnalytics, DEFAULT_WINDOW_MS } from '../pipeline';
import type { IntentEvent } from '../types';

const BASE_TS = Date.parse('2026-01-01T00:00:00.000Z');
const HOUR = DEFAULT_WINDOW_MS;

function makeEvent(overrides: Partial<IntentEvent> = {}): IntentEvent {
  return {
    intent: 'convert',
    templateId: 'template-a',
    actorType: 'human',
    timestamp: BASE_TS,
    ...overrides,
  };
}

describe('IntentAnalytics', () => {
  let analytics: IntentAnalytics;

  beforeEach(() => {
    analytics = new IntentAnalytics();
  });

  describe('record + aggregate by intent', () => {
    it('counts events, template counts, and actor counts per intent', () => {
      analytics.record(
        makeEvent({ intent: 'convert', templateId: 'tpl-a', actorType: 'human' })
      );
      analytics.record(
        makeEvent({ intent: 'convert', templateId: 'tpl-a', actorType: 'human' })
      );
      analytics.record(
        makeEvent({ intent: 'convert', templateId: 'tpl-b', actorType: 'agent' })
      );
      analytics.record(
        makeEvent({ intent: 'inform', templateId: 'tpl-a', actorType: 'agent' })
      );

      const { byIntent } = analytics.aggregate();
      const convert = byIntent.find((a) => a.intent === 'convert');
      const inform = byIntent.find((a) => a.intent === 'inform');

      expect(byIntent).toHaveLength(2);

      expect(convert?.count).toBe(3);
      expect(convert?.templateCounts).toEqual({ 'tpl-a': 2, 'tpl-b': 1 });
      expect(convert?.actorCounts).toEqual({ human: 2, agent: 1 });

      expect(inform?.count).toBe(1);
      expect(inform?.templateCounts).toEqual({ 'tpl-a': 1 });
      expect(inform?.actorCounts).toEqual({ agent: 1 });
    });
  });

  describe('aggregate by template', () => {
    it('counts events per template and lists distinct intents', () => {
      analytics.record(makeEvent({ templateId: 'tpl-a', intent: 'convert' }));
      analytics.record(makeEvent({ templateId: 'tpl-a', intent: 'inform' }));
      analytics.record(makeEvent({ templateId: 'tpl-a', intent: 'convert' }));
      analytics.record(makeEvent({ templateId: 'tpl-b', intent: 'engage' }));

      const { byTemplate } = analytics.aggregate();
      const tplA = byTemplate.find((t) => t.templateId === 'tpl-a');
      const tplB = byTemplate.find((t) => t.templateId === 'tpl-b');

      expect(byTemplate).toHaveLength(2);
      expect(tplA?.count).toBe(3);
      expect(tplA?.intents.sort()).toEqual(['convert', 'inform']);
      expect(tplB?.count).toBe(1);
      expect(tplB?.intents).toEqual(['engage']);
    });
  });

  describe('aggregate by window', () => {
    it('buckets two events in different 1h windows into two buckets', () => {
      analytics.record(makeEvent({ timestamp: BASE_TS }));
      analytics.record(makeEvent({ timestamp: BASE_TS + HOUR }));

      const { byWindow } = analytics.aggregate();

      expect(byWindow).toHaveLength(2);
      expect(byWindow[0]).toEqual({
        windowStart: BASE_TS,
        windowEnd: BASE_TS + HOUR,
        count: 1,
      });
      expect(byWindow[1]).toEqual({
        windowStart: BASE_TS + HOUR,
        windowEnd: BASE_TS + 2 * HOUR,
        count: 1,
      });
    });
  });

  describe('export', () => {
    it('produces a JSON-serializable snapshot that round-trips', () => {
      analytics.record(
        makeEvent({
          intent: 'convert',
          templateId: 'tpl-a',
          metadata: { source: 'ui' },
          confidence: 0.9,
        })
      );

      const exported = analytics.export();
      const roundTripped = JSON.parse(JSON.stringify(exported));

      expect(roundTripped).toEqual(exported);
      expect(roundTripped.generatedAt).toBe(exported.generatedAt);
      expect(roundTripped.events).toHaveLength(1);
      expect(roundTripped.aggregates.byIntent).toHaveLength(1);
      expect(roundTripped.aggregates.byTemplate).toHaveLength(1);
      expect(roundTripped.aggregates.byWindow).toHaveLength(1);
    });
  });

  describe('reset', () => {
    it('clears the buffer', () => {
      analytics.record(makeEvent());
      expect(analytics.aggregate().byIntent).toHaveLength(1);

      analytics.reset();

      expect(analytics.aggregate().byIntent).toHaveLength(0);
      expect(analytics.aggregate().byTemplate).toHaveLength(0);
      expect(analytics.aggregate().byWindow).toHaveLength(0);
      expect(analytics.export().events).toHaveLength(0);
    });
  });
});
