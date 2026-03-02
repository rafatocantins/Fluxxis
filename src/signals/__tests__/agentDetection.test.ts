/**
 * Agent Detection Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  detectActorType,
  calculateClickRate,
  analyzeNavigationPattern,
  checkStructuredDataAcceptance,
  checkAPIUsage,
  analyzeScrollPattern,
  analyzeHoverPattern,
  RealTimeAgentDetector,
  type Signal,
} from '../agentDetection';

/**
 * Helper function to create test signals
 */
function createSignal(overrides: Partial<Signal> = {}): Signal {
  return {
    type: 'click',
    value: 1,
    timestamp: Date.now(),
    actorType: 'unknown',
    detectionConfidence: 0,
    context: {},
    sessionId: 'test-session',
    ...overrides,
  };
}

describe('Agent Detection', () => {
  describe('calculateClickRate', () => {
    it('returns 0 for less than 2 clicks', () => {
      const signals: Signal[] = [
        createSignal({ type: 'click', timestamp: 1000 }),
      ];
      
      expect(calculateClickRate(signals)).toBe(0);
    });

    it('calculates correct click rate', () => {
      const signals: Signal[] = [
        createSignal({ type: 'click', timestamp: 0 }),
        createSignal({ type: 'click', timestamp: 1000 }),
        createSignal({ type: 'click', timestamp: 2000 }),
      ];
      
      // 3 clicks in 2 seconds = 1.5 clicks/second
      expect(calculateClickRate(signals)).toBeCloseTo(1.5, 1);
    });

    it('detects high click rate (agent behavior)', () => {
      const signals: Signal[] = [];
      // 200 clicks in 1 second
      for (let i = 0; i < 200; i++) {
        signals.push(createSignal({ 
          type: 'click', 
          timestamp: i * 5 // 5ms apart
        }));
      }
      
      expect(calculateClickRate(signals)).toBeGreaterThan(100);
    });
  });

  describe('analyzeNavigationPattern', () => {
    it('returns human for insufficient data', () => {
      const signals: Signal[] = [
        createSignal({ type: 'viewport', timestamp: 0 }),
      ];
      
      expect(analyzeNavigationPattern(signals)).toBe('human');
    });

    it('detects systematic pattern (agent behavior)', () => {
      const signals: Signal[] = [];
      // Perfect intervals (1000ms apart)
      for (let i = 0; i < 5; i++) {
        signals.push(createSignal({ 
          type: 'viewport', 
          timestamp: i * 1000 
        }));
      }
      
      expect(analyzeNavigationPattern(signals)).toBe('systematic');
    });

    it('detects human pattern (varied intervals)', () => {
      const signals: Signal[] = [
        createSignal({ type: 'viewport', timestamp: 0 }),
        createSignal({ type: 'viewport', timestamp: 1500 }),
        createSignal({ type: 'viewport', timestamp: 3200 }),
        createSignal({ type: 'viewport', timestamp: 4100 }),
        createSignal({ type: 'viewport', timestamp: 6800 }),
      ];
      
      expect(analyzeNavigationPattern(signals)).toBe('human');
    });
  });

  describe('checkStructuredDataAcceptance', () => {
    it('returns false for no API usage', () => {
      const signals: Signal[] = [
        createSignal({ type: 'click' }),
        createSignal({ type: 'hover' }),
      ];
      
      expect(checkStructuredDataAcceptance(signals)).toBe(false);
    });

    it('returns true for API usage', () => {
      const signals: Signal[] = [
        createSignal({ 
          type: 'click',
          context: { endpoint: '/api/article/structured' }
        }),
      ];
      
      expect(checkStructuredDataAcceptance(signals)).toBe(true);
    });
  });

  describe('checkAPIUsage', () => {
    it('returns false for no API usage', () => {
      const signals: Signal[] = [
        createSignal({ type: 'click' }),
      ];
      
      expect(checkAPIUsage(signals)).toBe(false);
    });

    it('returns true for API usage', () => {
      const signals: Signal[] = [
        createSignal({ 
          type: 'click',
          context: { source: 'api' }
        }),
      ];
      
      expect(checkAPIUsage(signals)).toBe(true);
    });
  });

  describe('analyzeScrollPattern', () => {
    it('returns human for insufficient data', () => {
      const signals: Signal[] = [
        createSignal({ type: 'scroll' }),
      ];
      
      expect(analyzeScrollPattern(signals)).toBe('human');
    });

    it('detects agent pattern (uniform scroll)', () => {
      const signals: Signal[] = [];
      // Perfect scroll velocity (no variation)
      for (let i = 0; i < 5; i++) {
        signals.push(createSignal({ 
          type: 'scroll',
          context: { scrollVelocity: 100 }
        }));
      }
      
      expect(analyzeScrollPattern(signals)).toBe('agent');
    });

    it('detects human pattern (varied scroll)', () => {
      const signals: Signal[] = [
        createSignal({ type: 'scroll', context: { scrollVelocity: 50 } }),
        createSignal({ type: 'scroll', context: { scrollVelocity: 120 } }),
        createSignal({ type: 'scroll', context: { scrollVelocity: 80 } }),
        createSignal({ type: 'scroll', context: { scrollVelocity: 200 } }),
        createSignal({ type: 'scroll', context: { scrollVelocity: 90 } }),
      ];
      
      expect(analyzeScrollPattern(signals)).toBe('human');
    });
  });

  describe('analyzeHoverPattern', () => {
    it('returns human for insufficient data', () => {
      const signals: Signal[] = [
        createSignal({ type: 'hover' }),
      ];
      
      expect(analyzeHoverPattern(signals)).toBe('human');
    });

    it('detects agent pattern (perfectly still)', () => {
      const signals: Signal[] = [];
      // Perfect position (no movement)
      for (let i = 0; i < 5; i++) {
        signals.push(createSignal({ 
          type: 'hover',
          context: { position: { x: 100, y: 200 } }
        }));
      }
      
      expect(analyzeHoverPattern(signals)).toBe('agent');
    });

    it('detects human pattern (micro-movements)', () => {
      const signals: Signal[] = [
        createSignal({ type: 'hover', context: { position: { x: 100, y: 200 } } }),
        createSignal({ type: 'hover', context: { position: { x: 102, y: 198 } } }),
        createSignal({ type: 'hover', context: { position: { x: 98, y: 203 } } }),
        createSignal({ type: 'hover', context: { position: { x: 105, y: 195 } } }),
        createSignal({ type: 'hover', context: { position: { x: 101, y: 201 } } }),
      ];
      
      expect(analyzeHoverPattern(signals)).toBe('human');
    });
  });

  describe('detectActorType', () => {
    it('detects human behavior', () => {
      const signals: Signal[] = [
        createSignal({ type: 'click', timestamp: 0 }),
        createSignal({ type: 'click', timestamp: 1500 }),
        createSignal({ type: 'click', timestamp: 3200 }),
        createSignal({ type: 'scroll', context: { scrollVelocity: 50 } }),
        createSignal({ type: 'scroll', context: { scrollVelocity: 120 } }),
        createSignal({ type: 'hover', context: { position: { x: 100, y: 200 } } }),
        createSignal({ type: 'hover', context: { position: { x: 102, y: 198 } } }),
      ];
      
      const result = detectActorType(signals);
      
      expect(result.actorType).toBe('human');
      expect(result.confidence).toBeLessThan(0.5);
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    it('detects agent behavior', () => {
      const signals: Signal[] = [];
      
      // Systematic clicks (high rate)
      for (let i = 0; i < 150; i++) {
        signals.push(createSignal({ 
          type: 'click', 
          timestamp: i * 5 
        }));
      }
      
      // Systematic navigation
      for (let i = 0; i < 5; i++) {
        signals.push(createSignal({ 
          type: 'viewport', 
          timestamp: i * 1000 
        }));
      }
      
      // API usage
      signals.push(createSignal({ 
        type: 'click',
        context: { endpoint: '/api/data', source: 'api' }
      }));
      
      const result = detectActorType(signals);
      
      expect(result.actorType).toBe('agent');
      expect(result.confidence).toBeGreaterThan(0.6);
      expect(result.reasons.length).toBeGreaterThan(2);
    });

    it('returns human for minimal data', () => {
      const signals: Signal[] = [
        createSignal({ type: 'click', timestamp: 0 }),
        createSignal({ type: 'click', timestamp: 1000 }),
      ];
      
      const result = detectActorType(signals);
      
      // With only 2 clicks, detection defaults to human (not enough evidence for agent)
      expect(result.actorType).toBe('human');
    });

    it('includes timestamp in result', () => {
      const signals: Signal[] = [
        createSignal({ type: 'click' }),
      ];
      
      const result = detectActorType(signals);
      
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it('provides reasons for detection', () => {
      const signals: Signal[] = [
        createSignal({ type: 'click', timestamp: 0 }),
        createSignal({ type: 'click', timestamp: 1500 }),
      ];
      
      const result = detectActorType(signals);
      
      expect(result.reasons).toBeInstanceOf(Array);
      expect(result.reasons.length).toBeGreaterThan(0);
    });
  });

  describe('RealTimeAgentDetector', () => {
    let detector: RealTimeAgentDetector;

    beforeEach(() => {
      detector = new RealTimeAgentDetector();
    });

    it('starts with unknown detection', () => {
      const result = detector.getCurrentDetection();
      
      expect(result.actorType).toBe('unknown');
      expect(result.confidence).toBe(0);
    });

    it('updates detection after adding signals', () => {
      // Add 10 signals (triggers re-detection)
      for (let i = 0; i < 10; i++) {
        detector.addSignal(createSignal({ 
          type: 'click',
          timestamp: i * 1000 
        }));
      }
      
      const result = detector.getCurrentDetection();
      
      expect(result.actorType).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('detects agent in real-time', () => {
      // Add agent-like signals systematically
      // Need multiple batches of 10 to trigger re-detection
      for (let batch = 0; batch < 5; batch++) {
        // High click rate
        for (let i = 0; i < 10; i++) {
          detector.addSignal(createSignal({ 
            type: 'click',
            timestamp: batch * 100 + i * 5 
          }));
        }
        
        // API usage
        detector.addSignal(createSignal({ 
          type: 'click',
          context: { source: 'api', endpoint: '/api/data' },
          timestamp: batch * 100 + 50
        }));
      }
      
      const result = detector.getCurrentDetection();
      // Agent should be detected with high confidence signals
      expect(result.confidence).toBeGreaterThan(0.3);
    });

    it('detects human in real-time', () => {
      // Add human-like signals
      for (let i = 0; i < 10; i++) {
        detector.addSignal(createSignal({ 
          type: 'click',
          timestamp: i * 1500 
        }));
      }
      
      expect(detector.isHuman()).toBe(true);
      expect(detector.isAgent()).toBe(false);
    });

    it('resets state', () => {
      // Add some signals
      detector.addSignal(createSignal({ type: 'click' }));
      
      // Reset
      detector.reset();
      
      const result = detector.getCurrentDetection();
      
      expect(result.actorType).toBe('unknown');
      expect(result.reasons).toContain('No signals yet');
    });
  });

  describe('detectActorTypes (batch)', () => {
    it('processes multiple signal streams', () => {
      const streams: Signal[][] = [
        [createSignal({ type: 'click', timestamp: 0 })],
        [createSignal({ type: 'click', timestamp: 1000 })],
        [createSignal({ type: 'click', timestamp: 2000 })],
      ];
      
      const results = detectActorTypes(streams);
      
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.actorType).toBeDefined();
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      });
    });
  });
});

// Import batch function
import { detectActorTypes } from '../agentDetection';
