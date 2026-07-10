# API Reference: @fluxxis/core

> Framework-agnostic core engine. No UI dependencies. Works with any framework.

## Installation

```bash
npm install @fluxxis/core
```

## Core Types

All core types are exported from `@fluxxis/core`.

### `GoalType`

```typescript
import type { GoalType } from '@fluxxis/core';
// 'convert' | 'inform' | 'engage'
```

The three fundamental goals a component can declare:

| Goal | Meaning |
|------|---------|
| `'convert'` | Drive a conversion action (buy, sign up, subscribe) |
| `'inform'` | Convey information clearly (features, docs, pricing) |
| `'engage'` | Encourage interaction (share, explore, play) |

### `PriorityType`

```typescript
import type { PriorityType } from '@fluxxis/core';
// 'low' | 'normal' | 'high'
```

### `ActorType`

```typescript
import type { ActorType } from '@fluxxis/core';
// 'human' | 'agent' | 'unknown'
```

Determines how the intent engine resolves behavior. Humans get visual emphasis and microcopy; agents get structured data and API surfaces.

### `Signal`

```typescript
import type { Signal } from '@fluxxis/core';

interface Signal {
  type: SignalType;           // 'hover' | 'click' | 'scroll' | 'dwell' | 'viewport' | 'focus' | 'blur' | 'api-call'
  value: number;
  timestamp: number;
  actorType?: ActorType;
  detectionConfidence?: number;
  context?: SignalContext;
  sessionId?: string;
  intent?: {
    goal: GoalType;
    priority: PriorityType;
  };
}
```

### `SignalContext`

```typescript
import type { SignalContext } from '@fluxxis/core';

interface SignalContext {
  componentId?: string;
  page?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  userType?: 'new' | 'returning' | 'power';
  position?: { x: number; y: number };
  scrollVelocity?: number;
  scrollDepth?: number;       // 0–100%
  endpoint?: string;
  source?: 'ui' | 'api' | 'system';
  [key: string]: any;
}
```

---

## Intent Resolution

The intent module is the heart of FLUXXIS. Components declare intents; the engine resolves how they should behave.

### `IntentDeclaration`

```typescript
import type { IntentDeclaration } from '@fluxxis/core';

interface IntentDeclaration {
  componentId: string;
  goal: GoalType;
  priority: PriorityType;
  timestamp: number;
  actorType: 'human' | 'agent' | 'unknown';
  context?: Record<string, any>;
  agentCapabilities?: AgentCapabilities;
  agentConstraints?: AgentConstraints;
}
```

### `AgentCapabilities`

```typescript
import type { AgentCapabilities } from '@fluxxis/core';

interface AgentCapabilities {
  canParseStructuredData: boolean;
  canExecuteAPIs: boolean;
  canNegotiate: boolean;
  maxParallelism: number;
  supportsStreaming: boolean;
}
```

### `AgentConstraints`

```typescript
import type { AgentConstraints } from '@fluxxis/core';

interface AgentConstraints {
  timeout: number;
  maxRetries: number;
  preferredFormat?: DataFormatType;
}
```

### `IntentResolution`

This is the key return type — what the engine produces after resolving an intent:

```typescript
import type { IntentResolution } from '@fluxxis/core';

interface IntentResolution {
  /** Layout density */
  density: 'compact' | 'normal' | 'spacious';

  /** Visual emphasis level */
  emphasis: 'subtle' | 'normal' | 'strong';

  /** Animation type */
  animation: 'none' | 'subtle' | 'playful' | 'urgent';

  /** Visual hierarchy */
  hierarchy: 'de-emphasized' | 'normal' | 'focused';

  /** AI-generated microcopy (human actors only) */
  microcopy?: string;

  /** Data format preference (agent actors) */
  dataFormat?: 'json-ld' | 'microdata' | 'rdfa' | 'api' | 'html';

  /** API surface for agent consumers */
  apiSurface?: {
    exposeEndpoints: boolean;
    schemaType: 'rest' | 'graphql';
    batchSupport: boolean;
    streamingSupport: boolean;
    endpoint: string;
  };

  /** Multi-agent negotiation protocol */
  negotiationProtocol?: {
    enabled: boolean;
    protocol: 'contract-net' | 'paxos' | 'raft';
    maxRounds: number;
    initialOffer: Record<string, any>;
  };

  /** Structured data payload (JSON-LD, Microdata, etc.) */
  structuredData?: any;

  /** HTTP caching headers for agent consumers */
  cacheHeaders?: {
    maxAge: number;
    etag: string;
  };
}
```

### Resolution Functions

```typescript
import { resolveIntent, resolveHumanIntent, resolveAgentIntent, resolveIntents } from '@fluxxis/core';

// Resolve a single intent (routes by actorType)
const resolution = resolveIntent(declaration, signals, options);

// Resolve only as human
const humanRes = resolveHumanIntent(declaration, signals, options);

// Resolve only as agent
const agentRes = resolveAgentIntent(declaration, signals, options);

// Batch resolve
const resolutions = resolveIntents(declarations, signalsArray, options);
```

### `IntentResolver` Class

A stateful resolver with built-in caching:

```typescript
import { IntentResolver, DEFAULT_RESOLUTION_OPTIONS } from '@fluxxis/core';

const resolver = new IntentResolver(
  DEFAULT_RESOLUTION_OPTIONS,
  300000 // cache TTL in ms (default: 5 min)
);

// Resolve with caching
const resolution = resolver.resolve(declaration, signals);

// Clear cache (all or by component ID)
resolver.clearCache();                   // clear all
resolver.clearCache('component-123');    // clear specific component

// Cache statistics
const stats = resolver.getCacheStats();  // { size, hits, misses }
```

