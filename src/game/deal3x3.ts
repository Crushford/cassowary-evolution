import { RNG } from '../lib/rng';

export type TileOutcome = 'food' | 'barren' | 'predator';

export function deal3x3(
  rng: RNG,
  cfg: {
    foodCount: number;
    barrenCount: number;
    predatorCount: number;
  }
) {
  // Coordinates for the 8 selectable tiles in reading order, skipping center (1,1)
  const coords: Array<[number, number]> = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (!(r === 1 && c === 1)) {
        coords.push([r, c]);
      }
    }
  }

  // Deterministic shuffle using Fisher-Yates + rng
  const arr = coords.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  const outcomes = new Map<string, TileOutcome>();
  const toKey = (rc: [number, number]) => `${rc[0]},${rc[1]}`;

  let idx = 0;
  for (let k = 0; k < cfg.predatorCount; k++) {
    outcomes.set(toKey(arr[idx++]), 'predator');
  }
  for (let k = 0; k < cfg.barrenCount; k++) {
    outcomes.set(toKey(arr[idx++]), 'barren');
  }
  for (; idx < arr.length; idx++) {
    outcomes.set(toKey(arr[idx]), 'food');
  }

  return { outcomes, order: coords }; // order = reading-order for the test to click
}
