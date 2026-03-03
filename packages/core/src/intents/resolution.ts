/**
 * Intent Resolution Module
 * 
 * Resolves intent declarations to resolutions based on actor type
 */

import type {
  IntentDeclaration,
  IntentResolution,
  ResolutionOptions,
  AgentCapabilities,
} from './types';
import {
  DEFAULT_RESOLUTION_OPTIONS,
  DEFAULT_AGENT_CAPABILITIES,
  DEFAULT_AGENT_CONSTRAINTS,
} from './types';
import type { Signal, DataFormatType } from '../types';

/**
 * Resolve intent declaration to resolution
 */
export function resolveIntent(
  declaration: IntentDeclaration,
  signals: Signal[],
  options: ResolutionOptions = DEFAULT_RESOLUTION_OPTIONS
): IntentResolution {
  // Route to appropriate resolver based on actor type
  if (declaration.actorType === 'agent') {
    return resolveAgentIntent(declaration, signals, options);
  }

  return resolveHumanIntent(declaration, signals, options);
}

/**
 * Resolve intent for human users
 */
export function resolveHumanIntent(
  declaration: IntentDeclaration,
  signals: Signal[],
  options: ResolutionOptions = DEFAULT_RESOLUTION_OPTIONS
): IntentResolution {
  // Analyze signals for human behavior
  const dwellTime = calculateDwellTime(signals);
  const hoverCount = countHovers(signals);
  const scrollDepth = calculateScrollDepth(signals);

  // Determine emphasis based on engagement
  let emphasis: 'subtle' | 'normal' | 'strong' = 'normal';
  if (dwellTime > 5000 || hoverCount > 3) {
    emphasis = 'strong';
  } else if (dwellTime < 1000) {
    emphasis = 'subtle';
  }

  // Determine animation based on goal
  let animation: 'none' | 'subtle' | 'playful' | 'urgent' = 'subtle';
  if (declaration.goal === 'convert' && declaration.priority === 'high') {
    animation = 'urgent';
  } else if (declaration.goal === 'engage') {
    animation = 'playful';
  }

  // Determine hierarchy based on scroll depth
  let hierarchy: 'de-emphasized' | 'normal' | 'focused' = 'normal';
  if (scrollDepth > 80) {
    hierarchy = 'focused';
  } else if (scrollDepth < 20) {
    hierarchy = 'de-emphasized';
  }

  // Build resolution (human-focused)
  const resolution: IntentResolution = {
    density: 'normal',
    emphasis,
    animation,
    hierarchy,
    microcopy: generateHumanMicrocopy(declaration.goal, emphasis),
  };

  // Add agent fields if requested (for hybrid scenarios)
  if (options.includeAgentFields) {
    resolution.dataFormat = 'html'; // Humans prefer HTML
    resolution.apiSurface = undefined; // No API for humans
    resolution.negotiationProtocol = undefined;
  }

  return resolution;
}

/**
 * Resolve intent for AI agents
 */
export function resolveAgentIntent(
  declaration: IntentDeclaration,
  _signals: Signal[],
  _options: ResolutionOptions = DEFAULT_RESOLUTION_OPTIONS
): IntentResolution {
  // Get agent capabilities (use defaults if not provided)
  const capabilities: AgentCapabilities = declaration.agentCapabilities || DEFAULT_AGENT_CAPABILITIES;
  const constraints = declaration.agentConstraints || DEFAULT_AGENT_CONSTRAINTS;

  // Agents prefer compact, efficient layouts
  const density: 'compact' | 'normal' | 'spacious' = 'compact';

  // Agents don't need visual emphasis
  const emphasis: 'subtle' | 'normal' | 'strong' = 'normal';

  // Agents don't need animations (waste of bandwidth)
  const animation: 'none' | 'subtle' | 'playful' | 'urgent' = 'none';

  // Agents prefer focused hierarchy
  const hierarchy: 'de-emphasized' | 'normal' | 'focused' = 'focused';

  // Determine data format based on capabilities
  let dataFormat: DataFormatType = 'html';
  if (capabilities.canParseStructuredData) {
    dataFormat = constraints.preferredFormat || 'json-ld';
  }

  // Build API surface if agent can execute APIs
  const apiSurface = capabilities.canExecuteAPIs ? {
    exposeEndpoints: true,
    schemaType: 'graphql' as const,
    batchSupport: capabilities.maxParallelism > 1,
    streamingSupport: capabilities.supportsStreaming,
    endpoint: `/api/${declaration.componentId}/structured`,
  } : undefined;

  // Build negotiation protocol if agent can negotiate
  const negotiationProtocol = capabilities.canNegotiate ? {
    enabled: true,
    protocol: 'contract-net' as const,
    maxRounds: 3,
    initialOffer: {
      timeout: constraints.timeout,
      format: dataFormat,
    },
  } : undefined;

  // Generate structured data payload
  const structuredData = generateStructuredData(declaration, dataFormat);

  // Build resolution (agent-focused)
  const resolution: IntentResolution = {
    density,
    emphasis,
    animation,
    hierarchy,
    microcopy: undefined, // Agents don't need microcopy
    dataFormat,
    apiSurface,
    negotiationProtocol,
    structuredData,
    cacheHeaders: {
      maxAge: 300, // 5 minutes
      etag: generateETag(declaration),
    },
  };

  return resolution;
}

