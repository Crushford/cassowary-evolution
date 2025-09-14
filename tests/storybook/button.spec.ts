import { test, expect } from '@playwright/test';

test.describe('Button Component Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Button stories
    await page.goto('/iframe.html?id=example-button--primary');
  });

  test('Primary button visual snapshot', async ({ page }) => {
    // Wait for the component to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the primary button
    await expect(page).toHaveScreenshot('button-primary.png');
  });

  test('Secondary button visual snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=example-button--secondary');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('button-secondary.png');
  });

  test('Danger button visual snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=example-button--danger');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('button-danger.png');
  });

  test('Large button visual snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=example-button--large');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('button-large.png');
  });

  test('Small button visual snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=example-button--small');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('button-small.png');
  });

  test('Disabled button visual snapshot', async ({ page }) => {
    await page.goto('/iframe.html?id=example-button--disabled');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('button-disabled.png');
  });
});

test.describe('Button Component Responsive Tests', () => {
  test('Button on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/iframe.html?id=example-button--primary');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('button-primary-mobile.png');
  });

  test('Button on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/iframe.html?id=example-button--primary');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('button-primary-tablet.png');
  });
});
