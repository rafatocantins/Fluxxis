/**
 * Licensing Types
 * 
 * Defines licensing structures for agent access control
 */

/**
 * License tier levels
 */
export type LicenseTier = 'free' | 'pro' | 'enterprise' | 'custom';

/**
 * License status
 */
export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'cancelled';

/**
 * API key definition
 */
export interface ApiKey {
  /** Unique key ID */
  id: string;
  /** The actual API key (hashed) */
  key: string;
  /** Agent ID */
  agentId: string;
  /** License tier */
  tier: LicenseTier;
  /** Status */
  status: LicenseStatus;
  /** Created timestamp */
  createdAt: number;
  /** Expires timestamp */
  expiresAt?: number;
  /** Last used timestamp */
  lastUsedAt?: number;
  /** Usage count (current period) */
  usageCount: number;
  /** Usage limit (-1 for unlimited) */
  usageLimit: number;
  /** Metadata */
  metadata?: Record<string, any>;
}

/**
 * License definition
 */
export interface License {
  /** License ID */
  id: string;
  /** Agent ID */
  agentId: string;
  /** License tier */
  tier: LicenseTier;
  /** Status */
  status: LicenseStatus;
  /** Start date */
  startDate: number;
  /** End date */
  endDate?: number;
  /** Auto-renew */
  autoRenew: boolean;
  /** Pricing */
  pricing: {
    /** Monthly price (€) */
    monthly: number;
    /** Annual price (€) */
    annual: number;
    /** Custom price (€) */
    custom?: number;
  };
  /** Features included */
  features: string[];
  /** Limits */
  limits: {
    /** Requests per month (-1 for unlimited) */
    requestsPerMonth: number;
    /** Requests per second */
    requestsPerSecond: number;
    /** Concurrent requests */
    concurrentRequests: number;
    /** Data retention (days) */
    dataRetention: number;
  };
  /** Metadata */
  metadata?: Record<string, any>;
}

/**
 * Usage tracking data
 */
export interface UsageTracking {
  /** Agent ID */
  agentId: string;
  /** API key ID */
  apiKeyId: string;
  /** Period start */
  periodStart: number;
  /** Period end */
  periodEnd: number;
  /** Total requests */
  totalRequests: number;
  /** Successful requests */
  successfulRequests: number;
  /** Failed requests */
  failedRequests: number;
  /** Throttled requests */
  throttledRequests: number;
  /** Overage requests */
  overageRequests: number;
  /** Overage fee (€) */
  overageFee: number;
}

/**
 * License validation result
 */
export interface LicenseValidationResult {
  /** Valid license */
  valid: boolean;
  /** License tier */
  tier: LicenseTier;
  /** Status */
  status: LicenseStatus;
  /** Error message (if invalid) */
  error?: string;
  /** Rate limit remaining */
  rateLimitRemaining?: number;
  /** Rate limit reset timestamp */
  rateLimitReset?: number;
}

/**
 * Billing invoice
 */
export interface Invoice {
  /** Invoice ID */
  id: string;
  /** License ID */
  licenseId: string;
  /** Agent ID */
  agentId: string;
  /** Period start */
  periodStart: number;
  /** Period end */
  periodEnd: number;
  /** Amount (€) */
  amount: number;
  /** Overage fee (€) */
  overageFee: number;
  /** Total (€) */
  total: number;
  /** Status */
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  /** Created timestamp */
  createdAt: number;
  /** Paid timestamp */
  paidAt?: number;
  /** Items */
  items: InvoiceItem[];
}

/**
 * Invoice line item
 */
export interface InvoiceItem {
  /** Description */
  description: string;
  /** Quantity */
  quantity: number;
  /** Unit price (€) */
  unitPrice: number;
  /** Total (€) */
  total: number;
}

/**
 * Pricing plan
 */
export interface PricingPlan {
  /** Plan ID */
  id: LicenseTier;
  /** Name */
  name: string;
  /** Description */
  description: string;
  /** Monthly price (€) */
  monthlyPrice: number;
  /** Annual price (€) */
  annualPrice: number;
  /** Features */
  features: string[];
  /** Limits */
  limits: {
    requestsPerMonth: number;
    requestsPerSecond: number;
    concurrentRequests: number;
    dataRetention: number;
    support: 'community' | 'email' | 'priority' | 'dedicated';
  };
  /** Popular flag */
  popular?: boolean;
}

/**
 * License enforcement action
 */
export type EnforcementAction = 'allow' | 'throttle' | 'block' | 'warn';

/**
 * License enforcement result
 */
export interface EnforcementResult {
  /** Action to take */
  action: EnforcementAction;
  /** Reason */
  reason: string;
  /** Retry after (seconds) */
  retryAfter?: number;
  /** Additional info */
  info?: Record<string, any>;
}

/**
 * Default pricing plans
 */
export const DEFAULT_PRICING_PLANS: Record<LicenseTier, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'For individuals and small projects',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      '100 requests/month',
      'Basic structured data',
      'HTML output',
      'Community support',
      'Public documentation',
    ],
    limits: {
      requestsPerMonth: 100,
      requestsPerSecond: 1,
      concurrentRequests: 1,
      dataRetention: 7,
      support: 'community',
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For growing businesses',
    monthlyPrice: 100,
    annualPrice: 1000, // 2 months free
    features: [
      '10,000 requests/month',
      'Full API access',
      'JSON-LD output',
      'Real-time updates',
      'Email support',
      'Analytics dashboard',
      '99.9% SLA',
    ],
    limits: {
      requestsPerMonth: 10000,
      requestsPerSecond: 10,
      concurrentRequests: 5,
      dataRetention: 90,
      support: 'email',
    },
    popular: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    monthlyPrice: 500,
    annualPrice: 5000,
    features: [
      'Unlimited requests',
      'All data formats',
      'Negotiation protocols',
      'Priority support (24/7)',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated account manager',
      'On-premise deployment',
    ],
    limits: {
      requestsPerMonth: -1, // Unlimited
      requestsPerSecond: 100,
      concurrentRequests: 50,
      dataRetention: 365,
      support: 'priority',
    },
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'Tailored to your needs',
    monthlyPrice: 0, // Contact sales
    annualPrice: 0,
    features: [
      'Custom request limits',
      'Custom features',
      'White-label options',
      'Dedicated support',
      'Custom SLA',
      'Professional services',
    ],
    limits: {
      requestsPerMonth: -1,
      requestsPerSecond: -1,
      concurrentRequests: -1,
      dataRetention: -1,
      support: 'dedicated',
    },
  },
};
