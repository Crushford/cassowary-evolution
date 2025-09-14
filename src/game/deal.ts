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

  console.log('🎲 makeDeal called:', {
    seed,
    globalRound,
    recipe: {
      tileCount: recipe.tileCount,
      composition: recipe.composition,
    },
    total: fruit + barren + predator,
  });

  const arr: Outcome[] = [
    ...Array(fruit).fill('fruit'),
    ...Array(barren).fill('barren'),
    ...Array(predator).fill('predator'),
  ];

  console.log('🎲 Array before shuffle:', {
    length: arr.length,
    arr: arr.slice(0, 10), // Show first 10 for debugging
    fruit: arr.filter((o) => o === 'fruit').length,
    barren: arr.filter((o) => o === 'barren').length,
    predator: arr.filter((o) => o === 'predator').length,
  });

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  console.log('🎲 Array after shuffle:', {
    length: arr.length,
    arr: arr.slice(0, 10), // Show first 10 for debugging
    fruit: arr.filter((o) => o === 'fruit').length,
    barren: arr.filter((o) => o === 'barren').length,
    predator: arr.filter((o) => o === 'predator').length,
  });

  return arr;
}