/**
 * Calculate total dwell time from signals
 */
function calculateDwellTime(signals: Signal[]): number {
  const dwellSignals = signals.filter(s => s.type === 'dwell');
  return dwellSignals.reduce((sum, s) => sum + s.value, 0);
}

/**
 * Count hover signals
 */
function countHovers(signals: Signal[]): number {
  return signals.filter(s => s.type === 'hover').length;
}

/**
 * Calculate scroll depth from signals
 */
function calculateScrollDepth(signals: Signal[]): number {
  const scrollSignals = signals.filter(s => s.type === 'scroll');
  if (scrollSignals.length === 0) {
    return 0;
  }

  const maxDepth = Math.max(...scrollSignals.map(s => s.context?.scrollDepth || 0));
  return maxDepth;
}

/**
 * Generate microcopy for human users
 */
function generateHumanMicrocopy(goal: string, emphasis: string): string {
  const microcopyMap: Record<string, Record<string, string>> = {
    convert: {
      subtle: 'Learn more',
      normal: 'Get started',
      strong: 'Start now - Limited offer!',
    },
    inform: {
      subtle: 'Read more',
      normal: 'View details',
      strong: 'Discover insights',
    },
    engage: {
      subtle: 'Explore',
      normal: 'Try it out',
      strong: 'Join thousands of users!',
    },
  };

  return microcopyMap[goal]?.[emphasis] || 'Click here';
}

/**
 * Generate structured data for agents
 */
function generateStructuredData(
  declaration: IntentDeclaration,
  format: DataFormatType
): any {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'Action',
    actionName: declaration.goal,
    priority: declaration.priority,
    componentId: declaration.componentId,
    timestamp: declaration.timestamp,
  };

  switch (format) {
    case 'json-ld':
      return {
        ...baseData,
        '@id': `action:${declaration.componentId}:${declaration.timestamp}`,
      };

    case 'microdata':
      return {
        itemscope: true,
        itemtype: 'https://schema.org/Action',
        ...baseData,
      };

    case 'api':
      return {
        action: declaration.goal,
        params: declaration.context,
        meta: {
          componentId: declaration.componentId,
          timestamp: declaration.timestamp,
        },
      };

    default:
      return baseData;
  }
}

/**
 * Generate ETag for caching
 */
function generateETag(declaration: IntentDeclaration): string {
  const hash = `${declaration.componentId}:${declaration.goal}:${declaration.priority}`;
  return `"${Buffer.from(hash).toString('base64')}"`;
}

/**
 * Batch resolve multiple intents
 */
export function resolveIntents(
  declarations: IntentDeclaration[],
  signals: Signal[][],
  options: ResolutionOptions = DEFAULT_RESOLUTION_OPTIONS
): IntentResolution[] {
  return declarations.map((declaration, index) =>
    resolveIntent(declaration, signals[index] || [], options)
  );
}

/**
 * Real-time intent resolver
 */
export class IntentResolver {
  private options: ResolutionOptions;
  private cache: Map<string, { resolution: IntentResolution; timestamp: number }> = new Map();
  private readonly cacheTTL: number;

  constructor(options: ResolutionOptions = DEFAULT_RESOLUTION_OPTIONS, cacheTTL: number = 300000) {
    this.options = options;
    this.cacheTTL = cacheTTL; // Default 5 minutes
  }

  /**
   * Resolve intent with caching
   */
  resolve(declaration: IntentDeclaration, signals: Signal[]): IntentResolution {
    const cacheKey = this.getCacheKey(declaration);

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.resolution;
    }

    // Resolve
    const resolution = resolveIntent(declaration, signals, this.options);

    // Cache
    this.cache.set(cacheKey, {
      resolution,
      timestamp: Date.now(),
    });

    return resolution;
  }

  /**
   * Clear cache
   */
  clearCache(componentId?: string): void {
    if (componentId) {
      // Clear specific component
      for (const [key] of this.cache) {
        if (key.startsWith(componentId)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hits: number; misses: number } {
    return {
      size: this.cache.size,
      hits: 0, // Implement hit/miss tracking if needed
      misses: 0,
    };
  }

  /**
   * Generate cache key
   */
  private getCacheKey(declaration: IntentDeclaration): string {
    return `${declaration.componentId}:${declaration.goal}:${declaration.priority}:${declaration.actorType}`;
  }
}
