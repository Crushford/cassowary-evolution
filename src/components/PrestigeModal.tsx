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
  const legacyGameState = gameState as any;
  const nextEraIndex = (legacyGameState.era?.id || 0) + 1;
  const nextEra = nextEraIndex < 4 ? `Era ${nextEraIndex + 1}` : 'The End';
  const flavorText =
    ERA_FLAVOR_TEXT[legacyGameState.era?.id || 0] || 'The cycle continues...';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="app-surface-2 rounded-lg shadow-soft max-w-2xl w-full mx-4">
        <div className="bg-accent text-app-0 p-6 rounded-t-lg">
          <h2 className="text-3xl font-bold text-center">✨ Prestige Opportunity ✨</h2>
          <p className="text-app-0/80 text-center mt-2">
            You have reached the threshold of your current era
          </p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🦚</div>
            <h3 className="text-2xl font-bold text-ink-primary mb-2">
              Advance to {nextEra}
            </h3>
            <p className="text-ink-secondary text-lg">{flavorText}</p>
          </div>

          <div className="bg-accent/15 border border-accent/30 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-accent mb-2">
              What happens when you prestige:
            </h4>
            <ul className="text-ink-secondary space-y-1 text-sm">
              <li>• Spend all {legacyGameState.player?.chips || 0} nectar-chips</li>
              <li>• Advance to the next era with harsher conditions</li>
              <li>
                • Keep your permanent traits:{' '}
                {[
                  legacyGameState.player?.traits?.claws && 'Claws',
                  legacyGameState.player?.traits?.arms && 'Arms',
                  legacyGameState.player?.traits?.brain && 'Brain',
                ]
                  .filter(Boolean)
                  .join(', ') || 'None yet'}
              </li>
              <li>• Keep Map Memory upgrade if purchased</li>
              <li>• Face greater challenges for bigger rewards</li>
            </ul>
          </div>

          <div className="bg-danger/15 border border-danger/30 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-danger mb-2">⚠️ Warning:</h4>
            <p className="text-danger text-sm">
              The next era will have more predators and fewer safe nesting grounds. Your
              current partners and temporary upgrades will be reset. Only your permanent
              evolutionary traits will carry forward.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onPrestige}
              className="flex-1 bg-accent hover:bg-accent-600 active:bg-accent-700 text-app-0 font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-soft"
            >
              🚀 Advance Era
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-app-2 text-ink-muted border border-border/60 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Stay in {legacyGameState.era?.name || 'Unknown'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
