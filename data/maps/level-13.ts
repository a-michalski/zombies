/**
 * LEVEL 13: The Descent
 *
 * Difficulty: Medium
 * Theme: Underground sewer tunnels - claustrophobic combat
 *
 * Map Design:
 * - Zigzag path with tight 90-degree turns
 * - 7 construction spots (reduced for strategic pressure)
 * - Introduces Crawler (fast enemy with speed boost)
 * - Narrow tunnels create tactical challenges
 *
 * Path: Street grate → zigzag through sewers → drainage chamber → emergency exit
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_13: LevelConfig = {
  id: 'level-13',
  number: 13,
  name: 'The Descent',
  description: 'Into the tunnels. They\'ve been here all along.',
  difficulty: 'medium',

  mapConfig: {
    grid: {
      width: 28,  // 900px / 32px
      height: 19,  // 600px / 32px
      tileSize: 32,
    },

    // Zigzag maze (380 units ~ 12 tiles)
    waypoints: [
      { x: 0, y: 2 },    // Grate entrance (north)
      { x: 6, y: 2 },    // Move east
      { x: 6, y: 10 },   // Turn south
      { x: 14, y: 10 },  // Move east (central drainage)
      { x: 14, y: 4 },   // Turn north
      { x: 22, y: 4 },   // Move east
      { x: 22, y: 14 },  // Turn south
      { x: 28, y: 14 },  // Emergency exit (south)
    ],

    // 7 construction spots - constrained placement
    constructionSpots: [
      { id: 'CS-01', position: { x: 3, y: 6 } },   // Entrance tunnel
      { id: 'CS-02', position: { x: 8, y: 5 } },   // First corner
      { id: 'CS-03', position: { x: 10, y: 12 } }, // Zigzag corner
      { id: 'CS-04', position: { x: 16, y: 7 } },  // Central drainage (premium)
      { id: 'CS-05', position: { x: 18, y: 2 } },  // Corner
      { id: 'CS-06', position: { x: 24, y: 9 } },  // Exit tunnel
      { id: 'CS-07', position: { x: 26, y: 16 } }, // Emergency backup
    ],

    startingResources: {
      scrap: 160,
      hullIntegrity: 20,
    },

    // 10 waves - introduces Crawler on wave 5
    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'shambler' as EnemyType, count: 8 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 2,
        enemies: [
          { type: 'runner' as EnemyType, count: 10 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 3,
        enemies: [
          { type: 'spitter' as EnemyType, count: 4 },
          { type: 'shambler' as EnemyType, count: 6 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 4,
        enemies: [
          { type: 'runner' as EnemyType, count: 8 },
          { type: 'spitter' as EnemyType, count: 3 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 5,
        enemies: [
          { type: 'crawler' as EnemyType, count: 8 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 6,
        enemies: [
          { type: 'crawler' as EnemyType, count: 6 },
          { type: 'runner' as EnemyType, count: 5 },
        ],
        spawnDelay: 950,
      },
      {
        wave: 7,
        enemies: [
          { type: 'brute' as EnemyType, count: 1 },
          { type: 'crawler' as EnemyType, count: 8 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 8,
        enemies: [
          { type: 'spitter' as EnemyType, count: 5 },
          { type: 'crawler' as EnemyType, count: 6 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 9,
        enemies: [
          { type: 'runner' as EnemyType, count: 10 },
          { type: 'crawler' as EnemyType, count: 5 },
        ],
        spawnDelay: 900,
      },
      {
        wave: 10,
        enemies: [
          { type: 'crawler' as EnemyType, count: 10 },
          { type: 'runner' as EnemyType, count: 8 },
        ],
        spawnDelay: 850,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 50 },
    threeStars: { type: 'hull_remaining', minHullPercent: 70 },
  },

  unlockRequirement: {
    previousLevelId: 'level-12',
    minStarsRequired: 1,
  },

  rewards: {
    firstCompletionBonus: 240,
    scrapPerStar: 60,
  },
};
