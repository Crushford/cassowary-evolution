import { test, expect } from "@playwright/test";

test("Population and years tick deterministically with seed", async ({ page }) => {
  const qs = new URLSearchParams({ seed: "l1-seed-002", testMode: "1", fastPeek: "1" });
  await page.goto(`/?${qs}`);

  const begin = page.getByTestId("intro-begin");
  if (await begin.isVisible().catch(() => false)) await begin.click();

  // Wait for cards to be visible
  await page.waitForSelector('[data-testid="card-0"]', { timeout: 10000 });

  const roundEl = page.locator('header').getByTestId("round");
  const yearsEl = page.locator('header').getByTestId("years");

  const clickThree = async () => {
    let clicked = 0;
    for (let i = 0; i < 5 && clicked < 3; i++) {
      const card = page.getByTestId(`card-${i}`);
      const state = await card.getAttribute("data-state");
      if (state === "hidden") {
        await card.click();
        clicked++;
      }
    }
  };

  while (true) {
    await clickThree();
    await expect(page.getByTestId("end-modal")).toBeVisible();

    const r = parseInt((await roundEl.textContent()) || "0", 10);
    const y = parseInt(((await yearsEl.textContent()) || "0").replace(/[^0-9]/g, ""), 10);
    expect(y).toBe(r * 100000);

    await page.getByTestId("btn-next-season").click();
    if (r >= 10) break;
  }

  expect(await roundEl.textContent()).toBe("10");
});
