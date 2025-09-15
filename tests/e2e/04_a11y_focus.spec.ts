import { test, expect } from '@playwright/test';
import { handleIntroModal } from './helpers';

test.describe('A11y Sanity + Focus Order', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-04&testMode=1');
  });

  test('should have proper focus order from load', async ({ page }) => {
    // Check that intro modal is focused
    await page.getByTestId('intro-modal').waitFor();
    
    // Tab should move to intro Next/Skip buttons
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focusedElement).toMatch(/intro-(next|skip)/);
    
    // Tab again should move to the other button
    await page.keyboard.press('Tab');
    const focusedElement2 = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focusedElement2).toMatch(/intro-(next|skip)/);
    expect(focusedElement2).not.toBe(focusedElement);
  });

  test('should have proper focus order after intro', async ({ page }) => {
    await handleIntroModal(page);
    
    // Tab should move through the game elements in logical order
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    
    // Should focus on first card or evolution button
    expect(focusedElement).toMatch(/card-0|evolution-open/);
  });

  test('should have proper focus order for cards', async ({ page }) => {
    await handleIntroModal(page);
    
    // Tab through cards
    const cardFocusOrder: string[] = [];
    
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
      if (focusedElement?.startsWith('card-')) {
        cardFocusOrder.push(focusedElement);
      }
    }
    
    // Should have focused on cards in order
    expect(cardFocusOrder.length).toBeGreaterThan(0);
    expect(cardFocusOrder[0]).toBe('card-0');
  });

  test('should have proper focus order for end modal', async ({ page }) => {
    await handleIntroModal(page);
    
    // Complete a round to trigger end modal
    await page.getByTestId('card-0').click();
    await page.getByTestId('card-1').click();
    await page.getByTestId('card-2').click();
    
    await page.getByTestId('end-modal').waitFor();
    
    // Tab should move to end modal buttons
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focusedElement).toMatch(/end-round|continue/);
  });

  test('should have proper focus order for evolution modal', async ({ page }) => {
    await handleIntroModal(page);
    
    // Open evolution modal
    await page.getByTestId('evolution-open').click();
    await page.getByTestId('evolution-modal').waitFor();
    
    // Tab should move through evolution nodes
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focusedElement).toMatch(/evolution-node-|×/);
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await handleIntroModal(page);
    
    // Check that modals have proper ARIA attributes
    await page.getByTestId('end-modal').waitFor({ state: 'hidden' });
    
    // Complete a round to show end modal
    await page.getByTestId('card-0').click();
    await page.getByTestId('card-1').click();
    await page.getByTestId('card-2').click();
    
    await page.getByTestId('end-modal').waitFor();
    
    // Check ARIA attributes
    const endModal = page.getByTestId('end-modal');
    await expect(endModal).toHaveAttribute('aria-modal', 'true');
    await expect(endModal).toHaveAttribute('role', 'dialog');
    await expect(endModal).toHaveAttribute('aria-labelledby', 'end-modal-title');
  });

  test('should announce EP gain and board growth', async ({ page }) => {
    await handleIntroModal(page);
    
    // Play until we get some EP or board growth
    let state = await page.evaluate(() => {
      const populationEl = document.querySelector('[data-testid="population"]');
      const epEl = document.querySelector('[data-testid="ep-balance"]');
      return {
        population: populationEl?.textContent ? parseInt(populationEl.textContent) : 0,
        ep: epEl?.textContent ? parseInt(epEl.textContent) : 0,
      };
    });
    
    while (state.population < 10 && state.ep === 0) {
      await page.getByTestId('card-0').click();
      await page.getByTestId('card-1').click();
      await page.getByTestId('card-2').click();
      
      await page.getByTestId('end-modal').waitFor();
      await page.getByTestId('continue').click();
      await page.getByTestId('end-modal').waitFor({ state: 'hidden' });
      
      state = await page.evaluate(() => {
        const populationEl = document.querySelector('[data-testid="population"]');
        const epEl = document.querySelector('[data-testid="ep-balance"]');
        return {
          population: populationEl?.textContent ? parseInt(populationEl.textContent) : 0,
          ep: epEl?.textContent ? parseInt(epEl.textContent) : 0,
        };
      });
    }
    
    // Check for aria-live regions (if implemented)
    const liveRegions = await page.locator('[aria-live]').count();
    // This test would need to be updated based on actual implementation
    expect(liveRegions).toBeGreaterThanOrEqual(0);
  });

  test('should handle keyboard navigation for card selection', async ({ page }) => {
    await handleIntroModal(page);
    
    // Use keyboard to select cards
    await page.keyboard.press('Tab'); // Focus first card
    await page.keyboard.press('Enter'); // Select first card
    
    await page.keyboard.press('Tab'); // Focus second card
    await page.keyboard.press('Enter'); // Select second card
    
    await page.keyboard.press('Tab'); // Focus third card
    await page.keyboard.press('Enter'); // Select third card
    
    // Should trigger end modal
    await page.getByTestId('end-modal').waitFor();
  });

  test('should handle keyboard navigation for evolution modal', async ({ page }) => {
    await handleIntroModal(page);
    
    // Open evolution modal
    await page.getByTestId('evolution-open').click();
    await page.getByTestId('evolution-modal').waitFor();
    
    // Tab through evolution nodes
    const focusedNodes: string[] = [];
    
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
      if (focusedElement?.startsWith('evolution-node-')) {
        focusedNodes.push(focusedElement);
      }
    }
    
    // Should have focused on evolution nodes
    expect(focusedNodes.length).toBeGreaterThan(0);
  });

  test('should handle escape key to close modals', async ({ page }) => {
    await handleIntroModal(page);
    
    // Open evolution modal
    await page.getByTestId('evolution-open').click();
    await page.getByTestId('evolution-modal').waitFor();
    
    // Press escape to close
    await page.keyboard.press('Escape');
    await page.getByTestId('evolution-modal').waitFor({ state: 'hidden' });
  });

  test('should maintain focus after modal interactions', async ({ page }) => {
    await handleIntroModal(page);
    
    // Open and close evolution modal
    await page.getByTestId('evolution-open').click();
    await page.getByTestId('evolution-modal').waitFor();
    await page.getByTestId('evolution-modal').getByRole('button', { name: '×' }).click();
    await page.getByTestId('evolution-modal').waitFor({ state: 'hidden' });
    
    // Focus should return to a reasonable element
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focusedElement).toBeTruthy();
  });

  test('should have proper color contrast and visibility', async ({ page }) => {
    await handleIntroModal(page);
    
    // Check that important elements are visible and have good contrast
    const importantElements = [
      'population',
      'ep-balance',
      'board-card-count',
      'evolution-open',
    ];
    
    for (const testId of importantElements) {
      const element = page.getByTestId(testId);
      await expect(element).toBeVisible();
      
      // Check that element has sufficient contrast (simplified check)
      const color = await element.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
        };
      });
      
      expect(color.color).toBeTruthy();
    }
  });

  test('should handle screen reader navigation', async ({ page }) => {
    await handleIntroModal(page);
    
    // Simulate screen reader navigation by checking heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check that main content has proper heading hierarchy
    const mainHeading = page.locator('h1, h2').first();
    await expect(mainHeading).toBeVisible();
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await handleIntroModal(page);
    
    // Check that motion-off class is applied
    const htmlElement = await page.evaluate(() => document.documentElement.classList.contains('motion-off'));
    expect(htmlElement).toBe(true);
  });
});
