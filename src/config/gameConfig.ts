import { EraRecipe, RareOffer } from '../types/game';

export const ERA_RECIPES: EraRecipe[] = [
  {
    id: 0,
    name: 'Eden',
    cap: 100,
    predatorCount: 0,
    barrenCount: 6,
  },
  {
    id: 1,
    name: 'First Shadows',
    cap: 500,
    predatorCount: 8,
    barrenCount: 20,
  },
  {
    id: 2,
    name: 'Predator Rise',
    cap: 2000,
    predatorCount: 16,
    barrenCount: 24,
  },
  {
    id: 3,
    name: 'Predator Peak',
    cap: 10000,
    predatorCount: 24,
    barrenCount: 32,
  },
];

export const RARE_OFFERS: RareOffer[] = [
  {
    id: 'mutant-arm-buds',
    name: 'Mutant Arm Buds',
    benefit: '+1 Partner this round and next; Predators −3 tiles globally this round',
    risk: '6% chance all chosen tiles this round are forced to Barren (no payout)',
    cost: 250,
    effect: () => {}, // Will be implemented with game state
  },
  {
    id: 'fruit-glut',
    name: 'Fruit Glut',
    benefit: 'Convert 50% of Barren to Food for the next 2 rounds',
    risk: 'Afterward, +6 Predator tiles for 1 round',
    cost: 220,
    effect: () => {},
  },
  {
    id: 'fire-nesting',
    name: 'Fire Nesting',
    benefit: 'Double payout on Food this round',
    risk: '10% chance all selected tiles burn (0 payout + lose one Partner next round)',
    cost: 180,
    effect: () => {},
  },
  {
    id: 'raven-pact',
    name: 'Raven Pact',
    benefit: 'Reveal 1 Predator tile before placement for the next 3 rounds',
    risk: '8% chance next round spawns +1 Predator per Partner you placed',
    cost: 200,
    effect: () => {},
  },
];

export const GAME_CONFIG = {
  payoutBase: 10,
  maxPartners: 5,
  rareOfferChance: 0.2,
} as const;
