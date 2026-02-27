/**
 * Copy Generation Prompts
 * 
 * Prompt templates for LLM-powered copy generation with BrandVoice alignment
 */

import type { BrandVoiceConfig } from '../types/brandVoice';
import type { GoalType } from '../types';

/**
 * System prompt for copy generation
 */
export const COPY_GENERATION_SYSTEM_PROMPT = `You are an expert copywriter for a design system. 
Your task is to generate compelling, goal-oriented copy for UI components.

Guidelines:
- Keep copy concise (2-6 words for buttons)
- Match the specified tone and audience
- Use action-oriented language for "convert" goals
- Use informative language for "inform" goals
- Use engaging, playful language for "engage" goals
- Never include PII (emails, phones, names, addresses)
- Follow brand voice guidelines strictly
- Generate 3 variations for A/B testing`;

/**
 * Prompt template for CTA copy generation
 */
export function createCTAPrompt(
  goal: GoalType,
  pageContext: string,
  brandVoice: BrandVoiceConfig,
  defaultCopy: string
): string {
  const goalInstructions: Record<GoalType, string> = {
    convert: `
GOAL: Drive user action (clicks, signups, purchases)
SUCCESS METRIC: Click-through rate
RECOMMENDED APPROACH:
- Use direct, action-oriented verbs
- Create urgency or scarcity when appropriate
- Highlight benefits or value proposition
- Make the next step clear`,

    inform: `
GOAL: Provide information and educate users
SUCCESS METRIC: Scroll depth, dwell time
RECOMMENDED APPROACH:
- Use clear, descriptive language
- Focus on learning and discovery
- Avoid aggressive calls-to-action
- Emphasize value of information`,

    engage: `
GOAL: Build interest and interaction
SUCCESS METRIC: Interaction rate
RECOMMENDED APPROACH:
- Use playful, curious language
- Invite exploration
- Create intrigue or excitement
- Make it feel like an experience`,
  };

  const toneExamples: Record<string, string> = {
    'confident-but-warm': 'Confident but friendly, authoritative but approachable',
    'playful': 'Fun, lighthearted, energetic',
    'professional': 'Formal, credible, trustworthy',
    'minimal': 'Simple, direct, no-nonsense',
    'friendly': 'Warm, welcoming, conversational',
    'authoritative': 'Expert, commanding, decisive',
  };

  return `
${COPY_GENERATION_SYSTEM_PROMPT}

CONTEXT:
- Page/Section: ${pageContext}
- Goal: ${goal.toUpperCase()}
- Default Copy: "${defaultCopy}"

BRAND VOICE:
- Tone: ${brandVoice.tone} (${toneExamples[brandVoice.tone] || ''})
- Audience: ${brandVoice.audience.join(', ')}
- CTA Style: ${brandVoice.ctaStyle}
- Vocabulary: ${brandVoice.vocabulary || 'simple'}
${brandVoice.preferredWords ? `- Preferred Words: ${brandVoice.preferredWords.join(', ')}` : ''}
${brandVoice.avoidedWords ? `- Avoid: ${brandVoice.avoidedWords.join(', ')}` : ''}

${goalInstructions[goal]}

TASK:
Generate 3 button copy variations (2-6 words each) that:
1. Align with the ${goal} goal
2. Match the ${brandVoice.tone} tone
3. Resonate with ${brandVoice.audience.join(', ')}
4. Use ${brandVoice.ctaStyle} CTA style

Output format (JSON):
{
  "variations": [
    { "copy": "...", "rationale": "..." },
    { "copy": "...", "rationale": "..." },
    { "copy": "...", "rationale": "..." }
  ],
  "recommended": 0
}
`.trim();
}

/**
 * Prompt template for headline copy generation
 */
export function createHeadlinePrompt(
  goal: GoalType,
  pageContext: string,
  brandVoice: BrandVoiceConfig,
  topic: string
): string {
  return `
${COPY_GENERATION_SYSTEM_PROMPT}

CONTEXT:
- Page/Section: ${pageContext}
- Topic: ${topic}
- Goal: ${goal.toUpperCase()}

BRAND VOICE:
- Tone: ${brandVoice.tone}
- Audience: ${brandVoice.audience.join(', ')}

TASK:
Generate 3 headline variations (5-12 words each) that capture attention and align with the goal.

Output format (JSON):
{
  "variations": [
    { "headline": "...", "rationale": "..." },
    { "headline": "...", "rationale": "..." },
    { "headline": "...", "rationale": "..." }
  ],
  "recommended": 0
}
`.trim();
}

/**
 * Prompt template for microcopy (helper text, labels, etc.)
 */
export function createMicrocopyPrompt(
  type: string,
  context: string,
  brandVoice: BrandVoiceConfig
): string {
  return `
${COPY_GENERATION_SYSTEM_PROMPT}

CONTEXT:
- Type: ${type}
- Context: ${context}

BRAND VOICE:
- Tone: ${brandVoice.tone}
- Audience: ${brandVoice.audience.join(', ')}

TASK:
Generate 3 microcopy variations that are helpful and on-brand.

Output format (JSON):
{
  "variations": [
    { "copy": "...", "rationale": "..." },
    { "copy": "...", "rationale": "..." },
    { "copy": "...", "rationale": "..." }
  ],
  "recommended": 0
}
`.trim();
}
