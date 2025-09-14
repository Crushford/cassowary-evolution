import { GameState, Upgrade } from '../types/game';

export const STANDARD_UPGRADES: Upgrade[] = [
  {
    id: 'add-partner',
    name: 'Add Partner',
    description: 'Place an additional male each round',
    cost: 100,
    maxTier: 2, // Max 5 partners total
    currentTier: 0,
    effect: (gameState: GameState): GameState => {
      return {
        ...gameState,
        player: {
          ...gameState.player,
          partners: Math.min(gameState.player.partners + 1, 5),
        },
      };
    },
  },
  {
    id: 'claws',
    name: 'Claws',
    description: 'Predator tiles have 50% chance to wound only (no payout but no death)',
    cost: 300,
    purchased: false,
    effect: (gameState: GameState): GameState => ({
      ...gameState,
      player: {
        ...gameState.player,
        traits: {
          ...gameState.player.traits,
          claws: true,
        },
      },
    }),
  },
  {
    id: 'scout-instinct',
    name: 'Scout Instinct',
    description: 'Reveal 1 random safe tile before placement each round',
    cost: 150,
    maxTier: 2,
    currentTier: 0,
    effect: (gameState: GameState): GameState => {
      const newTier = gameState.player.upgrades.scoutTier + 1;
      return {
        ...gameState,
        player: {
          ...gameState.player,
          upgrades: {
            ...gameState.player.upgrades,
            scoutTier: Math.min(newTier, 2),
          },
        },
      };
    },
  },
  {
    id: 'egg-capacity',
    name: 'Egg Capacity',
    description: 'Food tiles pay +50% more chips',
    cost: 200,
    maxTier: 2,
    currentTier: 0,
    effect: (gameState: GameState): GameState => {
      const newTier = gameState.player.upgrades.eggCapacityTier + 1;
      return {
        ...gameState,
        player: {
          ...gameState.player,
          upgrades: {
            ...gameState.player.upgrades,
            eggCapacityTier: Math.min(newTier, 2),
          },
        },
      };
    },
  },
  {
    id: 'nest-defense',
    name: 'Nest Defense',
    description: 'First Predator hit per round is negated (once)',
    cost: 350,
    purchased: false,
    effect: (gameState: GameState): GameState => ({
      ...gameState,
      player: {
        ...gameState.player,
        upgrades: {
          ...gameState.player.upgrades,
          nestDefense: true,
        },
      },
    }),
  },
  {
    id: 'map-memory',
    name: 'Map Memory',
    description: "Keep highlights of last round's Food tiles at 25% confidence",
    cost: 120,
    purchased: false,
    effect: (gameState: GameState): GameState => ({
      ...gameState,
      player: {
        ...gameState.player,
        upgrades: {
          ...gameState.player.upgrades,
          mapMemory: true,
        },
      },
    }),
  },
];

export const getUpgradeCost = (upgrade: Upgrade, currentTier: number = 0): number => {
  if (upgrade.maxTier && currentTier > 0) {
    // Scale cost for tiered upgrades
    return upgrade.cost * Math.pow(3, currentTier);
  }
  return upgrade.cost;
};

export const canAffordUpgrade = (
  upgrade: Upgrade,
  playerChips: number,
  currentTier: number = 0,
): boolean => {
  return playerChips >= getUpgradeCost(upgrade, currentTier);
};

export const getAvailableUpgrades = (gameState: GameState): Upgrade[] => {
  return STANDARD_UPGRADES.map((upgrade) => {
    const currentTier = upgrade.maxTier
      ? upgrade.id === 'add-partner'
        ? gameState.player.partners - 3
        : upgrade.id === 'scout-instinct'
          ? gameState.player.upgrades.scoutTier
          : upgrade.id === 'egg-capacity'
            ? gameState.player.upgrades.eggCapacityTier
            : 0
      : 0;

    const purchased = upgrade.purchased
      ? upgrade.id === 'claws'
        ? gameState.player.traits.claws
        : upgrade.id === 'nest-defense'
          ? gameState.player.upgrades.nestDefense
          : upgrade.id === 'map-memory'
            ? gameState.player.upgrades.mapMemory
            : false
      : false;

    const affordable = canAffordUpgrade(upgrade, gameState.player.chips, currentTier);
    const canUpgrade = upgrade.maxTier ? currentTier < upgrade.maxTier : !purchased;

    return {
      ...upgrade,
      currentTier,
      purchased,
      canAfford: affordable,
      canUpgrade,
    };
  }).filter((upgrade) => upgrade.canUpgrade);
};
