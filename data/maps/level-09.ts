/**
 * LEVEL 9: The Labyrinth
 *
 * Difficulty: Hard
 * Theme: Extremely complex maze-like path tests mastery
 *
 * Map Design:
 * - Labyrinthine path with 11 waypoints and many turns
 * - Path snakes through entire map creating maze-like feel
 * - 7 construction spots require careful positioning
 * - 15 waves of intense enemy variety
 * - Long path provides time but requires full map coverage
 *
 * Path: Complex serpentine maze from left-middle to right-middle
 */

import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_09: LevelConfig = {
  id: 'level-09',
  number: 9,
  name: 'The Labyrinth',
  description: 'Navigate a treacherous maze. 15 waves of chaos await those who dare enter.',
  difficulty: 'hard',

  mapConfig: {
    grid: {
      width: 20,
      height: 12,
      tileSize: 32,
    },

    // Maze-like path with many turns
    waypoints: [
      { x: 0, y: 6 },   // Start: Left edge, middle
      { x: 3, y: 6 },   // Move right
      { x: 3, y: 2 },   // Turn up
      { x: 7, y: 2 },   // Move right (top area)
      { x: 7, y: 9 },   // Turn down (long vertical)
      { x: 11, y: 9 },  // Move right (bottom area)
      { x: 11, y: 3 },  // Turn up (long vertical)
      { x: 14, y: 3 },  // Move right
      { x: 14, y: 10 }, // Turn down (long vertical)
      { x: 18, y: 10 }, // Move right
      { x: 18, y: 6 },  // Turn up
      { x: 20, y: 6 },  // Exit: Right edge, middle
    ],

    constructionSpots: [
      { id: 'CS-01', position: { x: 1, y: 4 } },   // Left entrance area
      { id: 'CS-02', position: { x: 5, y: 5 } },   // Left maze section
      { id: 'CS-03', position: { x: 9, y: 11 } },  // Bottom center
      { id: 'CS-04', position: { x: 9, y: 1 } },   // Top center
      { id: 'CS-05', position: { x: 12, y: 6 } },  // True center, versatile
      { id: 'CS-06', position: { x: 16, y: 1 } },  // Top right
      { id: 'CS-07', position: { x: 16, y: 8 } },  // Bottom right
    ],

    startingResources: {
      scrap: 125,
      hullIntegrity: 20,
    },

    // 15 waves of escalating difficulty
    waves: [
      {
        wave: 1,
        enemies: [
          { type: 'shambler' as EnemyType, count: 15 },
          { type: 'runner' as EnemyType, count: 10 },
        ],
        spawnDelay: 1300,
      },
      {
        wave: 2,
        enemies: [
          { type: 'runner' as EnemyType, count: 20 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 3,
        enemies: [
          { type: 'brute' as EnemyType, count: 2 },
          { type: 'shambler' as EnemyType, count: 18 },
        ],
        spawnDelay: 1200,
      },
      {
        wave: 4,
        enemies: [
          { type: 'runner' as EnemyType, count: 25 },
          { type: 'shambler' as EnemyType, count: 15 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 5,
        enemies: [
          { type: 'brute' as EnemyType, count: 3 },
          { type: 'runner' as EnemyType, count: 18 },
        ],
        spawnDelay: 1100,
      },
      {
        wave: 6,
        enemies: [
          { type: 'runner' as EnemyType, count: 30 },
        ],
        spawnDelay: 900,
      },
      {
        wave: 7,
        enemies: [
          { type: 'brute' as EnemyType, count: 4 },
          { type: 'shambler' as EnemyType, count: 20 },
        ],
        spawnDelay: 1000,
      },
      {
        wave: 8,
        enemies: [
          { type: 'brute' as EnemyType, count: 3 },
          { type: 'runner' as EnemyType, count: 25 },
          { type: 'shambler' as EnemyType, count: 15 },
        ],
        spawnDelay: 950,
      },
      {
        wave: 9,
        enemies: [
          { type: 'runner' as EnemyType, count: 35 },
        ],
        spawnDelay: 850,
      },
      {
        wave: 10,
        enemies: [
          { type: 'brute' as EnemyType, count: 5 },
          { type: 'runner' as EnemyType, count: 25 },
        ],
        spawnDelay: 900,
      },
      {
        wave: 11,
        enemies: [
          { type: 'brute' as EnemyType, count: 4 },
          { type: 'runner' as EnemyType, count: 30 },
          { type: 'shambler' as EnemyType, count: 20 },
        ],
        spawnDelay: 850,
      },
      {
        wave: 12,
        enemies: [
          { type: 'runner' as EnemyType, count: 40 },
        ],
        spawnDelay: 800,
      },
      {
        wave: 13,
        enemies: [
          { type: 'brute' as EnemyType, count: 6 },
          { type: 'runner' as EnemyType, count: 30 },
        ],
        spawnDelay: 850,
      },
      {
        wave: 14,
        enemies: [
          { type: 'brute' as EnemyType, count: 5 },
          { type: 'runner' as EnemyType, count: 35 },
          { type: 'shambler' as EnemyType, count: 25 },
        ],
        spawnDelay: 800,
      },
      {
        wave: 15,
        enemies: [
          { type: 'brute' as EnemyType, count: 7 },
          { type: 'runner' as EnemyType, count: 40 },
          { type: 'shambler' as EnemyType, count: 30 },
        ],
        spawnDelay: 750,
      },
    ],
  },

  starRequirements: {
    oneStar: { type: 'complete' },
    twoStars: { type: 'hull_remaining', minHullPercent: 30 },
    threeStars: { type: 'hull_remaining', minHullPercent: 50 },
  },

  unlockRequirement: {
    previousLevelId: 'level-08',
    minStarsRequired: 1,
  },

  rewards: {
    firstCompletionBonus: 300,
    scrapPerStar: 125,
  },
};
