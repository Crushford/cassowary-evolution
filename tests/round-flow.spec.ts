import { test, expect } from '@playwright/test';

test("Level 1: select 3 → full-board peek → admire/return → next season", async ({ page }) => {
  const qs = new URLSearchParams({ seed: "l1-seed-001", testMode: "1", fastPeek: "1" });
  await page.goto(`/?${qs}`);

  const begin = page.getByTestId("intro-begin");
  if (await begin.isVisible().catch(() => false)) await begin.click();

  // Wait for cards to be visible
  await page.waitForSelector('[data-testid="card-0"]', { timeout: 10000 });

  const c = (i: number) => page.getByTestId(`card-${i}`);

  await c(0).click();
  await expect(c(0)).toHaveAttribute("data-state", "revealed");
  await c(1).click();
  await expect(c(1)).toHaveAttribute("data-state", "revealed");
  await c(2).click();
  await expect(c(2)).toHaveAttribute("data-state", "revealed");

  await expect(c(3)).toHaveAttribute("data-state", /shadow|revealed/);
  await expect(c(4)).toHaveAttribute("data-state", /shadow|revealed/);

  const modal = page.getByTestId("end-modal");
  await expect(modal).toBeVisible();
  await expect(modal).toContainText(/Nests that survived/i);
  await expect(modal).toContainText(/Eggs per clutch/i);

  await page.getByTestId("btn-admire-board").click();
  await expect(modal).toBeHidden();

  await page.getByTestId("btn-return-results").click();
  await expect(modal).toBeVisible();

  await page.getByTestId("btn-next-season").click();
  await expect(c(0)).toHaveAttribute("data-state", "hidden");
  await expect(c(1)).toHaveAttribute("data-state", "hidden");
  await expect(c(2)).toHaveAttribute("data-state", "hidden");
});
