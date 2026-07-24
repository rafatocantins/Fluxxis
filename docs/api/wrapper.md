# API Reference: @fluxxis/wrapper

> Intent schemas, Design System adapters, SmartCTA — the adaptation layer between intent signals and rendered UI.

## Installation

```bash
npm install @fluxxis/wrapper
```

> ⚠️ **Pre-release:** This package has not been published to npm yet. Expected initial release: **v0.1.0**.

## Overview

`@fluxxis/wrapper` is the **adaptation layer** of the FLUXXIS ecosystem. It sits between the core intent engine and concrete design system tokens, translating abstract intent declarations into renderable component tokens. It also provides `SmartCTA`, a higher-level intent-driven CTA component that adapts its appearance based on intent type, emphasis, hierarchy, and animation preferences.

### Architecture

```
IntentSchema (declarative)
    ↓
DSAdapter (token mapping)
    ↓
ResolvedTokens (concrete CSS values)
    ↓
SmartCTA (rendered React component)
```

## Core APIs

### `IntentSchema`

The central data type — a declarative, design-system-agnostic description of what a component should communicate.

```typescript
import type { IntentSchema } from '@fluxxis/wrapper';

const schema: IntentSchema = {
  intent: 'buy',           // 'browse' | 'buy' | 'compare' | 'learn'
  goal: 'convert',         // 'convert' | 'inform' | 'engage'
  priority: 'high',        // 'low' | 'normal' | 'high'
  actor: 'human',          // 'human' | 'agent'
  component: {
    type: 'cta',           // 'cta' | 'card' | 'input' | 'nav'
    copy: {
      primary: 'Buy Now',
      secondary: 'Add to Cart',
      microcopy: 'Free shipping over $50',
    },
    visual: {
      emphasis: 'high',    // 'low' | 'medium' | 'high'
      hierarchy: 'primary',// 'primary' | 'secondary' | 'tertiary'
      animation: 'subtle_pulse', // 'none' | 'subtle_pulse' | 'shimmer' | 'rainbow' | 'blur_fade'
    },
    state: {
      default: 'visible',
      hover: 'elevate+glow',
      active: 'depress',
      focus: 'ring',
      disabled: 'muted',
    },
  },
};
```

#### Sub-types

```typescript
import type {
  IntentType,          // 'browse' | 'buy' | 'compare' | 'learn'
  GoalType,            // 'convert' | 'inform' | 'engage'
  PriorityType,        // 'low' | 'normal' | 'high'
  ActorType,           // 'human' | 'agent'
  EmphasisLevel,       // 'low' | 'medium' | 'high'
  AnimationStyle,      // 'none' | 'subtle_pulse' | 'shimmer' | 'rainbow' | 'blur_fade'
  HierarchyLevel,      // 'primary' | 'secondary' | 'tertiary'
  CopyVariants,
  ComponentState,
  IntentVisual,
  IntentComponent,
} from '@fluxxis/wrapper';
```

### `createIntent()`

Helper function to build an `IntentSchema` with sensible defaults.

```typescript
import { createIntent } from '@fluxxis/wrapper';

const buyIntent = createIntent(
  'buy',           // intent
  'convert',       // goal
  'Buy Now',       // copy text
  'high',          // emphasis (default: 'high')
  'primary',       // hierarchy (default: 'primary')
  'subtle_pulse',  // animation (default: 'subtle_pulse')
);
```

### `DSAdapter` — Token Resolution

The DS Adapter translates an `IntentSchema` into concrete `ResolvedTokens` using a target design system's token dictionary.

```typescript
import { resolveTokens } from '@fluxxis/wrapper';
import { materialTokens } from '@fluxxis/wrapper';
import type { DesignTokens, ResolvedTokens } from '@fluxxis/wrapper';

const schema = createIntent('buy', 'convert', 'Comprar Agora');
const tokens: ResolvedTokens = resolveTokens(schema, materialTokens);

// tokens is now:
// {
//   backgroundColor: '#C84074',
//   textColor: '#FFFFFF',
//   borderRadius: '9999px',
//   padding: '8px 24px',
//   fontFamily: 'Sora, sans-serif',
//   boxShadow: '0 4px 8px 3px rgba(0,0,0,0.15), ...',
//   transition: 'all 250ms cubic-bezier(0.2, 0, 0, 1)',
//   hoverBackgroundColor: 'color-mix(in srgb, #C84074 92%, #FFFFFF)',
//   hoverTransform: 'scale(1.02)',
//   activeTransform: 'scale(0.98)',
//   focusOutline: '2px solid #6D4FE0',
//   disabledOpacity: 0.38,
//   copy: { primary: 'Comprar Agora' },
// }
```

**Mapping rules:**

