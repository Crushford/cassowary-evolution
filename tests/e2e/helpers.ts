import { Page } from '@playwright/test';

/**
 * Helper function to pick the first N cards in a deterministic order
 * This ensures consistent E2E test behavior
 */
export async function pickFirstN(page: Page, n: number): Promise<void> {
  console.log('🔍 pickFirstN: Starting card selection...');
  
  // Debug: Check current game state
  const gameState = await page.evaluate(() => {
    const state = (window as any).__gameState || 'unknown';
    const cards = document.querySelectorAll('[data-testid^="card-"]');
    const cardStates = Array.from(cards).map(card => ({
      testId: card.getAttribute('data-testid'),
      state: card.getAttribute('data-state'),
      visible: card.offsetParent !== null
    }));
    return { state, cardStates };
  });
  console.log('🎮 Game state:', gameState);
  
  // Make sure all modals are closed first
  const introModal = page.getByTestId('intro-modal');
  if (await introModal.isVisible()) {
    console.log('📋 Intro modal detected, closing...');
    await page.getByTestId('intro-skip').click();
    await introModal.waitFor({ state: 'hidden' });
  }
  
  // Check for end modal and close it
  const endModal = page.getByTestId('end-modal');
  if (await endModal.isVisible()) {
    console.log('🏁 End modal detected, closing...');
    await page.getByTestId('continue').click();
    await endModal.waitFor({ state: 'hidden' });
  }
  
  // Check for level complete modal and close it
  const levelCompleteModal = page.getByTestId('level-complete-modal');
  if (await levelCompleteModal.isVisible()) {
    console.log('📋 Level complete modal detected, closing...');
    await page.getByTestId('btn-advance-level').click();
    await levelCompleteModal.waitFor({ state: 'hidden' });
  }
  
  // Wait for cards to be available and in the correct state
  console.log('⏳ Waiting for card-0 to be visible...');
  await page.getByTestId('card-0').waitFor({ state: 'visible' });
  
  // Debug: Check card states before waiting
  const cardStatesBefore = await page.evaluate(() => {
    const cards = document.querySelectorAll('[data-testid^="card-"]');
    return Array.from(cards).map(card => ({
      testId: card.getAttribute('data-testid'),
      state: card.getAttribute('data-state'),
      visible: card.offsetParent !== null
    }));
  });
  console.log('🃏 Card states before wait:', cardStatesBefore);
  
  // Wait for cards to be in the correct state (not hidden)
  console.log('⏳ Waiting for cards to be in correct state...');
  try {
    await page.waitForFunction(() => {
      const cards = document.querySelectorAll('[data-testid^="card-"]');
      const allReady = Array.from(cards).every(card => card.getAttribute('data-state') !== 'hidden');
      console.log('Card state check:', Array.from(cards).map(c => c.getAttribute('data-state')), 'allReady:', allReady);
      return allReady;
    }, { timeout: 2000 }); // Much shorter timeout
    console.log('✅ Cards are in correct state');
  } catch (error) {
    console.log('❌ Cards never reached correct state, trying to force game start...');
    
    // Try to force the game to start by clicking a card anyway
    try {
      console.log('🔄 Attempting to force click card-0...');
      await page.getByTestId('card-0').click({ force: true, timeout: 1000 });
      console.log('✅ Force click successful');
    } catch (forceError) {
      console.log('❌ Force click failed:', forceError);
    }
    
    // Debug: Check final card states
    try {
      const cardStatesAfter = await page.evaluate(() => {
        const cards = document.querySelectorAll('[data-testid^="card-"]');
        return Array.from(cards).map(card => ({
          testId: card.getAttribute('data-testid'),
          state: card.getAttribute('data-state'),
          visible: card.offsetParent !== null
        }));
      });
      console.log('🃏 Card states after timeout:', cardStatesAfter);
    } catch (evalError) {
      console.log('❌ Could not evaluate card states:', evalError);
    }
  }
  
  for (let i = 0; i < n; i++) {
    console.log(`🃏 Clicking card-${i}...`);
    // Ensure card is clickable before clicking
    await page.getByTestId(`card-${i}`).waitFor({ state: 'visible' });
    await page.getByTestId(`card-${i}`).click({ timeout: 5000 });
    console.log(`✅ Card-${i} clicked successfully`);
  }
}

/**
 * Helper function to wait for and dismiss toasts
 */
export async function waitForToast(page: Page, testId: string, timeout = 5000): Promise<void> {
  await page.getByTestId(testId).waitFor({ timeout });
  // Wait a bit for the toast to be visible
  await page.waitForTimeout(1000);
}

/**
 * Helper function to get current game state values
 */
