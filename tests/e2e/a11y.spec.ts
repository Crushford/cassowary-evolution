import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Board screen has no critical a11y violations', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('#non-interactive-visualizations') // if you need to exclude charts etc.
    .analyze();

  const critical = results.violations.filter(v => 
    ['serious', 'critical'].includes(v.impact ?? '')
  );
  
  expect(critical, JSON.stringify(critical, null, 2)).toHaveLength(0);
});

test('Main page has proper color contrast', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const results = await new AxeBuilder({ page })
    .withRules(['color-contrast'])
    .analyze();

  const contrastViolations = results.violations.filter(v => 
    v.id === 'color-contrast'
  );
  
  expect(contrastViolations, JSON.stringify(contrastViolations, null, 2)).toHaveLength(0);
});

test('All interactive elements are keyboard accessible', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const results = await new AxeBuilder({ page })
    .withRules(['keyboard', 'focus-order-semantics'])
    .analyze();

  const keyboardViolations = results.violations.filter(v => 
    ['keyboard', 'focus-order-semantics'].includes(v.id)
  );
  
  expect(keyboardViolations, JSON.stringify(keyboardViolations, null, 2)).toHaveLength(0);
});
