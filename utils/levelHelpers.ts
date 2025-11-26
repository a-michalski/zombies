/**
 * Level Helper Functions
 * 
 * Utility functions for creating and managing level configurations.
 * Reduces code duplication across level files.
 */

import { LevelConfig, LevelDifficulty } from '@/types/levels';
import { DEFAULT_GRID, DEFAULT_STARTING_HULL, DIFFICULTY_STARTING_SCRAP, DEFAULT_STAR_REQUIREMENTS, DIFFICULTY_REWARDS } from '@/constants/levels';

/**
 * Create a level configuration with defaults
 * 
 * @param base - Base level configuration (will be merged with defaults)
 * @returns Complete level configuration
 */
export function createLevelConfig(base: Partial<LevelConfig> & {
  id: string;
  number: number;
  name: string;
  description: string;
  difficulty: LevelDifficulty;
}): LevelConfig {
  const difficulty = base.difficulty;

  return {
    ...base,
    mapConfig: {
      grid: DEFAULT_GRID,
      waypoints: base.mapConfig?.waypoints || [],
      constructionSpots: base.mapConfig?.constructionSpots || [],
      startingResources: {
        scrap: base.mapConfig?.startingResources?.scrap ?? DIFFICULTY_STARTING_SCRAP[difficulty],
        hullIntegrity: base.mapConfig?.startingResources?.hullIntegrity ?? DEFAULT_STARTING_HULL,
      },
      waves: base.mapConfig?.waves || [],
    },
    starRequirements: base.starRequirements || DEFAULT_STAR_REQUIREMENTS[difficulty],
    unlockRequirement: base.unlockRequirement || {
      previousLevelId: null,
      minStarsRequired: 0,
    },
    rewards: base.rewards || DIFFICULTY_REWARDS[difficulty],
  };
}

/**
 * Create wave configuration helper
 * 
 * @param waveNumber - Wave number
 * @param enemies - Array of enemy groups
 * @param spawnDelay - Delay between enemy spawns in ms
 * @returns Wave configuration
 */
export function createWaveConfig(
  waveNumber: number,
  enemies: Array<{ type: string; count: number }>,
  spawnDelay: number
) {
  return {
    wave: waveNumber,
    enemies,
    spawnDelay,
  };
}

