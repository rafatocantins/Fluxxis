# API Reference: Adaptive CTA Engine

> Shopify / WooCommerce adaptive call-to-action plugin. Intent-driven, WCAG 2.1 AA compliant, analytics-ready.

## Overview

The Adaptive CTA Engine (`@fluxxis/adaptive-cta`) is a standalone, monetizable e-commerce plugin that renders intent-driven call-to-action buttons for Shopify and WooCommerce storefronts. It detects user intent (browse, buy, compare, learn) and dynamically adapts button text, color, icon, and subtext to maximize conversion.

### Key Features

- **4 intent-driven variants** — browse, buy, compare, learn
- **Shopify Polaris & WooCommerce Storefront** adapters
- **Built-in analytics** — impression, click, and conversion tracking
- **WCAG 2.1 AA** — all color combinations ≥4.5:1 contrast
- **`<noscript>` fallback** — works without JavaScript
- **Responsive** — full-width on mobile
- **Reduced motion support**

## Installation

```bash
npm install @fluxxis/adaptive-cta
```

Or use it as a script tag for Shopify:

```html
<script src="https://cdn.flxxis.dev/adaptive-cta@0.1.0/umd.js"></script>
```

## Quick Start

```typescript
import { SmartCTA } from '@fluxxis/adaptive-cta';

function ProductPage() {
  return (
    <div>
      <h1>Widget Pro</h1>
      <p>€29.99</p>
      <SmartCTA
        intent="buy"
        productId="sku-123"
        productName="Widget Pro"
        price={29.99}
        onCTAClick={(intent) => console.log('CTA clicked:', intent)}
      />
    </div>
  );
}
```

## SmartCTA Component

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `intent` | `'browse' \| 'buy' \| 'compare' \| 'learn'` | **required** | Detected user intent |
| `productId` | `string` | `undefined` | Product identifier for analytics |
| `productName` | `string` | `undefined` | Product name for dynamic text |
| `price` | `number` | `undefined` | Price for buy intent text interpolation |
| `currency` | `string` | `'€'` | ISO 4217 currency code |
| `onCTAClick` | `(intent: Intent) => void` | `undefined` | Click callback |
| `variant` | `'primary' \| 'secondary' \| 'inline'` | `'primary'` | Visual style |
| `className` | `string` | `undefined` | Additional CSS classes |

### Variants

| Variant | Appearance | Use case |
|---------|-----------|----------|
| `primary` | Filled background with glow shadow | Main CTA, hero section |
| `secondary` | Transparent with colored border | Secondary action, card footer |
| `inline` | Transparent, no shadow, compact padding | Inline link, nav item |

### Intent → CTA Mapping

| Intent | Text | Icon | Color | Text Color |
|--------|------|------|-------|------------|
| `browse` | Explorar Produtos | 🔍 | `#1FA89E` (teal) | `#0a0a1a` |
| `buy` | Comprar Agora — €XX.XX | 🛒 | `#C84074` (pink) | `#ffffff` |
| `compare` | Comparar Modelos | ⚖️ | `#D4912E` (amber) | `#0a0a1a` |
| `learn` | Saber Mais | 📚 | `#6D4FE0` (violet) | `#ffffff` |

When `price` is provided for `buy` intent, the text automatically interpolates: **"Comprar Agora — 29,99 €"**.

## Intent Resolution

### `resolveCTA()`

Resolves an intent + optional price to a `CTAVariant` with text, color, icon, and subtext.

```typescript
import { resolveCTA } from '@fluxxis/adaptive-cta';

const variant = resolveCTA('buy', 49.99, '€');
// {
//   text: 'Comprar Agora — 49,99 €',
//   color: '#C84074',
//   textColor: '#ffffff',
//   icon: '🛒',
//   subtext: 'Frete Grátis',
// }
```

### `detectIntentFromURL()`

Heuristic intent detection from URL pathname (useful for static pages without behavioral signals).

```typescript
import { detectIntentFromURL } from '@fluxxis/adaptive-cta';

detectIntentFromURL('/products/shoes');   // 'browse'
detectIntentFromURL('/cart');             // 'buy'
detectIntentFromURL('/compare');          // 'compare'
detectIntentFromURL('/blog/getting-started'); // 'learn'
```

**Detection rules (priority order):**

| URL Pattern | Intent |
|-------------|--------|
| `/cart`, `/checkout`, `/carrinho`, `/finalizar` | `buy` |
| `/compare`, `/comparar` | `compare` |
| `/blog`, `/guides`, `/learn`, `/guia`, `/aprender` | `learn` |
| `/product`, `/products`, `/produto`, `/produtos` | `browse` |
| Fallback | `browse` |

