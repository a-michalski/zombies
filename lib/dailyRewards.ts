/**
 * Daily Rewards Service
 * Created: 2025-11-19
 *
 * Handles daily login rewards, streak tracking, and reward claims
 */

import { supabase } from './supabase';
import { analytics } from './analytics';
import {
  DailyRewards,
  DailyRewardDefinition,
  ClaimDailyRewardResult,
  DAILY_REWARD_SCHEDULE,
} from '@/types/gamification';

// ============================================
// GET DAILY REWARDS STATUS
// ============================================

/**
 * Get user's daily rewards status
 */
export async function getDailyRewards(
  userId: string
): Promise<{ success: boolean; rewards?: DailyRewards; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('daily_rewards')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // PGRST116 = not found (should be auto-created by trigger)
      if (error.code === 'PGRST116') {
        console.warn('[DailyRewards] No rewards found, should be auto-created');
        return { success: true, rewards: undefined };
      }
      console.error('[DailyRewards] Get error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, rewards: data };
  } catch (error) {
    console.error('[DailyRewards] Get exception:', error);
    return { success: false, error: 'Failed to fetch daily rewards' };
  }
}

// ============================================
// CHECK IF REWARD IS AVAILABLE
// ============================================

/**
 * Check if daily reward can be claimed today
 */
export async function canClaimDailyReward(
  userId: string
): Promise<{ canClaim: boolean; streak: number; nextReward?: DailyRewardDefinition }> {
  const { rewards } = await getDailyRewards(userId);

  if (!rewards) {
    // New user - can claim day 1
    return {
      canClaim: true,
      streak: 0,
      nextReward: DAILY_REWARD_SCHEDULE[0],
    };
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Already claimed today?
  if (rewards.last_claim_date === today) {
    return {
      canClaim: false,
      streak: rewards.current_streak,
    };
  }

  // Calculate which day in the cycle
  const dayIndex = rewards.current_streak % DAILY_REWARD_SCHEDULE.length;
  const nextReward = DAILY_REWARD_SCHEDULE[dayIndex];

  return {
    canClaim: true,
    streak: rewards.current_streak,
    nextReward,
  };
}

// ============================================
// CLAIM DAILY REWARD
// ============================================

/**
 * Claim today's daily reward
 */
export async function claimDailyReward(
  userId: string
): Promise<ClaimDailyRewardResult> {
  try {
    analytics.track('daily_reward_claimed', { user_id: userId });

    // Get current rewards status
    const { rewards } = await getDailyRewards(userId);

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Check if already claimed today
    if (rewards && rewards.last_claim_date === today) {
      return {
        success: false,
        error: 'Already claimed today',
      };
    }

    // Calculate new streak
    let newStreak = 1;
    let streakBroken = false;

    if (rewards) {
      if (rewards.last_claim_date === yesterday) {
        // Consecutive day - increment streak
        newStreak = rewards.current_streak + 1;
      } else if (rewards.last_claim_date && rewards.last_claim_date < yesterday) {
        // Streak broken - reset to 1
        newStreak = 1;
        streakBroken = true;
      }
    }

    // Get reward for current day (cycling through schedule)
    const dayIndex = (newStreak - 1) % DAILY_REWARD_SCHEDULE.length;
    const reward = DAILY_REWARD_SCHEDULE[dayIndex];

    // Update database
    const { data, error } = await supabase
      .from('daily_rewards')
      .upsert({
        user_id: userId,
        current_streak: newStreak,
        longest_streak: rewards
          ? Math.max(rewards.longest_streak, newStreak)
          : newStreak,
        last_claim_date: today,
        total_rewards_claimed: rewards ? rewards.total_rewards_claimed + 1 : 1,
      })
      .select()
      .single();

    if (error) {
      console.error('[DailyRewards] Claim error:', error);
      analytics.track('daily_reward_claim_failed', {
        error: error.message,
      });
      return {
        success: false,
        error: error.message,
      };
    }

    // TODO: Actually grant the reward (add scrap to campaign progress)
    // For now, we just track it

    analytics.track('daily_reward_claimed', {
      user_id: userId,
      streak: newStreak,
      reward_type: reward.reward_type,
      reward_amount: reward.reward_amount,
      day: dayIndex + 1,
      streak_broken: streakBroken,
    });

    return {
      success: true,
      reward,
      new_streak: newStreak,
      streak_broken: streakBroken,
    };
  } catch (error) {
    console.error('[DailyRewards] Claim exception:', error);
    analytics.track('daily_reward_claim_failed', {
      error: 'exception',
    });
    return {
      success: false,
      error: 'Failed to claim daily reward',
    };
  }
}

// ============================================
// GET REWARD SCHEDULE
// ============================================

/**
 * Get the full reward schedule
 * Useful for displaying upcoming rewards
 */
export function getRewardSchedule(): DailyRewardDefinition[] {
  return DAILY_REWARD_SCHEDULE;
}

/**
 * Get reward for specific day
 */
export function getRewardForDay(day: number): DailyRewardDefinition {
  const index = (day - 1) % DAILY_REWARD_SCHEDULE.length;
  return DAILY_REWARD_SCHEDULE[index];
}

// ============================================
// STREAK HELPERS
// ============================================

/**
 * Calculate hours until streak expires
 */
export function getHoursUntilStreakExpires(lastClaimDate: string | null): number {
  if (!lastClaimDate) return 0;

  const lastClaim = new Date(lastClaimDate + 'T00:00:00');
  const tomorrow = new Date(lastClaim);
  tomorrow.setDate(tomorrow.getDate() + 2); // Streak expires at end of tomorrow
  tomorrow.setHours(23, 59, 59, 999);

  const now = new Date();
  const msUntilExpire = tomorrow.getTime() - now.getTime();

  return Math.max(0, Math.floor(msUntilExpire / (1000 * 60 * 60)));
}

/**
 * Check if streak is in danger (< 6 hours until expire)
 */
export function isStreakInDanger(lastClaimDate: string | null): boolean {
  const hours = getHoursUntilStreakExpires(lastClaimDate);
  return hours > 0 && hours < 6;
}

// ============================================
// ANALYTICS HELPERS
// ============================================

/**
 * Track daily reward shown
 */
export function trackDailyRewardShown(userId: string, canClaim: boolean): void {
  analytics.track('daily_reward_shown', {
    user_id: userId,
    can_claim: canClaim,
  });
}
