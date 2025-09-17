import seedrandom from 'seedrandom';

export type RNG = () => number;

export function makeRng(seed?: string): RNG {
  return seedrandom(seed ?? 'default-seed');
}
