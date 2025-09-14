import { makeDeal } from '../deal';
import { LEVELS } from '../levels';

test('deal respects composition and seed', () => {
  const rec = LEVELS[1];
  const a = makeDeal('seedX', 1, rec);
  const b = makeDeal('seedX', 1, rec);
  expect(a).toEqual(b);
  expect(a.filter((x) => x === 'fruit').length).toBe(3);
  expect(a.filter((x) => x === 'barren').length).toBe(2);
});
