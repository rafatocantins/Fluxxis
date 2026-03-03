/**
 * BrandVoice Presets and Templates
 * 
 * Pre-configured BrandVoice configurations for common use cases
 */

import type { BrandVoiceConfig } from './brandVoice';

/**
 * Industry-specific BrandVoice presets
 */
export const BRAND_VOICE_PRESETS: Record<string, BrandVoiceConfig> = {
  // Tech Startups
  'tech-startup': {
    tone: 'confident-but-warm',
    audience: ['founders', 'early adopters', 'tech-savvy'],
    ctaStyle: 'direct',
    vocabulary: 'simple',
    readingLevel: '10th grade',
    preferredWords: ['innovative', 'simple', 'powerful', 'fast'],
    avoidedWords: ['enterprise', 'complex', 'legacy'],
  },
  
  // Enterprise SaaS
  'enterprise-saas': {
    tone: 'professional',
    audience: ['decision makers', 'IT leaders', 'enterprises'],
    ctaStyle: 'benefit-focused',
    vocabulary: 'technical',
    readingLevel: 'college',
    preferredWords: ['scalable', 'secure', 'reliable', 'ROI'],
    avoidedWords: ['cheap', 'quick', 'easy'],
  },
  
  // E-commerce
  'ecommerce': {
    tone: 'friendly',
    audience: ['shoppers', 'consumers'],
    ctaStyle: 'urgent',
    vocabulary: 'simple',
    readingLevel: '8th grade',
    preferredWords: ['free', 'save', 'new', 'exclusive'],
    avoidedWords: ['expensive', 'limited', 'complex'],
  },
  
  // Healthcare
  'healthcare': {
    tone: 'confident-but-warm',
    audience: ['patients', 'healthcare providers'],
    ctaStyle: 'soft',
    vocabulary: 'simple',
    readingLevel: '8th grade',
    preferredWords: ['trusted', 'care', 'safe', 'proven'],
    avoidedWords: ['risk', 'cheap', 'fast'],
  },
  
  // Finance
  'finance': {
    tone: 'authoritative',
    audience: ['investors', 'finance professionals'],
    ctaStyle: 'benefit-focused',
    vocabulary: 'technical',
    readingLevel: 'college',
    preferredWords: ['secure', 'growth', 'trusted', 'proven'],
    avoidedWords: ['risky', 'gamble', 'quick'],
  },
  
  // Education
  'education': {
    tone: 'friendly',
    audience: ['students', 'educators', 'lifelong learners'],
    ctaStyle: 'curious',
    vocabulary: 'simple',
    readingLevel: '10th grade',
    preferredWords: ['learn', 'discover', 'grow', 'achieve'],
    avoidedWords: ['difficult', 'complex', 'expensive'],
  },
  
  // Creative Agency
  'creative-agency': {
    tone: 'playful',
    audience: ['creatives', 'marketers', 'brands'],
    ctaStyle: 'curious',
    vocabulary: 'aspirational',
    readingLevel: '12th grade',
    preferredWords: ['creative', 'bold', 'unique', 'stunning'],
    avoidedWords: ['template', 'generic', 'basic'],
  },
  
  // Non-Profit
  'non-profit': {
    tone: 'confident-but-warm',
    audience: ['donors', 'volunteers', 'advocates'],
    ctaStyle: 'benefit-focused',
    vocabulary: 'simple',
    readingLevel: '10th grade',
    preferredWords: ['impact', 'community', 'change', 'together'],
    avoidedWords: ['cost', 'price', 'buy'],
  },
};

/**
 * Tone-specific configuration helpers
 */
export const TONE_PRESETS: Record<string, Partial<BrandVoiceConfig>> = {
  'persuasive': {
    tone: 'confident-but-warm',
    ctaStyle: 'benefit-focused',
    vocabulary: 'aspirational',
  },
  'trustworthy': {
    tone: 'professional',
    ctaStyle: 'soft',
    vocabulary: 'simple',
  },
  'exciting': {
    tone: 'playful',
    ctaStyle: 'urgent',
    vocabulary: 'aspirational',
  },
  'calm': {
    tone: 'minimal',
    ctaStyle: 'soft',
    vocabulary: 'simple',
  },
  'luxury': {
    tone: 'authoritative',
    ctaStyle: 'curious',
    vocabulary: 'aspirational',
  },
};

/**
 * Audience-specific helpers
 */
export const AUDIENCE_PRESETS: Record<string, string[]> = {
  'b2b': ['decision makers', 'business leaders', 'procurement'],
  'b2c': ['consumers', 'shoppers', 'end users'],
  'developers': ['developers', 'engineers', 'technical teams'],
  'designers': ['designers', 'creatives', 'UX professionals'],
  'marketers': ['marketers', 'growth teams', 'content creators'],
  'executives': ['C-level', 'VPs', 'directors'],
  'small-business': ['small business owners', 'entrepreneurs', 'solopreneurs'],
  'enterprise': ['enterprise clients', 'large organizations'],
};

/**
 * Get preset by name
 */
export function getBrandVoicePreset(name: string): BrandVoiceConfig | undefined {
  return BRAND_VOICE_PRESETS[name];
}

/**
 * Get tone preset by name
 */
export function getTonePreset(name: string): Partial<BrandVoiceConfig> | undefined {
  return TONE_PRESETS[name];
}

/**
 * Get audience preset by name
 */
export function getAudiencePreset(name: string): string[] | undefined {
  return AUDIENCE_PRESETS[name];
}

/**
 * Create custom BrandVoice from presets
 */
export function createBrandVoice(options: {
  industry?: string;
  tone?: string;
  audience?: string;
  custom?: Partial<BrandVoiceConfig>;
}): BrandVoiceConfig {
  const base = options.industry ? BRAND_VOICE_PRESETS[options.industry] : undefined;
  const tone = options.tone ? TONE_PRESETS[options.tone] : undefined;
  const audience = options.audience ? AUDIENCE_PRESETS[options.audience] : undefined;
  
  return {
    tone: 'confident-but-warm',
    audience: ['general'],
    ctaStyle: 'direct',
    vocabulary: 'simple',
    ...base,
    ...tone,
    ...(audience && { audience }),
    ...options.custom,
  };
}
