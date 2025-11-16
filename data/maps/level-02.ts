/**
 * LEVEL 2: The Horde Grows
 *
 * Difficulty: Easy (Tutorial)
 * Theme: Introduction to enemy variety and faster enemies
 *
 * Map Design:
 * - S-curved winding path for more interesting tower placement
 * - 6 construction spots with strategic positioning
 * - Introduces runner enemies in later waves
 * - Slightly reduced starting resources to encourage planning
 *
 * Path: Enters from bottom-left, curves up, curves back down, exits bottom-right
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_02: LevelConfig = {
  id: 'level-02',
  number: 2,
  name: 'The Horde Grows',
  description: 'The zombies are getting faster. Adapt your strategy to handle different enemy types.',
  difficulty: 'easy',

  mapConfig: {
    grid: {
      width: 20,
      height: 12,
      tileSize: 32,
    },

    waypoints: [
      { x: 0, y: 9 },   // Start: Left edge, lower area
      { x: 7, y: 9 },   // Move right along bottom
      { x: 7, y: 4 },   // Curve up (S-curve part 1)
      { x: 14, y: 4 },  // Move right along middle
      { x: 14, y: 9 },  // Curve down (S-curve part 2)
      { x: 20, y: 9 },  // Exit: Right edge, lower area
    ],

    constructionSpots: [
      { id: 'CS-01', position: { x: 3, y: 11 } },  // Bottom left, covers entry
      { id: 'CS-02', position: { x: 5, y: 6 } },   // Left curve area
      { id: 'CS-03', position: { x: 9, y: 2 } },   // Top middle, covers first curve
      { id: 'CS-04', position: { x: 11, y: 6 } },  // Center, versatile position
      { id: 'CS-05', position: { x: 16, y: 2 } },  // Top right, covers second curve
      { id: 'CS-06', position: { x: 17, y: 11 } }, // Bottom right, covers exit
    ],

    startingResources: {
      scrap: 175,  // Slightly less than level 1
      hullIntegrity: 20,
    },

    waves: [
      {
        wave: 1,
        enemies: [{ type: 'shambler' as EnemyType, count: 6 }],
        spawnDelay: 2000,
      },
      {
        wave: 2,
        enemies: [{ type: 'shambler' as EnemyType, count: 8 }],
        spawnDelay: 1800,
      },
      {
        wave: 3,
        enemies: [
          { type: 'shambler' as EnemyType, count: 6 },
          { type: 'runner' as EnemyType, count: 3 },  // First runners!
        ],
        spawnDelay: 1600,
      },
      {
        wave: 4,
        enemies: [
          { type: 'shambler' as EnemyType, count: 8 },
          { type: 'runner' as EnemyType, count: 4 },
        ],
        spawnDelay: 1500,
      },
      {
        wave: 5,
        enemies: [
          { type: 'shambler' as EnemyType, count: 6 },
          { type: 'runner' as EnemyType, count: 6 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 6,
        enemies: [
          { type: 'shambler' as EnemyType, count: 10 },
          { type: 'runner' as EnemyType, count: 5 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 7,
        enemies: [
          { type: 'shambler' as EnemyType, count: 8 },
          { type: 'runner' as EnemyType, count: 8 },
        ],
        spawnDelay: 1200,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 55 },
    threeStars: { type: 'hull_remaining', minHullPercent: 85 },
  },

  unlockRequirement: {
    previousLevelId: 'level-01',
    minStarsRequired: 1,  // Must complete level 1
  },

  rewards: {
    firstCompletionBonus: 100,
    scrapPerStar: 50,
  },
};
