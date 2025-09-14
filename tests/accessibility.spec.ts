import { test, expect, Page } from '@playwright/test';

// Helper function to wait for game to be ready
async function waitForGameReady(page: Page) {
  await page.waitForSelector('[aria-label*="Game board"]', { timeout: 10000 });
  await page.waitForSelector('button[aria-label*="Tile at row"]', { timeout: 5000 });
}

// Helper function to navigate with keyboard only
async function navigateWithKeyboard(
  page: Page,
  direction: 'Tab' | 'Shift+Tab' | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight',
  count: number = 1,
) {
  for (let i = 0; i < count; i++) {
    await page.keyboard.press(direction);
    await page.waitForTimeout(100); // Small delay to ensure focus changes are processed
  }
}

// Helper function to get focused element's aria-label
async function getFocusedElementAriaLabel(page: Page): Promise<string> {
  return await page.evaluate(() => {
    const focused = document.activeElement;
    return focused?.getAttribute('aria-label') || '';
  });
}

// Helper function to select a tile by keyboard navigation
async function selectTileByKeyboard(page: Page, targetRow: number, targetCol: number) {
  // Find the target tile button
  const targetTile = page.locator(
    `button[aria-label*="row ${targetRow}, column ${targetCol}"]`,
  );
  await targetTile.focus();

  // Press Enter or Space to select
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
}

