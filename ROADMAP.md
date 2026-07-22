# Roadmap

All notable planned milestones for Fluxxis. Dates are targets and may shift.

---

## v0.2.0 — Monorepo Foundation ✅

**Released:** 2026-07-10

- [x] pnpm monorepo with `core`, `react`, `ui`, `wrapper` packages
- [x] `@fluxxis/core` — Signals, Intents, Analytics, Structured Data, Licensing
- [x] `@fluxxis/react` — SmartSection, SmartCTA, StructuredData, hooks, stores
- [x] `@fluxxis/ui` — Design tokens and base components
- [x] Landing page / Showcase with intent playground
- [x] CI/CD pipeline (GitHub Actions + GitHub Pages)
- [x] npm publish: `@fluxxis/core@0.2.0`, `@fluxxis/ui@0.2.0`
- [x] MIT License

---

## v0.2.1 — Stabilization & Polish ✅

**Released:** 2026-07-22

- [x] Token unification (`--fx-*` → `--flux-*`)
- [x] WCAG AA contrast compliance (all ≥4.5:1)
- [x] CI fixes (DTS resolution, core package name)
- [x] adaptive-cta color fixes + test expectations
- [x] FLIP animation (80ms transitions)
- [x] Mobile responsive breakpoints
- [x] README badges + documentation updates

---

## v0.3.0 — Adaptive CTA MVP 🚧

**Target:** ~2026-08

### Adaptive CTA Engine
- [ ] Shopify plugin — one-click install from Shopify App Store
- [ ] WooCommerce plugin — WordPress plugin directory submission
- [ ] Intent resolver v2 — ML-based intent classification
- [ ] A/B variant engine — automatic variant selection based on intent confidence
- [ ] Admin dashboard — real-time CTA performance metrics
- [ ] Pricing page — SaaS €29/mês subscription flow
- [ ] Stripe integration — payment + subscription management

### Core Enhancements
- [ ] Intent analytics pipeline — aggregate intent data across sites
- [ ] Template marketplace — community-contributed morph templates
- [ ] Webhook support — intent events pushed to external systems

---

## v0.4.0 — Analytics & Intelligence

**Target:** ~2026-09

### Analytics Platform
- [ ] User behavior heatmaps — visualize intent-driven interactions
- [ ] Conversion funnels — track intent → morph → conversion paths
- [ ] Session replay — anonymized intent-aware session recordings
- [ ] A/B testing dashboard — statistical significance for variant comparisons
- [ ] Export API — CSV/JSON data export, webhook streaming

### Enterprise Features
- [ ] Custom intent models — train on proprietary datasets
- [ ] SSO / SAML — Okta, Azure AD, Google Workspace
- [ ] SLA — 99.9% uptime guarantee
- [ ] Dedicated support — Slack channel + priority response

### AI Agent Consumption
- [ ] Machine-readable UI endpoints — JSON-LD enhanced for AI crawlers
- [ ] Agent SDK — programmatic intent submission and UI consumption
- [ ] Multi-agent coordination — resolve conflicting intents from multiple agents

---

## v0.5.0 — Platform & Ecosystem

**Target:** ~2026-Q4

- [ ] Fluxxis Cloud — hosted platform with visual intent builder
- [ ] Plugin ecosystem — third-party template and intent signal plugins
- [ ] Cross-platform SDK — React Native, Flutter, SwiftUI adapters
- [ ] Enterprise tier — €2-5k/year (custom templates, analytics, priority support)

---

## Legend

- ✅ Complete
- 🚧 In Progress
- [ ] Planned
