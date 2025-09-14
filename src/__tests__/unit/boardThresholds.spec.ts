import { getCurrentLevel } from '../../game/config';

describe('Board Transition Selection', () => {
  describe('Population threshold selection', () => {
    test('should select correct level for population thresholds', () => {
      const testCases = [
        { population: 1, expectedCardCount: 5, expectedScaleLabel: 'nest' },
        { population: 9, expectedCardCount: 5, expectedScaleLabel: 'nest' },
        { population: 10, expectedCardCount: 10, expectedScaleLabel: 'grove' },
        { population: 49, expectedCardCount: 10, expectedScaleLabel: 'grove' },
        { population: 50, expectedCardCount: 15, expectedScaleLabel: 'glade' },
        { population: 99, expectedCardCount: 15, expectedScaleLabel: 'glade' },
        { population: 100, expectedCardCount: 20, expectedScaleLabel: 'valley' },
        { population: 199, expectedCardCount: 20, expectedScaleLabel: 'valley' },
        { population: 200, expectedCardCount: 40, expectedScaleLabel: 'region' },
        { population: 399, expectedCardCount: 40, expectedScaleLabel: 'region' },
        { population: 400, expectedCardCount: 80, expectedScaleLabel: 'province' },
      ];

      testCases.forEach(({ population, expectedCardCount, expectedScaleLabel }) => {
        const level = getCurrentLevel(population, 0);
        expect(level).toBeDefined();
        expect(level!.cardCount).toBe(expectedCardCount);
        expect(level!.scaleLabel).toBe(expectedScaleLabel);
        expect(level!.populationMin).toBeLessThanOrEqual(population);
      });
    });

    test('should select highest available level for population', () => {
      const testCases = [
        { population: 150, expectedCardCount: 20 }, // Should be valley, not glade
        { population: 250, expectedCardCount: 40 }, // Should be region, not valley
        { population: 500, expectedCardCount: 80 }, // Should be province
      ];

      testCases.forEach(({ population, expectedCardCount }) => {
        const level = getCurrentLevel(population, 0);
        expect(level).toBeDefined();
        expect(level!.cardCount).toBe(expectedCardCount);
      });
    });
  });

  describe('Population-based level selection', () => {
    test('should select level based on current population', () => {
      // Simulate population growth and then drop within same cycle
      const cycle = 0;

      // Grow to valley level
      const valleyLevel = getCurrentLevel(100, cycle);
      expect(valleyLevel!.cardCount).toBe(20);

      // Drop population - should select appropriate level for current population
      const droppedLevel = getCurrentLevel(50, cycle);
      expect(droppedLevel!.cardCount).toBe(15); // Should be glade level for population 50
    });

    test('should maintain level when population fluctuates within threshold range', () => {
      const cycle = 0;

      // Test various population values within the valley range (100-199)
      const testPopulations = [100, 120, 150, 180, 199];

      testPopulations.forEach((population) => {
        const level = getCurrentLevel(population, cycle);
        expect(level!.cardCount).toBe(20); // All should be valley level
        expect(level!.scaleLabel).toBe('valley');
      });
    });
  });

  describe('Cycle progression', () => {
    test('should handle multiple cycles correctly', () => {
      const testCases = [
        { population: 10, cycle: 0, expectedCardCount: 10 },
        { population: 10, cycle: 1, expectedCardCount: 10 },
        { population: 10, cycle: 2, expectedCardCount: 10 },
      ];

      testCases.forEach(({ population, cycle, expectedCardCount }) => {
        const level = getCurrentLevel(population, cycle);
        expect(level).toBeDefined();
        expect(level!.cardCount).toBe(expectedCardCount);
        expect(level!.cycleIndex).toBe(cycle);
      });
    });

    test('should not access future cycles', () => {
      const level = getCurrentLevel(10, 0);
      expect(level!.cycleIndex).toBe(0);

      // Should not be able to access cycle 1 when at cycle 0
      const futureLevel = getCurrentLevel(10, 1);
      expect(futureLevel!.cycleIndex).toBe(1);
    });
  });

  describe('Edge cases', () => {
    test('should handle population exactly at threshold', () => {
      const thresholds = [1, 10, 50, 100, 200, 400];

      thresholds.forEach((threshold) => {
        const level = getCurrentLevel(threshold, 0);
        expect(level).toBeDefined();
        expect(level!.populationMin).toBe(threshold);
      });
    });

    test('should handle population below minimum threshold', () => {
      const level = getCurrentLevel(0, 0);
      expect(level).toBeNull();
    });

    test('should handle very high population', () => {
      const level = getCurrentLevel(1000, 0);
      expect(level).toBeDefined();
      expect(level!.cardCount).toBe(80); // Should be province level
      expect(level!.scaleLabel).toBe('province');
    });
  });

  describe('Level progression sequence', () => {
    test('should follow correct progression sequence', () => {
      const progression = [
        { population: 1, cardCount: 5, scaleLabel: 'nest' },
        { population: 10, cardCount: 10, scaleLabel: 'grove' },
        { population: 50, cardCount: 15, scaleLabel: 'glade' },
        { population: 100, cardCount: 20, scaleLabel: 'valley' },
        { population: 200, cardCount: 40, scaleLabel: 'region' },
        { population: 400, cardCount: 80, scaleLabel: 'province' },
      ];

      progression.forEach(({ population, cardCount, scaleLabel }) => {
        const level = getCurrentLevel(population, 0);
        expect(level).toBeDefined();
        expect(level!.cardCount).toBe(cardCount);
        expect(level!.scaleLabel).toBe(scaleLabel);
      });
    });

    test('should maintain correct step indices', () => {
      const testCases = [
        { population: 1, expectedStepIndex: 0 },
        { population: 10, expectedStepIndex: 1 },
        { population: 50, expectedStepIndex: 2 },
        { population: 100, expectedStepIndex: 3 },
        { population: 200, expectedStepIndex: 4 },
        { population: 400, expectedStepIndex: 5 },
      ];

      testCases.forEach(({ population, expectedStepIndex }) => {
        const level = getCurrentLevel(population, 0);
        expect(level!.stepIndex).toBe(expectedStepIndex);
      });
    });
  });

  describe('Layout consistency', () => {
    test('should have consistent layout for each card count', () => {
      const cardCountLayouts = {
        5: { kind: 'row', rows: 1, cols: 5 },
        10: { kind: 'grid', rows: 2, cols: 5 },
        15: { kind: 'grid', rows: 3, cols: 5 },
        20: { kind: 'grid', rows: 4, cols: 5 },
        40: { kind: 'columnsOfRows', rows: 8, cols: 5, columns: 1 },
        80: { kind: 'columnsOfRows', rows: 16, cols: 5, columns: 1 },
      };

      Object.entries(cardCountLayouts).forEach(([cardCount, expectedLayout]) => {
        const level = getCurrentLevel(
          parseInt(cardCount) === 5
            ? 1
            : parseInt(cardCount) === 10
              ? 10
              : parseInt(cardCount) === 15
                ? 50
                : parseInt(cardCount) === 20
                  ? 100
                  : parseInt(cardCount) === 40
                    ? 200
                    : 400,
          0,
        );
        expect(level!.layout).toEqual(expectedLayout);
      });
    });
  });
});
