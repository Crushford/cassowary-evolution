import { test, expect } from "@playwright/test";

test("Page loads and shows intro modal", async ({ page }) => {
  await page.goto('/');
  
  // Check if the intro modal is visible
  await expect(page.getByTestId("intro-begin")).toBeVisible();
  
  // Check if the title is correct
  await expect(page.getByRole('heading', { name: /Cassowary Queen/i })).toBeVisible();
});
