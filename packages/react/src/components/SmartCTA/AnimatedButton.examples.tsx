/**
 * Animated Button Variants - Usage Examples
 *
 * This file demonstrates all the animated button variants and their configurations.
 * Copy these examples into your application to get started.
 */

import React from 'react';
import {
  PrimaryAnimatedButton,
  SecondaryAnimatedButton,
  AccentAnimatedButton,
  ShimmerButton,
  RainbowButton,
  BlurFadeButton,
  IconButton,
} from './AnimatedButtonVariants';
import { SmartCTA } from './SmartCTA';

// ============================================================================
// Icon Components (for examples)
// ============================================================================

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ============================================================================
// Example 1: Primary Animated Button (Convert Goal)
// ============================================================================

export const ExamplePrimaryButton = () => (
  <PrimaryAnimatedButton onClick={() => console.log('Clicked!')}>
    Get Started Free
  </PrimaryAnimatedButton>
);

// With icon
export const ExamplePrimaryButtonWithIcon = () => (
  <PrimaryAnimatedButton
    icon={<ArrowRightIcon />}
    onClick={() => console.log('Clicked!')}
  >
    Start Your Journey
  </PrimaryAnimatedButton>
);

// Large size
export const ExamplePrimaryButtonLarge = () => (
  <PrimaryAnimatedButton size="lg" onClick={() => console.log('Clicked!')}>
    Get Started Now
  </PrimaryAnimatedButton>
);

// Loading state
export const ExamplePrimaryButtonLoading = () => (
  <PrimaryAnimatedButton isLoading onClick={() => console.log('Clicked!')}>
    Submitting...
  </PrimaryAnimatedButton>
);

// ============================================================================
// Example 2: Secondary Animated Button (Inform Goal)
// ============================================================================

export const ExampleSecondaryButton = () => (
  <SecondaryAnimatedButton onClick={() => console.log('Clicked!')}>
    Learn More
  </SecondaryAnimatedButton>
);

// With trailing icon
export const ExampleSecondaryButtonWithIcon = () => (
  <SecondaryAnimatedButton
    trailingIcon={<ArrowRightIcon />}
    onClick={() => console.log('Clicked!')}
  >
    Read Documentation
  </SecondaryAnimatedButton>
);

// Small size
export const ExampleSecondaryButtonSmall = () => (
  <SecondaryAnimatedButton size="sm" onClick={() => console.log('Clicked!')}>
    View Details
  </SecondaryAnimatedButton>
);

// ============================================================================
// Example 3: Accent Animated Button (Engage Goal)
// ============================================================================

export const ExampleAccentButton = () => (
  <AccentAnimatedButton onClick={() => console.log('Clicked!')}>
    Try It Now
  </AccentAnimatedButton>
);

// With sparkle icon
export const ExampleAccentButtonWithSparkle = () => (
  <AccentAnimatedButton
    icon={<SparkleIcon />}
    onClick={() => console.log('Clicked!')}
  >
    Make It Magic
  </AccentAnimatedButton>
);

// Large with both icons
export const ExampleAccentButtonFull = () => (
  <AccentAnimatedButton
    size="lg"
    icon={<SparkleIcon />}
    trailingIcon={<ArrowRightIcon />}
    onClick={() => console.log('Clicked!')}
  >
    Start the Experience
  </AccentAnimatedButton>
);

// ============================================================================
// Example 4: Shimmer Button (21st-dev-magic inspired)
// ============================================================================

export const ExampleShimmerButton = () => (
  <ShimmerButton
    shimmerDirection="horizontal"
    shimmerIntensity="normal"
    onClick={() => console.log('Clicked!')}
  >
    Upgrade to Premium
  </ShimmerButton>
);

// Diagonal shimmer with strong intensity
export const ExampleShimmerButtonDiagonal = () => (
  <ShimmerButton
    shimmerDirection="diagonal"
    shimmerIntensity="strong"
    onClick={() => console.log('Clicked!')}
  >
    Go Pro Today
  </ShimmerButton>
);

// ============================================================================
// Example 5: Rainbow Button (magicuidesign-mcp inspired)
// ============================================================================

export const ExampleRainbowButton = () => (
  <RainbowButton
    rainbowSpeed="normal"
    rainbowWidth={3}
    onClick={() => console.log('Clicked!')}
  >
    Celebrate!
  </RainbowButton>
);

// Fast rainbow with wider border
export const ExampleRainbowButtonFast = () => (
  <RainbowButton
    rainbowSpeed="fast"
    rainbowWidth={4}
    onClick={() => console.log('Clicked!')}
  >
    Party Time
  </RainbowButton>
);

