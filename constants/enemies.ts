export type EnemyType = "shambler" | "runner" | "brute" | "spitter" | "crawler" | "bloater" | "tank" | "hiveQueen";

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
  spitter: {
    id: "spitter",
    name: "Spitter",
    health: 130,
    speed: 1.1,
    damageToBastion: 2,
    scrapReward: 13,
    color: "#9C27B0",
    size: 26,
  },
  crawler: {
    id: "crawler",
    name: "Crawler",
    health: 55,
    speed: 2.2,
    damageToBastion: 1,
    scrapReward: 6,
    color: "#00BCD4",
    size: 20,
  },
  bloater: {
    id: "bloater",
    name: "Bloater",
    health: 375,
    speed: 0.5,
    damageToBastion: 3,
    scrapReward: 30,
    color: "#8BC34A",
    size: 36,
  },
  tank: {
    id: "tank",
    name: "Tank",
    health: 450,
    speed: 0.7,
    damageToBastion: 4,
    scrapReward: 35,
    color: "#607D8B",
    size: 38,
  },
  hiveQueen: {
    id: "hiveQueen",
    name: "Hive Queen",
    health: 950,
    speed: 0.8,
    damageToBastion: 10,
    scrapReward: 80,
    color: "#E91E63",
    size: 48,
  },
} as const;