import React from 'react';
// Legacy types for old game system
interface Coord {
  r: number;
  c: number;
}

type TileType = 'food' | 'barren' | 'predator';

interface BoardState {
  size: 9;
  queen: Coord;
  tiles: Record<string, TileType>;
  revealed: Set<string>;
  revealedHints: Set<string>;
}
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
}> = ({ tileType, isSelected, isRevealed, isHinted, isQueen, onClick, coord }) => {
  const baseClasses =
    'w-12 h-12 border-2 flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-105 cursor-pointer';

  let bgColor = 'bg-app-1';
  let borderColor = 'border-border';
  let textColor = 'text-ink-primary';

  if (isQueen) {
    bgColor = 'bg-accent/20';
    textColor = 'text-accent';
    borderColor = 'border-accent';
  } else if (isSelected) {
    bgColor = 'bg-accent/15';
    borderColor = 'border-accent';
    textColor = 'text-ink-primary';
  } else if (isRevealed) {
    switch (tileType) {
      case 'food':
        bgColor = 'bg-success/20';
        borderColor = 'border-success';
        textColor = 'text-success';
        break;
      case 'barren':
        bgColor = 'bg-app-2';
        borderColor = 'border-border';
        textColor = 'text-ink-secondary';
        break;
      case 'predator':
        bgColor = 'bg-danger/20';
        borderColor = 'border-danger';
        textColor = 'text-danger';
        break;
    }
  } else if (isHinted) {
    bgColor = 'bg-app-2';
    borderColor = 'border-border/80';
    textColor = 'text-ink-secondary';
  }

  const getAriaLabel = () => {
    if (isQueen) return "Queen's Nest - Cannot be selected";
    if (isRevealed)
      return `Tile at row ${coord.r + 1}, column ${coord.c + 1} - Revealed: ${tileType}`;
    if (isSelected) return `Tile at row ${coord.r + 1}, column ${coord.c + 1} - Selected`;
    if (isHinted) return `Tile at row ${coord.r + 1}, column ${coord.c + 1} - Safe area`;
    return `Tile at row ${coord.r + 1}, column ${coord.c + 1} - Unknown territory`;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isQueen) {
        onClick();
      }
    }
  };

  return (
    <button
      className={`${baseClasses} ${bgColor} ${borderColor} ${textColor} ${
        isSelected ? 'ring-2 ring-ring' : ''
      } ${isHinted ? 'ring-1 ring-ring/60' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={isQueen}
      aria-label={getAriaLabel()}
      aria-pressed={isSelected}
      role="button"
      tabIndex={isQueen ? -1 : 0}
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
    selectedTiles.some((sel) => sel.r === coord.r && sel.c === coord.c);
  const isRevealed = (coord: Coord) => revealedTiles.has(coordToKey(coord));
  const isHinted = (coord: Coord) => hintedTiles.has(coordToKey(coord));

  return (
    <div className="app-surface p-6 rounded-lg">
      <h2 className="text-xl font-bold text-ink-primary mb-4 text-center">
        Cassowary Territory
      </h2>
      <div
        className="grid grid-cols-9 gap-1 mx-auto w-fit"
        role="grid"
        aria-label="Game board with 9x9 grid of tiles"
        aria-describedby="game-instructions"
      >
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
          }),
        )}
      </div>
      <div className="mt-4 text-sm text-ink-secondary text-center">
        <p id="game-instructions">
          Select {3 - selectedTiles.length} more tile
          {3 - selectedTiles.length !== 1 ? 's' : ''} to place your partners
        </p>
      </div>
    </div>
  );
};
