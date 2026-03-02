/**
 * Agent Analytics Logger
 * 
 * Tracks agent interactions for analytics and billing
 */

import type {
  AgentAnalytics,
  AgentStats,
  DashboardData,
  UsageData,
  AnalyticsLogger,
  AgentTier,
  PricingTier,
} from './types';
import { DEFAULT_PRICING_TIERS } from './types';

/**
 * In-memory analytics logger
 * 
 * Note: For production, replace with database-backed implementation
 */
export class AgentAnalyticsLogger implements AnalyticsLogger {
  private events: Map<string, AgentAnalytics[]> = new Map();
  private agentTiers: Map<string, AgentTier> = new Map();
  private pricingTiers: Record<string, PricingTier>;

  constructor(pricingTiers: Record<string, PricingTier> = DEFAULT_PRICING_TIERS) {
    this.pricingTiers = pricingTiers;
  }

  /**
   * Log agent interaction
   */
  log(analytics: AgentAnalytics): void {
    // Get or create events array for agent
    let agentEvents = this.events.get(analytics.agentId);
    if (!agentEvents) {
      agentEvents = [];
      this.events.set(analytics.agentId, agentEvents);
    }

    // Add event
    agentEvents.push(analytics);

    // Update tier if subscription action
    if (analytics.action === 'subscribe' && analytics.metadata?.tier) {
      this.agentTiers.set(analytics.agentId, analytics.metadata.tier);
    } else if (analytics.action === 'unsubscribe') {
      this.agentTiers.set(analytics.agentId, 'free');
    } else if (analytics.action === 'upgrade' && analytics.metadata?.tier) {
      this.agentTiers.set(analytics.agentId, analytics.metadata.tier);
    } else if (analytics.action === 'downgrade' && analytics.metadata?.tier) {
      this.agentTiers.set(analytics.agentId, analytics.metadata.tier);
    }
  }

  /**
   * Get agent statistics
   */
  getAgentStats(agentId: string): AgentStats | null {
    const agentEvents = this.events.get(agentId);
    if (!agentEvents || agentEvents.length === 0) {
      return null;
    }

    const tier = this.agentTiers.get(agentId) || 'free';
    const successfulEvents = agentEvents.filter(e => e.success);
    const failedEvents = agentEvents.filter(e => !e.success);

    // Calculate metrics
    const totalRequests = agentEvents.reduce((sum, e) => sum + (e.requestCount || 1), 0);
    const totalLatency = agentEvents.reduce((sum, e) => sum + e.latency, 0);
    const totalFees = agentEvents.reduce((sum, e) => sum + (e.licensingFee || 0), 0);

    // Requests by action
    const requestsByAction: Record<string, number> = {};
    agentEvents.forEach(e => {
      requestsByAction[e.action] = (requestsByAction[e.action] || 0) + (e.requestCount || 1);
    });

    // Requests by component
    const requestsByComponent: Record<string, number> = {};
    agentEvents.forEach(e => {
      if (e.componentId) {
        requestsByComponent[e.componentId] = (requestsByComponent[e.componentId] || 0) + (e.requestCount || 1);
      }
    });

    return {
      agentId,
      tier,
      totalRequests,
      successfulRequests: successfulEvents.length,
      failedRequests: failedEvents.length,
      successRate: successfulEvents.length / agentEvents.length,
      avgLatency: totalLatency / agentEvents.length,
      totalLicensingFees: totalFees,
      firstRequest: agentEvents[0].timestamp,
      lastRequest: agentEvents[agentEvents.length - 1].timestamp,
      requestsByAction,
      requestsByComponent,
    };
  }

  /**
   * Get all agent statistics
   */
  getAllAgentStats(): AgentStats[] {
    const stats: AgentStats[] = [];
    
    for (const agentId of this.events.keys()) {
      const stat = this.getAgentStats(agentId);
      if (stat) {
        stats.push(stat);
      }
    }

    return stats;
  }

