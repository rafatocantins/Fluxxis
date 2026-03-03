/**
 * Structured Data Tests
 */

import { describe, it, expect } from 'vitest';
import {
  generateStructuredData,
  generateApiSurface,
  generateDualModeRender,
  convertStructuredData,
  validateStructuredData,
  createStructuredDataScript,
  parseStructuredData,
  type DataFormatType,
} from '../generator';

describe('Structured Data', () => {
  describe('generateStructuredData', () => {
    describe('JSON-LD', () => {
      it('generates valid JSON-LD', () => {
        const result = generateStructuredData({
          format: 'json-ld',
          schemaType: 'Action',
          data: {
            actionName: 'TestAction',
            object: 'TestObject',
          },
          includeContext: true,
          compact: false,
        });

        expect(result.format).toBe('json-ld');
        expect(result.contentType).toBe('application/ld+json');
        expect(result.content).toContain('"@context"');
        expect(result.content).toContain('"@type": "Action"');
        expect(result.content).toContain('"actionName": "TestAction"');
      });

      it('generates compact JSON-LD', () => {
        const result = generateStructuredData({
          format: 'json-ld',
          schemaType: 'Action',
          data: { actionName: 'Test' },
          compact: true,
        });

        expect(result.content).not.toContain('\n');
      });

      it('excludes context when requested', () => {
        const result = generateStructuredData({
          format: 'json-ld',
          schemaType: 'Action',
          data: { actionName: 'Test' },
          includeContext: false,
        });

        expect(result.content).not.toContain('"@context"');
      });
    });

    describe('Microdata', () => {
      it('generates valid microdata', () => {
        const result = generateStructuredData({
          format: 'microdata',
          schemaType: 'Action',
          data: {
            actionName: 'TestAction',
          },
        });

        expect(result.format).toBe('microdata');
        expect(result.contentType).toBe('text/html');
        expect(result.content).toContain('itemscope');
        expect(result.content).toContain('itemtype');
        expect(result.content).toContain('itemprop="actionName"');
      });
    });

    describe('RDFa', () => {
      it('generates valid RDFa', () => {
        const result = generateStructuredData({
          format: 'rdfa',
          schemaType: 'Action',
          data: {
            actionName: 'TestAction',
          },
        });

        expect(result.format).toBe('rdfa');
        expect(result.contentType).toBe('text/html');
        expect(result.content).toContain('vocab=');
        expect(result.content).toContain('property=');
      });
    });

    describe('API', () => {
      it('generates valid API format', () => {
        const result = generateStructuredData({
          format: 'api',
          schemaType: 'Action',
          data: {
            actionName: 'TestAction',
          },
        });

        expect(result.format).toBe('api');
        expect(result.contentType).toBe('application/json');
        expect(result.content).toContain('"schemaType": "Action"');
        expect(result.content).toContain('"timestamp"');
      });
    });

    it('throws error for unsupported format', () => {
      expect(() => {
        generateStructuredData({
          format: 'unsupported' as any,
          schemaType: 'Action',
          data: {},
        });
      }).toThrow('Unsupported format');
    });
  });

  describe('generateApiSurface', () => {
    it('generates API surface definition', () => {
      const endpoints = {
        getAction: {
          url: '/actions/{id}',
          method: 'GET' as const,
          contentType: 'application/json',
          description: 'Get action by ID',
        },
      };

      const surface = generateApiSurface(
        'https://api.example.com',
        endpoints,
        'v1',
        true
      );

      expect(surface.baseUrl).toBe('https://api.example.com');
      expect(surface.version).toBe('v1');
      expect(surface.authRequired).toBe(true);
      expect(surface.endpoints.getAction).toBeDefined();
      expect(surface.rateLimits).toBeDefined();
    });

    it('sets rate limits for authenticated APIs', () => {
      const surface = generateApiSurface(
        'https://api.example.com',
        {},
        'v1',
        true
      );

      expect(surface.rateLimits?.requests).toBe(1000);
      expect(surface.rateLimits?.period).toBe('hour');
    });

    it('sets lower rate limits for public APIs', () => {
      const surface = generateApiSurface(
        'https://api.example.com',
        {},
        'v1',
        false
      );

      expect(surface.rateLimits?.requests).toBe(100);
      expect(surface.rateLimits?.period).toBe('hour');
    });
  });

  describe('generateDualModeRender', () => {
    it('generates dual-mode render with JSON-LD', () => {
      const result = generateDualModeRender(
        '<div>Human Content</div>',
        'Action',
        { actionName: 'Test' },
        'json-ld'
      );

      expect(result.humanView).toContain('Human Content');
      expect(result.humanView).toContain('application/ld+json');
      expect(result.agentView).toContain('"@type": "Action"');
      expect(result.agentFormat).toBe('json-ld');
    });

    it('generates dual-mode render with microdata', () => {
      const result = generateDualModeRender(
        '<div>Human Content</div>',
        'Action',
        { actionName: 'Test' },
        'microdata'
      );

      expect(result.humanView).toContain('itemscope');
      expect(result.humanView).toContain('itemtype');
      expect(result.agentFormat).toBe('microdata');
    });
  });

  describe('convertStructuredData', () => {
    it('converts JSON-LD to microdata', () => {
      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Action',
        actionName: 'TestAction',
      });

      const result = convertStructuredData(
        jsonLd,
        'json-ld',
        'microdata',
        'Action'
      );

      expect(result.format).toBe('microdata');
      expect(result.content).toContain('itemscope');
    });

    it('converts API format to JSON-LD', () => {
      const api = JSON.stringify({
        schemaType: 'Action',
        timestamp: new Date().toISOString(),
        actionName: 'TestAction',
      });

      const result = convertStructuredData(
        api,
        'api',
        'json-ld',
        'Action'
      );

      expect(result.format).toBe('json-ld');
      expect(result.content).toContain('"@type": "Action"');
      expect(result.content).toContain('"actionName": "TestAction"');
    });
  });

  describe('validateStructuredData', () => {
    describe('JSON-LD validation', () => {
      it('validates valid JSON-LD', () => {
        const jsonLd = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Action',
        });

        const result = validateStructuredData(jsonLd, 'json-ld');
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('detects missing @context', () => {
        const jsonLd = JSON.stringify({
          '@type': 'Action',
        });

        const result = validateStructuredData(jsonLd, 'json-ld');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing @context');
      });

      it('detects missing @type', () => {
        const jsonLd = JSON.stringify({
          '@context': 'https://schema.org',
        });

        const result = validateStructuredData(jsonLd, 'json-ld');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing @type');
      });

      it('detects invalid JSON', () => {
        const result = validateStructuredData('invalid json', 'json-ld');
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Parse error');
      });
    });

    describe('Microdata validation', () => {
      it('validates valid microdata', () => {
        const microdata = '<div itemscope itemtype="Action"></div>';

        const result = validateStructuredData(microdata, 'microdata');
        expect(result.valid).toBe(true);
      });

      it('detects missing itemscope', () => {
        const microdata = '<div itemtype="Action"></div>';

        const result = validateStructuredData(microdata, 'microdata');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing itemscope');
      });

      it('detects missing itemtype', () => {
        const microdata = '<div itemscope></div>';

        const result = validateStructuredData(microdata, 'microdata');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing itemtype');
      });
    });

    describe('API validation', () => {
      it('validates valid API format', () => {
        const api = JSON.stringify({
          schemaType: 'Action',
          timestamp: new Date().toISOString(),
        });

        const result = validateStructuredData(api, 'api');
        expect(result.valid).toBe(true);
      });

      it('detects missing schemaType', () => {
        const api = JSON.stringify({
          timestamp: new Date().toISOString(),
        });

        const result = validateStructuredData(api, 'api');
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing schemaType');
      });
    });
  });

  describe('createStructuredDataScript', () => {
    it('creates script tag with JSON-LD', () => {
      const script = createStructuredDataScript('Action', {
        actionName: 'TestAction',
      });

      expect(script).toContain('<script type="application/ld+json">');
      expect(script).toContain('</script>');
      expect(script).toContain('"@type": "Action"');
    });

    it('creates compact script', () => {
      const script = createStructuredDataScript('Action', {
        actionName: 'Test',
      }, true);

      // Script tag has newlines, but JSON should be compact
      expect(script).toContain('{"@context":"https://schema.org","@type":"Action","actionName":"Test"}');
    });
  });

  describe('parseStructuredData', () => {
    it('parses JSON-LD from HTML', () => {
      const html = `
        <html>
          <body>
            <h1>Test</h1>
            <script type="application/ld+json">
              {"@context": "https://schema.org", "@type": "Action", "actionName": "Test"}
            </script>
          </body>
        </html>
      `;

      const results = parseStructuredData(html);
      expect(results).toHaveLength(1);
      expect(results[0].format).toBe('json-ld');
      expect(results[0].schemaType).toBe('Action');
      expect(results[0].data.actionName).toBe('Test');
    });

    it('parses microdata from HTML', () => {
      const html = `
        <html>
          <body>
            <div itemscope itemtype="Action">
              <span itemprop="actionName" content="Test"></span>
            </div>
          </body>
        </html>
      `;

      const results = parseStructuredData(html);
      expect(results).toHaveLength(1);
      expect(results[0].format).toBe('microdata');
      expect(results[0].schemaType).toBe('Action');
      // Note: microdata parsing extracts data differently
      expect(results[0].data).toBeDefined();
    });

    it('parses multiple structured data formats', () => {
      const html = `
        <html>
          <body>
            <script type="application/ld+json">
              {"@context": "https://schema.org", "@type": "Action", "actionName": "Test1"}
            </script>
            <div itemscope itemtype="Action">
              <span itemprop="actionName" content="Test2"></span>
            </div>
          </body>
        </html>
      `;

      const results = parseStructuredData(html);
      expect(results).toHaveLength(2);
      expect(results[0].format).toBe('json-ld');
      expect(results[1].format).toBe('microdata');
    });

    it('returns empty array for no structured data', () => {
      const html = '<html><body>No structured data</body></html>';

      const results = parseStructuredData(html);
      expect(results).toHaveLength(0);
    });
  });
});
