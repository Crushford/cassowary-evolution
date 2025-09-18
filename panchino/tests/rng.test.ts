import { makeRng } from '../src/rng';

describe('RNG', () => {
  test('same seed produces same sequence', () => {
    const rng1 = makeRng(42);
    const rng2 = makeRng(42);
    
    for (let i = 0; i < 10; i++) {
      expect(rng1()).toBe(rng2());
    }
  });
  
  test('different seeds produce different sequences', () => {
    const rng1 = makeRng(42);
    const rng2 = makeRng(123);
    
    const values1 = Array.from({ length: 10 }, () => rng1());
    const values2 = Array.from({ length: 10 }, () => rng2());
    
    expect(values1).not.toEqual(values2);
  });
  
  test('values are in [0, 1) range', () => {
    const rng = makeRng(999);
    
    for (let i = 0; i < 1000; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
  
  test('deterministic sequence snapshot', () => {
    const rng = makeRng(1);
    const first5 = Array.from({ length: 5 }, () => rng());
    
    // Expected values from LCG with seed=1
    expect(first5).toEqual([
      0.00000000023283064365386962890625,
      0.0000000004656612873077392578125,
      0.00000000069849193096160888671875,
      0.000000000931322574615478515625,
      0.00000000116415321826934814453125
    ]);
  });
});
