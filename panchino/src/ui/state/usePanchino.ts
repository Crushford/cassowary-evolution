import { useState, useCallback, useMemo } from 'react';
import { makeRng } from '../../rng';
import { defaultBoard, runDrop, runRound } from '../../panchino';
import { BoardSpec, DropResult, RoundResult, Step } from '../../types';

export interface PanchinoState {
  currentStep: number;
  currentColumn: number;
  steps: Step[];
  path: number[];
  isComplete: boolean;
  finalSlot?: number;
  chicks?: number;
  roundDrops: DropResult[];
  totalChicks: number;
}

export interface UsePanchinoOptions {
  rows?: number;
  slots?: number;
  startColumn?: number;
  seed?: number;
  autoAdvance?: boolean;
  stepsPerTick?: number;
  stepsScript?: Step[]; // For testing - overrides RNG
  fixedChickReward?: 1|2|3; // For testing - bypasses RNG
}

export function usePanchino(options: UsePanchinoOptions = {}) {
  const {
    rows = 6,
    slots = 7,
    startColumn = 3,
    seed = 42,
    autoAdvance = false,
    stepsPerTick = 1,
    stepsScript,
    fixedChickReward
  } = options;

  const board: BoardSpec = useMemo(() => ({
    rows,
    slots,
    startColumn: startColumn as any
  }), [rows, slots, startColumn]);

  const rng = useMemo(() => makeRng(seed), [seed]);

  const [state, setState] = useState<PanchinoState>(() => ({
    currentStep: 0,
    currentColumn: startColumn,
    steps: [],
    path: [startColumn],
    isComplete: false,
    roundDrops: [],
    totalChicks: 0
  }));

  const nextStep = useCallback(() => {
    if (state.isComplete) return;

    setState(prev => {
      const newStep = prev.currentStep + 1;
      const isLastStep = newStep >= board.rows;
      
      let nextStep: Step;
      if (stepsScript && prev.currentStep < stepsScript.length) {
        nextStep = stepsScript[prev.currentStep];
      } else {
        nextStep = rng() < 0.5 ? -1 : +1;
      }
      
      const newColumn = Math.max(0, Math.min(6, prev.currentColumn + nextStep)) as any;
      const newSteps = [...prev.steps, nextStep];
      const newPath = [...prev.path, newColumn];
      
      if (isLastStep) {
        const chicks = newColumn === 3 
          ? (fixedChickReward || (rng() < 0.333 ? 1 : rng() < 0.667 ? 2 : 3))
          : 0;
        
        return {
          ...prev,
          currentStep: newStep,
          currentColumn: newColumn,
          steps: newSteps,
          path: newPath,
          isComplete: true,
          finalSlot: newColumn,
          chicks
        };
      }
      
      return {
        ...prev,
        currentStep: newStep,
        currentColumn: newColumn,
        steps: newSteps,
        path: newPath
      };
    });
  }, [state.isComplete, board.rows, stepsScript, rng, fixedChickReward]);

  const dropEgg = useCallback(() => {
    if (state.isComplete) {
      // Start a new drop
      setState(prev => ({
        ...prev,
        currentStep: 0,
        currentColumn: startColumn,
        steps: [],
        path: [startColumn],
        isComplete: false,
        finalSlot: undefined,
        chicks: undefined
      }));
    } else {
      // Complete current drop
      const dropResult = runDrop(rng, board);
      setState(prev => ({
        ...prev,
        currentStep: board.rows,
        currentColumn: dropResult.finalSlot,
        steps: dropResult.steps,
        path: dropResult.path,
        isComplete: true,
        finalSlot: dropResult.finalSlot,
        chicks: dropResult.chicks,
        roundDrops: [...prev.roundDrops, dropResult],
        totalChicks: prev.totalChicks + dropResult.chicks
      }));
    }
  }, [state.isComplete, startColumn, rng, board]);

  const reset = useCallback(() => {
    setState({
      currentStep: 0,
      currentColumn: startColumn,
      steps: [],
      path: [startColumn],
      isComplete: false,
      roundDrops: [],
      totalChicks: 0
    });
  }, [startColumn]);

  return {
    state,
    nextStep,
    dropEgg,
    reset,
    board
  };
}