### `CTA_MAP`

Predefined CTA variants for all four intents. Useful for building custom UIs.

```typescript
import { CTA_MAP, ALL_INTENTS } from '@fluxxis/adaptive-cta';

ALL_INTENTS.forEach((intent) => {
  console.log(intent, CTA_MAP[intent].text);
});
```

## Design System Adapters

The package ships with three DS adapters for multi-platform rendering.

```typescript
import {
  getAdapter,
  FluxxisAdapter,
  ShopifyPolarisAdapter,
  WooCommerceAdapter,
} from '@fluxxis/adaptive-cta';

// Get the Shopify adapter
const adapter = getAdapter('shopify');

// Resolve CSS classes for a buy intent button
const classes = adapter.resolveClass('buy', 'primary');
// 'Polaris-Button flux-cta Polaris-Button--primary flux-cta--buy'

// Get CSS token definitions
const css = adapter.getTokenCSS();
```

| Platform | Adapter Key | Output |
|----------|------------|--------|
| Fluxxis Native | `'fluxxis'` | CSS custom properties (`--flux-*`) |
| Shopify | `'shopify'` | Polaris class names (`Polaris-Button--primary`) |
| WooCommerce | `'woocommerce'` | Storefront class names (`.button`, `.alt`) |

## Analytics & Tracking

The tracking module fires three event types as DOM `CustomEvent`s and optionally via `navigator.sendBeacon()` to your analytics endpoint.

```typescript
import {
  setTrackingEndpoint,
  trackImpression,
  trackClick,
  trackConversion,
} from '@fluxxis/adaptive-cta';

// Configure your analytics endpoint (optional)
setTrackingEndpoint('https://analytics.yoursaas.com/events');

// These are called automatically by SmartCTA, but can be used standalone:
trackImpression('buy', 'sku-123', 'Widget Pro');
trackClick('buy', 'sku-123', 'Widget Pro');
trackConversion('buy', 'sku-123', 'Widget Pro');
```

**Event payload shape:**

```typescript
interface CTAAnalytics {
  event: 'cta_impression' | 'cta_click' | 'cta_conversion';
  intent: Intent;
  productId?: string;
  productName?: string;
  timestamp: string;
  metadata?: {
    url: string;
    referrer: string;
  };
}
```

**Listening to events in-page:**

```typescript
window.addEventListener('fluxxis:cta', (e: CustomEvent) => {
  console.log('CTA event:', e.detail);
});
```

## Shopify Integration Example

```typescript
// shopify-theme/snippets/fluxxis-cta.liquid
import { SmartCTA, detectIntentFromURL } from '@fluxxis/adaptive-cta';

// Detect intent from current page URL
const currentIntent = detectIntentFromURL(window.location.pathname);

// Get the Shopify Polaris adapter
const { getAdapter } = require('@fluxxis/adaptive-cta');
const adapter = getAdapter('shopify');

// Inject adapter CSS
const style = document.createElement('style');
style.textContent = adapter.getTokenCSS();
document.head.appendChild(style);

// Render the SmartCTA
ReactDOM.render(
  <SmartCTA
    intent={currentIntent}
    productId="{{ product.id }}"
    productName="{{ product.title }}"
    price={{ product.price | money_without_currency }}
    onCTAClick={(intent) => {
      if (intent === 'buy') {
        window.location.href = '/cart/add?id={{ product.variants.first.id }}';
      }
    }}
    variant="primary"
  />,
  document.getElementById('fluxxis-cta-root')
);
```

## `<noscript>` Fallback

When JavaScript is disabled, SmartCTA renders a static fallback link:

```html
<a href="/products" class="flux-cta flux-cta--primary"
   style="background: #C84074; color: #fff;">
  🛒 Comprar
</a>
```

This ensures the CTA is always visible to all users.

## Accessibility

- All intent colors pass WCAG 2.1 AA (≥4.5:1 contrast)
- `focus-visible` outline with offset
- `aria-label` populated from CTA text + subtext
- `role="button"` on the interactive element
- `prefers-reduced-motion: reduce` disables all transitions/transforms
- Full-width on mobile for easy tap targets

## Related

- [@fluxxis/core](./core.md) — Core intent engine
- [@fluxxis/react](./react.md) — React adapter with hooks
- [@fluxxis/wrapper](./wrapper.md) — Intent schema and DS adapters
- [@fluxxis/ui](./ui.md) — Design tokens and CSS custom properties
