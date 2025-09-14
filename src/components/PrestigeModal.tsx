import React from 'react';
import { GameState } from '../types/game';

interface PrestigeModalProps {
  gameState: GameState;
  onPrestige: () => void;
  onClose: () => void;
}

const ERA_FLAVOR_TEXT: Record<number, string> = {
  0: 'The peaceful Eden ends. Shadows gather at the edges of your territory.',
  1: 'The first predators emerge from the undergrowth. Your kind must adapt or perish.',
  2: 'The predators multiply rapidly. Only the most evolved will survive this harsh epoch.',
  3: 'The peak of danger approaches. Your evolutionary journey reaches its most critical phase.',
};

export const PrestigeModal: React.FC<PrestigeModalProps> = ({
  gameState,
  onPrestige,
  onClose,
}) => {
  const nextEraIndex = gameState.era.id + 1;
  const nextEra = nextEraIndex < 4 ? `Era ${nextEraIndex + 1}` : 'The End';
  const flavorText =
    ERA_FLAVOR_TEXT[gameState.era.id] || 'The cycle continues...';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-lg">
          <h2 className="text-3xl font-bold text-center">
            ✨ Prestige Opportunity ✨
          </h2>
          <p className="text-purple-100 text-center mt-2">
            You have reached the threshold of your current era
          </p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🦚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Advance to {nextEra}
            </h3>
            <p className="text-gray-700 text-lg">{flavorText}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-amber-900 mb-2">
              What happens when you prestige:
            </h4>
            <ul className="text-amber-800 space-y-1 text-sm">
              <li>• Spend all {gameState.player.chips} nectar-chips</li>
              <li>• Advance to the next era with harsher conditions</li>
              <li>
                • Keep your permanent traits:{' '}
                {[
                  gameState.player.traits.claws && 'Claws',
                  gameState.player.traits.arms && 'Arms',
                  gameState.player.traits.brain && 'Brain',
                ]
                  .filter(Boolean)
                  .join(', ') || 'None yet'}
              </li>
              <li>• Keep Map Memory upgrade if purchased</li>
              <li>• Face greater challenges for bigger rewards</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-red-900 mb-2">⚠️ Warning:</h4>
            <p className="text-red-800 text-sm">
              The next era will have more predators and fewer safe nesting
              grounds. Your current partners and temporary upgrades will be
              reset. Only your permanent evolutionary traits will carry forward.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onPrestige}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
            >
              🚀 Advance Era
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Stay in {gameState.era.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
