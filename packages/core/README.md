# @fluxxis/core

**FLUXXIS Adaptive Structural Interface Engine**

Framework-agnostic core engine for adaptive interfaces.

---

## Installation

```bash
npm install @fluxxis/core
# or
pnpm add @fluxxis/core
# or
yarn add @fluxxis/core
```

---

## Usage

```typescript
import {
  detectActorType,
  resolveIntent,
  AgentAnalyticsLogger,
  LicenseManager,
  generateStructuredData,
} from '@fluxxis/core';

// Detect if user is human or agent
const detection = detectActorType(signals);

// Resolve intent based on actor type
const resolution = resolveIntent(intent, signals);

// Generate structured data for agents
const structuredData = generateStructuredData({
  format: 'json-ld',
  schemaType: 'Action',
  data: { actionName: 'MyAction' },
});
```

---

## Modules

| Module | Description |
|--------|-------------|
| **Signals** | Agent detection, signal processing |
| **Intents** | Intent declaration, resolution, morphing |
| **Analytics** | Agent analytics, logging, dashboard |
| **Structured Data** | JSON-LD, Microdata, RDFa generation |
| **Licensing** | API keys, license tiers, enforcement |

---

## Performance Budgets

| Metric | Target |
|--------|--------|
| Bundle size | <10KB gzipped |
| Intent resolution | <10ms |
| Agent detection | <5ms |
| License enforcement | <5ms |

---

## License

MIT — See [LICENSE](../../LICENSE) for details.

---

**Documentation:** https://github.com/rafatocantins/fluxxis
