import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

/**
 * Playwright configuration for Storybook visual testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/storybook',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Fail fast - stop on first failure */
  maxFailures: 1,
  /* Global timeout for the entire test run */
  globalTimeout: 300 * 1000, // 5 minutes
  /* Timeout for each test */
  timeout: 60 * 1000, // 1 minute
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['line'], ['html']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:29347',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Force stable viewport and color scheme for deterministic tests */
    viewport: { width: 1280, height: 800 },
    colorScheme: 'dark',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium',
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'firefox',
      use: { 
        browserName: 'firefox',
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'webkit',
      use: { 
        browserName: 'webkit',
        viewport: { width: 1280, height: 800 },
      },
    },
    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { 
        browserName: 'chromium',
        viewport: { width: 393, height: 851 },
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        browserName: 'webkit',
        viewport: { width: 390, height: 844 },
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: isCI
      ? 'bash -lc "yarn build-storybook && yarn serve -s storybook-static -l 29347 2>&1 | tee -a playwright-sb-webserver.log"'
      : 'yarn storybook --port 29347',
    // Wait for the iframe to be available (ensures static build is served)
    url: 'http://localhost:29347/iframe.html',
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
  },
});
