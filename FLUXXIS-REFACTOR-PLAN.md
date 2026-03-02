# FLUXXIS Refactoring Plan

## 🎯 Strategic Pivot Summary

**From:** `@ia-design-system/react` - React component library with AI features
**To:** `@fluxxis/core` - Framework-agnostic adaptive interface engine

### Key Architectural Changes

| Current | New (FLUXXIS) |
|---------|--------------|
| React-centric | Framework-agnostic core |
| Component library | Behavioral engine |
| AI-first | Deterministic rules first |
| SmartCTA, SmartSection | Signal → Intent → Morph → Render |
| Zustand state | Pure TypeScript core |
| npm package | Core + Adapters + DevTools |

---

## 📦 New Package Structure

```
fluxxis/
├── packages/
│   ├── core/              # Pure TypeScript, no framework deps
│   │   ├── src/
│   │   │   ├── engine/
│   │   │   │   ├── IntentEngine.ts
│   │   │   │   ├── MorphEngine.ts
│   │   │   │   └── SignalProcessor.ts
│   │   │   ├── signals/
│   │   │   │   ├── types.ts
│   │   │   │   └── collectors.ts
│   │   │   ├── intents/
│   │   │   │   ├── types.ts
│   │   │   │   └── rules.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── react/             # React adapter
│   │   ├── src/
│   │   │   ├── hooks/
│   │   │   │   ├── useIntent.ts
│   │   │   │   ├── useSignal.ts
│   │   │   │   └── useMorph.ts
│   │   │   ├── components/
│   │   │   │   ├── AdaptiveButton.tsx
│   │   │   │   ├── AdaptiveCard.tsx
│   │   │   │   └── FluxxisProvider.tsx
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── devtools/          # Debug overlay
│       ├── src/
│       │   ├── overlay.tsx
│       │   ├── inspector.tsx
│       │   └── index.ts
│       └── package.json
│
└── examples/
    ├── react-demo/
    └── vanilla-demo/
```

---

## 🔄 Migration Mapping

### What to Preserve ✅

| Current Feature | New Location | Notes |
|----------------|--------------|-------|
| Behavior tracking hooks | `@fluxxis/core/signals` | Extract framework logic |
| Intent tokens | `@fluxxis/core/intents` | Keep token system |
| Accessibility utils | `@fluxxis/core/utils` | Framework agnostic |
| Fallback mechanisms | `@fluxxis/core/engine` | Core logic |
| Caching system | `@fluxxis/core/engine` | Keep caching |
| BrandVoice config | `@fluxxis/core/intents` | Adapt to new structure |
| Copy generation | `@fluxxis/react` (adapter) | Move to adapter layer |
| EventBus | `@fluxxis/core` | Keep as signal bus |

### What to Refactor 🔧

| Current | New | Changes |
|---------|-----|---------|
| SmartCTA component | AdaptiveButton | Separate intent from render |
| Zustand stores | Core engine state | Remove framework dep |
| React hooks | Core + adapter hooks | Split logic |
| AI copy generation | Optional plugin | Not core requirement |
| Component styles | Morph rules | Structural not just visual |

### What to Remove ❌

- React-centric architecture
- Heavy AI dependencies (move to plugins)
- Component-specific logic (move to adapters)
- Framework-specific state management

---

## 🏗️ Core Engine API Design

### Signal Layer

```typescript
// @fluxxis/core/signals

interface Signal {
  type: 'hover' | 'click' | 'scroll' | 'dwell' | 'viewport';
  value: number;
  timestamp: number;
  context: SignalContext;
}

interface SignalContext {
  deviceId?: string;
  userType?: 'new' | 'returning' | 'power';
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  sessionStart: number;
}

interface SignalProcessor {
  capture(signal: Signal): void;
  getHistory(componentId: string): Signal[];
  getAggregates(componentId: string): SignalAggregates;
}
```

### Intent Engine

```typescript
// @fluxxis/core/intents

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
  microcopy?: string;
}

interface IntentEngine {
  declare(intent: IntentDeclaration): string; // Returns intentId
  resolve(intentId: string, signals: Signal[]): IntentResolution;
  updateRules(rules: IntentRule[]): void;
}
```

### Morph Engine

