import React, { useReducer, useEffect, useCallback } from 'react';
import { nestCardsReducer, createInitialNestCardsState } from '../game/nestCardsReducer';
import { NestHUD } from './NestHUD';
import { NestBoard } from './NestBoard';
import { NestIntroModal } from './NestIntroModal';
import { NestEndModal } from './NestEndModal';
import { NestLevelCompleteModal } from './NestLevelCompleteModal';

interface NestCardsGameProps {
  seed?: string;
  testMode?: boolean;
  fastPeek?: boolean;
}

export const NestCardsGame: React.FC<NestCardsGameProps> = ({
  seed = 'default-seed',
  testMode = false,
  fastPeek = false,
}) => {
  const [gameState, dispatch] = useReducer(
    nestCardsReducer,
    createInitialNestCardsState(seed, testMode, fastPeek),
  );

  // Initialize game
  useEffect(() => {
    dispatch({ type: 'INIT', payload: { seed, testMode, fastPeek } });
  }, [seed, testMode, fastPeek]);

  const handleCardClick = useCallback(
    (index: number) => {
      if (gameState.ui.blocking) return;

      dispatch({ type: 'PLACE', payload: { index } });

      // Check if this was the 3rd placement
      const newSelectedCount = gameState.board.selected.length + 1;
      if (newSelectedCount === gameState.recipe.picksPerRound) {
        dispatch({ type: 'SET_BLOCKING', payload: { blocking: true } });

        if (fastPeek) {
          // Immediate reveal for testing
          dispatch({ type: 'FULL_REVEAL' });
          dispatch({ type: 'SHOW_END_MODAL' });
        } else {
          // Delayed reveal for normal play
          setTimeout(() => {
            dispatch({ type: 'FULL_REVEAL' });
            setTimeout(() => {
              dispatch({ type: 'SHOW_END_MODAL' });
            }, 1000);
          }, 1000);
        }
      }
    },
    [
      gameState.board.selected.length,
      gameState.recipe.picksPerRound,
      gameState.ui.blocking,
      fastPeek,
    ],
  );

  const handleBegin = useCallback(() => {
    dispatch({ type: 'INIT', payload: { seed, testMode, fastPeek } });
  }, [seed, testMode, fastPeek]);

  const handleAdmireBoard = useCallback(() => {
    dispatch({ type: 'ADMIRE_BOARD' });
  }, []);

  const handleReturnResults = useCallback(() => {
    dispatch({ type: 'RETURN_RESULTS' });
  }, []);

  const handleNextSeason = useCallback(() => {
    dispatch({ type: 'NEXT_SEASON' });
  }, []);

  const handleAdvanceLevel = useCallback(() => {
    dispatch({ type: 'ADVANCE_LEVEL' });
  }, []);

  const picksRemaining = gameState.recipe.picksPerRound - gameState.board.selected.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Cassowary Queen</h1>
          <p className="text-green-600">
            Level {gameState.progress.currentLevel}: {gameState.recipe.name}
          </p>
        </div>

        {/* HUD */}
        <NestHUD progress={gameState.progress} />

        {/* Game Board */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <NestBoard
            board={gameState.board}
            picksRemaining={picksRemaining}
            onCardClick={handleCardClick}
            disabled={gameState.ui.blocking}
          />
        </div>

        {/* Return to Results Button (when in admire mode) */}
        {gameState.ui.admireMode && (
          <div className="fixed bottom-4 right-4">
            <button
              data-testid="btn-return-results"
              onClick={handleReturnResults}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors"
            >
              Return to Results
            </button>
          </div>
        )}

        {/* Modals */}
        {gameState.ui.showIntro && <NestIntroModal onBegin={handleBegin} />}

        {gameState.ui.showEndModal && (
          <NestEndModal
            gameState={gameState}
            onAdmireBoard={handleAdmireBoard}
            onNextSeason={handleNextSeason}
          />
        )}

        {gameState.ui.showLevelComplete && (
          <NestLevelCompleteModal
            level={gameState.progress.currentLevel}
            onAdvance={handleAdvanceLevel}
          />
        )}
      </div>
    </div>
  );
};
