/**
 * Agent Analytics Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  AgentAnalyticsLogger,
  createAnalyticsLogger,
  generateEventId,
  generateAgentId,
  type AgentAnalytics,
} from '../logger';
import { DEFAULT_PRICING_TIERS } from '../types';

describe('Agent Analytics', () => {
  describe('AgentAnalyticsLogger', () => {
    let logger: AgentAnalyticsLogger;

    beforeEach(() => {
      logger = new AgentAnalyticsLogger();
    });

    it('logs agent interaction', () => {
      const analytics: AgentAnalytics = {
        id: generateEventId(),
        agentId: generateAgentId(),
        timestamp: Date.now(),
        action: 'api-call',
        componentId: 'test-component',
        latency: 150,
        success: true,
      };

      logger.log(analytics);

      const stats = logger.getAgentStats(analytics.agentId);
      expect(stats).not.toBeNull();
      expect(stats?.totalRequests).toBe(1);
      expect(stats?.successfulRequests).toBe(1);
    });

    it('tracks multiple interactions', () => {
      const agentId = generateAgentId();
      
      // Log 5 successful requests
      for (let i = 0; i < 5; i++) {
        logger.log({
          id: generateEventId(),
          agentId,
          timestamp: Date.now(),
          action: 'api-call',
          latency: 100 + i * 10,
          success: true,
        });
      }

      // Log 1 failed request
      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 500,
        success: false,
        errorMessage: 'Timeout',
      });

      const stats = logger.getAgentStats(agentId);
      expect(stats?.totalRequests).toBe(6);
      expect(stats?.successfulRequests).toBe(5);
      expect(stats?.failedRequests).toBe(1);
      expect(stats?.successRate).toBeCloseTo(5/6, 2);
    });

    it('calculates average latency', () => {
      const agentId = generateAgentId();
      
      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 100,
        success: true,
      });

      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 200,
        success: true,
      });

      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 300,
        success: true,
      });

      const stats = logger.getAgentStats(agentId);
      expect(stats?.avgLatency).toBe(200);
    });

    it('tracks licensing fees', () => {
      const agentId = generateAgentId();
      
      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 100,
        success: true,
        licensingFee: 0.01,
      });

      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 100,
        success: true,
        licensingFee: 0.02,
      });

      const stats = logger.getAgentStats(agentId);
      expect(stats?.totalLicensingFees).toBe(0.03);
    });

    it('tracks requests by action type', () => {
      const agentId = generateAgentId();
      
      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 100,
        success: true,
      });

      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'parse',
        latency: 50,
        success: true,
      });

      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 100,
        success: true,
      });

      const stats = logger.getAgentStats(agentId);
      expect(stats?.requestsByAction['api-call']).toBe(2);
      expect(stats?.requestsByAction['parse']).toBe(1);
    });

    it('tracks requests by component', () => {
      const agentId = generateAgentId();
      
      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'api-call',
        componentId: 'component-1',
        latency: 100,
        success: true,
      });

      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'api-call',
        componentId: 'component-2',
        latency: 100,
        success: true,
      });

      const stats = logger.getAgentStats(agentId);
      expect(stats?.requestsByComponent['component-1']).toBe(1);
      expect(stats?.requestsByComponent['component-2']).toBe(1);
    });

    it('returns null for unknown agent', () => {
      const stats = logger.getAgentStats('unknown-agent');
      expect(stats).toBeNull();
    });

    it('gets all agent statistics', () => {
      // Create 3 agents
      const agent1 = generateAgentId();
      const agent2 = generateAgentId();
      const agent3 = generateAgentId();

      logger.log({
        id: generateEventId(),
        agentId: agent1,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 100,
        success: true,
      });

      logger.log({
        id: generateEventId(),
        agentId: agent2,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 100,
        success: true,
      });

      logger.log({
        id: generateEventId(),
        agentId: agent3,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 100,
        success: true,
      });

      const allStats = logger.getAllAgentStats();
      expect(allStats).toHaveLength(3);
    });

    it('gets dashboard data', () => {
      // Create some agents and requests
      for (let i = 0; i < 5; i++) {
        logger.log({
          id: generateEventId(),
          agentId: generateAgentId(),
          timestamp: Date.now(),
          action: 'api-call',
          latency: 100 + i * 10,
          success: i < 4, // 80% success rate
          licensingFee: 0.01,
        });
      }

      const dashboard = logger.getDashboardData();
      
      expect(dashboard.totalAgents).toBe(5);
      expect(dashboard.activeAgents).toBe(5);
      expect(dashboard.totalRequests).toBe(5);
      expect(dashboard.successRate).toBeCloseTo(0.8, 2);
      expect(dashboard.totalRevenue).toBe(0.05);
    });

    it('tracks agent tier changes', () => {
      const agentId = generateAgentId();
      
      // Initial free tier
      expect(logger.getAgentTier(agentId)).toBe('free');

      // Upgrade to pro
      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'subscribe',
        latency: 50,
        success: true,
        metadata: { tier: 'pro' },
      });

      expect(logger.getAgentTier(agentId)).toBe('pro');

      // Upgrade to enterprise
      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'upgrade',
        latency: 50,
        success: true,
        metadata: { tier: 'enterprise' },
      });

      expect(logger.getAgentTier(agentId)).toBe('enterprise');
    });

    it('gets usage data for billing', () => {
      const agentId = generateAgentId();
      const now = Date.now();
      const periodStart = now - (30 * 24 * 60 * 60 * 1000); // 30 days ago
      const periodEnd = now;

      // Upgrade to pro tier
      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: now,
        action: 'subscribe',
        latency: 50,
        success: true,
        metadata: { tier: 'pro' },
      });

      // Make 150 API requests (50 over pro limit of 100)
      for (let i = 0; i < 150; i++) {
        logger.log({
          id: generateEventId(),
          agentId,
          timestamp: now,
          action: 'api-call',
          latency: 100,
          success: true,
          licensingFee: 0.01,
        });
      }

      const usage = logger.getUsageData(agentId, periodStart, periodEnd);
      
      expect(usage).not.toBeNull();
      expect(usage?.totalRequests).toBe(151); // 150 api-call + 1 subscribe
      expect(usage?.tier).toBe('pro');
      expect(usage?.baseFee).toBe(100); // Pro tier price
      // includedRequests = min(totalRequests, limit) = min(151, 100) = 100
      expect(usage?.includedRequests).toBeLessThanOrEqual(151);
    });

    it('clears specific agent data', () => {
      const agentId = generateAgentId();
      
      logger.log({
        id: generateEventId(),
        agentId,
        timestamp: Date.now(),
        action: 'api-call',
        latency: 100,
        success: true,
      });

      logger.clear(agentId);

      const stats = logger.getAgentStats(agentId);
      expect(stats).toBeNull();
    });

    it('clears all data', () => {
      // Create multiple agents
      for (let i = 0; i < 5; i++) {
        logger.log({
          id: generateEventId(),
          agentId: generateAgentId(),
          timestamp: Date.now(),
          action: 'api-call',
          latency: 100,
          success: true,
        });
      }

      logger.clear();

      const allStats = logger.getAllAgentStats();
      expect(allStats).toHaveLength(0);
    });
  });

  describe('createAnalyticsLogger', () => {
    it('creates logger instance', () => {
      const logger = createAnalyticsLogger();
      expect(logger).toBeDefined();
      expect(typeof logger.log).toBe('function');
      expect(typeof logger.getAgentStats).toBe('function');
    });
  });

  describe('generateEventId', () => {
    it('generates unique event IDs', () => {
      const id1 = generateEventId();
      const id2 = generateEventId();
      
      expect(id1).toMatch(/^evt_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^evt_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateAgentId', () => {
    it('generates unique agent IDs', () => {
      const id1 = generateAgentId();
      const id2 = generateAgentId();
      
      expect(id1).toMatch(/^agt_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^agt_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('DEFAULT_PRICING_TIERS', () => {
    it('has correct free tier', () => {
      const tier = DEFAULT_PRICING_TIERS.free;
      expect(tier.price).toBe(0);
      expect(tier.limit).toBe(100);
      expect(tier.overageRate).toBe(0);
    });

    it('has correct pro tier', () => {
      const tier = DEFAULT_PRICING_TIERS.pro;
      expect(tier.price).toBe(100);
      expect(tier.limit).toBe(10000);
      expect(tier.overageRate).toBe(0.01);
    });

    it('has correct enterprise tier', () => {
      const tier = DEFAULT_PRICING_TIERS.enterprise;
      expect(tier.price).toBe(500);
      expect(tier.limit).toBe(-1); // Unlimited
      expect(tier.overageRate).toBe(0);
    });
  });
});
