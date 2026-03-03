/**
 * Analytics Types
 * 
 * Defines analytics data structures for agent tracking
 */

/**
 * Agent action types
 */
export type AgentActionType = 
  | 'parse'
  | 'api-call'
  | 'negotiate'
  | 'subscribe'
  | 'unsubscribe'
  | 'upgrade'
  | 'downgrade';

/**
 * Agent tier levels
 */
export type AgentTier = 'free' | 'pro' | 'enterprise';

/**
 * Agent analytics event
 */
export interface AgentAnalytics {
  /** Unique event ID */
  id: string;
  /** Agent ID (anonymized hash) */
  agentId: string;
  /** Timestamp */
  timestamp: number;
  /** Action type */
  action: AgentActionType;
  /** Component ID */
  componentId?: string;
  /** Request latency (ms) */
  latency: number;
  /** Success status */
  success: boolean;
  /** Error message (if failed) */
  errorMessage?: string;
  /** Licensing fee (if applicable) */
  licensingFee?: number;
  /** Request count (for batch operations) */
  requestCount?: number;
  /** Metadata */
  metadata?: Record<string, any>;
}

/**
 * Aggregated agent statistics
 */
export interface AgentStats {
  /** Agent ID */
  agentId: string;
  /** Agent tier */
  tier: AgentTier;
  /** Total requests */
  totalRequests: number;
  /** Successful requests */
  successfulRequests: number;
  /** Failed requests */
  failedRequests: number;
  /** Success rate (0-1) */
  successRate: number;
  /** Average latency (ms) */
  avgLatency: number;
  /** Total licensing fees (€) */
  totalLicensingFees: number;
  /** First request timestamp */
  firstRequest: number;
  /** Last request timestamp */
  lastRequest: number;
  /** Requests by action type */
  requestsByAction: Record<AgentActionType, number>;
  /** Requests by component */
  requestsByComponent: Record<string, number>;
}

/**
 * Pricing tier configuration
 */
export interface PricingTier {
  /** Tier name */
  name: AgentTier;
  /** Monthly price (€) */
  price: number;
  /** Request limit per month (-1 for unlimited) */
  limit: number;
  /** Features included */
  features: string[];
  /** Overage rate (€ per 1000 requests) */
  overageRate: number;
}

/**
 * Usage tracking data
 */
export interface UsageData {
  /** Agent ID */
  agentId: string;
  /** Billing period start */
  periodStart: number;
  /** Billing period end */
  periodEnd: number;
  /** Total requests in period */
  totalRequests: number;
  /** Included requests (from tier) */
  includedRequests: number;
  /** Overage requests */
  overageRequests: number;
  /** Base fee */
  baseFee: number;
  /** Overage fee */
  overageFee: number;
  /** Total fee */
  totalFee: number;
  /** Tier */
  tier: AgentTier;
}

/**
 * Analytics dashboard data
 */
export interface DashboardData {
  /** Total agents */
  totalAgents: number;
  /** Active agents (last 24h) */
  activeAgents: number;
  /** Total requests (all time) */
  totalRequests: number;
  /** Requests (last 24h) */
  requests24h: number;
  /** Requests (last 30d) */
  requests30d: number;
  /** Total revenue (all time) */
  totalRevenue: number;
  /** Revenue (last 30d) */
  revenue30d: number;
  /** Average latency (ms) */
  avgLatency: number;
  /** Success rate (0-1) */
  successRate: number;
  /** Top agents by requests */
  topAgents: AgentStats[];
  /** Requests by tier */
  requestsByTier: Record<AgentTier, number>;
  /** Revenue by tier */
  revenueByTier: Record<AgentTier, number>;
}

/**
 * Analytics logger interface
 */
export interface AnalyticsLogger {
  /** Log agent interaction */
  log(analytics: AgentAnalytics): void;
  /** Get agent statistics */
  getAgentStats(agentId: string): AgentStats | null;
  /** Get all agent statistics */
  getAllAgentStats(): AgentStats[];
  /** Get dashboard data */
  getDashboardData(): DashboardData;
  /** Get usage data for billing */
  getUsageData(agentId: string, periodStart: number, periodEnd: number): UsageData | null;
  /** Clear analytics data */
  clear(agentId?: string): void;
}

/**
 * Default pricing tiers
 */
export const DEFAULT_PRICING_TIERS: Record<AgentTier, PricingTier> = {
  free: {
    name: 'free',
    price: 0,
    limit: 100, // requests/month
    features: [
      'Basic structured data',
      'HTML output',
      'Community support',
    ],
    overageRate: 0, // No overage, hard limit
  },
  pro: {
    name: 'pro',
    price: 100, // €/month
    limit: 10000, // requests/month
    features: [
      'Full API access',
      'JSON-LD output',
      'Real-time updates',
      'Email support',
      'Analytics dashboard',
    ],
    overageRate: 0.01, // €0.01 per request
  },
  enterprise: {
    name: 'enterprise',
    price: 500, // €/month
    limit: -1, // unlimited
    features: [
      'Unlimited requests',
      'All data formats',
      'Negotiation protocols',
      'Priority support (24/7)',
      'Custom integrations',
      'SLA guarantee',
    ],
    overageRate: 0,
  },
};
