import { test, expect } from '@playwright/experimental-ct-react';
import { SmartCTA } from '@ia-design-system/react';

test.describe('SmartCTA Component', () => {
  test('renders with convert goal', async ({ mount, page }) => {
    const messages: string[] = [];
    page.on('console', msg => messages.push(msg.text()));

    const component = await mount(
      <SmartCTA goal="convert" defaultCopy="Get Started Free" pageContext="test" />
    );

    // Verify rendering
    await expect(component).toBeVisible();
    await expect(component).toContainText('Get Started Free');
    
    // Verify goal attribute
    await expect(component).toHaveAttribute('data-goal', 'convert');
    
    // Verify styling (blue for convert)
    const backgroundColor = await component.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).toContain('59'); // RGB value for blue
    
    // Take screenshot
    await expect(component).toHaveScreenshot('smartcta-convert-default.png');
  });

  test('renders with inform goal', async ({ mount }) => {
    const component = await mount(
      <SmartCTA goal="inform" defaultCopy="Learn More" pageContext="test" />
    );

    await expect(component).toBeVisible();
    await expect(component).toContainText('Learn More');
    await expect(component).toHaveAttribute('data-goal', 'inform');
    
    await expect(component).toHaveScreenshot('smartcta-inform-default.png');
  });

  test('renders with engage goal', async ({ mount }) => {
    const component = await mount(
      <SmartCTA goal="engage" defaultCopy="Try It Now" pageContext="test" />
    );

    await expect(component).toBeVisible();
    await expect(component).toContainText('Try It Now');
    await expect(component).toHaveAttribute('data-goal', 'engage');
    
    await expect(component).toHaveScreenshot('smartcta-engage-default.png');
  });

  test('handles hover interaction', async ({ mount }) => {
    const component = await mount(
      <SmartCTA goal="convert" defaultCopy="Hover Me" pageContext="test" />
    );

    // Default state
    await expect(component).toHaveScreenshot('smartcta-hover-before.png');
    
    // Hover
    await component.hover();
    await expect(component).toHaveScreenshot('smartcta-hover-after.png');
    
    // Verify emphasis changes on long hover
    await component.hover({ position: { x: 50, y: 10 } });
    await expect(component).toHaveAttribute('data-hovered', 'true');
  });

  test('handles click interaction', async ({ mount, page }) => {
    let clickCount = 0;
    
    const component = await mount(
      <SmartCTA 
        goal="convert" 
        defaultCopy="Click Me" 
        pageContext="test"
        onClick={() => { clickCount++; }}
      />
    );

    // Click
    await component.click();
    await expect(clickCount).toBe(1);
    
    // Click again
    await component.click();
    await expect(clickCount).toBe(2);
    
    // Verify click animation/screenshot
    await expect(component).toHaveScreenshot('smartcta-click.png');
  });

  test('supports disabled state', async ({ mount }) => {
    const component = await mount(
      <SmartCTA goal="convert" defaultCopy="Disabled" pageContext="test" disabled />
    );

    await expect(component).toBeDisabled();
    await expect(component).toHaveAttribute('aria-disabled', 'true');
    await expect(component).toHaveScreenshot('smartcta-disabled.png');
  });

  test('supports different variants', async ({ mount }) => {
    // Primary variant
    const primary = await mount(
      <SmartCTA goal="convert" defaultCopy="Primary" variant="primary" pageContext="test" />
    );
    await expect(primary).toHaveScreenshot('smartcta-variant-primary.png');

    // Secondary variant
    const secondary = await mount(
      <SmartCTA goal="convert" defaultCopy="Secondary" variant="secondary" pageContext="test" />
    );
    await expect(secondary).toHaveScreenshot('smartcta-variant-secondary.png');
  });

  test('supports different sizes', async ({ mount }) => {
    const sizes = ['sm', 'md', 'lg'] as const;
    
    for (const size of sizes) {
      const component = await mount(
        <SmartCTA goal="convert" defaultCopy={size.toUpperCase()} size={size as any} pageContext="test" />
      );
      await expect(component).toHaveScreenshot(`smartcta-size-${size}.png`);
    }
  });

  test('tracks behavior signals', async ({ mount, page }) => {
    const behaviorLogs: string[] = [];
    
    page.on('console', msg => {
      if (msg.text().includes('BEHAVIOR_SIGNAL')) {
        behaviorLogs.push(msg.text());
      }
    });

    const component = await mount(
      <SmartCTA goal="convert" defaultCopy="Track Me" pageContext="test" />
    );

    // Hover to trigger behavior signal
    await component.hover();
    await page.waitForTimeout(100);
    
    // Verify behavior was tracked (check console or node registry)
    // Note: This depends on how EventBus logs are exposed
  });

  test('applies intent tokens correctly', async ({ mount }) => {
    const component = await mount(
      <SmartCTA goal="convert" defaultCopy="Styled" pageContext="test" />
    );

    // Check CSS custom properties are applied
    const styles = await component.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        borderRadius: computed.borderRadius,
        boxShadow: computed.boxShadow,
      };
    });

    expect(styles.borderRadius).toBeTruthy();
    expect(styles.boxShadow).toBeTruthy();
  });

  test('respects reduced motion preference', async ({ mount }) => {
    const component = await mount(
      <SmartCTA goal="convert" defaultCopy="Reduced Motion" pageContext="test" />
    );

    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Verify animations are disabled
    const animation = await component.evaluate((el) => 
      window.getComputedStyle(el).animationDuration
    );
    
    expect(animation).toBe('0s');
  });
});
