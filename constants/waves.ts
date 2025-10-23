import { EnemyType } from "./enemies";

export interface WaveEnemy {
  type: EnemyType;
  count: number;
}

export interface WaveConfig {
  wave: number;
  enemies: WaveEnemy[];
  spawnDelay: number;
}

export const WAVE_CONFIGS: WaveConfig[] = [
  {
    wave: 1,
    enemies: [{ type: "shambler", count: 5 }],
    spawnDelay: 2.0,
  },
  {
    wave: 2,
    enemies: [{ type: "shambler", count: 8 }],
    spawnDelay: 1.5,
  },
  {
    wave: 3,
    enemies: [{ type: "shambler", count: 12 }],
    spawnDelay: 1.5,
  },
  {
    wave: 4,
    enemies: [{ type: "shambler", count: 15 }],
    spawnDelay: 1.2,
  },
  {
    wave: 5,
    enemies: [{ type: "runner", count: 10 }],
    spawnDelay: 1.0,
  },
  {
    wave: 6,
    enemies: [
      { type: "shambler", count: 10 },
      { type: "runner", count: 8 },
    ],
    spawnDelay: 1.0,
  },
  {
    wave: 7,
    enemies: [
      { type: "runner", count: 15 },
      { type: "shambler", count: 10 },
    ],
    spawnDelay: 0.8,
  },
  {
    wave: 8,
    enemies: [
      { type: "brute", count: 1 },
      { type: "runner", count: 10 },
    ],
    spawnDelay: 1.0,
  },
  {
    wave: 9,
    enemies: [
      { type: "runner", count: 15 },
      { type: "brute", count: 1 },
      { type: "shambler", count: 10 },
    ],
    spawnDelay: 0.7,
  },
  {
    wave: 10,
    enemies: [
      { type: "brute", count: 1 },
      { type: "runner", count: 15 },
      { type: "brute", count: 1 },
      { type: "shambler", count: 20 },
    ],
    spawnDelay: 0.6,
  },
] as const;