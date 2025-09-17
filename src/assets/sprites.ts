// Sprite asset paths for consistent usage across the app
export const SPRITES = {
  jungle: '/assets/sprites/jungle-tile.png',
  fruitQuandong: '/assets/sprites/fruit-quandong.png',
  fruitFig: '/assets/sprites/fruit-fig.png',
  eggBlue: '/assets/sprites/egg-blue.png',
  predator: '/assets/sprites/predator-thylacoleo.png',
  queen: '/assets/sprites/cassowary-queen.png',
  epDNA: '/assets/sprites/ep-icon-dna.png',
} as const;

export type SpriteKey = keyof typeof SPRITES;

// Helper function to get sprite path with fallback
export function getSpritePath(key: SpriteKey): string {
  return SPRITES[key];
}
