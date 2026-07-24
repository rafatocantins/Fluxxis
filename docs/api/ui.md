# API Reference: @fluxxis/ui

> Component library, design tokens, and theming system for FLUXXIS. WCAG 2.1 AA compliant.

## Installation

```bash
npm install @fluxxis/ui
```

## Overview

`@fluxxis/ui` provides the visual foundation of the FLUXXIS ecosystem: CSS custom properties (design tokens), utility classes, and the canonical color palette. It is framework-agnostic — import the CSS and use the tokens anywhere (React, Vue, plain HTML, etc.).

### Key Features

- **Design tokens** — all tokens under the `--flux-*` namespace
- **Semantic intent colors** — `browse`, `buy`, `compare`, `learn`
- **WCAG 2.1 AA** — every color combination verified ≥4.5:1 contrast
- **Reduced motion** — respects `prefers-reduced-motion: reduce`
- **Responsive** — typography scales down on mobile
- **No-JS fallback** — utility classes work without JavaScript

## Components

The package currently exports the design token version as its primary API:

```typescript
import { FLUXXIS_TOKENS_VERSION } from '@fluxxis/ui';
// "0.2.0"
```

### Importing Tokens

```typescript
// Import CSS custom properties globally
import '@fluxxis/ui/tokens.css';
```

## Design Tokens (`--flux-*`)

All design tokens are defined as CSS custom properties on `:root`, making them available anywhere in the DOM.

### Canonical Palette

| Token | Value | WCAG AA |
|-------|-------|---------|
| `--flux-violet` | `#6D4FE0` | ≥4.5:1 on white |
| `--flux-cyan` | `#1FA89E` | ≥4.5:1 on dark bg |
| `--flux-pink` | `#C84074` | ≥4.5:1 on white |
| `--flux-amber` | `#D4912E` | ≥4.5:1 on dark bg |
| `--flux-teal` | `#1FA89E` | ≥4.5:1 on dark bg |

Each color also has its RGB variant (e.g., `--flux-violet-rgb: 109, 79, 224`) for use with `rgba()`.

### Semantic Intent Tokens

Intent tokens map directly to the four FLUXXIS intents:

| Token | Maps to | Intent |
|-------|---------|--------|
| `--flux-intent-browse` | Teal | Browse |
| `--flux-intent-buy` | Pink | Buy |
| `--flux-intent-compare` | Amber | Compare |
| `--flux-intent-learn` | Violet | Learn |

### Background & Surface

| Token | Value | Usage |
|-------|-------|-------|
| `--flux-bg-primary` | `#08080f` | Page background |
| `--flux-bg-secondary` | `#0d0d1a` | Secondary sections |
| `--flux-bg-card` | `#12122a` | Card surfaces |
| `--flux-bg-card-hover` | `#1a1a3a` | Card hover state |
| `--flux-bg-elevated` | `#1a1a2e` | Elevated surfaces |

### Typography

| Token | Value |
|-------|-------|
| `--flux-font-display` | `'Sora', sans-serif` |
| `--flux-font-body` | `'Inter', sans-serif` |
| `--flux-font-sans` | `'Inter', 'SF Pro Display', ...` |
| `--flux-font-mono` | `'SF Mono', 'Cascadia Code', ...` |

**Typography scale:**

| Token | Size |
|-------|------|
| `--flux-font-size-xs` | `0.75rem` |
| `--flux-font-size-sm` | `0.875rem` |
| `--flux-font-size-base` | `1rem` |
| `--flux-font-size-lg` | `1.125rem` |
| `--flux-font-size-xl` | `1.25rem` |
| `--flux-font-size-2xl` | `1.5rem` |
| `--flux-font-size-3xl` | `2rem` |
| `--flux-font-size-4xl` | `2.75rem` |
| `--flux-font-size-5xl` | `3.5rem` |

Sizes automatically scale down on mobile (≤768px and ≤480px breakpoints).

### Spacing

| Token | Value |
|-------|-------|
| `--flux-space-xs` | `0.25rem` |
| `--flux-space-sm` | `0.5rem` |
| `--flux-space-md` | `1rem` |
| `--flux-space-lg` | `1.5rem` |
| `--flux-space-xl` | `2rem` |
| `--flux-space-2xl` | `3rem` |
| `--flux-space-3xl` | `4rem` |

### Border Radius

