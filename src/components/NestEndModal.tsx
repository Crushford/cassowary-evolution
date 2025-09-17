import React, { useEffect, useRef } from 'react';
import type { NestCardsGameState } from '../types/nestCards';

interface NestEndModalProps {
  gameState: NestCardsGameState;
  onAdmireBoard: () => void;
  onNextSeason: () => void;
}

export const NestEndModal: React.FC<NestEndModalProps> = ({
  gameState,
  onAdmireBoard,
  onNextSeason,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  // Calculate results
  const survived = gameState.board.selected.filter(
    (index) => gameState.board.outcomes[index] === 'fruit',
  ).length;

  const populationDelta = survived * gameState.traits.eggsPerClutch;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="end-modal"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6 focus:outline-none"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="end-title"
        aria-describedby="end-results"
      >
        <h2 id="end-title" className="text-2xl font-bold text-gray-900 mb-4">
          Round Complete
        </h2>

        <div id="end-results" className="space-y-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Results</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Nests that survived:</span>
                <span className="font-semibold">{survived} out of 3</span>
              </div>
              <div className="flex justify-between">
                <span>Eggs per clutch:</span>
                <span className="font-semibold">{gameState.traits.eggsPerClutch}</span>
              </div>
              <div className="flex justify-between">
                <span>Population change:</span>
                <span
                  className={`font-semibold ${populationDelta > 0 ? 'text-green-600' : 'text-gray-600'}`}
                >
                  {populationDelta > 0 ? '+' : ''}
                  {populationDelta}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total population:</span>
                <span className="font-semibold">{gameState.progress.population}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Progress</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Round:</span>
                <span className="font-semibold">
                  {gameState.progress.roundInLevel + 1} of{' '}
                  {gameState.recipe.roundsPerLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Years elapsed:</span>
                <span className="font-semibold">
                  {gameState.progress.globalYears.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            data-testid="btn-admire-board"
            onClick={onAdmireBoard}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Admire Board
          </button>
          <button
            data-testid="btn-next-season"
            onClick={onNextSeason}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Next Season
          </button>
        </div>
      </div>
    </div>
  );
};
