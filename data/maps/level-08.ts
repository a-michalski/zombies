/**
 * LEVEL 8: Speed Run
 *
 * Difficulty: Hard
 * Theme: Short path and fast enemies create intense pressure
 *
 * Map Design:
 * - Very short, direct path - minimal time to kill enemies
 * - 8 construction spots but limited time to use them all
 * - Waves dominated by fast runner enemies
 * - Rapid wave progression with short spawn delays
 * - Requires strong tower placement and immediate upgrades
 *
 * Path: Quick L-shaped route from left to right (minimal distance)
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_08: LevelConfig = {
  id: 'level-08',
  number: 8,
  name: 'Speed Run',
  description: 'A short path and fast enemies! Build quickly and shoot faster!',
  difficulty: 'hard',

  mapConfig: {
    grid: {
      width: 20,
      height: 12,
      tileSize: 32,
    },

    // Very short path - only 4 waypoints!
    waypoints: [
      { x: 0, y: 6 },   // Start: Left edge, middle
      { x: 6, y: 6 },   // Move right
      { x: 6, y: 3 },   // Quick turn up
      { x: 20, y: 3 },  // Exit: Right edge, upper area
    ],

    constructionSpots: [
      { id: 'CS-01', position: { x: 3, y: 8 } },   // Entry area, bottom
      { id: 'CS-02', position: { x: 3, y: 4 } },   // Entry area, top
      { id: 'CS-03', position: { x: 8, y: 5 } },   // Corner area, critical spot
      { id: 'CS-04', position: { x: 8, y: 1 } },   // Corner area, top
      { id: 'CS-05', position: { x: 12, y: 1 } },  // Exit path, top
      { id: 'CS-06', position: { x: 12, y: 5 } },  // Exit path, middle
      { id: 'CS-07', position: { x: 16, y: 1 } },  // Final area, top
      { id: 'CS-08', position: { x: 16, y: 5 } },  // Final area, middle
    ],

    startingResources: {
      scrap: 130,
      hullIntegrity: 20,
    },

    // Fast-paced waves with primarily runner enemies
    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'runner' as EnemyType, count: 15 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 2,
        enemies: [
          { type: 'runner' as EnemyType, count: 20 },
        ],
        spawnDelay: 900,
      },
      {
        wave: 3,
        enemies: [
          { type: 'runner' as EnemyType, count: 25 },
        ],
        spawnDelay: 800,
      },
      {
        wave: 4,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'runner' as EnemyType, count: 20 },
        ],
        spawnDelay: 900,
      },
      {
        wave: 5,
        enemies: [
          { type: 'runner' as EnemyType, count: 30 },
        ],
        spawnDelay: 750,
      },
      {
        wave: 6,
        enemies: [
          { type: 'runner' as EnemyType, count: 28 },
          { type: 'shambler' as EnemyType, count: 12 },
        ],
        spawnDelay: 800,
      },
      {
        wave: 7,
        enemies: [
          { type: 'brute' as EnemyType, count: 3 },
          { type: 'runner' as EnemyType, count: 25 },
        ],
        spawnDelay: 800,
      },
      {
        wave: 8,
        enemies: [
          { type: 'runner' as EnemyType, count: 35 },
        ],
        spawnDelay: 700,
      },
      {
        wave: 9,
        enemies: [
          { type: 'brute' as EnemyType, count: 4 },
          { type: 'runner' as EnemyType, count: 30 },
        ],
        spawnDelay: 750,
      },
      {
        wave: 10,
        enemies: [
          { type: 'brute' as EnemyType, count: 5 },
          { type: 'runner' as EnemyType, count: 40 },
        ],
        spawnDelay: 650,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 30 },
    threeStars: { type: 'hull_remaining', minHullPercent: 55 },
  },

  unlockRequirement: {
    previousLevelId: 'level-07',
    minStarsRequired: 1,
  },

  rewards: {
    firstCompletionBonus: 250,
    scrapPerStar: 100,
  },
};
