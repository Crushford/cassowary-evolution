import React from 'react';
import { NestCard } from './NestCard';
import type { RoundBoard } from '../types/nestCards';

interface NestBoardProps {
  board: RoundBoard;
  picksRemaining: number;
  onCardClick: (index: number) => void;
  disabled?: boolean;
}

export const NestBoard: React.FC<NestBoardProps> = ({
  board,
  picksRemaining,
  onCardClick,
  disabled = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Cards Row */}
      <div className="flex justify-center gap-4">
        {board.outcomes.map((outcome, index) => (
          <NestCard
            key={index}
            index={index}
            outcome={outcome}
            state={board.revealed[index]}
            isSelected={board.selected.includes(index)}
            onClick={() => onCardClick(index)}
            disabled={disabled || board.selected.includes(index)}
          />
        ))}
      </div>

      {/* Figurines Tray */}
      <div className="flex justify-center">
        <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-4">
          <div className="text-center text-sm text-amber-800 mb-2">
            Figurines ({picksRemaining} remaining)
          </div>
          <div className="flex gap-2 justify-center">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                data-testid={`tray-slot-${i}`}
                className={`w-6 h-6 rounded-full border-2 ${
                  i < 3 - picksRemaining
                    ? 'bg-blue-500 border-blue-600'
                    : 'bg-gray-300 border-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
