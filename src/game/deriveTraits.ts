import traits from './traits.json';
import type { Equipped, TraitDef, Traits } from '../types/game';

export function deriveTraits(equipped: Equipped): Traits {
  const list: TraitDef[] = traits as TraitDef[];
  const get = (id?: string) => list.find((t) => t.id === id);
  const eq = [
    get(equipped.reproduction),
    get(equipped.survival),
    get(equipped.scouting),
  ].filter(Boolean) as TraitDef[];
  const eggsDelta = eq.reduce(
    (a, t) =>
      a + (Number((t.effects as Record<string, unknown>).eggsPerClutchDelta) || 0),
    0,
  );
  return { eggsPerClutch: 3 + eggsDelta };
}
