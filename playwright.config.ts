// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  // Your E2E tests for the app live under ./tests (adjust only if needed)
  testDir: './tests',
  // Ignore non-E2E buckets here so this config only targets the app
  testIgnore: [
    '**/unit/**',
    '**/integration/**',
    '**/storybook/**',
    '**/chromatic/**',
  ],

  // CI ergonomics
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  timeout: 60_000,
  globalTimeout: 300_000,
  reporter: [['line'], ['html', { outputFolder: 'playwright-report' }]],

  use: {
    // app base URL; tests should do: await page.goto('/')
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 800 },
    colorScheme: 'dark',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // ⭐ KEY: let Playwright start/stop the server when no BASE_URL is injected
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        // CI: build + serve static CRA bundle; Local: fast dev server
        command: isCI
          ? 'yarn build && npx serve -s build -l 3000'
          : 'yarn start',
        url: 'http://localhost:3000',
        reuseExistingServer: !isCI,
        timeout: 120_000
      },
});
