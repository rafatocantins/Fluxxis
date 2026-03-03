# Animated Button Variants Documentation

## Overview

The AI Design System now includes a comprehensive set of animated button variants designed for modern, production-ready applications. These buttons feature:

- **Shimmer effects** (inspired by 21st-dev-magic)
- **Rainbow animations** (inspired by magicuidesign-mcp)
- **Blur fade effects** (inspired by reactbits)
- **Text animations**
- **Hover and click feedback**
- **Full accessibility support**

## Installation

The animated buttons are included in the SmartCTA component and can be imported directly:

```tsx
import {
  SmartCTA,
  AnimatedButton,
  PrimaryAnimatedButton,
  SecondaryAnimatedButton,
  AccentAnimatedButton,
  ShimmerButton,
  RainbowButton,
  BlurFadeButton,
  IconButton,
} from '@ia-design-system/react';
```

## Button Variants

### 1. PrimaryAnimatedButton (Convert Goal)

**Purpose:** Bold, attention-grabbing button for conversion-focused actions.

**Features:**
- Gradient background (blue tones)
- Shimmer effect on hover
- Strong shadow with glow on hover
- Confident scale and lift animations

```tsx
<PrimaryAnimatedButton onClick={() => handleSignup()}>
  Get Started Free
</PrimaryAnimatedButton>

// With icon
<PrimaryAnimatedButton icon={<ArrowRightIcon />}>
  Start Your Journey
</PrimaryAnimatedButton>

// Large size
<PrimaryAnimatedButton size="lg">
  Get Started Now
</PrimaryAnimatedButton>

// Loading state
<PrimaryAnimatedButton isLoading>
  Submitting...
</PrimaryAnimatedButton>
```

### 2. SecondaryAnimatedButton (Inform Goal)

**Purpose:** Clean, professional button for informational actions.

**Features:**
- Transparent background with border
- Subtle hover effects
- Minimal styling
- Professional appearance

```tsx
<SecondaryAnimatedButton onClick={() => showMoreInfo()}>
  Learn More
</SecondaryAnimatedButton>

// With trailing icon
<SecondaryAnimatedButton trailingIcon={<ArrowRightIcon />}>
  Read Documentation
</SecondaryAnimatedButton>

// Small size
<SecondaryAnimatedButton size="sm">
  View Details
</SecondaryAnimatedButton>
```

### 3. AccentAnimatedButton (Engage Goal)

**Purpose:** Playful, interactive button for engagement-focused actions.

**Features:**
- Vibrant purple/pink gradient
- Rainbow border effect on hover
- Particle effects
- Bouncy, playful animations
- Text gradient on hover

```tsx
<AccentAnimatedButton onClick={() => startDemo()}>
  Try It Now
</AccentAnimatedButton>

// With sparkle icon
<AccentAnimatedButton icon={<SparkleIcon />}>
  Make It Magic
</AccentAnimatedButton>

// Large with both icons
<AccentAnimatedButton
  size="lg"
  icon={<SparkleIcon />}
  trailingIcon={<ArrowRightIcon />}
>
  Start the Experience
</AccentAnimatedButton>
```

## Special Effect Buttons

### 4. ShimmerButton

**Purpose:** Enhanced primary button with customizable shimmer effect.

**Props:**
- `shimmerDirection`: 'horizontal' | 'diagonal'
- `shimmerIntensity`: 'subtle' | 'normal' | 'strong'

```tsx
<ShimmerButton
  shimmerDirection="horizontal"
  shimmerIntensity="normal"
>
  Upgrade to Premium
</ShimmerButton>

// Diagonal shimmer with strong intensity
<ShimmerButton
  shimmerDirection="diagonal"
  shimmerIntensity="strong"
>
  Go Pro Today
</ShimmerButton>
```

### 5. RainbowButton

**Purpose:** Accent button with enhanced rainbow border animation.

**Props:**
- `rainbowSpeed`: 'slow' | 'normal' | 'fast'
- `rainbowWidth`: number (pixels)

```tsx
<RainbowButton
  rainbowSpeed="normal"
  rainbowWidth={3}
>
  Celebrate!
</RainbowButton>

// Fast rainbow with wider border
<RainbowButton
  rainbowSpeed="fast"
  rainbowWidth={4}
>
  Party Time
</RainbowButton>
```

### 6. BlurFadeButton

**Purpose:** Button with blur fade entrance animation.

**Props:**
- `blurAmount`: number (pixels)
- `fadeDirection`: 'up' | 'down' | 'left' | 'right' | 'center'

```tsx
<BlurFadeButton
  blurAmount={10}
  fadeDirection="center"
>
  Reveal Secret
</BlurFadeButton>

// Fade from bottom
<BlurFadeButton
  blurAmount={8}
  fadeDirection="up"
>
  Discover More
</BlurFadeButton>
```

### 7. IconButton

**Purpose:** Circular icon button with tooltip support.

**Props:**
- `icon`: React.ReactNode
- `label`: string (for accessibility)
- `tooltip`: string (optional)
- `size`: 'sm' | 'md' | 'lg'

```tsx
<IconButton
  icon={<HeartIcon />}
  label="Add to favorites"
  tooltip="Add to favorites"
/>

// Large icon button
<IconButton
  icon={<SparkleIcon />}
  label="Make it magic"
  tooltip="Make it magic"
  size="lg"
  variant="accent"
/>
```

## SmartCTA Integration

The SmartCTA component automatically uses the appropriate animated button variant based on the goal:

