import React, { useState, useEffect } from 'react';
import { TutorialRoundOutcome } from './TutorialGrid';

interface TutorialResultPanelProps {
  outcome: TutorialRoundOutcome;
  onContinue: () => void;
  onClose: () => void;
}

export const TutorialResultPanel: React.FC<TutorialResultPanelProps> = ({
  outcome,
  onContinue,
  onClose,
}) => {
  const [visibleResults, setVisibleResults] = useState<number>(0);

  useEffect(() => {
    // Animate results appearing sequentially
    const timer = setTimeout(() => {
      setVisibleResults(outcome.flips.length);
    }, 500);

    return () => clearTimeout(timer);
  }, [outcome.flips.length]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'food':
        return '🍎';
      case 'barren':
        return '🍂';
      case 'predator':
        return '🦅';
      default:
        return '?';
    }
  };

  const getResultText = (type: string, payout: number) => {
    switch (type) {
      case 'food':
        return `Fruit found · +${payout}`;
      case 'barren':
        return 'Nothing this season';
      case 'predator':
        return 'Shadow in the ferns';
      default:
        return 'Unknown result';
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'food':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'barren':
        return 'text-ink-secondary bg-app-1 border-border/60';
      case 'predator':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-ink-secondary bg-app-1 border-border/60';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="app-surface-2 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-border/60">
          <h3 className="text-xl font-bold text-ink-primary text-center">
            Round Results
          </h3>
        </div>

        {/* Results */}
        <div className="p-6 space-y-4">
          {outcome.flips.map((flip, index) => (
            <div
              key={`${flip.coord.r},${flip.coord.c}`}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                index < visibleResults
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getResultIcon(flip.type)}</span>
                <div>
                  <p className={`font-medium ${getResultColor(flip.type).split(' ')[0]}`}>
                    {getResultText(flip.type, flip.payout)}
                  </p>
                  <p className="text-sm text-ink-muted">
                    Nest {flip.coord.r + 1},{flip.coord.c + 1}
                  </p>
                </div>
              </div>

              {flip.payout > 0 && (
                <div className="text-lg font-bold text-green-600">+{flip.payout}</div>
              )}
            </div>
          ))}

          {/* Total */}
          <div className="border-t border-border/60 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-ink-secondary">
                Total Chips:
              </span>
              <span className="text-xl font-bold text-accent">+{outcome.chipsDelta}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border/60 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-ink-secondary hover:text-gray-800 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-6 py-3 bg-accent hover:bg-accent-600 text-app-0 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Deal next season
          </button>
        </div>
      </div>
    </div>
  );
};
