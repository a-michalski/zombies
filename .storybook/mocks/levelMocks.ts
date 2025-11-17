/**
 * Mock data for level configurations and progression
 * Used in Storybook stories for LevelCard and campaign components
 */

import { LevelConfig, Difficulty } from '@/types/levels';
import { LevelProgress } from '@/types/progression';
import { MapConfig } from '@/types/map';

/**
 * Mock MapConfig for testing
 */
export const MOCK_MAP_CONFIG: MapConfig = {
  waypoints: [
    { x: 50, y: 50 },
    { x: 150, y: 50 },
    { x: 150, y: 150 },
    { x: 250, y: 150 },
  ],
  constructionSpots: [
    { id: 'spot-1', x: 100, y: 75 },
    { id: 'spot-2', x: 200, y: 100 },
  ],
  waves: [
    {
      waveNumber: 1,
      enemies: [
        { type: 'shambler', count: 5, delay: 0 },
      ],
    },
  ],
  startingResources: {
    scrap: 100,
    hullIntegrity: 100,
  },
};

/**
 * Mock Level 1 - Easy difficulty
 */
export const MOCK_LEVEL_01: LevelConfig = {
  id: 'level-01',
  number: 1,
  name: 'First Contact',
  description: 'Your first encounter with the undead horde',
  difficulty: 'easy' as Difficulty,
  mapConfig: MOCK_MAP_CONFIG,
  starRequirements: {
    oneStar: {
      type: 'complete',
    },
    twoStars: {
      type: 'hull_remaining',
      minHullPercent: 50,
    },
    threeStars: {
      type: 'hull_remaining',
      minHullPercent: 80,
    },
  },
  unlockRequirement: {
    previousLevelId: null,
    minStarsRequired: 0,
  },
  rewards: {
    firstCompletionBonus: 50,
    scrapPerStar: 25,
  },
};

/**
 * Mock Level 3 - Medium difficulty
 */
export const MOCK_LEVEL_03: LevelConfig = {
  id: 'level-03',
  number: 3,
  name: 'Rising Tide',
  description: 'The swarm grows stronger',
  difficulty: 'medium' as Difficulty,
  mapConfig: MOCK_MAP_CONFIG,
  starRequirements: {
    oneStar: {
      type: 'complete',
    },
    twoStars: {
      type: 'hull_remaining',
      minHullPercent: 60,
    },
    threeStars: {
      type: 'perfect',
      description: 'No hull damage',
    },
  },
  unlockRequirement: {
    previousLevelId: 'level-02',
    minStarsRequired: 1,
  },
  rewards: {
    firstCompletionBonus: 100,
    scrapPerStar: 50,
  },
};

/**
 * Mock Level 5 - Hard difficulty
 */
export const MOCK_LEVEL_05: LevelConfig = {
  id: 'level-05',
  number: 5,
  name: 'Hell\'s Gate',
  description: 'Only the best survive',
  difficulty: 'hard' as Difficulty,
  mapConfig: MOCK_MAP_CONFIG,
  starRequirements: {
    oneStar: {
      type: 'complete',
    },
    twoStars: {
      type: 'time_limit',
      maxSeconds: 300,
    },
    threeStars: {
      type: 'max_towers',
      maxTowers: 5,
    },
  },
  unlockRequirement: {
    previousLevelId: 'level-04',
    minStarsRequired: 2,
  },
  rewards: {
    firstCompletionBonus: 200,
    scrapPerStar: 100,
  },
};

/**
 * Mock Level Progress - Not completed
 */
export const MOCK_PROGRESS_NOT_COMPLETED: LevelProgress = {
  levelId: 'level-01',
  completed: false,
  starsEarned: 0,
  bestScore: 0,
  bestWave: 0,
  timesPlayed: 0,
  lastPlayedAt: null,
};

/**
 * Mock Level Progress - 1 Star
 */
export const MOCK_PROGRESS_ONE_STAR: LevelProgress = {
  levelId: 'level-01',
  completed: true,
  starsEarned: 1,
  bestScore: 1000,
  bestWave: 10,
  timesPlayed: 3,
  lastPlayedAt: Date.now() - 86400000, // 1 day ago
};

/**
 * Mock Level Progress - 2 Stars
 */
export const MOCK_PROGRESS_TWO_STARS: LevelProgress = {
  levelId: 'level-03',
  completed: true,
  starsEarned: 2,
  bestScore: 2500,
  bestWave: 10,
  timesPlayed: 5,
  lastPlayedAt: Date.now() - 3600000, // 1 hour ago
};

/**
 * Mock Level Progress - 3 Stars (Perfect)
 */
export const MOCK_PROGRESS_THREE_STARS: LevelProgress = {
  levelId: 'level-01',
  completed: true,
  starsEarned: 3,
  bestScore: 5000,
  bestWave: 10,
  timesPlayed: 10,
  lastPlayedAt: Date.now() - 600000, // 10 minutes ago
};
