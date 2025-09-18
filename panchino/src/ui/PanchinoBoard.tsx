import React from 'react';
import { usePanchino, UsePanchinoOptions } from './state/usePanchino';

export interface PanchinoBoardProps extends UsePanchinoOptions {
  className?: string;
}

export function PanchinoBoard({ 
  className = '',
  ...options 
}: PanchinoBoardProps) {
  const { state, nextStep, dropEgg, reset, board } = usePanchino(options);

  const renderSlot = (slotIndex: number) => {
    const isCurrent = state.currentColumn === slotIndex;
    const isCenter = slotIndex === 3;
    const isFinal = state.isComplete && state.finalSlot === slotIndex;
    
    return (
      <div
        key={slotIndex}
        data-testid={`slot-${slotIndex}`}
        className={`
          w-12 h-12 border-2 rounded-lg flex items-center justify-center text-sm font-bold
          ${isCurrent ? 'bg-yellow-200 border-yellow-400' : ''}
          ${isFinal ? 'bg-green-200 border-green-400' : ''}
          ${isCenter ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'}
          ${!isCurrent && !isFinal ? 'text-gray-500' : 'text-gray-900'}
        `}
      >
        {isCurrent && <div data-testid={`cursor-col-${slotIndex}`}>🥚</div>}
        {isFinal && <div data-testid="final-slot">{slotIndex}</div>}
        {!isCurrent && !isFinal && slotIndex}
      </div>
    );
  };

  const renderPegRow = (rowIndex: number) => {
    return (
      <div key={rowIndex} data-testid={`peg-row-${rowIndex}`} className="flex justify-center gap-2 mb-2">
        {Array.from({ length: board.slots }, (_, colIndex) => (
          <div
            key={colIndex}
            className={`
              w-3 h-3 rounded-full
              ${state.path[rowIndex + 1] === colIndex ? 'bg-yellow-400' : 'bg-gray-300'}
            `}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Cassowary Panchino</h2>
        <div className="text-sm text-gray-600">
          Step: <span data-testid="step-count">{state.currentStep}</span> / {board.rows}
        </div>
      </div>

      {/* Board */}
      <div className="mb-6">
        {/* Peg rows */}
        {Array.from({ length: board.rows }, (_, rowIndex) => renderPegRow(rowIndex))}
        
        {/* Bottom slots */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: board.slots }, (_, slotIndex) => renderSlot(slotIndex))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          data-testid="btn-next-step"
          onClick={nextStep}
          disabled={state.isComplete}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
        
        <button
          data-testid="btn-drop-egg"
          onClick={dropEgg}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {state.isComplete ? 'New Drop' : 'Drop Egg'}
        </button>
        
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {state.isComplete && (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800 mb-2">
            Drop Complete!
          </div>
          <div className="text-sm text-gray-600">
            Final slot: {state.finalSlot}
          </div>
          {state.chicks !== undefined && state.chicks > 0 && (
            <div 
              data-testid="chicks-earned"
              className="text-lg font-bold text-green-600 mt-2"
            >
              +{state.chicks} chicks! 🐣
            </div>
          )}
        </div>
      )}

      {/* Round Summary */}
      {state.roundDrops.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold text-gray-800 mb-2">Round Summary</h3>
          <div className="space-y-1 text-sm">
            {state.roundDrops.map((drop, index) => (
              <div key={index} data-testid="drop-summary-row" className="flex justify-between">
                <span>Drop {index + 1}: Slot {drop.finalSlot}</span>
                <span>{drop.chicks > 0 ? `+${drop.chicks} chicks` : 'No chicks'}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-300">
            <div className="flex justify-between font-semibold">
              <span>Total chicks:</span>
              <span data-testid="total-chicks">{state.totalChicks}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
