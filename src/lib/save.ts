import type { Progress, Equipped } from '../types/game';

const KEY = 'cq:v1:progress';

export interface SaveBlob {
  progress: Progress;
  equipped: Equipped;
}

export const save = (blob: SaveBlob) => localStorage.setItem(KEY, JSON.stringify(blob));
export const load = (): SaveBlob | null => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '');
  } catch {
    return null;
  }
};
