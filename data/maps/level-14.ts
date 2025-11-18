/**
 * LEVEL 14: The Nexus
 *
 * Difficulty: Medium
 * Theme: Research laboratory where mutation accelerated
 *
 * Map Design:
 * - Open lab floor with scattered obstacles
 * - 8 construction spots (deliberately separated for Bloater explosions)
 * - Introduces Bloater (death explosion damages towers)
 * - Requires strategic tower spacing
 *
 * Path: Security checkpoint → decontamination → lab floor → quarantine breach
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_14: LevelConfig = {
  id: 'level-14',
  number: 14,
  name: 'The Nexus',
  description: 'A secret lab. This is where they evolved.',
  difficulty: 'medium',

  mapConfig: {
    grid: {
      width: 30,  // 950px / 32px
      height: 22,  // 700px / 32px
      tileSize: 32,
    },

    // Open scattered path (400 units ~ 13 tiles)
    waypoints: [
      { x: 0, y: 11 },   // Security checkpoint (west)
      { x: 6, y: 11 },   // Decontamination
      { x: 6, y: 6 },    // Turn north
      { x: 15, y: 6 },   // Lab floor center
      { x: 15, y: 16 },  // Weave south
      { x: 24, y: 16 },  // Move east
      { x: 24, y: 8 },   // Turn north
      { x: 30, y: 8 },   // Quarantine breach (east)
    ],

    // 8 construction spots - separated to avoid explosion overlap
    constructionSpots: [
      { id: 'CS-01', position: { x: 3, y: 9 } },   // Decontamination
      { id: 'CS-02', position: { x: 8, y: 13 } },  // Decontamination
      { id: 'CS-03', position: { x: 11, y: 3 } },  // Lab floor
      { id: 'CS-04', position: { x: 13, y: 10 } }, // Lab floor
      { id: 'CS-05', position: { x: 18, y: 13 } }, // Lab floor
      { id: 'CS-06', position: { x: 20, y: 4 } },  // Lab floor
      { id: 'CS-07', position: { x: 26, y: 11 } }, // Quarantine breach
      { id: 'CS-08', position: { x: 28, y: 18 } }, // Quarantine breach
    ],

    startingResources: {
      scrap: 140,
      hullIntegrity: 20,
    },

    // 10 waves - introduces Bloater on wave 7
    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'shambler' as EnemyType, count: 10 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 2,
        enemies: [
          { type: 'runner' as EnemyType, count: 12 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 3,
        enemies: [
          { type: 'spitter' as EnemyType, count: 5 },
          { type: 'crawler' as EnemyType, count: 6 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 4,
        enemies: [
          { type: 'crawler' as EnemyType, count: 8 },
          { type: 'runner' as EnemyType, count: 6 },
        ],
        spawnDelay: 950,
      },
      {
        wave: 5,
        enemies: [
          { type: 'brute' as EnemyType, count: 1 },
          { type: 'spitter' as EnemyType, count: 6 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 6,
        enemies: [
          { type: 'crawler' as EnemyType, count: 10 },
        ],
        spawnDelay: 900,
      },
      {
        wave: 7,
        enemies: [
          { type: 'bloater' as EnemyType, count: 2 },
          { type: 'shambler' as EnemyType, count: 8 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 8,
        enemies: [
          { type: 'bloater' as EnemyType, count: 3 },
          { type: 'runner' as EnemyType, count: 8 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 9,
        enemies: [
          { type: 'brute' as EnemyType, count: 1 },
          { type: 'bloater' as EnemyType, count: 2 },
          { type: 'spitter' as EnemyType, count: 5 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 10,
        enemies: [
          { type: 'bloater' as EnemyType, count: 4 },
          { type: 'brute' as EnemyType, count: 1 },
          { type: 'crawler' as EnemyType, count: 10 },
        ],
        spawnDelay: 950,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 45 },
    threeStars: { type: 'hull_remaining', minHullPercent: 65 },
  },

  unlockRequirement: {
    previousLevelId: 'level-13',
    minStarsRequired: 1,
  },

  rewards: {
    firstCompletionBonus: 260,
    scrapPerStar: 65,
  },
};
