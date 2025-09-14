import { test, expect } from "@playwright/test";

test("tutorial 3x3: reaches population 100 with fixed seed and composition", async ({ page }) => {
  const seed = "cass-queen-seed-001";
  const params = new URLSearchParams({
    seed,
    testMode: "1",
    foodCount: "6",
    barrenCount: "2",
    predatorCount: "0",
    goal: "100",
  });

  await page.goto(`/?${params.toString()}`);

  // Dismiss webpack dev server overlay if it exists
  try {
    await page.locator('#webpack-dev-server-client-overlay').waitFor({ timeout: 1000 });
    await page.evaluate(() => {
      const overlay = document.getElementById('webpack-dev-server-client-overlay');
      if (overlay) {
        overlay.style.display = 'none';
      }
    });
  } catch (e) {
    // Overlay not present, continue
  }

  // Helpers
  const popEl = page.getByTestId("population");
  const roundEl = page.getByTestId("round");
  const endBtn = page.getByTestId("end-round");
  const contBtn = page.getByTestId("continue");

  // Tiles in reading order excluding center must exist with data-testids:
  const tileIds = [
    "tile-r0-c0","tile-r0-c1","tile-r0-c2",
    "tile-r1-c0",            "tile-r1-c2",
    "tile-r2-c0","tile-r2-c1","tile-r2-c2",
  ];

  async function clickFirstThree() {
    // Always pick the first 3 selectable tiles (deterministic policy)
    for (let i = 0; i < 3; i++) {
      const tile = page.getByTestId(tileIds[i]);
      await tile.waitFor({ state: 'visible' });
      await tile.click({ force: true });
    }
  }

  let rounds = 0;
  let population = parseInt(await popEl.textContent() || "0", 10);
  const MAX_GUARD = 50; // Reduced for faster testing

  while (population < 100 && rounds < MAX_GUARD) {
    await clickFirstThree();
    await expect(endBtn).toBeEnabled();
    await endBtn.click();

    // Wait for result panel and population update
    await expect(popEl).toHaveText(/\d+/);
    rounds = parseInt((await roundEl.textContent()) || "0", 10);
    population = parseInt((await popEl.textContent()) || "0", 10);

    // Proceed to the next deal
    await contBtn.click();
  }

  // Assert we actually reached the goal
  expect(population).toBeGreaterThanOrEqual(100);

  // Snapshot how many rounds it took — alerts us if algo/odds drift
  // First run will create the snapshot; subsequent runs will diff
  expect(`${rounds}`).toMatchSnapshot("rounds-to-pop-100.txt");
});
