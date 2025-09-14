import { test, expect } from '@playwright/test';

test('Level 1: select 3, immediate flips; full-board peek; admire/return; next season', async ({
  page,
}) => {
  const params = new URLSearchParams({
    nestCards: '1',
    seed: 'public-seed-001',
    testMode: '1', // reduce motion
    fastPeek: '1', // bypass 1s waits
  });
  await page.goto(`/?${params.toString()}`);

  // Start if intro present
  const begin = page.getByTestId('intro-begin');
  if (await begin.isVisible().catch(() => false)) await begin.click();

  const c0 = page.getByTestId('card-0');
  const c1 = page.getByTestId('card-1');
  const c2 = page.getByTestId('card-2');
  const c3 = page.getByTestId('card-3');
  const c4 = page.getByTestId('card-4');

  // Click three; each should move to "revealed" immediately
  await c0.click();
  await expect(c0).toHaveAttribute('data-state', 'revealed');
  await c1.click();
  await expect(c1).toHaveAttribute('data-state', 'revealed');
  await c2.click();
  await expect(c2).toHaveAttribute('data-state', 'revealed');

  // With fastPeek, the remaining cards should now be "shadow" (full-board peek)
  await expect(c3).toHaveAttribute('data-state', /shadow|revealed/);
  await expect(c4).toHaveAttribute('data-state', /shadow|revealed/);

  // End modal should be visible
  const modal = page.getByTestId('end-modal');
  await expect(modal).toBeVisible();
  await expect(modal).toContainText(/Nests that survived/i);
  await expect(modal).toContainText(/Eggs per clutch/i);

  // Admire → hide modal, board persists; return → modal back
  await page.getByTestId('btn-admire-board').click();
  await expect(modal).toBeHidden();

  await page.getByTestId('btn-return-results').click();
  await expect(modal).toBeVisible();

  // Next season → redeal resets states to hidden
  await page.getByTestId('btn-next-season').click();
  await expect(c0).toHaveAttribute('data-state', 'hidden');
  await expect(c1).toHaveAttribute('data-state', 'hidden');
  await expect(c2).toHaveAttribute('data-state', 'hidden');
});
