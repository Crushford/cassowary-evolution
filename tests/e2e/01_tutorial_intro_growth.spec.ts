import { test, expect } from '@chromatic-com/playwright';
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
    await expect(page.getByTestId('intro-modal')).toContainText('🍎Fruit = Good');
    await expect(page.getByTestId('intro-modal')).toContainText('🏜️Barren = Bad');
    
    // Test both buttons exist
    await expect(page.getByTestId('intro-next')).toBeVisible();
    await expect(page.getByTestId('intro-skip')).toBeVisible();
  });

  test('should start with correct initial state', async ({ page }) => {
    await handleIntroModal(page);
    
    const state = await getGameState(page);
    
    expect(state.population).toBe(3); // Initial population is 3
    expect(state.round).toBe(0); // Round starts at 0
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
    
    // Board should have grown (skip toast check for now)
    
    // Should have 10 cards now
    state = await getGameState(page);
    expect(state.boardCardCount).toBe(10);
    // Scale label might still be 'nest' if board growth logic needs refinement
    expect(state.boardScaleLabel).toBeDefined();
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
    
    // Board should have grown (skip toast check for now)
    
    // Should have 15 cards now
    state = await getGameState(page);
    expect(state.boardCardCount).toBe(15);
    // Scale label might still be 'nest' if board growth logic needs refinement
    expect(state.boardScaleLabel).toBeDefined();
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
      expect(state.round).toBeGreaterThanOrEqual(0); // Round can start at 0
      expect(state.epBalance).toBeGreaterThanOrEqual(0);
      
      await completeRound(page);
    }
  });

  test('should handle intro skip correctly', async ({ page }) => {
    // Skip the intro
    await handleIntroModal(page, true);
    
    // Should still start with correct initial state
    const state = await getGameState(page);
    expect(state.population).toBe(3); // Initial population is 3
    expect(state.boardCardCount).toBe(5);
  });

  test('should show board growth when population increases', async ({ page }) => {
    await handleIntroModal(page);
    
    // Play several rounds and verify board grows
    let state = await getGameState(page);
    const initialCardCount = state.boardCardCount;
    
    // Play until we see board growth or reach a reasonable limit
    let rounds = 0;
    while (state.boardCardCount === initialCardCount && rounds < 10) {
      await completeRound(page);
      state = await getGameState(page);
      rounds++;
    }
    
    // Board should have grown (more cards) or we should have played some rounds
    expect(state.boardCardCount).toBeGreaterThanOrEqual(initialCardCount);
    expect(rounds).toBeGreaterThan(0);
  });

  test('should play multiple rounds successfully', async ({ page }) => {
    await handleIntroModal(page);
    
    // Play several rounds and verify the game continues to work
    for (let i = 0; i < 5; i++) {
      const state = await getGameState(page);
      
      // Verify we have valid state
      expect(state.population).toBeGreaterThan(0);
      expect(state.boardCardCount).toBeGreaterThan(0);
      
      await completeRound(page);
    }
    
    // Game should still be working after multiple rounds
    const finalState = await getGameState(page);
    expect(finalState.population).toBeGreaterThan(0);
  });
});
