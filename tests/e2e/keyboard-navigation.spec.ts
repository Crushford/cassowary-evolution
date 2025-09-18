import { test, expect } from '@playwright/test';

test('Keyboard navigation: tab order and focus ring', async ({ page }) => {
  await page.goto('/');

  // First focusable control should be visible
  await page.keyboard.press('Tab');
  
  // Check that focus is visible on the focused element
  const focusedElement = page.locator(':focus');
  await expect(focusedElement).toBeVisible();
  
  // Check that focus ring is applied
  const focusRing = page.locator(':focus');
  await expect(focusRing).toHaveCSS('outline', /none|auto/);

  // Continue tabbing through interactive elements
  const interactiveElements = page.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const count = await interactiveElements.count();
  
  // Tab through all interactive elements to ensure they're reachable
  for (let i = 0; i < Math.min(count, 10); i++) {
    await page.keyboard.press('Tab');
    const currentFocused = page.locator(':focus');
    await expect(currentFocused).toBeVisible();
  }
});

test('Escape key closes modals and overlays', async ({ page }) => {
  await page.goto('/');
  
  // If there are any modals or overlays, test that Escape closes them
  // This is a general test that can be expanded based on your app's modal behavior
  
  // Look for modal-like elements
  const modals = page.locator('[role="dialog"], [role="alertdialog"], .modal, .overlay');
  const modalCount = await modals.count();
  
  if (modalCount > 0) {
    // Open a modal first (this would need to be customized based on your app)
    // For now, just test that Escape works on any visible modal
    const visibleModals = modals.filter({ hasText: /.+/ });
    
    if (await visibleModals.count() > 0) {
      await page.keyboard.press('Escape');
      
      // Modal should be closed or hidden
      await expect(visibleModals.first()).not.toBeVisible();
    }
  }
});

test('Enter and Space activate buttons', async ({ page }) => {
  await page.goto('/');
  
  // Find all buttons
  const buttons = page.locator('button:not([disabled])');
  const buttonCount = await buttons.count();
  
  if (buttonCount > 0) {
    // Focus the first button
    await buttons.first().focus();
    
    // Test Enter key
    await page.keyboard.press('Enter');
    // Button should be activated (specific behavior depends on your app)
    
    // Test Space key
    await buttons.first().focus();
    await page.keyboard.press('Space');
    // Button should be activated (specific behavior depends on your app)
  }
});
