/**
 * LEVEL 7: Limited Resources
 *
 * Difficulty: Hard
 * Theme: Severe tower placement restrictions test optimization skills
 *
 * Map Design:
 * - Complex winding path with multiple switchbacks
 * - ONLY 5 construction spots - must choose wisely!
 * - Long path provides some advantage but limited coverage
 * - 12 waves of increasingly difficult enemies
 * - Requires perfect tower placement and upgrades
 *
 * Path: Long winding serpentine from bottom-left to top-right
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_07: LevelConfig = {
  id: 'level-07',
  number: 7,
  name: 'Limited Resources',
  description: 'Only 5 tower spots available. Every decision matters. Choose wisely!',
  difficulty: 'hard',

  mapConfig: {
    grid: {
      width: 20,
      height: 12,
      tileSize: 32,
    },

    waypoints: [
      { x: 0, y: 8 },   // Start: Left edge, lower area
      { x: 4, y: 8 },   // Move right
      { x: 4, y: 3 },   // Turn up
      { x: 9, y: 3 },   // Move right
      { x: 9, y: 9 },   // Turn down
      { x: 15, y: 9 },  // Move right
      { x: 15, y: 2 },  // Turn up
      { x: 20, y: 2 },  // Exit: Right edge, upper area
    ],

    // ONLY 5 SPOTS - Critical strategic positions
    constructionSpots: [
      { id: 'CS-01', position: { x: 2, y: 5 } },   // Left area, covers early path
      { id: 'CS-02', position: { x: 6, y: 6 } },   // Center-left, covers first turn
      { id: 'CS-03', position: { x: 11, y: 6 } },  // True center, maximum coverage
      { id: 'CS-04', position: { x: 12, y: 11 } }, // Bottom, covers middle turn
      { id: 'CS-05', position: { x: 17, y: 5 } },  // Right, covers final approach
    ],

    startingResources: {
      scrap: 120,  // Very limited starting scrap
      hullIntegrity: 20,
    },

    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'shambler' as EnemyType, count: 15 },
          { type: 'runner' as EnemyType, count: 8 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 2,
        enemies: [
          { type: 'runner' as EnemyType, count: 18 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 3,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'shambler' as EnemyType, count: 15 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 4,
        enemies: [
          { type: 'runner' as EnemyType, count: 20 },
          { type: 'shambler' as EnemyType, count: 12 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 5,
        enemies: [
          { type: 'brute' as EnemyType, count: 3 },
          { type: 'runner' as EnemyType, count: 15 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 6,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'runner' as EnemyType, count: 22 },
          { type: 'shambler' as EnemyType, count: 15 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 7,
        enemies: [
          { type: 'brute' as EnemyType, count: 4 },
          { type: 'runner' as EnemyType, count: 18 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 8,
        enemies: [
          { type: 'runner' as EnemyType, count: 30 },
        ],
        spawnDelay: 900,
      },
      {
        wave: 9,
        enemies: [
          { type: 'brute' as EnemyType, count: 4 },
          { type: 'runner' as EnemyType, count: 20 },
          { type: 'shambler' as EnemyType, count: 20 },
        ],
        spawnDelay: 900,
      },
      {
        wave: 10,
        enemies: [
          { type: 'brute' as EnemyType, count: 5 },
          { type: 'runner' as EnemyType, count: 25 },
        ],
        spawnDelay: 850,
      },
      {
        wave: 11,
        enemies: [
          { type: 'brute' as EnemyType, count: 3 },
          { type: 'runner' as EnemyType, count: 30 },
          { type: 'shambler' as EnemyType, count: 25 },
        ],
        spawnDelay: 800,
      },
      {
        wave: 12,
        enemies: [
          { type: 'brute' as EnemyType, count: 6 },
          { type: 'runner' as EnemyType, count: 25 },
          { type: 'shambler' as EnemyType, count: 20 },
        ],
        spawnDelay: 750,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 35 },
    threeStars: { type: 'hull_remaining', minHullPercent: 60 },
  },

  unlockRequirement: {
    previousLevelId: 'level-06',
    minStarsRequired: 2,  // Requires 2 stars from previous level
  },

  rewards: {
    firstCompletionBonus: 250,
    scrapPerStar: 100,
  },
};
