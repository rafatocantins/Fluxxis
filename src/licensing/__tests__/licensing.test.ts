/**
 * Licensing Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  LicenseManager,
  createLicenseManager,
  licenseEnforcementMiddleware,
  type LicenseTier,
} from '../manager';
import { DEFAULT_PRICING_PLANS } from '../types';

describe('Licensing', () => {
  describe('LicenseManager', () => {
    let manager: LicenseManager;

    beforeEach(() => {
      manager = new LicenseManager();
    });

    describe('generateApiKey', () => {
      it('generates API key for free tier', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');

        expect(apiKey.id).toMatch(/^key_\d+_[a-z0-9]+$/);
        expect(apiKey.key).toMatch(/^flx_[A-Za-z0-9]+$/);
        expect(apiKey.agentId).toBe('agent-123');
        expect(apiKey.tier).toBe('free');
        expect(apiKey.status).toBe('active');
        expect(apiKey.usageCount).toBe(0);
        expect(apiKey.usageLimit).toBe(100); // Free tier limit
      });

      it('generates API key for pro tier', () => {
        const apiKey = manager.generateApiKey('agent-456', 'pro');

        expect(apiKey.tier).toBe('pro');
        expect(apiKey.usageLimit).toBe(10000); // Pro tier limit
      });

      it('generates API key for enterprise tier', () => {
        const apiKey = manager.generateApiKey('agent-789', 'enterprise');

        expect(apiKey.tier).toBe('enterprise');
        expect(apiKey.usageLimit).toBe(-1); // Unlimited
      });

      it('stores hashed key', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');

        // Internal storage should have hashed key
        const stored = manager['apiKeys'].get(apiKey.id);
        expect(stored?.key).not.toBe(apiKey.key); // Hashed, not plain
      });
    });

    describe('validateApiKey', () => {
      it('validates valid API key', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');

        const result = manager.validateApiKey(apiKey.key);

        expect(result.valid).toBe(true);
        expect(result.tier).toBe('free');
        expect(result.status).toBe('active');
        expect(result.rateLimitRemaining).toBe(100);
      });

      it('rejects invalid API key', () => {
        const result = manager.validateApiKey('invalid-key');

        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid API key');
      });

      it('rejects cancelled API key', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');
        manager.revokeApiKey(apiKey.id);

        const result = manager.validateApiKey(apiKey.key);

        expect(result.valid).toBe(false);
        expect(result.status).toBe('cancelled');
      });

      it('rejects expired API key', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');
        
        // Manually set expiration in the past
        const stored = manager['apiKeys'].get(apiKey.id)!;
        stored.expiresAt = Date.now() - 1000; // 1 second ago
        manager['apiKeys'].set(apiKey.id, stored);

        const result = manager.validateApiKey(apiKey.key);

        expect(result.valid).toBe(false);
        expect(result.status).toBe('expired');
      });

      it('rejects API key with exceeded usage limit', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');
        
        // Manually set usage to limit
        const stored = manager['apiKeys'].get(apiKey.id)!;
        stored.usageCount = 100; // Free tier limit
        manager['apiKeys'].set(apiKey.id, stored);

        const result = manager.validateApiKey(apiKey.key);

        expect(result.valid).toBe(false);
        expect(result.error).toContain('Usage limit exceeded');
      });
    });

    describe('createLicense', () => {
      it('creates license with default duration', () => {
        const license = manager.createLicense('agent-123', 'pro');

        expect(license.id).toMatch(/^license_\d+_[a-z0-9]+$/);
        expect(license.agentId).toBe('agent-123');
        expect(license.tier).toBe('pro');
        expect(license.status).toBe('active');
        expect(license.autoRenew).toBe(true);
        expect(license.pricing.monthly).toBe(100);
        expect(license.pricing.annual).toBe(1000);
        expect(license.features).toHaveLength(7); // Pro features
      });

      it('creates license with custom duration', () => {
        const license = manager.createLicense('agent-123', 'pro', 6);

        const duration = license.endDate! - license.startDate;
        const expectedDuration = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in ms
        
        expect(duration).toBeCloseTo(expectedDuration, -5); // Within 100ms
      });

      it('stores license', () => {
        const license = manager.createLicense('agent-123', 'pro');

        const stored = manager.getLicense('agent-123');
        expect(stored).not.toBeNull();
        expect(stored?.id).toBe(license.id);
      });
    });

    describe('updateLicenseStatus', () => {
      it('updates license status', () => {
        const license = manager.createLicense('agent-123', 'pro');

        manager.updateLicenseStatus(license.id, 'suspended');

        const stored = manager.getLicense('agent-123');
        expect(stored?.status).toBe('suspended');
      });

      it('throws error for non-existent license', () => {
        expect(() => {
          manager.updateLicenseStatus('non-existent', 'suspended');
        }).toThrow('License not found');
      });
    });

    describe('trackUsage', () => {
      it('tracks successful usage', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');

        const usage = manager.trackUsage(apiKey.id, true);

        expect(usage.totalRequests).toBe(1);
        expect(usage.successfulRequests).toBe(1);
        expect(usage.failedRequests).toBe(0);
        expect(usage.throttledRequests).toBe(0);
      });

      it('tracks failed usage', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');

        const usage = manager.trackUsage(apiKey.id, false);

        expect(usage.totalRequests).toBe(1);
        expect(usage.failedRequests).toBe(1);
      });

      it('tracks throttled usage', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');

        const usage = manager.trackUsage(apiKey.id, false, true);

        expect(usage.throttledRequests).toBe(1);
      });

      it('updates API key usage count', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');

        manager.trackUsage(apiKey.id, true);
        manager.trackUsage(apiKey.id, true);
        manager.trackUsage(apiKey.id, true);

        const stored = manager['apiKeys'].get(apiKey.id);
        expect(stored?.usageCount).toBe(3);
        expect(stored?.lastUsedAt).toBeDefined();
      });

      it('calculates overage fee', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');
        
        // Exceed free tier limit (100 requests)
        for (let i = 0; i < 150; i++) {
          manager.trackUsage(apiKey.id, true);
        }

        const periodStart = manager['getCurrentPeriodStart']();
        const periodEnd = manager['getCurrentPeriodEnd']();
        const usage = manager.getUsageData(apiKey.id, periodStart, periodEnd);

        expect(usage?.overageRequests).toBe(50);
        expect(usage?.overageFee).toBeGreaterThan(0);
      });
    });

    describe('enforceLicense', () => {
      it('allows valid request', () => {
        const apiKey = manager.generateApiKey('agent-123', 'pro');

        const result = manager.enforceLicense(apiKey.id);

        expect(result.action).toBe('allow');
        expect(result.reason).toBe('Request allowed');
      });

      it('blocks invalid API key', () => {
        const result = manager.enforceLicense('non-existent');

        expect(result.action).toBe('block');
        expect(result.reason).toBe('Invalid API key');
      });

      it('throttles rate limit exceeded', (done) => {
        const apiKey = manager.generateApiKey('agent-123', 'free');
        
        // Make first request
        manager.trackUsage(apiKey.id, true);
        
        // Immediately make second request (should be throttled for free tier)
        setTimeout(() => {
          const result = manager.enforceLicense(apiKey.id);
          
          // Free tier allows 1 request/second
          expect(result.action).toBe('allow');
          done();
        }, 1100);
      });

      it('blocks usage limit exceeded', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');
        
        // Exceed usage limit
        const stored = manager['apiKeys'].get(apiKey.id)!;
        stored.usageCount = 101; // Over free tier limit
        manager['apiKeys'].set(apiKey.id, stored);

        const result = manager.enforceLicense(apiKey.id);

        expect(result.action).toBe('block');
        expect(result.reason).toBe('Usage limit exceeded');
        expect(result.retryAfter).toBeGreaterThan(0);
      });

      it('warns when approaching limit', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');
        
        // Set usage to 90% of limit
        const stored = manager['apiKeys'].get(apiKey.id)!;
        stored.usageCount = 90; // 90% of 100
        manager['apiKeys'].set(apiKey.id, stored);

        const result = manager.enforceLicense(apiKey.id);

        expect(result.action).toBe('warn');
        expect(result.reason).toBe('Approaching usage limit');
        expect(result.info?.percentUsed).toBe(90);
      });

      it('blocks suspended license', () => {
        const apiKey = manager.generateApiKey('agent-123', 'pro');
        manager.createLicense('agent-123', 'pro'); // Create license first
        
        const license = manager.getLicense('agent-123');
        expect(license).not.toBeNull();
        
        manager.updateLicenseStatus(license!.id, 'suspended');

        const result = manager.enforceLicense(apiKey.id);

        expect(result.action).toBe('block');
        expect(result.reason).toBe('License is suspended');
      });
    });

    describe('getPricingPlans', () => {
      it('returns all pricing plans', () => {
        const plans = manager.getPricingPlans();

        expect(plans).toHaveLength(4); // free, pro, enterprise, custom
        expect(plans.map(p => p.id)).toEqual(['free', 'pro', 'enterprise', 'custom']);
      });

      it('returns correct pro plan details', () => {
        const plans = manager.getPricingPlans();
        const proPlan = plans.find(p => p.id === 'pro');

        expect(proPlan?.monthlyPrice).toBe(100);
        expect(proPlan?.annualPrice).toBe(1000);
        expect(proPlan?.popular).toBe(true);
      });
    });

    describe('revokeApiKey', () => {
      it('revokes API key', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');

        manager.revokeApiKey(apiKey.id);

        const stored = manager['apiKeys'].get(apiKey.id);
        expect(stored?.status).toBe('cancelled');
      });

      it('throws error for non-existent key', () => {
        expect(() => {
          manager.revokeApiKey('non-existent');
        }).toThrow('API key not found');
      });
    });

    describe('upgradeApiKey', () => {
      it('upgrades API key tier', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');

        manager.upgradeApiKey(apiKey.id, 'pro');

        const stored = manager['apiKeys'].get(apiKey.id);
        expect(stored?.tier).toBe('pro');
        expect(stored?.usageLimit).toBe(10000); // Pro limit
      });

      it('throws error for non-existent key', () => {
        expect(() => {
          manager.upgradeApiKey('non-existent', 'pro');
        }).toThrow('API key not found');
      });
    });

    describe('resetUsage', () => {
      it('resets usage counter', () => {
        const apiKey = manager.generateApiKey('agent-123', 'free');
        
        // Add some usage
        manager.trackUsage(apiKey.id, true);
        manager.trackUsage(apiKey.id, true);
        manager.trackUsage(apiKey.id, true);

        manager.resetUsage(apiKey.id);

        const stored = manager['apiKeys'].get(apiKey.id);
        expect(stored?.usageCount).toBe(0);
      });
    });
  });

  describe('createLicenseManager', () => {
    it('creates license manager instance', () => {
      const manager = createLicenseManager();

      expect(manager).toBeInstanceOf(LicenseManager);
      expect(typeof manager.generateApiKey).toBe('function');
      expect(typeof manager.validateApiKey).toBe('function');
    });
  });

  describe('licenseEnforcementMiddleware', () => {
    it('allows valid license', () => {
      const manager = new LicenseManager();
      const apiKey = manager.generateApiKey('agent-123', 'pro');

      const result = licenseEnforcementMiddleware(manager, apiKey.key);

      expect(result.action).toBe('allow');
    });

    it('blocks invalid license', () => {
      const manager = new LicenseManager();

      const result = licenseEnforcementMiddleware(manager, 'invalid-key');

      expect(result.action).toBe('block');
      expect(result.reason).toContain('Invalid');
    });
  });

  describe('DEFAULT_PRICING_PLANS', () => {
    it('has correct free tier', () => {
      const plan = DEFAULT_PRICING_PLANS.free;
      expect(plan.monthlyPrice).toBe(0);
      expect(plan.limits.requestsPerMonth).toBe(100);
      expect(plan.limits.support).toBe('community');
    });

    it('has correct pro tier', () => {
      const plan = DEFAULT_PRICING_PLANS.pro;
      expect(plan.monthlyPrice).toBe(100);
      expect(plan.annualPrice).toBe(1000);
      expect(plan.limits.requestsPerMonth).toBe(10000);
      expect(plan.limits.support).toBe('email');
    });

    it('has correct enterprise tier', () => {
      const plan = DEFAULT_PRICING_PLANS.enterprise;
      expect(plan.monthlyPrice).toBe(500);
      expect(plan.limits.requestsPerMonth).toBe(-1); // Unlimited
      expect(plan.limits.support).toBe('priority');
    });

    it('has correct custom tier', () => {
      const plan = DEFAULT_PRICING_PLANS.custom;
      expect(plan.monthlyPrice).toBe(0); // Contact sales
      expect(plan.limits.support).toBe('dedicated');
    });
  });
});
