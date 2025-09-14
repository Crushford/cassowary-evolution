import React from 'react';

interface TutorialTopBarProps {
  chips: number;
  cap: number;
  partnersSelected: number;
  maxPartners: number;
  onHelpClick: () => void;
}

export const TutorialTopBar: React.FC<TutorialTopBarProps> = ({
  chips,
  cap,
  partnersSelected,
  maxPartners,
  onHelpClick,
}) => {
  const progressPercentage = Math.min((chips / cap) * 100, 100);

  return (
    <div className="sticky top-0 z-50 app-surface border-b border-border shadow-soft">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Era title */}
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-bold text-ink-primary">Eden · Round 1</h2>
          </div>

          {/* Center: Chips and progress */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🍯</span>
              <span className="text-lg font-semibold text-ink-primary">
                {chips.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-32 h-3 bg-app-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-sm text-ink-secondary font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          {/* Right: Partners count and help */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🦚</span>
              <span className="text-sm font-medium text-ink-secondary">
                {partnersSelected}/{maxPartners}
              </span>
            </div>

            <button
              onClick={onHelpClick}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-accent/15 hover:bg-accent/25 text-accent border border-accent/30 transition-colors duration-200"
            >
              <span className="text-sm">Help</span>
              <span className="text-xs">(?)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
