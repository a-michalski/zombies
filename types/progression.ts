/**
 * Player progression and save data types
 *
 * Recent changes (2025-11-16):
 * - Created comprehensive progress tracking system
 * - Supports per-level statistics and star ratings
 * - Integrates with existing GameStats in utils/storage.ts
 *
 * Next agent: Will be used by CampaignContext for state management
 */

/**
 * Progress tracking for a single level
 * Stores best performance, completion status, and statistics
 */
export interface LevelProgress {
  /** Level ID reference (e.g., 'level-01') */
  levelId: string;

  /** Whether level has been completed at least once */
  completed: boolean;

  /** Stars earned (0-3, 0 = failed/not attempted) */
  starsEarned: number;

  /** Best score/performance achieved on this level */
  bestScore: number;

  /** Highest wave reached (useful for incomplete levels) */
  bestWave: number;

  /** Number of times this level was attempted */
  timesPlayed: number;

  /** Timestamp of last play (null if never played) */
  lastPlayedAt: number | null;
}

/**
 * Overall player progression data
 * Tracks campaign progress, unlocked levels, and cumulative stats
 */
export interface PlayerProgress {
  /** Current active campaign ID */
  currentCampaignId: string;

  /** Highest level number unlocked (1-10) */
  currentLevel: number;

  /** Array of unlocked level IDs for quick lookup */
  unlockedLevels: string[];

  /** Progress data per level, keyed by level ID */
  levelProgress: Record<string, LevelProgress>;

  /** Total stars earned across all completed levels */
  totalStars: number;

  /** Total scrap earned (lifetime, includes spent scrap) */
  totalScrapEarned: number;
}

/**
 * Complete save data for campaign mode
 * Top-level structure for persistence
 */
export interface CampaignSaveData {
  /** Player progression data */
  playerProgress: PlayerProgress;

  /** Version number for migration compatibility */
  version: number;

  /** Last updated timestamp (ms since epoch) */
  lastUpdated: number;
}
