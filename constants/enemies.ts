export type EnemyType = "shambler" | "runner" | "brute";

export interface EnemyConfig {
  id: EnemyType;
  name: string;
  health: number;
  speed: number;
  damageToBastion: number;
  scrapReward: number;
  color: string;
  size: number;
}

export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  shambler: {
    id: "shambler",
    name: "Shambler",
    health: 50,
    speed: 1.0,
    damageToBastion: 1,
    scrapReward: 5,
    color: "#4CAF50",
    size: 24,
  },
  runner: {
    id: "runner",
    name: "Runner",
    health: 35,
    speed: 1.8,
    damageToBastion: 1,
    scrapReward: 7,
    color: "#FFC107",
    size: 22,
  },
  brute: {
    id: "brute",
    name: "Brute",
    health: 250,
    speed: 0.6,
    damageToBastion: 5,
    scrapReward: 20,
    color: "#F44336",
    size: 32,
  },
} as const;