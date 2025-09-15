// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/unit/**', '**/integration/**', '**/storybook/**', '**/chromatic/**'],
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  timeout: 60_000,
  globalTimeout: 300_000,
  reporter: [['line'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    // include your deterministic params by default, overridable via env
    baseURL: process.env.PLAYWRIGHT_BASE_URL
      || 'http://localhost:3000/?seed=cq-e2e-01&testMode=1',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 800 },
    colorScheme: 'dark',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: isCI
      ? 'yarn build && serve -s build -l 3000'
      : 'yarn start',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
