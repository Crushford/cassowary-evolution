import { makeDeal } from '../deal';
import { LEVELS } from '../levels';

describe('makeDeal', () => {
  test('respects composition and seed', () => {
    const recipe = LEVELS[1]; // 3/2/0
    const a = makeDeal('seed', 1, recipe);
    const b = makeDeal('seed', 1, recipe);
    expect(a).toEqual(b);
    expect(a.filter((x) => x === 'fruit').length).toBe(3);
    expect(a.filter((x) => x === 'barren').length).toBe(2);
    expect(a.filter((x) => x === 'predator').length).toBe(0);
  });

  test('different seeds produce different results', () => {
    const recipe = LEVELS[1];
    const a = makeDeal('seed1', 1, recipe);
    const b = makeDeal('seed2', 1, recipe);
    expect(a).not.toEqual(b);
  });

  test('different rounds produce different results', () => {
    const recipe = LEVELS[1];
    const a = makeDeal('seed', 1, recipe);
    const b = makeDeal('seed', 2, recipe);
    expect(a).not.toEqual(b);
  });

  test('Level 2 includes predators', () => {
    const recipe = LEVELS[2]; // 2/2/1
    const deal = makeDeal('seed', 1, recipe);
    expect(deal.filter((x) => x === 'fruit').length).toBe(2);
    expect(deal.filter((x) => x === 'barren').length).toBe(2);
    expect(deal.filter((x) => x === 'predator').length).toBe(1);
  });
});
