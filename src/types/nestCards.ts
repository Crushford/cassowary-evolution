export type Outcome = 'fruit' | 'barren' | 'predator';

export interface Traits {
  eggsPerClutch: number; // default 3
}

export interface LevelRecipe {
  id: number;
  name: string;
  roundsPerLevel: number; // 10
  tileCount: number; // 5
  picksPerRound: number; // 3
  composition: { fruit: number; barren: number; predator: number }; // 3/2/0
  yearsPerRound: number; // 100_000
}

export interface RoundBoard {
  outcomes: Outcome[]; // length 5, hidden initially
  selected: number[]; // indices placed by player
  revealed: ('hidden' | 'revealed' | 'shadow')[]; // per card face visual state
  fullyRevealed: boolean; // did we run "peek"?
}

export interface Progress {
  currentLevel: number; // 1
  roundInLevel: number; // 0..9
  globalRound: number; // cumulative
  globalYears: number; // cumulative
  population: number; // start 3
  evolutionLevel: number; // separate axis
  seed: string; // rng seed
}

export interface UIFlags {
  showIntro: boolean;
  showEndModal: boolean;
  showLevelComplete: boolean;
  admireMode: boolean;
  blocking: boolean; // ignore clicks during peek windows
  testMode: boolean; // reduce motion
  fastPeek: boolean; // bypass 1s delays in tests
}

export interface NestCardsGameState {
  recipe: LevelRecipe;
  traits: Traits;
  progress: Progress;
  board: RoundBoard;
  ui: UIFlags;
}

// Game actions
export type NestCardsAction =
  | {
      type: 'INIT';
      payload: { seed?: string; testMode?: boolean; fastPeek?: boolean };
    }
  | { type: 'PLACE'; payload: { index: number } }
  | { type: 'FULL_REVEAL' }
  | { type: 'SHOW_END_MODAL' }
  | { type: 'ADMIRE_BOARD' }
  | { type: 'RETURN_RESULTS' }
  | { type: 'NEXT_SEASON' }
  | { type: 'ADVANCE_LEVEL' }
  | { type: 'SET_BLOCKING'; payload: { blocking: boolean } };
