import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/React App/);
});

test('displays game title', async ({ page }) => {
  await page.goto('/');

  // Check for the game heading
  await expect(page.getByRole('heading', { name: '🦚 Cassowary Queen' })).toBeVisible();
});

test('displays game description', async ({ page }) => {
  await page.goto('/');

  // Check for the game description
  await expect(page.getByText('Choose 3 nests. Flip to see what fate dealt.')).toBeVisible();
});

test('displays game grid', async ({ page }) => {
  await page.goto('/');

  // Check for the game grid
  await expect(page.getByRole('grid', { name: '3x3 game board' })).toBeVisible();
});
