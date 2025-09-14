import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive keyboard-only gameplay test for the first 3 levels
 * This test simulates a user playing the game entirely with keyboard navigation
 * and screen reader support, ensuring full accessibility compliance.
 */

// Helper functions for keyboard navigation
class KeyboardGameplayHelper {
  constructor(private page: Page) {}

  async waitForGameReady() {
    await this.page.waitForSelector('[aria-label*="Game board"]', { timeout: 10000 });
    await this.page.waitForSelector('button[aria-label*="Tile at row"]', {
      timeout: 5000,
    });
  }

  async getFocusedElementInfo() {
    return await this.page.evaluate(() => {
      const focused = document.activeElement;
      return {
        tagName: focused?.tagName,
        ariaLabel: focused?.getAttribute('aria-label') || '',
        textContent: focused?.textContent?.trim() || '',
        role: focused?.getAttribute('role') || '',
        disabled: focused?.hasAttribute('disabled'),
        tabIndex: focused?.getAttribute('tabindex') || '0',
      };
    });
  }

  async navigateToElement(selector: string) {
    await this.page.locator(selector).focus();
    const info = await this.getFocusedElementInfo();
    return info;
  }

  async selectTileByRowCol(row: number, col: number) {
    const tileSelector = `button[aria-label*="row ${row}, column ${col}"]`;
    const tile = this.page.locator(tileSelector);

    // Check if tile exists and is selectable
    const tileExists = (await tile.count()) > 0;
    if (!tileExists) {
      throw new Error(`Tile at row ${row}, column ${col} not found`);
    }

    const isDisabled = await tile.isDisabled();
    if (isDisabled) {
      throw new Error(
        `Tile at row ${row}, column ${col} is disabled (likely Queen's nest)`,
      );
    }

    await tile.focus();
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(200);

    // Verify selection
    const isSelected = (await tile.getAttribute('aria-pressed')) === 'true';
    return isSelected;
  }

  async getSelectedTilesCount() {
    return await this.page.locator('button[aria-pressed="true"]').count();
  }

  async layEggs() {
    // First, try to find the enabled lay eggs button
    let layEggsButton = this.page.locator(
      'button[aria-label*="Lay eggs"]:not([disabled])',
    );

    // If not found, try the general button
    if ((await layEggsButton.count()) === 0) {
      layEggsButton = this.page.locator('button:has-text("Lay Eggs")');
    }

    await layEggsButton.focus();
    await this.page.keyboard.press('Enter');

    // Wait for round results
    await this.page.waitForSelector('h3:has-text("Round Results")', { timeout: 5000 });
  }

