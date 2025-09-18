import { makeRng } from '../src/rng';
import { 
  defaultBoard, 
  nextStep, 
  applyStep, 
  roll1d3, 
  runDrop, 
  runRound 
} from '../src/panchino';

describe('Panchino Core Logic', () => {
  describe('nextStep', () => {
    test('maps random values to steps correctly', () => {
      expect(nextStep(0.0)).toBe(-1);
      expect(nextStep(0.4999)).toBe(-1);
      expect(nextStep(0.5)).toBe(+1);
      expect(nextStep(0.9999)).toBe(+1);
    });
  });
  
  describe('applyStep', () => {
    test('clamps at left edge', () => {
      expect(applyStep(0, -1)).toBe(0);
    });
    
    test('clamps at right edge', () => {
      expect(applyStep(6, +1)).toBe(6);
    });
    
    test('normal movement', () => {
      expect(applyStep(3, -1)).toBe(2);
      expect(applyStep(3, +1)).toBe(4);
    });
  });
  
  describe('roll1d3', () => {
    test('returns values in range 1-3', () => {
      const rng = makeRng(123);
      
      for (let i = 0; i < 100; i++) {
        const roll = roll1d3(rng);
        expect([1, 2, 3]).toContain(roll);
      }
    });
  });
  
  describe('runDrop', () => {
    const board = defaultBoard();
    
    test('returns correct structure', () => {
      const rng = makeRng(42);
      const result = runDrop(rng, board);
      
      expect(result.steps).toHaveLength(board.rows);
      expect(result.path).toHaveLength(board.rows + 1);
      expect(result.path[0]).toBe(board.startColumn);
      expect(result.finalSlot).toBe(result.path[board.rows]);
    });
    
    test('center slot yields chicks', () => {
      // Mock RNG to force center landing
      const mockRng = () => 0.5; // Always step right
      const result = runDrop(mockRng, board);
      
      // With all right steps from center, we end up at slot 6
      // Let's use a different approach - create a custom RNG sequence
      let callCount = 0;
      const centerRng = () => {
        callCount++;
        // First 6 calls for steps: alternate to end up at center
        if (callCount <= 6) {
          return callCount % 2 === 1 ? 0.0 : 1.0; // L, R, L, R, L, R
        }
        // 7th call for roll1d3
        return 0.0; // Will give us 1
      };
      
      const result2 = runDrop(centerRng, board);
      expect(result2.finalSlot).toBe(3);
      expect(result2.chicks).toBeGreaterThan(0);
      expect(result2.chicks).toBeLessThanOrEqual(3);
    });
    
    test('non-center slot yields no chicks', () => {
      // Force left edge landing
      const leftRng = () => 0.0; // Always step left
      const result = runDrop(leftRng, board);
      
      expect(result.finalSlot).toBe(0);
      expect(result.chicks).toBe(0);
    });
  });
  
  describe('runRound', () => {
    test('runs correct number of drops', () => {
      const rng = makeRng(42);
      const board = defaultBoard();
      const result = runRound(rng, board, 3);
      
      expect(result.drops).toHaveLength(3);
      expect(result.totalChicks).toBeGreaterThanOrEqual(0);
    });
    
    test('sums chicks correctly', () => {
      const rng = makeRng(42);
      const board = defaultBoard();
      const result = runRound(rng, board, 3);
      
      const expectedTotal = result.drops.reduce((sum, drop) => sum + drop.chicks, 0);
      expect(result.totalChicks).toBe(expectedTotal);
    });
  });
  
  describe('determinism', () => {
    test('same seed produces identical results', () => {
      const seed = 7;
      const rng1 = makeRng(seed);
      const rng2 = makeRng(seed);
      const board = defaultBoard();
      
      const result1 = runRound(rng1, board);
      const result2 = runRound(rng2, board);
      
      expect(result1.drops).toEqual(result2.drops);
      expect(result1.totalChicks).toBe(result2.totalChicks);
    });
  });
  
  describe('distribution sanity check', () => {
    test('center landing probability is reasonable', () => {
      const centerLandings = [];
      
      // Test with multiple seeds
      for (let seed = 0; seed < 100; seed++) {
        const rng = makeRng(seed);
        const board = defaultBoard();
        const result = runRound(rng, board, 10); // 10 drops per seed
        
        const centerCount = result.drops.filter(drop => drop.finalSlot === 3).length;
        centerLandings.push(centerCount);
      }
      
      const totalDrops = centerLandings.length * 10;
      const totalCenterLandings = centerLandings.reduce((sum, count) => sum + count, 0);
      const centerProbability = totalCenterLandings / totalDrops;
      
      // Loose bounds: center should be hit 10-30% of the time
      expect(centerProbability).toBeGreaterThanOrEqual(0.10);
      expect(centerProbability).toBeLessThanOrEqual(0.30);
    });
  });
});
