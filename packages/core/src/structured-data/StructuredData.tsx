/**
 * StructuredData React Component
 * 
 * Renders dual-mode content (human + agent views)
 */

import React from 'react';
import { generateDualModeRender, createStructuredDataScript } from './generator';
import type { DataFormatType } from './types';

/**
 * StructuredData component props
 */
export interface StructuredDataProps {
  /** Schema.org type */
  schemaType: string;
  /** Schema data */
  data: Record<string, any>;
  /** Agent data format */
  agentFormat?: DataFormatType;
  /** Human content (children) */
  children?: React.ReactNode;
  /** Inline script (for JSON-LD) */
  inlineScript?: boolean;
  /** Compact JSON output */
  compact?: boolean;
}

/**
 * StructuredData Component
 */
export const StructuredData: React.FC<StructuredDataProps> = ({
  schemaType,
  data,
  agentFormat = 'json-ld',
  children,
  inlineScript = true,
  compact = false,
}) => {
  // Generate dual-mode render
  const render = generateDualModeRender(
    children ? React.createElement('div', { children }).props.children as string : '',
    schemaType,
    data,
    agentFormat
  );

  // Render based on format
  if (agentFormat === 'json-ld' && inlineScript) {
    // JSON-LD in script tag
    const scriptContent = createStructuredDataScript(schemaType, data, compact);
    
    return (
      <>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: scriptContent.replace(/<script type="application\/ld\+json">|<\/script>/g, '') }}
        />
      </>
    );
  }

  // Microdata or RDFa (wraps content)
  return (
    <div
      dangerouslySetInnerHTML={{ __html: render.humanView }}
    />
  );
};

/**
 * JsonLdScript component (JSON-LD only)
 */
export const JsonLdScript: React.FC<{
  schemaType: string;
  data: Record<string, any>;
  compact?: boolean;
}> = ({ schemaType, data, compact = false }) => {
  const scriptContent = createStructuredDataScript(schemaType, data, compact);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: scriptContent.replace(/<script type="application\/ld\+json">|<\/script>/g, '') }}
    />
  );
};

export default StructuredData;
