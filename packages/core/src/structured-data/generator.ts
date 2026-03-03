/**
 * Structured Data Generator
 * 
 * Generates structured data in multiple formats for agent consumption
 */

import type {
  StructuredDataOptions,
  StructuredDataResult,
  DataFormatType,
  JsonLdDocument,
  MicrodataAttributes,
  ApiSurface,
  ApiEndpoint,
  DualModeRenderResult,
} from './types';
import { DEFAULT_SCHEMA_CONTEXT, SCHEMA_CONTEXTS } from './types';

/**
 * Generate structured data in specified format
 */
export function generateStructuredData(options: StructuredDataOptions): StructuredDataResult {
  const { format, schemaType, data, includeContext = true, compact = false } = options;

  switch (format) {
    case 'json-ld':
      return generateJsonLd(schemaType, data, includeContext, compact);
    case 'microdata':
      return generateMicrodata(schemaType, data);
    case 'rdfa':
      return generateRdfa(schemaType, data);
    case 'api':
      return generateApi(schemaType, data);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Generate JSON-LD structured data
 */
function generateJsonLd(
  schemaType: string,
  data: Record<string, any>,
  includeContext: boolean,
  compact: boolean
): StructuredDataResult {
  const document: JsonLdDocument = {
    '@context': includeContext ? DEFAULT_SCHEMA_CONTEXT : '',
    '@type': schemaType,
    ...data,
  };

  // Remove undefined and empty properties
  Object.keys(document).forEach(key => {
    if (document[key] === undefined || document[key] === '') {
      delete document[key];
    }
  });

  const content = compact
    ? JSON.stringify(document)
    : JSON.stringify(document, null, 2);

  return {
    format: 'json-ld',
    content,
    contentType: 'application/ld+json',
    schemaType,
  };
}

/**
 * Generate microdata structured data
 */
function generateMicrodata(schemaType: string, data: Record<string, any>): StructuredDataResult {
  const attrs: MicrodataAttributes = {
    itemscope: true,
    itemtype: SCHEMA_CONTEXTS[schemaType] || schemaType,
  };

  // Generate HTML attributes
  const attrString = Object.entries(attrs)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : '';
      }
      return `${key}="${value}"`;
    })
    .filter(Boolean)
    .join(' ');

  // Generate itemprop attributes for data
  const propsString = Object.entries(data)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `itemprop="${key}" content="${escapeHtml(String(value))}"`)
    .join(' ');

  const content = `<div ${attrString} ${propsString}></div>`;

  return {
    format: 'microdata',
    content,
    contentType: 'text/html',
    schemaType,
  };
}

/**
 * Generate RDFa structured data
 */
function generateRdfa(schemaType: string, data: Record<string, any>): StructuredDataResult {
  const vocab = SCHEMA_CONTEXTS[schemaType] || schemaType;

  // Generate RDFa attributes
  const attrs = Object.entries(data)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `property="${vocab}/${key}" content="${escapeHtml(String(value))}"`)
    .join(' ');

  const content = `<div vocab="${vocab}" typeof="${schemaType}" ${attrs}></div>`;

  return {
    format: 'rdfa',
    content,
    contentType: 'text/html',
    schemaType,
  };
}

/**
 * Generate API structured data
 */
function generateApi(schemaType: string, data: Record<string, any>): StructuredDataResult {
  const content = JSON.stringify({
    schemaType,
    timestamp: new Date().toISOString(),
    ...data,
  }, null, 2);

  return {
    format: 'api',
    content,
    contentType: 'application/json',
    schemaType,
  };
}

/**
 * Generate API surface definition
 */
export function generateApiSurface(
  baseUrl: string,
  endpoints: Record<string, ApiEndpoint>,
  version: string = 'v1',
  authRequired: boolean = false
): ApiSurface {
  return {
    baseUrl,
    version,
    endpoints,
    authRequired,
    rateLimits: authRequired ? {
      requests: 1000,
      period: 'hour',
    } : {
      requests: 100,
      period: 'hour',
    },
  };
}

/**
 * Generate dual-mode render (human + agent)
 */
export function generateDualModeRender(
  humanContent: string,
  schemaType: string,
  data: Record<string, any>,
  agentFormat: DataFormatType = 'json-ld'
): DualModeRenderResult {
  // Generate agent view
  const agentResult = generateStructuredData({
    format: agentFormat,
    schemaType,
    data,
    includeContext: true,
    compact: false,
  });

  // Wrap human content with structured data
  let humanView = '';

  if (agentFormat === 'json-ld') {
    // JSON-LD goes in script tag
    humanView = `
      ${humanContent}
      <script type="application/ld+json">
        ${agentResult.content}
      </script>
    `;
  } else {
    // Microdata/RDFa wraps the content
    humanView = `
      <div itemscope itemtype="${SCHEMA_CONTEXTS[schemaType] || schemaType}">
        ${humanContent}
        ${agentResult.content.replace('<div', '<span').replace('</div>', '</span>')}
      </div>
    `;
  }

  return {
    humanView: humanView.trim(),
    agentView: agentResult.content,
    agentFormat,
  };
}

