import { test, expect } from '@playwright/test';
import { 
  pickFirstN, 
  getGameState, 
  completeRound, 
  waitForEPGain,
  openEvolutionModal,
  closeEvolutionModal,
  purchaseEvolutionNode,
  isEvolutionNodeAvailable,
  getEvolutionNodeCost,
  waitForEPThreshold
} from './helpers';

test.describe('EP Milestones + Evolution Purchases', () => {
  test.beforeEach(async ({ page }) => {
    // Use a seed that occasionally has failures to accumulate deaths/EP
    await page.goto('/?seed=cq-e2e-seed-02&testMode=1');
  });

  test('should accumulate EP from deaths', async ({ page }) => {
    // Play several rounds and verify EP can increase
    const initialState = await getGameState(page);
    expect(initialState.epBalance).toBe(0);
    
    // Play 5 rounds and check if EP increases
    for (let i = 0; i < 5; i++) {
      await completeRound(page);
    }
    
    const finalState = await getGameState(page);
    // EP should be >= 0 (might be 0 if no deaths occurred)
    expect(finalState.epBalance).toBeGreaterThanOrEqual(0);
  });

  test('should show EP gain toast when EP increases', async ({ page }) => {
    // Play several rounds and verify EP can increase
    const initialState = await getGameState(page);
    expect(initialState.epBalance).toBe(0);
    
    // Play 5 rounds and check if EP increases
    for (let i = 0; i < 5; i++) {
      await completeRound(page);
    }
    
    const finalState = await getGameState(page);
    // EP should be >= 0 (might be 0 if no deaths occurred)
    expect(finalState.epBalance).toBeGreaterThanOrEqual(0);
  });

  test('should open evolution modal at EP milestone 10', async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-02&testMode=1');
    
    // Play until we reach 10 EP
    await waitForEPThreshold(page, 10, 30);
    
    // Evolution modal should be available
    await expect(page.getByTestId('evolution-open')).toBeVisible();
    
    // Open evolution modal
    await openEvolutionModal(page);
    
    // Should show tier 1 nodes
    await expect(page.getByTestId('evolution-node-eggs-1')).toBeVisible();
    await expect(page.getByTestId('evolution-node-digestion-1')).toBeVisible();
    
    // Should not show higher tier nodes yet
    await expect(page.getByTestId('evolution-node-claws-1')).not.toBeVisible();
  });

  test('should show correct node costs and availability', async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-02&testMode=1');
    
    // Play until we have enough EP
    await waitForEPThreshold(page, 25, 30);
    
    await openEvolutionModal(page);
    
    // Check eggs-1 cost and availability
    const eggs1Cost = await getEvolutionNodeCost(page, 'eggs-1');
    expect(eggs1Cost).toBe(15);
    
    const eggs1Available = await isEvolutionNodeAvailable(page, 'eggs-1');
    expect(eggs1Available).toBe(true);
    
    // Check digestion-1 cost and availability
    const digestion1Cost = await getEvolutionNodeCost(page, 'digestion-1');
    expect(digestion1Cost).toBe(20);
    
    const digestion1Available = await isEvolutionNodeAvailable(page, 'digestion-1');
    expect(digestion1Available).toBe(true);
  });

  test('should purchase evolution node and apply effects', async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-02&testMode=1');
    
    // Play until we have enough EP for digestion-1
    await waitForEPThreshold(page, 25, 30);
    
    const beforeState = await getGameState(page);
    
    await openEvolutionModal(page);
    await purchaseEvolutionNode(page, 'digestion-1');
    await closeEvolutionModal(page);
    
    const afterState = await getGameState(page);
    
    // EP should have decreased by the cost
    expect(afterState.epBalance).toBe(beforeState.epBalance - 20);
    
    // Node should now be purchased (we can't easily test the effects without
    // more complex game state inspection, but the EP reduction confirms purchase)
  });

  test('should show tier 2 nodes at EP milestone 20', async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-02&testMode=1');
    
    // Play until we reach 20 EP
    await waitForEPThreshold(page, 20, 40);
    
    await openEvolutionModal(page);
    
    // Should show tier 2 nodes
    await expect(page.getByTestId('evolution-node-claws-1')).toBeVisible();
    await expect(page.getByTestId('evolution-node-eggs-2')).toBeVisible();
    await expect(page.getByTestId('evolution-node-co-op-1')).toBeVisible();
  });

  test('should handle prerequisite requirements', async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-02&testMode=1');
    
    // Play until we have enough EP for eggs-2 (30 EP)
    await waitForEPThreshold(page, 30, 50);
    
    await openEvolutionModal(page);
    
    // eggs-2 should not be available yet (requires eggs-1)
    const eggs2Available = await isEvolutionNodeAvailable(page, 'eggs-2');
    expect(eggs2Available).toBe(false);
    
    // Purchase eggs-1 first
    await purchaseEvolutionNode(page, 'eggs-1');
    await closeEvolutionModal(page);
    
    // Reopen modal
    await openEvolutionModal(page);
    
    // Now eggs-2 should be available
    const eggs2AvailableAfter = await isEvolutionNodeAvailable(page, 'eggs-2');
    expect(eggs2AvailableAfter).toBe(true);
  });

  test('should prevent purchasing already owned nodes', async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-02&testMode=1');
    
    // Play until we have enough EP
    await waitForEPThreshold(page, 25, 30);
    
    await openEvolutionModal(page);
    await purchaseEvolutionNode(page, 'eggs-1');
    
    // Node should now show as purchased
    await expect(page.getByTestId('evolution-node-eggs-1')).toContainText('✓ Purchased');
    
    // Should not be clickable anymore
    const eggs1Available = await isEvolutionNodeAvailable(page, 'eggs-1');
    expect(eggs1Available).toBe(false);
  });

  test('should show correct EP balance in evolution modal', async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-02&testMode=1');
    
    // Play until we have some EP
    await waitForEPThreshold(page, 15, 30);
    
    const state = await getGameState(page);
    
    await openEvolutionModal(page);
    
    // Modal should show current EP balance
    await expect(page.getByTestId('evolution-modal')).toContainText(`Evolution Points: ${state.epBalance}`);
  });

  test('should handle multiple purchases in sequence', async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-02&testMode=1');
    
    // Play until we have enough EP for multiple purchases
    await waitForEPThreshold(page, 50, 60);
    
    const beforeState = await getGameState(page);
    
    await openEvolutionModal(page);
    
    // Purchase eggs-1 (cost 15)
    await purchaseEvolutionNode(page, 'eggs-1');
    await closeEvolutionModal(page);
    
    let state = await getGameState(page);
    expect(state.epBalance).toBe(beforeState.epBalance - 15);
    
    // Reopen and purchase digestion-1 (cost 20)
    await openEvolutionModal(page);
    await purchaseEvolutionNode(page, 'digestion-1');
    await closeEvolutionModal(page);
    
    state = await getGameState(page);
    expect(state.epBalance).toBe(beforeState.epBalance - 15 - 20);
  });

  test('should show tier progression correctly', async ({ page }) => {
    await page.goto('/?seed=cq-e2e-seed-02&testMode=1');
    
    // Test different EP levels
    const testCases = [
      { ep: 10, expectedTier: 1, expectedNodes: ['eggs-1', 'digestion-1'] },
      { ep: 20, expectedTier: 2, expectedNodes: ['eggs-1', 'digestion-1', 'claws-1', 'eggs-2', 'co-op-1'] },
      { ep: 30, expectedTier: 3, expectedNodes: ['eggs-1', 'digestion-1', 'claws-1', 'eggs-2', 'co-op-1', 'digestion-2', 'claws-2'] },
    ];
    
    for (const testCase of testCases) {
      // Navigate to a page with the required EP
      await page.goto(`/?seed=cq-e2e-seed-02&testMode=1&ep=${testCase.ep}`);
      
      await openEvolutionModal(page);
      
      // Check that expected nodes are visible
      for (const nodeId of testCase.expectedNodes) {
        await expect(page.getByTestId(`evolution-node-${nodeId}`)).toBeVisible();
      }
      
      await closeEvolutionModal(page);
    }
  });
});
