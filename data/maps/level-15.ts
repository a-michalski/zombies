/**
 * LEVEL 15: Scorched Earth
 *
 * Difficulty: Hard
 * Theme: Military base where containment failed
 *
 * Map Design:
 * - Straight path (pure DPS test)
 * - 8 construction spots with open sightlines
 * - Introduces Tank (25% armor)
 * - Requires upgraded towers to succeed
 *
 * Path: Collapsed fence → straight across battlefield → bunker entrance
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_15: LevelConfig = {
  id: 'level-15',
  number: 15,
  name: 'Scorched Earth',
  description: 'The military tried. The military failed.',
  difficulty: 'hard',

  mapConfig: {
    grid: {
      width: 38,  // 1200px / 32px
      height: 25,  // 800px / 32px
      tileSize: 32,
    },

    // Straight path (360 units ~ 11 tiles) - DPS check
    waypoints: [
      { x: 0, y: 5 },    // Collapsed fence (northwest)
      { x: 12, y: 5 },   // Open battlefield
      { x: 12, y: 12 },  // Vehicle barriers
      { x: 30, y: 12 },  // Scorched tarmac
      { x: 38, y: 20 },  // Bunker entrance (southeast)
    ],

    // 8 construction spots - all see majority of path
    constructionSpots: [
      { id: 'CS-01', position: { x: 4, y: 3 } },   // Perimeter
      { id: 'CS-02', position: { x: 6, y: 8 } },   // Perimeter
      { id: 'CS-03', position: { x: 14, y: 9 } },  // Central battlefield
      { id: 'CS-04', position: { x: 16, y: 15 } }, // Central battlefield
      { id: 'CS-05', position: { x: 22, y: 8 } },  // Central battlefield
      { id: 'CS-06', position: { x: 26, y: 10 } }, // Destroyed vehicles
      { id: 'CS-07', position: { x: 28, y: 15 } }, // Destroyed vehicles
      { id: 'CS-08', position: { x: 34, y: 17 } }, // Bunker entrance
    ],

    startingResources: {
      scrap: 130,
      hullIntegrity: 20,
    },

    // 10 waves - introduces Tank on wave 6
    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'shambler' as EnemyType, count: 6 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 2,
        enemies: [
          { type: 'runner' as EnemyType, count: 8 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 3,
        enemies: [
          { type: 'crawler' as EnemyType, count: 8 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 4,
        enemies: [
          { type: 'bloater' as EnemyType, count: 2 },
          { type: 'spitter' as EnemyType, count: 4 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 5,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 6,
        enemies: [
          { type: 'tank' as EnemyType, count: 1 },
          { type: 'shambler' as EnemyType, count: 4 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 7,
        enemies: [
          { type: 'tank' as EnemyType, count: 2 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 8,
        enemies: [
          { type: 'tank' as EnemyType, count: 2 },
          { type: 'bloater' as EnemyType, count: 2 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 9,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'tank' as EnemyType, count: 2 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 10,
        enemies: [
          { type: 'tank' as EnemyType, count: 3 },
          { type: 'brute' as EnemyType, count: 2 },
        ],
        spawnDelay: 1200,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 40 },
    threeStars: { type: 'hull_remaining', minHullPercent: 60 },
  },

  unlockRequirement: {
    previousLevelId: 'level-14',
    minStarsRequired: 1,
  },

  rewards: {
    firstCompletionBonus: 300,
    scrapPerStar: 75,
  },
};
