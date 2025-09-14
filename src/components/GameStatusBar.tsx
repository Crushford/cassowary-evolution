import React from 'react';
import { GameState } from '../types/game';

interface GameStatusBarProps {
  gameState: GameState;
  onPrestige: () => void;
}

export const GameStatusBar: React.FC<GameStatusBarProps> = ({
  gameState,
  onPrestige,
}) => {
  const progressPercentage = Math.min(
    (gameState.player.chips / gameState.era.cap) * 100,
    100
  );
  const canPrestige = gameState.player.chips >= gameState.era.cap;

  return (
    <div className="app-surface p-4 rounded-lg mb-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Era Info */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-ink-primary">
            {gameState.era.name}
          </span>
          <span className="text-sm text-ink-secondary">
            Era {gameState.era.id}
          </span>
        </div>

        {/* Chips */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-success">
            🍯 {gameState.player.chips}
          </span>
          <span className="text-sm text-ink-secondary">
            / {gameState.era.cap}
          </span>
        </div>

        {/* Partners */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-ink-primary">
            👥 {gameState.player.partners}
          </span>
          <span className="text-sm text-ink-secondary">partners</span>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 min-w-0">
          <div className="bg-app-2 rounded-full h-4 overflow-hidden">
            <div
              className="bg-success h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-xs text-ink-muted mt-1">
            {gameState.player.chips} / {gameState.era.cap} nectar-chips
          </div>
        </div>

        {/* Prestige Button */}
        {canPrestige && (
          <button
            onClick={onPrestige}
            className="bg-accent text-app-0 px-4 py-2 rounded-lg font-bold hover:bg-accent-600 active:bg-accent-700 transition-all duration-200 shadow-soft"
          >
            ✨ Prestige
          </button>
        )}
      </div>

      {/* Traits Display */}
      {(gameState.player.traits.claws ||
        gameState.player.traits.arms ||
        gameState.player.traits.brain) && (
        <div className="mt-3 pt-3 border-t border-border/60">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-ink-secondary font-semibold">Traits:</span>
            {gameState.player.traits.claws && (
              <span className="bg-danger/15 text-danger border border-danger/30 px-2 py-1 rounded-full text-xs">
                🦅 Claws
              </span>
            )}
            {gameState.player.traits.arms && (
              <span className="bg-accent/15 text-accent border border-accent/30 px-2 py-1 rounded-full text-xs">
                🦾 Arms
              </span>
            )}
            {gameState.player.traits.brain && (
              <span className="bg-success/15 text-success border border-success/30 px-2 py-1 rounded-full text-xs">
                🧠 Brain
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
