import type { TileOutcome } from './deal3x3';

export function resolveRound(
  selected: Array<[number, number]>,
  outcomes: Map<string, TileOutcome>,
  population: number,
) {
  let delta = 0;
  const results = selected.map(([r, c]) => {
    const key = `${r},${c}`;
    const t = outcomes.get(key)!; // guaranteed
    const gain = t === 'food' ? 1 : 0;
    delta += gain;
    return { r, c, type: t, gain };
  });
  const nextPop = population + delta;
  return { results, nextPop, delta };
}