### `ResolutionOptions`

```typescript
import type { ResolutionOptions } from '@fluxxis/core';
// Also available: DEFAULT_RESOLUTION_OPTIONS, DEFAULT_AGENT_CAPABILITIES, DEFAULT_AGENT_CONSTRAINTS

interface ResolutionOptions {
  includeAgentFields?: boolean;  // default: true
  strictMode?: boolean;          // default: false
  cacheResults?: boolean;        // default: true
}
```

---

## Event Bus

A pub/sub event system for cross-component communication:

```typescript
import { EventBus, eventBus } from '@fluxxis/core';

// Subscribe
const subscription = eventBus.subscribe('NODE_REGISTER', (payload) => {
  console.log('Node registered:', payload);
});

// Publish
await eventBus.publish('NODE_REGISTER', { node: myNode }, 'MyComponent');

// Unsubscribe
subscription.unsubscribe();
```

**Exported:** `EventBus` (class), `eventBus` (singleton instance), `EventType`, `Event`, `EventPayloads`, `EventHandler`, `EventSubscription`.

---

## Node Registry

Tracks all adaptive components in the page:

```typescript
import { NodeRegistry, nodeRegistry } from '@fluxxis/core';

// Register a component node
const node = nodeRegistry.register({
  id: 'my-cta-1',
  goal: 'convert',
  pageContext: 'pricing',
  brandVoice: { tone: 'confident-but-warm', audience: ['founders'], ctaStyle: 'direct' },
  sectionId: 'pricing-section',
});

// Update metrics
nodeRegistry.updateMetrics('my-cta-1', {
  interactions: 5,
  lastInteraction: Date.now(),
  avgDwellTime: 2300,
});

// Deregister on unmount
nodeRegistry.deregister('my-cta-1', 'Component unmounted');
```

**Exported:** `NodeRegistry` (class), `nodeRegistry` (singleton), `NodeContract`, `NodeMetrics`.

---

## Design Tokens

Goal-driven CSS variables and animation tokens:

```typescript
import {
  getIntentTokens,
  getIntentCSSVariables,
  getIntentAnimation,
  getShadowCSS,
  INTENT_TOKENS,
} from '@fluxxis/core';

// Get design tokens for a goal
const tokens = getIntentTokens('convert');
// { animation: string, borderRadius: string, shadow: string, ... }

// Get CSS custom properties
const cssVars = getIntentCSSVariables('convert');
// { '--intent-color': '#...', '--intent-animation': '...', ... }

// Apply tokens to a DOM element
import { applyIntentTokens } from '@fluxxis/core';
applyIntentTokens(element, 'convert');
```

**Exported:** `INTENT_TOKENS`, `EMPHASIS_MODIFIERS`, `ANIMATION_KEYFRAMES`, `getIntentTokens`, `getIntentCSSVariables`, `getIntentAnimation`, `getShadowCSS`, `generateIntentStylesheet`, `injectIntentStyles`, `applyIntentTokens`, `IntentTokens`, `EmphasisLevel`.

---

## API Layer (Copy Generation)

LLM-powered copy generation with privacy-first design:

```typescript
import {
  generateCopy,
  clearCopyCache,
  PrivacyFilter,
  filterPII,
} from '@fluxxis/core';

// Generate copy
const response = await generateCopy(
  {
    goal: 'convert',
    pageContext: 'pricing',
    brandVoice: { tone: 'confident-but-warm', audience: ['founders'], ctaStyle: 'direct' },
    defaultCopy: 'Get Started',
    componentType: 'button',
  },
  {
    provider: 'groq',
    apiKey: 'gsk_...',
    model: 'llama-3.3-70b-versatile',
    enableCache: true,
  }
);

// response.selected → the generated copy text
// response.fallback → true if fallback copy was used

// Clear the copy cache
clearCopyCache();
```

**Exported:** `generateCopy`, `clearCopyCache`, `PrivacyFilter`, `filterPII`, `validateNoPII`, `createCTAPrompt`, `createHeadlinePrompt`, `createMicrocopyPrompt`, `COPY_GENERATION_SYSTEM_PROMPT`, `API_BASE_URL`, `ApiResponse<T>`, `handleApiError`.

---

## Brand Voice

```typescript
import {
  validateBrandVoice,
  mergeBrandVoiceConfig,
  BRAND_VOICE_PRESETS,
  TONE_PRESETS,
  AUDIENCE_PRESETS,
  getBrandVoicePreset,
  getTonePreset,
  getAudiencePreset,
  createBrandVoice,
  DEFAULT_BRAND_VOICE,
} from '@fluxxis/core';

// Use a preset
const voice = createBrandVoice('startup');
// Or get specific presets
const tone = getTonePreset('confident-but-warm');
const audience = getAudiencePreset('founders');
```

---

## Utilities

```typescript
import { goalValidator } from '@fluxxis/core';

// Validate component goals
const { isValid, errors } = goalValidator.validate({ goal: 'convert', pageContext: 'pricing' });
```

---

## Signals (Agent Detection)

```typescript
import { detectAgent, isAgentRequest } from '@fluxxis/core';
// Re-exported from './signals/agentDetection'
```

---

## Structured Data

```typescript
import { generateStructuredData, StructuredDataGenerator } from '@fluxxis/core';
// Generate JSON-LD, Microdata, or API-format payloads for agent consumers
```
