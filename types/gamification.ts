/**
 * Gamification Types - Achievements, Daily Rewards, etc.
 * Created: 2025-11-19
 */

// ============================================
// ACHIEVEMENTS
// ============================================

export type AchievementCategory = 'combat' | 'progression' | 'special';

export type AchievementRequirementType =
  | 'kill_count'
  | 'level_complete'
  | 'perfect_health'
  | 'speed_run'
  | 'three_stars'
  | 'all_three_stars';

export type RewardType = 'scrap' | 'skin' | 'flag' | 'badge';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  requirement_type: AchievementRequirementType;
  requirement_value: number;
  reward_type?: RewardType;
  reward_value?: Record<string, any>;
  icon_url?: string;
  created_at: string;
}

export interface AchievementProgress {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AchievementWithProgress extends Achievement {
  progress: AchievementProgress | null;
}

export interface AchievementUnlocked {
  achievement: Achievement;
  progress: AchievementProgress;
}

// ============================================
// DAILY REWARDS
// ============================================

export interface DailyRewards {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_claim_date?: string; // YYYY-MM-DD
  total_rewards_claimed: number;
  created_at: string;
  updated_at: string;
}

export interface DailyRewardDefinition {
  day: number;
  reward_type: 'scrap' | 'gems' | 'item';
  reward_amount?: number;
  reward_item_id?: string;
  special?: boolean; // Highlight special rewards (e.g., day 7)
}

export const DAILY_REWARD_SCHEDULE: DailyRewardDefinition[] = [
  { day: 1, reward_type: 'scrap', reward_amount: 100 },
  { day: 2, reward_type: 'scrap', reward_amount: 200 },
  { day: 3, reward_type: 'scrap', reward_amount: 500, special: true },
  { day: 4, reward_type: 'scrap', reward_amount: 300 },
  { day: 5, reward_type: 'scrap', reward_amount: 400 },
  { day: 6, reward_type: 'scrap', reward_amount: 600 },
  { day: 7, reward_type: 'scrap', reward_amount: 1000, special: true }, // Week reward
  // Cycle repeats
];

export interface ClaimDailyRewardResult {
  success: boolean;
  reward?: DailyRewardDefinition;
  new_streak: number;
  streak_broken?: boolean;
  error?: string;
}

// ============================================
// FRIENDS SYSTEM (Phase 2)
// ============================================

export type FriendStatus = 'pending' | 'accepted' | 'blocked';

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendStatus;
  created_at: string;
  accepted_at?: string;
}

export interface FriendWithProfile extends Friendship {
  friend_profile: {
    id: string;
    nickname: string;
    nationality: string;
    avatar_url?: string;
  };
}

export interface FriendRequest {
  id: string;
  from_user: {
    id: string;
    nickname: string;
    nationality: string;
    avatar_url?: string;
  };
  created_at: string;
}

// ============================================
// CHALLENGES (Phase 2)
// ============================================

export type ChallengeStatus = 'pending' | 'completed' | 'expired';

export interface Challenge {
  id: string;
  challenger_id: string;
  challenged_id: string;
  level_id: string;
  challenger_score: number;
  status: ChallengeStatus;
  expires_at: string;
  created_at: string;
}

export interface ChallengeWithProfiles extends Challenge {
  challenger_profile: {
    nickname: string;
    nationality: string;
    avatar_url?: string;
  };
  challenged_profile: {
    nickname: string;
    nationality: string;
    avatar_url?: string;
  };
}

// ============================================
// USER BANS
// ============================================

export interface UserBan {
  id: string;
  user_id: string;
  reason: string;
  banned_by?: string;
  banned_until?: string;
  permanent: boolean;
  active: boolean;
  created_at: string;
  lifted_at?: string;
}

export function isUserBanned(bans: UserBan[]): boolean {
  const now = new Date();
  return bans.some(ban => {
    if (!ban.active) return false;
    if (ban.permanent) return true;
    if (ban.banned_until && new Date(ban.banned_until) > now) return true;
    return false;
  });
}
