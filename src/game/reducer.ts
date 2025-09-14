import { LEVELS } from './levels';
import { makeDeal } from './deal';
import { deriveTraits } from './deriveTraits';
import { save } from '../lib/save';
import type { GameState } from '../types/game';

export type Action =
  | { type: 'INIT'; seed?: string; testMode?: boolean; fastPeek?: boolean }
  | { type: 'CLOSE_INTRO' }
  | { type: 'PLACE'; index: number }
  | { type: 'FULL_REVEAL' }
  | { type: 'SHOW_END_MODAL' }
  | { type: 'ADMIRE_BOARD' }
  | { type: 'RETURN_RESULTS' }
  | { type: 'NEXT_SEASON' }
  | { type: 'ADVANCE_LEVEL' };

export function initState(
  seed = 'cassowary-default',
  testMode = false,
  fastPeek = false,
): GameState {
  const recipe = LEVELS[1];
  const equipped = {} as const;
  const traits = deriveTraits(equipped);
  return {
    recipe,
    traits,
    equipped,
    progress: {
      currentLevel: 1,
      roundInLevel: 0,
      globalRound: 0,
      globalYears: 0,
      population: 3,
      evolutionLevel: 0,
      seed,
    },
    board: {
      outcomes: makeDeal(seed, 1, recipe),
      selected: [],
      revealed: Array(recipe.tileCount).fill('hidden'),
      fullyRevealed: false,
    },
    ui: {
      showIntro: true,
      showEndModal: false,
      showLevelComplete: false,
      admireMode: false,
      blocking: false,
      testMode,
      fastPeek,
    },
  };
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'CLOSE_INTRO':
      return { ...state, ui: { ...state.ui, showIntro: false } };

    case 'PLACE': {
      if (state.ui.blocking) return state;
      const idx = action.index;
      if (state.board.revealed[idx] !== 'hidden') return state;
      if (state.board.selected.length >= state.recipe.picksPerRound) return state;
      const selected = [...state.board.selected, idx];
      const revealed = [...state.board.revealed];
      revealed[idx] = 'revealed';
      return { ...state, board: { ...state.board, selected, revealed } };
    }

    case 'FULL_REVEAL': {
      const revealed = state.board.revealed.map((s) => (s === 'hidden' ? 'shadow' : s));
      return {
        ...state,
        board: { ...state.board, revealed, fullyRevealed: true },
        ui: { ...state.ui, blocking: true },
      };
    }

    case 'SHOW_END_MODAL':
      return {
        ...state,
        ui: { ...state.ui, showEndModal: true, blocking: false, admireMode: false },
      };

    case 'ADMIRE_BOARD':
      return { ...state, ui: { ...state.ui, showEndModal: false, admireMode: true } };

    case 'RETURN_RESULTS':
      return { ...state, ui: { ...state.ui, showEndModal: true, admireMode: false } };

    case 'NEXT_SEASON': {
      const survived = state.board.selected.filter(
        (i) => state.board.outcomes[i] === 'fruit',
      ).length;
      const delta = survived * state.traits.eggsPerClutch;
      const roundInLevel = state.progress.roundInLevel + 1;
      const globalRound = state.progress.globalRound + 1;
      const globalYears = state.progress.globalYears + state.recipe.yearsPerRound;
      const population = state.progress.population + delta;
      const levelDone = roundInLevel >= state.recipe.roundsPerLevel;

      const nextRecipe = state.recipe;
      const nextOutcomes = makeDeal(state.progress.seed, globalRound + 1, nextRecipe);

      const newState = {
        ...state,
        progress: {
          ...state.progress,
          roundInLevel,
          globalRound,
          globalYears,
          population,
        },
        board: {
          outcomes: nextOutcomes,
          selected: [],
          revealed: Array(nextRecipe.tileCount).fill('hidden'),
          fullyRevealed: false,
        },
        ui: {
          ...state.ui,
          showEndModal: false,
          admireMode: false,
          showLevelComplete: levelDone,
          blocking: false,
        },
      };

      // Save progress after each season
      save({ progress: newState.progress, equipped: newState.equipped });

      return newState;
    }

    case 'ADVANCE_LEVEL': {
      const next = state.progress.currentLevel + 1;
      const recipe = LEVELS[next] ?? LEVELS[2];
      return {
        ...state,
        recipe,
        board: {
          outcomes: makeDeal(state.progress.seed, state.progress.globalRound + 1, recipe),
          selected: [],
          revealed: Array(recipe.tileCount).fill('hidden'),
          fullyRevealed: false,
        },
        ui: { ...state.ui, showLevelComplete: false },
      };
    }
    default:
      return state;
  }
}
