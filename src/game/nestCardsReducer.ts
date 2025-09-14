import { makeDeal } from './deal';
import { getLevel } from './levels';
import type {
  NestCardsGameState,
  NestCardsAction,
  Traits,
  Progress,
  RoundBoard,
  UIFlags,
} from '../types/nestCards';

const createInitialTraits = (): Traits => ({
  eggsPerClutch: 3,
});

const createInitialProgress = (seed: string): Progress => ({
  currentLevel: 1,
  roundInLevel: 0,
  globalRound: 0,
  globalYears: 0,
  population: 3,
  evolutionLevel: 0,
  seed,
});

const createInitialUIFlags = (
  testMode: boolean = false,
  fastPeek: boolean = false,
): UIFlags => ({
  showIntro: true,
  showEndModal: false,
  showLevelComplete: false,
  admireMode: false,
  blocking: false,
  testMode,
  fastPeek,
});

const createInitialBoard = (): RoundBoard => ({
  outcomes: [],
  selected: [],
  revealed: [],
  fullyRevealed: false,
});

export const createInitialNestCardsState = (
  seed: string = 'default-seed',
  testMode: boolean = false,
  fastPeek: boolean = false,
): NestCardsGameState => {
  const recipe = getLevel(1);
  const traits = createInitialTraits();
  const progress = createInitialProgress(seed);
  const ui = createInitialUIFlags(testMode, fastPeek);
  const board = createInitialBoard();

  // Generate initial deal
  const outcomes = makeDeal(seed, progress.globalRound, recipe);
  board.outcomes = outcomes;
  board.revealed = new Array(recipe.tileCount).fill('hidden');

  return {
    recipe,
    traits,
    progress,
    board,
    ui,
  };
};

export const nestCardsReducer = (
  state: NestCardsGameState,
  action: NestCardsAction,
): NestCardsGameState => {
  switch (action.type) {
    case 'INIT': {
      const {
        seed = 'default-seed',
        testMode = false,
        fastPeek = false,
      } = action.payload;
      return createInitialNestCardsState(seed, testMode, fastPeek);
    }

    case 'PLACE': {
      const { index } = action.payload;

      // Can't place if already selected, blocking, or game complete
      if (
        state.board.selected.includes(index) ||
        state.ui.blocking ||
        state.board.selected.length >= state.recipe.picksPerRound
      ) {
        return state;
      }

      const newSelected = [...state.board.selected, index];
      const newRevealed = [...state.board.revealed];
      newRevealed[index] = 'revealed';

      const newBoard: RoundBoard = {
        ...state.board,
        selected: newSelected,
        revealed: newRevealed,
      };

      return {
        ...state,
        board: newBoard,
      };
    }

    case 'FULL_REVEAL': {
      const newRevealed = state.board.revealed.map((state) =>
        state === 'hidden' ? 'shadow' : state,
      );

      return {
        ...state,
        board: {
          ...state.board,
          revealed: newRevealed,
          fullyRevealed: true,
        },
      };
    }

    case 'SHOW_END_MODAL': {
      // Calculate results
      const survived = state.board.selected.filter(
        (index) => state.board.outcomes[index] === 'fruit',
      ).length;

      const populationDelta = survived * state.traits.eggsPerClutch;
      const newPopulation = state.progress.population + populationDelta;

      return {
        ...state,
        progress: {
          ...state.progress,
          population: newPopulation,
        },
        ui: {
          ...state.ui,
          showEndModal: true,
          blocking: false,
        },
      };
    }

    case 'ADMIRE_BOARD': {
      return {
        ...state,
        ui: {
          ...state.ui,
          showEndModal: false,
          admireMode: true,
        },
      };
    }

    case 'RETURN_RESULTS': {
      return {
        ...state,
        ui: {
          ...state.ui,
          showEndModal: true,
          admireMode: false,
        },
      };
    }

    case 'NEXT_SEASON': {
      const newRoundInLevel = state.progress.roundInLevel + 1;
      const newGlobalRound = state.progress.globalRound + 1;
      const newGlobalYears = state.progress.globalYears + state.recipe.yearsPerRound;

      // Check if level complete
      if (newRoundInLevel >= state.recipe.roundsPerLevel) {
        return {
          ...state,
          progress: {
            ...state.progress,
            currentLevel: state.progress.currentLevel + 1,
            roundInLevel: 0,
            globalRound: newGlobalRound,
            globalYears: newGlobalYears,
          },
          ui: {
            ...state.ui,
            showEndModal: false,
            showLevelComplete: true,
            admireMode: false,
          },
        };
      }

      // Generate new deal for next round
      const newOutcomes = makeDeal(state.progress.seed, newGlobalRound, state.recipe);

      return {
        ...state,
        progress: {
          ...state.progress,
          roundInLevel: newRoundInLevel,
          globalRound: newGlobalRound,
          globalYears: newGlobalYears,
        },
        board: {
          outcomes: newOutcomes,
          selected: [],
          revealed: new Array(state.recipe.tileCount).fill('hidden'),
          fullyRevealed: false,
        },
        ui: {
          ...state.ui,
          showEndModal: false,
          admireMode: false,
        },
      };
    }

    case 'ADVANCE_LEVEL': {
      const nextLevel = state.progress.currentLevel + 1;
      const nextRecipe = getLevel(nextLevel);

      return {
        ...state,
        recipe: nextRecipe,
        progress: {
          ...state.progress,
          currentLevel: nextLevel,
          roundInLevel: 0,
        },
        board: {
          outcomes: makeDeal(state.progress.seed, state.progress.globalRound, nextRecipe),
          selected: [],
          revealed: new Array(nextRecipe.tileCount).fill('hidden'),
          fullyRevealed: false,
        },
        ui: {
          ...state.ui,
          showLevelComplete: false,
        },
      };
    }

    case 'SET_BLOCKING': {
      return {
        ...state,
        ui: {
          ...state.ui,
          blocking: action.payload.blocking,
        },
      };
    }

    default:
      return state;
  }
};
