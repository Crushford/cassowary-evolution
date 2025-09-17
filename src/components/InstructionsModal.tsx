import React from 'react';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="app-surface-2 rounded-lg shadow-soft max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-accent text-app-0 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🦚 How to Play Cassowary Queen</h2>
            <button
              onClick={onClose}
              className="text-app-0 hover:text-app-0/80 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-ink-primary mb-3">Objective</h3>
              <p className="text-ink-secondary">
                You are the Cassowary Queen, leading your dynasty through evolutionary
                epochs. Place your male partners on the 9×9 grid to find safe nesting
                grounds and earn nectar-chips.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink-primary mb-3">Gameplay</h3>
              <ul className="text-ink-secondary space-y-2">
                <li>
                  • <strong>Select 3 tiles</strong> each round to place your partners
                </li>
                <li>
                  • <strong>Food tiles</strong> 🍎 give you nectar-chips
                </li>
                <li>
                  • <strong>Barren tiles</strong> 🌱 give nothing
                </li>
                <li>
                  • <strong>Predator tiles</strong> 🦅 are dangerous but can be survived
                  with upgrades
                </li>
                <li>• The center tile (Q) is your Queen's nest and cannot be selected</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink-primary mb-3">Evolution</h3>
              <ul className="text-ink-secondary space-y-2">
                <li>
                  • Spend nectar-chips on <strong>upgrades</strong> to improve your
                  chances
                </li>
                <li>
                  • <strong>Claws</strong> give you a 50% chance to survive predators
                </li>
                <li>
                  • <strong>Add Partners</strong> to place more males each round
                </li>
                <li>
                  • <strong>Scout Instinct</strong> reveals safe tiles before selection
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink-primary mb-3">Prestige</h3>
              <p className="text-ink-secondary">
                When you reach the era's chip cap, you can <strong>prestige</strong> to
                advance to the next era. This resets your chips but keeps permanent traits
                and makes the game harder with bigger rewards.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink-primary mb-3">Mutations</h3>
              <p className="text-ink-secondary">
                Occasionally, rare <strong>mutations</strong> will be offered. These
                provide powerful benefits but come with significant risks. Choose
                carefully!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-app-1 p-4 border-t border-border/60">
          <button
            onClick={onClose}
            className="w-full bg-accent hover:bg-accent-600 active:bg-accent-700 text-app-0 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Start Playing!
          </button>
        </div>
      </div>
    </div>
  );
};
