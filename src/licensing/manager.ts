/**
 * Licensing Manager
 * 
 * Manages API keys, licenses, and usage enforcement
 */

import type {
  ApiKey,
  License,
  LicenseTier,
  LicenseStatus,
  LicenseValidationResult,
  EnforcementResult,
  UsageTracking,
  PricingPlan,
} from './types';
import { DEFAULT_PRICING_PLANS } from './types';

/**
 * License Manager Class
 */
export class LicenseManager {
  private apiKeys: Map<string, ApiKey> = new Map();
  private licenses: Map<string, License> = new Map();
  private usageTracking: Map<string, UsageTracking> = new Map();
  private pricingPlans: Record<string, PricingPlan>;

  constructor(pricingPlans: Record<string, PricingPlan> = DEFAULT_PRICING_PLANS) {
    this.pricingPlans = pricingPlans;
  }

  /**
   * Generate API key
   */
  generateApiKey(agentId: string, tier: LicenseTier = 'free'): ApiKey {
    const id = this.generateId('key');
    const key = `flx_${this.generateRandomString(32)}`;
    const now = Date.now();

    const apiKey: ApiKey = {
      id,
      key: this.hashKey(key),
      agentId,
      tier,
      status: 'active',
      createdAt: now,
      usageCount: 0,
      usageLimit: this.pricingPlans[tier].limits.requestsPerMonth,
    };

    this.apiKeys.set(id, apiKey);
    return { ...apiKey, key }; // Return unhashed key once
  }

  /**
   * Validate API key
   */
  validateApiKey(key: string): LicenseValidationResult {
    const hashedKey = this.hashKey(key);
    const apiKey = Array.from(this.apiKeys.values()).find(k => k.key === hashedKey);

    if (!apiKey) {
      return {
        valid: false,
        tier: 'free',
        status: 'cancelled',
        error: 'Invalid API key',
      };
    }

    // Check status
    if (apiKey.status !== 'active') {
      return {
        valid: false,
        tier: apiKey.tier,
        status: apiKey.status,
        error: `License is ${apiKey.status}`,
      };
    }

    // Check expiration
    if (apiKey.expiresAt && Date.now() > apiKey.expiresAt) {
      return {
        valid: false,
        tier: apiKey.tier,
        status: 'expired',
        error: 'License has expired',
      };
    }

    // Check usage limit
    if (apiKey.usageLimit !== -1 && apiKey.usageCount >= apiKey.usageLimit) {
      return {
        valid: false,
        tier: apiKey.tier,
        status: 'suspended',
        error: 'Usage limit exceeded',
        rateLimitRemaining: 0,
        rateLimitReset: this.getNextPeriodReset(),
      };
    }

    // Calculate rate limit remaining
    const rateLimitRemaining = apiKey.usageLimit === -1 
      ? -1 
      : apiKey.usageLimit - apiKey.usageCount;

    return {
      valid: true,
      tier: apiKey.tier,
      status: apiKey.status,
      rateLimitRemaining,
      rateLimitReset: this.getNextPeriodReset(),
    };
  }

