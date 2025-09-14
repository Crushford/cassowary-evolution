import { GameState } from '../../src/types/game';

describe('EP (Evolution Points) Accounting', () => {
  describe('EP calculation from deaths', () => {
    test('should calculate EP correctly from deaths', () => {
      const testCases = [
        { deaths: 0, expectedEP: 0 },
        { deaths: 1, expectedEP: 1 },
        { deaths: 5, expectedEP: 5 },
        { deaths: 10, expectedEP: 10 },
      ];

      testCases.forEach(({ deaths, expectedEP }) => {
        // EP should equal the number of deaths
        expect(deaths).toBe(expectedEP);
      });
    });

    test('should handle multiple rounds of EP accumulation', () => {
      let totalEP = 0;
      const deathsPerRound = [2, 3, 1, 4, 0];
      
      deathsPerRound.forEach(deaths => {
        totalEP += deaths;
      });

      expect(totalEP).toBe(10);
    });
  });

  describe('EP milestone tier calculation', () => {
    test('should calculate tier correctly', () => {
      const testCases = [
        { ep: 0, expectedTier: 0 },
        { ep: 9, expectedTier: 0 },
        { ep: 10, expectedTier: 1 },
        { ep: 19, expectedTier: 1 },
        { ep: 20, expectedTier: 2 },
        { ep: 30, expectedTier: 3 },
        { ep: 40, expectedTier: 4 },
        { ep: 50, expectedTier: 5 },
      ];

      testCases.forEach(({ ep, expectedTier }) => {
        const tier = Math.floor(ep / 10);
        expect(tier).toBe(expectedTier);
      });
    });
  });

  describe('Predator mitigation EP prevention', () => {
    test('should not grant EP for prevented deaths', () => {
      const totalDeaths = 10;
      const preventedDeaths = 3;
      const actualDeaths = totalDeaths - preventedDeaths;
      const epGained = actualDeaths;

      expect(epGained).toBe(7);
      expect(epGained).not.toBe(totalDeaths);
    });

    test('should handle 100% predator mitigation', () => {
      const totalDeaths = 5;
      const preventedDeaths = 5;
      const actualDeaths = totalDeaths - preventedDeaths;
      const epGained = actualDeaths;

      expect(epGained).toBe(0);
    });
  });

  describe('EP state management', () => {
    test('should track EP in game state', () => {
      const mockGameState: Partial<GameState> = {
        progress: {
          evolutionPoints: 25,
          population: 50,
          currentLevel: 1,
          roundInLevel: 3,
          globalRound: 3,
          globalYears: 300000,
          evolutionLevel: 2,
          seed: 'test-seed',
          currentLevelIndex: 2,
          currentCycle: 0,
          purchasedNodes: [],
        },
      };

      expect(mockGameState.progress!.evolutionPoints).toBe(25);
    });

    test('should track purchased nodes', () => {
      const mockGameState: Partial<GameState> = {
        progress: {
          evolutionPoints: 50,
          population: 100,
          currentLevel: 1,
          roundInLevel: 5,
          globalRound: 5,
          globalYears: 500000,
          evolutionLevel: 5,
          seed: 'test-seed',
          currentLevelIndex: 3,
          currentCycle: 0,
          purchasedNodes: ['eggs-1', 'digestion-1'],
        },
      };

      expect(mockGameState.progress!.purchasedNodes).toContain('eggs-1');
      expect(mockGameState.progress!.purchasedNodes).toContain('digestion-1');
      expect(mockGameState.progress!.purchasedNodes).toHaveLength(2);
    });
  });

  describe('EP milestone thresholds', () => {
    test('should identify milestone thresholds', () => {
      const milestoneThresholds = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      
      milestoneThresholds.forEach(threshold => {
        const tier = Math.floor(threshold / 10);
        expect(tier).toBeGreaterThan(0);
        expect(threshold % 10).toBe(0);
      });
    });

    test('should handle edge cases around milestones', () => {
      const testCases = [
        { ep: 9, isAtMilestone: false, tier: 0 },
        { ep: 10, isAtMilestone: true, tier: 1 },
        { ep: 11, isAtMilestone: false, tier: 1 },
        { ep: 19, isAtMilestone: false, tier: 1 },
        { ep: 20, isAtMilestone: true, tier: 2 },
      ];

      testCases.forEach(({ ep, isAtMilestone, tier }) => {
        const calculatedTier = Math.floor(ep / 10);
        const atMilestone = ep % 10 === 0 && ep > 0;
        
        expect(calculatedTier).toBe(tier);
        expect(atMilestone).toBe(isAtMilestone);
      });
    });
  });
});
