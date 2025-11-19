/**
 * Achievements Service
 * Created: 2025-11-19
 *
 * Handles achievement tracking, progress updates, and unlocks
 */

import { supabase } from './supabase';
import { analytics } from './analytics';
import {
  Achievement,
  AchievementProgress,
  AchievementWithProgress,
  AchievementUnlocked,
} from '@/types/gamification';

// ============================================
// GET ACHIEVEMENTS
// ============================================

/**
 * Get all available achievements
 */
export async function getAllAchievements(): Promise<{
  success: boolean;
  achievements?: Achievement[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('[Achievements] Get all error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, achievements: data || [] };
  } catch (error) {
    console.error('[Achievements] Get all exception:', error);
    return { success: false, error: 'Failed to fetch achievements' };
  }
}

/**
 * Get user's achievement progress
 */
export async function getUserAchievementProgress(
  userId: string
): Promise<{
  success: boolean;
  progress?: AchievementProgress[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('achievement_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('[Achievements] Get progress error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, progress: data || [] };
  } catch (error) {
    console.error('[Achievements] Get progress exception:', error);
    return { success: false, error: 'Failed to fetch achievement progress' };
  }
}

/**
 * Get achievements with user's progress
 */
export async function getAchievementsWithProgress(
  userId: string
): Promise<{
  success: boolean;
  achievements?: AchievementWithProgress[];
  error?: string;
}> {
  try {
    // Get all achievements
    const { achievements } = await getAllAchievements();
    if (!achievements) {
      return { success: false, error: 'No achievements found' };
    }

    // Get user's progress
    const { progress } = await getUserAchievementProgress(userId);
    const progressMap = new Map(
      (progress || []).map(p => [p.achievement_id, p])
    );

    // Combine
    const combined: AchievementWithProgress[] = achievements.map(achievement => ({
      ...achievement,
      progress: progressMap.get(achievement.id) || null,
    }));

    return { success: true, achievements: combined };
  } catch (error) {
    console.error('[Achievements] Get with progress exception:', error);
    return { success: false, error: 'Failed to fetch achievements with progress' };
  }
}

// ============================================
// UPDATE PROGRESS
// ============================================

/**
 * Update achievement progress
 * Automatically unlocks if requirement met
 */
export async function updateAchievementProgress(
  userId: string,
  achievementId: string,
  progressValue: number
): Promise<{
  success: boolean;
  unlocked?: boolean;
  achievement?: AchievementUnlocked;
  error?: string;
}> {
  try {
    // Get achievement definition
    const { data: achievement, error: achError } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single();

    if (achError || !achievement) {
      console.error('[Achievements] Achievement not found:', achievementId);
      return { success: false, error: 'Achievement not found' };
    }

    // Get current progress
    const { data: currentProgress } = await supabase
      .from('achievement_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    // Don't update if already completed
    if (currentProgress && currentProgress.completed) {
      return { success: true, unlocked: false };
    }

    // Check if this update completes the achievement
    const isCompleted = progressValue >= achievement.requirement_value;

    // Upsert progress
    const { data: updatedProgress, error } = await supabase
      .from('achievement_progress')
      .upsert({
        user_id: userId,
        achievement_id: achievementId,
        progress: progressValue,
        completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      console.error('[Achievements] Update progress error:', error);
      return { success: false, error: error.message };
    }

    // Track unlock
    if (isCompleted && !currentProgress?.completed) {
      analytics.track('achievement_unlocked', {
        user_id: userId,
        achievement_id: achievementId,
        achievement_name: achievement.name,
        category: achievement.category,
      });

      return {
        success: true,
        unlocked: true,
        achievement: {
          achievement,
          progress: updatedProgress,
        },
      };
    }

    return { success: true, unlocked: false };
  } catch (error) {
    console.error('[Achievements] Update progress exception:', error);
    return { success: false, error: 'Failed to update achievement progress' };
  }
}

/**
 * Increment achievement progress (helper)
 * Useful for kill counts, etc.
 */
export async function incrementAchievementProgress(
  userId: string,
  achievementId: string,
  incrementBy: number = 1
): Promise<{
  success: boolean;
  unlocked?: boolean;
  achievement?: AchievementUnlocked;
  error?: string;
}> {
  try {
    // Get current progress
    const { data: currentProgress } = await supabase
      .from('achievement_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    const currentValue = currentProgress?.progress || 0;
    const newValue = currentValue + incrementBy;

    return updateAchievementProgress(userId, achievementId, newValue);
  } catch (error) {
    console.error('[Achievements] Increment progress exception:', error);
    return { success: false, error: 'Failed to increment achievement progress' };
  }
}

// ============================================
// ACHIEVEMENT TRACKING HELPERS
// ============================================

/**
 * Track zombie kills for achievements
 */
export async function trackZombieKills(
  userId: string,
  zombiesKilled: number
): Promise<void> {
  // Update kill count achievements
  const killAchievements = [
    'first_blood', // 1 kill
    'zombie_slayer_100', // 100 kills
    'zombie_slayer_1000', // 1000 kills
  ];

  for (const achId of killAchievements) {
    await incrementAchievementProgress(userId, achId, zombiesKilled);
  }
}

/**
 * Track level completion for achievements
 */
export async function trackLevelCompletion(
  userId: string,
  levelId: string,
  stars: number,
  hullIntegrity: number,
  completionTime: number
): Promise<void> {
  // First victory
  await incrementAchievementProgress(userId, 'first_victory', 1);

  // Perfect run (100% hull)
  if (hullIntegrity === 100) {
    await incrementAchievementProgress(userId, 'perfect_run', 1);
  }

  // Speed demon (< 5 min = 300 seconds)
  if (completionTime < 300) {
    await incrementAchievementProgress(userId, 'speed_demon', 1);
  }

  // Three star achievements
  if (stars === 3) {
    await incrementAchievementProgress(userId, 'three_star_master', 1);
  }
}

/**
 * Check for "completionist" achievement (all 3 stars)
 */
export async function checkCompletionistAchievement(
  userId: string,
  totalLevels: number
): Promise<void> {
  // Get user's level progress from campaign context
  // Count how many levels have 3 stars
  // If all levels have 3 stars, unlock completionist

  // This should be called from CampaignContext after level completion
  // For now, just a placeholder
}

// ============================================
// STATISTICS
// ============================================

/**
 * Get achievement statistics for user
 */
export async function getAchievementStats(
  userId: string
): Promise<{
  total: number;
  completed: number;
  inProgress: number;
  locked: number;
  completionPercentage: number;
}> {
  const { achievements } = await getAchievementsWithProgress(userId);

  if (!achievements) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      locked: 0,
      completionPercentage: 0,
    };
  }

  const total = achievements.length;
  const completed = achievements.filter(a => a.progress?.completed).length;
  const inProgress = achievements.filter(
    a => a.progress && !a.progress.completed && a.progress.progress > 0
  ).length;
  const locked = total - completed - inProgress;

  return {
    total,
    completed,
    inProgress,
    locked,
    completionPercentage: total > 0 ? (completed / total) * 100 : 0,
  };
}

/**
 * Get recently unlocked achievements
 */
export async function getRecentlyUnlocked(
  userId: string,
  limit: number = 5
): Promise<{
  success: boolean;
  achievements?: AchievementUnlocked[];
  error?: string;
}> {
  try {
    const { data: progress, error: progressError } = await supabase
      .from('achievement_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (progressError) {
      console.error('[Achievements] Get recent error:', progressError);
      return { success: false, error: progressError.message };
    }

    if (!progress || progress.length === 0) {
      return { success: true, achievements: [] };
    }

    // Get achievement definitions
    const achievementIds = progress.map(p => p.achievement_id);
    const { data: achievements, error: achError } = await supabase
      .from('achievements')
      .select('*')
      .in('id', achievementIds);

    if (achError) {
      console.error('[Achievements] Get definitions error:', achError);
      return { success: false, error: achError.message };
    }

    // Combine
    const combined: AchievementUnlocked[] = progress.map(p => ({
      achievement: achievements?.find(a => a.id === p.achievement_id)!,
      progress: p,
    }));

    return { success: true, achievements: combined };
  } catch (error) {
    console.error('[Achievements] Get recent exception:', error);
    return { success: false, error: 'Failed to fetch recent achievements' };
  }
}
