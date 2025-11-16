/**
 * LEVEL 10: Last Stand
 *
 * Difficulty: Boss (Ultimate Challenge)
 * Theme: Epic finale - the ultimate test of tower defense mastery
 *
 * Map Design:
 * - Longest possible path snaking through entire map
 * - 10 construction spots - maximum strategic options
 * - 20 waves of relentless zombie hordes
 * - Massive mixed enemy groups with multiple brutes
 * - Requires perfect strategy, upgrades, and resource management
 *
 * Path: Epic serpentine covering maximum map distance
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_10: LevelConfig = {
  id: 'level-10',
  number: 10,
  name: 'Last Stand',
  description: 'The final battle. 20 waves of pure chaos. This is your last stand against the horde!',
  difficulty: 'hard',

  mapConfig: {
    grid: {
      width: 20,
      height: 12,
      tileSize: 32,
    },

    // Longest possible path - 13 waypoints
    waypoints: [
      { x: 0, y: 11 },  // Start: Left edge, bottom corner
      { x: 3, y: 11 },  // Move right (bottom)
      { x: 3, y: 2 },   // Turn up (long vertical)
      { x: 7, y: 2 },   // Move right (top area)
      { x: 7, y: 10 },  // Turn down (long vertical)
      { x: 11, y: 10 }, // Move right (bottom area)
      { x: 11, y: 2 },  // Turn up (long vertical)
      { x: 14, y: 2 },  // Move right (top area)
      { x: 14, y: 9 },  // Turn down
      { x: 17, y: 9 },  // Move right
      { x: 17, y: 4 },  // Turn up
      { x: 19, y: 4 },  // Near exit
      { x: 20, y: 6 },  // Exit: Right edge, middle
    ],

    // 10 construction spots - maximum coverage options
    constructionSpots: [
      { id: 'CS-01', position: { x: 1, y: 8 } },   // Left entrance
      { id: 'CS-02', position: { x: 5, y: 6 } },   // Left center
      { id: 'CS-03', position: { x: 5, y: 0 } },   // Top left
      { id: 'CS-04', position: { x: 9, y: 11 } },  // Bottom center
      { id: 'CS-05', position: { x: 9, y: 5 } },   // True center
      { id: 'CS-06', position: { x: 9, y: 0 } },   // Top center
      { id: 'CS-07', position: { x: 12, y: 11 } }, // Bottom right
      { id: 'CS-08', position: { x: 12, y: 6 } },  // Center right
      { id: 'CS-09', position: { x: 15, y: 0 } },  // Top right
      { id: 'CS-10', position: { x: 16, y: 7 } },  // Exit area
    ],

    startingResources: {
      scrap: 150,  // Generous starting resources for complexity
      hullIntegrity: 20,
    },

    // 20 waves of epic proportions
    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'shambler' as EnemyType, count: 20 },
          { type: 'runner' as EnemyType, count: 10 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 2,
        enemies: [
          { type: 'runner' as EnemyType, count: 25 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 3,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'shambler' as EnemyType, count: 20 },
          { type: 'runner' as EnemyType, count: 15 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 4,
        enemies: [
          { type: 'runner' as EnemyType, count: 30 },
          { type: 'shambler' as EnemyType, count: 15 },
        ],
        spawnDelay: 950,
      },
      {
        wave: 5,
        enemies: [
          { type: 'brute' as EnemyType, count: 3 },
          { type: 'runner' as EnemyType, count: 25 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 6,
        enemies: [
          { type: 'runner' as EnemyType, count: 35 },
        ],
        spawnDelay: 850,
      },
      {
        wave: 7,
        enemies: [
          { type: 'brute' as EnemyType, count: 4 },
          { type: 'shambler' as EnemyType, count: 25 },
          { type: 'runner' as EnemyType, count: 20 },
        ],
        spawnDelay: 900,
      },
      {
        wave: 8,
        enemies: [
          { type: 'brute' as EnemyType, count: 3 },
          { type: 'runner' as EnemyType, count: 35 },
        ],
        spawnDelay: 850,
      },
      {
        wave: 9,
        enemies: [
          { type: 'runner' as EnemyType, count: 40 },
          { type: 'shambler' as EnemyType, count: 20 },
        ],
        spawnDelay: 800,
      },
      {
        wave: 10,
        enemies: [
          { type: 'brute' as EnemyType, count: 5 },
          { type: 'runner' as EnemyType, count: 30 },
          { type: 'shambler' as EnemyType, count: 25 },
        ],
        spawnDelay: 850,
      },
      {
        wave: 11,
        enemies: [
          { type: 'runner' as EnemyType, count: 45 },
        ],
        spawnDelay: 750,
      },
      {
        wave: 12,
        enemies: [
          { type: 'brute' as EnemyType, count: 6 },
          { type: 'runner' as EnemyType, count: 35 },
        ],
        spawnDelay: 800,
      },
      {
        wave: 13,
        enemies: [
          { type: 'brute' as EnemyType, count: 5 },
          { type: 'runner' as EnemyType, count: 40 },
          { type: 'shambler' as EnemyType, count: 30 },
        ],
        spawnDelay: 750,
      },
      {
        wave: 14,
        enemies: [
          { type: 'runner' as EnemyType, count: 50 },
        ],
        spawnDelay: 700,
      },
      {
        wave: 15,
        enemies: [
          { type: 'brute' as EnemyType, count: 7 },
          { type: 'runner' as EnemyType, count: 40 },
        ],
        spawnDelay: 750,
      },
      {
        wave: 16,
        enemies: [
          { type: 'brute' as EnemyType, count: 6 },
          { type: 'runner' as EnemyType, count: 45 },
          { type: 'shambler' as EnemyType, count: 35 },
        ],
        spawnDelay: 700,
      },
      {
        wave: 17,
        enemies: [
          { type: 'brute' as EnemyType, count: 8 },
          { type: 'runner' as EnemyType, count: 40 },
        ],
        spawnDelay: 700,
      },
      {
        wave: 18,
        enemies: [
          { type: 'runner' as EnemyType, count: 55 },
          { type: 'shambler' as EnemyType, count: 30 },
        ],
        spawnDelay: 650,
      },
      {
        wave: 19,
        enemies: [
          { type: 'brute' as EnemyType, count: 9 },
          { type: 'runner' as EnemyType, count: 50 },
        ],
        spawnDelay: 650,
      },
      {
        wave: 20,
        enemies: [
          { type: 'brute' as EnemyType, count: 10 },
          { type: 'runner' as EnemyType, count: 50 },
          { type: 'shambler' as EnemyType, count: 40 },
        ],
        spawnDelay: 600,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 25 },
    threeStars: { type: 'hull_remaining', minHullPercent: 45 },
  },

  unlockRequirement: {
    previousLevelId: 'level-09',
    minStarsRequired: 2,  // Requires 2 stars from level 9
  },

  rewards: {
    firstCompletionBonus: 500,  // Epic reward for beating final level
    scrapPerStar: 150,
  },
};
