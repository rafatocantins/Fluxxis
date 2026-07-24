# @fluxxis/wrapper

> **Intent-Driven Design System Adaptation Layer** — wraps any component with intent signals and renders with design system tokens.

## What is it?

The `@fluxxis/wrapper` is the core adaptation layer of the Fluxxis ecosystem. It bridges the gap between **intent schemas** (abstract descriptions of user intent) and **design system tokens** (concrete visual properties). It also powers the **SmartCTA** component — adaptive call-to-action buttons driven by intent.

### Key Features

- **Intent Schemas**: Abstract, design-system-agnostic descriptions of component intent (`browse`, `buy`, `compare`, `learn`) with visual directives (emphasis, animation, hierarchy).
- **DS Adapters**: Resolve intent schemas into concrete design tokens (colors, typography, spacing, shadows) for any design system (Material, Tailwind, custom).
- **SmartCTA**: Ready-to-use React component that renders adaptive CTA buttons driven by intent signals.
- **Tracking**: Built-in consent-aware tracking (`Tracker`, `ConsentManager`, `IntentProvider`) for recording intent signals.
- **Zero dependencies on UI frameworks**: Completely design-system agnostic.

## Installation

```bash
npm install @fluxxis/wrapper
# or
pnpm add @fluxxis/wrapper
# or
yarn add @fluxxis/wrapper
```

## Basic Usage

```tsx
import { SmartCTA, createIntent, resolveTokens, materialTokens } from '@fluxxis/wrapper';

// Create an intent — positional API: (intent, goal, copy, emphasis?, hierarchy?, animation?)
const intent = createIntent('buy', 'convert', 'Buy Now', 'high', 'primary', 'shimmer');

// Resolve tokens for Material Design 3
const tokens = resolveTokens(intent, materialTokens);

// Render adaptive CTA
<SmartCTA intent="buy" tokens={materialTokens}>
  Buy Now
</SmartCTA>
```

### Tracking (with consent)

```tsx
import { initTracker, ConsentManager, IntentProvider, useFluxxisIntent, recordSignal } from '@fluxxis/wrapper';

// Initialize tracker
const tracker = initTracker({ endpoint: '/api/signals' });

// Wrap your app with consent and intent providers
<ConsentManager>
  <IntentProvider tracker={tracker}>
    <App />
  </IntentProvider>
</ConsentManager>

// Record signals in your components
recordSignal({ type: 'click', component: 'cta', intent: 'buy' });
```

## API

| Export | Description |
|--------|-------------|
| `SmartCTA` | Adaptive CTA React component driven by intent |
| `createIntent` | Create an intent schema object |
| `resolveTokens` | Resolve intent schema → design tokens |
| `materialTokens` | Material Design 3 token definitions |
| `initTracker` / `getTracker` | Initialize and access the signal tracker |
| `ConsentManager` | GDPR-compliant consent management component |
| `IntentProvider` | React context provider for intent signals |
| `useFluxxisIntent` | React hook for intent context |
| `recordSignal` | Record a user interaction signal |

## Documentation

Full documentation at [fluxxis.dev/docs/wrapper](https://fluxxis.dev/docs/wrapper)

## License

MIT
