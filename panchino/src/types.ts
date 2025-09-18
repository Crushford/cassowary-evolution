export type Seed = number;

export type Step = -1 | +1;            // left or right bump
export type Column = 0|1|2|3|4|5|6;    // 7 slots bottom

export interface BoardSpec {
  rows: number;        // 6
  slots: number;       // 7
  startColumn: Column; // 3
}

export interface DropResult {
  steps: Step[];       // length == rows
  path: Column[];      // length == rows+1 (includes start)
  finalSlot: Column;   // 0..6
  chicks: number;      // 0 or 1..3 if finalSlot===3
}

export interface RoundResult {
  drops: DropResult[]; // length == 3
  totalChicks: number;
}
