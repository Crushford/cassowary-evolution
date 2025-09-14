import React from 'react';
import type { Progress } from '../types/nestCards';

interface NestHUDProps {
  progress: Progress;
}

export const NestHUD: React.FC<NestHUDProps> = ({ progress }) => {
  return (
    <div className="bg-green-800 text-white p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-sm text-green-200">Level</div>
          <div className="text-xl font-bold" data-testid="level">
            {progress.currentLevel}
          </div>
        </div>
        <div>
          <div className="text-sm text-green-200">Round</div>
          <div className="text-xl font-bold" data-testid="round">
            {progress.roundInLevel + 1}
          </div>
        </div>
        <div>
          <div className="text-sm text-green-200">Population</div>
          <div className="text-xl font-bold" data-testid="population">
            {progress.population}
          </div>
        </div>
        <div>
          <div className="text-sm text-green-200">Years</div>
          <div className="text-xl font-bold" data-testid="years">
            {progress.globalYears.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
