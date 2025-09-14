/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { GameState } from '../types/game';

// Legacy type for old game system
interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxTier?: number;
  currentTier?: number;
  purchased?: boolean;
  effect: (gameState: GameState) => GameState;
}
import { getAvailableUpgrades, getUpgradeCost } from '../game/upgrades';

interface UpgradeShopProps {
  gameState: GameState;
  onClose: () => void;
  onPurchaseUpgrade: (upgrade: Upgrade) => void;
}

export const UpgradeShop: React.FC<UpgradeShopProps> = ({
  gameState,
  onClose,
  onPurchaseUpgrade,
}) => {
  const legacyGameState = gameState as any;
  const availableUpgrades = getAvailableUpgrades(gameState);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="app-surface-2 rounded-lg shadow-soft max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-accent text-app-0 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Evolution Shop</h2>
            <button
              onClick={onClose}
              className="text-app-0 hover:text-app-0/80 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-blue-100 mt-2">
            Spend your nectar-chips to evolve and survive the harsh epochs
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid gap-4 md:grid-cols-2">
            {availableUpgrades.map((upgrade) => {
              const cost = getUpgradeCost(upgrade, upgrade.currentTier || 0);
              const canAfford = (legacyGameState.player?.chips || 0) >= cost;

              return (
                <div
                  key={upgrade.id}
                  className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                    canAfford
                      ? 'border-gray-300 hover:border-blue-400 hover:shadow-md'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{upgrade.name}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">🍯 {cost}</div>
                      {upgrade.maxTier && (
                        <div className="text-xs text-gray-500">
                          Tier {upgrade.currentTier || 0} / {upgrade.maxTier}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 text-sm">{upgrade.description}</p>

                  <button
                    onClick={() => onPurchaseUpgrade(upgrade)}
                    disabled={!canAfford}
                    className={`w-full py-2 px-4 rounded-lg font-bold transition-colors duration-200 ${
                      canAfford
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Purchase' : 'Insufficient chips'}
                  </button>
                </div>
              );
            })}
          </div>

          {availableUpgrades.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No upgrades available right now.</p>
              <p className="text-gray-400 text-sm mt-2">
                Keep playing to unlock more evolutionary paths!
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Available chips:{' '}
              <span className="font-bold text-green-600">
                🍯 {legacyGameState.player?.chips || 0}
              </span>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Close Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
