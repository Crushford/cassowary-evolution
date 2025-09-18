import React, { useState, useCallback } from 'react';
import { Egg } from './Egg';
import { Peg } from './Peg';
import { PrimaryButton } from './PrimaryButton';

type PanchinoBoardProps = {
  className?: string;
};

type BoardState = 'idle' | 'stepping' | 'landed';

type Position = {
  row: number;
  col: number;
};

const ROWS = 6;
const COLS = 7;
const CENTER_SLOT = 3; // Center slot index

export function PanchinoBoard({ className = '' }: PanchinoBoardProps) {
  const [state, setState] = useState<BoardState>('idle');
  const [currentPosition, setCurrentPosition] = useState<Position>({
    row: 0,
    col: 3,
  });
  const [finalSlot, setFinalSlot] = useState<number | null>(null);
  const [chicksEarned, setChicksEarned] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [pulsingPeg, setPulsingPeg] = useState<Position | null>(null);

  const getPositionPercentages = useCallback((pos: Position) => {
    return {
      x: (pos.col * 100) / COLS + 100 / COLS / 2, // Center the egg
      y: (pos.row * 100) / ROWS + 100 / ROWS / 2,
    };
  }, []);

  const handleNextStep = useCallback(() => {
    if (state !== 'idle') return;

    setState('stepping');
    setStepCount(prev => prev + 1);

    // Simulate the egg falling and hitting pegs
    const newRow = Math.min(currentPosition.row + 1, ROWS - 1);
    const shouldMoveLeft = Math.random() < 0.5;
    const newCol = Math.max(
      0,
      Math.min(COLS - 1, currentPosition.col + (shouldMoveLeft ? -1 : 1))
    );

    // Trigger peg pulse animation
    setPulsingPeg({ row: newRow, col: newCol });

    setTimeout(() => {
      setPulsingPeg(null);
    }, 80);

    setCurrentPosition({ row: newRow, col: newCol });

    // If we've reached the bottom, determine final slot
    if (newRow === ROWS - 1) {
      setTimeout(() => {
        setFinalSlot(newCol);
        setState('landed');

        // Award chicks for center slot
        if (newCol === CENTER_SLOT) {
          setChicksEarned(prev => prev + 1);
        }
      }, 160);
    } else {
      setTimeout(() => {
        setState('idle');
      }, 160);
    }
  }, [state, currentPosition]);

  const handleDropEgg = useCallback(() => {
    if (state !== 'idle') return;
    handleNextStep();
  }, [state, handleNextStep]);

  const handleReset = useCallback(() => {
    setState('idle');
    setCurrentPosition({ row: 0, col: 3 });
    setFinalSlot(null);
    setStepCount(0);
    setPulsingPeg(null);
  }, []);

  const isCenterSlot = (slotIndex: number) => slotIndex === CENTER_SLOT;
  const isSlotLanded = (slotIndex: number) => finalSlot === slotIndex;

  return (
    <div className={`w-full ${className}`}>
      {/* Ultra-Responsive Board Container */}
      <div
        className="@container xs:max-w-sm 3xl:max-w-4xl 4xl:max-w-5xl bg-panel2 xs:rounded-2xl border-line animate-scale-in responsive-container relative mx-auto aspect-[7/10] w-full max-w-xs overflow-hidden rounded-xl border sm:max-w-md md:max-w-lg md:rounded-3xl lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl"
        data-state={state}
        aria-busy={state === 'stepping'}
      >
        {/* CSS Grid for consistent layout */}
        <div className="absolute inset-0 grid grid-cols-7 grid-rows-6">
          {/* Grid Rails (optional visual guides) */}
          {Array.from({ length: COLS - 1 }).map((_, col) => (
            <div
              key={`rail-${col}`}
              className="bg-line/20 w-px"
              style={{ gridColumn: col + 2, gridRow: '1 / -1' }}
            />
          ))}

          {/* Pegs */}
          {Array.from({ length: ROWS - 1 }).map((_, row) =>
            Array.from({ length: COLS }).map((_, col) => {
              const isPulsing =
                pulsingPeg?.row === row && pulsingPeg?.col === col;

              return (
                <div
                  key={`peg-${row}-${col}`}
                  className="flex items-center justify-center"
                  style={{
                    gridColumn: col + 1,
                    gridRow: row + 1,
                  }}
                >
                  <Peg pulse={isPulsing} />
                </div>
              );
            })
          )}

          {/* Egg positioned absolutely within the grid */}
          <div
            className="pointer-events-none absolute flex items-center justify-center"
            style={{
              left: `${getPositionPercentages(currentPosition).x}%`,
              top: `${getPositionPercentages(currentPosition).y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Egg x={0} y={0} glow={state === 'stepping'} />
          </div>
        </div>

        {/* Slots */}
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-7">
          {Array.from({ length: COLS }).map((_, slotIndex) => (
            <div
              key={`slot-${slotIndex}`}
              className={[
                'relative rounded-b-lg xs:rounded-b-xl md:rounded-b-2xl bg-panel border-t border-line min-h-[32px] xs:min-h-[40px] sm:min-h-[50px] md:min-h-[60px] lg:min-h-[70px] xl:min-h-[80px] flex flex-col items-center justify-end p-0.5 xs:p-1 sm:p-1.5 md:p-2 lg:p-2.5',
                isCenterSlot(slotIndex)
                  ? 'ring-1 xs:ring-2 ring-accent ring-offset-0'
                  : '',
                isSlotLanded(slotIndex) ? 'bg-panel2' : '',
              ].join(' ')}
              data-state={isSlotLanded(slotIndex) ? 'landed' : 'default'}
            >
              {/* Center slot halo ring */}
              {isCenterSlot(slotIndex) && (
                <div className="xs:rounded-b-xl xs:ring-2 ring-accent absolute inset-0 rounded-b-lg ring-1 ring-offset-0 md:rounded-b-2xl" />
              )}

              {/* Slot label */}
              <span className="xs:text-[8px] text-dim xs:mb-1 mb-0.5 text-[7px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base">
                {slotIndex}
              </span>

              {/* Center slot badge */}
              {isCenterSlot(slotIndex) && isSlotLanded(slotIndex) && (
                <div className="xs:px-1 py-0.25 xs:py-0.5 sm:py-0.75 lg:py-1.25 xs:rounded-lg xs:text-xs bg-accent/15 text-accent rounded-md px-0.5 text-[8px] font-medium sm:px-1.5 sm:text-sm md:rounded-xl md:px-2 md:py-1 md:text-base lg:px-2.5 lg:text-lg xl:px-3 xl:py-1.5 xl:text-xl">
                  +{chicksEarned}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="xs:mt-4 xs:flex-row xs:gap-2 animate-slide-up mt-3 flex flex-col items-center justify-center gap-1.5 sm:mt-5 sm:gap-3 md:mt-6 md:gap-4 lg:mt-8 lg:gap-5">
        <PrimaryButton
          onClick={handleNextStep}
          disabled={state !== 'idle'}
          data-testid="next-step-button"
          className="game-control xs:w-auto xs:text-sm xs:px-3 xs:py-2 w-full px-2 py-1.5 text-xs sm:px-4 sm:py-2.5 sm:text-base md:px-5 md:py-3 md:text-lg lg:px-6 lg:py-3.5 lg:text-xl"
        >
          Next Step
        </PrimaryButton>

        <PrimaryButton
          onClick={handleDropEgg}
          disabled={state !== 'idle'}
          data-testid="drop-egg-button"
          className="game-control xs:w-auto xs:text-sm xs:px-3 xs:py-2 w-full px-2 py-1.5 text-xs sm:px-4 sm:py-2.5 sm:text-base md:px-5 md:py-3 md:text-lg lg:px-6 lg:py-3.5 lg:text-xl"
        >
          Drop Egg
        </PrimaryButton>

        <button
          onClick={handleReset}
          className="game-control xs:w-auto xs:px-3 xs:py-2 xs:rounded-lg border-line text-dim hover:text-text xs:text-sm w-full rounded-md border bg-transparent px-2 py-1.5 text-xs transition sm:px-4 sm:py-2.5 sm:text-base md:rounded-xl md:px-5 md:py-3 md:text-lg lg:px-6 lg:py-3.5 lg:text-xl"
          data-testid="reset-button"
        >
          Reset
        </button>
      </div>

      {/* Readouts */}
      <div className="xs:mt-3 xs:space-y-1 animate-fade-in mt-2 space-y-0.5 text-center sm:mt-4 sm:space-y-1.5 md:mt-5 md:space-y-2 lg:mt-6">
        <div className="xs:text-xs text-dim text-[10px] sm:text-sm md:text-base lg:text-lg">
          Step: {stepCount}
        </div>
        {finalSlot !== null && (
          <div className="xs:text-sm text-text text-xs sm:text-base md:text-lg lg:text-xl">
            Final slot: {finalSlot}
          </div>
        )}
        {chicksEarned > 0 && (
          <div className="xs:text-base text-accent text-sm font-semibold sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Total chicks: {chicksEarned}
          </div>
        )}
      </div>
    </div>
  );
}
