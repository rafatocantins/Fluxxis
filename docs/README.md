# FLUXXIS Documentation

Welcome to the FLUXXIS developer documentation. FLUXXIS is an **Adaptive Structural Interface Engine** — a behavioral architecture layer that transforms static interfaces into adaptive systems based on intent and behavior.

## Contents

- **[Getting Started](./getting-started.md)** — 5-minute quickstart guide
- **[API Reference: @fluxxis/core](./api/core.md)** — Framework-agnostic core engine
- **[API Reference: @fluxxis/react](./api/react.md)** — React adapter (components, hooks, stores)
- **[API Reference: @fluxxis/ui](./api/ui.md)** — Design tokens, CSS custom properties, utility classes
- **[API Reference: @fluxxis/wrapper](./api/wrapper.md)** — Intent schemas, DS adapters, SmartCTA
- **[API Reference: Adaptive CTA Engine](./api/adaptive-cta.md)** — Shopify/WooCommerce adaptive CTA plugin

## Package Overview

| Package | Description |
|---------|-------------|
| `@fluxxis/core` | Intent engine, signals, tokens, analytics, licensing — zero UI dependencies |
| `@fluxxis/react` | React bindings: `FluxxisProvider`, `useIntent`, `SmartCTA`, `SmartSection`, hooks, stores |
| `@fluxxis/ui` | Design tokens as CSS custom properties, utility classes, canonical palette — WCAG 2.1 AA |
| `@fluxxis/wrapper` | Adaptation layer — IntentSchema, DSAdapter, SmartCTA, tracking, consent |
| Adaptive CTA Engine | Standalone e-commerce plugin — Shopify Polaris & WooCommerce adapters, built-in analytics |

## Additional Resources

- [Technical Paper (FLUXXIS-PAPER.md)](../FLUXXIS-PAPER.md) — Formal definition, architecture, and proofs
- [Vision (FLUXXIS-VISION.md)](../FLUXXIS-VISION.md) — The Adaptive Structural Interface paradigm
- [Master Plan (FLUXXIS-MASTER-PLAN.md)](../FLUXXIS-MASTER-PLAN.md) — Complete roadmap
- [Contributing Guide](../CONTRIBUTING.md) (coming soon)
