/**
 * JSON-LD Intent Signal Tests
 */

import { describe, it, expect } from 'vitest';
import {
  generateIntentSignal,
  type IntentSignalBinding,
} from '../intent-signal';
import { validateStructuredData } from '../generator';
import type { Signal } from '../../types';

/**
 * Helper function to create test signals.
 */
function createSignal(overrides: Partial<Signal> = {}): Signal {
  return {
    type: 'click',
    value: 1,
    timestamp: Date.now(),
    ...overrides,
  };
}

describe('generateIntentSignal', () => {
  describe('document shape', () => {
    it('produces an IntentSignal JSON-LD document', () => {
      const doc = generateIntentSignal();

      expect(doc['@type']).toBe('IntentSignal');
      expect(doc['@context']).toBe('https://schema.org');
    });

    it('produces valid JSON-LD', () => {
      const doc = generateIntentSignal();

      const result = validateStructuredData(JSON.stringify(doc), 'json-ld');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('applies a default name and respects a custom name', () => {
      expect(generateIntentSignal().name).toBe('fluxxis-intent-signal');
      expect(generateIntentSignal({ name: 'custom-signal' }).name).toBe('custom-signal');
    });

    it('aliases bindings to templates', () => {
      const templates: IntentSignalBinding[] = [
        { intent: 'convert', templateId: 'tpl-1', confidence: 0.9 },
        { intent: 'inform', templateId: 'tpl-2', confidence: 0.7 },
      ];

      const doc = generateIntentSignal({ templates });

      expect(doc.templates).toEqual(templates);
      expect(doc.bindings).toBe(doc.templates);
    });
  });

  describe('actor detection', () => {
    it('detects an agent from a high click rate', () => {
      const signals: Signal[] = [];

      // ~150 clicks within 1 second (5ms apart => 750ms total)
      for (let i = 0; i < 150; i++) {
        signals.push(createSignal({ type: 'click', timestamp: i * 5 }));
      }

      // Systematic navigation reinforces the agent signal
      for (let i = 0; i < 5; i++) {
        signals.push(createSignal({ type: 'viewport', timestamp: i * 1000 }));
      }

      const doc = generateIntentSignal({ signals });

      expect(doc.actor.type).toBe('agent');
    });

    it('reports unknown for empty signals', () => {
      const doc = generateIntentSignal();

      expect(doc.actor.type).toBe('unknown');
    });
  });

  describe('intents', () => {
    it('deduplicates repeated goals', () => {
      const doc = generateIntentSignal({
        intents: [
          { goal: 'convert', confidence: 0.9, priority: 'high' },
          { goal: 'engage', confidence: 0.8, priority: 'normal' },
          { goal: 'convert', confidence: 0.7, priority: 'normal' },
          { goal: 'inform', confidence: 0.6, priority: 'low' },
        ],
      });

      expect(doc.intents).toEqual(['convert', 'engage', 'inform']);
    });

    it('derives intents from signals when no explicit intents are provided', () => {
      const signals: Signal[] = [
        createSignal({ type: 'click', intent: { goal: 'convert', priority: 'high' } }),
        createSignal({ type: 'click', intent: { goal: 'convert', priority: 'normal' } }),
        createSignal({ type: 'click', intent: { goal: 'inform', priority: 'low' } }),
      ];

      const doc = generateIntentSignal({ signals });

      expect(doc.intents).toEqual(['convert', 'inform']);
    });
  });

  describe('generatedAt', () => {
    it('is a parseable ISO date', () => {
      const doc = generateIntentSignal();

      expect(Number.isNaN(Date.parse(doc.generatedAt))).toBe(false);
      expect(new Date(doc.generatedAt).toString()).not.toBe('Invalid Date');
    });
  });
});
