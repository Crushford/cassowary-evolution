#!/usr/bin/env node

import { makeRng } from './rng';
import { defaultBoard, runRound } from './panchino';

interface CliArgs {
  seed?: number;
  drops?: number;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {};
  
  for (const arg of args) {
    if (arg.startsWith('--seed=')) {
      result.seed = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--drops=')) {
      result.drops = parseInt(arg.split('=')[1], 10);
    }
  }
  
  return result;
}

function formatSteps(steps: number[]): string {
  return steps.map(step => step === -1 ? 'L' : 'R').join(' ');
}

function main() {
  const { seed = 42, drops = 3 } = parseArgs();
  
  console.log(`Seed: ${seed}`);
  
  const rng = makeRng(seed);
  const board = defaultBoard();
  const roundResult = runRound(rng, board, drops);
  
  roundResult.drops.forEach((drop, index) => {
    const stepsStr = formatSteps(drop.steps);
    console.log(`Drop ${index + 1}: path ${stepsStr} -> slot ${drop.finalSlot} -> chicks ${drop.chicks}`);
  });
  
  console.log(`Total chicks: ${roundResult.totalChicks}`);
}

if (require.main === module) {
  main();
}
