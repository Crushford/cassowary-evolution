import { BoardSpec, Column, DropResult, RoundResult, Step } from './types';

/**
 * Default board configuration for MVP
 */
export function defaultBoard(): BoardSpec {
  return {
    rows: 6,
    slots: 7,
    startColumn: 3
  };
}

/**
 * Convert random number to step direction
 */
export function nextStep(rand: number): Step {
  return rand < 0.5 ? -1 : +1;
}

/**
 * Apply step to column with clamping
 */
export function applyStep(col: Column, step: Step): Column {
  const newCol = col + step;
  return Math.max(0, Math.min(6, newCol)) as Column;
}

/**
 * Roll 1d3 (1-3 inclusive)
 */
export function roll1d3(rng: () => number): 1|2|3 {
  const roll = Math.floor(rng() * 3) + 1;
  return roll as 1|2|3;
}

/**
 * Run a single egg drop through the board
 */
export function runDrop(rng: () => number, board: BoardSpec): DropResult {
  const steps: Step[] = [];
  const path: Column[] = [board.startColumn];
  
  let currentCol = board.startColumn;
  
  // Generate steps and build path
  for (let i = 0; i < board.rows; i++) {
    const step = nextStep(rng());
    steps.push(step);
    currentCol = applyStep(currentCol, step);
    path.push(currentCol);
  }
  
  const finalSlot = currentCol;
  const chicks = finalSlot === 3 ? roll1d3(rng) : 0;
  
  return {
    steps,
    path,
    finalSlot,
    chicks
  };
}

/**
 * Run a complete round (3 drops by default)
 */
export function runRound(rng: () => number, board: BoardSpec, drops: number = 3): RoundResult {
  const dropResults: DropResult[] = [];
  let totalChicks = 0;
  
  for (let i = 0; i < drops; i++) {
    const dropResult = runDrop(rng, board);
    dropResults.push(dropResult);
    totalChicks += dropResult.chicks;
  }
  
  return {
    drops: dropResults,
    totalChicks
  };
}
