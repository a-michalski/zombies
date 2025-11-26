/**
 * LEVEL 1: First Contact
 *
 * Difficulty: Easy (Tutorial)
 * Theme: Introduction to tower defense basics
 *
 * Map Design:
 * - Simple L-shaped path for easy understanding
 * - 5 construction spots with clear placement opportunities
 * - Generous starting resources to learn tower building
 * - Only shambler enemies for learning basic mechanics
 *
 * Path: Enters from left, moves right, turns up, exits top-right
 */

import { EnemyType } from '@/constants/enemies';
import { createLevelConfig, createWaveConfig } from '@/utils/levelHelpers';

export const LEVEL_01 = createLevelConfig({
  id: 'level-01',
  number: 1,
  name: 'First Contact',
  description: 'Your first encounter with the zombie horde. Learn the basics of tower defense.',
  difficulty: 'easy',

  mapConfig: {
    waypoints: [
      { x: 0, y: 6 },   // Start: Left edge, middle height
      { x: 10, y: 6 },  // Move right along middle
      { x: 10, y: 3 },  // Turn up
      { x: 20, y: 3 },  // Exit: Right edge, upper area
    ],

    constructionSpots: [
      { id: 'CS-01', position: { x: 4, y: 8 } },   // Bottom left, covers early path
      { id: 'CS-02', position: { x: 8, y: 4 } },   // Near corner, versatile position
      { id: 'CS-03', position: { x: 12, y: 8 } },  // Bottom right, covers corner
      { id: 'CS-04', position: { x: 12, y: 1 } },  // Top, covers exit path
      { id: 'CS-05', position: { x: 16, y: 5 } },  // Right side, covers final stretch
    ],

    startingResources: {
      scrap: 200,  // Generous for tutorial (overrides default)
      hullIntegrity: 20,
    },

    waves: [
      createWaveConfig(1, [{ type: 'shambler' as EnemyType, count: 5 }], 2000),
      createWaveConfig(2, [{ type: 'shambler' as EnemyType, count: 6 }], 1800),
      createWaveConfig(3, [{ type: 'shambler' as EnemyType, count: 8 }], 1600),
      createWaveConfig(4, [{ type: 'shambler' as EnemyType, count: 10 }], 1500),
      createWaveConfig(5, [{ type: 'shambler' as EnemyType, count: 12 }], 1400),
    ],
  },

  unlockRequirement: {
    previousLevelId: null,  // First level, always unlocked
    minStarsRequired: 0,
  },
});
