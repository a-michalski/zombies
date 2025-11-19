export interface TowerLevel {
  level: number;
  damage: number;
  range: number;
  fireRate: number;
  upgradeCost: number | null;
}

export interface TowerConfig {
  id: string;
  name: string;
  description: string;
  buildCost: number;
  sellValueModifier: number;
  levels: TowerLevel[];
}

export const LOOKOUT_POST: TowerConfig = {
  id: "tower_lookout_post",
  name: "Lookout Post",
  description: "Survivor armed with a crossbow. Automatically targets zombies.",
  buildCost: 100,
  sellValueModifier: 0.5,
  levels: [
    {
      level: 1,
      damage: 10,
      range: 3.0,
      fireRate: 1.0,
      upgradeCost: null,
    },
    {
      level: 2,
      damage: 15,
      range: 3.25,
      fireRate: 1.2,
      upgradeCost: 75,
    },
    {
      level: 3,
      damage: 25,
      range: 3.5,
      fireRate: 1.5,
      upgradeCost: 175,
    },
  ],
} as const;

export const CANNON_TOWER: TowerConfig = {
  id: "tower_cannon",
  name: "Cannon Tower",
  description: "Heavy artillery that deals area damage. Slower but devastating against groups.",
  buildCost: 250,
  sellValueModifier: 0.5,
  levels: [
    {
      level: 1,
      damage: 25,
      range: 1.5,
      fireRate: 0.4,
      upgradeCost: null,
    },
    {
      level: 2,
      damage: 40,
      range: 1.75,
      fireRate: 0.5,
      upgradeCost: 150,
    },
    {
      level: 3,
      damage: 65,
      range: 2.0,
      fireRate: 0.6,
      upgradeCost: 300,
    },
  ],
} as const;

export const PROJECTILE_CONFIG = {
  SPEED: 12.0,
  LIFETIME: 3.0,
  COLLISION_RADIUS: 0.2,
  SIZE: 8,
  COLOR: "#8B4513",
} as const;
