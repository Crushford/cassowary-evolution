import { test, expect } from '@chromatic-com/playwright';
import { 
  getGameState, 
  completeRound, 
  handleIntroModal 
} from './helpers';

test.describe('Basic Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=cq-e2e-basic&testMode=1');
  });

  test('should complete basic game flow', async ({ page }) => {
    // Handle intro modal
    await handleIntroModal(page);
    
    // Verify initial state
    const initialState = await getGameState(page);
    expect(initialState.population).toBe(3);
    expect(initialState.round).toBe(0);
    expect(initialState.epBalance).toBe(0);
    expect(initialState.boardCardCount).toBe(5);
    
    // Play 3 rounds
    for (let i = 0; i < 3; i++) {
      const beforeState = await getGameState(page);
      await completeRound(page);
      const afterState = await getGameState(page);
      
      // Verify state is valid after each round
      expect(afterState.population).toBeGreaterThan(0);
      expect(afterState.boardCardCount).toBeGreaterThan(0);
      expect(afterState.epBalance).toBeGreaterThanOrEqual(0);
    }
    
    // Verify final state is still valid
    const finalState = await getGameState(page);
    expect(finalState.population).toBeGreaterThan(0);
    expect(finalState.boardCardCount).toBeGreaterThan(0);
  });

  test('should handle intro modal correctly', async ({ page }) => {
    // Check intro modal appears
    await page.getByTestId('intro-modal').waitFor();
    
    // Check intro modal content
    await expect(page.getByTestId('intro-modal')).toContainText('Cassowary Queen — Fruit Era');
    await expect(page.getByTestId('intro-modal')).toContainText('Choose 3 nests each season');
    
    // Test both buttons exist
    await expect(page.getByTestId('intro-next')).toBeVisible();
    await expect(page.getByTestId('intro-skip')).toBeVisible();
    
    // Test skip functionality
    await page.getByTestId('intro-skip').click();
    await page.getByTestId('intro-modal').waitFor({ state: 'hidden' });
    
    // Game should be ready to play
    const state = await getGameState(page);
    expect(state.population).toBe(3);
    expect(state.boardCardCount).toBe(5);
  });
});
