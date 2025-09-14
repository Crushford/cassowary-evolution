import React from 'react';
import { Coord, TileType, BoardState } from '../types/game';
import { coordToKey } from '../game/gameLogic';

interface GameGridProps {
  board: BoardState;
  selectedTiles: Coord[];
  onTileSelect: (coord: Coord) => void;
  revealedTiles: Set<string>;
  hintedTiles: Set<string>;
}

const TileButton: React.FC<{
  coord: Coord;
  tileType?: TileType;
  isSelected: boolean;
  isRevealed: boolean;
  isHinted: boolean;
  isQueen: boolean;
  onClick: () => void;
}> = ({ tileType, isSelected, isRevealed, isHinted, isQueen, onClick }) => {
  const baseClasses =
    'w-12 h-12 border-2 border-gray-600 flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-105 cursor-pointer';

  let bgColor = 'bg-gray-200';
  let borderColor = 'border-gray-600';
  let textColor = 'text-gray-700';

  if (isQueen) {
    bgColor = 'bg-purple-300';
    textColor = 'text-purple-900';
    borderColor = 'border-purple-600';
  } else if (isSelected) {
    bgColor = 'bg-yellow-300';
    borderColor = 'border-yellow-600';
    textColor = 'text-yellow-900';
  } else if (isRevealed) {
    switch (tileType) {
      case 'food':
        bgColor = 'bg-green-400';
        borderColor = 'border-green-600';
        textColor = 'text-green-900';
        break;
      case 'barren':
        bgColor = 'bg-gray-400';
        borderColor = 'border-gray-600';
        textColor = 'text-gray-700';
        break;
      case 'predator':
        bgColor = 'bg-red-400';
        borderColor = 'border-red-600';
        textColor = 'text-red-900';
        break;
    }
  } else if (isHinted) {
    bgColor = 'bg-blue-200';
    borderColor = 'border-blue-400';
    textColor = 'text-blue-800';
  }

  return (
    <button
      className={`${baseClasses} ${bgColor} ${borderColor} ${textColor} ${
        isSelected ? 'ring-2 ring-yellow-500' : ''
      } ${isHinted ? 'ring-1 ring-blue-400' : ''}`}
      onClick={onClick}
      disabled={isQueen}
      title={
        isQueen
          ? "Queen's Nest"
          : isRevealed
            ? `Revealed: ${tileType}`
            : isHinted
              ? 'Safe area'
              : 'Unknown territory'
      }
    >
      {isQueen
        ? 'Q'
        : isRevealed
          ? tileType === 'food'
            ? '🍎'
            : tileType === 'barren'
              ? '🌱'
              : tileType === 'predator'
                ? '🦅'
                : '?'
          : isHinted
            ? '?'
            : ''}
    </button>
  );
};

export const GameGrid: React.FC<GameGridProps> = ({
  board,
  selectedTiles,
  onTileSelect,
  revealedTiles,
  hintedTiles,
}) => {
  const isQueen = (coord: Coord) => coord.r === 4 && coord.c === 4;
  const isSelected = (coord: Coord) =>
    selectedTiles.some(sel => sel.r === coord.r && sel.c === coord.c);
  const isRevealed = (coord: Coord) => revealedTiles.has(coordToKey(coord));
  const isHinted = (coord: Coord) => hintedTiles.has(coordToKey(coord));

  return (
    <div className="bg-amber-50 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-amber-900 mb-4 text-center">
        Cassowary Territory
      </h2>
      <div className="grid grid-cols-9 gap-1 mx-auto w-fit">
        {Array.from({ length: 9 }, (_, r) =>
          Array.from({ length: 9 }, (_, c) => {
            const coord = { r, c };
            const tileKey = coordToKey(coord);
            const tileType = board.tiles[tileKey];

            return (
              <TileButton
                key={tileKey}
                coord={coord}
                tileType={tileType}
                isSelected={isSelected(coord)}
                isRevealed={isRevealed(coord)}
                isHinted={isHinted(coord)}
                isQueen={isQueen(coord)}
                onClick={() => onTileSelect(coord)}
              />
            );
          })
        )}
      </div>
      <div className="mt-4 text-sm text-amber-800 text-center">
        <p>
          Select {3 - selectedTiles.length} more tile
          {3 - selectedTiles.length !== 1 ? 's' : ''} to place your partners
        </p>
      </div>
    </div>
  );
};
