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
  | 'authoritative'
  | 'witty'
  | 'empathetic'
  | 'bold';

/**
 * CTA style preferences
 */
export type CTAStyle =
  | 'direct'
  | 'soft'
  | 'urgent'
  | 'curious'
  | 'benefit-focused'
  | 'question'
  | 'command';

/**
 * Vocabulary level for copy generation
 */
export type VocabularyLevel =
  | 'simple'
  | 'technical'
  | 'aspirational'
  | 'conversational'
  | 'formal'
  | 'casual';

/**
 * Personality traits (optional, for fine-tuning)
 */
export interface BrandPersonality {
  /** How formal vs casual (0-100) */
  formality?: number;
  /** How enthusiastic vs reserved (0-100) */
  enthusiasm?: number;
  /** How direct vs subtle (0-100) */
  directness?: number;
  /** How modern vs traditional (0-100) */
  modernity?: number;
}

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
  /** Personality sliders for fine-tuning */
  personality?: BrandPersonality;
  /** Industry context (optional) */
  industry?: string;
  /** Brand name (for personalization) */
  brandName?: string;
  /** Competitor names to avoid mentioning */
  competitorNames?: string[];
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
 * Validate BrandVoice configuration with detailed errors
 */
export function validateBrandVoice(
  config: Partial<BrandVoiceConfig>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validTones: BrandTone[] = [
    'confident-but-warm',
    'playful',
    'professional',
    'minimal',
    'friendly',
    'authoritative',
    'witty',
    'empathetic',
    'bold',
  ];
  const validStyles: CTAStyle[] = [
    'direct',
    'soft',
    'urgent',
    'curious',
    'benefit-focused',
    'question',
    'command',
  ];
  const validVocab: VocabularyLevel[] = [
    'simple',
    'technical',
    'aspirational',
    'conversational',
    'formal',
    'casual',
  ];

  // Required fields
  if (!config.tone) {
    errors.push('Tone is required');
  } else if (!validTones.includes(config.tone)) {
    errors.push(`Invalid tone: ${config.tone}. Must be one of: ${validTones.join(', ')}`);
  }

  if (!config.audience || !Array.isArray(config.audience) || config.audience.length === 0) {
    errors.push('Audience array is required and must have at least one item');
  }

  if (!config.ctaStyle) {
    errors.push('CTA style is required');
  } else if (!validStyles.includes(config.ctaStyle)) {
    errors.push(`Invalid CTA style: ${config.ctaStyle}. Must be one of: ${validStyles.join(', ')}`);
  }

  // Optional fields validation
  if (config.vocabulary && !validVocab.includes(config.vocabulary)) {
    errors.push(`Invalid vocabulary: ${config.vocabulary}. Must be one of: ${validVocab.join(', ')}`);
  }

  if (config.personality) {
    const { formality, enthusiasm, directness, modernity } = config.personality;
    const sliders = [
      { name: 'formality', value: formality },
      { name: 'enthusiasm', value: enthusiasm },
      { name: 'directness', value: directness },
      { name: 'modernity', value: modernity },
    ];

    for (const slider of sliders) {
      if (slider.value !== undefined && (slider.value < 0 || slider.value > 100)) {
        errors.push(`${slider.name} must be between 0 and 100`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
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

/**
 * Get tone description for UI tooltips
 */
export function getToneDescription(tone: BrandTone): string {
  const descriptions: Record<BrandTone, string> = {
    'confident-but-warm': 'Assured and friendly, authoritative but approachable',
    'playful': 'Fun, lighthearted, and energetic',
    'professional': 'Formal, credible, and trustworthy',
    'minimal': 'Simple, direct, and no-nonsense',
    'friendly': 'Warm, welcoming, and conversational',
    'authoritative': 'Expert, commanding, and decisive',
    'witty': 'Clever, humorous, and engaging',
    'empathetic': 'Understanding, caring, and supportive',
    'bold': 'Daring, confident, and attention-grabbing',
  };
  return descriptions[tone] || '';
}

/**
 * Get CTA style description for UI tooltips
 */
export function getCTAStyleDescription(style: CTAStyle): string {
  const descriptions: Record<CTAStyle, string> = {
    'direct': 'Clear, straightforward calls to action',
    'soft': 'Gentle, inviting suggestions',
    'urgent': 'Time-sensitive, action-oriented',
    'curious': 'Question-based, intrigue-building',
    'benefit-focused': 'Highlight value and outcomes',
    'question': 'Engage with questions',
    'command': 'Strong, imperative statements',
  };
  return descriptions[style] || '';
}

/**
 * Format BrandVoice for display in UI
 */
export function formatBrandVoiceForDisplay(config: BrandVoiceConfig): string {
  const parts = [
    config.tone.replace(/-/g, ' ').toUpperCase(),
    `for ${config.audience.join(', ')}`,
  ];

  if (config.industry) {
    parts.push(`in ${config.industry}`);
  }

  return parts.join(' ');
}
