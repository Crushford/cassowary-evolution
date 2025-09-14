/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const legacyGameState = gameState as any;
  const progressPercentage = Math.min(
    ((legacyGameState.player?.chips || 0) / (legacyGameState.era?.cap || 100)) * 100,
    100,
  );
  const canPrestige =
    (legacyGameState.player?.chips || 0) >= (legacyGameState.era?.cap || 100);

  return (
    <div
      className="app-surface p-4 rounded-lg mb-4"
      role="banner"
      aria-label="Game status and progress"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Era Info */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-ink-primary">
            {legacyGameState.era?.name || 'Unknown'}
          </span>
          <span className="text-sm text-ink-secondary">
            Era {legacyGameState.era?.id || 0}
          </span>
        </div>

        {/* Chips */}
        <div
          className="flex items-center gap-2"
          role="status"
          aria-label={`Current chips: ${legacyGameState.player?.chips || 0} out of ${legacyGameState.era?.cap || 100} required`}
        >
          <span className="text-lg font-bold text-success" aria-hidden="true">
            🍯 {legacyGameState.player?.chips || 0}
          </span>
          <span className="text-sm text-ink-secondary" aria-hidden="true">
            / {legacyGameState.era?.cap || 100}
          </span>
        </div>

        {/* Partners */}
        <div
          className="flex items-center gap-2"
          role="status"
          aria-label={`Current partners: ${legacyGameState.player?.partners || 0}`}
        >
          <span className="text-lg font-bold text-ink-primary" aria-hidden="true">
            👥 {legacyGameState.player?.partners || 0}
          </span>
          <span className="text-sm text-ink-secondary" aria-hidden="true">
            partners
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 min-w-0">
          <div
            className="bg-app-2 rounded-full h-4 overflow-hidden"
            role="progressbar"
            aria-valuenow={legacyGameState.player?.chips || 0}
            aria-valuemin={0}
            aria-valuemax={legacyGameState.era?.cap || 100}
            aria-label={`Progress towards era cap: ${progressPercentage.toFixed(0)}%`}
          >
            <div
              className="bg-success h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-xs text-ink-muted mt-1" aria-hidden="true">
            {legacyGameState.player?.chips || 0} / {legacyGameState.era?.cap || 100}{' '}
            nectar-chips
          </div>
        </div>

        {/* Prestige Button */}
        {canPrestige && (
          <button
            onClick={onPrestige}
            aria-label="Prestige - Advance to next era and reset progress"
            className="bg-accent text-app-0 px-4 py-2 rounded-lg font-bold hover:bg-accent-600 active:bg-accent-700 transition-all duration-200 shadow-soft"
          >
            <span aria-hidden="true">✨</span> Prestige
          </button>
        )}
      </div>

      {/* Traits Display */}
      {(legacyGameState.player?.traits?.claws ||
        legacyGameState.player?.traits?.arms ||
        legacyGameState.player?.traits?.brain) && (
        <div className="mt-3 pt-3 border-t border-border/60">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-ink-secondary font-semibold">Traits:</span>
            {legacyGameState.player?.traits?.claws && (
              <span className="bg-danger/15 text-danger border border-danger/30 px-2 py-1 rounded-full text-xs">
                🦅 Claws
              </span>
            )}
            {legacyGameState.player?.traits?.arms && (
              <span className="bg-accent/15 text-accent border border-accent/30 px-2 py-1 rounded-full text-xs">
                🦾 Arms
              </span>
            )}
            {legacyGameState.player?.traits?.brain && (
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
