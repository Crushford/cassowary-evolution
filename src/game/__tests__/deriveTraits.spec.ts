import { deriveTraits } from '../deriveTraits';

test('eggsPerClutch derived from reproduction trait', () => {
  expect(deriveTraits({}).eggsPerClutch).toBe(3);
  expect(deriveTraits({ reproduction: 'fruit_digestion_1' }).eggsPerClutch).toBe(4);
});
