/**
 * Deterministic Linear Congruential Generator (LCG)
 * Simple, fast, and sufficient for game simulation
 */
export function makeRng(seed: number): () => number {
  let state = seed;
  
  return function(): number {
    // LCG formula: (a * state + c) mod m
    // Using constants from Numerical Recipes
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296; // Normalize to [0, 1)
  };
}