```tsx
// Convert goal - uses primary variant
<SmartCTA
  goal="convert"
  defaultCopy="Start Your Free Trial"
  pageContext="pricing"
  animated={true}
/>

// Inform goal - uses secondary variant
<SmartCTA
  goal="inform"
  defaultCopy="Learn More About Us"
  pageContext="about"
  animated={true}
/>

// Engage goal - uses accent variant
<SmartCTA
  goal="engage"
  defaultCopy="Try the Interactive Demo"
  pageContext="features"
  animated={true}
  icon={<SparkleIcon />}
/>

// Override the automatic variant selection
<SmartCTA
  goal="convert"
  defaultCopy="Explore Features"
  animated={true}
  animatedVariant="accent" // Force accent style
/>
```

## Props Reference

### AnimatedButtonProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | 'primary' \| 'secondary' \| 'accent' | 'primary' | Button visual variant |
| `goal` | 'convert' \| 'inform' \| 'engage' | - | Intent goal for tracking |
| `isLoading` | boolean | false | Loading state |
| `icon` | React.ReactNode | - | Icon before text |
| `trailingIcon` | React.ReactNode | - | Icon after text |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| `disableAnimations` | boolean | false | Disable all animations |
| `className` | string | '' | Additional CSS classes |
| `onClick` | () => void | - | Click handler |
| `disabled` | boolean | false | Disabled state |

### Size Variants

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 36px | 0.5rem 1rem | 0.875rem |
| `md` | 44px | 0.75rem 1.5rem | 1rem |
| `lg` | 52px | 1rem 2rem | 1.125rem |

## Accessibility Features

### Keyboard Navigation

All buttons support full keyboard navigation:
- `Tab` - Focus the button
- `Enter` or `Space` - Activate the button
- `Escape` - Cancel any active state

### Screen Reader Support

- Proper `aria-label` for icon buttons
- `aria-busy` attribute during loading state
- `aria-disabled` attribute when disabled
- Semantic button element with proper roles

### Reduced Motion

The buttons automatically respect the user's reduced motion preference:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations are disabled */
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

You can also manually disable animations:

```tsx
<PrimaryAnimatedButton disableAnimations>
  Reduced Motion Button
</PrimaryAnimatedButton>
```

### Focus Indicators

- Visible focus ring with pulse animation
- High contrast focus outline
- Proper focus management

## Animation Details

### Durations

| Animation | Duration |
|-----------|----------|
| Hover transition | 300ms |
| Click feedback | 150ms |
| Shimmer effect | 1.5s (infinite) |
| Rainbow border | 3s (infinite) |
| Rainbow glow | 2s (infinite) |
| Particle float | 2s |
| Ripple effect | 600ms |
| Blur fade | 500ms |

### Easing Functions

- `ease-out`: cubic-bezier(0.33, 1, 0.68, 1)
- `ease-in-out`: cubic-bezier(0.65, 0, 0.35, 1)
- `ease-spring`: cubic-bezier(0.34, 1.56, 0.64, 1)

### Transform States

**Primary:**
- Default: `scale(1)`
- Hover: `translateY(-2px) scale(1.02)`
- Active: `scale(0.97)`

**Secondary:**
- Default: `scale(1)`
- Hover: `translateY(-1px)`
- Active: `scale(0.98)`

**Accent:**
- Default: `scale(1)`
- Hover: `translateY(-4px) scale(1.03) rotate(-1deg)`
- Active: `scale(0.95)`

## Color Tokens

### Primary (Convert)

```css
--btn-primary-bg-start: #3b82f6;  /* blue-500 */
--btn-primary-bg-mid: #2563eb;    /* blue-600 */
--btn-primary-bg-end: #1d4ed8;    /* blue-700 */
--btn-primary-shadow: rgba(59, 130, 246, 0.4);
```

### Secondary (Inform)

```css
--btn-secondary-border: #e5e7eb;
--btn-secondary-text: #4b5563;
--btn-secondary-border-hover: #3b82f6;
--btn-secondary-text-hover: #1f2937;
```

### Accent (Engage)

```css
--btn-accent-bg-start: #8b5cf6;   /* violet-500 */
--btn-accent-bg-mid: #a855f7;     /* purple-500 */
--btn-accent-bg-end: #d946ef;     /* fuchsia-500 */
--btn-accent-shadow: rgba(168, 85, 247, 0.4);
```

### Rainbow Colors

```css
#ef4444 (red-500)
#f97316 (orange-500)
#eab308 (yellow-500)
#22c55e (green-500)
#3b82f6 (blue-500)
#8b5cf6 (violet-500)
#ec4899 (pink-500)
```

## Dark Mode Support

The buttons automatically adapt to dark mode:

```css
@media (prefers-color-scheme: dark) {
  --btn-secondary-border: #374151;
  --btn-secondary-text: #d1d5db;
  --btn-secondary-text-hover: #f9fafb;
}
```

## Responsive Design

On mobile devices (max-width: 640px):
- Buttons expand to full width
- Large size adjusts padding for better touch targets

```css
@media (max-width: 640px) {
  .animated-button {
    width: 100%;
    justify-content: center;
  }
}
```

## Performance Considerations

- All animations use CSS transforms and opacity for GPU acceleration
- Animations are automatically disabled for reduced motion preferences
- Ripple and particle effects are cleaned up automatically
- Styles are injected once and cached

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with touch optimizations

## Examples

See `AnimatedButton.examples.tsx` for comprehensive usage examples including:
- Basic variants
- With icons
- Different sizes
- Loading states
- Disabled states
- Button groups
- Full feature demo

## Files

- `AnimatedButtonVariants.tsx` - Main component implementations
- `animatedButtonStyles.css` - Complete stylesheet
- `AnimatedButton.examples.tsx` - Usage examples
- `index.ts` - Export configuration
