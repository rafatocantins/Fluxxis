# API Reference: @fluxxis/react

> React adapter for FLUXXIS. Provides components, hooks, and stores. Re-exports everything from `@fluxxis/core`.

## Installation

```bash
npm install @fluxxis/react @fluxxis/core
```

---

## Components

### `FluxxisProvider`

The root provider that initializes the FLUXXIS engine. Must wrap any component that uses FLUXXIS hooks or smart components.

```tsx
import { FluxxisProvider } from '@fluxxis/react';

function App() {
  return (
    <FluxxisProvider options={{ strictMode: true }} cacheTTL={60000}>
      {/* Your app */}
    </FluxxisProvider>
  );
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Child components |
| `options` | `Partial<ResolutionOptions>` | `{}` | Merged with `DEFAULT_RESOLUTION_OPTIONS` |
| `cacheTTL` | `number` | `300000` | Intent resolution cache TTL in ms (5 min) |

**Also exported:** `FluxxisContext`, `useFluxxis` (internal hook — throws if used outside provider).

---

### `SmartCTA`

An intent-driven CTA component that adapts based on user behavior. Includes animated button variants with shimmer, rainbow, and blur effects.

```tsx
import { SmartCTA } from '@fluxxis/react';

<SmartCTA
  goal="convert"
  defaultCopy="Get Started"
  pageContext="pricing"
  brandVoice={{ tone: 'confident-but-warm', audience: ['founders'], ctaStyle: 'direct' }}
  animated
  animatedVariant="primary"
  size="lg"
  onClick={() => console.log('clicked')}
/>
```

**Props (`SmartCTAProps`):**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `goal` | `GoalType` | `'convert'` | Primary goal |
| `defaultCopy` | `string` | `'Get Started'` | Fallback text |
| `pageContext` | `string` | `''` | Page context for intent classification |
| `brandVoice` | `BrandVoiceConfig` | — | Brand voice for AI copy generation |
| `variant` | `'primary' \| 'secondary' \| 'text'` | `'primary'` | Button style variant |
| `animated` | `boolean` | `true` | Enable animated button variant |
| `animatedVariant` | `'primary' \| 'secondary' \| 'accent'` | auto (from `goal`) | Animated variant type |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `isLoading` | `boolean` | `false` | Loading state |
| `icon` | `React.ReactNode` | — | Icon before text |
| `trailingIcon` | `React.ReactNode` | — | Icon after text |
| `disableAnimations` | `boolean` | `false` | Respect reduced motion |
| `onClick` | `() => void` | — | Click handler |
| `className` | `string` | `''` | Additional CSS classes |

Also extends `React.ButtonHTMLAttributes<HTMLButtonElement>`.

**Animated variant mapping (auto):** `'convert'` → `'primary'` (shimmer), `'inform'` → `'secondary'` (subtle), `'engage'` → `'accent'` (rainbow/playful).

---

### Animated Button Variants

Standalone animated buttons you can use independently of `SmartCTA`:

```tsx
import {
  AnimatedButton,
  PrimaryAnimatedButton,
  SecondaryAnimatedButton,
  AccentAnimatedButton,
  ShimmerButton,
  RainbowButton,
  BlurFadeButton,
  IconButton,
} from '@fluxxis/react';
```

#### `AnimatedButton`

The base animated button. All variants extend this.

**Props (`AnimatedButtonProps`):**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'accent'` | — | Visual variant |
| `goal` | `GoalType` | — | Intent goal for styling |
| `children` | `React.ReactNode` | required | Button content |
| `isLoading` | `boolean` | `false` | Loading spinner |
| `icon` | `React.ReactNode` | — | Leading icon |
| `trailingIcon` | `React.ReactNode` | — | Trailing icon |
| `size` | `'sm' \| 'md' \| 'lg'` | — | Size |
| `disableAnimations` | `boolean` | `false` | Disable animations |

#### `PrimaryAnimatedButton`

Bold, attention-grabbing with shimmer effects. Best for `convert` goals.

```tsx
import { PrimaryAnimatedButton } from '@fluxxis/react';
<PrimaryAnimatedButton goal="convert" size="lg">Buy Now</PrimaryAnimatedButton>
```

#### `SecondaryAnimatedButton`

Clean, professional with subtle hover animations. Best for `inform` goals.

```tsx
import { SecondaryAnimatedButton } from '@fluxxis/react';
<SecondaryAnimatedButton goal="inform">Learn More</SecondaryAnimatedButton>
```

#### `AccentAnimatedButton`

Playful, interactive. Best for `engage` goals.

```tsx
import { AccentAnimatedButton } from '@fluxxis/react';
<AccentAnimatedButton goal="engage">Try the Demo</AccentAnimatedButton>
```

#### `ShimmerButton`

Animated shimmer gradient effect (extends `AnimatedButtonProps`).

```tsx
import { ShimmerButton } from '@fluxxis/react';
<ShimmerButton
  goal="convert"
  shimmerDirection="diagonal"        // 'horizontal' | 'diagonal'
  shimmerIntensity="strong"          // 'subtle' | 'normal' | 'strong'
>
  Premium Plan
</ShimmerButton>
```

#### `RainbowButton`

Animated rainbow border glow (extends `AnimatedButtonProps`).

```tsx
import { RainbowButton } from '@fluxxis/react';
<RainbowButton
  goal="convert"
  rainbowSpeed="fast"                // 'slow' | 'normal' | 'fast'
  rainbowWidth={3}                   // border width in px
>
  Limited Offer
</RainbowButton>
```

