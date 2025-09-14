import seedrandom from 'seedrandom';
import type { LevelRecipe, Outcome } from '../types/game';

const roundRng = (seed: string, n: number) => seedrandom(`${seed}::${n}`);

export function makeDeal(
  seed: string,
  globalRound: number,
  recipe: LevelRecipe,
): Outcome[] {
  const rng = roundRng(seed, globalRound);
  const { fruit, barren, predator } = recipe.composition;
  const arr: Outcome[] = [
    ...Array(fruit).fill('fruit'),
    ...Array(barren).fill('barren'),
    ...Array(predator).fill('predator'),
  ];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