| Intent Property | Maps to | Behavior |
|----------------|---------|----------|
| `emphasis` | Background/text color | `high` → primary palette, `medium` → secondaryContainer, `low` → surfaceVariant |
| `hierarchy` | Elevation + padding | `primary` → level3 shadow + lg padding, `secondary` → level1 + md, `tertiary` → level0 + sm |
| `animation` | CSS transition + transforms | Determines hover/active scale transforms and duration/easing |
| `state.hover` | Hover background | Color-mix with white overlay |
| `state.active` | Active background | Color-mix with black overlay |
| `state.focus` | Focus outline | Solid primary-color ring |

### `DesignTokens`

The token dictionary shape that a DS Adapter consumes.

```typescript
import type { DesignTokens } from '@fluxxis/wrapper';
import { materialTokens } from '@fluxxis/wrapper';

// materialTokens is a pre-built DesignTokens object aligned with
// the Fluxxis v2.1 canonical palette (WCAG AA verified).
// It includes: palette, typography, spacing, shape, elevation, state, animation.
```

### `SmartCTA` (from wrapper)

A React component that renders a CTA button from an `IntentSchema`, automatically resolving tokens.

```typescript
import { SmartCTA } from '@fluxxis/wrapper';
import type { SmartCTAProps } from '@fluxxis/wrapper';

<SmartCTA
  intent={buyIntent}
  onClick={() => console.log('clicked')}
  disabled={false}
  designTokens={materialTokens}  // optional, defaults to materialTokens
  className="my-custom-class"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `intent` | `IntentSchema` | **required** | The intent declaration |
| `onClick` | `() => void` | `undefined` | Click handler |
| `disabled` | `boolean` | `false` | Disabled state |
| `designTokens` | `DesignTokens` | `materialTokens` | Target design system tokens |
| `className` | `string` | `undefined` | Additional CSS class |

The component manages its own hover/active/focus states with inline styles computed from token resolution.

### Tracking Module

```typescript
import {
  Tracker,
  initTracker,
  getTracker,
  ConsentManager,
  IntentProvider,
  useFluxxisIntent,
  recordSignal,
} from '@fluxxis/wrapper';
import type {
  SignalType,
  SignalPayload,
  TrackerConfig,
  ConsentConfig,
} from '@fluxxis/wrapper';
```

- **`Tracker`** — Client-side signal tracker (singleton via `initTracker` / `getTracker`)
- **`ConsentManager`** — GDPR-compliant consent banner component
- **`IntentProvider`** + **`useFluxxisIntent`** — React context for intent state
- **`recordSignal`** — Fire-and-forget signal recording

## Usage Example

```typescript
import React from 'react';
import {
  SmartCTA,
  createIntent,
  resolveTokens,
  materialTokens,
} from '@fluxxis/wrapper';
import type { IntentSchema, ResolvedTokens } from '@fluxxis/wrapper';

// Define intents
const browseIntent = createIntent('browse', 'inform', 'Explorar');
const buyIntent = createIntent('buy', 'convert', 'Comprar', 'high', 'primary', 'shimmer');
const learnIntent = createIntent('learn', 'inform', 'Documentação', 'medium', 'secondary');

// Inspect resolved tokens
const resolved: ResolvedTokens = resolveTokens(buyIntent, materialTokens);
console.log(resolved.backgroundColor); // '#C84074'

// Render multiple adaptive CTAs
export function ProductPage() {
  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '2rem' }}>
      <SmartCTA intent={browseIntent} onClick={() => {}} />
      <SmartCTA intent={buyIntent} onClick={() => alert('Add to cart!')} />
      <SmartCTA intent={learnIntent} onClick={() => {}} />
    </div>
  );
}
```

## Creating Custom DS Adapters

To support a new design system, implement a `DesignTokens` object and pass it to `resolveTokens()`:

```typescript
import { resolveTokens } from '@fluxxis/wrapper';
import type { DesignTokens } from '@fluxxis/wrapper';

const myDesignTokens: DesignTokens = {
  palette: {
    primary: '#0066FF',
    onPrimary: '#FFFFFF',
    primaryContainer: '#D6E4FF',
    onPrimaryContainer: '#001B4D',
    // ... fill all required palette fields
  },
  typography: {
    fontFamily: 'YourFont, sans-serif',
    display: { size: '36px', weight: '700', lineHeight: '44px' },
    headline: { size: '24px', weight: '600', lineHeight: '32px' },
    title: { size: '16px', weight: '500', lineHeight: '24px' },
    body: { size: '14px', weight: '400', lineHeight: '20px' },
    label: { size: '12px', weight: '500', lineHeight: '16px' },
  },
  // ... spacing, shape, elevation, state, animation
};

const tokens = resolveTokens(myIntent, myDesignTokens);
```

## Related

- [@fluxxis/core](./core.md) — Core engine types and engine
- [@fluxxis/ui](./ui.md) — Design tokens and CSS custom properties
- [Adaptive CTA Engine](./adaptive-cta.md) — Shopify/WooCommerce plugin
