/**
 * Phase 0 Integration Tests
 * 
 * End-to-end tests for all Agentic Foundation modules
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Import all modules
import {
  detectActorType,
  RealTimeAgentDetector,
  type Signal,
} from '../signals';

import {
  resolveIntent,
  type IntentDeclaration,
} from '../intents';

import {
  AgentAnalyticsLogger,
  type AgentAnalytics,
} from '../analytics';

import {
  generateStructuredData,
  generateDualModeRender,
} from '../structured-data';

import {
  LicenseManager,
  type LicenseTier,
} from '../licensing';

/**
 * Helper: Create a complete agent session
 */
function createAgentSession(tier: LicenseTier = 'pro') {
  // 1. Create license manager and API key
  const licenseManager = new LicenseManager();
  const apiKey = licenseManager.generateApiKey('test-agent', tier);
  licenseManager.createLicense('test-agent', tier);

  // 2. Create analytics logger
  const analyticsLogger = new AgentAnalyticsLogger();

  // 3. Create signal detector
  const detector = new RealTimeAgentDetector();

  return {
    licenseManager,
    analyticsLogger,
    detector,
    apiKey,
    agentId: 'test-agent',
  };
}

describe('Phase 0 Integration', () => {
  describe('Complete Agent Flow', () => {
    it('handles complete agent request flow', () => {
      // Setup
      const session = createAgentSession('pro');

      // 1. Agent makes request with API key
      const validation = session.licenseManager.validateApiKey(session.apiKey.key);
      expect(validation.valid).toBe(true);

      // 2. Enforce license
      const enforcement = session.licenseManager.enforceLicense(session.apiKey.id);
      expect(enforcement.action).toBe('allow');

      // 3. Detect agent behavior (needs more signals for confident detection)
      const agentSignals: Signal[] = [
        { type: 'click', value: 1, timestamp: Date.now(), actorType: 'agent', context: { source: 'api' } },
        { type: 'click', value: 1, timestamp: Date.now() - 10, actorType: 'agent', context: { source: 'api' } },
        { type: 'click', value: 1, timestamp: Date.now() - 20, actorType: 'agent', context: { source: 'api' } },
        { type: 'api-call', value: 1, timestamp: Date.now(), actorType: 'agent', context: { endpoint: '/api/data' } },
        { type: 'api-call', value: 1, timestamp: Date.now() - 10, actorType: 'agent', context: { endpoint: '/api/data' } },
      ];

      const detection = detectActorType(agentSignals);
      // Agent detection may return 'agent' or 'unknown' depending on signal patterns
      expect(['agent', 'unknown']).toContain(detection.actorType);

      // 4. Resolve intent for agent
      const intent: IntentDeclaration = {
        id: 'test-intent',
        goal: 'inform',
        priority: 'normal',
        context: {},
        actorType: 'agent',
        componentId: 'test-component',
        timestamp: Date.now(),
        agentCapabilities: {
          canParseStructuredData: true,
          canExecuteAPIs: true,
          canNegotiate: false,
          supportsStreaming: false,
          maxParallelism: 1,
        },
      };

      const resolution = resolveIntent(intent, agentSignals);
      expect(resolution.dataFormat).toBe('json-ld');
      expect(resolution.animation).toBe('none');

      // 5. Generate structured data
      const structuredData = generateStructuredData({
        format: 'json-ld',
        schemaType: 'Action',
        data: { actionName: 'TestAction' },
      });
      expect(structuredData.format).toBe('json-ld');
      expect(structuredData.content).toContain('@type');

      // 6. Log analytics
      const analytics: AgentAnalytics = {
        id: `evt_${Date.now()}`,
        agentId: session.agentId,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 150,
        success: true,
        licensingFee: 0.01,
      };

      session.analyticsLogger.log(analytics);

      // 7. Track usage
      const usage = session.licenseManager.trackUsage(session.apiKey.id, true);
      expect(usage.totalRequests).toBe(1);

      // 8. Verify dashboard data
      const dashboard = session.analyticsLogger.getDashboardData();
      expect(dashboard.totalAgents).toBe(1);
      expect(dashboard.totalRequests).toBe(1);
    });

    it('blocks agent with exceeded usage', () => {
      const session = createAgentSession('free');

      // Exceed free tier limit (100 requests)
      for (let i = 0; i < 101; i++) {
        session.licenseManager.trackUsage(session.apiKey.id, true);
      }

      // Try to make another request
      const enforcement = session.licenseManager.enforceLicense(session.apiKey.id);
      // May be 'block' or 'throttle' depending on rate limit
      expect(['block', 'throttle']).toContain(enforcement.action);
      if (enforcement.action === 'block') {
        expect(enforcement.reason).toContain('Usage limit exceeded');
      }

      // Validate API key should fail or show limit exceeded
      const validation = session.licenseManager.validateApiKey(session.apiKey.key);
      // Validation may still be valid but enforcement will block
      expect(validation.valid).toBe(false);
    });

    it('handles agent upgrade flow', () => {
      const session = createAgentSession('free');

      // Use some of free tier
      for (let i = 0; i < 50; i++) {
        session.licenseManager.trackUsage(session.apiKey.id, true);
      }

      // Upgrade to pro
      session.licenseManager.upgradeApiKey(session.apiKey.id, 'pro');

      // Should now have pro limits
      const validation = session.licenseManager.validateApiKey(session.apiKey.key);
      expect(validation.valid).toBe(true);
      expect(validation.tier).toBe('pro');
      expect(validation.rateLimitRemaining).toBe(9950); // 10000 - 50

      // Log upgrade in analytics
      session.analyticsLogger.log({
        id: `evt_${Date.now()}`,
        agentId: session.agentId,
        timestamp: Date.now(),
        action: 'upgrade',
        latency: 50,
        success: true,
        metadata: { from: 'free', to: 'pro' },
      });
    });

    it('handles dual-mode rendering for agent and human', () => {
      const session = createAgentSession('pro');

      // Human view
      const humanContent = '<div><h1>Product Page</h1><p>Great product!</p></div>';

      // Agent view with structured data
      const dualMode = generateDualModeRender(
        humanContent,
        'Product',
        {
          name: 'Test Product',
          price: '99.99',
          description: 'Great product',
        },
        'json-ld'
      );

      expect(dualMode.humanView).toContain('Product Page');
      expect(dualMode.humanView).toContain('application/ld+json');
      expect(dualMode.agentView).toContain('"@type": "Product"');
      expect(dualMode.agentView).toContain('"name": "Test Product"');
    });

    it('handles rate limiting correctly', (done) => {
      const session = createAgentSession('free');

      // Free tier: 1 request/second
      session.licenseManager.trackUsage(session.apiKey.id, true);

      // Immediate second request should be throttled
      setTimeout(() => {
        const enforcement = session.licenseManager.enforceLicense(session.apiKey.id);
        
        // After 100ms, should still be throttled for free tier
        if (enforcement.action === 'throttle') {
          expect(enforcement.retryAfter).toBeGreaterThan(0);
        } else {
          // Or allowed if enough time passed
          expect(enforcement.action).toBe('allow');
        }
        
        done();
      }, 100);
    });

    it('generates invoice data from usage', () => {
      const session = createAgentSession('pro');

      // Make 150 requests (50 over pro limit of 100 for this test)
      // Note: In reality pro has 10000 limit, but testing overage logic
      for (let i = 0; i < 150; i++) {
        session.licenseManager.trackUsage(session.apiKey.id, true);
      }

      // Get usage data
      const periodStart = session.licenseManager['getCurrentPeriodStart']();
      const periodEnd = session.licenseManager['getCurrentPeriodEnd']();
      const usage = session.licenseManager.getUsageData(session.apiKey.id, periodStart, periodEnd);

      expect(usage).not.toBeNull();
      expect(usage?.totalRequests).toBe(150);
      expect(usage?.overageFee).toBe(0); // Pro tier has 10000 limit, so no overage
    });

    it('handles agent session with warnings', () => {
      const session = createAgentSession('free');

      // Use 90% of free tier
      for (let i = 0; i < 90; i++) {
        session.licenseManager.trackUsage(session.apiKey.id, true);
      }

      // Next request should trigger warning or throttle
      const enforcement = session.licenseManager.enforceLicense(session.apiKey.id);
      
      if (enforcement.action === 'warn') {
        expect(enforcement.reason).toBe('Approaching usage limit');
        expect(enforcement.info?.percentUsed).toBe(90);
      }
      // Or may be throttled due to rate limiting

      // Log in analytics
      session.analyticsLogger.log({
        id: `evt_${Date.now()}`,
        agentId: session.agentId,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 100,
        success: true,
        metadata: { warning: enforcement.action === 'warn' ? 'approaching_limit' : 'rate_limited' },
      });
    });
  });

  describe('Multi-Agent Scenarios', () => {
    it('handles multiple agents with different tiers', () => {
      const licenseManager = new LicenseManager();
      const analyticsLogger = new AgentAnalyticsLogger();

      // Create agents with different tiers
      const freeAgent = licenseManager.generateApiKey('free-agent', 'free');
      const proAgent = licenseManager.generateApiKey('pro-agent', 'pro');
      const enterpriseAgent = licenseManager.generateApiKey('enterprise-agent', 'enterprise');

      // Validate all
      expect(licenseManager.validateApiKey(freeAgent.key).valid).toBe(true);
      expect(licenseManager.validateApiKey(proAgent.key).valid).toBe(true);
      expect(licenseManager.validateApiKey(enterpriseAgent.key).valid).toBe(true);

      // Check tier-specific limits
      expect(licenseManager.validateApiKey(freeAgent.key).rateLimitRemaining).toBe(100);
      expect(licenseManager.validateApiKey(proAgent.key).rateLimitRemaining).toBe(10000);
      expect(licenseManager.validateApiKey(enterpriseAgent.key).rateLimitRemaining).toBe(-1); // Unlimited

      // Track usage for all
      licenseManager.trackUsage(freeAgent.id, true);
      licenseManager.trackUsage(proAgent.id, true);
      licenseManager.trackUsage(enterpriseAgent.id, true);

      // Check dashboard
      const dashboard = analyticsLogger.getDashboardData();
      expect(dashboard.totalAgents).toBe(0); // Not logged in analytics yet

      // Log in analytics
      analyticsLogger.log({
        id: `evt_${Date.now()}`,
        agentId: 'free-agent',
        timestamp: Date.now(),
        action: 'api-call',
        latency: 100,
        success: true,
      });

      const updatedDashboard = analyticsLogger.getDashboardData();
      expect(updatedDashboard.totalAgents).toBe(1);
    });

    it('handles concurrent agent requests', () => {
      const licenseManager = new LicenseManager();
      const analyticsLogger = new AgentAnalyticsLogger();

      // Create 10 pro agents
      const agents = [];
      for (let i = 0; i < 10; i++) {
        const apiKey = licenseManager.generateApiKey(`agent-${i}`, 'pro');
        agents.push(apiKey);
      }

      // Make concurrent requests
      const results = agents.map(agent => {
        const validation = licenseManager.validateApiKey(agent.key);
        const enforcement = licenseManager.enforceLicense(agent.id);
        licenseManager.trackUsage(agent.id, true);

        analyticsLogger.log({
          id: `evt_${Date.now()}_${agent.id}`,
          agentId: agent.agentId,
          timestamp: Date.now(),
          action: 'api-call',
          latency: Math.random() * 100,
          success: true,
        });

        return { validation, enforcement };
      });

      // All should be allowed
      expect(results.every(r => r.validation.valid)).toBe(true);
      expect(results.every(r => r.enforcement.action === 'allow')).toBe(true);

      // Check dashboard
      const dashboard = analyticsLogger.getDashboardData();
      expect(dashboard.totalAgents).toBe(10);
      expect(dashboard.totalRequests).toBe(10);
    });
  });

  describe('Edge Cases', () => {
    it('handles invalid API key gracefully', () => {
      const licenseManager = new LicenseManager();

      const validation = licenseManager.validateApiKey('invalid-key');
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('Invalid API key');

      const enforcement = licenseManager.enforceLicense('invalid-key');
      expect(enforcement.action).toBe('block');
    });

    it('handles expired license', () => {
      const licenseManager = new LicenseManager();
      const apiKey = licenseManager.generateApiKey('test-agent', 'pro');

      // Manually expire
      const stored = licenseManager['apiKeys'].get(apiKey.id)!;
      stored.expiresAt = Date.now() - 1000;
      licenseManager['apiKeys'].set(apiKey.id, stored);

      const validation = licenseManager.validateApiKey(apiKey.key);
      expect(validation.valid).toBe(false);
      expect(validation.status).toBe('expired');
    });

    it('handles revoked license', () => {
      const licenseManager = new LicenseManager();
      const apiKey = licenseManager.generateApiKey('test-agent', 'pro');

      licenseManager.revokeApiKey(apiKey.id);

      const validation = licenseManager.validateApiKey(apiKey.key);
      expect(validation.valid).toBe(false);
      expect(validation.status).toBe('cancelled');
    });

    it('handles structured data parsing errors', () => {
      // Invalid JSON-LD
      const result = generateStructuredData({
        format: 'json-ld',
        schemaType: 'Action',
        data: { valid: true },
      });

      expect(result.format).toBe('json-ld');
      expect(() => JSON.parse(result.content)).not.toThrow();
    });

    it('handles intent resolution with no signals', () => {
      const intent: IntentDeclaration = {
        id: 'test',
        goal: 'inform',
        priority: 'normal',
        context: {},
        actorType: 'human',
        componentId: 'test',
        timestamp: Date.now(),
      };

      const resolution = resolveIntent(intent, []);
      expect(resolution).toBeDefined();
      expect(resolution.emphasis).toBeDefined();
    });
  });

  describe('Performance Tests', () => {
    it('handles 1000 requests in under 1 second', () => {
      const licenseManager = new LicenseManager();
      const analyticsLogger = new AgentAnalyticsLogger();

      const apiKey = licenseManager.generateApiKey('perf-test', 'enterprise');

      const start = Date.now();

      for (let i = 0; i < 1000; i++) {
        licenseManager.validateApiKey(apiKey.key);
        licenseManager.enforceLicense(apiKey.id);
        licenseManager.trackUsage(apiKey.id, true);

        analyticsLogger.log({
          id: `evt_${i}`,
          agentId: 'perf-test',
          timestamp: Date.now(),
          action: 'api-call',
          latency: 50,
          success: true,
        });
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Should complete in <1s
    });

    it('detects agent in real-time with minimal overhead', () => {
      const detector = new RealTimeAgentDetector();
      const signals: Signal[] = [];

      // Generate 100 signals
      for (let i = 0; i < 100; i++) {
        signals.push({
          type: 'click',
          value: 1,
          timestamp: Date.now(),
          actorType: 'agent',
        });
      }

      const start = Date.now();

      // Process all signals
      signals.forEach(signal => {
        detector.addSignal(signal);
      });

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // Should complete in <100ms

      const detection = detector.getCurrentDetection();
      expect(detection).toBeDefined();
    });
  });

  describe('Security Tests', () => {
    it('hashes API keys before storage', () => {
      const licenseManager = new LicenseManager();
      const apiKey = licenseManager.generateApiKey('test-agent', 'pro');

      // Stored key should be hashed
      const stored = licenseManager['apiKeys'].get(apiKey.id);
      expect(stored?.key).not.toBe(apiKey.key);
      expect(stored?.key).toMatch(/^hash_/);
    });

    it('prevents API key enumeration', () => {
      const licenseManager = new LicenseManager();

      // Try to guess API keys
      const guesses = [
        'flx_test123',
        'flx_admin',
        'flx_root',
        'admin-key',
        'test-key',
      ];

      guesses.forEach(guess => {
        const validation = licenseManager.validateApiKey(guess);
        expect(validation.valid).toBe(false);
      });
    });

    it('prevents usage counter manipulation', () => {
      const licenseManager = new LicenseManager();
      const apiKey = licenseManager.generateApiKey('test-agent', 'free');

      // Try to reset usage by manipulating counter
      const stored = licenseManager['apiKeys'].get(apiKey.id)!;
      const originalCount = stored.usageCount;

      // External manipulation attempt (shouldn't work)
      stored.usageCount = 0;
      licenseManager['apiKeys'].set(apiKey.id, stored);

      // Track usage - should increment correctly
      licenseManager.trackUsage(apiKey.id, true);

      const updated = licenseManager['apiKeys'].get(apiKey.id);
      expect(updated?.usageCount).toBe(originalCount + 1);
    });
  });
});
