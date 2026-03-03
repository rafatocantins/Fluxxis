/**
 * Intent Types
 * 
 * Defines intent declarations and resolutions for humans and agents
 */

import type { ActorType } from '../signals';

/**
 * Goal types
 */
export type GoalType = 'convert' | 'inform' | 'engage';

/**
 * Priority levels
 */
export type PriorityType = 'low' | 'normal' | 'high';

/**
 * Density options for layout
 */
export type DensityType = 'compact' | 'normal' | 'spacious';

/**
 * Emphasis levels
 */
export type EmphasisType = 'subtle' | 'normal' | 'strong';

/**
 * Animation types
 */
export type AnimationType = 'none' | 'subtle' | 'playful' | 'urgent';

/**
 * Hierarchy levels
 */
export type HierarchyType = 'de-emphasized' | 'normal' | 'focused';

/**
 * Data format options
 */
export type DataFormatType = 'html' | 'json-ld' | 'microdata' | 'api';

/**
 * API schema types
 */
export type SchemaType = 'graphql' | 'rest' | 'rpc';

/**
 * Negotiation protocols
 */
export type NegotiationProtocolType = 'contract-net' | 'auction' | 'direct';

/**
 * Agent capabilities
 */
export interface AgentCapabilities {
  /** Can parse structured data (JSON-LD, microdata) */
  canParseStructuredData: boolean;
  /** Can execute API calls */
  canExecuteAPIs: boolean;
  /** Can negotiate with other agents */
  canNegotiate: boolean;
  /** Supports streaming responses */
  supportsStreaming: boolean;
  /** Maximum parallel requests */
  maxParallelism: number;
}

/**
 * Agent constraints
 */
export interface AgentConstraints {
  /** Request timeout (ms) */
  timeout?: number;
  /** Retry policy */
  retryPolicy?: 'none' | 'exponential' | 'fixed';
  /** Fallback behavior on error */
  fallbackBehavior?: 'error' | 'default' | 'cache';
  /** Maximum retries */
  maxRetries?: number;
  /** Preferred data format */
  preferredFormat?: DataFormatType;
}

/**
 * Intent declaration
 */
export interface IntentDeclaration {
  // Common fields (human + agent)
  /** Unique intent ID */
  id: string;
  /** Goal type */
  goal: GoalType;
  /** Priority level */
  priority: PriorityType;
  /** Context data */
  context: Record<string, any>;
  /** Actor type */
  actorType: ActorType;
  /** Component ID */
  componentId: string;
  /** Timestamp */
  timestamp: number;

  // Agent-specific fields
  /** Agent capabilities (if actor is agent) */
  agentCapabilities?: AgentCapabilities;
  /** Agent constraints (if actor is agent) */
  agentConstraints?: AgentConstraints;
  /** Agent ID (anonymized hash) */
  agentId?: string;
}

/**
 * API surface configuration
 */
export interface APISurface {
  /** Expose API endpoints */
  exposeEndpoints: boolean;
  /** Schema type */
  schemaType: SchemaType;
  /** Support batch requests */
  batchSupport: boolean;
  /** Support streaming */
  streamingSupport: boolean;
  /** API endpoint URL */
  endpoint?: string;
}

/**
 * Negotiation protocol configuration
 */
export interface NegotiationProtocol {
  /** Enable negotiation */
  enabled: boolean;
  /** Protocol type */
  protocol: NegotiationProtocolType;
  /** Maximum negotiation rounds */
  maxRounds: number;
  /** Initial offer */
  initialOffer?: Record<string, any>;
}

/**
 * Intent resolution
 */
export interface IntentResolution {
  // Common fields (human + agent)
  /** Layout density */
  density: DensityType;
  /** Visual emphasis */
  emphasis: EmphasisType;
  /** Animation type */
  animation: AnimationType;
  /** Hierarchy level */
  hierarchy: HierarchyType;
  /** Microcopy tone */
  microcopy?: string;

  // Agent-specific fields
  /** Data format for agents */
  dataFormat?: DataFormatType;
  /** API surface configuration */
  apiSurface?: APISurface;
  /** Negotiation protocol */
  negotiationProtocol?: NegotiationProtocol;
  /** Structured data payload */
  structuredData?: any;
  /** Cache headers */
  cacheHeaders?: {
    maxAge: number;
    etag?: string;
  };
}

/**
 * Intent resolution options
 */
export interface ResolutionOptions {
  /** Include agent-specific fields */
  includeAgentFields: boolean;
  /** Optimize for performance */
  optimizePerformance: boolean;
  /** Enable caching */
  enableCache: boolean;
  /** Debug mode */
  debug: boolean;
}

/**
 * Default resolution options
 */
export const DEFAULT_RESOLUTION_OPTIONS: ResolutionOptions = {
  includeAgentFields: true,
  optimizePerformance: false,
  enableCache: true,
  debug: false,
};

/**
 * Default agent capabilities
 */
export const DEFAULT_AGENT_CAPABILITIES: AgentCapabilities = {
  canParseStructuredData: true,
  canExecuteAPIs: true,
  canNegotiate: false,
  supportsStreaming: false,
  maxParallelism: 1,
};

/**
 * Default agent constraints
 */
export const DEFAULT_AGENT_CONSTRAINTS: AgentConstraints = {
  timeout: 5000, // 5 seconds
  retryPolicy: 'exponential',
  fallbackBehavior: 'cache',
  maxRetries: 3,
  preferredFormat: 'json-ld',
};