#### `BlurFadeButton`

Blur fade entrance animation (extends `AnimatedButtonProps`).

```tsx
import { BlurFadeButton } from '@fluxxis/react';
<BlurFadeButton
  goal="inform"
  blurAmount={8}                     // px blur
  fadeDirection="up"                 // 'up' | 'down' | 'left' | 'right' | 'center'
>
  Discover More
</BlurFadeButton>
```

#### `IconButton`

Circular icon button with tooltip.

```tsx
import { IconButton } from '@fluxxis/react';
<IconButton
  icon={<SettingsIcon />}
  label="Settings"
  tooltip="Open settings"
  size="md"
/>
```

---

### `SmartSection`

Wrap page sections to track engagement and intent at the section level.

```tsx
import { SmartSection } from '@fluxxis/react';

<SmartSection
  goal="convert"
  pageContext="pricing tier comparison"
  brandVoice={{ tone: 'confident-but-warm', audience: ['founders'], ctaStyle: 'direct' }}
  as="section"
  id="pricing-section"
>
  <h2>Choose your plan</h2>
  <SmartCTA goal="convert" defaultCopy="Start Free" />
</SmartSection>
```

**Props (`SmartSectionProps`):**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `goal` | `GoalType` | required | Section goal |
| `pageContext` | `string` | required | Context identifier |
| `brandVoice` | `BrandVoiceConfig` | — | Brand voice override |
| `as` | `React.ElementType` | `'section'` | HTML element to render |
| `children` | `React.ReactNode` | — | Section content |

Also extends `React.HTMLAttributes<HTMLElement>`.

---

### Other Components

#### `AnalyticsDashboard`

```tsx
import { AnalyticsDashboard } from '@fluxxis/react';
<AnalyticsDashboard />
```

#### `StructuredData` / `JsonLdScript`

Inject JSON-LD structured data for agents and SEO:

```tsx
import { StructuredData, JsonLdScript } from '@fluxxis/react';
<StructuredData type="WebApplication" data={{ name: 'My App' }} />
<JsonLdScript data={{ '@type': 'Action', actionName: 'convert' }} />
```

---

## Hooks

### `useIntent`

The primary hook for declaring a component's intent and receiving its adaptive resolution.

```tsx
import { useIntent } from '@fluxxis/react';

function MyComponent() {
  const resolution = useIntent({
    goal: 'convert',
    priority: 'high',
    actorType: 'human',
  });

  return (
    <div style={{ opacity: resolution.emphasis === 'strong' ? 1 : 0.7 }}>
      {resolution.microcopy}
    </div>
  );
}
```

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `declaration` | `Omit<IntentDeclaration, 'componentId' \| 'timestamp'>` | yes | Intent declaration |
| `componentId` | `string` | no | Custom ID (auto-generated if omitted) |

**Returns:** `IntentResolution`

> **Note:** Must be used inside a `<FluxxisProvider>`.

---

### `useBehaviorObserver`

Tracks hover, dwell, and viewport behavior on a DOM element:

```tsx
import { useBehaviorObserver } from '@fluxxis/react';

function MyComponent() {
  const { ref } = useBehaviorObserver<HTMLDivElement>({
    trackHover: true,
    trackDwell: true,
    onBehaviorChange: (metrics) => {
      console.log('Dwell time:', metrics.dwellTime);
      console.log('Is hovered:', metrics.isHovered);
      console.log('In viewport:', metrics.inViewport);
    },
  });

  return <div ref={ref}>Watch me</div>;
}
```

**Exported:** `useBehaviorObserver`, `BehaviorObserverOptions`, `BehaviorMetrics`.

---

### `useDwellTime`

Track how long a user dwells on an element:

```tsx
import { useDwellTime } from '@fluxxis/react';

function MyComponent() {
  const { ref, dwellTime, isDwelling } = useDwellTime({
    threshold: 1000, // report after 1s
  });

  return (
    <div ref={ref}>
      {isDwelling ? `Dwelling: ${dwellTime}ms` : 'Hover me'}
    </div>
  );
}
```

**Exported:** `useDwellTime`, `UseDwellTimeOptions`.

---

### `useIntersectionObserver`

Track viewport visibility:

```tsx
import { useIntersectionObserver } from '@fluxxis/react';

function MyComponent() {
  const { ref, isIntersecting, intersectionRatio } = useIntersectionObserver({
    threshold: 0.5, // fire at 50% visibility
  });

  return (
    <div ref={ref}>
      {isIntersecting ? 'Visible!' : 'Scroll down...'}
    </div>
  );
}
```

**Exported:** `useIntersectionObserver`, `UseIntersectionObserverOptions`.

---

## Stores

State management hooks for common FLUXXIS data:

```tsx
import {
  useUserProfileStore,   // User signals and profile
  useNodeRegistryStore,  // Active component nodes
  useSessionDataStore,   // Session-level metrics
} from '@fluxxis/react';

function DebugPanel() {
  const userProfile = useUserProfileStore();
  const nodes = useNodeRegistryStore();
  const session = useSessionDataStore();

  return (
    <div>
      <pre>User: {JSON.stringify(userProfile, null, 2)}</pre>
      <pre>Nodes: {JSON.stringify(nodes, null, 2)}</pre>
      <pre>Session: {JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
```

**Exported types:** `UserSignal`, `UserProfile`, `SessionMetrics`.
