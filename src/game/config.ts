export type LayoutKind = 'row' | 'grid' | 'columnsOfRows';

export interface LevelDef {
  levelIndex: number; // 0..∞
  cycleIndex: number; // which zoom cycle we're in (0-based)
  stepIndex: number; // 0..5 within [5,10,15,20,40,80]
  populationMin: number; // threshold to enter this level
  cardCount: number; // 5,10,15,20,40,80 repeating
  layout: {
    kind: LayoutKind; // for UI layout hints only
    rows: number; // primary rows
    cols: number; // primary cols
    columns?: number; // optional column groups for large boards
  };
  oddsKey: string; // e.g., "fruitEasy", "fruitConstantL1", …
  scaleLabel: string; // "nest", "grove", "valley", "region", "province", "biome"
}

export interface EvolutionNode {
  id: string;
  name: string;
  cost: number; // EP cost
  tier: number; // milestone tier that unlocks visibility (EP/10)
  prereq?: string[];
  effects: Partial<{
    extraFoodTiles: number;
    predatorMitigationPct: number;
    eggMultiplier: number;
    popCapIncrease: number;
    groupsIncrease: number;
  }>;
  branch: 'foraging' | 'defense' | 'social' | 'arms';
}

export interface GameConfig {
  meta: {
    version: string;
    generatedAt: string;
    notes: string[];
  };
  levels: LevelDef[];
  oddsTables: Record<string, unknown>;
  evolution: {
    milestoneStepEP: number;
    nodes: EvolutionNode[];
  };
}

// Load the config from the generated JSON file
let config: GameConfig | null = null;

export function loadConfig(): GameConfig {
  if (config) {
    return config;
  }

  try {
    // In a real app, you'd fetch this from the server or load it as a static asset
    // For now, we'll generate it dynamically
    const generatedConfig = generateDefaultConfig();
    config = generatedConfig;
    return config;
  } catch (error) {
    console.error('Failed to load game config:', error);
    // Return a minimal fallback config
    return generateDefaultConfig();
  }
}

