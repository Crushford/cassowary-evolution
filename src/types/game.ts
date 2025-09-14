export type Coord = { r: number; c: number }; // 0..8
export type TileType = 'food' | 'barren' | 'predator';

export interface EraRecipe {
  id: number;
  name: string;
  cap: number;
  predatorCount: number;
  barrenCount: number;
  // derived: foodCount = 80 - pred - barren
}

export interface BoardState {
  size: 9;
  queen: Coord; // {r:4,c:4}
  tiles: Record<string, TileType>; // key = `${r},${c}` for all non-queen coords
  revealed: Set<string>; // tiles flipped this round
  revealedHints: Set<string>; // tiles hinted safe (scout/raven)
}

export interface PlayerState {
  chips: number;
  partners: number; // starts 3, max 5
  traits: {
    claws: boolean;
    arms: boolean; // prestige 2+
    brain: boolean; // prestige 3+
  };
  upgrades: {
    eggCapacityTier: number;
    scoutTier: number;
    nestDefense: boolean;
    mapMemory: boolean;
  };
}

export interface RoundOutcome {
  selections: Coord[];
  flips: Array<{
    coord: Coord;
    type: TileType;
    payout: number;
    survived: boolean;
  }>;
  chipsDelta: number;
}

export interface RareOffer {
  id: string;
  name: string;
  benefit: string;
  risk: string;
  cost: number;
  effect: () => void; // Applied when purchased
}

export interface GameState {
  era: EraRecipe;
  board: BoardState;
  player: PlayerState;
  rareOffer?: RareOffer;
  selectedTiles: Coord[];
  roundComplete: boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxTier?: number;
  currentTier?: number;
  purchased?: boolean;
  effect: (gameState: GameState) => GameState;
}
