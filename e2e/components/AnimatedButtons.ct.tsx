import { test, expect } from '@playwright/experimental-ct-react';
import {
  PrimaryAnimatedButton,
  SecondaryAnimatedButton,
  AccentAnimatedButton,
  ShimmerButton,
  RainbowButton,
  BlurFadeButton,
} from '@ia-design-system/react';

test.describe('Animated Buttons', () => {
  test.describe('PrimaryAnimatedButton', () => {
    test('renders correctly', async ({ mount }) => {
      const component = await mount(
        <PrimaryAnimatedButton>Primary Button</PrimaryAnimatedButton>
      );

      await expect(component).toBeVisible();
      await expect(component).toContainText('Primary Button');
      await expect(component).toHaveScreenshot('primary-animated-button.png');
    });

    test('handles hover with shimmer effect', async ({ mount }) => {
      const component = await mount(
        <PrimaryAnimatedButton>Hover Me</PrimaryAnimatedButton>
      );

      // Default state
      await expect(component).toHaveScreenshot('primary-before-hover.png');
      
      // Hover
      await component.hover();
      await expect(component).toHaveScreenshot('primary-after-hover.png');
      
      // Verify scale effect
      const transform = await component.evaluate((el) => 
        window.getComputedStyle(el).transform
      );
      expect(transform).not.toBe('none');
    });

    test('handles click with ripple', async ({ mount }) => {
      const component = await mount(
        <PrimaryAnimatedButton onClick={() => console.log('clicked')}>
          Click Me
        </PrimaryAnimatedButton>
      );

      await component.click();
      await expect(component).toHaveScreenshot('primary-click.png');
    });
  });

  test.describe('SecondaryAnimatedButton', () => {
    test('renders correctly', async ({ mount }) => {
      const component = await mount(
        <SecondaryAnimatedButton>Secondary Button</SecondaryAnimatedButton>
      );

      await expect(component).toBeVisible();
      await expect(component).toHaveScreenshot('secondary-animated-button.png');
    });

    test('has clean professional style', async ({ mount }) => {
      const component = await mount(
        <SecondaryAnimatedButton>Professional</SecondaryAnimatedButton>
      );

      const styles = await component.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          background: computed.background,
          border: computed.border,
          color: computed.color,
        };
      });

      expect(styles.background).toContain('transparent');
      expect(styles.border).toBeTruthy();
    });
  });

  test.describe('AccentAnimatedButton', () => {
    test('renders with playful style', async ({ mount }) => {
      const component = await mount(
        <AccentAnimatedButton>✨ Accent Button</AccentAnimatedButton>
      );

      await expect(component).toBeVisible();
      await expect(component).toContainText('✨');
      await expect(component).toHaveScreenshot('accent-animated-button.png');
    });

    test('shows rainbow effect on hover', async ({ mount }) => {
      const component = await mount(
        <AccentAnimatedButton>Rainbow</AccentAnimatedButton>
      );

      await component.hover();
      await expect(component).toHaveScreenshot('accent-hover.png');
    });
  });

  test.describe('ShimmerButton', () => {
    test('renders with shimmer effect', async ({ mount }) => {
      const component = await mount(
        <ShimmerButton>Shimmer</ShimmerButton>
      );

      await expect(component).toBeVisible();
      await expect(component).toHaveScreenshot('shimmer-button.png');
    });

    test('animates shimmer on hover', async ({ mount }) => {
      const component = await mount(
        <ShimmerButton>Hover for Shimmer</ShimmerButton>
      );

      await component.hover();
      await expect(component).toHaveScreenshot('shimmer-button-hover.png');
    });
  });

  test.describe('RainbowButton', () => {
    test('renders with rainbow border', async ({ mount }) => {
      const component = await mount(
        <RainbowButton>Rainbow Magic</RainbowButton>
      );

      await expect(component).toBeVisible();
      await expect(component).toHaveScreenshot('rainbow-button.png');
    });
  });

  test.describe('BlurFadeButton', () => {
    test('renders with blur fade effect', async ({ mount }) => {
      const component = await mount(
        <BlurFadeButton>Fade In</BlurFadeButton>
      );

      await expect(component).toBeVisible();
      await expect(component).toHaveScreenshot('blur-fade-button.png');
    });
  });

  test.describe('Button Sizes', () => {
    test('supports all size variants', async ({ mount }) => {
      const sizes = ['sm', 'md', 'lg'] as const;
      
      for (const size of sizes) {
        const component = await mount(
          <PrimaryAnimatedButton size={size}>Size {size.toUpperCase()}</PrimaryAnimatedButton>
        );

        await expect(component).toBeVisible();
        await expect(component).toHaveScreenshot(`primary-size-${size}.png`);
        
        // Verify height
        const height = await component.evaluate((el) => el.offsetHeight);
        expect(height).toBeGreaterThan(30);
      }
    });
  });

  test.describe('Button States', () => {
    test('shows loading state', async ({ mount }) => {
      const component = await mount(
        <PrimaryAnimatedButton isLoading>Loading</PrimaryAnimatedButton>
      );

      await expect(component).toBeDisabled();
      await expect(component).toHaveScreenshot('button-loading.png');
    });

    test('shows disabled state', async ({ mount }) => {
      const component = await mount(
        <PrimaryAnimatedButton disabled>Disabled</PrimaryAnimatedButton>
      );

      await expect(component).toBeDisabled();
      await expect(component).toHaveScreenshot('button-disabled.png');
    });
  });

  test.describe('Accessibility', () => {
    test('supports keyboard navigation', async ({ mount, page }) => {
      await mount(
        <>
          <PrimaryAnimatedButton>Button 1</PrimaryAnimatedButton>
          <PrimaryAnimatedButton>Button 2</PrimaryAnimatedButton>
          <PrimaryAnimatedButton>Button 3</PrimaryAnimatedButton>
        </>
      );

      // Tab through buttons
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBe('BUTTON');

      // Press Enter to activate
      await page.keyboard.press('Enter');
    });

    test('has proper ARIA attributes', async ({ mount }) => {
      const component = await mount(
        <PrimaryAnimatedButton aria-label="Test Button">Click</PrimaryAnimatedButton>
      );

      await expect(component).toHaveAttribute('aria-label', 'Test Button');
    });

    test('respects reduced motion', async ({ mount, page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      const component = await mount(
        <PrimaryAnimatedButton>Reduced Motion</PrimaryAnimatedButton>
      );

      const animation = await component.evaluate((el) => 
        window.getComputedStyle(el).animationDuration
      );
      
      expect(animation).toBe('0s');
    });
  });

  test.describe('Console Monitoring', () => {
    test('captures console logs on click', async ({ mount, page }) => {
      const messages: string[] = [];
      page.on('console', msg => messages.push(msg.text()));

      const component = await mount(
        <PrimaryAnimatedButton onClick={() => console.log('Button clicked!')}>
          Log Click
        </PrimaryAnimatedButton>
      );

      await component.click();
      expect(messages).toContain('Button clicked!');
    });

    test('detects errors', async ({ mount, page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));

      await mount(
        <PrimaryAnimatedButton onClick={() => { throw new Error('Test error'); }}>
          Error Button
        </PrimaryAnimatedButton>
      );

      await page.click('button');
      expect(errors).toContain('Test error');
    });
  });
});