function generateDefaultConfig(): GameConfig {
  // This is a simplified version of the generator for runtime use
  const levels: LevelDef[] = [];
  let levelIndex = 0;

  // Generate first few cycles
  for (let cycle = 0; cycle < 5; cycle++) {
    const baseThresholds = [1, 10, 50, 100, 200, 400];
    const baseCardCounts = [5, 10, 15, 20, 40, 80];

    for (let step = 0; step < baseCardCounts.length; step++) {
      const populationMin = baseThresholds[step];
      const cardCount = baseCardCounts[step];

      let layout: LevelDef['layout'];
      if (cardCount === 5) layout = { kind: 'row', rows: 1, cols: 5 };
      else if (cardCount === 10) layout = { kind: 'grid', rows: 2, cols: 5 };
      else if (cardCount === 15) layout = { kind: 'grid', rows: 3, cols: 5 };
      else if (cardCount === 20) layout = { kind: 'grid', rows: 4, cols: 5 };
      else if (cardCount === 40)
        layout = { kind: 'columnsOfRows', rows: 8, cols: 5, columns: 1 };
      else if (cardCount === 80)
        layout = { kind: 'columnsOfRows', rows: 16, cols: 5, columns: 1 };
      else {
        const rows = Math.max(1, Math.round(cardCount / 5));
        layout = { kind: 'grid', rows, cols: 5 };
      }

      const scaleLabels = ['nest', 'grove', 'glade', 'valley', 'region', 'province'];

      levels.push({
        levelIndex,
        cycleIndex: cycle,
        stepIndex: step,
        populationMin,
        cardCount,
        layout,
        oddsKey: 'fruitConstantL1',
        scaleLabel: scaleLabels[step] || 'biome',
      });
      levelIndex++;
    }
  }

  return {
    meta: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      notes: [
        'Board cycle is [5,10,15,20,40,80] then resets to 5 at next zoom cycle.',
        'Population thresholds per step: [1,10,50,100,200,400] (enter when >= threshold).',
        'Evolution milestones unlock every 10 EP; nodes still cost EP to purchase.',
      ],
    },
    levels,
    oddsTables: {
      fruitConstantL1: {
        description: 'Constant fruit odds for Level 1',
        fruitRatio: 0.75,
        barrenRatio: 0.25,
        predatorRatio: 0.0,
      },
    },
    evolution: {
      milestoneStepEP: 10,
      nodes: [
        {
          id: 'eggs-1',
          name: 'Bigger Clutches I',
          cost: 15,
          tier: 1,
          effects: { eggMultiplier: 1.2 },
          branch: 'social',
        },
        {
          id: 'digestion-1',
          name: 'Fruit Digestion I',
          cost: 20,
          tier: 1,
          effects: { extraFoodTiles: 1, popCapIncrease: 25 },
          branch: 'foraging',
        },
        {
          id: 'claws-1',
          name: 'Claws I',
          cost: 30,
          tier: 2,
          effects: { predatorMitigationPct: 30 },
          branch: 'defense',
        },
        {
          id: 'eggs-2',
          name: 'Bigger Clutches II',
          cost: 30,
          tier: 2,
          prereq: ['eggs-1'],
          effects: { eggMultiplier: 1.4, popCapIncrease: 25 },
          branch: 'social',
        },
        {
          id: 'digestion-2',
          name: 'Fruit Digestion II',
          cost: 40,
          tier: 3,
          prereq: ['digestion-1'],
          effects: { extraFoodTiles: 2, popCapIncrease: 50 },
          branch: 'foraging',
        },
        {
          id: 'claws-2',
          name: 'Claws II',
          cost: 50,
          tier: 3,
          prereq: ['claws-1'],
          effects: { predatorMitigationPct: 50, popCapIncrease: 25 },
          branch: 'defense',
        },
        {
          id: 'co-op-1',
          name: 'Cooperative Nesting',
          cost: 35,
          tier: 2,
          effects: { groupsIncrease: 1, popCapIncrease: 25 },
          branch: 'social',
        },
        {
          id: 'arms-1',
          name: 'Forelimb Buds',
          cost: 80,
          tier: 4,
          prereq: ['claws-1'],
          effects: { popCapIncrease: 50 },
          branch: 'arms',
        },
      ],
    },
  };
}

// Helper functions for working with the config
export function getCurrentLevel(
  population: number,
  currentCycle: number = 0,
): LevelDef | null {
  const config = loadConfig();

  // Find the highest level where population >= populationMin and cycle <= currentCycle
  const availableLevels = config.levels.filter(
    (level) => level.populationMin <= population && level.cycleIndex <= currentCycle,
  );

  console.log('🏗️ getCurrentLevel called:', {
    population,
    currentCycle,
    availableLevels: availableLevels.map((level) => ({
      levelIndex: level.levelIndex,
      cardCount: level.cardCount,
      populationMin: level.populationMin,
      cycleIndex: level.cycleIndex,
      scaleLabel: level.scaleLabel,
    })),
    selectedLevel:
      availableLevels.length > 0
        ? {
            levelIndex: availableLevels[availableLevels.length - 1].levelIndex,
            cardCount: availableLevels[availableLevels.length - 1].cardCount,
            populationMin: availableLevels[availableLevels.length - 1].populationMin,
            cycleIndex: availableLevels[availableLevels.length - 1].cycleIndex,
            scaleLabel: availableLevels[availableLevels.length - 1].scaleLabel,
          }
        : null,
  });

  if (availableLevels.length === 0) return null;

  // Return the highest level (last in the filtered array)
  return availableLevels[availableLevels.length - 1];
}

export function getEvolutionNodesForTier(ep: number): EvolutionNode[] {
  const config = loadConfig();
  const currentTier = Math.floor(ep / config.evolution.milestoneStepEP);

  return config.evolution.nodes.filter((node) => node.tier <= currentTier);
}

export function getOddsTable(oddsKey: string): Record<string, unknown> {
  const config = loadConfig();
  return (config.oddsTables[oddsKey] || config.oddsTables.fruitConstantL1) as Record<
    string,
    unknown
  >;
}
