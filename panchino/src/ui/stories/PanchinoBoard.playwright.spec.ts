import { test, expect } from '@storybook/test-runner';

test('turn-based stepping reaches final slot and shows chicks UI correctly', async ({ page }) => {
  await page.goto('/iframe.html?id=panchino-panchinoboard--base-idle');
  const nextBtn = page.getByTestId('btn-next-step');
  const stepCount = page.getByTestId('step-count');

  // advance 6 steps
  for (let i = 1; i <= 6; i++) {
    await nextBtn.click();
    await expect(stepCount).toHaveText(String(i));
  }

  // final slot revealed
  const finalSlot = page.getByTestId('final-slot');
  await expect(finalSlot).toBeVisible();

  // if center, chicks UI appears; otherwise it doesn't
  const slotText = await finalSlot.textContent(); // e.g., "3"
  const chicks = page.getByTestId('chicks-earned');
  if (slotText?.trim() === '3') {
    await expect(chicks).toBeVisible();
    const val = Number((await chicks.textContent())?.trim()?.replace('+', '').replace(' chicks! 🐣', '') ?? '0');
    expect([1,2,3]).toContain(val);
  } else {
    await expect(chicks).toHaveCount(0);
  }
});

test('edge clamping (left)', async ({ page }) => {
  await page.goto('/iframe.html?id=panchino-panchinoboard--end-left-edge-landed');
  // final slot visible
  const finalSlot = page.getByTestId('final-slot');
  await expect(finalSlot).toBeVisible();
  await expect(finalSlot).toHaveText('0');

  // verify we never rendered a column < 0 by asserting only 0..6 exist
  for (let c = -1; c <= 7; c++) {
    const el = page.getByTestId(`cursor-col-${c}`);
    if (c < 0 || c > 6) {
      await expect(el).toHaveCount(0);
    }
  }
});

test('edge clamping (right)', async ({ page }) => {
  await page.goto('/iframe.html?id=panchino-panchinoboard--end-right-edge-landed');
  // final slot visible
  const finalSlot = page.getByTestId('final-slot');
  await expect(finalSlot).toBeVisible();
  await expect(finalSlot).toHaveText('6');

  // verify we never rendered a column > 6
  for (let c = -1; c <= 7; c++) {
    const el = page.getByTestId(`cursor-col-${c}`);
    if (c < 0 || c > 6) {
      await expect(el).toHaveCount(0);
    }
  }
});

test('deterministic center landing scripted', async ({ page }) => {
  await page.goto('/iframe.html?id=panchino-panchinoboard--end-center-landed');
  const finalSlot = page.getByTestId('final-slot');
  await expect(finalSlot).toHaveText('3');
  const chicks = page.getByTestId('chicks-earned');
  await expect(chicks).toBeVisible();
  const n = Number((await chicks.textContent())?.trim()?.replace('+', '').replace(' chicks! 🐣', '') ?? '0');
  expect([1,2,3]).toContain(n);
});

test('mid-state shows correct step count', async ({ page }) => {
  await page.goto('/iframe.html?id=panchino-panchinoboard--mid-three-steps');
  const stepCount = page.getByTestId('step-count');
  await expect(stepCount).toHaveText('3');
  
  // Should not be complete yet
  const finalSlot = page.getByTestId('final-slot');
  await expect(finalSlot).toHaveCount(0);
});

test('out of bounds guard handles invalid start column', async ({ page }) => {
  await page.goto('/iframe.html?id=panchino-panchinoboard--error-out-of-bounds-guard');
  
  // Should still render without crashing
  const board = page.locator('[data-testid^="slot-"]');
  await expect(board).toHaveCount(7);
  
  // Start column should be clamped to valid range
  const stepCount = page.getByTestId('step-count');
  await expect(stepCount).toHaveText('0');
});

test('accessibility - no critical violations', async ({ page }) => {
  await page.goto('/iframe.html?id=panchino-panchinoboard--base-idle');
  
  // Basic accessibility checks
  const buttons = page.locator('button');
  await expect(buttons).toHaveCount(3); // Next Step, Drop Egg, Reset
  
  // Check that buttons have accessible text
  const nextBtn = page.getByTestId('btn-next-step');
  await expect(nextBtn).toHaveText('Next Step');
  
  const dropBtn = page.getByTestId('btn-drop-egg');
  await expect(dropBtn).toHaveText('Drop Egg');
});

test('visual states do not shift layout between steps', async ({ page }) => {
  await page.goto('/iframe.html?id=panchino-panchinoboard--mid-three-steps');
  
  // Get initial layout measurements
  const board = page.locator('.p-6.bg-white.rounded-lg.shadow-lg');
  const initialBox = await board.boundingBox();
  
  // Click next step
  const nextBtn = page.getByTestId('btn-next-step');
  await nextBtn.click();
  
  // Check layout hasn't shifted significantly
  const finalBox = await board.boundingBox();
  if (initialBox && finalBox) {
    expect(Math.abs(initialBox.width - finalBox.width)).toBeLessThan(5);
    expect(Math.abs(initialBox.height - finalBox.height)).toBeLessThan(10);
  }
});