| Token | Value |
|-------|-------|
| `--flux-radius-sm` | `6px` |
| `--flux-radius-md` | `10px` |
| `--flux-radius-lg` | `16px` |
| `--flux-radius-xl` | `20px` |
| `--flux-radius-full` | `9999px` |

### Shadows & Elevation

| Token | Value |
|-------|-------|
| `--flux-shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` |
| `--flux-shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), …` |
| `--flux-shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), …` |
| `--flux-shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1), …` |

### Glow Effects

Per-intent glow using RGB tokens:

| Token | Intent |
|-------|--------|
| `--flux-glow-violet` | Learn |
| `--flux-glow-cyan` | Browse |
| `--flux-glow-pink` | Buy |
| `--flux-glow-amber` | Compare |

### Gradients

| Token | Value |
|-------|-------|
| `--flux-gradient-brand` | `linear-gradient(135deg, violet → cyan → pink)` |
| `--flux-gradient-cta` | `linear-gradient(135deg, #5A3FD4, #B82D6A)` |

### Animation & Motion

| Token | Value |
|-------|-------|
| `--flux-morph-duration` | `80ms` |
| `--flux-morph-easing` | `cubic-bezier(0.2, 0, 0, 1.0)` |
| `--flux-duration-fast` | `80ms` |
| `--flux-duration-normal` | `200ms` |
| `--flux-duration-slow` | `300ms` |
| `--flux-easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` |

### State Layers

| Token | Value |
|-------|-------|
| `--flux-state-hover` | `rgba(255,255,255,0.06)` |
| `--flux-state-focus` | `rgba(255,255,255,0.10)` |
| `--flux-state-pressed` | `rgba(255,255,255,0.12)` |
| `--flux-state-disabled` | `rgba(255,255,255,0.04)` |

## Utility Classes

`@fluxxis/ui` ships with framework-agnostic CSS utility classes that work without JavaScript.

### Intent Classes

```html
<span class="flux-intent-browse">Browse</span>
<span class="flux-intent-buy">Buy</span>
<span class="flux-intent-compare">Compare</span>
<span class="flux-intent-learn">Learn</span>
```

Background variants: `flux-bg-browse`, `flux-bg-buy`, `flux-bg-compare`, `flux-bg-learn`.

### Text & Font Classes

```html
<p class="flux-text-primary">Primary text</p>
<p class="flux-text-secondary">Secondary text</p>
<p class="flux-text-muted">Muted text</p>
<h1 class="flux-font-display">Display heading</h1>
<p class="flux-font-body">Body text</p>
<code class="flux-font-mono">Mono code</code>
```

### Card

```html
<div class="flux-card">
  <h2>Card Title</h2>
  <p>Card content with automatic styling.</p>
</div>
```

### Button

```html
<button class="flux-btn flux-btn--primary">Primary CTA</button>
<button class="flux-btn flux-btn--secondary">Secondary</button>
<a href="/buy" class="flux-btn flux-btn--primary">Link Button</a>
```

### Gradient Text

```html
<h1 class="flux-text-gradient">Brand Gradient Heading</h1>
```

## Usage Example

```typescript
// app.tsx
import '@fluxxis/ui/tokens.css';

export function App() {
  return (
    <div style={{
      background: 'var(--flux-bg-primary)',
      color: 'var(--flux-text-primary)',
      fontFamily: 'var(--flux-font-body)',
      minHeight: '100vh',
      padding: 'var(--flux-space-xl)',
    }}>
      <h1 style={{
        fontFamily: 'var(--flux-font-display)',
        fontSize: 'var(--flux-font-size-4xl)',
        background: 'var(--flux-gradient-brand)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        FLUXXIS
      </h1>

      <div className="flux-card" style={{ maxWidth: '400px' }}>
        <h2 style={{ color: 'var(--flux-intent-learn)' }}>Learn</h2>
        <p className="flux-text-secondary">
          Explore our documentation and guides.
        </p>
        <button className="flux-btn flux-btn--primary">
          Get Started
        </button>
      </div>
    </div>
  );
}
```

## Accessibility

- All color combinations maintain ≥4.5:1 contrast ratio (WCAG 2.1 AA)
- `prefers-reduced-motion: reduce` disables all animations and transforms
- `focus-visible` outlines on interactive elements
- Font sizes scale down responsively for mobile viewports

## Related

- [@fluxxis/core](./core.md) — Core engine
- [@fluxxis/react](./react.md) — React adapter with hooks and components
- [@fluxxis/wrapper](./wrapper.md) — Intent schema and DS adapters