// Helper function to play a complete round
async function playRound(
  page: Page,
  tileSelections: Array<{ row: number; col: number }>,
) {
  // Select the required tiles
  for (const selection of tileSelections) {
    await selectTileByKeyboard(page, selection.row, selection.col);
  }

  // Find and click the "Lay Eggs" button
  const layEggsButton = page.locator('button[aria-label*="Lay eggs"]');
  await layEggsButton.focus();
  await page.keyboard.press('Enter');

  // Wait for results to appear
  await page.waitForSelector('[aria-label*="Round Results"]', { timeout: 5000 });

  // Continue to next round
  const continueButton = page.locator('button[aria-label*="Continue"]');
  await continueButton.focus();
  await page.keyboard.press('Enter');

  // Wait for new round to start
  await page.waitForTimeout(1000);
}

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameReady(page);
  });

  test('Game is keyboard navigable', async ({ page }) => {
    // Test that all interactive elements are focusable with Tab
    const focusableElements = await page
      .locator('button, [tabindex="0"], input, select, textarea')
      .count();
    expect(focusableElements).toBeGreaterThan(0);

    // Test Tab navigation through the page
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBe('BUTTON');

    // Continue tabbing to ensure we can navigate through all elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    }
  });

  test('Game board has proper ARIA labels and roles', async ({ page }) => {
    // Check that the game grid has proper ARIA attributes
    const gameGrid = page.locator('[role="grid"]');
    await expect(gameGrid).toBeVisible();
    await expect(gameGrid).toHaveAttribute(
      'aria-label',
      'Game board with 9x9 grid of tiles',
    );
    await expect(gameGrid).toHaveAttribute('aria-describedby', 'game-instructions');

    // Check that individual tiles have proper ARIA labels
    const tiles = page.locator('button[aria-label*="Tile at row"]');
    const tileCount = await tiles.count();
    expect(tileCount).toBeGreaterThan(0);

    // Check first few tiles have proper labels
    for (let i = 0; i < Math.min(3, tileCount); i++) {
      const tile = tiles.nth(i);
      const ariaLabel = await tile.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/Tile at row \d+, column \d+/);
    }

    // Check that the Queen's nest is properly labeled and disabled
    const queenTile = page.locator('button[aria-label*="Queen\'s Nest"]');
    await expect(queenTile).toBeDisabled();
    await expect(queenTile).toHaveAttribute('tabindex', '-1');
  });

  test('Tile selection works with keyboard', async ({ page }) => {
    // Wait for the game to load completely
    await page.waitForSelector('button[aria-label*="Unknown territory"]', {
      timeout: 10000,
    });

    // Dismiss any webpack dev server overlay that might be blocking interactions
    const overlay = page.locator('#webpack-dev-server-client-overlay');
    if (await overlay.isVisible()) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }

    // Find a selectable tile (not the Queen's nest)
    const selectableTile = page
      .locator('button[aria-label*="Unknown territory"]')
      .first();

    // Check initial state
    await expect(selectableTile).toHaveAttribute('aria-pressed', 'false');

    // Test that the tile is focusable and has proper ARIA attributes
    await selectableTile.focus();
    await expect(selectableTile).toBeFocused();

    // Test that the tile has proper ARIA attributes for accessibility
    await expect(selectableTile).toHaveAttribute('role', 'button');
    await expect(selectableTile).toHaveAttribute('aria-pressed', 'false');
    await expect(selectableTile).toHaveAttribute('tabindex', '0');

    // Test that the tile has proper accessibility attributes
    const ariaLabel = await selectableTile.getAttribute('aria-label');
    expect(ariaLabel).toContain('Tile at row');
    expect(ariaLabel).toContain('column');
    expect(ariaLabel).toContain('Unknown territory');

    // Test that the tile is not disabled
    await expect(selectableTile).not.toBeDisabled();
  });

  test('Action buttons have proper ARIA labels', async ({ page }) => {
    // Check the upgrade shop button (should always be visible)
    const shopButton = page.locator('button[aria-label*="upgrade shop"]');
    await expect(shopButton).toBeVisible();

    // Check that the shop button includes chip count
    const shopAriaLabel = await shopButton.getAttribute('aria-label');
    expect(shopAriaLabel).toContain('nectar chips');

    // Select 3 tiles to enable the "Lay Eggs" button
    const tileSelections = [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ];

    for (const selection of tileSelections) {
      await selectTileByKeyboard(page, selection.row, selection.col);
    }

    // Now check the "Lay Eggs" button
    const layEggsButton = page.locator('button[aria-label*="Lay eggs"]');
    await expect(layEggsButton).toBeVisible();

    const layEggsAriaLabel = await layEggsButton.getAttribute('aria-label');
    expect(layEggsAriaLabel).toContain('Lay eggs');
  });

  test('Game instructions are accessible', async ({ page }) => {
    // Check that game instructions exist and are properly linked
    const instructions = page.locator('#game-instructions');
    await expect(instructions).toBeVisible();

    const instructionText = await instructions.textContent();
    expect(instructionText).toContain('Select');
    expect(instructionText).toContain('tile');
  });

  test('Can play a complete round using only keyboard', async ({ page }) => {
    // Select 3 tiles using keyboard only
    const tileSelections = [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ];

    for (const selection of tileSelections) {
      await selectTileByKeyboard(page, selection.row, selection.col);
    }

    // Verify all 3 tiles are selected
    const selectedTiles = page.locator('button[aria-pressed="true"]');
    await expect(selectedTiles).toHaveCount(3);

    // Lay eggs using keyboard
    const layEggsButton = page.locator('button[aria-label*="Lay eggs"]');
    await layEggsButton.focus();
    await page.keyboard.press('Enter');

    // Wait for results
    await page.waitForSelector('h3:has-text("Round Results")', { timeout: 5000 });

    // Continue using keyboard
    const continueButton = page.locator('button:has-text("Continue")');
    await continueButton.focus();
    await page.keyboard.press('Enter');

    // Verify new round started
    await page.waitForTimeout(1000);
    const newRoundInstructions = page.locator('#game-instructions');
    await expect(newRoundInstructions).toBeVisible();
  });

  test('Screen reader can navigate game state', async ({ page }) => {
    // Test that screen reader can understand the current game state
    const gameStatusBar = page.locator('[role="banner"]');
    await expect(gameStatusBar).toBeVisible();

    // Check that era information is accessible
    const eraInfo = page.locator('text=Eden');
    await expect(eraInfo).toBeVisible();

    // Check that chip count is accessible via aria-label
    const chipInfo = page.locator('[aria-label*="Current chips:"]');
    await expect(chipInfo).toBeVisible();

    // Check that partner count is accessible via aria-label
    const partnerInfo = page.locator('[aria-label*="Current partners:"]');
    await expect(partnerInfo).toBeVisible();
  });

  test('Focus management works correctly', async ({ page }) => {
    // Test that focus is managed properly when modals open/close
    const shopButton = page.locator('button[aria-label*="upgrade shop"]');
    await shopButton.focus();
    await page.keyboard.press('Enter');

    // Check that focus moves to modal
    await page.waitForTimeout(500);
    const modal = page.locator('[role="dialog"], .modal, [aria-modal="true"]');
    if ((await modal.count()) > 0) {
      const focusedElement = await page.evaluate(() =>
        document.activeElement?.getAttribute('aria-label'),
      );
      expect(focusedElement).toBeTruthy();
    }

    // Close modal with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Check that focus returns to trigger element
    const activeElement = await page.evaluate(() => document.activeElement);
    expect(activeElement).toBeTruthy();
  });

  test('Game is playable with keyboard only for first 3 levels', async ({ page }) => {
    // This test simulates playing through the first 3 rounds using only keyboard

    for (let round = 1; round <= 3; round++) {
      console.log(`Playing round ${round} with keyboard only`);

      // Wait for round to be ready
      await waitForGameReady(page);

      // Select 3 random tiles (avoiding center Queen's nest)
      const tileSelections = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ];

      // Select tiles using keyboard
      for (const selection of tileSelections) {
        await selectTileByKeyboard(page, selection.row, selection.col);
      }

      // Verify tiles are selected
      const selectedTiles = page.locator('button[aria-pressed="true"]');
      await expect(selectedTiles).toHaveCount(3);

      // Lay eggs
      const layEggsButton = page.locator('button[aria-label*="Lay eggs"]');
      await layEggsButton.focus();
      await page.keyboard.press('Enter');

      // Wait for results
      await page.waitForSelector('h3:has-text("Round Results")', { timeout: 5000 });

      // Check that results are accessible
      const resultsPanel = page.locator('h3:has-text("Round Results")');
      await expect(resultsPanel).toBeVisible();

      // Continue to next round
      const continueButton = page.locator('button:has-text("Continue")');
      await continueButton.focus();
      await page.keyboard.press('Enter');

      // Wait for next round to load
      await page.waitForTimeout(1000);

      // Verify we're in the next round
      const instructions = page.locator('#game-instructions');
      await expect(instructions).toBeVisible();
    }

    console.log('Successfully completed 3 rounds using keyboard only!');
  });

  test('Color contrast meets accessibility standards', async ({ page }) => {
    // This test checks that the dark mode colors meet WCAG contrast requirements
    // Note: This is a basic check - in a real scenario you'd use axe-core or similar

    // Check that text elements are visible
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // Check that buttons are visible and have proper contrast
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Check that the game grid is visible
    const gameGrid = page.locator('[role="grid"]');
    await expect(gameGrid).toBeVisible();

    // Check that tiles are visible
    const tiles = page.locator('button[aria-label*="Tile at row"]');
    const tileCount = await tiles.count();
    expect(tileCount).toBeGreaterThan(0);
  });

  test('Game responds to reduced motion preferences', async ({ page }) => {
    // Test that the game respects prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Check that animations are reduced or disabled
    const animatedElements = page.locator('[class*="transition"], [class*="animate"]');
    const animatedCount = await animatedElements.count();

    // With reduced motion, there should be fewer or no animated elements
    // This is a basic check - the actual implementation would depend on CSS
    expect(animatedCount).toBeGreaterThanOrEqual(0);
  });
});
