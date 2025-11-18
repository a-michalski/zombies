/**
 * LEVEL 16: The Hive
 *
 * Difficulty: Hard
 * Theme: Living organism made of infected tissue - the source
 *
 * Map Design:
 * - Organic corridor (minimal spots)
 * - 6 construction spots (extreme optimization required)
 * - All Level 3 towers mandatory
 * - Pre-final boss gauntlet
 *
 * Path: Organic fissure → pulsating biomass corridors → hive core
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_16: LevelConfig = {
  id: 'level-16',
  number: 16,
  name: 'The Hive',
  description: 'It\'s alive. All of it.',
  difficulty: 'hard',

  mapConfig: {
    grid: {
      width: 27,  // 850px / 32px
      height: 20,  // 650px / 32px
      tileSize: 32,
    },

    // Organic corridor (340 units ~ 11 tiles)
    waypoints: [
      { x: 0, y: 10 },   // Organic fissure (west)
      { x: 9, y: 10 },   // Pulsating biomass
      { x: 9, y: 5 },    // Turn north
      { x: 18, y: 5 },   // Exposed nerves
      { x: 18, y: 15 },  // Turn south
      { x: 27, y: 15 },  // Hive core (east)
    ],

    // 6 construction spots - MINIMAL (mastery test)
    constructionSpots: [
      { id: 'CS-01', position: { x: 4, y: 8 } },   // Spawn fissure
      { id: 'CS-02', position: { x: 6, y: 12 } },  // Spawn fissure
      { id: 'CS-03', position: { x: 11, y: 7 } },  // Mid-path nerve cluster
      { id: 'CS-04', position: { x: 15, y: 3 } },  // Mid-path nerve cluster
      { id: 'CS-05', position: { x: 20, y: 11 } }, // Approaching core
      { id: 'CS-06', position: { x: 24, y: 17 } }, // Approaching core
    ],

    startingResources: {
      scrap: 120,
      hullIntegrity: 20,
    },

    // 10 waves - mostly heavy enemies
    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'bloater' as EnemyType, count: 2 },
        ],
        spawnDelay: 1500,
      },
      {
        wave: 2,
        enemies: [
          { type: 'tank' as EnemyType, count: 2 },
        ],
        spawnDelay: 1600,
      },
      {
        wave: 3,
        enemies: [
          { type: 'brute' as EnemyType, count: 3 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 4,
        enemies: [
          { type: 'bloater' as EnemyType, count: 2 },
          { type: 'tank' as EnemyType, count: 1 },
        ],
        spawnDelay: 1500,
      },
      {
        wave: 5,
        enemies: [
          { type: 'tank' as EnemyType, count: 2 },
          { type: 'brute' as EnemyType, count: 1 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 6,
        enemies: [
          { type: 'bloater' as EnemyType, count: 3 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 7,
        enemies: [
          { type: 'tank' as EnemyType, count: 3 },
        ],
        spawnDelay: 1500,
      },
      {
        wave: 8,
        enemies: [
          { type: 'tank' as EnemyType, count: 3 },
          { type: 'brute' as EnemyType, count: 2 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 9,
        enemies: [
          { type: 'bloater' as EnemyType, count: 2 },
          { type: 'tank' as EnemyType, count: 2 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 10,
        enemies: [
          { type: 'tank' as EnemyType, count: 2 },
          { type: 'bloater' as EnemyType, count: 2 },
          { type: 'brute' as EnemyType, count: 2 },
        ],
        spawnDelay: 1200,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 35 },
    threeStars: { type: 'hull_remaining', minHullPercent: 55 },
  },

  unlockRequirement: {
    previousLevelId: 'level-15',
    minStarsRequired: 1,
  },

  rewards: {
    firstCompletionBonus: 350,
    scrapPerStar: 85,
  },
};
