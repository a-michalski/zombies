/**
 * Leaderboard and Scoring Types
 * Created: 2025-11-19
 */

// ============================================
// LEADERBOARD ENTRY
// ============================================

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  level_id: string;
  score: number;
  stars: 1 | 2 | 3;
  completion_time: number; // seconds
  zombies_killed: number;
  hull_integrity?: number; // 0-100

  // Anti-cheat
  gameplay_hash?: string;
  client_version?: string;
  flagged: boolean;

  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntryWithProfile extends LeaderboardEntry {
  profile: {
    nickname: string;
    nationality: string;
    avatar_url?: string;
  };
}

// ============================================
// SCORE SUBMISSION
// ============================================

export interface ScoreSubmission {
  level_id: string;
  score: number;
  stars: 1 | 2 | 3;
  completion_time: number;
  zombies_killed: number;
  hull_integrity: number;
  gameplay_hash?: string;
  client_version: string;
}

// ============================================
// LEADERBOARD FILTERS
// ============================================

export type LeaderboardScope = 'global' | 'regional' | 'friends';
export type LeaderboardTimeframe = 'all_time' | 'this_week' | 'this_month';

export interface LeaderboardFilter {
  scope: LeaderboardScope;
  timeframe: LeaderboardTimeframe;
  level_id?: string; // If specified, show only this level. If null, aggregate all levels
  nationality?: string; // For regional scope
  limit?: number;
  offset?: number;
}

// ============================================
// GLOBAL LEADERBOARD
// ============================================

export interface GlobalLeaderboardEntry {
  user_id: string;
  nickname: string;
  nationality: string;
  avatar_url?: string;
  total_score: number;
  total_stars: number;
  levels_completed: number;
  last_activity: string;
}

// ============================================
// PLAYER STATS
// ============================================

export interface PlayerStats {
  id: string;
  user_id: string;
  total_games: number;
  total_zombies_killed: number;
  total_stars: number;
  total_playtime: number; // seconds
  best_wave: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateStatsData {
  total_games?: number;
  total_zombies_killed?: number;
  total_stars?: number;
  total_playtime?: number;
  best_wave?: number;
}

// ============================================
// SUSPICIOUS SCORE
// ============================================

export type SuspiciousReason =
  | 'impossible_time'
  | 'impossible_score'
  | 'hash_mismatch'
  | 'impossible_zombies'
  | 'rate_limit_exceeded';

export interface SuspiciousScore {
  id: string;
  user_id: string;
  level_id: string;
  score: number;
  reason: SuspiciousReason;
  metadata?: Record<string, any>;
  auto_banned: boolean;
  reviewed: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

// ============================================
// RANK INFORMATION
// ============================================

export interface UserRank {
  rank: number;
  total_players: number;
  percentile: number; // 0-100
  score: number;
}

export interface LeaderboardPosition {
  global?: UserRank;
  regional?: UserRank;
  friends?: UserRank;
}
