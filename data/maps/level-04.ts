/**
 * LEVEL 4: Crossroads
 *
 * Difficulty: Medium
 * Theme: Complex winding path requires strategic tower placement
 *
 * Map Design:
 * - Long serpentine path with multiple turns
 * - 7 construction spots allow diverse strategies
 * - Path doubles back on itself creating crossroad coverage opportunities
 * - Increased wave count and enemy variety
 *
 * Path: Complex winding pattern from bottom-left to top-right
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_04: LevelConfig = {
  id: 'level-04',
  number: 4,
  name: 'Crossroads',
  description: 'A winding path tests your strategic planning. Place your towers wisely!',
  difficulty: 'medium',

  mapConfig: {
    grid: {
      width: 20,
      height: 12,
      tileSize: 32,
    },

    waypoints: [
      { x: 0, y: 10 },  // Start: Left edge, bottom area
      { x: 5, y: 10 },  // Move right
      { x: 5, y: 5 },   // Turn up
      { x: 10, y: 5 },  // Move right
      { x: 10, y: 10 }, // Turn down (path crosses itself)
      { x: 15, y: 10 }, // Move right
      { x: 15, y: 4 },  // Turn up
      { x: 20, y: 4 },  // Exit: Right edge, upper-middle
    ],

    constructionSpots: [
      { id: 'CS-01', position: { x: 2, y: 8 } },   // Left side, covers entry
      { id: 'CS-02', position: { x: 3, y: 3 } },   // Top left corner
      { id: 'CS-03', position: { x: 7, y: 7 } },   // Center-left, covers crossroad
      { id: 'CS-04', position: { x: 10, y: 2 } },  // Top middle
      { id: 'CS-05', position: { x: 12, y: 7 } },  // Center-right, covers crossroad
      { id: 'CS-06', position: { x: 17, y: 7 } },  // Right side, covers final turns
      { id: 'CS-07', position: { x: 18, y: 2 } },  // Top right, covers exit
    ],

    startingResources: {
      scrap: 140,  // Reduced for medium difficulty
      hullIntegrity: 20,
    },

    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'shambler' as EnemyType, count: 10 },
          { type: 'runner' as EnemyType, count: 5 },
        ],
        spawnDelay: 1500,
      },
      {
        wave: 2,
        enemies: [
          { type: 'shambler' as EnemyType, count: 12 },
          { type: 'runner' as EnemyType, count: 6 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 3,
        enemies: [
          { type: 'runner' as EnemyType, count: 12 },
          { type: 'shambler' as EnemyType, count: 8 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 4,
        enemies: [
          { type: 'brute' as EnemyType, count: 1 },
          { type: 'runner' as EnemyType, count: 10 },
          { type: 'shambler' as EnemyType, count: 8 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 5,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'runner' as EnemyType, count: 12 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 6,
        enemies: [
          { type: 'runner' as EnemyType, count: 18 },
          { type: 'shambler' as EnemyType, count: 10 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 7,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'runner' as EnemyType, count: 15 },
          { type: 'shambler' as EnemyType, count: 10 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 8,
        enemies: [
          { type: 'brute' as EnemyType, count: 3 },
          { type: 'runner' as EnemyType, count: 12 },
          { type: 'shambler' as EnemyType, count: 12 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 9,
        enemies: [
          { type: 'brute' as EnemyType, count: 3 },
          { type: 'runner' as EnemyType, count: 18 },
          { type: 'shambler' as EnemyType, count: 15 },
        ],
        spawnDelay: 900,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 45 },
    threeStars: { type: 'hull_remaining', minHullPercent: 75 },
  },

  unlockRequirement: {
    previousLevelId: 'level-03',
    minStarsRequired: 1,
  },

  rewards: {
    firstCompletionBonus: 150,
    scrapPerStar: 75,
  },
};
