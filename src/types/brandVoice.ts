/**
 * BrandVoice configuration for customizing tone, audience, and style
 */

/**
 * Available tone options for brand voice
 */
export type BrandTone =
  | 'confident-but-warm'
  | 'playful'
  | 'professional'
  | 'minimal'
  | 'friendly'
  | 'authoritative';

/**
 * CTA style preferences
 */
export type CTAStyle = 'direct' | 'soft' | 'urgent' | 'curious' | 'benefit-focused';

/**
 * Vocabulary level for copy generation
 */
export type VocabularyLevel = 'simple' | 'technical' | 'aspirational' | 'conversational';

/**
 * BrandVoice configuration schema
 */
export interface BrandVoiceConfig {
  /** Primary tone of voice */
  tone: BrandTone;
  /** Target audience segments */
  audience: string[];
  /** Call-to-action style preference */
  ctaStyle: CTAStyle;
  /** Vocabulary level (optional, defaults to 'simple') */
  vocabulary?: VocabularyLevel;
  /** Brand-specific words or phrases to include */
  preferredWords?: string[];
  /** Words or phrases to avoid */
  avoidedWords?: string[];
  /** Reading level target (e.g., "8th grade", "college") */
  readingLevel?: string;
}

/**
 * Default BrandVoice configuration
 */
export const DEFAULT_BRAND_VOICE: BrandVoiceConfig = {
  tone: 'confident-but-warm',
  audience: ['general'],
  ctaStyle: 'direct',
  vocabulary: 'simple',
};

/**
 * Validate BrandVoice configuration
 */
export function validateBrandVoice(config: Partial<BrandVoiceConfig>): boolean {
  const validTones: BrandTone[] = [
    'confident-but-warm',
    'playful',
    'professional',
    'minimal',
    'friendly',
    'authoritative',
  ];
  const validStyles: CTAStyle[] = ['direct', 'soft', 'urgent', 'curious', 'benefit-focused'];
  const validVocab: VocabularyLevel[] = ['simple', 'technical', 'aspirational', 'conversational'];

  if (config.tone && !validTones.includes(config.tone)) {
    return false;
  }
  if (config.ctaStyle && !validStyles.includes(config.ctaStyle)) {
    return false;
  }
  if (config.vocabulary && !validVocab.includes(config.vocabulary)) {
    return false;
  }
  if (config.audience && !Array.isArray(config.audience)) {
    return false;
  }

  return true;
}

/**
 * Merge partial BrandVoice config with defaults
 */
export function mergeBrandVoiceConfig(partial: Partial<BrandVoiceConfig>): BrandVoiceConfig {
  return {
    ...DEFAULT_BRAND_VOICE,
    ...partial,
  };
}
