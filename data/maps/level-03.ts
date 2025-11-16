/**
 * LEVEL 3: Heavy Infantry
 *
 * Difficulty: Easy (Tutorial)
 * Theme: Introduction to brute enemies - tanky, high-damage threats
 *
 * Map Design:
 * - Zigzag path creates multiple tower coverage zones
 * - 6 construction spots positioned at key zigzag points
 * - Introduces the brute enemy type starting wave 5
 * - Requires tower upgrades and focus fire to handle brutes
 *
 * Path: Zigzag pattern from top-left to middle-right
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_03: LevelConfig = {
  id: 'level-03',
  number: 3,
  name: 'Heavy Infantry',
  description: 'Heavily armored brutes join the horde. Focus your fire and upgrade your towers!',
  difficulty: 'easy',

  mapConfig: {
    grid: {
      width: 20,
      height: 12,
      tileSize: 32,
    },

    waypoints: [
      { x: 0, y: 2 },   // Start: Left edge, upper area
      { x: 6, y: 2 },   // Move right along top
      { x: 6, y: 8 },   // Zig down
      { x: 12, y: 8 },  // Move right along bottom
      { x: 12, y: 3 },  // Zag up
      { x: 18, y: 3 },  // Move right
      { x: 20, y: 5 },  // Exit: Right edge, middle area
    ],

    constructionSpots: [
      { id: 'CS-01', position: { x: 3, y: 0 } },   // Top left, covers entry
      { id: 'CS-02', position: { x: 4, y: 5 } },   // Left side, covers first zig
      { id: 'CS-03', position: { x: 8, y: 10 } },  // Bottom middle, covers bottom path
      { id: 'CS-04', position: { x: 9, y: 5 } },   // Center, versatile position
      { id: 'CS-05', position: { x: 14, y: 1 } },  // Top right, covers zag up
      { id: 'CS-06', position: { x: 16, y: 6 } },  // Right side, covers exit
    ],

    startingResources: {
      scrap: 150,  // Standard starting amount
      hullIntegrity: 20,
    },

    waves: [
      {
        wave: 1,
        enemies: [{ type: 'shambler' as EnemyType, count: 8 }],
        spawnDelay: 1800,
      },
      {
        wave: 2,
        enemies: [
          { type: 'shambler' as EnemyType, count: 6 },
          { type: 'runner' as EnemyType, count: 4 },
        ],
        spawnDelay: 1600,
      },
      {
        wave: 3,
        enemies: [
          { type: 'shambler' as EnemyType, count: 10 },
          { type: 'runner' as EnemyType, count: 5 },
        ],
        spawnDelay: 1500,
      },
      {
        wave: 4,
        enemies: [
          { type: 'shambler' as EnemyType, count: 8 },
          { type: 'runner' as EnemyType, count: 8 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 5,
        enemies: [
          { type: 'brute' as EnemyType, count: 1 },  // First brute!
          { type: 'shambler' as EnemyType, count: 8 },
        ],
        spawnDelay: 1500,
      },
      {
        wave: 6,
        enemies: [
          { type: 'brute' as EnemyType, count: 1 },
          { type: 'runner' as EnemyType, count: 10 },
          { type: 'shambler' as EnemyType, count: 5 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 7,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'runner' as EnemyType, count: 8 },
          { type: 'shambler' as EnemyType, count: 8 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 8,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'runner' as EnemyType, count: 12 },
          { type: 'shambler' as EnemyType, count: 10 },
        ],
        spawnDelay: 1100,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 50 },
    threeStars: { type: 'hull_remaining', minHullPercent: 80 },
  },

  unlockRequirement: {
    previousLevelId: 'level-02',
    minStarsRequired: 1,
  },

  rewards: {
    firstCompletionBonus: 125,
    scrapPerStar: 60,
  },
};
