/**
 * LEVEL 6: Chokepoint
 *
 * Difficulty: Medium
 * Theme: Strategic narrow passages force careful tower placement
 *
 * Map Design:
 * - Path features multiple narrow vertical sections (chokepoints)
 * - 6 strategically positioned construction spots
 * - Chokepoints allow concentrated tower fire but require good timing
 * - 10 waves with increasing difficulty and mixed enemy types
 *
 * Path: Multiple vertical chokepoints connected by horizontal segments
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_06: LevelConfig = {
  id: 'level-06',
  number: 6,
  name: 'Chokepoint',
  description: 'Narrow passages create deadly killzones. Control the chokepoints to survive!',
  difficulty: 'medium',

  mapConfig: {
    grid: {
      width: 20,
      height: 12,
      tileSize: 32,
    },

    waypoints: [
      { x: 0, y: 6 },   // Start: Left edge, middle
      { x: 3, y: 6 },   // Move right
      { x: 3, y: 2 },   // CHOKEPOINT 1: Turn up (narrow vertical)
      { x: 8, y: 2 },   // Move right
      { x: 8, y: 9 },   // CHOKEPOINT 2: Turn down (narrow vertical)
      { x: 13, y: 9 },  // Move right
      { x: 13, y: 3 },  // CHOKEPOINT 3: Turn up (narrow vertical)
      { x: 20, y: 3 },  // Exit: Right edge, upper area
    ],

    constructionSpots: [
      { id: 'CS-01', position: { x: 1, y: 4 } },   // Near entrance, covers chokepoint 1
      { id: 'CS-02', position: { x: 5, y: 0 } },   // Top, covers chokepoint 1 exit
      { id: 'CS-03', position: { x: 6, y: 6 } },   // Center, versatile coverage
      { id: 'CS-04', position: { x: 10, y: 11 } }, // Bottom, covers chokepoint 2
      { id: 'CS-05', position: { x: 11, y: 5 } },  // Middle-right, covers chokepoint 3
      { id: 'CS-06', position: { x: 16, y: 1 } },  // Top right, covers exit
    ],

    startingResources: {
      scrap: 135,  // Reduced for strategic challenge
      hullIntegrity: 20,
    },

    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'shambler' as EnemyType, count: 12 },
          { type: 'runner' as EnemyType, count: 5 },
        ],
        spawnDelay: 1500,
      },
      {
        wave: 2,
        enemies: [
          { type: 'shambler' as EnemyType, count: 10 },
          { type: 'runner' as EnemyType, count: 8 },
        ],
        spawnDelay: 1400,
      },
      {
        wave: 3,
        enemies: [
          { type: 'runner' as EnemyType, count: 15 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 4,
        enemies: [
          { type: 'brute' as EnemyType, count: 1 },
          { type: 'shambler' as EnemyType, count: 15 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 5,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'runner' as EnemyType, count: 10 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 6,
        enemies: [
          { type: 'runner' as EnemyType, count: 20 },
          { type: 'shambler' as EnemyType, count: 10 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 7,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'runner' as EnemyType, count: 15 },
          { type: 'shambler' as EnemyType, count: 12 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 8,
        enemies: [
          { type: 'brute' as EnemyType, count: 3 },
          { type: 'runner' as EnemyType, count: 12 },
          { type: 'shambler' as EnemyType, count: 15 },
        ],
        spawnDelay: 900,
      },
      {
        wave: 9,
        enemies: [
          { type: 'brute' as EnemyType, count: 3 },
          { type: 'runner' as EnemyType, count: 18 },
        ],
        spawnDelay: 900,
      },
      {
        wave: 10,
        enemies: [
          { type: 'brute' as EnemyType, count: 4 },
          { type: 'runner' as EnemyType, count: 20 },
          { type: 'shambler' as EnemyType, count: 20 },
        ],
        spawnDelay: 800,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 40 },
    threeStars: { type: 'hull_remaining', minHullPercent: 65 },
  },

  unlockRequirement: {
    previousLevelId: 'level-05',
    minStarsRequired: 1,
  },

  rewards: {
    firstCompletionBonus: 200,
    scrapPerStar: 85,
  },
};
