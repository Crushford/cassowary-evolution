import { test, expect } from '@chromatic-com/playwright';

test('Simple Chromatic test', async ({ page }) => {
  await page.goto('/');
  
  // Take a visual snapshot
  await expect(page).toHaveScreenshot('simple-page.png');
});
