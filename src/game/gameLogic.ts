// Legacy game logic - not used in new game system
export const coordToKey = (coord: any): string => `${coord.r},${coord.c}`;
export const keyToCoord = (key: string): any => {
  const [r, c] = key.split(',').map(Number);
  return { r, c };
};

export const generateBoard = (era: any): any => ({
  size: 9,
  queen: { r: 4, c: 4 },
  tiles: {},
  revealed: new Set(),
  revealedHints: new Set(),
});

export const createInitialGameState = (): any => ({
  era: { id: 0, name: 'Eden', cap: 100, predatorCount: 0, barrenCount: 2 },
  board: generateBoard({}),
  player: {
    chips: 0,
    partners: 3,
    traits: { claws: false, arms: false, brain: false },
    upgrades: { eggCapacityTier: 0, scoutTier: 0, nestDefense: false, mapMemory: false },
  },
  selectedTiles: [],
  roundComplete: false,
});

export const resolveRound = (selections: any[], gameState: any): any => ({
  selections,
  flips: [],
  chipsDelta: 0,
});

export const canPrestige = (gameState: any): boolean => false;
export const applyPrestige = (gameState: any): any => gameState;
