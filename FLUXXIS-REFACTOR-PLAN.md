# FLUXXIS Refactoring Plan

## 1. Overview
This document outlines the technical migration from the legacy `ia-design-system` architecture to the new **FLUXXIS** pnpm workspace monorepo structure. The goal is to cleanly separate the framework-agnostic engine from the React-specific adapter, fulfilling the architectural vision defined in `FLUXXIS-MASTER-PLAN.md`.

## 2. Current State vs Target State

**Current State:**
- The bulk of the implementation resides in the root `src/` directory.
- `packages/core/src/` contains a nearly exact copy of the root `src/`, including React components and hooks, which violates the framework-agnostic requirement.
- `packages/react/` is scaffolded but empty.

**Target State:**
- **`packages/core`**: Pure TypeScript. Contains the SignalProcessor, IntentEngine, EventBus, NodeRegistry, and framework-agnostic utilities/tokens.
- **`packages/react`**: React-specific. Contains `FluxxisProvider`, hooks (`useBehaviorObserver`, etc.), and components (`SmartCTA`).
- **Root**: No `src/` directory. Only workspace configuration, documentation, and tooling setup.

## 3. Migration Steps

### Phase 1: Core Engine Extraction
Move all pure, non-React framework logic into `packages/core/src`:
- [ ] `events/` (EventBus)
- [ ] `registry/` (NodeRegistry)
- [ ] `analytics/`, `observability/`, `tracking/`
- [ ] `signals/`
- [ ] `intents/`
- [ ] `tokens/`, `styles/` (pure CSS/TS)
- [ ] `types/`
- [ ] `utils/`
- [ ] Cleanup `packages/core/package.json` and `packages/core/src/index.ts` to ensure no `react` dependencies exist.

### Phase 2: React Adapter Extraction
Move all React syntax, components, hooks, and context into `packages/react/src`:
- [ ] `components/` (SmartCTA, AnimatedButtons)
- [ ] `hooks/` (useBehaviorObserver, useDwellTime, useIntersectionObserver, etc.)
- [ ] `stores/` (Zustand stores)
- [ ] Create missing infrastructure (`FluxxisProvider` if applicable)
- [ ] Update `packages/react/src/index.ts` exports.
- [ ] Update `packages/react/package.json` to properly link to `@fluxxis/core`.

### Phase 3: Cleanup & Wiring
- [ ] Delete the root `src/` directory.
- [ ] Fix all absolute/relative imports across both packages to ensure they resolve correctly according to workspace linking.
- [ ] Run `pnpm install`, `pnpm build`, and `pnpm lint` to verify the new structure compiles.

## 4. Risks & Mitigations
- **Broken Imports**: Highly likely due to moving files across package boundaries. *Mitigation: Standardize exports using index files and strictly rely on `workspace:*` dependencies in package.json.*
- **React leakage in Core**: *Mitigation: Remove `react` and `react-dom` from `packages/core/package.json` devDependencies early to let the TypeScript compiler highlight illegal imports.*

## 5. Rollback Plan
Since the transition relies on moving existing code rather than a full rewrite, we can rely on git history to revert structural changes if the migration fails or takes too much time.
