/**
 * LEVEL 5: The Long March
 *
 * Difficulty: Medium
 * Theme: Classic map with full 10-wave gauntlet
 *
 * Map Design:
 * - REUSES the original game map layout (from constants/gameConfig.ts)
 * - Complex path with multiple switchbacks
 * - 8 construction spots provide strategic flexibility
 * - Full 10-wave experience similar to original classic mode
 * - Tests mastery of all concepts learned so far
 *
 * Path: Enters left-middle, winds through switchbacks, exits right-upper
 * Note: This is the original "classic mode" map adapted for campaign
 */

import { EnemyType } from '@/constants/enemies';
import { createLevelConfig, createWaveConfig } from '@/utils/levelHelpers';

export const LEVEL_05 = createLevelConfig({
  id: 'level-05',
  number: 5,
  name: 'The Long March',
  description: 'A familiar battlefield. The classic gauntlet of 10 waves tests all your skills.',
  difficulty: 'medium',

  mapConfig: {
    // Original waypoints from constants/gameConfig.ts
    waypoints: [
      { x: 0, y: 6 },   // Start: Left edge, middle
      { x: 4, y: 6 },   // Move right
      { x: 4, y: 3 },   // Turn up
      { x: 8, y: 3 },   // Move right
      { x: 8, y: 9 },   // Turn down (long vertical)
      { x: 14, y: 9 },  // Move right
      { x: 14, y: 4 },  // Turn up (long vertical)
      { x: 20, y: 4 },  // Exit: Right edge, upper-middle
    ],

    // Original construction spots from constants/gameConfig.ts
    constructionSpots: [
      { id: 'CS-01', position: { x: 2, y: 8 } },
      { id: 'CS-02', position: { x: 6, y: 5 } },
      { id: 'CS-03', position: { x: 6, y: 1 } },
      { id: 'CS-04', position: { x: 10, y: 5 } },
      { id: 'CS-05', position: { x: 10, y: 11 } },
      { id: 'CS-06', position: { x: 16, y: 11 } },
      { id: 'CS-07', position: { x: 16, y: 6 } },
      { id: 'CS-08', position: { x: 18, y: 2 } },
    ],

    // Enhanced wave progression based on original WAVE_CONFIGS
    waves: [
      createWaveConfig(1, [{ type: 'shambler' as EnemyType, count: 5 }], 2000),
      createWaveConfig(2, [{ type: 'shambler' as EnemyType, count: 8 }], 1500),
      createWaveConfig(3, [{ type: 'shambler' as EnemyType, count: 12 }], 1500),
      createWaveConfig(4, [{ type: 'shambler' as EnemyType, count: 15 }], 1200),
      createWaveConfig(5, [{ type: 'runner' as EnemyType, count: 10 }], 1000),
      createWaveConfig(6, [
        { type: 'shambler' as EnemyType, count: 10 },
        { type: 'runner' as EnemyType, count: 8 },
      ], 1000),
      createWaveConfig(7, [
        { type: 'runner' as EnemyType, count: 15 },
        { type: 'shambler' as EnemyType, count: 10 },
      ], 800),
      createWaveConfig(8, [
        { type: 'brute' as EnemyType, count: 1 },
        { type: 'runner' as EnemyType, count: 10 },
      ], 1000),
      createWaveConfig(9, [
        { type: 'runner' as EnemyType, count: 15 },
        { type: 'brute' as EnemyType, count: 1 },
        { type: 'shambler' as EnemyType, count: 10 },
      ], 700),
      createWaveConfig(10, [
        { type: 'brute' as EnemyType, count: 1 },
        { type: 'runner' as EnemyType, count: 15 },
        { type: 'brute' as EnemyType, count: 1 },
        { type: 'shambler' as EnemyType, count: 20 },
      ], 600),
    ],
  },

  unlockRequirement: {
    previousLevelId: 'level-04',
    minStarsRequired: 1,
  },
});
