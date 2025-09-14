import { LEVELS } from './levels';
import { makeDeal } from './deal';
import { deriveTraits } from './deriveTraits';
import { save } from '../lib/save';
import { loadConfig, getCurrentLevel } from './config';
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
  | { type: 'ADVANCE_LEVEL' }
  | { type: 'SHOW_EVOLUTION_MODAL' }
  | { type: 'CLOSE_EVOLUTION_MODAL' }
  | { type: 'PURCHASE_EVOLUTION_NODE'; nodeId: string }
  | { type: 'DISMISS_BOARD_GROWTH_TOAST' }
  | { type: 'DISMISS_EP_GAIN_TOAST' };

export function initState(
  seed = 'cassowary-default',
  testMode = false,
  fastPeek = false,
): GameState {
  const currentLevel = getCurrentLevel(3, 0); // Start with population 3, cycle 0
  const recipe = LEVELS[1];
  const equipped = {} as const;
  const traits = deriveTraits(equipped);

  // Debug logging for initial state
  console.log('🚀 INIT_STATE Debug:', {
    seed,
    testMode,
    fastPeek,
    currentLevel: currentLevel
      ? {
          levelIndex: currentLevel.levelIndex,
          cardCount: currentLevel.cardCount,
          populationMin: currentLevel.populationMin,
          scaleLabel: currentLevel.scaleLabel,
        }
      : null,
    recipe: {
      tileCount: recipe.tileCount,
      composition: recipe.composition,
    },
  });

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
      // New board growth system
      currentLevelIndex: currentLevel?.levelIndex ?? 0,
      currentCycle: 0,
      evolutionPoints: 0,
      purchasedNodes: [],
    },
    board: {
      outcomes: makeDeal(seed, 1, recipe),
      selected: [],
      revealed: Array(currentLevel?.cardCount ?? recipe.tileCount).fill('hidden'),
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
      // New UI flags
      showEvolutionModal: false,
      showBoardGrowthToast: false,
      boardGrowthMessage: '',
      showEPGainToast: false,
      epGainMessage: '',
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
      const died = state.board.selected.filter(
        (i) => state.board.outcomes[i] === 'predator',
      ).length;

      const delta = survived * state.traits.eggsPerClutch;
      const roundInLevel = state.progress.roundInLevel + 1;
      const globalRound = state.progress.globalRound + 1;
      const globalYears = state.progress.globalYears + state.recipe.yearsPerRound;
      const population = state.progress.population + delta;
      const levelDone = roundInLevel >= state.recipe.roundsPerLevel;

      // Calculate EP gain from deaths
      const epGain = died;
      const newEvolutionPoints = state.progress.evolutionPoints + epGain;

      // Check for board growth
      const config = loadConfig();
      const newLevel = getCurrentLevel(population, state.progress.currentCycle);
      const boardGrew =
        newLevel && newLevel.levelIndex > state.progress.currentLevelIndex;

      // Check for evolution milestone
      const currentTier = Math.floor(
        newEvolutionPoints / config.evolution.milestoneStepEP,
      );
      const previousTier = Math.floor(
        state.progress.evolutionPoints / config.evolution.milestoneStepEP,
      );
      const milestoneHit = currentTier > previousTier;

      const nextRecipe = state.recipe;

      // Generate outcomes based on current level's card count
      const currentLevel = getCurrentLevel(population, state.progress.currentCycle);
      const cardCount = currentLevel?.cardCount ?? nextRecipe.tileCount;

      // Debug logging
      console.log('🔍 NEXT_SEASON Debug:', {
        population,
        currentCycle: state.progress.currentCycle,
        currentLevel: currentLevel
          ? {
              levelIndex: currentLevel.levelIndex,
              cardCount: currentLevel.cardCount,
              populationMin: currentLevel.populationMin,
              scaleLabel: currentLevel.scaleLabel,
            }
          : null,
        cardCount,
        previousCardCount: state.board.outcomes.length,
        roundInLevel,
        globalRound,
      });

      // Create a temporary recipe with the correct tile count and proper composition
      const tempRecipe = {
        ...nextRecipe,
        tileCount: cardCount,
        composition: {
          fruit: Math.floor(cardCount * 0.6), // 60% fruit
          barren: Math.floor(cardCount * 0.3), // 30% barren
          predator: Math.floor(cardCount * 0.1), // 10% predator
        },
      };

      console.log('🎲 Deal Recipe:', {
        tileCount: tempRecipe.tileCount,
        composition: tempRecipe.composition,
        total:
          tempRecipe.composition.fruit +
          tempRecipe.composition.barren +
          tempRecipe.composition.predator,
      });

      const nextOutcomes = makeDeal(state.progress.seed, globalRound + 1, tempRecipe);

      console.log('🎯 Generated Outcomes:', {
        count: nextOutcomes.length,
        outcomes: nextOutcomes,
        fruit: nextOutcomes.filter((o) => o === 'fruit').length,
        barren: nextOutcomes.filter((o) => o === 'barren').length,
        predator: nextOutcomes.filter((o) => o === 'predator').length,
      });

      const newState = {
        ...state,
        progress: {
          ...state.progress,
          roundInLevel,
          globalRound,
          globalYears,
          population,
          evolutionPoints: newEvolutionPoints,
          currentLevelIndex: newLevel?.levelIndex ?? state.progress.currentLevelIndex,
        },
        board: {
          outcomes: nextOutcomes,
          selected: [],
          revealed: Array(cardCount).fill('hidden'),
          fullyRevealed: false,
        },
        ui: {
          ...state.ui,
          showEndModal: false,
          admireMode: false,
          showLevelComplete: levelDone,
          blocking: false,
          // Show toasts for board growth and EP gain
          showBoardGrowthToast: boardGrew || false,
          boardGrowthMessage: boardGrew
            ? `Our flocks spread. Territory widens: ${newLevel?.cardCount} tiles.`
            : '',
          showEPGainToast: epGain > 0,
          epGainMessage: epGain > 0 ? `Loss teaches. +${epGain} EP.` : '',
          showEvolutionModal: milestoneHit,
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

    case 'SHOW_EVOLUTION_MODAL':
      return { ...state, ui: { ...state.ui, showEvolutionModal: true } };

    case 'CLOSE_EVOLUTION_MODAL':
      return { ...state, ui: { ...state.ui, showEvolutionModal: false } };

    case 'PURCHASE_EVOLUTION_NODE': {
      const config = loadConfig();
      const node = config.evolution.nodes.find((n) => n.id === action.nodeId);
      if (!node || state.progress.evolutionPoints < node.cost) return state;

      // Check prerequisites
      const prereqsMet =
        !node.prereq ||
        node.prereq.every((prereqId) => state.progress.purchasedNodes.includes(prereqId));
      if (!prereqsMet) return state;

      return {
        ...state,
        progress: {
          ...state.progress,
          evolutionPoints: state.progress.evolutionPoints - node.cost,
          purchasedNodes: [...state.progress.purchasedNodes, action.nodeId],
        },
      };
    }

    case 'DISMISS_BOARD_GROWTH_TOAST':
      return {
        ...state,
        ui: { ...state.ui, showBoardGrowthToast: false, boardGrowthMessage: '' },
      };

    case 'DISMISS_EP_GAIN_TOAST':
      return { ...state, ui: { ...state.ui, showEPGainToast: false, epGainMessage: '' } };

    default:
      return state;
  }
}
