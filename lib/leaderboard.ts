/**
 * Leaderboard Service
 * Created: 2025-11-19
 *
 * Handles leaderboard queries, score submissions, and real-time updates
 */

import { supabase } from './supabase';
import { analytics } from './analytics';
import {
  LeaderboardEntry,
  LeaderboardEntryWithProfile,
  ScoreSubmission,
  LeaderboardFilter,
  GlobalLeaderboardEntry,
  PlayerStats,
  UpdateStatsData,
  UserRank,
  LeaderboardPosition,
} from '@/types/leaderboard';

// Get app version for anti-cheat
const APP_VERSION = process.env.EXPO_PUBLIC_CLIENT_VERSION || '2.0.0';

// ============================================
// SUBMIT SCORE
// ============================================

/**
 * Submit a score to the leaderboard
 * Upserts - keeps best score per user per level
 */
export async function submitScore(
  userId: string,
  submission: ScoreSubmission
): Promise<{ success: boolean; entry?: LeaderboardEntry; error?: string }> {
  try {
    analytics.track('level_completed', {
      level_id: submission.level_id,
      score: submission.score,
      stars: submission.stars,
      completion_time: submission.completion_time,
      zombies_killed: submission.zombies_killed,
    });

    // Check if user already has a score for this level
    const { data: existing } = await supabase
      .from('leaderboards')
      .select('*')
      .eq('user_id', userId)
      .eq('level_id', submission.level_id)
      .single();

    // Only update if new score is better
    if (existing && existing.score >= submission.score) {
      console.log('[Leaderboard] Existing score is better, not updating');
      return { success: true, entry: existing };
    }

    // Upsert score
    const { data, error } = await supabase
      .from('leaderboards')
      .upsert({
        user_id: userId,
        level_id: submission.level_id,
        score: submission.score,
        stars: submission.stars,
        completion_time: submission.completion_time,
        zombies_killed: submission.zombies_killed,
        hull_integrity: submission.hull_integrity,
        gameplay_hash: submission.gameplay_hash,
        client_version: submission.client_version || APP_VERSION,
        flagged: false,
      })
      .select()
      .single();

    if (error) {
      console.error('[Leaderboard] Submit error:', error);
      return { success: false, error: error.message };
    }

    // Update player stats
    await updatePlayerStats(userId, {
      total_games: 1,
      total_zombies_killed: submission.zombies_killed,
      total_stars: submission.stars,
    });

    return { success: true, entry: data };
  } catch (error) {
    console.error('[Leaderboard] Submit exception:', error);
    return { success: false, error: 'Failed to submit score' };
  }
}

// ============================================
// GET LEADERBOARD
// ============================================

/**
 * Get leaderboard entries with filters
 */
export async function getLeaderboard(
  filter: LeaderboardFilter
): Promise<{ success: boolean; entries?: LeaderboardEntryWithProfile[]; error?: string }> {
  try {
    let query = supabase
      .from('leaderboards')
      .select(`
        *,
        profile:profiles(nickname, nationality, avatar_url)
      `)
      .eq('flagged', false);

    // Filter by level (if specified)
    if (filter.level_id) {
      query = query.eq('level_id', filter.level_id);
    }

    // Filter by timeframe
    if (filter.timeframe === 'this_week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte('created_at', weekAgo.toISOString());
    } else if (filter.timeframe === 'this_month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.gte('created_at', monthAgo.toISOString());
    }

    // Filter by nationality (regional leaderboard)
    if (filter.scope === 'regional' && filter.nationality) {
      query = query.eq('profiles.nationality', filter.nationality);
    }

    // Sort by score descending
    query = query.order('score', { ascending: false });

    // Pagination
    const limit = filter.limit || 100;
    const offset = filter.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('[Leaderboard] Get error:', error);
      return { success: false, error: error.message };
    }

    // Transform data to include profile inline
    const entries: LeaderboardEntryWithProfile[] = (data || []).map((entry: any) => ({
      ...entry,
      profile: entry.profile,
    }));

    analytics.track('leaderboard_viewed', {
      scope: filter.scope,
      timeframe: filter.timeframe,
      level_id: filter.level_id,
      count: entries.length,
    });

    return { success: true, entries };
  } catch (error) {
    console.error('[Leaderboard] Get exception:', error);
    return { success: false, error: 'Failed to fetch leaderboard' };
  }
}

// ============================================
// GET GLOBAL LEADERBOARD
// ============================================

/**
 * Get global leaderboard (aggregated across all levels)
 * Uses the global_leaderboard view
 */
export async function getGlobalLeaderboard(
  limit = 100,
  offset = 0
): Promise<{ success: boolean; entries?: GlobalLeaderboardEntry[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('global_leaderboard')
      .select('*')
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[Leaderboard] Global get error:', error);
      return { success: false, error: error.message };
    }

    analytics.track('leaderboard_viewed', {
      scope: 'global',
      count: data?.length || 0,
    });

    return { success: true, entries: data || [] };
  } catch (error) {
    console.error('[Leaderboard] Global get exception:', error);
    return { success: false, error: 'Failed to fetch global leaderboard' };
  }
}

// ============================================
// GET REGIONAL LEADERBOARD
// ============================================

/**
 * Get regional leaderboard using the database function
 */
export async function getRegionalLeaderboard(
  countryCode: string,
  limit = 100
): Promise<{ success: boolean; entries?: any[]; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('get_regional_leaderboard', {
      country_code: countryCode,
    });

    if (error) {
      console.error('[Leaderboard] Regional get error:', error);
      return { success: false, error: error.message };
    }

    const entries = (data || []).slice(0, limit);

    analytics.track('leaderboard_viewed', {
      scope: 'regional',
      nationality: countryCode,
      count: entries.length,
    });

    return { success: true, entries };
  } catch (error) {
    console.error('[Leaderboard] Regional get exception:', error);
    return { success: false, error: 'Failed to fetch regional leaderboard' };
  }
}

