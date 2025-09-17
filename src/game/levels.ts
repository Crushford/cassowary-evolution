import type { LevelRecipe } from '../types/game';

export const LEVELS: Record<number, LevelRecipe> = {
  1: {
    id: 1,
    name: 'Fruit Era',
    roundsPerLevel: 10,
    tileCount: 5,
    picksPerRound: 3,
    composition: { fruit: 3, barren: 2, predator: 0 },
    yearsPerRound: 100_000,
  },
  2: {
    id: 2,
    name: 'First Shadows',
    roundsPerLevel: 10,
    tileCount: 5,
    picksPerRound: 3,
    composition: { fruit: 2, barren: 2, predator: 1 },
    yearsPerRound: 100_000,
  },
};
