export type Outcome = 'fruit' | 'barren' | 'predator';
export type Slot = 'survival' | 'reproduction' | 'scouting';

export interface Traits {
  eggsPerClutch: number;
}

export interface TraitDef {
  id: string;
  name: string;
  slot: Slot;
  tags: string[];
  effects: Record<string, unknown>;
  unlockAtLevel: number;
  rarity: 'common' | 'rare' | 'epic';
}

export interface LevelRecipe {
  id: number;
  name: string;
  roundsPerLevel: number; // 10
  tileCount: number; // 5
  picksPerRound: number; // 3
  composition: { fruit: number; barren: number; predator: number };
  yearsPerRound: number; // 100_000
}

export interface RoundBoard {
  outcomes: Outcome[]; // len 5
  selected: number[]; // indices chosen
  revealed: ('hidden' | 'revealed' | 'shadow')[]; // card face state
  fullyRevealed: boolean; // after full-board peek
}

export interface Progress {
  currentLevel: number;
  roundInLevel: number;
  globalRound: number;
  globalYears: number;
  population: number;
  evolutionLevel: number;
  seed: string;
  // New board growth system
  currentLevelIndex: number; // Index into the level config array
  currentCycle: number; // Which zoom cycle we're in
  evolutionPoints: number; // EP for evolution tree
  purchasedNodes: string[]; // IDs of purchased evolution nodes
}

export interface Equipped {
  survival?: string;
  reproduction?: string;
  scouting?: string;
}

export interface UIFlags {
  showIntro: boolean;
  showEndModal: boolean;
  showLevelComplete: boolean;
  admireMode: boolean;
  blocking: boolean;
  testMode: boolean;
  fastPeek: boolean;
  // New UI flags
  showEvolutionModal: boolean;
  showBoardGrowthToast: boolean;
  boardGrowthMessage: string;
  showEPGainToast: boolean;
  epGainMessage: string;
}

export interface GameState {
  recipe: LevelRecipe;
  traits: Traits;
  equipped: Equipped;
  progress: Progress;
  board: RoundBoard;
  ui: UIFlags;
}
