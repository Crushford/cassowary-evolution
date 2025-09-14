import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/React App/);
});

test('displays welcome message', async ({ page }) => {
  await page.goto('/');

  // Check for the welcome heading
  await expect(page.getByRole('heading', { name: 'Welcome to Evolution' })).toBeVisible();
});

test('displays get started button', async ({ page }) => {
  await page.goto('/');

  // Check for the Get Started button
  await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
});

test('displays learn more button', async ({ page }) => {
  await page.goto('/');

  // Check for the Learn More button
  await expect(page.getByRole('button', { name: 'Learn More' })).toBeVisible();
});
