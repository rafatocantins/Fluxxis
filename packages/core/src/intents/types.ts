/**
 * Intent Module Types
 */

import type { GoalType, PriorityType, DataFormatType } from '../types';

/**
 * Intent mapping for structural adaptations
 */
export interface IntentMatch {
  goal: GoalType;
  confidence: number;
  priority: PriorityType;
  metadata?: Record<string, any>;
}

/**
 * Intent resolution result
 */
export interface IntentResolution {
  density: 'compact' | 'normal' | 'spacious';
  emphasis: 'subtle' | 'normal' | 'strong';
  animation: 'none' | 'subtle' | 'playful' | 'urgent';
  hierarchy: 'de-emphasized' | 'normal' | 'focused';
  microcopy?: string;
  dataFormat?: DataFormatType;
  apiSurface?: {
    exposeEndpoints: boolean;
    schemaType: 'rest' | 'graphql';
    batchSupport: boolean;
    streamingSupport: boolean;
    endpoint: string;
  };
  negotiationProtocol?: {
    enabled: boolean;
    protocol: 'contract-net' | 'paxos' | 'raft';
    maxRounds: number;
    initialOffer: Record<string, any>;
  };
  structuredData?: any;
  cacheHeaders?: {
    maxAge: number;
    etag: string;
  };
}

/**
 * Intent declaration contract
 */
export interface IntentDeclaration {
  componentId: string;
  goal: GoalType;
  priority: PriorityType;
  timestamp: number;
  actorType: 'human' | 'agent' | 'unknown';
  context?: Record<string, any>;
  agentCapabilities?: AgentCapabilities;
  agentConstraints?: AgentConstraints;
}

/**
 * Agent capabilities for resolution tuning
 */
export interface AgentCapabilities {
  canParseStructuredData: boolean;
  canExecuteAPIs: boolean;
  canNegotiate: boolean;
  maxParallelism: number;
  supportsStreaming: boolean;
}

/**
 * Agent constraints for resolution tuning
 */
export interface AgentConstraints {
  timeout: number;
  maxRetries: number;
  preferredFormat?: DataFormatType;
}

/**
 * Resolution options
 */
export interface ResolutionOptions {
  includeAgentFields?: boolean;
  strictMode?: boolean;
  cacheResults?: boolean;
}

/**
 * Default resolution constants
 */
export const DEFAULT_RESOLUTION_OPTIONS: ResolutionOptions = {
  includeAgentFields: true,
  strictMode: false,
  cacheResults: true,
};

export const DEFAULT_AGENT_CAPABILITIES: AgentCapabilities = {
  canParseStructuredData: true,
  canExecuteAPIs: false,
  canNegotiate: false,
  maxParallelism: 1,
  supportsStreaming: false,
};

export const DEFAULT_AGENT_CONSTRAINTS: AgentConstraints = {
  timeout: 5000,
  maxRetries: 3,
};
