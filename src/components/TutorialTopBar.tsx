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
    <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Era title */}
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-bold text-amber-900">Eden · Round 1</h2>
          </div>

          {/* Center: Chips and progress */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🍯</span>
              <span className="text-lg font-semibold text-amber-800">
                {chips.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-32 h-3 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-sm text-amber-700 font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          {/* Right: Partners count and help */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🦚</span>
              <span className="text-sm font-medium text-amber-800">
                {partnersSelected}/{maxPartners}
              </span>
            </div>

            <button
              onClick={onHelpClick}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-800 transition-colors duration-200"
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