```typescript
// @fluxxis/core/morph

interface MorphTarget {
  componentId: string;
  current: ComponentState;
  target: ComponentState;
}

interface MorphRule {
  condition: (signals: Signal[], intent: IntentResolution) => boolean;
  transform: (state: ComponentState) => ComponentState;
}

interface MorphEngine {
  register(componentId: string, state: ComponentState): void;
  apply(componentId: string, resolution: IntentResolution): MorphTarget;
  addRule(rule: MorphRule): void;
}
```

### Main Engine

```typescript
// @fluxxis/core/engine

interface FluxxisEngine {
  signals: SignalProcessor;
  intents: IntentEngine;
  morph: MorphEngine;
  
  // Lifecycle
  init(config: EngineConfig): void;
  destroy(): void;
  
  // Debug
  getDebugInfo(): EngineDebugInfo;
}

// Usage
const engine = createFluxxisEngine();

engine.intents.declare({
  goal: 'convert',
  priority: 'high',
  context: { page: 'pricing' }
});

engine.signals.capture({
  type: 'hover',
  value: 1500,
  timestamp: Date.now(),
  context: { userType: 'returning' }
});

const resolution = engine.intents.resolve(intentId, signals);
engine.morph.apply(componentId, resolution);
```

---

## 🎨 React Adapter API

```typescript
// @fluxxis/react

// Provider
<FluxxisProvider engine={engine}>
  <App />
</FluxxisProvider>

// Hooks
const { intent, resolution } = useIntent('convert', { page: 'pricing' });
const signals = useSignal(['hover', 'click']);
const morph = useMorph(componentId, resolution);

// Components
<AdaptiveButton
  intent="convert"
  context={{ page: 'pricing' }}
  baseComponent={Button}
/>

// HOC
withAdaptation(MyComponent, {
  intent: 'convert',
  signals: ['hover', 'dwell']
})
```

---

## 🛠️ Refactoring Phases

### Phase 1: Core Engine (Week 1-2)
- [ ] Extract signal processing logic
- [ ] Create IntentEngine with rules
- [ ] Create MorphEngine
- [ ] Write core tests
- [ ] Zero framework dependencies

### Phase 2: React Adapter (Week 3)
- [ ] Create FluxxisProvider
- [ ] Create hooks (useIntent, useSignal, useMorph)
- [ ] Create AdaptiveButton (migrate SmartCTA logic)
- [ ] Create AdaptiveCard
- [ ] Write adapter tests

### Phase 3: DevTools (Week 4)
- [ ] Create debug overlay
- [ ] Signal inspector
- [ ] Intent resolution visualizer
- [ ] Morph history timeline

### Phase 4: Documentation & Launch (Week 5)
- [ ] Write technical article
- [ ] Create interactive demo
- [ ] API documentation
- [ ] Migration guide from ia-design-system
- [ ] Launch announcement

---

## 📝 Task Updates Required

### Cancel/Archive
- P1-18 to P1-22 (SmartSection, SmartLayout) - Replaced by Adaptive Components
- P1-36 (DynamicImageGeneration) - Not core to FLUXXIS
- P1-14 (Copy Generation) - Move to optional plugin

### Reprioritize
- P1-34 (UI Strategy) - Now core to FLUXXIS paradigm
- P1-35 (CLI Tool) - Adapt for Fluxxis setup
- P1-28 (Accessibility) - Keep, move to core utils
- P1-29 (Performance) - Keep, critical for engine

### New Tasks
- FLUXXIS-01: Extract core engine from React
- FLUXXIS-02: Create IntentEngine with rules
- FLUXXIS-03: Create MorphEngine
- FLUXXIS-04: Create React adapter hooks
- FLUXXIS-05: Create AdaptiveButton component
- FLUXXIS-06: Create DevTools overlay
- FLUXXIS-07: Write technical article
- FLUXXIS-08: Create interactive demo

---

## 🎯 Success Metrics

| Metric | Target |
|--------|--------|
| Core bundle size | < 10KB (gzipped) |
| React adapter | < 5KB (gzipped) |
| Intent resolution | < 10ms |
| Morph application | < 16ms (1 frame) |
| Framework support | React, Vue, Vanilla |
| Test coverage | > 90% |

---

## 🚀 Next Immediate Actions

1. **Create FLUXXIS monorepo structure**
2. **Extract core engine logic** from current codebase
3. **Write IntentEngine** with deterministic rules
4. **Create React adapter** with hooks
5. **Build AdaptiveButton** MVP
6. **Write technical article** explaining paradigm

---

**This pivot positions FLUXXIS as a category creator, not just another design system.** 🎯
