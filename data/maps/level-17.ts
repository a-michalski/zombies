/**
 * LEVEL 17: The Queen's Fall
 *
 * Difficulty: Hard (BOSS)
 * Theme: Final confrontation with Hive Queen - campaign climax
 *
 * Map Design:
 * - Circular arena path
 * - 7 construction spots (center premium position)
 * - Hive Queen boss (950 HP, regeneration)
 * - Mixed waves with Queen + adds
 *
 * Path: Hive throne → circular pattern around arena → player base
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_17: LevelConfig = {
  id: 'level-17',
  number: 17,
  name: 'The Queen\'s Fall',
  description: 'End this. End her.',
  difficulty: 'hard',

  mapConfig: {
    grid: {
      width: 31,  // 1000px / 32px
      height: 25,  // 800px / 32px
      tileSize: 32,
    },

    // Circular arena (350 units ~ 11 tiles)
    waypoints: [
      { x: 15, y: 2 },   // Hive throne (north)
      { x: 6, y: 5 },    // Western quadrant
      { x: 4, y: 12 },   // Southwest
      { x: 6, y: 20 },   // Southern quadrant
      { x: 15, y: 23 },  // South center
      { x: 24, y: 20 },  // Southeast
      { x: 26, y: 12 },  // Eastern quadrant
      { x: 24, y: 5 },   // Northeast
      { x: 15, y: 12 },  // Center (player base)
    ],

    // 7 construction spots - arena strategic placement
    constructionSpots: [
      { id: 'CS-01', position: { x: 15, y: 7 } },  // Arena center (PREMIUM)
      { id: 'CS-02', position: { x: 8, y: 8 } },   // West quadrant perimeter
      { id: 'CS-03', position: { x: 8, y: 16 } },  // Southwest perimeter
      { id: 'CS-04', position: { x: 15, y: 18 } }, // South perimeter
      { id: 'CS-05', position: { x: 22, y: 16 } }, // Southeast perimeter
      { id: 'CS-06', position: { x: 22, y: 8 } },  // East quadrant perimeter
      { id: 'CS-07', position: { x: 15, y: 15 } }, // Player base entrance
    ],

    startingResources: {
      scrap: 110,
      hullIntegrity: 20,
    },

    // 10 waves - BOSS FIGHT with Hive Queen
    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'crawler' as EnemyType, count: 8 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 2,
        enemies: [
          { type: 'spitter' as EnemyType, count: 6 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 3,
        enemies: [
          { type: 'bloater' as EnemyType, count: 2 },
        ],
        spawnDelay: 1500,
      },
      {
        wave: 4,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 5,
        enemies: [
          { type: 'tank' as EnemyType, count: 2 },
        ],
        spawnDelay: 1600,
      },
      {
        wave: 6,
        enemies: [
          { type: 'crawler' as EnemyType, count: 6 },
          { type: 'spitter' as EnemyType, count: 4 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 7,
        enemies: [
          { type: 'bloater' as EnemyType, count: 2 },
          { type: 'tank' as EnemyType, count: 1 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 8,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'tank' as EnemyType, count: 1 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 9,
        enemies: [
          { type: 'tank' as EnemyType, count: 2 },
          { type: 'bloater' as EnemyType, count: 1 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 10,
        enemies: [
          { type: 'hiveQueen' as EnemyType, count: 1 },
          { type: 'crawler' as EnemyType, count: 4 },
          { type: 'spitter' as EnemyType, count: 4 },
        ],
        spawnDelay: 1500,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 30 },
    threeStars: { type: 'hull_remaining', minHullPercent: 50 },
  },

  unlockRequirement: {
    previousLevelId: 'level-16',
    minStarsRequired: 1,
  },

  rewards: {
    firstCompletionBonus: 500,  // Epic finale reward
    scrapPerStar: 100,
  },
};
