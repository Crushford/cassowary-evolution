import { describe, test, expect } from '@jest/globals';
import { makeDeal } from '../../src/game/deal';
import { getOddsTable } from '../../src/game/config';
import type { LevelRecipe } from '../../src/types/game';

describe('Deal Engine + Odds Integration', () => {
  describe('Deal composition with fruitConstantL1 odds', () => {
    test('should deal correct composition with fruitConstantL1', () => {
      const oddsTable = getOddsTable('fruitConstantL1');
      expect(oddsTable.fruitRatio).toBe(0.75);
      expect(oddsTable.barrenRatio).toBe(0.25);
      expect(oddsTable.predatorRatio).toBe(0.0);

      const recipe: LevelRecipe = {
        id: 1,
        name: 'Test Recipe',
        roundsPerLevel: 10,
        tileCount: 5,
        picksPerRound: 3,
        composition: { fruit: 3, barren: 2, predator: 0 },
        yearsPerRound: 100000,
      };

      const seed = 'test-seed-123';
      const deal = makeDeal(seed, 1, recipe);

      expect(deal).toHaveLength(5);
      expect(deal.filter(outcome => outcome === 'fruit')).toHaveLength(3);
      expect(deal.filter(outcome => outcome === 'barren')).toHaveLength(2);
      expect(deal.filter(outcome => outcome === 'predator')).toHaveLength(0);
    });

    test('should produce deterministic results with same seed', () => {
      const recipe: LevelRecipe = {
        id: 1,
        name: 'Test Recipe',
        roundsPerLevel: 10,
        tileCount: 5,
        picksPerRound: 3,
        composition: { fruit: 3, barren: 2, predator: 0 },
        yearsPerRound: 100000,
      };

      const seed = 'deterministic-test';
      const deal1 = makeDeal(seed, 1, recipe);
      const deal2 = makeDeal(seed, 1, recipe);

      expect(deal1).toEqual(deal2);
    });

    test('should produce different results with different seeds', () => {
      const recipe: LevelRecipe = {
        id: 1,
        name: 'Test Recipe',
        roundsPerLevel: 10,
        tileCount: 5,
        picksPerRound: 3,
        composition: { fruit: 3, barren: 2, predator: 0 },
        yearsPerRound: 100000,
      };

      const deal1 = makeDeal('seed-1', 1, recipe);
      const deal2 = makeDeal('seed-2', 1, recipe);

      // While they might be the same by chance, they should be different most of the time
      // We'll test multiple rounds to increase confidence
      let differentCount = 0;
      for (let round = 1; round <= 10; round++) {
        const d1 = makeDeal('seed-1', round, recipe);
        const d2 = makeDeal('seed-2', round, recipe);
        if (JSON.stringify(d1) !== JSON.stringify(d2)) {
          differentCount++;
        }
      }
      expect(differentCount).toBeGreaterThan(0);
    });

    test('should produce different results for different rounds with same seed', () => {
      const recipe: LevelRecipe = {
        id: 1,
        name: 'Test Recipe',
        roundsPerLevel: 10,
        tileCount: 5,
        picksPerRound: 3,
        composition: { fruit: 3, barren: 2, predator: 0 },
        yearsPerRound: 100000,
      };

      const seed = 'same-seed-different-rounds';
      const deal1 = makeDeal(seed, 1, recipe);
      const deal2 = makeDeal(seed, 2, recipe);

      expect(deal1).not.toEqual(deal2);
    });
  });

  describe('Deal composition with different card counts', () => {
    test('should handle 10-card deals', () => {
      const recipe: LevelRecipe = {
        id: 1,
        name: '10-Card Recipe',
        roundsPerLevel: 10,
        tileCount: 10,
        picksPerRound: 3,
        composition: { fruit: 7, barren: 3, predator: 0 },
        yearsPerRound: 100000,
      };

      const seed = 'test-10-cards';
      const deal = makeDeal(seed, 1, recipe);

      expect(deal).toHaveLength(10);
      expect(deal.filter(outcome => outcome === 'fruit')).toHaveLength(7);
      expect(deal.filter(outcome => outcome === 'barren')).toHaveLength(3);
      expect(deal.filter(outcome => outcome === 'predator')).toHaveLength(0);
    });

    test('should handle 20-card deals', () => {
      const recipe: LevelRecipe = {
        id: 1,
        name: '20-Card Recipe',
        roundsPerLevel: 10,
        tileCount: 20,
        picksPerRound: 3,
        composition: { fruit: 15, barren: 5, predator: 0 },
        yearsPerRound: 100000,
      };

      const seed = 'test-20-cards';
      const deal = makeDeal(seed, 1, recipe);

      expect(deal).toHaveLength(20);
      expect(deal.filter(outcome => outcome === 'fruit')).toHaveLength(15);
      expect(deal.filter(outcome => outcome === 'barren')).toHaveLength(5);
      expect(deal.filter(outcome => outcome === 'predator')).toHaveLength(0);
    });

    test('should handle 80-card deals', () => {
      const recipe: LevelRecipe = {
        id: 1,
        name: '80-Card Recipe',
        roundsPerLevel: 10,
        tileCount: 80,
        picksPerRound: 3,
        composition: { fruit: 60, barren: 20, predator: 0 },
        yearsPerRound: 100000,
      };

      const seed = 'test-80-cards';
      const deal = makeDeal(seed, 1, recipe);

      expect(deal).toHaveLength(80);
      expect(deal.filter(outcome => outcome === 'fruit')).toHaveLength(60);
      expect(deal.filter(outcome => outcome === 'barren')).toHaveLength(20);
      expect(deal.filter(outcome => outcome === 'predator')).toHaveLength(0);
    });
  });

  describe('Extra food tiles modifier integration', () => {
    test('should apply extraFoodTiles modifier from evolution', () => {
      const baseRecipe: LevelRecipe = {
        id: 1,
        name: 'Base Recipe',
        roundsPerLevel: 10,
        tileCount: 5,
        picksPerRound: 3,
        composition: { fruit: 3, barren: 2, predator: 0 },
        yearsPerRound: 100000,
      };

      // Simulate evolution effect: +1 extra food tile
      const modifiedRecipe: LevelRecipe = {
        ...baseRecipe,
        composition: { 
          fruit: baseRecipe.composition.fruit + 1, // +1 from evolution
          barren: baseRecipe.composition.barren, 
          predator: baseRecipe.composition.predator 
        },
      };

      const seed = 'test-extra-food';
      const baseDeal = makeDeal(seed, 1, baseRecipe);
      const modifiedDeal = makeDeal(seed, 1, modifiedRecipe);

      expect(baseDeal.filter(outcome => outcome === 'fruit')).toHaveLength(3);
      expect(modifiedDeal.filter(outcome => outcome === 'fruit')).toHaveLength(4);
      expect(modifiedDeal).toHaveLength(6); // 4 fruit + 2 barren
    });

    test('should apply multiple extraFoodTiles modifiers', () => {
      const baseRecipe: LevelRecipe = {
        id: 1,
        name: 'Base Recipe',
        roundsPerLevel: 10,
        tileCount: 5,
        picksPerRound: 3,
        composition: { fruit: 3, barren: 2, predator: 0 },
        yearsPerRound: 100000,
      };

      // Simulate multiple evolution effects: +2 extra food tiles
      const modifiedRecipe: LevelRecipe = {
        ...baseRecipe,
        composition: { 
          fruit: baseRecipe.composition.fruit + 2, // +2 from evolution
          barren: baseRecipe.composition.barren, 
          predator: baseRecipe.composition.predator 
        },
      };

      const seed = 'test-multiple-extra-food';
      const modifiedDeal = makeDeal(seed, 1, modifiedRecipe);

      expect(modifiedDeal.filter(outcome => outcome === 'fruit')).toHaveLength(5);
      expect(modifiedDeal).toHaveLength(7); // 5 fruit + 2 barren
    });
  });

  describe('Deal randomness distribution', () => {
    test('should have reasonable distribution over many deals', () => {
      const recipe: LevelRecipe = {
        id: 1,
        name: 'Distribution Test',
        roundsPerLevel: 10,
        tileCount: 5,
        picksPerRound: 3,
        composition: { fruit: 3, barren: 2, predator: 0 },
        yearsPerRound: 100000,
      };

      const seed = 'distribution-test';
      const deals = [];
      
      // Generate 100 deals
      for (let round = 1; round <= 100; round++) {
        deals.push(makeDeal(seed, round, recipe));
      }

      // Count fruit positions across all deals
      const fruitCounts = [0, 0, 0, 0, 0];
      deals.forEach(deal => {
        deal.forEach((outcome, index) => {
          if (outcome === 'fruit') {
            fruitCounts[index]++;
          }
        });
      });

      // Each position should have fruit roughly 60% of the time (3/5)
      fruitCounts.forEach(count => {
        expect(count).toBeGreaterThan(40); // At least 40% fruit
        expect(count).toBeLessThan(80); // At most 80% fruit
      });
    });

    test('should maintain composition across different card counts', () => {
      const recipes = [
        { tileCount: 5, composition: { fruit: 3, barren: 2, predator: 0 } },
        { tileCount: 10, composition: { fruit: 6, barren: 4, predator: 0 } },
        { tileCount: 20, composition: { fruit: 12, barren: 8, predator: 0 } },
        { tileCount: 40, composition: { fruit: 24, barren: 16, predator: 0 } },
        { tileCount: 80, composition: { fruit: 48, barren: 32, predator: 0 } },
      ];

      recipes.forEach(({ tileCount, composition }) => {
        const recipe: LevelRecipe = {
          id: 1,
          name: `${tileCount}-Card Recipe`,
          roundsPerLevel: 10,
          tileCount,
          picksPerRound: 3,
          composition,
          yearsPerRound: 100000,
        };

        const seed = `test-${tileCount}-cards`;
        const deal = makeDeal(seed, 1, recipe);

        expect(deal).toHaveLength(tileCount);
        expect(deal.filter(outcome => outcome === 'fruit')).toHaveLength(composition.fruit);
        expect(deal.filter(outcome => outcome === 'barren')).toHaveLength(composition.barren);
        expect(deal.filter(outcome => outcome === 'predator')).toHaveLength(composition.predator);
      });
    });
  });
});
