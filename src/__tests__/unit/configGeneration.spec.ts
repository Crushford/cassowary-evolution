// Jest globals are available in test environment

// Import the config generation logic
import {
  generateLevels,
  starterEvolutionNodes,
  oddsTables,
} from '../../game/configGeneration';

describe('Config Generation', () => {
  test('should generate valid level configuration', () => {
    const levels = generateLevels({ cycles: 3 }); // Generate fewer cycles for testing

    expect(levels).toBeDefined();
    expect(Array.isArray(levels)).toBe(true);
    expect(levels.length).toBeGreaterThan(0);

    // Check first level structure
    const firstLevel = levels[0];
    expect(firstLevel).toHaveProperty('levelIndex', 0);
    expect(firstLevel).toHaveProperty('cycleIndex', 0);
    expect(firstLevel).toHaveProperty('stepIndex', 0);
    expect(firstLevel).toHaveProperty('populationMin');
    expect(firstLevel).toHaveProperty('cardCount');
    expect(firstLevel).toHaveProperty('layout');
    expect(firstLevel).toHaveProperty('oddsKey');
    expect(firstLevel).toHaveProperty('scaleLabel');

    // Check layout structure
    expect(firstLevel.layout).toHaveProperty('kind');
    expect(firstLevel.layout).toHaveProperty('rows');
    expect(firstLevel.layout).toHaveProperty('cols');
  });

  test('should generate valid evolution nodes', () => {
    const nodes = starterEvolutionNodes();

    expect(nodes).toBeDefined();
    expect(Array.isArray(nodes)).toBe(true);
    expect(nodes.length).toBeGreaterThan(0);

    // Check first node structure
    const firstNode = nodes[0];
    expect(firstNode).toHaveProperty('id');
    expect(firstNode).toHaveProperty('name');
    expect(firstNode).toHaveProperty('cost');
    expect(firstNode).toHaveProperty('tier');
    expect(firstNode).toHaveProperty('effects');
    expect(firstNode).toHaveProperty('branch');

    // Check effects structure
    expect(typeof firstNode.effects).toBe('object');
  });

  test('should generate valid odds tables', () => {
    const odds = oddsTables();

    expect(odds).toBeDefined();
    expect(typeof odds).toBe('object');
    expect(odds).toHaveProperty('fruitConstantL1');

    const fruitOdds = odds.fruitConstantL1;
    expect(fruitOdds).toHaveProperty('description');
    expect(fruitOdds).toHaveProperty('fruitRatio');
    expect(fruitOdds).toHaveProperty('barrenRatio');
    expect(fruitOdds).toHaveProperty('predatorRatio');
  });

  test('should generate complete config structure', () => {
    const config = {
      meta: {
        version: '1.0.0',
        generatedAt: '2025-09-15T10:30:25.495Z',
        notes: [
          'Board cycle is [5,10,15,20,40,80] then resets to 5 at next zoom cycle.',
          'Population thresholds per step: [1,10,50,100,200,400] (enter when >= threshold).',
          'Evolution milestones unlock every 10 EP; nodes still cost EP to purchase.',
        ],
      },
      levels: generateLevels({ cycles: 2 }), // Small test set
      oddsTables: oddsTables(),
      evolution: {
        milestoneStepEP: 10,
        nodes: starterEvolutionNodes(),
      },
    };

    expect(config).toHaveProperty('meta');
    expect(config).toHaveProperty('levels');
    expect(config).toHaveProperty('oddsTables');
    expect(config).toHaveProperty('evolution');

    expect(config.meta).toHaveProperty('version');
    expect(config.meta).toHaveProperty('generatedAt');
    expect(config.meta).toHaveProperty('notes');

    expect(config.evolution).toHaveProperty('milestoneStepEP', 10);
    expect(config.evolution).toHaveProperty('nodes');
  });

  test('should have consistent level progression', () => {
    const levels = generateLevels({ cycles: 2 });

    // Check that levels progress correctly
    for (let i = 1; i < levels.length; i++) {
      const prev = levels[i - 1];
      const curr = levels[i];

      expect(curr.levelIndex).toBe(prev.levelIndex + 1);

      // Check cycle progression
      if (curr.stepIndex === 0) {
        expect(curr.cycleIndex).toBe(prev.cycleIndex + 1);
      } else {
        expect(curr.cycleIndex).toBe(prev.cycleIndex);
        expect(curr.stepIndex).toBe(prev.stepIndex + 1);
      }
    }
  });
});