// ============================================================================
// Example 6: Blur Fade Button (reactbits inspired)
// ============================================================================

export const ExampleBlurFadeButton = () => (
  <BlurFadeButton
    blurAmount={10}
    fadeDirection="center"
    onClick={() => console.log('Clicked!')}
  >
    Reveal Secret
  </BlurFadeButton>
);

// Fade from bottom
export const ExampleBlurFadeButtonUp = () => (
  <BlurFadeButton
    blurAmount={8}
    fadeDirection="up"
    onClick={() => console.log('Clicked!')}
  >
    Discover More
  </BlurFadeButton>
);

// ============================================================================
// Example 7: Icon Button
// ============================================================================

export const ExampleIconButton = () => (
  <IconButton
    icon={<HeartIcon />}
    label="Add to favorites"
    tooltip="Add to favorites"
    onClick={() => console.log('Favorite clicked!')}
  />
);

// Large icon button
export const ExampleIconButtonLarge = () => (
  <IconButton
    icon={<SparkleIcon />}
    label="Make it magic"
    tooltip="Make it magic"
    size="lg"
    variant="accent"
    onClick={() => console.log('Magic clicked!')}
  />
);

// ============================================================================
// Example 8: SmartCTA with Animated Buttons
// ============================================================================

// Convert goal - automatically uses primary variant
export const ExampleSmartCTAConvert = () => (
  <SmartCTA
    goal="convert"
    defaultCopy="Start Your Free Trial"
    pageContext="pricing"
    animated={true}
    size="lg"
    onClick={() => console.log('Convert CTA clicked!')}
  />
);

// Inform goal - automatically uses secondary variant
export const ExampleSmartCTAInform = () => (
  <SmartCTA
    goal="inform"
    defaultCopy="Learn More About Us"
    pageContext="about"
    animated={true}
    trailingIcon={<ArrowRightIcon />}
    onClick={() => console.log('Inform CTA clicked!')}
  />
);

// Engage goal - automatically uses accent variant
export const ExampleSmartCTAEngage = () => (
  <SmartCTA
    goal="engage"
    defaultCopy="Try the Interactive Demo"
    pageContext="features"
    animated={true}
    icon={<SparkleIcon />}
    size="lg"
    onClick={() => console.log('Engage CTA clicked!')}
  />
);

// Custom animated variant override
export const ExampleSmartCTACustomVariant = () => (
  <SmartCTA
    goal="convert"
    defaultCopy="Explore Features"
    pageContext="features"
    animated={true}
    animatedVariant="accent" // Override to use accent style
    size="md"
    onClick={() => console.log('Custom variant clicked!')}
  />
);

// ============================================================================
// Example 9: Accessibility - Reduced Motion Support
// ============================================================================

// Automatically respects user's reduced motion preference
export const ExampleAccessibleButton = () => (
  <PrimaryAnimatedButton
    onClick={() => console.log('Clicked!')}
    // disableAnimations prop can be used to force disable animations
    // disableAnimations={true}
  >
    Accessible Button
  </PrimaryAnimatedButton>
);

// With aria-label for icon-only buttons
export const ExampleAccessibleIconButton = () => (
  <IconButton
    icon={<HeartIcon />}
    label="Add to favorites"
    aria-label="Add to favorites"
    onClick={() => console.log('Favorite clicked!')}
  />
);

// ============================================================================
// Example 10: Button Group / Multiple Buttons
// ============================================================================

export const ExampleButtonGroup = () => (
  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
    <PrimaryAnimatedButton onClick={() => console.log('Primary clicked!')}>
      Get Started
    </PrimaryAnimatedButton>
    <SecondaryAnimatedButton onClick={() => console.log('Secondary clicked!')}>
      Learn More
    </SecondaryAnimatedButton>
    <AccentAnimatedButton onClick={() => console.log('Accent clicked!')}>
      Try It Now
    </AccentAnimatedButton>
  </div>
);

// Stacked buttons (mobile)
export const ExampleStackedButtons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <PrimaryAnimatedButton size="lg" onClick={() => console.log('Primary clicked!')}>
      Start Free Trial
    </PrimaryAnimatedButton>
    <SecondaryAnimatedButton size="lg" onClick={() => console.log('Secondary clicked!')}>
      Talk to Sales
    </SecondaryAnimatedButton>
  </div>
);

// ============================================================================
// Example 11: Disabled State
// ============================================================================