  /**
   * Create license
   */
  createLicense(
    agentId: string,
    tier: LicenseTier,
    durationMonths: number = 12
  ): License {
    const id = this.generateId('license');
    const now = Date.now();
    const plan = this.pricingPlans[tier];

    const license: License = {
      id,
      agentId,
      tier,
      status: 'active',
      startDate: now,
      endDate: now + (durationMonths * 30 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      pricing: {
        monthly: plan.monthlyPrice,
        annual: plan.annualPrice,
      },
      features: plan.features,
      limits: plan.limits,
    };

    this.licenses.set(id, license);
    return license;
  }

  /**
   * Get license by agent ID
   */
  getLicense(agentId: string): License | null {
    const license = Array.from(this.licenses.values()).find(l => l.agentId === agentId);
    return license || null;
  }

  /**
   * Update license status
   */
  updateLicenseStatus(licenseId: string, status: LicenseStatus): void {
    const license = this.licenses.get(licenseId);
    if (!license) {
      throw new Error(`License not found: ${licenseId}`);
    }

    license.status = status;
    this.licenses.set(licenseId, license);
  }

  /**
   * Track usage
   */
  trackUsage(
    apiKeyId: string,
    success: boolean,
    throttled: boolean = false
  ): UsageTracking {
    const apiKey = this.apiKeys.get(apiKeyId);
    if (!apiKey) {
      throw new Error(`API key not found: ${apiKeyId}`);
    }

    // Update API key usage
    apiKey.usageCount++;
    apiKey.lastUsedAt = Date.now();
    this.apiKeys.set(apiKeyId, apiKey);

    // Get or create usage tracking
    const periodStart = this.getCurrentPeriodStart();
    const periodEnd = this.getCurrentPeriodEnd();
    const trackingKey = `${apiKeyId}:${periodStart}`;

    let tracking = this.usageTracking.get(trackingKey);
    if (!tracking) {
      tracking = {
        agentId: apiKey.agentId,
        apiKeyId,
        periodStart,
        periodEnd,
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        throttledRequests: 0,
        overageRequests: 0,
        overageFee: 0,
      };
    }

    tracking.totalRequests++;
    if (success) {
      tracking.successfulRequests++;
    } else {
      tracking.failedRequests++;
    }
    if (throttled) {
      tracking.throttledRequests++;
    }

    // Calculate overage
    const plan = this.pricingPlans[apiKey.tier];
    if (plan.limits.requestsPerMonth !== -1 && tracking.totalRequests > plan.limits.requestsPerMonth) {
      tracking.overageRequests = tracking.totalRequests - plan.limits.requestsPerMonth;
      // Overage fee: 0.01€ per 1000 requests
      tracking.overageFee = (tracking.overageRequests / 1000) * 0.01;
    }

    this.usageTracking.set(trackingKey, tracking);
    return tracking;
  }

  /**
   * Enforce license limits
   */
  enforceLicense(apiKeyId: string): EnforcementResult {
    const apiKey = this.apiKeys.get(apiKeyId);
    if (!apiKey) {
      return {
        action: 'block',
        reason: 'Invalid API key',
      };
    }

    const plan = this.pricingPlans[apiKey.tier];

    // Check concurrent requests (simplified - would need real-time tracking)
    // Check rate limit (requests per second)
    if (apiKey.lastUsedAt) {
      const timeSinceLastRequest = Date.now() - apiKey.lastUsedAt;
      const maxRequestsPerSecond = plan.limits.requestsPerSecond;
      const minTimeBetweenRequests = 1000 / maxRequestsPerSecond;

      if (timeSinceLastRequest < minTimeBetweenRequests) {
        return {
          action: 'throttle',
          reason: 'Rate limit exceeded',
          retryAfter: Math.ceil((minTimeBetweenRequests - timeSinceLastRequest) / 1000),
        };
      }
    }

    // Check usage limit
    if (apiKey.usageLimit !== -1 && apiKey.usageCount >= apiKey.usageLimit) {
      return {
        action: 'block',
        reason: 'Usage limit exceeded',
        retryAfter: this.getSecondsUntilNextPeriod(),
      };
    }

    // Check license status
    const license = this.getLicense(apiKey.agentId);
    if (license && license.status !== 'active') {
      return {
        action: 'block',
        reason: `License is ${license.status}`,
      };
    }

    // Warn if approaching limit
    if (apiKey.usageLimit !== -1 && apiKey.usageCount >= apiKey.usageLimit * 0.9) {
      return {
        action: 'warn',
        reason: 'Approaching usage limit',
        info: {
          usageCount: apiKey.usageCount,
          usageLimit: apiKey.usageLimit,
          percentUsed: Math.round((apiKey.usageCount / apiKey.usageLimit) * 100),
        },
      };
    }

    return {
      action: 'allow',
      reason: 'Request allowed',
    };
  }

  /**
   * Get usage data for billing
   */
  getUsageData(apiKeyId: string, periodStart: number, periodEnd: number): UsageTracking | null {
    const trackingKey = `${apiKeyId}:${periodStart}`;
    return this.usageTracking.get(trackingKey) || null;
  }

  /**
   * Get all pricing plans
   */
  getPricingPlans(): PricingPlan[] {
    return Object.values(this.pricingPlans);
  }

  /**
   * Get pricing plan by tier
   */
  getPricingPlan(tier: LicenseTier): PricingPlan {
    return this.pricingPlans[tier];
  }

  /**
   * Revoke API key
   */
  revokeApiKey(apiKeyId: string): void {
    const apiKey = this.apiKeys.get(apiKeyId);
    if (!apiKey) {
      throw new Error(`API key not found: ${apiKeyId}`);
    }

    apiKey.status = 'cancelled';
    this.apiKeys.set(apiKeyId, apiKey);
  }

  /**
   * Upgrade API key tier
   */
  upgradeApiKey(apiKeyId: string, newTier: LicenseTier): void {
    const apiKey = this.apiKeys.get(apiKeyId);
    if (!apiKey) {
      throw new Error(`API key not found: ${apiKeyId}`);
    }

    apiKey.tier = newTier;
    apiKey.usageLimit = this.pricingPlans[newTier].limits.requestsPerMonth;
    this.apiKeys.set(apiKeyId, apiKey);
  }

  /**
   * Reset usage counter
   */
  resetUsage(apiKeyId: string): void {
    const apiKey = this.apiKeys.get(apiKeyId);
    if (!apiKey) {
      throw new Error(`API key not found: ${apiKeyId}`);
    }

    apiKey.usageCount = 0;
    this.apiKeys.set(apiKeyId, apiKey);
  }

  // Helper methods

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private hashKey(key: string): string {
    // Simple hash for demo - use crypto in production
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `hash_${Math.abs(hash)}`;
  }

  private getCurrentPeriodStart(): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  }

  private getCurrentPeriodEnd(): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime();
  }

  private getNextPeriodReset(): number {
    return this.getCurrentPeriodEnd();
  }

  private getSecondsUntilNextPeriod(): number {
    return Math.ceil((this.getNextPeriodReset() - Date.now()) / 1000);
  }
}

/**
 * Create license manager instance
 */
export function createLicenseManager(): LicenseManager {
  return new LicenseManager();
}

/**
 * Middleware for license enforcement
 */
export function licenseEnforcementMiddleware(
  manager: LicenseManager,
  apiKey: string
): EnforcementResult {
  // Validate API key
  const validation = manager.validateApiKey(apiKey);
  if (!validation.valid) {
    return {
      action: 'block',
      reason: validation.error || 'Invalid license',
    };
  }

  // Find API key ID (in production, this would be in the request)
  const apiKeyId = Array.from(manager['apiKeys'].keys()).find(
    id => manager['apiKeys'].get(id)?.key === manager['hashKey'](apiKey)
  );

  if (!apiKeyId) {
    return {
      action: 'block',
      reason: 'API key not found',
    };
  }

  // Enforce license
  return manager.enforceLicense(apiKeyId);
}
