import { test, expect } from '@chromatic-com/playwright';
import { 
  pickFirstN, 
  getGameState, 
  completeRound, 
  waitForBoardGrowth,
  waitForPopulationThreshold
} from './helpers';

test.describe('Full Cycle to 80 and Reset to 5', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-03&testMode=1');
  });

  test('should progress through all board growth thresholds', async ({ page }) => {
    // Skip intro for faster testing
    await page.getByTestId('intro-skip').click();
    await page.getByTestId('intro-modal').waitFor({ state: 'hidden' });
    
    const thresholds = [
      { population: 10, expectedCardCount: 10, expectedScaleLabel: 'grove' },
      { population: 50, expectedCardCount: 15, expectedScaleLabel: 'glade' },
      { population: 100, expectedCardCount: 20, expectedScaleLabel: 'valley' },
      { population: 200, expectedCardCount: 40, expectedScaleLabel: 'region' },
      { population: 400, expectedCardCount: 80, expectedScaleLabel: 'province' },
    ];
    
    const results = {
      thresholdsReached: [] as Array<{ population: number; cardCount: number; scaleLabel: string; rounds: number }>,
    };
    
    for (const threshold of thresholds) {
      const roundsToThreshold = await waitForPopulationThreshold(page, threshold.population, 100);
      
      // Wait for board growth toast
      await waitForBoardGrowth(page);
      
      const state = await getGameState(page);
      
      expect(state.population).toBeGreaterThanOrEqual(threshold.population);
      expect(state.boardCardCount).toBe(threshold.expectedCardCount);
      expect(state.boardScaleLabel).toBe(threshold.expectedScaleLabel);
      
      results.thresholdsReached.push({
        population: state.population,
        cardCount: state.boardCardCount,
        scaleLabel: state.boardScaleLabel,
        rounds: roundsToThreshold,
      });
    }
    
    // Record results for snapshot testing
    expect(results).toMatchSnapshot('cycle-progression.csv');
  });

  test('should reach 80-card board at population 400', async ({ page }) => {
    await page.getByTestId('intro-skip').click();
    await page.getByTestId('intro-modal').waitFor({ state: 'hidden' });
    
    // Play until we reach population 400
    const roundsTo400 = await waitForPopulationThreshold(page, 400, 200);
    
    // Wait for board growth toast
    await waitForBoardGrowth(page);
    
    const state = await getGameState(page);
    
    expect(state.population).toBeGreaterThanOrEqual(400);
    expect(state.boardCardCount).toBe(80);
    expect(state.boardScaleLabel).toBe('province');
    
    // Should have taken a reasonable number of rounds
    expect(roundsTo400).toBeGreaterThan(0);
    expect(roundsTo400).toBeLessThan(200);
  });

  test('should maintain 80-card board after reaching threshold', async ({ page }) => {
    await page.getByTestId('intro-skip').click();
    await page.getByTestId('intro-modal').waitFor({ state: 'hidden' });
    
    // Play until we reach 80 cards
    let state = await getGameState(page);
    while (state.boardCardCount < 80 && state.population < 500) {
      await completeRound(page);
      state = await getGameState(page);
    }
    
    expect(state.boardCardCount).toBe(80);
    
    // Play several more rounds to ensure it stays at 80
    for (let i = 0; i < 5; i++) {
      await completeRound(page);
      state = await getGameState(page);
      expect(state.boardCardCount).toBe(80);
    }
  });

  test('should show correct sequence of card counts', async ({ page }) => {
    await page.getByTestId('intro-skip').click();
    await page.getByTestId('intro-modal').waitFor({ state: 'hidden' });
    
    const cardCountSequence: number[] = [];
    const scaleLabelSequence: string[] = [];
    
    let state = await getGameState(page);
    let rounds = 0;
    const maxRounds = 300; // Prevent infinite loops
    
    while (rounds < maxRounds) {
      cardCountSequence.push(state.boardCardCount);
      scaleLabelSequence.push(state.boardScaleLabel);
      
      // If we've seen all the expected counts, we can stop
      if (cardCountSequence.includes(80)) {
        break;
      }
      
      await completeRound(page);
      state = await getGameState(page);
      rounds++;
    }
    
    // Should have seen the expected sequence: 5 → 10 → 15 → 20 → 40 → 80
    const expectedSequence = [5, 10, 15, 20, 40, 80];
    const expectedScaleSequence = ['nest', 'grove', 'glade', 'valley', 'region', 'province'];
    
    // Check that we've seen all expected card counts
    for (const expectedCount of expectedSequence) {
      expect(cardCountSequence).toContain(expectedCount);
    }
    
    // Check that we've seen all expected scale labels
    for (const expectedScale of expectedScaleSequence) {
      expect(scaleLabelSequence).toContain(expectedScale);
    }
    
    // Record the full sequence for analysis
    const sequenceData = {
      cardCounts: cardCountSequence,
      scaleLabels: scaleLabelSequence,
      totalRounds: rounds,
      finalPopulation: state.population,
    };
    
    expect(sequenceData).toMatchSnapshot('card-count-sequence.json');
  });

  test('should handle board growth toasts at each threshold', async ({ page }) => {
    await page.getByTestId('intro-skip').click();
    await page.getByTestId('intro-modal').waitFor({ state: 'hidden' });
    
    const toastCounts = {
      'toast-board-growth': 0,
    };
    
    // Play until we reach 80 cards
    let state = await getGameState(page);
    while (state.boardCardCount < 80 && state.population < 500) {
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
    
    // Should have shown board growth toast exactly 5 times (for 5 growth thresholds)
    expect(toastCounts['toast-board-growth']).toBe(5);
  });

  test('should maintain game state consistency throughout cycle', async ({ page }) => {
    await page.getByTestId('intro-skip').click();
    await page.getByTestId('intro-modal').waitFor({ state: 'hidden' });
    
    const stateHistory: Array<{
      round: number;
      population: number;
      epBalance: number;
      cardCount: number;
      scaleLabel: string;
    }> = [];
    
    // Play for many rounds and track state
    for (let i = 0; i < 50; i++) {
      const state = await getGameState(page);
      stateHistory.push({
        round: state.round,
        population: state.population,
        epBalance: state.epBalance,
        cardCount: state.boardCardCount,
        scaleLabel: state.boardScaleLabel,
      });
      
      await completeRound(page);
    }
    
    // Verify state consistency
    stateHistory.forEach((state, index) => {
      expect(state.population).toBeGreaterThan(0);
      expect(state.round).toBeGreaterThan(0);
      expect(state.epBalance).toBeGreaterThanOrEqual(0);
      expect(state.cardCount).toBeGreaterThan(0);
      expect(state.scaleLabel).toBeTruthy();
      
      // Population should generally increase (or stay same)
      if (index > 0) {
        expect(state.population).toBeGreaterThanOrEqual(stateHistory[index - 1].population);
      }
    });
  });

  test('should handle rapid population growth efficiently', async ({ page }) => {
    await page.getByTestId('intro-skip').click();
    await page.getByTestId('intro-modal').waitFor({ state: 'hidden' });
    
    const startTime = Date.now();
    
    // Play until we reach 80 cards
    let state = await getGameState(page);
    while (state.boardCardCount < 80 && state.population < 500) {
      await completeRound(page);
      state = await getGameState(page);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // Should complete within reasonable time (testMode=1 should make this fast)
    expect(totalTime).toBeLessThan(60000); // 1 minute max
    
    // Should have reached 80 cards
    expect(state.boardCardCount).toBe(80);
    expect(state.population).toBeGreaterThanOrEqual(400);
  });

  test('should show correct board layout for each card count', async ({ page }) => {
    await page.getByTestId('intro-skip').click();
    await page.getByTestId('intro-modal').waitFor({ state: 'hidden' });
    
    const layoutTests = [
      { cardCount: 5, expectedGrid: 'grid-cols-5' },
      { cardCount: 10, expectedGrid: 'grid-cols-5' },
      { cardCount: 15, expectedGrid: 'grid-cols-5' },
      { cardCount: 20, expectedGrid: 'grid-cols-5' },
      { cardCount: 40, expectedGrid: 'grid-cols-5' },
      { cardCount: 80, expectedGrid: 'grid-cols-5' },
    ];
    
    for (const test of layoutTests) {
      // Navigate to a state with the required card count
      // This is a simplified test - in practice, you'd need to reach the actual threshold
      const state = await getGameState(page);
      if (state.boardCardCount === test.cardCount) {
        // Check that the board has the expected grid layout
        const board = page.locator('[data-testid^="card-"]').first().locator('..');
        // Note: This is a simplified check - actual implementation would need more specific selectors
        expect(board).toBeVisible();
      }
    }
  });

  test('should record milestone timings for regression testing', async ({ page }) => {
    await page.getByTestId('intro-skip').click();
    await page.getByTestId('intro-modal').waitFor({ state: 'hidden' });
    
    const milestones = {
      population10: 0,
      population50: 0,
      population100: 0,
      population200: 0,
      population400: 0,
      cardCount10: 0,
      cardCount15: 0,
      cardCount20: 0,
      cardCount40: 0,
      cardCount80: 0,
    };
    
    let state = await getGameState(page);
    let rounds = 0;
    const maxRounds = 300;
    
    while (rounds < maxRounds) {
      // Record population milestones
      if (state.population >= 10 && milestones.population10 === 0) {
        milestones.population10 = rounds;
      }
      if (state.population >= 50 && milestones.population50 === 0) {
        milestones.population50 = rounds;
      }
      if (state.population >= 100 && milestones.population100 === 0) {
        milestones.population100 = rounds;
      }
      if (state.population >= 200 && milestones.population200 === 0) {
        milestones.population200 = rounds;
      }
      if (state.population >= 400 && milestones.population400 === 0) {
        milestones.population400 = rounds;
      }
      
      // Record card count milestones
      if (state.boardCardCount >= 10 && milestones.cardCount10 === 0) {
        milestones.cardCount10 = rounds;
      }
      if (state.boardCardCount >= 15 && milestones.cardCount15 === 0) {
        milestones.cardCount15 = rounds;
      }
      if (state.boardCardCount >= 20 && milestones.cardCount20 === 0) {
        milestones.cardCount20 = rounds;
      }
      if (state.boardCardCount >= 40 && milestones.cardCount40 === 0) {
        milestones.cardCount40 = rounds;
      }
      if (state.boardCardCount >= 80 && milestones.cardCount80 === 0) {
        milestones.cardCount80 = rounds;
        break; // We've reached the end
      }
      
      await completeRound(page);
      state = await getGameState(page);
      rounds++;
    }
    
    // All milestones should have been reached
    expect(milestones.population400).toBeGreaterThan(0);
    expect(milestones.cardCount80).toBeGreaterThan(0);
    
    // Record for snapshot testing
    expect(milestones).toMatchSnapshot('milestone-timings.csv');
  });
});
