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
    <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg shadow-md mb-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Era Info */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-amber-900">
            {gameState.era.name}
          </span>
          <span className="text-sm text-amber-700">Era {gameState.era.id}</span>
        </div>

        {/* Chips */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-green-800">
            🍯 {gameState.player.chips}
          </span>
          <span className="text-sm text-green-600">/ {gameState.era.cap}</span>
        </div>

        {/* Partners */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-800">
            👥 {gameState.player.partners}
          </span>
          <span className="text-sm text-blue-600">partners</span>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {gameState.player.chips} / {gameState.era.cap} nectar-chips
          </div>
        </div>

        {/* Prestige Button */}
        {canPrestige && (
          <button
            onClick={onPrestige}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-lg font-bold hover:from-purple-600 hover:to-purple-800 transition-all duration-200 shadow-lg"
          >
            ✨ Prestige
          </button>
        )}
      </div>

      {/* Traits Display */}
      {(gameState.player.traits.claws ||
        gameState.player.traits.arms ||
        gameState.player.traits.brain) && (
        <div className="mt-3 pt-3 border-t border-amber-300">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-amber-700 font-semibold">Traits:</span>
            {gameState.player.traits.claws && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                🦅 Claws
              </span>
            )}
            {gameState.player.traits.arms && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                🦾 Arms
              </span>
            )}
            {gameState.player.traits.brain && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                🧠 Brain
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
