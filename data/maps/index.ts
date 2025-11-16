/**
 * Campaign Level Data - Barrel Export
 *
 * Exports all 10 campaign levels for Zombie Fleet Bastion
 *
 * Usage:
 *   import { LEVEL_01, LEVEL_05, ALL_LEVELS } from '@/data/maps';
 *
 * Levels Overview:
 *   1. First Contact (Easy) - Tutorial, L-shaped path
 *   2. The Horde Grows (Easy) - S-curve, introduces runners
 *   3. Heavy Infantry (Easy) - Zigzag, introduces brutes
 *   4. Crossroads (Medium) - Complex winding path
 *   5. The Long March (Medium) - Classic map, 10 waves
 *   6. Chokepoint (Medium) - Narrow passages
 *   7. Limited Resources (Hard) - Only 5 tower spots
 *   8. Speed Run (Hard) - Short path, fast enemies
 *   9. The Labyrinth (Hard) - Maze-like, 15 waves
 *   10. Last Stand (Boss) - Epic finale, 20 waves
 */

// Individual level exports
export { LEVEL_01 } from './level-01';
export { LEVEL_02 } from './level-02';
export { LEVEL_03 } from './level-03';
export { LEVEL_04 } from './level-04';
export { LEVEL_05 } from './level-05';
export { LEVEL_06 } from './level-06';
export { LEVEL_07 } from './level-07';
export { LEVEL_08 } from './level-08';
export { LEVEL_09 } from './level-09';
export { LEVEL_10 } from './level-10';

// Imports for array
import { LEVEL_01 } from './level-01';
import { LEVEL_02 } from './level-02';
import { LEVEL_03 } from './level-03';
import { LEVEL_04 } from './level-04';
import { LEVEL_05 } from './level-05';
import { LEVEL_06 } from './level-06';
import { LEVEL_07 } from './level-07';
import { LEVEL_08 } from './level-08';
import { LEVEL_09 } from './level-09';
import { LEVEL_10 } from './level-10';

import { LevelConfig } from '@/types/levels';

/**
 * All campaign levels in order
 * Use this for level selection screens, progression tracking, etc.
 */
export const ALL_LEVELS: LevelConfig[] = [
  LEVEL_01,
  LEVEL_02,
  LEVEL_03,
  LEVEL_04,
  LEVEL_05,
  LEVEL_06,
  LEVEL_07,
  LEVEL_08,
  LEVEL_09,
  LEVEL_10,
];

/**
 * Get a level by its number (1-10)
 * @param levelNumber - The level number (1-based)
 * @returns The level config or undefined if not found
 */
export function getLevelByNumber(levelNumber: number): LevelConfig | undefined {
  return ALL_LEVELS.find(level => level.number === levelNumber);
}

/**
 * Get a level by its ID
 * @param levelId - The level ID (e.g., 'level-01')
 * @returns The level config or undefined if not found
 */
export function getLevelById(levelId: string): LevelConfig | undefined {
  return ALL_LEVELS.find(level => level.id === levelId);
}

/**
 * Get levels by difficulty
 * @param difficulty - The difficulty level to filter by
 * @returns Array of levels matching the difficulty
 */
export function getLevelsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): LevelConfig[] {
  return ALL_LEVELS.filter(level => level.difficulty === difficulty);
}
