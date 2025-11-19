/**
 * LEVEL 11: The Outskirts
 *
 * Difficulty: Easy
 * Theme: Abandoned suburban streets - first signs of organized infection
 *
 * Map Design:
 * - S-curve path through residential areas
 * - 10 construction spots for flexible defense
 * - 10 waves introducing campaign progression
 *
 * Path: Northwest spawn → winds through residential → central intersection → exits southeast
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_11: LevelConfig = {
  id: 'level-11',
  number: 11,
  name: 'The Outskirts',
  description: 'Abandoned suburban streets. Something\'s wrong here.',
  difficulty: 'easy',

  mapConfig: {
    grid: {
      width: 34,  // 1100px / 32px
      height: 22,  // 700px / 32px
      tileSize: 32,
    },

    // S-curve path (450 units ~ 14 tiles)
    waypoints: [
      { x: 0, y: 2 },    // Northwest spawn
      { x: 8, y: 2 },    // Move east
      { x: 8, y: 12 },   // Turn south (residential area)
      { x: 17, y: 12 },  // Central intersection
      { x: 17, y: 6 },   // Turn north
      { x: 28, y: 6 },   // Move east
      { x: 28, y: 18 },  // Turn south
      { x: 34, y: 18 },  // Exit southeast
    ],

    // 10 construction spots - generous placement
    constructionSpots: [
      { id: 'CS-01', position: { x: 4, y: 5 } },   // Northern residential
      { id: 'CS-02', position: { x: 6, y: 9 } },   // Northern residential
      { id: 'CS-03', position: { x: 10, y: 5 } },  // Northern residential
      { id: 'CS-04', position: { x: 13, y: 14 } }, // Central intersection
      { id: 'CS-05', position: { x: 19, y: 9 } },  // Central intersection
      { id: 'CS-06', position: { x: 21, y: 3 } },  // Commercial area
      { id: 'CS-07', position: { x: 24, y: 9 } },  // Commercial area
      { id: 'CS-08', position: { x: 26, y: 13 } }, // Commercial area
      { id: 'CS-09', position: { x: 30, y: 10 } }, // Parking lot (flexible)
      { id: 'CS-10', position: { x: 31, y: 15 } }, // Parking lot (flexible)
    ],

    startingResources: {
      scrap: 200,
      hullIntegrity: 20,
    },

    // 10 waves - Level 11 composition from Agent 2
    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'shambler' as EnemyType, count: 8 },
        ],
        spawnDelay: 1500,
      },
      {
        wave: 2,
        enemies: [
          { type: 'shambler' as EnemyType, count: 10 },
          { type: 'runner' as EnemyType, count: 3 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 3,
        enemies: [
          { type: 'runner' as EnemyType, count: 8 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 4,
        enemies: [
          { type: 'shambler' as EnemyType, count: 12 },
          { type: 'runner' as EnemyType, count: 5 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 5,
        enemies: [
          { type: 'runner' as EnemyType, count: 10 },
          { type: 'shambler' as EnemyType, count: 6 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 6,
        enemies: [
          { type: 'shambler' as EnemyType, count: 8 },
          { type: 'runner' as EnemyType, count: 8 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 7,
        enemies: [
          { type: 'runner' as EnemyType, count: 12 },
          { type: 'brute' as EnemyType, count: 1 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 8,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'shambler' as EnemyType, count: 10 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 9,
        enemies: [
          { type: 'runner' as EnemyType, count: 15 },
          { type: 'shambler' as EnemyType, count: 5 },
        ],
        spawnDelay: 900,
      },
      {
        wave: 10,
        enemies: [
          { type: 'brute' as EnemyType, count: 1 },
          { type: 'runner' as EnemyType, count: 10 },
          { type: 'shambler' as EnemyType, count: 10 },
        ],
        spawnDelay: 1000,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 60 },
    threeStars: { type: 'hull_remaining', minHullPercent: 80 },
  },

  unlockRequirement: {
    previousLevelId: 'level-10',
    minStarsRequired: 1,
  },

  rewards: {
    firstCompletionBonus: 200,
    scrapPerStar: 50,
  },
};
