import type { PlaywrightTestConfig } from '@storybook/test-runner';

const config: PlaywrightTestConfig = {
  testMatch: '**/*.playwright.spec.ts',
  retries: 0,
  timeout: 30000,
  use: {
    trace: 'on-first-retry',
  },
};

export default config;