export const ExampleDisabledButton = () => (
  <PrimaryAnimatedButton disabled onClick={() => console.log('Won\'t fire!')}>
    Disabled Button
  </PrimaryAnimatedButton>
);

// ============================================================================
// Example 12: Custom Styling with className
// ============================================================================

export const ExampleCustomStyledButton = () => (
  <PrimaryAnimatedButton
    className="my-custom-button"
    onClick={() => console.log('Clicked!')}
    style={{ minWidth: '200px' }}
  >
    Custom Width Button
  </PrimaryAnimatedButton>
);

// ============================================================================
// Example 13: All Sizes Comparison
// ============================================================================

export const ExampleAllSizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <PrimaryAnimatedButton size="sm">Small</PrimaryAnimatedButton>
      <SecondaryAnimatedButton size="sm">Small</SecondaryAnimatedButton>
      <AccentAnimatedButton size="sm">Small</AccentAnimatedButton>
    </div>
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <PrimaryAnimatedButton size="md">Medium</PrimaryAnimatedButton>
      <SecondaryAnimatedButton size="md">Medium</SecondaryAnimatedButton>
      <AccentAnimatedButton size="md">Medium</AccentAnimatedButton>
    </div>
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <PrimaryAnimatedButton size="lg">Large</PrimaryAnimatedButton>
      <SecondaryAnimatedButton size="lg">Large</SecondaryAnimatedButton>
      <AccentAnimatedButton size="lg">Large</AccentAnimatedButton>
    </div>
  </div>
);

// ============================================================================
// Example 14: Full Feature Demo
// ============================================================================

export const ExampleFullFeatureDemo = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);

  const handlePrimaryClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setClickCount((prev) => prev + 1);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3>Animated Button Feature Demo</h3>

      {/* Primary with loading state */}
      <div>
        <p>Primary Button with Loading State:</p>
        <PrimaryAnimatedButton
          icon={<ArrowRightIcon />}
          isLoading={isLoading}
          onClick={handlePrimaryClick}
        >
          {isLoading ? 'Processing...' : 'Submit Form'}
        </PrimaryAnimatedButton>
      </div>

      {/* Secondary with trailing icon */}
      <div>
        <p>Secondary Button with Trailing Icon:</p>
        <SecondaryAnimatedButton
          trailingIcon={<ArrowRightIcon />}
          onClick={() => setClickCount((prev) => prev + 1)}
        >
          Read Documentation
        </SecondaryAnimatedButton>
      </div>

      {/* Accent with sparkle */}
      <div>
        <p>Accent Button with Sparkle Effect:</p>
        <AccentAnimatedButton
          icon={<SparkleIcon />}
          size="lg"
          onClick={() => setClickCount((prev) => prev + 1)}
        >
          Make It Magic
        </AccentAnimatedButton>
      </div>

      {/* Icon button with tooltip */}
      <div>
        <p>Icon Button with Tooltip:</p>
        <IconButton
          icon={<HeartIcon />}
          label="Add to favorites"
          tooltip="Add to favorites"
          onClick={() => setClickCount((prev) => prev + 1)}
        />
      </div>

      {/* Click counter */}
      <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
        Total clicks: {clickCount}
      </div>
    </div>
  );
};

// ============================================================================
// Export All Examples
// ============================================================================

export default {
  ExamplePrimaryButton,
  ExamplePrimaryButtonWithIcon,
  ExamplePrimaryButtonLarge,
  ExamplePrimaryButtonLoading,
  ExampleSecondaryButton,
  ExampleSecondaryButtonWithIcon,
  ExampleSecondaryButtonSmall,
  ExampleAccentButton,
  ExampleAccentButtonWithSparkle,
  ExampleAccentButtonFull,
  ExampleShimmerButton,
  ExampleShimmerButtonDiagonal,
  ExampleRainbowButton,
  ExampleRainbowButtonFast,
  ExampleBlurFadeButton,
  ExampleBlurFadeButtonUp,
  ExampleIconButton,
  ExampleIconButtonLarge,
  ExampleSmartCTAConvert,
  ExampleSmartCTAInform,
  ExampleSmartCTAEngage,
  ExampleSmartCTACustomVariant,
  ExampleAccessibleButton,
  ExampleAccessibleIconButton,
  ExampleButtonGroup,
  ExampleStackedButtons,
  ExampleDisabledButton,
  ExampleCustomStyledButton,
  ExampleAllSizes,
  ExampleFullFeatureDemo,
};
