import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/storybook',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  maxFailures: 1,
  timeout: 60_000,
  reporter: [['line'], ['html']],
  use: {
    baseURL: 'http://localhost:29347',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 800 },
    colorScheme: 'dark',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  webServer: {
    command: 'yarn storybook:build && yarn storybook:serve',
    url: 'http://localhost:29347/iframe.html',
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
