# Getting Started

> ⏱️ 5-minute quickstart to get FLUXXIS running in your React app.

## Prerequisites

- **Node.js** 18+
- **React** 18+
- **TypeScript** 5+ (recommended, but JavaScript works too)

## Installation

```bash
npm install @fluxxis/react @fluxxis/core
# or
pnpm add @fluxxis/react @fluxxis/core
# or
yarn add @fluxxis/react @fluxxis/core
```

`@fluxxis/react` re-exports everything from `@fluxxis/core`, so you typically only need to import from `@fluxxis/react`.

## Minimal Example

```tsx
import { FluxxisProvider, SmartCTA } from '@fluxxis/react';

function App() {
  return (
    <FluxxisProvider>
      <SmartCTA goal="convert" defaultCopy="Get Started" />
    </FluxxisProvider>
  );
}

export default App;
```

**What happens:** `SmartCTA` declares an intent (`convert`) to the FLUXXIS engine. The engine resolves how the button should behave — emphasis, animation, hierarchy — and the button adapts in real time.

## Using the `useIntent` Hook

For custom components, use the `useIntent` hook to tap directly into the intent resolution system:

```tsx
import { FluxxisProvider, useIntent } from '@fluxxis/react';

function CustomButton() {
  const resolution = useIntent({
    goal: 'convert',
    priority: 'high',
    actorType: 'human',
  });

  return (
    <button
      style={{
        fontWeight: resolution.emphasis === 'strong' ? 700 : 400,
        transform: resolution.animation === 'urgent' ? 'scale(1.05)' : 'none',
      }}
    >
      {resolution.microcopy ?? 'Get Started'}
    </button>
  );
}

function App() {
  return (
    <FluxxisProvider>
      <CustomButton />
    </FluxxisProvider>
  );
}
```

## Smart Section

Wrap page sections to track engagement and intent:

```tsx
import { FluxxisProvider, SmartSection, SmartCTA } from '@fluxxis/react';

function PricingPage() {
  return (
    <FluxxisProvider>
      <SmartSection goal="convert" pageContext="pricing">
        <h2>Choose your plan</h2>
        <SmartCTA goal="convert" defaultCopy="Start Free Trial" />
      </SmartSection>
    </FluxxisProvider>
  );
}
```

## Animated Button Variants

FLUXXIS ships with pre-built animated button variants:

```tsx
import {
  FluxxisProvider,
  PrimaryAnimatedButton,
  SecondaryAnimatedButton,
  ShimmerButton,
  RainbowButton,
  BlurFadeButton,
} from '@fluxxis/react';

function Demo() {
  return (
    <FluxxisProvider>
      <PrimaryAnimatedButton goal="convert">Buy Now</PrimaryAnimatedButton>
      <SecondaryAnimatedButton goal="inform">Learn More</SecondaryAnimatedButton>
      <ShimmerButton goal="engage">Try Demo</ShimmerButton>
      <RainbowButton goal="convert" rainbowSpeed="fast">
        Limited Offer
      </RainbowButton>
      <BlurFadeButton goal="inform">Discover</BlurFadeButton>
    </FluxxisProvider>
  );
}
```

## Next Steps

- **[API Reference: @fluxxis/core](./api/core.md)** — Deep dive into the core engine types, intent resolution, and utilities.
- **[API Reference: @fluxxis/react](./api/react.md)** — Full React component and hook API reference.
