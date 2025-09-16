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
      ? 'bash -lc "yarn build && serve -s build -l 3000 2>&1 | tee -a playwright-webserver.log"'
      : 'yarn start',
    // Wait specifically for the healthcheck to be live
    url: 'http://localhost:3000/__ready.txt',
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
