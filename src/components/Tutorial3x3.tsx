import React, { useState, useEffect } from 'react';
import { makeRng, type RNG } from '../lib/rng';
import { deal3x3, type TileOutcome } from '../game/deal3x3';
import { resolveRound } from '../game/resolve';

interface Tutorial3x3Props {
  seed?: string;
  foodCount?: number;
  barrenCount?: number;
  predatorCount?: number;
  testMode?: boolean;
  goal?: number;
}

interface GameState {
  round: number;
  population: number;
  selectedTiles: Array<[number, number]>;
  outcomes: Map<string, TileOutcome>;
  roundResults: Array<{
    r: number;
    c: number;
    type: TileOutcome;
    gain: number;
  }> | null;
  gameComplete: boolean;
}

const Tutorial3x3: React.FC<Tutorial3x3Props> = ({
  seed = 'default-seed',
  foodCount = 6,
  barrenCount = 2,
  predatorCount = 0,
  testMode = false, // eslint-disable-line @typescript-eslint/no-unused-vars
  goal = 100,
}) => {
  const [gameState, setGameState] = useState<GameState>({
    round: 1,
    population: 3,
    selectedTiles: [],
    outcomes: new Map(),
    roundResults: null,
    gameComplete: false,
  });

  const [rng, setRng] = useState<RNG | null>(null);

  // Initialize RNG and first deal
  useEffect(() => {
    const newRng = makeRng(seed);
    setRng(newRng);

    const { outcomes } = deal3x3(newRng, {
      foodCount,
      barrenCount,
      predatorCount,
    });
    setGameState((prev) => ({
      ...prev,
      outcomes,
    }));
  }, [seed, foodCount, barrenCount, predatorCount]);

  const handleTileClick = (row: number, col: number) => {
    if (gameState.gameComplete || gameState.roundResults) return;
    if (row === 1 && col === 1) return; // Center tile (Queen) is not selectable

    setGameState((prev) => {
      const newSelected = [...prev.selectedTiles];
      const existingIndex = newSelected.findIndex(([r, c]) => r === row && c === col);

      if (existingIndex >= 0) {
        // Deselect tile
        newSelected.splice(existingIndex, 1);
      } else if (newSelected.length < 3) {
        // Select tile (max 3)
        newSelected.push([row, col]);
      }

      return { ...prev, selectedTiles: newSelected };
    });
  };

  const handleEndRound = () => {
    if (gameState.selectedTiles.length !== 3 || !rng) return;

    const { results, nextPop } = resolveRound(
      gameState.selectedTiles,
      gameState.outcomes,
      gameState.population,
    );

    setGameState((prev) => ({
      ...prev,
      roundResults: results,
      population: nextPop,
      gameComplete: nextPop >= goal,
    }));
  };

  const handleContinue = () => {
    if (!rng) return;

    const { outcomes } = deal3x3(rng, {
      foodCount,
      barrenCount,
      predatorCount,
    });
    setGameState((prev) => ({
      ...prev,
      round: prev.round + 1,
      selectedTiles: [],
      outcomes,
      roundResults: null,
    }));
  };

  const getTileContent = (row: number, col: number) => {
    if (row === 1 && col === 1) {
      return '👑'; // Queen
    }

    if (gameState.roundResults) {
      const result = gameState.roundResults.find((r) => r.r === row && r.c === col);
      if (result) {
        switch (result.type) {
          case 'food':
            return '🍎';
          case 'barren':
            return '🌵';
          case 'predator':
            return '🦅';
        }
      }
    }

    return '?';
  };

  const getTileClass = (row: number, col: number) => {
    const baseClass =
      'w-16 h-16 border-2 border-gray-400 flex items-center justify-center text-2xl cursor-pointer transition-all duration-200';

    if (row === 1 && col === 1) {
      return `${baseClass} bg-accent/20 border-accent cursor-not-allowed`;
    }

    if (gameState.roundResults) {
      const result = gameState.roundResults.find((r) => r.r === row && r.c === col);
      if (result) {
        switch (result.type) {
          case 'food':
            return `${baseClass} bg-success/20 border-success`;
          case 'barren':
            return `${baseClass} bg-app-1 border-border`;
          case 'predator':
            return `${baseClass} bg-danger/20 border-danger`;
        }
      }
      return `${baseClass} bg-app-1 border-border/60`;
    }

    const isSelected = gameState.selectedTiles.some(([r, c]) => r === row && c === col);
    if (isSelected) {
      return `${baseClass} bg-accent/20 border-accent`;
    }

    return `${baseClass} bg-app-0 hover:bg-app-1`;
  };

  if (gameState.gameComplete) {
    return (
      <div className="flex flex-col items-center space-y-4 p-8">
        <h2 className="text-3xl font-bold text-success">Victory!</h2>
        <p className="text-xl">
          Population reached: <span data-testid="population">{gameState.population}</span>
        </p>
        <p className="text-lg">
          Rounds completed: <span data-testid="round">{gameState.round}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Tutorial 3×3</h2>
        <div className="flex space-x-4 text-lg">
          <span>
            Round: <span data-testid="round">{gameState.round}</span>
          </span>
          <span>
            Population: <span data-testid="population">{gameState.population}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 3 }, (_, col) => (
            <button
              key={`${row}-${col}`}
              data-testid={
                row === 1 && col === 1 ? 'tile-center' : `tile-r${row}-c${col}`
              }
              className={getTileClass(row, col)}
              onClick={() => handleTileClick(row, col)}
              disabled={row === 1 && col === 1}
            >
              {getTileContent(row, col)}
            </button>
          )),
        )}
      </div>

      <div className="flex space-x-4">
        <button
          data-testid="end-round"
          className="px-6 py-2 bg-accent text-white rounded-lg disabled:bg-app-2 disabled:cursor-not-allowed"
          onClick={handleEndRound}
          disabled={
            gameState.selectedTiles.length !== 3 || gameState.roundResults !== null
          }
        >
          End Round
        </button>

        {gameState.roundResults && (
          <button
            data-testid="continue"
            className="px-6 py-2 bg-success text-white rounded-lg"
            onClick={handleContinue}
          >
            Continue
          </button>
        )}
      </div>

      {gameState.roundResults && (
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Round Results</h3>
          <div className="space-y-1">
            {gameState.roundResults.map((result, idx) => (
              <div key={idx} className="text-sm">
                Tile ({result.r},{result.c}): {result.type}{' '}
                {result.gain > 0 ? `(+${result.gain})` : ''}
              </div>
            ))}
          </div>
          <div className="text-sm font-medium">
            Population change: +
            {gameState.roundResults.reduce((sum, r) => sum + r.gain, 0)}
          </div>
        </div>
      )}

      {/* Hidden round log for debugging */}
      <div data-testid="round-log" className="hidden">
        Round {gameState.round} → pop {gameState.population} (+
        {gameState.roundResults?.reduce((sum, r) => sum + r.gain, 0) || 0})
      </div>
    </div>
  );
};

export default Tutorial3x3;
