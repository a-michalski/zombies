/**
 * Level Configuration Constants
 * 
 * Shared constants and defaults for level configuration.
 * Reduces duplication across level files.
 */

import { LevelDifficulty } from '@/types/levels';

/**
 * Default grid configuration used by all levels
 */
export const DEFAULT_GRID = {
  width: 20,
  height: 12,
  tileSize: 32,
} as const;

/**
 * Starting scrap resources by difficulty
 */
export const DIFFICULTY_STARTING_SCRAP: Record<LevelDifficulty, number> = {
  easy: 200,
  medium: 150,
  hard: 100,
  boss: 150, // Generous for complexity
};

/**
 * Default starting hull integrity
 */
export const DEFAULT_STARTING_HULL = 20;

/**
 * Default star requirements templates
 */
export const DEFAULT_STAR_REQUIREMENTS = {
  easy: {
    oneStar: { type: 'complete' as const },
    twoStars: { type: 'hull_remaining' as const, minHullPercent: 60 },
    threeStars: { type: 'hull_remaining' as const, minHullPercent: 90 },
  },
  medium: {
    oneStar: { type: 'complete' as const },
    twoStars: { type: 'hull_remaining' as const, minHullPercent: 40 },
    threeStars: { type: 'hull_remaining' as const, minHullPercent: 70 },
  },
  hard: {
    oneStar: { type: 'complete' as const },
    twoStars: { type: 'hull_remaining' as const, minHullPercent: 25 },
    threeStars: { type: 'hull_remaining' as const, minHullPercent: 45 },
  },
  boss: {
    oneStar: { type: 'complete' as const },
    twoStars: { type: 'hull_remaining' as const, minHullPercent: 20 },
    threeStars: { type: 'hull_remaining' as const, minHullPercent: 40 },
  },
} as const;

/**
 * Default rewards by difficulty
 */
export const DIFFICULTY_REWARDS = {
  easy: {
    firstCompletionBonus: 100,
    scrapPerStar: 50,
  },
  medium: {
    firstCompletionBonus: 175,
    scrapPerStar: 80,
  },
  hard: {
    firstCompletionBonus: 300,
    scrapPerStar: 120,
  },
  boss: {
    firstCompletionBonus: 500,
    scrapPerStar: 150,
  },
} as const;

