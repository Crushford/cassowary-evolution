import { test, expect } from '@chromatic-com/playwright';

test.describe('Button Component Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Button stories
    await page.goto('/iframe.html?id=components-button--primary');
    // Wait for the iframe to load and the component to be visible
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
  });

  test('Primary button visual snapshot', async ({ page }) => {
    // Take a screenshot of the primary button
    await expect(page).toHaveScreenshot('button-primary.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Secondary button visual snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--secondary');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('button-secondary.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Danger button visual snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--danger');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('button-danger.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Large button visual snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--large');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('button-large.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Small button visual snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--small');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('button-small.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Disabled button visual snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--disabled');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('button-disabled.png', { maxDiffPixelRatio: 0.02 });
  });
});

test.describe('Button Component Responsive Tests', () => {
  test('Button on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/iframe.html?id=components-button--primary');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('button-primary-mobile.png', { maxDiffPixelRatio: 0.02 });
  });

  test('Button on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/iframe.html?id=components-button--primary');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('button-primary-tablet.png', { maxDiffPixelRatio: 0.02 });
  });
});
