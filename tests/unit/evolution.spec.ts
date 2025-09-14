import { loadConfig, getEvolutionNodesForTier } from '../../src/game/config';
import { GameState } from '../../src/types/game';

describe('Evolution Gating & Costs', () => {
  let config: ReturnType<typeof loadConfig>;

  beforeAll(() => {
    config = loadConfig();
  });

  describe('visibleNodes function', () => {
    test('should return nodes with tier <= floor(ep/10)', () => {
      const testCases = [
        { ep: 0, expectedTier: 0, expectedNodeCount: 0 },
        { ep: 9, expectedTier: 0, expectedNodeCount: 0 },
        { ep: 10, expectedTier: 1, expectedNodeCount: 2 }, // eggs-1, digestion-1
        { ep: 19, expectedTier: 1, expectedNodeCount: 2 },
        { ep: 20, expectedTier: 2, expectedNodeCount: 4 }, // + claws-1, eggs-2
        { ep: 30, expectedTier: 3, expectedNodeCount: 6 }, // + digestion-2, claws-2
        { ep: 40, expectedTier: 4, expectedNodeCount: 7 }, // + arms-1
      ];

      testCases.forEach(({ ep, expectedTier, expectedNodeCount }) => {
        const visibleNodes = getEvolutionNodesForTier(ep);
        const calculatedTier = Math.floor(ep / config.evolution.milestoneStepEP);
        
        expect(calculatedTier).toBe(expectedTier);
        expect(visibleNodes.length).toBe(expectedNodeCount);
        
        // All visible nodes should have tier <= calculated tier
        visibleNodes.forEach(node => {
          expect(node.tier).toBeLessThanOrEqual(calculatedTier);
        });
      });
    });

    test('should include correct nodes for each tier', () => {
      const tier1Nodes = getEvolutionNodesForTier(10);
      const tier1NodeIds = tier1Nodes.map(node => node.id);
      
      expect(tier1NodeIds).toContain('eggs-1');
      expect(tier1NodeIds).toContain('digestion-1');
      expect(tier1NodeIds).not.toContain('claws-1'); // tier 2
      expect(tier1NodeIds).not.toContain('arms-1'); // tier 4

      const tier2Nodes = getEvolutionNodesForTier(20);
      const tier2NodeIds = tier2Nodes.map(node => node.id);
      
      expect(tier2NodeIds).toContain('eggs-1');
      expect(tier2NodeIds).toContain('digestion-1');
      expect(tier2NodeIds).toContain('claws-1');
      expect(tier2NodeIds).toContain('eggs-2');
      expect(tier2NodeIds).toContain('co-op-1');
    });
  });

  describe('Node purchase validation', () => {
    const createMockGameState = (ep: number, purchasedNodes: string[] = []): Partial<GameState> => ({
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
      const gameState = createMockGameState(15, []);
      const eggs1Node = config.evolution.nodes.find(n => n.id === 'eggs-1')!;
      const digestion1Node = config.evolution.nodes.find(n => n.id === 'digestion-1')!;

      // Can afford eggs-1 (cost 15), cannot afford digestion-1 (cost 20)
      expect(gameState.progress!.evolutionPoints).toBeGreaterThanOrEqual(eggs1Node.cost);
      expect(gameState.progress!.evolutionPoints).toBeLessThan(digestion1Node.cost);
    });

    test('should validate prerequisite requirements', () => {
      const gameState = createMockGameState(30, ['eggs-1']);
      const eggs2Node = config.evolution.nodes.find(n => n.id === 'eggs-2')!;
      const digestion2Node = config.evolution.nodes.find(n => n.id === 'digestion-2')!;

      // eggs-2 requires eggs-1 (purchased), digestion-2 requires digestion-1 (not purchased)
      expect(gameState.progress!.purchasedNodes).toContain('eggs-1');
      expect(eggs2Node.prereq).toContain('eggs-1');
      
      expect(gameState.progress!.purchasedNodes).not.toContain('digestion-1');
      expect(digestion2Node.prereq).toContain('digestion-1');
    });

    test('should prevent purchasing already owned nodes', () => {
      const gameState = createMockGameState(50, ['eggs-1', 'digestion-1']);
      
      expect(gameState.progress!.purchasedNodes).toContain('eggs-1');
      expect(gameState.progress!.purchasedNodes).toContain('digestion-1');
    });
  });

  describe('Node effects application', () => {
    test('should apply popCapIncrease effect', () => {
      const digestion1Node = config.evolution.nodes.find(n => n.id === 'digestion-1')!;
      expect(digestion1Node.effects.popCapIncrease).toBe(25);
    });

    test('should apply extraFoodTiles effect', () => {
      const digestion1Node = config.evolution.nodes.find(n => n.id === 'digestion-1')!;
      const digestion2Node = config.evolution.nodes.find(n => n.id === 'digestion-2')!;
      
      expect(digestion1Node.effects.extraFoodTiles).toBe(1);
      expect(digestion2Node.effects.extraFoodTiles).toBe(2);
    });

    test('should apply predatorMitigationPct effect', () => {
      const claws1Node = config.evolution.nodes.find(n => n.id === 'claws-1')!;
      const claws2Node = config.evolution.nodes.find(n => n.id === 'claws-2')!;
      
      expect(claws1Node.effects.predatorMitigationPct).toBe(30);
      expect(claws2Node.effects.predatorMitigationPct).toBe(50);
    });

    test('should apply eggMultiplier effect', () => {
      const eggs1Node = config.evolution.nodes.find(n => n.id === 'eggs-1')!;
      const eggs2Node = config.evolution.nodes.find(n => n.id === 'eggs-2')!;
      
      expect(eggs1Node.effects.eggMultiplier).toBe(1.2);
      expect(eggs2Node.effects.eggMultiplier).toBe(1.4);
    });

    test('should apply groupsIncrease effect', () => {
      const coopNode = config.evolution.nodes.find(n => n.id === 'co-op-1')!;
      expect(coopNode.effects.groupsIncrease).toBe(1);
    });
  });

  describe('Node branch categorization', () => {
    test('should categorize nodes by branch', () => {
      const nodesByBranch = config.evolution.nodes.reduce((acc, node) => {
        if (!acc[node.branch]) acc[node.branch] = [];
        acc[node.branch].push(node.id);
        return acc;
      }, {} as Record<string, string[]>);

      expect(nodesByBranch.foraging).toContain('digestion-1');
      expect(nodesByBranch.foraging).toContain('digestion-2');
      
      expect(nodesByBranch.defense).toContain('claws-1');
      expect(nodesByBranch.defense).toContain('claws-2');
      
      expect(nodesByBranch.social).toContain('eggs-1');
      expect(nodesByBranch.social).toContain('eggs-2');
      expect(nodesByBranch.social).toContain('co-op-1');
      
      expect(nodesByBranch.arms).toContain('arms-1');
    });
  });

  describe('Evolution milestone step configuration', () => {
    test('should have correct milestone step EP', () => {
      expect(config.evolution.milestoneStepEP).toBe(10);
    });

    test('should unlock tiers at correct EP thresholds', () => {
      const milestoneThresholds = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      
      milestoneThresholds.forEach(threshold => {
        const tier = Math.floor(threshold / config.evolution.milestoneStepEP);
        expect(tier).toBeGreaterThan(0);
        expect(threshold % config.evolution.milestoneStepEP).toBe(0);
      });
    });
  });

  describe('Node cost progression', () => {
    test('should have reasonable cost progression', () => {
      const nodes = config.evolution.nodes.sort((a, b) => a.cost - b.cost);
      
      // Costs should generally increase
      for (let i = 1; i < nodes.length; i++) {
        expect(nodes[i].cost).toBeGreaterThanOrEqual(nodes[i - 1].cost);
      }
    });

    test('should have tier-appropriate costs', () => {
      config.evolution.nodes.forEach(node => {
        const expectedMinCost = node.tier * 10; // Minimum cost should be tier * 10
        expect(node.cost).toBeGreaterThanOrEqual(expectedMinCost);
      });
    });
  });
});
