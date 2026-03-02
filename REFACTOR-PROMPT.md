# FLUXXIS Refactoring Prompt

## Context

You are refactoring `@ia-design-system/react` into `@fluxxis/core` - a framework-agnostic adaptive interface engine.

**Strategic Vision:** FLUXXIS is not a design system. It's a behavioral architecture layer where components declare intent and adapt structure based on signals.

**Paradigm:** Signal → Interpret → Morph → Render

## Current State

**Repository:** `ia-design-system`
**Current Stack:** React + TypeScript + Zustand
**Current Components:** SmartCTA, AnimatedButtons
**Current Features:**
- Behavior tracking (hover, dwell, scroll)
- Intent tokens (convert, inform, engage)
- AI copy generation (OpenRouter, Z.AI, etc.)
- Accessibility (WCAG 2.1 AA)
- Fallback mechanisms
- Caching system

## Target Architecture

### Package Structure

```
packages/
├── @fluxxis/core          # Pure TypeScript, no framework deps
│   ├── engine/
│   │   ├── IntentEngine.ts
│   │   ├── MorphEngine.ts
│   │   └── SignalProcessor.ts
│   ├── signals/
│   │   ├── types.ts
│   │   └── collectors.ts
│   ├── intents/
│   │   ├── types.ts
│   │   └── rules.ts
│   └── index.ts
│
├── @fluxxis/react         # React adapter
│   ├── hooks/
│   │   ├── useIntent.ts
│   │   ├── useSignal.ts
│   │   └── useMorph.ts
│   ├── components/
│   │   ├── AdaptiveButton.tsx
│   │   ├── AdaptiveCard.tsx
│   │   └── FluxxisProvider.tsx
│   └── index.ts
│
└── @fluxxis/devtools      # Debug overlay
    ├── overlay.tsx
    └── inspector.tsx
```

### Core API

```typescript
// Signal Layer
interface Signal {
  type: 'hover' | 'click' | 'scroll' | 'dwell';
  value: number;
  timestamp: number;
  context: { userType?: string; deviceType?: string };
}

// Intent Layer
interface IntentDeclaration {
  goal: 'convert' | 'inform' | 'engage';
  priority: 'low' | 'normal' | 'high';
  context: Record<string, any>;
}

interface IntentResolution {
  density: 'compact' | 'normal' | 'spacious';
  emphasis: 'subtle' | 'normal' | 'strong';
  animation: 'none' | 'subtle' | 'playful' | 'urgent';
  hierarchy: 'de-emphasized' | 'normal' | 'focused';
}

// Morph Layer
interface MorphEngine {
  apply(componentId: string, resolution: IntentResolution): void;
}
```

## Migration Rules

### Preserve ✅
1. **Behavior tracking logic** - Extract from React hooks to core signals
2. **Intent token system** - Move to core/intents
3. **Accessibility utilities** - Move to core/utils
4. **Fallback mechanisms** - Core engine feature
5. **Caching system** - Core engine feature
6. **EventBus** - Becomes SignalProcessor
7. **BrandVoice config** - Adapt to IntentDeclaration

### Refactor 🔧
1. **SmartCTA** → AdaptiveButton (React adapter)
2. **Zustand stores** → Core engine state
3. **React hooks** → Core + adapter hooks
4. **Component styles** → Morph rules

### Remove ❌
1. React-centric architecture
2. Heavy AI dependencies (move to plugins)
3. Framework-specific state

## Refactoring Steps

### Step 1: Extract Core Engine
```bash
# Create packages/core
mkdir -p packages/core/src/{engine,signals,intents,utils}
```

**Files to extract:**
- `src/hooks/useBehaviorObserver.ts` → `packages/core/src/signals/collectors.ts`
- `src/tokens/intentTokens.ts` → `packages/core/src/intents/types.ts`
- `src/utils/accessibility.ts` → `packages/core/src/utils/accessibility.ts`
- `src/events/EventBus.ts` → `packages/core/src/engine/SignalProcessor.ts`

**Create new:**
- `packages/core/src/engine/IntentEngine.ts`
- `packages/core/src/engine/MorphEngine.ts`
- `packages/core/src/index.ts`

### Step 2: Create React Adapter
```bash
mkdir -p packages/react/src/{hooks,components}
```

**Create:**
- `packages/react/src/hooks/useIntent.ts`
- `packages/react/src/hooks/useSignal.ts`
- `packages/react/src/hooks/useMorph.ts`
- `packages/react/src/components/FluxxisProvider.tsx`
- `packages/react/src/components/AdaptiveButton.tsx`

### Step 3: Create DevTools
```bash
mkdir -p packages/devtools/src
```

**Create:**
- `packages/devtools/src/overlay.tsx`
- `packages/devtools/src/inspector.tsx`

### Step 4: Update Dependencies
- Remove React from `@fluxxis/core`
- Keep React in `@fluxxis/react`
- Add monorepo tooling (pnpm workspaces or npm workspaces)

### Step 5: Write Tests
- Core engine: >90% coverage
- React adapter: Integration tests
- DevTools: Manual testing

## Success Criteria

| Metric | Target |
|--------|--------|
| Core bundle size | < 10KB gzipped |
| React adapter | < 5KB gzipped |
| Intent resolution | < 10ms |
| Morph application | < 16ms (1 frame) |
| Test coverage | > 90% |
| Framework support | React, Vue, Vanilla |

## Documentation Required

1. **Technical Article** - "Adaptive Structural Interface: A New Paradigm"
2. **API Documentation** - Core engine, React adapter, DevTools
3. **Migration Guide** - From ia-design-system to FLUXXIS
4. **Interactive Demo** - Show adaptation in real-time
5. **Manifesto** - FLUXXIS philosophy and principles

## Immediate Next Actions

1. ✅ Create FLUXXIS-REFACTOR-PLAN.md
2. ⏳ Create monorepo structure
3. ⏳ Extract core engine (IntentEngine, MorphEngine, SignalProcessor)
4. ⏳ Create React adapter hooks
5. ⏳ Build AdaptiveButton MVP
6. ⏳ Write technical article
7. ⏳ Launch with demo

---

**Remember:** FLUXXIS is not competing with Tailwind, Chakra, or Material UI. It complements them as a behavioral layer on top.

**Manifesto:** "Interfaces are not screens. They are living systems. The future of UI is not more components. It's embodied behavior."
