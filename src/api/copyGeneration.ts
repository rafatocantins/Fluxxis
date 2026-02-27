/**
 * Copy Generation API
 * 
 * LLM-powered copy generation with privacy-first design
 * Supports multiple providers (Anthropic, OpenAI, etc.)
 */

import type { BrandVoiceConfig } from '../types/brandVoice';
import type { GoalType } from '../types';
import { filterPII } from './PrivacyFilter';
import { createCTAPrompt } from './copyPrompts';

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
  provider: 'anthropic' | 'openai' | 'gemini' | 'qwen' | 'groq' | 'openrouter' | 'custom';
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
}

/**
 * Cache for copy generation results
 */
interface CopyCache {
  [key: string]: {
    response: CopyGenerationResponse;
    timestamp: number;
    expiresAt: number;
  };
}

const cache: CopyCache = {};
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate copy using LLM
 */
export async function generateCopy(
  request: CopyGenerationRequest,
  config: CopyGenerationConfig
): Promise<CopyGenerationResponse> {
  const cacheKey = generateCacheKey(request);

  // Check cache
  if (config.enableCache !== false && cache[cacheKey]) {
    const cached = cache[cacheKey];
    if (Date.now() < cached.expiresAt) {
      console.log('[CopyGeneration] Using cached response');
      return cached.response;
    }
    delete cache[cacheKey];
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
    if (config.enableCache !== false) {
      cache[cacheKey] = {
        response,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_TTL,
      };
    }

    console.log('[CopyGeneration] Successfully generated copy');
    return response;
  } catch (error) {
    console.error('[CopyGeneration] Error:', error);

    // Return fallback
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
}

/**
 * Call LLM API (Anthropic, OpenAI, Gemini, Qwen, Groq, OpenRouter, or custom)
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
    // Try to parse as JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback: extract copy from text
    const lines = text.split('\n').filter((line) => line.trim());
    const variations = lines
      .filter((line) => line.includes('"copy"') || line.includes('"headline"'))
      .map((line) => {
        const match = line.match(/"copy"\s*:\s*"([^"]+)"/) || line.match(/"headline"\s*:\s*"([^"]+)"/);
        return match
          ? { copy: match[1], rationale: 'Extracted from response' }
          : null;
      })
      .filter(Boolean) as Array<{ copy: string; rationale: string }>;

    return { variations };
  } catch (error) {
    console.error('[CopyGeneration] Failed to parse response:', error);
    return { variations: [] };
  }
}

/**
 * Generate cache key from request
 */
function generateCacheKey(request: CopyGenerationRequest): string {
  return `${request.goal}:${request.pageContext}:${request.defaultCopy}:${JSON.stringify(request.brandVoice)}`;
}

/**
 * Clear copy generation cache
 */
export function clearCopyCache(): void {
  Object.keys(cache).forEach((key) => delete cache[key]);
  console.log('[CopyGeneration] Cache cleared');
}
