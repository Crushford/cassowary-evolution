import { test, expect } from '@playwright/test';
import { 
  pickFirstN, 
  getGameState, 
  completeRound, 
  waitForBoardGrowth, 
  handleIntroModal 
} from './helpers';

test.describe('Tutorial Flow + Intro + Basic Growth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-01&testMode=1');
  });

  test('should show intro modal and allow navigation', async ({ page }) => {
    // Check intro modal appears
    await page.getByTestId('intro-modal').waitFor();
    
    // Check intro modal content
    await expect(page.getByTestId('intro-modal')).toContainText('Cassowary Queen — Fruit Era');
    await expect(page.getByTestId('intro-modal')).toContainText('Choose 3 nests each season');
    await expect(page.getByTestId('intro-modal')).toContainText('🍎 Fruit = Good');
    await expect(page.getByTestId('intro-modal')).toContainText('🏜️ Barren = Bad');
    
    // Test both buttons exist
    await expect(page.getByTestId('intro-next')).toBeVisible();
    await expect(page.getByTestId('intro-skip')).toBeVisible();
  });

  test('should start with correct initial state', async ({ page }) => {
    await handleIntroModal(page);
    
    const state = await getGameState(page);
    
    expect(state.population).toBe(1);
    expect(state.round).toBe(1);
    expect(state.epBalance).toBe(0);
    expect(state.boardCardCount).toBe(5);
    expect(state.boardScaleLabel).toBe('nest');
  });

  test('should allow card selection and round completion', async ({ page }) => {
    await handleIntroModal(page);
    
    // Pick first 3 cards
    await pickFirstN(page, 3);
    
    // Wait for end modal
    await page.getByTestId('end-modal').waitFor();
    
    // Check end modal shows correct information
    await expect(page.getByTestId('end-modal')).toContainText('Season Results');
    await expect(page.getByTestId('end-modal')).toContainText('Nests that survived:');
    
    // Continue to next season
    await page.getByTestId('continue').click();
    
    // Verify we're back to the game board
    await page.getByTestId('end-modal').waitFor({ state: 'hidden' });
    await page.getByTestId('card-0').waitFor();
  });

  test('should grow board at population threshold 10', async ({ page }) => {
    await handleIntroModal(page);
    
    // Play rounds until population reaches 10
    let rounds = 0;
    let state = await getGameState(page);
    
    while (state.population < 10 && rounds < 20) {
      await completeRound(page);
      rounds++;
      state = await getGameState(page);
    }
    
    // Should have reached population 10
    expect(state.population).toBeGreaterThanOrEqual(10);
    
    // Should show board growth toast
    await waitForBoardGrowth(page);
    
    // Should have 10 cards now
    state = await getGameState(page);
    expect(state.boardCardCount).toBe(10);
    expect(state.boardScaleLabel).toBe('grove');
  });

  test('should grow board at population threshold 50', async ({ page }) => {
    await handleIntroModal(page);
    
    // Play rounds until population reaches 50
    let rounds = 0;
    let state = await getGameState(page);
    
    while (state.population < 50 && rounds < 50) {
      await completeRound(page);
      rounds++;
      state = await getGameState(page);
    }
    
    // Should have reached population 50
    expect(state.population).toBeGreaterThanOrEqual(50);
    
    // Should show board growth toast
    await waitForBoardGrowth(page);
    
    // Should have 15 cards now
    state = await getGameState(page);
    expect(state.boardCardCount).toBe(15);
    expect(state.boardScaleLabel).toBe('glade');
  });

  test('should maintain correct card count after growth', async ({ page }) => {
    await handleIntroModal(page);
    
    // Play until we reach 10 cards
    let state = await getGameState(page);
    while (state.boardCardCount < 10 && state.population < 50) {
      await completeRound(page);
      state = await getGameState(page);
    }
    
    // Should have exactly 10 cards
    expect(state.boardCardCount).toBe(10);
    
    // Play a few more rounds to ensure it stays at 10
    for (let i = 0; i < 3; i++) {
      await completeRound(page);
      state = await getGameState(page);
      expect(state.boardCardCount).toBe(10);
    }
  });

  test('should show correct round and population numbers', async ({ page }) => {
    await handleIntroModal(page);
    
    // Play several rounds and verify numbers are always valid
    for (let i = 0; i < 5; i++) {
      const state = await getGameState(page);
      
      expect(state.population).toBeGreaterThan(0);
      expect(state.round).toBeGreaterThan(0);
      expect(state.epBalance).toBeGreaterThanOrEqual(0);
      
      await completeRound(page);
    }
  });

  test('should handle intro skip correctly', async ({ page }) => {
    // Skip the intro
    await handleIntroModal(page, true);
    
    // Should still start with correct initial state
    const state = await getGameState(page);
    expect(state.population).toBe(1);
    expect(state.boardCardCount).toBe(5);
  });

  test('should show board growth toast exactly once per threshold', async ({ page }) => {
    await handleIntroModal(page);
    
    const toastCounts = {
      'toast-board-growth': 0,
    };
    
    // Play until we reach 10 cards
    let state = await getGameState(page);
    while (state.boardCardCount < 10 && state.population < 50) {
      await completeRound(page);
      
      // Check for board growth toast
      const toast = page.getByTestId('toast-board-growth');
      if (await toast.isVisible()) {
        toastCounts['toast-board-growth']++;
        // Wait for toast to disappear
        await toast.waitFor({ state: 'hidden' });
      }
      
      state = await getGameState(page);
    }
    
    // Should have shown board growth toast exactly once
    expect(toastCounts['toast-board-growth']).toBe(1);
  });

  test('should record rounds to reach thresholds', async ({ page }) => {
    await handleIntroModal(page);
    
    const startTime = Date.now();
    
    // Play until population 10
    let roundsTo10 = 0;
    let state = await getGameState(page);
    while (state.population < 10 && roundsTo10 < 20) {
      await completeRound(page);
      roundsTo10++;
      state = await getGameState(page);
    }
    
    // Play until population 50
    let roundsTo50 = roundsTo10;
    while (state.population < 50 && roundsTo50 < 50) {
      await completeRound(page);
      roundsTo50++;
      state = await getGameState(page);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // Should complete within reasonable time (testMode=1 should make this fast)
    expect(totalTime).toBeLessThan(30000); // 30 seconds max
    
    // Record the results for snapshot testing
    const results = {
      roundsTo10,
      roundsTo50,
      totalTime,
      finalPopulation: state.population,
      finalCardCount: state.boardCardCount,
    };
    
    expect(results).toMatchSnapshot('rounds-growth-l1.txt');
  });
});
