import {
  BoardState,
  Coord,
  TileType,
  EraRecipe,
  GameState,
  RoundOutcome,
  PlayerState,
} from '../types/game';
import { GAME_CONFIG, ERA_RECIPES } from '../config/gameConfig';

// Utility functions
export const coordToKey = (coord: Coord): string => `${coord.r},${coord.c}`;
export const keyToCoord = (key: string): Coord => {
  const [r, c] = key.split(',').map(Number);
  return { r, c };
};

export const getAllCoords = (): Coord[] => {
  const coords: Coord[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      coords.push({ r, c });
    }
  }
  return coords;
};

export const getAllCoordsExceptCenter = (): Coord[] => {
  return getAllCoords().filter(coord => !(coord.r === 4 && coord.c === 4));
};

// Fisher-Yates shuffle
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Board generation
export const generateBoard = (era: EraRecipe): BoardState => {
  const allCoords = getAllCoordsExceptCenter();
  const shuffled = shuffleArray(allCoords);

  const predatorCoords = shuffled.slice(0, era.predatorCount);
  const barrenCoords = shuffled.slice(
    era.predatorCount,
    era.predatorCount + era.barrenCount
  );
  const foodCoords = shuffled.slice(era.predatorCount + era.barrenCount);

  const tiles: Record<string, TileType> = {};

  // Assign tile types
  predatorCoords.forEach(coord => {
    tiles[coordToKey(coord)] = 'predator';
  });

  barrenCoords.forEach(coord => {
    tiles[coordToKey(coord)] = 'barren';
  });

  foodCoords.forEach(coord => {
    tiles[coordToKey(coord)] = 'food';
  });

  return {
    size: 9,
    queen: { r: 4, c: 4 },
    tiles,
    revealed: new Set(),
    revealedHints: new Set(),
  };
};

// Round resolution
export const resolveRound = (
  selections: Coord[],
  gameState: GameState
): RoundOutcome => {
  let chips = 0;
  const flips: RoundOutcome['flips'] = [];
  let predatorNegated = false;

  for (const coord of selections) {
    const tileKey = coordToKey(coord);
    const tileType = gameState.board.tiles[tileKey];

    if (tileType === 'food') {
      const multiplier = 1 + 0.5 * gameState.player.upgrades.eggCapacityTier;
      const payout = Math.floor(GAME_CONFIG.payoutBase * multiplier);
      chips += payout;
      flips.push({
        coord,
        type: tileType,
        payout,
        survived: true,
      });
    } else if (tileType === 'barren') {
      flips.push({
        coord,
        type: tileType,
        payout: 0,
        survived: true,
      });
    } else {
      // predator
      let survived = false;

      // Check nest defense (first predator hit negated)
      if (!predatorNegated && gameState.player.upgrades.nestDefense) {
        predatorNegated = true;
        survived = true;
      } else if (gameState.player.traits.claws) {
        // 50% chance to survive with claws
        survived = Math.random() < 0.5;
      }

      flips.push({
        coord,
        type: tileType,
        payout: 0,
        survived,
      });
    }
  }

  return {
    selections,
    flips,
    chipsDelta: chips,
  };
};

// Initial game state
export const createInitialGameState = (): GameState => {
  const era = ERA_RECIPES[0];
  const board = generateBoard(era);

  const player: PlayerState = {
    chips: 0,
    partners: 3,
    traits: {
      claws: false,
      arms: false,
      brain: false,
    },
    upgrades: {
      eggCapacityTier: 0,
      scoutTier: 0,
      nestDefense: false,
      mapMemory: false,
    },
  };

  return {
    era,
    board,
    player,
    selectedTiles: [],
    roundComplete: false,
  };
};

// Check if prestige is available
export const canPrestige = (gameState: GameState): boolean => {
  return gameState.player.chips >= gameState.era.cap;
};

// Apply prestige
export const applyPrestige = (gameState: GameState): GameState => {
  const nextEraIndex = gameState.era.id + 1;

  if (nextEraIndex >= ERA_RECIPES.length) {
    // Game complete - could add victory state here
    return gameState;
  }

  const nextEra = ERA_RECIPES[nextEraIndex];
  const newBoard = generateBoard(nextEra);

  return {
    ...gameState,
    era: nextEra,
    board: newBoard,
    player: {
      ...gameState.player,
      chips: 0, // Spend all chips
      // Keep permanent traits
      traits: gameState.player.traits,
      // Keep some upgrades
      upgrades: {
        ...gameState.player.upgrades,
        mapMemory: gameState.player.upgrades.mapMemory, // Keep map memory
      },
    },
    selectedTiles: [],
    roundComplete: false,
  };
};

// Rare offer roll
export const maybeRollRareOffer = (): boolean => {
  return Math.random() < GAME_CONFIG.rareOfferChance;
};
