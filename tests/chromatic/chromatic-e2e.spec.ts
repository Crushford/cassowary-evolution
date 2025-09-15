import { test, expect } from '@chromatic-com/playwright';

test.describe('Chromatic E2E Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-01&testMode=1');
  });

  test('Homepage visual snapshot', async ({ page }) => {
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Take a visual snapshot of the homepage
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('Intro modal visual snapshot', async ({ page }) => {
    // Wait for intro modal to appear
    await page.waitForSelector('[data-testid="intro-modal"]');
    
    // Take a visual snapshot of the intro modal
    await expect(page).toHaveScreenshot('intro-modal.png');
  });

  test('Game board visual snapshot', async ({ page }) => {
    // Skip intro modal
    await page.getByTestId('intro-skip').click();
    await page.waitForSelector('[data-testid="intro-modal"]', { state: 'hidden' });
    
    // Wait for game board to load
    await page.waitForSelector('[data-testid="card-0"]');
    
    // Take a visual snapshot of the game board
    await expect(page).toHaveScreenshot('game-board.png');
  });

  test('Evolution modal visual snapshot', async ({ page }) => {
    // Skip intro modal
    await page.getByTestId('intro-skip').click();
    await page.waitForSelector('[data-testid="intro-modal"]', { state: 'hidden' });
    
    // Play a few rounds to get some EP
    for (let i = 0; i < 3; i++) {
      await page.getByTestId(`card-${i}`).click();
    }
    
    // Wait for end modal and continue
    await page.getByTestId('continue').click();
    await page.waitForSelector('[data-testid="end-modal"]', { state: 'hidden' });
    
    // Repeat to get more EP
    for (let i = 0; i < 3; i++) {
      await page.getByTestId(`card-${i}`).click();
    }
    await page.getByTestId('continue').click();
    await page.waitForSelector('[data-testid="end-modal"]', { state: 'hidden' });
    
    // Open evolution modal if available
    const evolutionButton = page.getByTestId('evolution-open');
    if (await evolutionButton.isVisible()) {
      await evolutionButton.click();
      await page.waitForSelector('[data-testid="evolution-modal"]');
      
      // Take a visual snapshot of the evolution modal
      await expect(page).toHaveScreenshot('evolution-modal.png');
    }
  });
});
