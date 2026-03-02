/**
 * Copy Generation API
 * 
 * LLM-powered copy generation with privacy-first design
 * Supports multiple providers (Anthropic, OpenAI, etc.)
 * Includes caching, rate limiting, and offline fallback
 */

import type { BrandVoiceConfig } from '../types/brandVoice';
import type { GoalType } from '../types';
import { filterPII } from './PrivacyFilter';
import { createCTAPrompt } from './copyPrompts';
import { getCachedCopy, setCachedCopy } from './copyCache';
import { rateLimiter } from '../utils/rateLimiter';

/**
 * Copy generation request
 */
export interface CopyGenerationRequest {
  /** Goal type */
  goal: GoalType;
  /** Page context */
  pageContext: string;
  /** Brand voice configuration */
  brandVoice: BrandVoiceConfig;
  /** Default/fallback copy */
  defaultCopy: string;
  /** Component type (button, headline, etc.) */
  componentType?: 'button' | 'headline' | 'microcopy';
}

/**
 * Copy generation response
 */
export interface CopyGenerationResponse {
  /** Generated copy variations */
  variations: Array<{
    copy: string;
    rationale: string;
  }>;
  /** Recommended variation index */
  recommended: number;
  /** Selected copy */
  selected: string;
  /** Was fallback used? */
  fallback: boolean;
  /** Confidence score (0-1) */
  confidence: number;
  /** Generation timestamp */
  timestamp: number;
}

/**
 * API configuration
 */
export interface CopyGenerationConfig {
  /** API provider */
  provider: 'anthropic' | 'openai' | 'gemini' | 'qwen' | 'groq' | 'openrouter' | 'zai' | 'custom';
  /** API endpoint (for custom provider) */
  endpoint?: string;
  /** API key */
  apiKey: string;
  /** Model to use */
  model: string;
  /** Request timeout (ms) */
  timeout?: number;
  /** Enable caching */
  enableCache?: boolean;
  /** Use Puter.js for Z.AI (no API key needed) */
  usePuter?: boolean;
}

/**
 * Generate copy using LLM
 */
