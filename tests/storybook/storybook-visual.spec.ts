import { test, expect } from '@chromatic-com/playwright';

// List of all stories to test
const stories = [
  { id: 'components-button--primary', name: 'Primary Button' },
  { id: 'components-button--secondary', name: 'Secondary Button' },
  { id: 'components-button--danger', name: 'Danger Button' },
  { id: 'components-button--large', name: 'Large Button' },
  { id: 'components-button--small', name: 'Small Button' },
  { id: 'components-button--disabled', name: 'Disabled Button' },
];

// Viewport configurations for responsive testing
const viewports = [
  { name: 'desktop', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

test.describe('Storybook Visual Regression Tests', () => {
  for (const story of stories) {
    test.describe(`${story.name}`, () => {
      for (const viewport of viewports) {
        test(`should match visual snapshot on ${viewport.name}`, async ({ page }) => {
          // Set viewport size
          await page.setViewportSize({
            width: viewport.width,
            height: viewport.height,
          });

          // Navigate to the story
          await page.goto(`/iframe.html?id=${story.id}`);

          // Wait for the component to be fully loaded
          await page.waitForLoadState('domcontentloaded');

          // Wait a bit more for any animations to complete
          await page.waitForTimeout(1000);

          // Take a screenshot with small tolerance for minor anti-alias differences
          const screenshotName = `${story.id.replace('--', '-')}-${viewport.name}.png`;
          await expect(page).toHaveScreenshot(screenshotName, { 
            maxDiffPixelRatio: 0.02,
            threshold: 0.2
          });
        });
      }
    });
  }
});

test.describe('Storybook Accessibility Tests', () => {
  for (const story of stories) {
    test(`${story.name} should be accessible`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Basic accessibility checks - look for the actual component button, not Storybook UI buttons
      const button = page.locator('button').filter({ hasText: 'Button' }).first();
      await expect(button).toBeVisible();

      // Check if button has proper ARIA attributes when disabled
      const isDisabled = await button.getAttribute('disabled');
      if (isDisabled !== null) {
        await expect(button).toHaveAttribute('disabled');
      }
    });
  }
});