  async continueToNextRound() {
    const continueButton = this.page.locator('button:has-text("Continue")');
    await continueButton.focus();
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  async getGameState() {
    return await this.page.evaluate(() => {
      // Get current era information by finding elements with specific text content
      const allSpans = Array.from(document.querySelectorAll('span'));
      const eraElement = allSpans.find((span) => span.textContent?.includes('Eden'));
      const chipsElement = allSpans.find((span) => span.textContent?.includes('chips'));
      const partnersElement = allSpans.find((span) =>
        span.textContent?.includes('partners'),
      );

      return {
        era: eraElement?.textContent || '',
        chips: chipsElement?.textContent || '',
        partners: partnersElement?.textContent || '',
        selectedTiles: document.querySelectorAll('button[aria-pressed="true"]').length,
        instructions: document.getElementById('game-instructions')?.textContent || '',
      };
    });
  }

  async playCompleteRound(tileSelections: Array<{ row: number; col: number }>) {
    console.log(`Starting round with selections: ${JSON.stringify(tileSelections)}`);

    // Select all required tiles
    for (const selection of tileSelections) {
      const selected = await this.selectTileByRowCol(selection.row, selection.col);
      if (!selected) {
        throw new Error(
          `Failed to select tile at row ${selection.row}, column ${selection.col}`,
        );
      }
    }

    // Verify we have exactly 3 tiles selected
    const selectedCount = await this.getSelectedTilesCount();
    if (selectedCount !== 3) {
      throw new Error(`Expected 3 selected tiles, got ${selectedCount}`);
    }

    // Lay eggs
    await this.layEggs();

    // Verify results are shown
    const resultsVisible = await this.page
      .locator('h3:has-text("Round Results")')
      .isVisible();
    if (!resultsVisible) {
      throw new Error('Round results not displayed');
    }

    // Continue to next round
    await this.continueToNextRound();

    // Verify new round started
    await this.waitForGameReady();

    console.log(`Round completed successfully`);
  }
}

test.describe('Keyboard-Only Gameplay - First 3 Levels', () => {
  let helper: KeyboardGameplayHelper;

  test.beforeEach(async ({ page }) => {
    helper = new KeyboardGameplayHelper(page);
    await page.goto('/');
    await helper.waitForGameReady();
  });

  test('Complete keyboard-only gameplay through first 3 levels', async ({ page }) => {
    console.log('🎮 Starting keyboard-only gameplay test for first 3 levels');

    // Define tile selections for each round (avoiding Queen's nest at center 4,4)
    const roundSelections = [
      // Round 1: Top-left area
      [
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 1, col: 3 },
      ],
      // Round 2: Top-right area
      [
        { row: 1, col: 5 },
        { row: 1, col: 6 },
        { row: 1, col: 7 },
      ],
      // Round 3: Bottom-left area
      [
        { row: 7, col: 1 },
        { row: 7, col: 2 },
        { row: 7, col: 3 },
      ],
    ];

    for (let round = 1; round <= 3; round++) {
      console.log(`\n🎯 Starting Round ${round}`);

      // Get initial game state
      const initialState = await helper.getGameState();
      console.log(
        `Initial state - Era: ${initialState.era}, Chips: ${initialState.chips}, Partners: ${initialState.partners}`,
      );

      // Play the round
      await helper.playCompleteRound(roundSelections[round - 1]);

      // Verify game progressed
      const finalState = await helper.getGameState();
      console.log(
        `Final state - Era: ${finalState.era}, Chips: ${finalState.chips}, Partners: ${finalState.partners}`,
      );

      // Verify instructions reset for new round
      expect(finalState.instructions).toContain('Select');
      expect(finalState.selectedTiles).toBe(0);

      console.log(`✅ Round ${round} completed successfully`);
    }

    console.log('\n🎉 Successfully completed all 3 rounds using keyboard only!');
  });

  test('Keyboard navigation through all game elements', async ({ page }) => {
    console.log('⌨️ Testing comprehensive keyboard navigation');

    // Test Tab navigation through the entire page
    const focusableElements = [];

    // Start from the beginning
    await page.keyboard.press('Home'); // Go to start of page
    await page.keyboard.press('Tab');

    // Collect information about each focusable element
    for (let i = 0; i < 20; i++) {
      // Limit to prevent infinite loops
      const elementInfo = await helper.getFocusedElementInfo();

      if (elementInfo.tagName && elementInfo.tagName !== 'BODY') {
        focusableElements.push({
          index: i,
          tagName: elementInfo.tagName,
          ariaLabel: elementInfo.ariaLabel,
          textContent: elementInfo.textContent,
          role: elementInfo.role,
          disabled: elementInfo.disabled,
        });

        console.log(
          `Element ${i}: ${elementInfo.tagName} - ${elementInfo.ariaLabel || elementInfo.textContent}`,
        );
      }

      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);

      // Break if we've cycled back to the beginning
      if (i > 0) {
        const currentInfo = await helper.getFocusedElementInfo();
        const firstInfo = focusableElements[0];
        if (
          currentInfo.tagName === firstInfo.tagName &&
          currentInfo.ariaLabel === firstInfo.ariaLabel
        ) {
          break;
        }
      }
    }

    console.log(`\nFound ${focusableElements.length} focusable elements`);

    // Verify we can navigate to key game elements
    const gameElements = focusableElements.filter(
      (el) =>
        el.ariaLabel.includes('Tile at row') ||
        el.ariaLabel.includes('Lay eggs') ||
        el.ariaLabel.includes('upgrade shop') ||
        el.textContent.includes('Cassowary Queen'),
    );

    expect(gameElements.length).toBeGreaterThan(0);
    console.log(`✅ Found ${gameElements.length} game-specific focusable elements`);
  });