/**
 * Convert structured data between formats
 */
export function convertStructuredData(
  content: string,
  fromFormat: DataFormatType,
  toFormat: DataFormatType,
  schemaType: string
): StructuredDataResult {
  // Parse input format to extract data
  let data: Record<string, any>;

  switch (fromFormat) {
    case 'json-ld':
      const jsonLd = JSON.parse(content) as JsonLdDocument;
      data = Object.fromEntries(
        Object.entries(jsonLd).filter(([key]) => !key.startsWith('@'))
      );
      break;

    case 'microdata':
    case 'rdfa':
    case 'api':
      // For simplicity, assume API format as intermediate
      const api = JSON.parse(content);
      data = Object.fromEntries(
        Object.entries(api).filter(([key]) => key !== 'schemaType' && key !== 'timestamp')
      );
      break;

    default:
      throw new Error(`Unsupported format: ${fromFormat}`);
  }

  // Convert to target format
  return generateStructuredData({
    format: toFormat,
    schemaType,
    data,
    includeContext: true,
    compact: false,
  });
}

/**
 * Validate structured data
 */
export function validateStructuredData(
  content: string,
  format: DataFormatType
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    switch (format) {
      case 'json-ld':
        // Validate JSON
        JSON.parse(content);

        // Check for @context
        if (!content.includes('"@context"')) {
          errors.push('Missing @context');
        }

        // Check for @type
        if (!content.includes('"@type"')) {
          errors.push('Missing @type');
        }
        break;

      case 'microdata':
        // Check for itemscope
        if (!content.includes('itemscope')) {
          errors.push('Missing itemscope');
        }

        // Check for itemtype
        if (!content.includes('itemtype')) {
          errors.push('Missing itemtype');
        }
        break;

      case 'rdfa':
        // Check for vocab or prefix
        if (!content.includes('vocab') && !content.includes('prefix')) {
          errors.push('Missing vocab or prefix');
        }

        // Check for typeof or property
        if (!content.includes('typeof') && !content.includes('property')) {
          errors.push('Missing typeof or property');
        }
        break;

      case 'api':
        // Validate JSON
        JSON.parse(content);

        // Check for schemaType
        if (!content.includes('"schemaType"')) {
          errors.push('Missing schemaType');
        }
        break;

      default:
        errors.push(`Unknown format: ${format}`);
    }
  } catch (error) {
    errors.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (m) => map[m] ?? m);
}

/**
 * Create structured data script tag
 */
export function createStructuredDataScript(
  schemaType: string,
  data: Record<string, any>,
  compact: boolean = false
): string {
  const result = generateStructuredData({
    format: 'json-ld',
    schemaType,
    data,
    includeContext: true,
    compact,
  });

  return `<script type="application/ld+json">\n${result.content}\n</script>`;
}

/**
 * Parse structured data from HTML
 */
export function parseStructuredData(html: string): Array<{
  format: DataFormatType;
  schemaType: string;
  data: Record<string, any>;
}> {
  const results: Array<{
    format: DataFormatType;
    schemaType: string;
    data: Record<string, any>;
  }> = [];

  // Parse JSON-LD
  const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    const content = match[1];
    if (!content) continue;

    try {
      const data = JSON.parse(content);
      results.push({
        format: 'json-ld',
        schemaType: data['@type'] || 'Thing',
        data: Object.fromEntries(
          Object.entries(data).filter(([key]) => !key.startsWith('@'))
        ),
      });
    } catch (error) {
      // Skip invalid JSON
    }
  }

  // Parse microdata
  const microdataRegex = /<[^>]*itemscope[^>]*itemtype="([^"]*)"[^>]*>/g;

  while ((match = microdataRegex.exec(html)) !== null) {
    const schemaType = match[1] ?? 'Thing';
    const itempropRegex = /itemprop="([^"]*)"\s+content="([^"]*)"/g;
    const data: Record<string, any> = {};

    let propMatch;
    const itemHtml = match[0];
    if (!itemHtml) continue;

    while ((propMatch = itempropRegex.exec(itemHtml)) !== null) {
      const key = propMatch[1];
      const value = propMatch[2];
      if (key && value) {
        data[key] = value;
      }
    }

    results.push({
      format: 'microdata',
      schemaType,
      data,
    });
  }

  return results;
}
