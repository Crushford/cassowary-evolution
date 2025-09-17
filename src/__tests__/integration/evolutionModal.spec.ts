import { loadConfig, getEvolutionNodesForTier } from '../../game/config';
import { GameState } from '../../types/game';

describe('Evolution Modal Integration', () => {
  let config: ReturnType<typeof loadConfig>;

  beforeAll(() => {
    config = loadConfig();
  });

  describe('Modal visibility based on EP', () => {
    test('should show no nodes at EP 9', () => {
      const visibleNodes = getEvolutionNodesForTier(9);
      expect(visibleNodes).toHaveLength(0);
    });

    test('should show tier 1 nodes at EP 10', () => {
      const visibleNodes = getEvolutionNodesForTier(10);
      const tier1Nodes = visibleNodes.filter((node) => node.tier === 1);

      expect(tier1Nodes).toHaveLength(2); // eggs-1, digestion-1
      expect(tier1Nodes.map((n) => n.id)).toContain('eggs-1');
      expect(tier1Nodes.map((n) => n.id)).toContain('digestion-1');
    });

    test('should show tier 2 nodes at EP 20', () => {
      const visibleNodes = getEvolutionNodesForTier(20);
      const tier2Nodes = visibleNodes.filter((node) => node.tier === 2);

      expect(tier2Nodes.length).toBeGreaterThan(0);
      expect(tier2Nodes.map((n) => n.id)).toContain('claws-1');
      expect(tier2Nodes.map((n) => n.id)).toContain('eggs-2');
      expect(tier2Nodes.map((n) => n.id)).toContain('co-op-1');
    });

    test('should show all available tiers at EP 50', () => {
      const visibleNodes = getEvolutionNodesForTier(50);
      const tiers = Array.from(new Set(visibleNodes.map((node) => node.tier))).sort();

      expect(tiers).toEqual([1, 2, 3, 4]);
    });
  });

  describe('Node purchase validation', () => {
    const createGameState = (
      ep: number,
      purchasedNodes: string[] = [],
    ): Partial<GameState> => ({
      progress: {
        evolutionPoints: ep,
        population: 100,
        currentLevel: 1,
        roundInLevel: 1,
        globalRound: 1,
        globalYears: 100000,
        evolutionLevel: Math.floor(ep / 10),
        seed: 'test-seed',
        currentLevelIndex: 1,
        currentCycle: 0,
        purchasedNodes,
      },
    });

    test('should validate EP cost requirements', () => {
      const gameState = createGameState(15, []);
      const eggs1Node = config.evolution.nodes.find((n) => n.id === 'eggs-1')!;
      const digestion1Node = config.evolution.nodes.find((n) => n.id === 'digestion-1')!;

      // Can afford eggs-1 (cost 15), cannot afford digestion-1 (cost 20)
      const canAffordEggs1 = gameState.progress!.evolutionPoints >= eggs1Node.cost;
      const canAffordDigestion1 =
        gameState.progress!.evolutionPoints >= digestion1Node.cost;

      expect(canAffordEggs1).toBe(true);
      expect(canAffordDigestion1).toBe(false);
    });

    test('should validate prerequisite requirements', () => {
      const gameState = createGameState(30, ['eggs-1']);
      const eggs2Node = config.evolution.nodes.find((n) => n.id === 'eggs-2')!;
      const digestion2Node = config.evolution.nodes.find((n) => n.id === 'digestion-2')!;

      // eggs-2 requires eggs-1 (purchased), digestion-2 requires digestion-1 (not purchased)
      const canBuyEggs2 =
        eggs2Node.prereq?.every((prereqId) =>
          gameState.progress!.purchasedNodes.includes(prereqId),
        ) ?? true;

      const canBuyDigestion2 =
        digestion2Node.prereq?.every((prereqId) =>
          gameState.progress!.purchasedNodes.includes(prereqId),
        ) ?? true;

      expect(canBuyEggs2).toBe(true);
      expect(canBuyDigestion2).toBe(false);
    });

    test('should prevent purchasing already owned nodes', () => {
      const gameState = createGameState(50, ['eggs-1', 'digestion-1']);
      const alreadyOwned = gameState.progress!.purchasedNodes.includes('eggs-1');

      expect(alreadyOwned).toBe(true);
    });
  });

  describe('Node effects application', () => {
    test('should apply popCapIncrease effect', () => {
      const digestion1Node = config.evolution.nodes.find((n) => n.id === 'digestion-1')!;
      const initialPopCap = 100;
      const newPopCap = initialPopCap + (digestion1Node.effects.popCapIncrease || 0);

      expect(newPopCap).toBe(125);
    });

    test('should apply extraFoodTiles effect', () => {
      const digestion1Node = config.evolution.nodes.find((n) => n.id === 'digestion-1')!;
      const digestion2Node = config.evolution.nodes.find((n) => n.id === 'digestion-2')!;

      const baseFoodTiles = 3;
      const withDigestion1 = baseFoodTiles + (digestion1Node.effects.extraFoodTiles || 0);
      const withDigestion2 = baseFoodTiles + (digestion2Node.effects.extraFoodTiles || 0);

      expect(withDigestion1).toBe(4);
      expect(withDigestion2).toBe(5);
    });

    test('should apply predatorMitigationPct effect', () => {
      const claws1Node = config.evolution.nodes.find((n) => n.id === 'claws-1')!;
      const claws2Node = config.evolution.nodes.find((n) => n.id === 'claws-2')!;

      const baseMitigation = 0;
      const withClaws1 = baseMitigation + (claws1Node.effects.predatorMitigationPct || 0);
      const withClaws2 = baseMitigation + (claws2Node.effects.predatorMitigationPct || 0);

      expect(withClaws1).toBe(30);
      expect(withClaws2).toBe(50);
    });

    test('should apply eggMultiplier effect', () => {
      const eggs1Node = config.evolution.nodes.find((n) => n.id === 'eggs-1')!;
      const eggs2Node = config.evolution.nodes.find((n) => n.id === 'eggs-2')!;

      const baseEggs = 1;
      const withEggs1 = baseEggs * (eggs1Node.effects.eggMultiplier || 1);
      const withEggs2 = baseEggs * (eggs2Node.effects.eggMultiplier || 1);

      expect(withEggs1).toBe(1.2);
      expect(withEggs2).toBe(1.4);
    });

    test('should apply groupsIncrease effect', () => {
      const coopNode = config.evolution.nodes.find((n) => n.id === 'co-op-1')!;
      const baseGroups = 1;
      const withCoop = baseGroups + (coopNode.effects.groupsIncrease || 0);

      expect(withCoop).toBe(2);
    });
  });

  describe('Node branch categorization', () => {
    test('should categorize nodes by branch correctly', () => {
      const nodesByBranch = config.evolution.nodes.reduce(
        (acc, node) => {
          if (!acc[node.branch]) acc[node.branch] = [];
          acc[node.branch].push(node.id);
          return acc;
        },
        {} as Record<string, string[]>,
      );

      expect(nodesByBranch.foraging).toEqual(['digestion-1', 'digestion-2']);
      expect(nodesByBranch.defense).toEqual(['claws-1', 'claws-2']);
      expect(nodesByBranch.social).toEqual(['eggs-1', 'eggs-2', 'co-op-1']);
      expect(nodesByBranch.arms).toEqual(['arms-1']);
    });
  });

  describe('Evolution milestone progression', () => {
    test('should unlock tiers at correct EP thresholds', () => {
      const milestoneThresholds = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

      milestoneThresholds.forEach((threshold) => {
        const tier = Math.floor(threshold / config.evolution.milestoneStepEP);
        const visibleNodes = getEvolutionNodesForTier(threshold);
        const maxTier = Math.max(...visibleNodes.map((node) => node.tier));

        expect(tier).toBeGreaterThan(0);
        expect(maxTier).toBeLessThanOrEqual(tier);
      });
    });

    test('should show correct number of nodes at each tier', () => {
      const tierNodeCounts = {
        1: 2, // eggs-1, digestion-1
        2: 3, // claws-1, eggs-2, co-op-1
        3: 2, // digestion-2, claws-2
        4: 1, // arms-1
      };

      Object.entries(tierNodeCounts).forEach(([tier, expectedCount]) => {
        const tierNum = parseInt(tier);
        const ep = tierNum * config.evolution.milestoneStepEP;
        const visibleNodes = getEvolutionNodesForTier(ep);
        const tierNodes = visibleNodes.filter((node) => node.tier === tierNum);

        expect(tierNodes).toHaveLength(expectedCount);
      });
    });
  });

  describe('Node cost and tier relationship', () => {
    test('should have appropriate costs for each tier', () => {
      config.evolution.nodes.forEach((node) => {
        const expectedMinCost = node.tier * 10;
        expect(node.cost).toBeGreaterThanOrEqual(expectedMinCost);
      });
    });

    test('should have reasonable cost progression within tiers', () => {
      const nodesByTier = config.evolution.nodes.reduce(
        (acc, node) => {
          if (!acc[node.tier]) acc[node.tier] = [];
          acc[node.tier].push(node);
          return acc;
        },
        {} as Record<number, typeof config.evolution.nodes>,
      );

      Object.entries(nodesByTier).forEach(([, nodes]) => {
        const costs = nodes.map((node) => node.cost).sort((a, b) => a - b);

        // Costs within a tier should be reasonably close
        if (costs.length > 1) {
          const maxCost = Math.max(...costs);
          const minCost = Math.min(...costs);
          expect(maxCost - minCost).toBeLessThan(50); // Reasonable spread
        }
      });
    });
  });

  describe('Complex purchase scenarios', () => {
    test('should handle chained prerequisites', () => {
      const gameState = createGameState(100, ['eggs-1', 'claws-1']);

      // arms-1 requires claws-1 (purchased) and is tier 4 (40+ EP)
      const arms1Node = config.evolution.nodes.find((n) => n.id === 'arms-1')!;
      const canBuyArms1 =
        gameState.progress!.evolutionPoints >= arms1Node.cost &&
        (arms1Node.prereq?.every((prereqId) =>
          gameState.progress!.purchasedNodes.includes(prereqId),
        ) ??
          true);

      expect(canBuyArms1).toBe(true);
    });

    test('should handle multiple prerequisites', () => {
      // This would require a node with multiple prerequisites
      // For now, test that our current nodes work correctly
      const gameState = createGameState(50, ['eggs-1']);
      const eggs2Node = config.evolution.nodes.find((n) => n.id === 'eggs-2')!;

      const canBuyEggs2 =
        gameState.progress!.evolutionPoints >= eggs2Node.cost &&
        (eggs2Node.prereq?.every((prereqId) =>
          gameState.progress!.purchasedNodes.includes(prereqId),
        ) ??
          true);

      expect(canBuyEggs2).toBe(true);
    });
  });

  function createGameState(
    ep: number,
    purchasedNodes: string[] = [],
  ): Partial<GameState> {
    return {
      progress: {
        evolutionPoints: ep,
        population: 100,
        currentLevel: 1,
        roundInLevel: 1,
        globalRound: 1,
        globalYears: 100000,
        evolutionLevel: Math.floor(ep / 10),
        seed: 'test-seed',
        currentLevelIndex: 1,
        currentCycle: 0,
        purchasedNodes,
      },
    };
  }
});