  /**
   * Get dashboard data
   */
  getDashboardData(): DashboardData {
    const allStats = this.getAllAgentStats();
    const now = Date.now();
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    // Active agents (last 24h)
    const activeAgents = allStats.filter(s => s.lastRequest > twentyFourHoursAgo).length;

    // Requests in time periods
    let requests24h = 0;
    let requests30d = 0;
    
    for (const events of this.events.values()) {
      events.forEach(e => {
        const count = e.requestCount || 1;
        if (e.timestamp > twentyFourHoursAgo) {
          requests24h += count;
        }
        if (e.timestamp > thirtyDaysAgo) {
          requests30d += count;
        }
      });
    }

    // Revenue calculations
    let totalRevenue = 0;
    let revenue30d = 0;

    for (const stats of allStats) {
      totalRevenue += stats.totalLicensingFees;
      
      // Calculate 30d revenue (simplified - assumes all fees in last 30d)
      if (stats.lastRequest > thirtyDaysAgo) {
        revenue30d += stats.totalLicensingFees;
      }
    }

    // Average latency
    const totalLatency = allStats.reduce((sum, s) => sum + s.avgLatency * s.totalRequests, 0);
    const totalRequests = allStats.reduce((sum, s) => sum + s.totalRequests, 0);
    const avgLatency = totalRequests > 0 ? totalLatency / totalRequests : 0;

    // Overall success rate
    const totalSuccessful = allStats.reduce((sum, s) => sum + s.successfulRequests, 0);
    const successRate = totalRequests > 0 ? totalSuccessful / totalRequests : 0;

    // Top agents by requests
    const topAgents = allStats
      .sort((a, b) => b.totalRequests - a.totalRequests)
      .slice(0, 10);

    // Requests by tier
    const requestsByTier: Record<AgentTier, number> = {
      free: 0,
      pro: 0,
      enterprise: 0,
    };

    allStats.forEach(s => {
      requestsByTier[s.tier] += s.totalRequests;
    });

    // Revenue by tier
    const revenueByTier: Record<AgentTier, number> = {
      free: 0,
      pro: 0,
      enterprise: 0,
    };

    allStats.forEach(s => {
      revenueByTier[s.tier] += s.totalLicensingFees;
    });

    return {
      totalAgents: this.events.size,
      activeAgents,
      totalRequests,
      requests24h,
      requests30d,
      totalRevenue,
      revenue30d,
      avgLatency,
      successRate,
      topAgents,
      requestsByTier,
      revenueByTier,
    };
  }

  /**
   * Get usage data for billing
   */
  getUsageData(agentId: string, periodStart: number, periodEnd: number): UsageData | null {
    const agentEvents = this.events.get(agentId);
    if (!agentEvents) {
      return null;
    }

    const tier = this.agentTiers.get(agentId) || 'free';
    const pricingTier = this.pricingTiers[tier];

    // Filter events in period
    const periodEvents = agentEvents.filter(
      e => e.timestamp >= periodStart && e.timestamp <= periodEnd
    );

    const totalRequests = periodEvents.reduce((sum, e) => sum + (e.requestCount || 1), 0);
    const includedRequests = pricingTier.limit === -1 ? totalRequests : Math.min(totalRequests, pricingTier.limit);
    const overageRequests = pricingTier.limit === -1 ? 0 : Math.max(0, totalRequests - pricingTier.limit);
    const overageFee = overageRequests * pricingTier.overageRate / 1000; // Rate is per 1000 requests

    return {
      agentId,
      periodStart,
      periodEnd,
      totalRequests,
      includedRequests,
      overageRequests,
      baseFee: pricingTier.price,
      overageFee,
      totalFee: pricingTier.price + overageFee,
      tier,
    };
  }

  /**
   * Clear analytics data
   */
  clear(agentId?: string): void {
    if (agentId) {
      this.events.delete(agentId);
      this.agentTiers.delete(agentId);
    } else {
      this.events.clear();
      this.agentTiers.clear();
    }
  }

  /**
   * Set agent tier (for testing)
   */
  setAgentTier(agentId: string, tier: AgentTier): void {
    this.agentTiers.set(agentId, tier);
  }

  /**
   * Get agent tier
   */
  getAgentTier(agentId: string): AgentTier {
    return this.agentTiers.get(agentId) || 'free';
  }
}

/**
 * Create analytics logger instance
 */
export function createAnalyticsLogger(): AnalyticsLogger {
  return new AgentAnalyticsLogger();
}

/**
 * Generate unique event ID
 */
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate anonymized agent ID
 */
export function generateAgentId(): string {
  return `agt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
