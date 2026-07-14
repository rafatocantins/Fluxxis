# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-07-10

### Added

- **Landing page / Showcase** — Rewrite demo as FLUXXIS showcase with intent playground, Hero section, Why FLUXXIS, and Get Started flow.
- **API Documentation** — README docs for `@fluxxis/core` and `@fluxxis/react` covering modules, usage, and performance budgets.
- **CI/CD pipeline** — GitHub Actions workflows for CI (lint, typecheck, test, build) and deploy to GitHub Pages.
- **CI badge** — Status badge in README linking to GitHub Actions.
- **Monorepo structure** — Full pnpm workspace with `@fluxxis/core`, `@fluxxis/react`, and `demo` packages.
- **@fluxxis/react components** — SmartSection, SmartCTA, StructuredData, and Analytics components.
- **@fluxxis/react hooks** — useIntent, useBehaviorObserver, useDwellTime, useNetworkStatus, useIntersectionObserver.
- **@fluxxis/react stores** — Zustand-based sessionDataStore, nodeRegistryStore, and userProfileStore.
- **@fluxxis/core modules** — Signals (agent detection), Intents (resolution/morphing), Analytics, Structured Data (JSON-LD/Microdata/RDFa), Licensing, Tokens, and Registry.
- **@fluxxis/core licensing** — API key management, license tiers, and enforcement.
- **Tests** — Vitest tests for core signals, intents, structured data, and licensing.
- **LICENSE** — MIT license file added.
- **Meta tags & SEO** — Open Graph and SEO meta tags for the landing page.
- **SmartCTA component** — Context-aware call-to-action with A/B variant support.

### Fixed

- **Core build** — Remove `React.ReactNode` reference from `@fluxxis/core`, making it truly framework-agnostic.
- **React TypeScript errors** — Resolve type issues in SmartSection component.
- **Deploy configuration** — Add `/Fluxxis/` base path for GitHub Pages, remove dead alias, rebrand demo shell.
- **CI workflow compatibility** — Remove explicit pnpm version pins, add `--passWithNoTests` to test scripts, simplify typecheck step.
- **GitHub Pages activation** — Auto-enable Pages via `configure-pages` action.
- **Invalid CI permissions** — Remove unsupported `administration` permission from deploy workflow.
- **.gitignore** — Add patterns for Turbo, Next.js, and Playwright artifacts.

### Changed

- **Demo → Showcase** — Transformed from basic demo to full FLUXXIS landing page.
- **pnpm migration** — Migrated from npm to pnpm with workspace protocol.
- **Repo metadata** — Configured repository, homepage, and bugs URLs across all packages.

## [0.1.0] - 2026-07-07

### Added

- Initial project scaffold with Agent Licensing Module (FLX-AG-05).
- Phase 0 agentic foundation and governance rules.
- Mono-repo package structure setup (FLX-P1-01).
- Rule 0 (Always Plan First) and Phase 1 planning documentation.

[0.2.0]: https://github.com/rafatocantins/Fluxxis/releases/tag/v0.2.0
[0.1.0]: https://github.com/rafatocantins/Fluxxis/releases/tag/v0.1.0
