/**
 * Structured Data Types
 * 
 * Defines structured data formats for agent consumption
 */

/**
 * Data format types
 */
export type DataFormatType = 'json-ld' | 'microdata' | 'rdfa' | 'api';

/**
 * Schema.org thing type
 */
export interface SchemaThing {
  '@context'?: string;
  '@type'?: string;
  [key: string]: any;
}

/**
 * Schema.org Action
 */
export interface SchemaAction extends SchemaThing {
  '@type': 'Action';
  actionName?: string;
  object?: string;
  target?: SchemaActionTarget;
  result?: SchemaThing;
  error?: SchemaError;
  startTime?: string;
  endTime?: string;
}

/**
 * Schema.org Action Target
 */
export interface SchemaActionTarget {
  '@type': 'EntryPoint';
  url?: string;
  actionPlatform?: string;
  httpMethod?: string;
  contentType?: string;
}

/**
 * Schema.org Error
 */
export interface SchemaError {
  '@type': 'Thing';
  name?: string;
  description?: string;
}

/**
 * JSON-LD document
 */
export interface JsonLdDocument {
  '@context': string;
  '@graph'?: SchemaThing[];
  [key: string]: any;
}

/**
 * Microdata attributes
 */
export interface MicrodataAttributes {
  itemscope?: boolean;
  itemtype?: string;
  itemid?: string;
  itemprop?: string;
  itemref?: string;
}

/**
 * Structured data options
 */
export interface StructuredDataOptions {
  /** Data format */
  format: DataFormatType;
  /** Schema type */
  schemaType: string;
  /** Data payload */
  data: Record<string, any>;
  /** Include @context */
  includeContext?: boolean;
  /** Compact output */
  compact?: boolean;
}

/**
 * Structured data result
 */
export interface StructuredDataResult {
  /** Format type */
  format: DataFormatType;
  /** Generated structured data */
  content: string;
  /** Content type */
  contentType: string;
  /** Schema type */
  schemaType: string;
}

/**
 * API endpoint definition
 */
export interface ApiEndpoint {
  /** Endpoint URL */
  url: string;
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Content type */
  contentType: string;
  /** Response schema */
  responseSchema?: Record<string, any>;
  /** Request schema */
  requestSchema?: Record<string, any>;
  /** Description */
  description?: string;
}

/**
 * API surface definition
 */
export interface ApiSurface {
  /** Base URL */
  baseUrl: string;
  /** API version */
  version: string;
  /** Available endpoints */
  endpoints: Record<string, ApiEndpoint>;
  /** Authentication required */
  authRequired: boolean;
  /** Rate limits */
  rateLimits?: {
    requests: number;
    period: 'second' | 'minute' | 'hour' | 'day';
  };
}

/**
 * Dual-mode render result
 */
export interface DualModeRenderResult {
  /** Human view (HTML) */
  humanView: string;
  /** Agent view (structured data) */
  agentView: string;
  /** Format used for agent view */
  agentFormat: DataFormatType;
}

/**
 * Schema.org context URLs
 */
export const SCHEMA_CONTEXTS: Record<string, string> = {
  default: 'https://schema.org',
  action: 'https://schema.org/Action',
  thing: 'https://schema.org/Thing',
  creativeWork: 'https://schema.org/CreativeWork',
  organization: 'https://schema.org/Organization',
  person: 'https://schema.org/Person',
  event: 'https://schema.org/Event',
  product: 'https://schema.org/Product',
  offer: 'https://schema.org/Offer',
};

/**
 * Default schema.org context
 */
export const DEFAULT_SCHEMA_CONTEXT = SCHEMA_CONTEXTS.default;