export async function getGameState(page: Page) {
  const population = await page.getByTestId('population').textContent();
  const round = await page.getByTestId('round').textContent();
  const epBalance = await page.getByTestId('ep-balance').textContent();
  const boardCardCount = await page.getByTestId('board-card-count').textContent();
  const boardScaleLabel = await page.getByTestId('board-scale-label').textContent();

  return {
    population: parseInt(population || '0'),
    round: parseInt(round || '0'),
    epBalance: parseInt(epBalance || '0'),
    boardCardCount: parseInt(boardCardCount || '0'),
    boardScaleLabel: boardScaleLabel || '',
  };
}

/**
 * Helper function to complete a full round
 */
export async function completeRound(page: Page, picksPerRound = 3): Promise<void> {
  // Pick the first N cards
  await pickFirstN(page, picksPerRound);
  
  // Wait for the end modal to appear
  await page.getByTestId('end-modal').waitFor();
  
  // Click continue to next season
  await page.getByTestId('continue').click();
  
  // Wait for the modal to close
  await page.getByTestId('end-modal').waitFor({ state: 'hidden' });
}

/**
 * Helper function to wait for board growth
 */
export async function waitForBoardGrowth(page: Page): Promise<void> {
  await waitForToast(page, 'toast-board-growth');
}

/**
 * Helper function to wait for EP gain
 */
export async function waitForEPGain(page: Page): Promise<void> {
  await waitForToast(page, 'toast-ep-gain');
}

/**
 * Helper function to open evolution modal
 */
export async function openEvolutionModal(page: Page): Promise<void> {
  await page.getByTestId('evolution-open').click();
  await page.getByTestId('evolution-modal').waitFor();
}

/**
 * Helper function to close evolution modal
 */
export async function closeEvolutionModal(page: Page): Promise<void> {
  await page.getByTestId('evolution-modal').getByRole('button', { name: '×' }).click();
  await page.getByTestId('evolution-modal').waitFor({ state: 'hidden' });
}

/**
 * Helper function to purchase an evolution node
 */
export async function purchaseEvolutionNode(page: Page, nodeId: string): Promise<void> {
  await page.getByTestId(`evolution-node-${nodeId}`).click();
  // Wait for the purchase to complete (modal might close or update)
  await page.waitForTimeout(500);
}

/**
 * Helper function to check if evolution node is available for purchase
 */
export async function isEvolutionNodeAvailable(page: Page, nodeId: string): Promise<boolean> {
  const node = page.getByTestId(`evolution-node-${nodeId}`);
  const isVisible = await node.isVisible();
  if (!isVisible) return false;
  
  // Check if the node is clickable (not disabled)
  const isDisabled = await node.evaluate(el => el.classList.contains('opacity-60'));
  return !isDisabled;
}

/**
 * Helper function to get evolution node cost
 */
export async function getEvolutionNodeCost(page: Page, nodeId: string): Promise<number> {
  const node = page.getByTestId(`evolution-node-${nodeId}`);
  const costText = await node.locator('text=/Cost: \\d+/').textContent();
  const cost = parseInt(costText?.match(/\d+/)?.[0] || '0');
  return cost;
}

/**
 * Helper function to wait for intro modal and handle it
 */
export async function handleIntroModal(page: Page, skip = false): Promise<void> {
  console.log('📋 Waiting for intro modal...');
  await page.getByTestId('intro-modal').waitFor({ timeout: 10000 });
  console.log('📋 Intro modal found, clicking button...');
  
  if (skip) {
    await page.getByTestId('intro-skip').click();
  } else {
    await page.getByTestId('intro-next').click();
  }
  
  console.log('📋 Waiting for intro modal to close...');
  await page.getByTestId('intro-modal').waitFor({ state: 'hidden', timeout: 10000 });
  console.log('✅ Intro modal closed');
  
  // Wait a bit for the game to initialize after intro closes
  await page.waitForTimeout(1000);
}

/**
 * Helper function to wait for a specific population threshold
 */
export async function waitForPopulationThreshold(page: Page, threshold: number, maxRounds = 50): Promise<number> {
  let rounds = 0;
  
  while (rounds < maxRounds) {
    const state = await getGameState(page);
    
    if (state.population >= threshold) {
      return rounds;
    }
    
    await completeRound(page);
    rounds++;
  }
  
  throw new Error(`Failed to reach population ${threshold} within ${maxRounds} rounds`);
}

/**
 * Helper function to wait for a specific EP threshold
 */
export async function waitForEPThreshold(page: Page, threshold: number, maxRounds = 50): Promise<number> {
  let rounds = 0;
  
  while (rounds < maxRounds) {
    const state = await getGameState(page);
    
    if (state.epBalance >= threshold) {
      return rounds;
    }
    
    await completeRound(page);
    rounds++;
  }
  
  throw new Error(`Failed to reach EP ${threshold} within ${maxRounds} rounds`);
}
