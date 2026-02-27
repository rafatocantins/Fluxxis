# Playwright Component Testing Setup

## 🎯 What This Provides

Playwright component testing allows you to:

1. **Visual Testing** - Take screenshots and detect visual regressions
2. **Interaction Testing** - Click, hover, keyboard navigation
3. **Console Monitoring** - Capture logs, errors, warnings
4. **Accessibility Testing** - Keyboard nav, screen readers, focus
5. **Cross-browser Testing** - Chrome, Firefox, Safari
6. **Responsive Testing** - Mobile, tablet, desktop viewports

## 🚀 Quick Start

### Run All Tests
```bash
npm run test:ct
```

### Run with UI (Interactive Mode)
```bash
npm run test:ct:ui
```

This opens a beautiful UI where you can:
- See all tests
- Run individual tests
- View screenshots
- Compare snapshots
- Debug failures

### View Test Report
```bash
npm run test:ct:report
```

## 📁 Test Structure

```
e2e/
├── components/              # Component tests
│   ├── SmartCTA.ct.tsx     # SmartCTA tests
│   └── AnimatedButtons.ct.tsx  # Animated button tests
├── snapshots/              # Visual baselines
│   └── components/
│       ├── smartcta-convert-default.png
│       └── ...
└── README.md               # This guide
```

## 📝 Writing Tests

### Basic Test
```typescript
import { test, expect } from '@playwright/experimental-ct-react';
import { SmartCTA } from '@ia-design-system/react';

test('renders SmartCTA', async ({ mount }) => {
  const component = await mount(
    <SmartCTA goal="convert" defaultCopy="Click Me" />
  );
  
  await expect(component).toBeVisible();
  await expect(component).toContainText('Click Me');
});
```

### Visual Screenshot Test
```typescript
test('has correct appearance', async ({ mount }) => {
  const component = await mount(
    <SmartCTA goal="convert" defaultCopy="Button" />
  );
  
  // Take screenshot and compare with baseline
  await expect(component).toHaveScreenshot();
});
```

### Interaction Test
```typescript
test('handles hover and click', async ({ mount }) => {
  const component = await mount(
    <SmartCTA goal="convert" defaultCopy="Interact" />
  );
  
  // Hover
  await component.hover();
  await expect(component).toHaveScreenshot('hover');
  
  // Click
  await component.click();
});
```

### Console Monitoring
```typescript
test('captures console logs', async ({ mount, page }) => {
  const messages: string[] = [];
  page.on('console', msg => messages.push(msg.text()));
  
  const component = await mount(
    <SmartCTA goal="convert" defaultCopy="Log" onClick={() => console.log('clicked!')} />
  );
  
  await component.click();
  expect(messages).toContain('clicked!');
});
```

### Accessibility Test
```typescript
test('supports keyboard navigation', async ({ mount, page }) => {
  await mount(
    <>
      <SmartCTA goal="convert" defaultCopy="Button 1" />
      <SmartCTA goal="convert" defaultCopy="Button 2" />
    </>
  );
  
  // Tab through
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
});
```

## 🎨 Visual Regression Testing

### Update Snapshots
```bash
# Update all snapshots
npm run test:ct -- --update-snapshots

# Update specific test snapshots
npm run test:ct -- SmartCTA.ct.tsx --update-snapshots
```

### Compare Snapshots
When a test fails, Playwright shows:
- Expected (baseline) screenshot
- Actual (current) screenshot
- Diff overlay

## 🔍 Debugging

### Run with Debug Mode
```bash
npm run test:ct -- --debug
```

This opens Playwright Inspector with:
- Step-through debugging
- Live edit tests
- Watch mode
- Console logs

### View Trace
```bash
npm run test:ct -- --trace on
npm run test:ct:report
```

Trace viewer shows:
- DOM snapshots
- Network requests
- Console logs
- Screenshots
- Source code

## 📊 CI/CD Integration

Tests run automatically on GitHub Actions:
- Every pull request
- Main branch commits
- Scheduled runs

Artifacts saved:
- HTML report
- Screenshots
- Videos
- Trace files

## 🎯 Test Commands

| Command | Description |
|---------|-------------|
| `npm run test:ct` | Run all component tests |
| `npm run test:ct:ui` | Run with interactive UI |
| `npm run test:ct -- --debug` | Debug mode |
| `npm run test:ct -- --update-snapshots` | Update baselines |
| `npm run test:ct:report` | View HTML report |
| `npm run test:ct SmartCTA.ct.tsx` | Run specific test file |
| `npm run test:ct -- --grep "hover"` | Run tests matching pattern |

## 📱 Browser & Device Support

Configured browsers:
- Desktop Chrome
- Mobile Chrome (Pixel 5)
- (Add more in `playwright-ct.config.ts`)

## 🎓 Best Practices

1. **Take screenshots** for visual components
2. **Test interactions** (hover, click, focus)
3. **Monitor console** for errors/logs
4. **Test accessibility** (keyboard, screen readers)
5. **Test responsive** (mobile, tablet, desktop)
6. **Update snapshots** when intentional changes made
7. **Review failures** in UI mode for debugging

## 🔗 Resources

- [Playwright Component Testing](https://playwright.dev/docs/test-components)
- [Playwright Test](https://playwright.dev/docs/intro)
- [Test Assertions](https://playwright.dev/docs/test-assertions)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)
