# Playwright Component Testing

This folder contains Playwright component tests for visual testing and interaction.

## Running Tests

```bash
# Run all tests
npm run test:ct

# Run tests with UI
npm run test:ct -- --ui

# Run specific test file
npm run test:ct -- SmartCTA.ct.tsx

# Run with screenshots
npm run test:ct -- --update-snapshots
```

## Test Structure

```
e2e/
├── components/           # Component tests
│   ├── SmartCTA.ct.tsx
│   └── AnimatedButtons.ct.tsx
├── snapshots/            # Visual snapshots
└── utils/                # Test utilities
```

## Features

### 1. Visual Testing
- Take screenshots of components
- Compare against baseline snapshots
- Detect visual regressions

### 2. Interaction Testing
- Click, hover, focus events
- Keyboard navigation
- Form interactions

### 3. Console Monitoring
- Capture console logs
- Detect errors and warnings
- Verify expected logs

### 4. Accessibility Testing
- Keyboard navigation
- Screen reader support
- Focus management

## Example Test

```typescript
import { test, expect } from '@playwright/experimental-ct-react';
import { SmartCTA } from '@ia-design-system/react';

test('SmartCTA renders with convert goal', async ({ mount, page }) => {
  const component = await mount(
    <SmartCTA goal="convert" defaultCopy="Get Started" />
  );
  
  // Visual snapshot
  await expect(component).toHaveScreenshot();
  
  // Interaction
  await component.hover();
  await expect(component).toHaveScreenshot('hover');
  
  // Click
  await component.click();
  
  // Console logs
  const messages: string[] = [];
  page.on('console', msg => messages.push(msg.text()));
  expect(messages).toContain('Button clicked!');
});
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Main branch commits
- Scheduled runs

Artifacts saved:
- Screenshots
- Videos
- Trace files
- HTML report
