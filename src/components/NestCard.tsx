import React from 'react';
import type { Outcome } from '../types/nestCards';

interface NestCardProps {
  index: number;
  outcome: Outcome;
  state: 'hidden' | 'revealed' | 'shadow';
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const getCardContent = (outcome: Outcome, state: 'hidden' | 'revealed' | 'shadow') => {
  if (state === 'hidden') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-gray-400"></div>
      </div>
    );
  }

  const isShadow = state === 'shadow';
  const baseClasses = 'w-full h-full flex items-center justify-center text-2xl font-bold';
  const shadowClasses = isShadow ? 'opacity-75 brightness-75' : '';

  switch (outcome) {
    case 'fruit':
      return <div className={`${baseClasses} ${shadowClasses} text-green-600`}>🍎</div>;
    case 'barren':
      return <div className={`${baseClasses} ${shadowClasses} text-gray-500`}>🌱</div>;
    case 'predator':
      return <div className={`${baseClasses} ${shadowClasses} text-red-600`}>🦅</div>;
    default:
      return null;
  }
};

export const NestCard: React.FC<NestCardProps> = ({
  index,
  outcome,
  state,
  isSelected,
  onClick,
  disabled = false,
}) => {
  const baseClasses =
    'w-20 h-24 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center relative';
  const stateClasses = {
    hidden: 'border-gray-400 bg-gray-100 hover:bg-gray-200',
    revealed: 'border-green-500 bg-green-50',
    shadow: 'border-gray-300 bg-gray-50 opacity-75',
  };
  const selectedClasses = isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : '';
  const disabledClasses = disabled ? 'cursor-not-allowed opacity-50' : '';

  return (
    <div
      data-testid={`card-${index}`}
      data-state={state}
      className={`${baseClasses} ${stateClasses[state]} ${selectedClasses} ${disabledClasses}`}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Card ${index + 1}, ${state === 'hidden' ? 'hidden' : outcome}`}
    >
      {getCardContent(outcome, state)}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          ✓
        </div>
      )}
    </div>
  );
};