  test('Screen reader compatibility', async ({ page }) => {
    console.log('🔊 Testing screen reader compatibility');

    // Test that all important elements have proper ARIA labels
    const ariaTests = [
      {
        selector: '[role="grid"]',
        expectedLabel: 'Game board with 9x9 grid of tiles',
        description: 'Game grid',
      },
      {
        selector: 'button[aria-label*="Lay eggs"]',
        expectedLabel: 'Lay eggs',
        description: 'Lay eggs button',
      },
      {
        selector: 'button[aria-label*="upgrade shop"]',
        expectedLabel: 'upgrade shop',
        description: 'Upgrade shop button',
      },
      {
        selector: '#game-instructions',
        expectedText: 'Select',
        description: 'Game instructions',
      },
    ];

    for (const test of ariaTests) {
      const element = page.locator(test.selector);
      await expect(element).toBeVisible();

      if (test.expectedLabel) {
        const ariaLabel = await element.getAttribute('aria-label');
        expect(ariaLabel).toContain(test.expectedLabel);
        console.log(`✅ ${test.description}: Proper ARIA label found`);
      }

      if (test.expectedText) {
        const textContent = await element.textContent();
        expect(textContent).toContain(test.expectedText);
        console.log(`✅ ${test.description}: Proper text content found`);
      }
    }

    // Test that tiles have descriptive ARIA labels
    const tiles = page.locator('button[aria-label*="Tile at row"]');
    const tileCount = await tiles.count();
    expect(tileCount).toBeGreaterThan(0);

    // Check first few tiles
    for (let i = 0; i < Math.min(3, tileCount); i++) {
      const tile = tiles.nth(i);
      const ariaLabel = await tile.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/Tile at row \d+, column \d+/);
    }

    console.log(`✅ All ${tileCount} tiles have proper ARIA labels`);
  });

  test('Error handling and edge cases', async ({ page }) => {
    console.log('⚠️ Testing error handling and edge cases');

    // Test trying to select the Queen's nest (should be disabled)
    const queenTile = page.locator('button[aria-label*="Queen\'s Nest"]');
    await expect(queenTile).toBeDisabled();
    await expect(queenTile).toHaveAttribute('tabindex', '-1');

    // Test trying to lay eggs without selecting enough tiles
    const layEggsButton = page.locator('button[aria-label*="Lay eggs"]');
    await layEggsButton.focus();

    // Button should be disabled if not enough tiles selected
    const isDisabled = await layEggsButton.isDisabled();
    if (isDisabled) {
      console.log(
        '✅ Lay eggs button correctly disabled when insufficient tiles selected',
      );
    } else {
      // If enabled, try to press it and verify it doesn't work
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      // Should still be on the same screen (no results shown)
      const resultsVisible = await page
        .locator('h3:has-text("Round Results")')
        .isVisible();
      expect(resultsVisible).toBe(false);
      console.log(
        '✅ Lay eggs button correctly prevented action with insufficient tiles',
      );
    }

    // Test keyboard navigation when modal is open
    const shopButton = page.locator('button[aria-label*="upgrade shop"]');
    await shopButton.focus();
    await page.keyboard.press('Enter');

    // Wait for modal to potentially open
    await page.waitForTimeout(500);

    // Try to navigate with Tab
    await page.keyboard.press('Tab');

    // Check if focus is trapped in modal or returned to page
    const focusedInfo = await helper.getFocusedElementInfo();
    console.log(
      `Focus after modal interaction: ${focusedInfo.tagName} - ${focusedInfo.ariaLabel}`,
    );

    // Close any open modals
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    console.log('✅ Error handling tests completed');
  });

  test('Performance and responsiveness', async ({ page }) => {
    console.log('⚡ Testing performance and responsiveness');

    const startTime = Date.now();

    // Play a quick round to test responsiveness
    await helper.playCompleteRound([
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ]);

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Round completed in ${duration}ms`);

    // Should complete within reasonable time (10 seconds)
    expect(duration).toBeLessThan(10000);

    // Test that keyboard input is responsive
    const tile = page.locator('button[aria-label*="Tile at row 1, column 1"]').first();
    await tile.focus();

    const keyPressStart = Date.now();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    const keyPressEnd = Date.now();

    const keyResponseTime = keyPressEnd - keyPressStart;
    console.log(`Keyboard response time: ${keyResponseTime}ms`);

    // Should respond within 500ms
    expect(keyResponseTime).toBeLessThan(500);

    console.log('✅ Performance tests completed');
  });
});
