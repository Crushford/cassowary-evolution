import { describe, test, expect, beforeAll } from '@jest/globals';
import { loadConfig, getCurrentLevel } from '../../src/game/config';

describe('Level Generation', () => {
  let config: ReturnType<typeof loadConfig>;

  beforeAll(() => {
    config = loadConfig();
  });

  describe('Level structure', () => {
    test('should have correct first cycle thresholds and card counts', () => {
      const firstCycleLevels = config.levels.filter(level => level.cycleIndex === 0);
      
      expect(firstCycleLevels).toHaveLength(6);
      
      const expectedThresholds = [1, 10, 50, 100, 200, 400];
      const expectedCardCounts = [5, 10, 15, 20, 40, 80];
      
      firstCycleLevels.forEach((level, index) => {
        expect(level.populationMin).toBe(expectedThresholds[index]);
        expect(level.cardCount).toBe(expectedCardCounts[index]);
        expect(level.stepIndex).toBe(index);
        expect(level.cycleIndex).toBe(0);
      });
    });

    test('should have correct second cycle structure', () => {
      const secondCycleLevels = config.levels.filter(level => level.cycleIndex === 1);
      
      expect(secondCycleLevels).toHaveLength(6);
      
      // Second cycle should have same thresholds and card counts
      const expectedThresholds = [1, 10, 50, 100, 200, 400];
      const expectedCardCounts = [5, 10, 15, 20, 40, 80];
      
      secondCycleLevels.forEach((level, index) => {
        expect(level.populationMin).toBe(expectedThresholds[index]);
        expect(level.cardCount).toBe(expectedCardCounts[index]);
        expect(level.stepIndex).toBe(index);
        expect(level.cycleIndex).toBe(1);
      });
    });

    test('should have correct layout for each card count', () => {
      const layouts = {
        5: { kind: 'row', rows: 1, cols: 5 },
        10: { kind: 'grid', rows: 2, cols: 5 },
        15: { kind: 'grid', rows: 3, cols: 5 },
        20: { kind: 'grid', rows: 4, cols: 5 },
        40: { kind: 'columnsOfRows', rows: 8, cols: 5, columns: 1 },
        80: { kind: 'columnsOfRows', rows: 16, cols: 5, columns: 1 },
      };

      Object.entries(layouts).forEach(([cardCount, expectedLayout]) => {
        const level = config.levels.find(l => l.cardCount === parseInt(cardCount) && l.cycleIndex === 0);
        expect(level).toBeDefined();
        expect(level!.layout).toEqual(expectedLayout);
      });
    });

    test('should have correct scale labels', () => {
      const firstCycleLevels = config.levels.filter(level => level.cycleIndex === 0);
      const expectedLabels = ['nest', 'grove', 'glade', 'valley', 'region', 'province'];
      
      firstCycleLevels.forEach((level, index) => {
        expect(level.scaleLabel).toBe(expectedLabels[index]);
      });
    });

    test('should use fruitConstantL1 odds key for initial levels', () => {
      const firstCycleLevels = config.levels.filter(level => level.cycleIndex === 0);
      
      firstCycleLevels.forEach(level => {
        expect(level.oddsKey).toBe('fruitConstantL1');
      });
    });
  });

  describe('getCurrentLevel function', () => {
    test('should return correct level for population thresholds', () => {
      const testCases = [
        { population: 1, expectedCardCount: 5, expectedScaleLabel: 'nest' },
        { population: 10, expectedCardCount: 10, expectedScaleLabel: 'grove' },
        { population: 50, expectedCardCount: 15, expectedScaleLabel: 'glade' },
        { population: 100, expectedCardCount: 20, expectedScaleLabel: 'valley' },
        { population: 200, expectedCardCount: 40, expectedScaleLabel: 'region' },
        { population: 400, expectedCardCount: 80, expectedScaleLabel: 'province' },
      ];

      testCases.forEach(({ population, expectedCardCount, expectedScaleLabel }) => {
        const level = getCurrentLevel(population, 0);
        expect(level).toBeDefined();
        expect(level!.cardCount).toBe(expectedCardCount);
        expect(level!.scaleLabel).toBe(expectedScaleLabel);
      });
    });

    test('should return highest available level for population', () => {
      const level = getCurrentLevel(150, 0);
      expect(level).toBeDefined();
      expect(level!.cardCount).toBe(20); // Should be valley level, not glade
      expect(level!.populationMin).toBe(100);
    });

    test('should return null for population below minimum', () => {
      const level = getCurrentLevel(0, 0);
      expect(level).toBeNull();
    });

    test('should respect cycle index', () => {
      const level = getCurrentLevel(10, 1);
      expect(level).toBeDefined();
      expect(level!.cycleIndex).toBe(1);
      expect(level!.cardCount).toBe(10);
    });
  });

  describe('Config metadata', () => {
    test('should have correct meta information', () => {
      expect(config.meta.version).toBe('1.0.0');
      expect(config.meta.notes).toContain('Board cycle is [5,10,15,20,40,80] then resets to 5 at next zoom cycle.');
      expect(config.meta.notes).toContain('Population thresholds per step: [1,10,50,100,200,400] (enter when >= threshold).');
      expect(config.meta.notes).toContain('Evolution milestones unlock every 10 EP; nodes still cost EP to purchase.');
    });

    test('should have evolution configuration', () => {
      expect(config.evolution.milestoneStepEP).toBe(10);
      expect(config.evolution.nodes).toBeDefined();
      expect(config.evolution.nodes.length).toBeGreaterThan(0);
    });

    test('should have odds tables', () => {
      expect(config.oddsTables).toBeDefined();
      expect(config.oddsTables.fruitConstantL1).toBeDefined();
      expect(config.oddsTables.fruitConstantL1).toMatchObject({
        description: 'Constant fruit odds for Level 1',
        fruitRatio: 0.75,
        barrenRatio: 0.25,
        predatorRatio: 0.0,
      });
    });
  });

  describe('Snapshot test for first 18 levels', () => {
    test('should match snapshot of first 18 levels', () => {
      const first18Levels = config.levels.slice(0, 18);
      
      // Create a simplified snapshot for comparison
      const snapshot = first18Levels.map(level => ({
        levelIndex: level.levelIndex,
        cycleIndex: level.cycleIndex,
        stepIndex: level.stepIndex,
        populationMin: level.populationMin,
        cardCount: level.cardCount,
        scaleLabel: level.scaleLabel,
        oddsKey: level.oddsKey,
      }));

      expect(snapshot).toMatchSnapshot('first-18-levels.json');
    });
  });
});
