import React from 'react';
import { GameState, RoundOutcome } from '../types/game';

interface ActionPanelProps {
  gameState: GameState;
  roundOutcome?: RoundOutcome;
  onLayEggs: () => void;
  onContinue: () => void;
  onShop: () => void;
  onRareOffer?: () => void;
  rareOffer?: any;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  gameState,
  roundOutcome,
  onLayEggs,
  onContinue,
  onShop,
  onRareOffer,
  rareOffer,
}) => {
  const canLayEggs =
    gameState.selectedTiles.length === 3 && !gameState.roundComplete;

  if (gameState.roundComplete && roundOutcome) {
    return (
      <div className="bg-green-50 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold text-green-900 mb-4">Round Results</h3>

        {/* Flip Results */}
        <div className="space-y-2 mb-4">
          {roundOutcome.flips.map((flip, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white p-3 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {flip.type === 'food'
                    ? '🍎'
                    : flip.type === 'barren'
                      ? '🌱'
                      : flip.type === 'predator'
                        ? '🦅'
                        : '?'}
                </span>
                <span className="font-medium">
                  {flip.type === 'food'
                    ? 'Food! Safe nesting ground.'
                    : flip.type === 'barren'
                      ? 'Barren. No growth here.'
                      : flip.type === 'predator'
                        ? 'Predator!'
                        : 'Unknown'}
                </span>
                {flip.type === 'predator' && !flip.survived && (
                  <span className="text-red-600 text-sm">
                    (Clutch scattered)
                  </span>
                )}
                {flip.type === 'predator' && flip.survived && (
                  <span className="text-green-600 text-sm">
                    (Claws saved them!)
                  </span>
                )}
              </div>
              <div className="font-bold text-green-600">
                {flip.payout > 0 ? `+${flip.payout}` : '0'}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-green-100 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-green-900">Total Gained:</span>
            <span className="font-bold text-green-900">
              +{roundOutcome.chipsDelta} nectar-chips
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onContinue}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Continue
          </button>
          {rareOffer && onRareOffer && (
            <button
              onClick={onRareOffer}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              View Mutation
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-amber-900 mb-4">Actions</h3>

      <div className="space-y-3">
        <button
          onClick={onLayEggs}
          disabled={!canLayEggs}
          className={`w-full py-3 px-4 rounded-lg font-bold transition-colors duration-200 ${
            canLayEggs
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canLayEggs
            ? '🥚 Lay Eggs'
            : `Select ${3 - gameState.selectedTiles.length} more tiles`}
        </button>

        <button
          onClick={onShop}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          🛒 Upgrade Shop ({gameState.player.chips} chips)
        </button>
      </div>

      {/* Selected Tiles Summary */}
      {gameState.selectedTiles.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
          <div className="text-sm text-yellow-800">
            <strong>Selected tiles:</strong>{' '}
            {gameState.selectedTiles.map((tile, i) => (
              <span key={i}>
                ({tile.r + 1},{tile.c + 1})
                {i < gameState.selectedTiles.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