export async function generateCopy(
  request: CopyGenerationRequest,
  config: CopyGenerationConfig
): Promise<CopyGenerationResponse> {
  // Check cache first (works offline!)
  const cached = getCachedCopy(
    request.goal,
    request.pageContext,
    request.defaultCopy,
    request.brandVoice,
    config.provider  // Pass provider for separate caching
  );

  if (cached) {
    console.log('[CopyGeneration] Using cached response from', config.provider);
    return {
      ...cached,
      fallback: false,
    };
  }

  // Check rate limit
  const rateLimit = rateLimiter.canRequest(config.provider);
  if (!rateLimit.allowed) {
    console.warn('[CopyGeneration] Rate limited, using fallback');
    return createFallbackResponse(request, `Rate limited. Retry after ${rateLimit.retryAfter}s`);
  }

  try {
    // Filter PII from inputs
    const safePageContext = filterPII(request.pageContext);
    const safeDefaultCopy = filterPII(request.defaultCopy);

    // Create prompt
    const prompt = createCTAPrompt(
      request.goal,
      safePageContext,
      request.brandVoice,
      safeDefaultCopy
    );

    // Call LLM API
    const llmResponse = await callLLMAPI(prompt, config);

    // Record success for rate limiter
    rateLimiter.recordSuccess(config.provider);

    // Parse response
    const parsed = parseLLMResponse(llmResponse);

    // Validate response
    if (!parsed.variations || parsed.variations.length === 0) {
      throw new Error('No variations generated');
    }

    // Build response
    const response: CopyGenerationResponse = {
      variations: parsed.variations,
      recommended: parsed.recommended ?? 0,
      selected: parsed.variations[parsed.recommended ?? 0]?.copy ?? request.defaultCopy,
      fallback: false,
      confidence: 0.9,
      timestamp: Date.now(),
    };

    // Cache response
    setCachedCopy(
      request.goal,
      request.pageContext,
      request.defaultCopy,
      request.brandVoice,
      response,
      undefined,
      config.provider  // Pass provider for separate caching
    );

    console.log('[CopyGeneration] Successfully generated copy');
    return response;
  } catch (error) {
    console.error('[CopyGeneration] Error:', error);
    
    // Record failure for rate limiter
    rateLimiter.recordFailure(config.provider);

    // Return fallback
    return createFallbackResponse(request, error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Create fallback response
 */
function createFallbackResponse(
  request: CopyGenerationRequest,
  reason: string
): CopyGenerationResponse {
  console.log('[CopyGeneration] Using fallback:', reason);
  
  return {
    variations: [
      { copy: request.defaultCopy, rationale: 'Fallback to default copy' },
    ],
    recommended: 0,
    selected: request.defaultCopy,
    fallback: true,
    confidence: 0.5,
    timestamp: Date.now(),
  };
}

/**
 * Call LLM API (Anthropic, OpenAI, Gemini, Qwen, Groq, OpenRouter, Z.AI, or custom)
 */
async function callLLMAPI(
  prompt: string,
  config: CopyGenerationConfig
): Promise<string> {
  const { provider, apiKey, model, timeout = 10000 } = config;

  if (provider === 'anthropic') {
    return callAnthropicAPI(prompt, apiKey, model, timeout);
  }

  if (provider === 'openai') {
    return callOpenAIAPI(prompt, apiKey, model, timeout);
  }

  if (provider === 'gemini') {
    return callGeminiAPI(prompt, apiKey, model, timeout);
  }

  if (provider === 'qwen') {
    return callQwenAPI(prompt, apiKey, model, timeout);
  }

  if (provider === 'groq') {
    return callGroqAPI(prompt, apiKey, model, timeout);
  }

  if (provider === 'openrouter') {
    return callOpenRouterAPI(prompt, apiKey, model, timeout);
  }

  if (provider === 'zai') {
    return callZAI_API(prompt, model, config.usePuter);
  }

  if (provider === 'custom' && config.endpoint) {
    return callCustomAPI(prompt, config.endpoint, apiKey, timeout);
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

/**
 * Call Anthropic Claude API
 */
async function callAnthropicAPI(
  prompt: string,
  apiKey: string,
  model: string,
  _timeout: number
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * Call OpenAI API
 */
async function callOpenAIAPI(
  prompt: string,
  apiKey: string,
  model: string,
  _timeout: number
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Call Google Gemini API
 */
async function callGeminiAPI(
  prompt: string,
  apiKey: string,
  model: string,
  _timeout: number
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Call Qwen API (Alibaba Cloud DashScope)
 */
async function callQwenAPI(
  prompt: string,
  apiKey: string,
  model: string,
  _timeout: number
): Promise<string> {
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'X-DashScope-SSE': 'disable',
    },
    body: JSON.stringify({
      model,
      input: {
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      parameters: {
        max_tokens: 1024,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Qwen API error: ${error}`);
  }

  const data = await response.json();
  return data.output.choices[0].message.content;
}

/**
 * Call Groq API (Llama 3.3, Mistral - Fastest inference)
 * Free tier: 1K requests/day for 70B models
 */
async function callGroqAPI(
  prompt: string,
  apiKey: string,
  model: string,
  _timeout: number
): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Call OpenRouter API (Access to 20+ free models)
 * Free tier: 50-1K requests/day depending on model
 */
async function callOpenRouterAPI(
  prompt: string,
  apiKey: string,
  model: string,
  _timeout: number
): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://ia-design-system.dev',
      'X-Title': 'AI Design System',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Call Z.AI GLM API via Puter.js (FREE, unlimited)
 * No API key required!
 */
async function callZAI_API(
  prompt: string,
  model: string,
  usePuter: boolean = false
): Promise<string> {
  // If using Puter.js (browser environment)
  if (usePuter && typeof window !== 'undefined') {
    const puter = (window as any).puter;
    
    if (!puter || !puter.ai) {
      throw new Error('Puter.js not loaded. Include: <script src="https://js.puter.com/v2/"></script>');
    }

    try {
      const response = await puter.ai.chat(prompt, { model });
      return response?.message?.content || response?.text || '';
    } catch (error: any) {
      throw new Error(`Z.AI API error: ${error.message || 'Unknown error'}`);
    }
  }

  // Fallback: Try to use via API if available
  throw new Error('Z.AI requires Puter.js in browser. Include: <script src="https://js.puter.com/v2/"></script>');
}

/**
 * Call custom API endpoint
 */
async function callCustomAPI(
  prompt: string,
  endpoint: string,
  apiKey: string,
  _timeout: number
): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Custom API error: ${error}`);
  }

  const data = await response.json();
  return data.response || data.text || data.content;
}

/**
 * Parse LLM response
 */
function parseLLMResponse(text: string): {
  variations: Array<{ copy: string; rationale: string }>;
  recommended?: number;
} {
  try {
    // Try to parse as JSON first
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.variations && Array.isArray(parsed.variations)) {
        return parsed;
      }
    }

    // Fallback: Extract copy from plain text response
    // Look for quoted strings, bullet points, or numbered lists
    const lines = text.split('\n').filter((line) => line.trim());
    const variations: Array<{ copy: string; rationale: string }> = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip empty lines or headers
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('**')) continue;
      
      // Try to extract from various formats
      let copy: string | null = null;

      // Format: "Copy text" or 'Copy text'
      const quoteMatch = trimmed.match(/["']([^"']{3,50})["']/);
      if (quoteMatch && quoteMatch[1]) {
        copy = quoteMatch[1].trim();
      }

      // Format: - Copy text or * Copy text or • Copy text
      if (!copy) {
        const bulletMatch = trimmed.match(/^[-*•]\s*(.{3,50})/);
        if (bulletMatch && bulletMatch[1]) {
          copy = bulletMatch[1].trim();
        }
      }

      // Format: 1. Copy text or 1) Copy text
      if (!copy) {
        const numberMatch = trimmed.match(/^\d+[.)]\s*(.{3,50})/);
        if (numberMatch && numberMatch[1]) {
          copy = numberMatch[1].trim();
        }
      }

      // If we found copy text and it looks like a CTA (short, action-oriented)
      if (copy && copy.length >= 3 && copy.length <= 50) {
        variations.push({ copy, rationale: 'Extracted from response' });
      }

      // Limit to 3 variations
      if (variations.length >= 3) break;
    }

    // If still no variations, use the entire response as a single variation
    if (variations.length === 0 && text.trim().length > 0) {
      // Take first sentence or first 50 chars
      const firstSentence = text.split(/[.!?]/)[0]?.trim();
      const copy = firstSentence && firstSentence.length <= 50 ? firstSentence : text.trim().substring(0, 50);
      if (copy && copy.length >= 3) {
        variations.push({ copy, rationale: 'Used full response' });
      }
    }

    return { variations };
  } catch (error) {
    console.error('[CopyGeneration] Failed to parse response:', error);
    return { variations: [] };
  }
}
// Cache functions are now in copyCache.ts
// Exported from main index.ts for convenience
