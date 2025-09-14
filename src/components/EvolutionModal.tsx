import React from 'react';
import { loadConfig, getEvolutionNodesForTier } from '../game/config';
import type { GameState } from '../types/game';
import { SPRITES } from '../assets/sprites';

interface EvolutionModalProps {
  gameState: GameState;
  onClose: () => void;
  onPurchaseNode: (nodeId: string) => void;
}

export function EvolutionModal({
  gameState,
  onClose,
  onPurchaseNode,
}: EvolutionModalProps) {
  const config = loadConfig();
  const availableNodes = getEvolutionNodesForTier(gameState.progress.evolutionPoints);
  const currentTier = Math.floor(
    gameState.progress.evolutionPoints / config.evolution.milestoneStepEP,
  );

  const canPurchase = (nodeId: string) => {
    const node = config.evolution.nodes.find((n) => n.id === nodeId);
    if (!node) return false;

    // Check if already purchased
    if (gameState.progress.purchasedNodes.includes(nodeId)) return false;

    // Check EP cost
    if (gameState.progress.evolutionPoints < node.cost) return false;

    // Check prerequisites
    if (node.prereq) {
      return node.prereq.every((prereqId) =>
        gameState.progress.purchasedNodes.includes(prereqId),
      );
    }

    return true;
  };

  const getBranchColor = (branch: string) => {
    switch (branch) {
      case 'foraging':
        return 'text-green-600 bg-green-100';
      case 'defense':
        return 'text-red-600 bg-red-100';
      case 'social':
        return 'text-blue-600 bg-blue-100';
      case 'arms':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="evolution-modal"
    >
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Choose What Survives</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                src={SPRITES.epDNA}
                alt="Evolution points"
                className="pixelated sprite-32"
              />
              <span className="text-lg font-semibold">
                Evolution Points: {gameState.progress.evolutionPoints}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              Tier {currentTier} (Next milestone at{' '}
              {(currentTier + 1) * config.evolution.milestoneStepEP} EP)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableNodes.map((node) => {
            const isPurchased = gameState.progress.purchasedNodes.includes(node.id);
            const canBuy = canPurchase(node.id);

            return (
              <div
                key={node.id}
                data-testid={`evolution-node-${node.id}`}
                className={`border rounded-lg p-4 ${
                  isPurchased
                    ? 'bg-green-50 border-green-200'
                    : canBuy
                      ? 'bg-white border-gray-200 hover:border-blue-300 cursor-pointer'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
                onClick={() => canBuy && onPurchaseNode(node.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{node.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getBranchColor(node.branch)}`}
                  >
                    {node.branch}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-3">Cost: {node.cost} EP</div>

                {node.effects && (
                  <div className="text-sm">
                    {Object.entries(node.effects).map(([key, value]) => (
                      <div key={key} className="text-gray-700">
                        {key === 'extraFoodTiles' && `+${value} food tiles`}
                        {key === 'predatorMitigationPct' &&
                          `+${value}% predator resistance`}
                        {key === 'eggMultiplier' && `×${value} egg production`}
                        {key === 'popCapIncrease' && `+${value} population capacity`}
                        {key === 'groupsIncrease' && `+${value} group size`}
                      </div>
                    ))}
                  </div>
                )}

                {node.prereq && node.prereq.length > 0 && (
                  <div className="text-xs text-gray-500 mt-2">
                    Requires: {node.prereq.join(', ')}
                  </div>
                )}

                {isPurchased && (
                  <div className="text-green-600 text-sm font-medium mt-2">
                    ✓ Purchased
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {availableNodes.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No evolution options available. Reach the next milestone to unlock more nodes.
          </div>
        )}
      </div>
    </div>
  );
}
