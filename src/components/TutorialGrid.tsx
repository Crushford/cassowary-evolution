import React, { useState, useEffect } from 'react';
// Legacy types for old game system
interface Coord {
  r: number;
  c: number;
}

type TileType = 'food' | 'barren' | 'predator';

interface TutorialGridProps {
  onRoundComplete: (outcome: TutorialRoundOutcome) => void;
  onSelectionChange?: (selectedCount: number) => void;
}

export interface TutorialRoundOutcome {
  selections: Coord[];
  flips: Array<{
    coord: Coord;
    type: TileType;
    payout: number;
  }>;
  chipsDelta: number;
}

interface TileState {
  type: TileType;
  isSelected: boolean;
  isRevealed: boolean;
  isFlipping: boolean;
}

const TutorialTile: React.FC<{
  coord: Coord;
  tileState: TileState;
  isQueen: boolean;
  isFocused: boolean;
  onClick: () => void;
}> = ({ tileState, isQueen, isFocused, onClick }) => {
  const { type, isSelected, isRevealed, isFlipping } = tileState;

  const getTileClasses = () => {
    let baseClasses =
      'relative aspect-square rounded-xl border transition-all duration-200 flex items-center justify-center text-2xl';

    if (isQueen) {
      baseClasses +=
        ' bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400 cursor-not-allowed animate-pulse';
      baseClasses += ' ring-2 ring-cyan-400/40';
    } else if (isRevealed) {
      baseClasses += ' border-white/20';
      switch (type) {
        case 'food':
          baseClasses +=
            ' bg-gradient-to-br from-green-600 to-green-800 shadow-lg shadow-green-500/25';
          break;
        case 'barren':
          baseClasses += ' bg-gradient-to-br from-gray-600 to-gray-800';
          break;
        case 'predator':
          baseClasses +=
            ' bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-500/25';
          break;
      }
    } else if (isSelected) {
      baseClasses +=
        ' bg-gradient-to-br from-emerald-700 to-emerald-900 border-amber-400 ring-4 ring-amber-400/70 shadow-lg';
    } else {
      baseClasses +=
        ' bg-emerald-900/20 border-white/10 hover:bg-emerald-800/25 hover:border-white/20';
    }

    // Add focus ring for keyboard navigation
    if (isFocused && !isQueen && !isSelected) {
      baseClasses += ' ring-2 ring-cyan-400/60';
    }

    if (isFlipping) {
      baseClasses += ' transform-gpu transition-transform duration-250';
    }

    return baseClasses;
  };

  const getTileIcon = () => {
    if (isQueen) {
      return '👑';
    } else if (isRevealed) {
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
    } else if (isSelected) {
      return '🦚'; // Partner figure
    }
    return '';
  };

  return (
    <button
      className={getTileClasses()}
      onClick={onClick}
      disabled={isQueen}
      style={{
        transform: isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}
      role="gridcell"
      aria-label={
        isQueen
          ? "Queen's nest - not selectable"
          : isRevealed
            ? `Revealed: ${type}`
            : isSelected
              ? 'Selected partner'
              : isFocused
                ? 'Selectable nest (focused)'
                : 'Selectable nest'
      }
      aria-live="polite"
    >
      <span className="drop-shadow-lg">{getTileIcon()}</span>

      {/* Selection indicator */}
      {isSelected && !isRevealed && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full ring-2 ring-app-0"></div>
      )}
    </button>
  );
};

