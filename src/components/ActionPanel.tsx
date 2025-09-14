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
      <div className="app-surface p-6 rounded-lg">
        <h3 className="text-lg font-bold text-ink-primary mb-4">
          Round Results
        </h3>

        {/* Flip Results */}
        <div className="space-y-2 mb-4">
          {roundOutcome.flips.map((flip, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-app-2 p-3 rounded-lg border border-border/60"
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
                <span className="font-medium text-ink-primary">
                  {flip.type === 'food'
                    ? 'Food! Safe nesting ground.'
                    : flip.type === 'barren'
                      ? 'Barren. No growth here.'
                      : flip.type === 'predator'
                        ? 'Predator!'
                        : 'Unknown'}
                </span>
                {flip.type === 'predator' && !flip.survived && (
                  <span className="text-danger text-sm">
                    (Clutch scattered)
                  </span>
                )}
                {flip.type === 'predator' && flip.survived && (
                  <span className="text-success text-sm">
                    (Claws saved them!)
                  </span>
                )}
              </div>
              <div className="font-bold text-success">
                {flip.payout > 0 ? `+${flip.payout}` : '0'}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-success/15 border border-success/30 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-success">Total Gained:</span>
            <span className="font-bold text-success">
              +{roundOutcome.chipsDelta} nectar-chips
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onContinue}
            className="flex-1 bg-accent hover:bg-accent-600 active:bg-accent-700 text-app-0 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Continue
          </button>
          {rareOffer && onRareOffer && (
            <button
              onClick={onRareOffer}
              className="bg-accent/80 hover:bg-accent active:bg-accent-700 text-app-0 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              View Mutation
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="app-surface p-6 rounded-lg"
      role="complementary"
      aria-label="Game actions panel"
    >
      <h3 className="text-lg font-bold text-ink-primary mb-4">Actions</h3>

      <div className="space-y-3">
        <button
          onClick={onLayEggs}
          disabled={!canLayEggs}
          aria-label={
            canLayEggs
              ? 'Lay eggs and resolve round'
              : `Select ${3 - gameState.selectedTiles.length} more tiles before laying eggs`
          }
          className={`w-full py-3 px-4 rounded-lg font-bold transition-colors duration-200 ${
            canLayEggs
              ? 'bg-success hover:bg-success/80 text-ink-primary'
              : 'bg-app-2 text-ink-muted cursor-not-allowed border border-border/60'
          }`}
        >
          {canLayEggs
            ? '🥚 Lay Eggs'
            : `Select ${3 - gameState.selectedTiles.length} more tiles`}
        </button>

        <button
          onClick={onShop}
          aria-label={`Open upgrade shop. You have ${gameState.player.chips} nectar chips`}
          className="w-full bg-accent hover:bg-accent-600 active:bg-accent-700 text-app-0 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          🛒 Upgrade Shop ({gameState.player.chips} chips)
        </button>
      </div>

      {/* Selected Tiles Summary */}
      {gameState.selectedTiles.length > 0 && (
        <div className="mt-4 p-3 bg-accent/15 border border-accent/30 rounded-lg">
          <div className="text-sm text-ink-secondary">
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
