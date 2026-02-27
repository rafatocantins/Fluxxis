/**
 * Privacy Filter
 * 
 * Removes PII (Personally Identifiable Information) before sending data to LLM APIs
 * Ensures privacy-first AI integration
 */

export interface PrivacyFilterOptions {
  /** Remove email addresses */
  removeEmails?: boolean;
  /** Remove phone numbers */
  removePhones?: boolean;
  /** Remove names */
  removeNames?: boolean;
  /** Remove addresses */
  removeAddresses?: boolean;
  /** Remove URLs */
  removeUrls?: boolean;
  /** Custom patterns to remove */
  customPatterns?: RegExp[];
}

const defaultOptions: PrivacyFilterOptions = {
  removeEmails: true,
  removePhones: true,
  removeNames: false,
  removeAddresses: false,
  removeUrls: true,
  customPatterns: [],
};

/**
 * Patterns for detecting PII
 */
const PII_PATTERNS: Record<string, RegExp> = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g,
  url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g,
  ipAddress: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
};

/**
 * Filter PII from text before sending to LLM
 */
export function filterPII(text: string, options: PrivacyFilterOptions = defaultOptions): string {
  let filtered = text;

  if (options.removeEmails) {
    filtered = filtered.replace(PII_PATTERNS.email, '[EMAIL_REDACTED]');
  }

  if (options.removePhones) {
    filtered = filtered.replace(PII_PATTERNS.phone, '[PHONE_REDACTED]');
  }

  if (options.removeUrls) {
    filtered = filtered.replace(PII_PATTERNS.url, '[URL_REDACTED]');
  }

  if (options.removeAddresses) {
    // Simple address pattern (street numbers + words)
    const addressPattern = /\d+\s+[A-Za-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl)/gi;
    filtered = filtered.replace(addressPattern, '[ADDRESS_REDACTED]');
  }

  if (options.customPatterns) {
    options.customPatterns.forEach((pattern) => {
      filtered = filtered.replace(pattern, '[REDACTED]');
    });
  }

  return filtered;
}

/**
 * Validate that text doesn't contain PII
 */
export function validateNoPII(text: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];

  if (PII_PATTERNS.email.test(text)) {
    violations.push('email');
  }
  if (PII_PATTERNS.phone.test(text)) {
    violations.push('phone');
  }
  if (PII_PATTERNS.url.test(text)) {
    violations.push('url');
  }
  if (PII_PATTERNS.ipAddress.test(text)) {
    violations.push('ip_address');
  }
  if (PII_PATTERNS.ssn.test(text)) {
    violations.push('ssn');
  }
  if (PII_PATTERNS.creditCard.test(text)) {
    violations.push('credit_card');
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * PrivacyFilter utility object
 */
export const PrivacyFilter = {
  filter: filterPII,
  validate: validateNoPII,
  patterns: PII_PATTERNS,
};