export const TutorialGrid: React.FC<TutorialGridProps> = ({
  onRoundComplete,
  onSelectionChange,
}) => {
  const [tiles, setTiles] = useState<Record<string, TileState>>({});
  const [selectedTiles, setSelectedTiles] = useState<Coord[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [, setFlipOrder] = useState<Coord[]>([]);
  const [focusedTile, setFocusedTile] = useState<Coord>({ r: 0, c: 0 });

  // Generate initial board layout
  useEffect(() => {
    const newTiles: Record<string, TileState> = {};

    // Create 3x3 grid (0-2, 0-2)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const key = `${r},${c}`;
        const isQueen = r === 1 && c === 1; // Center is Queen

        if (isQueen) {
          newTiles[key] = {
            type: 'food', // Queen is technically food but not selectable
            isSelected: false,
            isRevealed: false,
            isFlipping: false,
          };
        } else {
          // Generate random tile type for tutorial (biased toward food)
          const rand = Math.random();
          let type: TileType;
          if (rand < 0.6) type = 'food';
          else if (rand < 0.8) type = 'barren';
          else type = 'predator';

          newTiles[key] = {
            type,
            isSelected: false,
            isRevealed: false,
            isFlipping: false,
          };
        }
      }
    }

    setTiles(newTiles);
    setSelectedTiles([]);
    setFocusedTile({ r: 0, c: 0 });
    onSelectionChange?.(0);
  }, [onSelectionChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFlipping) return;

      const newFocus = { ...focusedTile };

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          newFocus.r = Math.max(0, focusedTile.r - 1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          newFocus.r = Math.min(2, focusedTile.r + 1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          newFocus.c = Math.max(0, focusedTile.c - 1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          newFocus.c = Math.min(2, focusedTile.c + 1);
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          handleTileClick(focusedTile);
          return;
        default:
          return;
      }

      // Skip Queen tile (center)
      if (newFocus.r === 1 && newFocus.c === 1) {
        // Move to next available tile
        if (event.key === 'ArrowUp') newFocus.r = 0;
        else if (event.key === 'ArrowDown') newFocus.r = 2;
        else if (event.key === 'ArrowLeft') newFocus.c = 0;
        else if (event.key === 'ArrowRight') newFocus.c = 2;
      }

      setFocusedTile(newFocus);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedTile, isFlipping]);

  const handleTileClick = (coord: Coord) => {
    if (coord.r === 1 && coord.c === 1) return; // Queen is not selectable

    const key = `${coord.r},${coord.c}`;
    const tile = tiles[key];
    if (!tile || isFlipping) return;

    const isAlreadySelected = selectedTiles.some(
      (sel) => sel.r === coord.r && sel.c === coord.c,
    );

    if (isAlreadySelected) {
      // Deselect tile
      setSelectedTiles((prev) =>
        prev.filter((sel) => !(sel.r === coord.r && sel.c === coord.c)),
      );
      setTiles((prev) => ({
        ...prev,
        [key]: { ...prev[key], isSelected: false },
      }));
      onSelectionChange?.(selectedTiles.length - 1);
    } else if (selectedTiles.length < 3) {
      // Select tile
      setSelectedTiles((prev) => [...prev, coord]);
      setTiles((prev) => ({
        ...prev,
        [key]: { ...prev[key], isSelected: true },
      }));
      onSelectionChange?.(selectedTiles.length + 1);
    }
  };

  const handleEndRound = async () => {
    if (selectedTiles.length !== 3) return;

    setIsFlipping(true);

    // Set flip order (left to right, top to bottom of selections)
    const sortedSelections = [...selectedTiles].sort((a, b) => {
      if (a.r !== b.r) return a.r - b.r;
      return a.c - b.c;
    });
    setFlipOrder(sortedSelections);

    // Flip tiles sequentially
    const flips: TutorialRoundOutcome['flips'] = [];
    let chipsDelta = 0;

    for (let i = 0; i < sortedSelections.length; i++) {
      const coord = sortedSelections[i];
      const key = `${coord.r},${coord.c}`;
      const tile = tiles[key];

      // Start flip animation
      setTiles((prev) => ({
        ...prev,
        [key]: { ...prev[key], isFlipping: true },
      }));

      // Wait for flip animation
      await new Promise((resolve) => setTimeout(resolve, 250));

      // Reveal tile
      setTiles((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isRevealed: true,
          isFlipping: false,
        },
      }));

      // Calculate payout
      const payout = tile.type === 'food' ? 10 : 0;
      chipsDelta += payout;

      flips.push({
        coord,
        type: tile.type,
        payout,
      });

      // Small delay between flips
      if (i < sortedSelections.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Wait a moment then complete round
    setTimeout(() => {
      onRoundComplete({
        selections: selectedTiles,
        flips,
        chipsDelta,
      });
      setIsFlipping(false);
    }, 300);
  };

  const canEndRound = selectedTiles.length === 3 && !isFlipping;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Game Board */}
      <div className="relative aspect-square max-w-[min(80vmin,640px)] w-full mx-auto">
        <div
          className="grid grid-cols-3 grid-rows-3 gap-2 p-2 rounded-2xl bg-app-1/40 shadow-lg h-full"
          role="grid"
          aria-label="3x3 game board"
        >
          {Array.from({ length: 3 }, (_, r) =>
            Array.from({ length: 3 }, (_, c) => {
              const coord = { r, c };
              const key = `${r},${c}`;
              const tile = tiles[key];

              if (!tile) return null;

              return (
                <TutorialTile
                  key={key}
                  coord={coord}
                  tileState={tile}
                  isQueen={r === 1 && c === 1}
                  isFocused={focusedTile.r === r && focusedTile.c === c}
                  onClick={() => handleTileClick(coord)}
                />
              );
            }),
          )}
        </div>
      </div>

      {/* Placement Tray */}
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-lg border-2 border-dashed flex items-center justify-center text-xl transition-all duration-200 ${
                i < selectedTiles.length
                  ? 'border-amber-400 bg-accent/10'
                  : 'border-gray-400 bg-app-2/10'
              }`}
            >
              {i < selectedTiles.length ? '🦚' : '👤'}
            </div>
          ))}
        </div>

        <button
          onClick={handleEndRound}
          disabled={!canEndRound}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            canEndRound
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-app-2 text-ink-muted cursor-not-allowed'
          }`}
        >
          End Round
        </button>
      </div>

      {/* Status Text */}
      <p className="text-sm text-ink-secondary text-center max-w-md">
        {selectedTiles.length === 0
          ? 'Choose 3 nests for your partners'
          : selectedTiles.length < 3
            ? `Choose ${3 - selectedTiles.length} more nest${3 - selectedTiles.length !== 1 ? 's' : ''}`
            : 'Ready to reveal your choices!'}
      </p>
    </div>
  );
};
