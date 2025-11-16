/**
 * Level and campaign configuration types
 *
 * Recent changes (2025-11-16):
 * - Created level system with difficulty ratings
 * - Added star rating and unlock requirements
 * - Integrated with MapConfig for dynamic level data
 *
 * Next agent: Agent B will create 10 LevelConfig instances
 */

import { MapConfig } from './map';

/** Difficulty rating for a level */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Star rating requirements for a level
 * Players earn 1-3 stars based on performance
 */
export interface StarRequirements {
  /** Requirements for earning 1 star (always: complete the level) */
  oneStar: {
    type: 'complete';
  };

  /**
   * Requirements for earning 2 stars
   * Can be based on hull remaining or time limit
   */
  twoStars: {
    type: 'hull_remaining';
    /** Minimum hull percentage to maintain (e.g., 50 = keep 50% hull) */
    minHullPercent: number;
  } | {
    type: 'time_limit';
    /** Maximum seconds allowed to complete the level */
    maxSeconds: number;
  };

  /**
   * Requirements for earning 3 stars
   * Challenging objectives like perfect runs or tower limits
   */
  threeStars: {
    type: 'hull_remaining';
    /** Minimum hull percentage to maintain (e.g., 80 = keep 80% hull) */
    minHullPercent: number;
  } | {
    type: 'max_towers';
    /** Maximum number of towers allowed */
    maxTowers: number;
  } | {
    type: 'perfect';
    /** Perfect completion - no hull damage taken */
    description: 'No hull damage';
  };
}

/**
 * Requirements to unlock a level
 * Players must complete previous levels to progress
 */
export interface UnlockRequirement {
  /** Previous level ID that must be completed (null for first level) */
  previousLevelId: string | null;

  /** Minimum stars needed from previous level (0-3) */
  minStarsRequired: number;
}

/**
 * Rewards earned for completing a level
 * Incentivizes replaying levels for better performance
 */
export interface LevelRewards {
  /** Scrap bonus awarded on first-time completion */
  firstCompletionBonus: number;

  /** Scrap earned per star (awarded each time stars improve) */
  scrapPerStar: number;
}

/**
 * Complete configuration for a single level
 * Contains all data needed for gameplay, progression, and rewards
 */
export interface LevelConfig {
  /** Unique level identifier (e.g., 'level-01') */
  id: string;

  /** Level number in campaign sequence (1-10) */
  number: number;

  /** Display name shown to player (e.g., 'First Contact') */
  name: string;

  /** Flavor text description for level select screen */
  description: string;

  /** Difficulty rating (easy, medium, hard) */
  difficulty: Difficulty;

  /** Map configuration (waypoints, spots, waves, resources) */
  mapConfig: MapConfig;

  /** Star rating requirements (1-3 stars) */
  starRequirements: StarRequirements;

  /** Unlock requirements (previous level, stars needed) */
  unlockRequirement: UnlockRequirement;

  /** Rewards for completion (scrap bonuses) */
  rewards: LevelRewards;

  /** Optional: Background image specific to this level */
  backgroundImage?: string;
}

/**
 * Campaign configuration containing multiple levels
 * Supports future expansion to multiple campaigns
 */
export interface CampaignConfig {
  /** Unique campaign identifier */
  id: string;

  /** Campaign display name */
  name: string;

  /** Campaign description */
  description: string;

  /** Array of levels in this campaign (ordered) */
  levels: LevelConfig[];
}
