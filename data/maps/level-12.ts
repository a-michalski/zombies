/**
 * LEVEL 12: Dead Factory
 *
 * Difficulty: Easy
 * Theme: Industrial complex where infection originated
 *
 * Map Design:
 * - Linear path with assembly line choke
 * - 9 construction spots (includes elevated catwalks)
 * - Introduces Spitter (ranged enemy)
 * - 10 waves with mixed enemy types
 *
 * Path: Western loading dock → factory floor → assembly corridor → warehouse → shipping bay
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_12: LevelConfig = {
  id: 'level-12',
  number: 12,
  name: 'Dead Factory',
  description: 'Where it all began. The air tastes of rust and death.',
  difficulty: 'easy',

  mapConfig: {
    grid: {
      width: 31,  // 1000px / 32px
      height: 23,  // 750px / 32px
      tileSize: 32,
    },

    // Linear path with narrow choke (420 units ~ 13 tiles)
    waypoints: [
      { x: 0, y: 11 },   // Loading dock (west)
      { x: 8, y: 11 },   // Factory floor
      { x: 8, y: 4 },    // Assembly line (narrow)
      { x: 20, y: 4 },   // Warehouse floor
      { x: 20, y: 14 },  // Turn south
      { x: 31, y: 14 },  // Shipping bay (east exit)
    ],

    // 9 construction spots - industrial placement
    constructionSpots: [
      { id: 'CS-01', position: { x: 3, y: 8 } },   // Catwalk (elevated)
      { id: 'CS-02', position: { x: 5, y: 13 } },  // Catwalk (elevated)
      { id: 'CS-03', position: { x: 11, y: 7 } },  // Assembly line
      { id: 'CS-04', position: { x: 13, y: 1 } },  // Assembly line
      { id: 'CS-05', position: { x: 15, y: 7 } },  // Assembly line
      { id: 'CS-06', position: { x: 23, y: 8 } },  // Warehouse floor
      { id: 'CS-07', position: { x: 25, y: 18 } }, // Warehouse floor
      { id: 'CS-08', position: { x: 28, y: 11 } }, // Shipping bay
      { id: 'CS-09', position: { x: 29, y: 18 } }, // Shipping bay
    ],

    startingResources: {
      scrap: 180,
      hullIntegrity: 20,
    },

    // 10 waves - introduces Spitter on wave 6
    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'shambler' as EnemyType, count: 10 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 2,
        enemies: [
          { type: 'shambler' as EnemyType, count: 12 },
          { type: 'runner' as EnemyType, count: 5 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 3,
        enemies: [
          { type: 'runner' as EnemyType, count: 10 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 4,
        enemies: [
          { type: 'shambler' as EnemyType, count: 15 },
          { type: 'runner' as EnemyType, count: 8 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 5,
        enemies: [
          { type: 'runner' as EnemyType, count: 12 },
          { type: 'brute' as EnemyType, count: 1 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 6,
        enemies: [
          { type: 'spitter' as EnemyType, count: 3 },
          { type: 'shambler' as EnemyType, count: 10 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 7,
        enemies: [
          { type: 'spitter' as EnemyType, count: 5 },
          { type: 'runner' as EnemyType, count: 12 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 8,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'spitter' as EnemyType, count: 4 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 9,
        enemies: [
          { type: 'spitter' as EnemyType, count: 6 },
          { type: 'brute' as EnemyType, count: 1 },
          { type: 'runner' as EnemyType, count: 10 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 10,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'spitter' as EnemyType, count: 8 },
          { type: 'runner' as EnemyType, count: 15 },
        ],
        spawnDelay: 950,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 55 },
    threeStars: { type: 'hull_remaining', minHullPercent: 75 },
  },

  unlockRequirement: {
    previousLevelId: 'level-11',
    minStarsRequired: 1,
  },

  rewards: {
    firstCompletionBonus: 220,
    scrapPerStar: 55,
  },
};
