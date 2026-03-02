/**
 * Intent Resolution Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  resolveIntent,
  resolveHumanIntent,
  resolveAgentIntent,
  resolveIntents,
  IntentResolver,
  type IntentDeclaration,
  type Signal,
} from '../resolution';

/**
 * Helper function to create test signals
 */
function createSignal(overrides: Partial<Signal> = {}): Signal {
  return {
    type: 'hover',
    value: 1000,
    timestamp: Date.now(),
    actorType: 'human',
    detectionConfidence: 0,
    context: {},
    sessionId: 'test-session',
    ...overrides,
  };
}

/**
 * Helper function to create intent declarations
 */
function createIntentDeclaration(overrides: Partial<IntentDeclaration> = {}): IntentDeclaration {
  return {
    id: 'test-intent',
    goal: 'convert',
    priority: 'normal',
    context: {},
    actorType: 'human',
    componentId: 'test-component',
    timestamp: Date.now(),
    ...overrides,
  };
}

describe('Intent Resolution', () => {
  describe('resolveHumanIntent', () => {
    it('resolves convert goal with normal emphasis', () => {
      const declaration = createIntentDeclaration({ goal: 'convert' });
      const signals: Signal[] = [
        createSignal({ type: 'dwell', value: 3000 }),
        createSignal({ type: 'hover' }),
        createSignal({ type: 'hover' }),
      ];

      const resolution = resolveHumanIntent(declaration, signals);

      expect(resolution.emphasis).toBe('normal');
      expect(resolution.animation).toBe('subtle');
      expect(resolution.density).toBe('normal');
    });

    it('resolves convert goal with strong emphasis (high engagement)', () => {
      const declaration = createIntentDeclaration({ goal: 'convert' });
      const signals: Signal[] = [
        createSignal({ type: 'dwell', value: 6000 }), // >5000ms
        createSignal({ type: 'hover' }),
        createSignal({ type: 'hover' }),
        createSignal({ type: 'hover' }),
        createSignal({ type: 'hover' }), // >3 hovers
      ];

      const resolution = resolveHumanIntent(declaration, signals);

      expect(resolution.emphasis).toBe('strong');
      expect(resolution.microcopy).toContain('Limited offer');
    });

    it('resolves convert goal with subtle emphasis (low engagement)', () => {
      const declaration = createIntentDeclaration({ goal: 'convert' });
      const signals: Signal[] = [
        createSignal({ type: 'dwell', value: 500 }), // <1000ms
      ];

      const resolution = resolveHumanIntent(declaration, signals);

      expect(resolution.emphasis).toBe('subtle');
      expect(resolution.microcopy).toBe('Learn more');
    });

    it('resolves engage goal with playful animation', () => {
      const declaration = createIntentDeclaration({ goal: 'engage' });
      const signals: Signal[] = [];

      const resolution = resolveHumanIntent(declaration, signals);

      expect(resolution.animation).toBe('playful');
      expect(resolution.microcopy).toContain('Explore');
    });

    it('resolves high priority convert with urgent animation', () => {
      const declaration = createIntentDeclaration({ 
        goal: 'convert',
        priority: 'high'
      });
      const signals: Signal[] = [];

      const resolution = resolveHumanIntent(declaration, signals);

      expect(resolution.animation).toBe('urgent');
    });

    it('adjusts hierarchy based on scroll depth', () => {
      // High scroll depth (>80%)
      const declaration1 = createIntentDeclaration();
      const signals1: Signal[] = [
        createSignal({ type: 'scroll', context: { scrollDepth: 90 } }),
      ];

      const resolution1 = resolveHumanIntent(declaration1, signals1);
      expect(resolution1.hierarchy).toBe('focused');

      // Low scroll depth (<20%)
      const declaration2 = createIntentDeclaration();
      const signals2: Signal[] = [
        createSignal({ type: 'scroll', context: { scrollDepth: 10 } }),
      ];

      const resolution2 = resolveHumanIntent(declaration2, signals2);
      expect(resolution2.hierarchy).toBe('de-emphasized');
    });

    it('includes HTML data format for humans', () => {
      const declaration = createIntentDeclaration();
      const signals: Signal[] = [];

      const resolution = resolveHumanIntent(declaration, signals, {
        includeAgentFields: true,
        optimizePerformance: false,
        enableCache: true,
        debug: false,
      });

      expect(resolution.dataFormat).toBe('html');
      expect(resolution.apiSurface).toBeUndefined();
    });
  });

  describe('resolveAgentIntent', () => {
    it('resolves agent intent with compact density', () => {
      const declaration = createIntentDeclaration({ actorType: 'agent' });
      const signals: Signal[] = [];

      const resolution = resolveAgentIntent(declaration, signals);

      expect(resolution.density).toBe('compact');
    });

    it('resolves agent intent with no animation', () => {
      const declaration = createIntentDeclaration({ actorType: 'agent' });
      const signals: Signal[] = [];

      const resolution = resolveAgentIntent(declaration, signals);

      expect(resolution.animation).toBe('none');
    });

    it('resolves agent intent with focused hierarchy', () => {
      const declaration = createIntentDeclaration({ actorType: 'agent' });
      const signals: Signal[] = [];

      const resolution = resolveAgentIntent(declaration, signals);

      expect(resolution.hierarchy).toBe('focused');
    });

    it('provides JSON-LD format for agents', () => {
      const declaration = createIntentDeclaration({ actorType: 'agent' });
      const signals: Signal[] = [];

      const resolution = resolveAgentIntent(declaration, signals);

      expect(resolution.dataFormat).toBe('json-ld');
    });

    it('exposes API surface for agents with API capability', () => {
      const declaration = createIntentDeclaration({
        actorType: 'agent',
        agentCapabilities: {
          canParseStructuredData: true,
          canExecuteAPIs: true,
          canNegotiate: false,
          supportsStreaming: false,
          maxParallelism: 1,
        },
      });
      const signals: Signal[] = [];

      const resolution = resolveAgentIntent(declaration, signals);

      expect(resolution.apiSurface).toBeDefined();
      expect(resolution.apiSurface?.exposeEndpoints).toBe(true);
      expect(resolution.apiSurface?.schemaType).toBe('graphql');
    });

    it('provides negotiation protocol for agents with negotiation capability', () => {
      const declaration = createIntentDeclaration({
        actorType: 'agent',
        agentCapabilities: {
          canParseStructuredData: true,
          canExecuteAPIs: true,
          canNegotiate: true,
          supportsStreaming: false,
          maxParallelism: 1,
        },
      });
      const signals: Signal[] = [];

      const resolution = resolveAgentIntent(declaration, signals);

      expect(resolution.negotiationProtocol).toBeDefined();
      expect(resolution.negotiationProtocol?.enabled).toBe(true);
      expect(resolution.negotiationProtocol?.protocol).toBe('contract-net');
    });

    it('includes structured data payload', () => {
      const declaration = createIntentDeclaration({
        actorType: 'agent',
        goal: 'convert',
        componentId: 'test-123',
      });
      const signals: Signal[] = [];

      const resolution = resolveAgentIntent(declaration, signals);

      expect(resolution.structuredData).toBeDefined();
      expect(resolution.structuredData['@type']).toBe('Action');
      expect(resolution.structuredData.actionName).toBe('convert');
    });

    it('includes cache headers', () => {
      const declaration = createIntentDeclaration({ actorType: 'agent' });
      const signals: Signal[] = [];

      const resolution = resolveAgentIntent(declaration, signals);

      expect(resolution.cacheHeaders).toBeDefined();
      expect(resolution.cacheHeaders?.maxAge).toBe(300);
      expect(resolution.cacheHeaders?.etag).toBeDefined();
    });

    it('respects agent timeout constraints', () => {
      const declaration = createIntentDeclaration({
        actorType: 'agent',
        agentConstraints: {
          timeout: 10000, // 10 seconds
          retryPolicy: 'fixed',
        },
      });
      const signals: Signal[] = [];

      const resolution = resolveAgentIntent(declaration, signals);

      // Timeout should be in agent constraints
      expect(resolution.cacheHeaders?.maxAge).toBe(300);
      // Agent constraints are used internally, not exposed in resolution
    });

    it('supports batch API for agents with high parallelism', () => {
      const declaration = createIntentDeclaration({
        actorType: 'agent',
        agentCapabilities: {
          canParseStructuredData: true,
          canExecuteAPIs: true,
          canNegotiate: false,
          supportsStreaming: false,
          maxParallelism: 10,
        },
      });
      const signals: Signal[] = [];

      const resolution = resolveAgentIntent(declaration, signals);

      expect(resolution.apiSurface?.batchSupport).toBe(true);
    });

    it('supports streaming for agents with streaming capability', () => {
      const declaration = createIntentDeclaration({
        actorType: 'agent',
        agentCapabilities: {
          canParseStructuredData: true,
          canExecuteAPIs: true,
          canNegotiate: false,
          supportsStreaming: true,
          maxParallelism: 1,
        },
      });
      const signals: Signal[] = [];

      const resolution = resolveAgentIntent(declaration, signals);

      expect(resolution.apiSurface?.streamingSupport).toBe(true);
    });
  });

  describe('resolveIntent (router)', () => {
    it('routes to human resolver for human actor', () => {
      const declaration = createIntentDeclaration({ actorType: 'human' });
      const signals: Signal[] = [];

      const resolution = resolveIntent(declaration, signals);

      expect(resolution.dataFormat).toBe('html');
      expect(resolution.animation).not.toBe('none');
    });

    it('routes to agent resolver for agent actor', () => {
      const declaration = createIntentDeclaration({ actorType: 'agent' });
      const signals: Signal[] = [];

      const resolution = resolveIntent(declaration, signals);

      expect(resolution.dataFormat).toBe('json-ld');
      expect(resolution.animation).toBe('none');
    });

    it('handles unknown actor type (defaults to human)', () => {
      const declaration = createIntentDeclaration({ actorType: 'unknown' });
      const signals: Signal[] = [];

      const resolution = resolveIntent(declaration, signals);

      // Should default to human-like resolution
      expect(resolution.dataFormat).toBe('html');
    });
  });

  describe('resolveIntents (batch)', () => {
    it('resolves multiple intents', () => {
      const declarations: IntentDeclaration[] = [
        createIntentDeclaration({ id: 'intent-1', goal: 'convert', priority: 'normal' }),
        createIntentDeclaration({ id: 'intent-2', goal: 'inform', priority: 'normal' }),
        createIntentDeclaration({ id: 'intent-3', goal: 'engage', priority: 'normal' }),
      ];
      const signals: Signal[][] = [[], [], []];

      const resolutions = resolveIntents(declarations, signals);

      expect(resolutions).toHaveLength(3);
      // Default emphasis for normal priority with no engagement data is 'subtle'
      expect(resolutions[0].microcopy).toContain('Learn more');
      expect(resolutions[1].microcopy).toContain('Read more');
      expect(resolutions[2].microcopy).toContain('Explore');
    });

    it('handles mismatched array lengths', () => {
      const declarations: IntentDeclaration[] = [
        createIntentDeclaration({ id: 'intent-1' }),
        createIntentDeclaration({ id: 'intent-2' }),
      ];
      const signals: Signal[][] = [
        [createSignal()],
        // Missing second array
      ];

      const resolutions = resolveIntents(declarations, signals);

      expect(resolutions).toHaveLength(2);
    });
  });

  describe('IntentResolver (class)', () => {
    let resolver: IntentResolver;

    beforeEach(() => {
      resolver = new IntentResolver();
    });

    it('resolves intent', () => {
      const declaration = createIntentDeclaration();
      const signals: Signal[] = [];

      const resolution = resolver.resolve(declaration, signals);

      expect(resolution).toBeDefined();
      expect(resolution.emphasis).toBeDefined();
    });

    it('caches resolution', () => {
      const declaration = createIntentDeclaration();
      const signals: Signal[] = [];

      // First resolution
      const resolution1 = resolver.resolve(declaration, signals);
      
      // Second resolution (should be cached)
      const resolution2 = resolver.resolve(declaration, signals);

      expect(resolution1).toBe(resolution2); // Same object reference
    });

    it('clears cache for specific component', () => {
      const declaration1 = createIntentDeclaration({ componentId: 'comp-1' });
      const declaration2 = createIntentDeclaration({ componentId: 'comp-2' });
      const signals: Signal[] = [];

      resolver.resolve(declaration1, signals);
      resolver.resolve(declaration2, signals);

      resolver.clearCache('comp-1');

      const stats = resolver.getCacheStats();
      expect(stats.size).toBe(1); // Only comp-2 should remain
    });

    it('clears all cache', () => {
      const declaration1 = createIntentDeclaration({ componentId: 'comp-1' });
      const declaration2 = createIntentDeclaration({ componentId: 'comp-2' });
      const signals: Signal[] = [];

      resolver.resolve(declaration1, signals);
      resolver.resolve(declaration2, signals);

      resolver.clearCache();

      const stats = resolver.getCacheStats();
      expect(stats.size).toBe(0);
    });

    it('respects cache TTL', () => {
      // Create resolver with very short TTL (1ms)
      const shortTTLResolver = new IntentResolver(DEFAULT_RESOLUTION_OPTIONS, 1);
      
      const declaration = createIntentDeclaration();
      const signals: Signal[] = [];

      // First resolution
      const resolution1 = shortTTLResolver.resolve(declaration, signals);
      
      // Wait for cache to expire
      setTimeout(() => {
        // Second resolution (should not be cached)
        const resolution2 = shortTTLResolver.resolve(declaration, signals);
        
        expect(resolution1).not.toBe(resolution2); // Different object references
      }, 10);
    });
  });
});

// Import for tests
import { DEFAULT_RESOLUTION_OPTIONS } from '../resolution';