// ============================================
// GET USER RANK
// ============================================

/**
 * Get user's rank for a specific level
 */
export async function getUserRank(
  userId: string,
  levelId: string
): Promise<{ success: boolean; rank?: UserRank; error?: string }> {
  try {
    // Get all scores for this level, sorted by score
    const { data: allScores, error } = await supabase
      .from('leaderboards')
      .select('user_id, score')
      .eq('level_id', levelId)
      .eq('flagged', false)
      .order('score', { ascending: false });

    if (error) {
      console.error('[Leaderboard] Get rank error:', error);
      return { success: false, error: error.message };
    }

    if (!allScores || allScores.length === 0) {
      return { success: false, error: 'No scores found' };
    }

    // Find user's position
    const userIndex = allScores.findIndex(entry => entry.user_id === userId);

    if (userIndex === -1) {
      return { success: false, error: 'User has no score for this level' };
    }

    const rank: UserRank = {
      rank: userIndex + 1,
      total_players: allScores.length,
      percentile: ((allScores.length - userIndex) / allScores.length) * 100,
      score: allScores[userIndex].score,
    };

    return { success: true, rank };
  } catch (error) {
    console.error('[Leaderboard] Get rank exception:', error);
    return { success: false, error: 'Failed to get user rank' };
  }
}

/**
 * Get user's position across all leaderboard scopes
 */
export async function getUserLeaderboardPosition(
  userId: string,
  levelId?: string
): Promise<{ success: boolean; position?: LeaderboardPosition; error?: string }> {
  try {
    const position: LeaderboardPosition = {};

    // Get global rank (if no level specified, use aggregate)
    if (!levelId) {
      // Get from global_leaderboard view
      const { data: globalData } = await supabase
        .from('global_leaderboard')
        .select('*')
        .order('total_score', { ascending: false });

      if (globalData) {
        const userIndex = globalData.findIndex(entry => entry.id === userId);
        if (userIndex !== -1) {
          position.global = {
            rank: userIndex + 1,
            total_players: globalData.length,
            percentile: ((globalData.length - userIndex) / globalData.length) * 100,
            score: globalData[userIndex].total_score,
          };
        }
      }
    } else {
      // Get level-specific rank
      const { rank } = await getUserRank(userId, levelId);
      if (rank) {
        position.global = rank;
      }
    }

    // TODO: Regional and friends ranks (Phase 2)

    return { success: true, position };
  } catch (error) {
    console.error('[Leaderboard] Get position exception:', error);
    return { success: false, error: 'Failed to get leaderboard position' };
  }
}

// ============================================
// PLAYER STATS
// ============================================

/**
 * Get player statistics
 */
export async function getPlayerStats(
  userId: string
): Promise<{ success: boolean; stats?: PlayerStats; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // PGRST116 = not found (stats not created yet)
      if (error.code === 'PGRST116') {
        return { success: true, stats: undefined };
      }
      console.error('[Leaderboard] Get stats error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, stats: data };
  } catch (error) {
    console.error('[Leaderboard] Get stats exception:', error);
    return { success: false, error: 'Failed to fetch player stats' };
  }
}

/**
 * Update player statistics (incremental)
 */
export async function updatePlayerStats(
  userId: string,
  updates: UpdateStatsData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current stats
    const { stats: currentStats } = await getPlayerStats(userId);

    if (!currentStats) {
      console.warn('[Leaderboard] No stats found for user, creating...');
      // Stats should be auto-created by trigger, but just in case
      return { success: true };
    }

    // Increment stats
    const newStats = {
      total_games: currentStats.total_games + (updates.total_games || 0),
      total_zombies_killed: currentStats.total_zombies_killed + (updates.total_zombies_killed || 0),
      total_stars: currentStats.total_stars + (updates.total_stars || 0),
      total_playtime: currentStats.total_playtime + (updates.total_playtime || 0),
      best_wave: Math.max(currentStats.best_wave, updates.best_wave || 0),
    };

    const { error } = await supabase
      .from('player_stats')
      .update(newStats)
      .eq('user_id', userId);

    if (error) {
      console.error('[Leaderboard] Update stats error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('[Leaderboard] Update stats exception:', error);
    return { success: false, error: 'Failed to update player stats' };
  }
}

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================

/**
 * Subscribe to real-time leaderboard updates for a specific level
 * Returns unsubscribe function
 */
export function subscribeToLeaderboard(
  levelId: string,
  callback: (entry: LeaderboardEntry) => void
): () => void {
  const channel = supabase
    .channel(`leaderboard:${levelId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'leaderboards',
        filter: `level_id=eq.${levelId}`,
      },
      (payload) => {
        console.log('[Leaderboard] Real-time update:', payload);
        if (payload.new) {
          callback(payload.new as LeaderboardEntry);
        }
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}

// ============================================
// FRIEND LEADERBOARD (Phase 2)
// ============================================

/**
 * Get leaderboard filtered by friends
 * TODO: Implement after friends system
 */
export async function getFriendLeaderboard(
  userId: string,
  levelId?: string
): Promise<{ success: boolean; entries?: LeaderboardEntryWithProfile[]; error?: string }> {
  // Placeholder for Phase 2
  return {
    success: false,
    error: 'Friend leaderboard not yet implemented',
  };
}
