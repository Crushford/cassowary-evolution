/* eslint-disable no-console */
type LayoutKind = 'row' | 'grid' | 'columnsOfRows';

export interface LevelDef {
  levelIndex: number;
  cycleIndex: number;
  stepIndex: number;
  populationMin: number;
  cardCount: number;
  layout: { kind: LayoutKind; rows: number; cols: number; columns?: number };
  oddsKey: string;
  scaleLabel: string;
}

export interface EvolutionNode {
  id: string;
  name: string;
  cost: number;
  tier: number; // unlocked when floor(EP/10) >= tier
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

export type Config = {
  meta: { version: string; generatedAt: string; notes: string[] };
  levels: LevelDef[];
  oddsTables: Record<string, unknown>;
  evolution: {
    milestoneStepEP: number; // 10
    nodes: EvolutionNode[];
  };
};

// ---------- helpers ----------
function scaleLabelForStep(stepIndex: number): string {
  // flavor label grows within a cycle
  return ['nest', 'grove', 'glade', 'valley', 'region', 'province'][stepIndex] ?? 'biome';
}

function layoutForCount(cardCount: number) {
  // keep 5-wide rows for readability; large boards can be multiple column groups
  if (cardCount === 5) return { kind: 'row' as const, rows: 1, cols: 5 };
  if (cardCount === 10) return { kind: 'grid' as const, rows: 2, cols: 5 };
  if (cardCount === 15) return { kind: 'grid' as const, rows: 3, cols: 5 };
  if (cardCount === 20) return { kind: 'grid' as const, rows: 4, cols: 5 };
  if (cardCount === 40)
    return { kind: 'columnsOfRows' as const, rows: 8, cols: 5, columns: 1 };
  if (cardCount === 80)
    return { kind: 'columnsOfRows' as const, rows: 16, cols: 5, columns: 1 };
  // fallback grid
  const rows = Math.max(1, Math.round(cardCount / 5));
  return { kind: 'grid' as const, rows, cols: 5 };
}

function populationThresholdsForCycle(base: number[]) {
  // you asked: 1→5, 10→10, 50→15, 100→20, 200→40, 400→80 then reset
  return base;
}

// ---------- main level generator ----------
export function generateLevels({
  cycles = 20, // generate many; UI can stream or slice
  baseThresholds = [1, 10, 50, 100, 200, 400],
  baseCardCounts = [5, 10, 15, 20, 40, 80],
  oddsKeyCycle = 'fruitConstantL1',
}: {
  cycles?: number;
  baseThresholds?: number[];
  baseCardCounts?: number[];
  oddsKeyCycle?: string;
}): LevelDef[] {
  const levels: LevelDef[] = [];
  let levelIndex = 0;
  for (let cycle = 0; cycle < cycles; cycle++) {
    const pops = populationThresholdsForCycle(baseThresholds);
    for (let step = 0; step < baseCardCounts.length; step++) {
      const populationMin = pops[step];
      const cardCount = baseCardCounts[step];
      levels.push({
        levelIndex,
        cycleIndex: cycle,
        stepIndex: step,
        populationMin,
        cardCount,
        layout: layoutForCount(cardCount),
        oddsKey: oddsKeyCycle, // can be swapped when environment changes
        scaleLabel: scaleLabelForStep(step),
      });
      levelIndex++;
    }
  }
  return levels;
}

// ---------- evolution nodes ----------
export function starterEvolutionNodes(): EvolutionNode[] {
  return [
    {
      id: 'eggs-1',
      name: 'Bigger Clutches I',
      cost: 15,
      tier: 1, // unlocks visibility at 10 EP
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
      tier: 2, // unlocks at 20 EP
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
      tier: 4, // unlocks visibility at 40 EP
      prereq: ['claws-1'],
      effects: { popCapIncrease: 50 },
      branch: 'arms',
    },
  ];
}

// ---------- odds stubs ----------
export function oddsTables() {
  return {
    // You said: "odds remain the same until completion of level one".
    // Point this key to whatever static distribution you use in code.
    fruitConstantL1: {
      description: 'Constant fruit odds for Level 1',
      // Example placeholders – engine should read from here:
      fruitRatio: 0.75,
      barrenRatio: 0.25,
      predatorRatio: 0.0,
    },
  };
}

// ---------- assemble config ----------
export function generateConfig(): Config {
  return {
    meta: {
      version: '1.0.0',
      generatedAt: '2025-09-15T10:30:25.495Z', // Fixed timestamp for deterministic builds
      notes: [
        'Board cycle is [5,10,15,20,40,80] then resets to 5 at next zoom cycle.',
        'Population thresholds per step: [1,10,50,100,200,400] (enter when >= threshold).',
        'Evolution milestones unlock every 10 EP; nodes still cost EP to purchase.',
      ],
    },
    levels: generateLevels({}),
    oddsTables: oddsTables(),
    evolution: {
      milestoneStepEP: 10,
      nodes: starterEvolutionNodes(),
    },
  };
}
