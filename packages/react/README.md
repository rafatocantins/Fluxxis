# @fluxxis/react

**FLUXXIS React Adapter**

React components and hooks for FLUXXIS adaptive interfaces.

---

## Installation

```bash
npm install @fluxxis/core @fluxxis/react
# or
pnpm add @fluxxis/core @fluxxis/react
# or
yarn add @fluxxis/core @fluxxis/react
```

---

## Usage

```typescript
import { FluxxisProvider, useIntent, useSignal } from '@fluxxis/react';

// Wrap your app
<FluxxisProvider>
  <App />
</FluxxisProvider>

// Use hooks in components
function MyComponent() {
  const resolution = useIntent('convert', { page: 'pricing' });
  const signals = useSignal(['hover', 'click']);
  
  return (
    <button className={`button--${resolution.emphasis}`}>
      Get Started
    </button>
  );
}
```

---

## Hooks

| Hook | Description |
|------|-------------|
| **useIntent** | Declare and resolve intent |
| **useSignal** | Subscribe to signals |
| **useMorph** | Apply morph transformations |

---

## Components

| Component | Description |
|-----------|-------------|
| **FluxxisProvider** | Context provider for FLUXXIS |
| **AdaptiveButton** | Adaptive button component |
| **AdaptiveCard** | Adaptive card component |

---

## Peer Dependencies

- React >=17.0.0
- React DOM >=17.0.0

---

## License

MIT — See [LICENSE](../../LICENSE) for details.

---

**Documentation:** https://github.com/rafatocantins/fluxxis
