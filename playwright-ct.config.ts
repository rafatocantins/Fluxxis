import { defineConfig, devices } from '@playwright/experimental-ct-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: 'e2e',
  snapshotDir: 'e2e/snapshots',
  testMatch: '**/*.ct.tsx',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    ctPort: 3100,
    ctViteConfig: {
      resolve: {
        alias: {
          '@ia-design-system/react': path.resolve(__dirname, './src/index.ts'),
        },
      },
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
