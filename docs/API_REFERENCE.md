# Zombie Fleet - API Reference

**Version:** 2.0 MVP
**Last Updated:** November 19, 2025
**Audience:** Developers

## Table of Contents

1. [Overview](#overview)
2. [Authentication Services](#authentication-services)
3. [Profile Services](#profile-services)
4. [Leaderboard Services](#leaderboard-services)
5. [Achievement Services](#achievement-services)
6. [Daily Rewards Services](#daily-rewards-services)
7. [Cloud Sync Services](#cloud-sync-services)
8. [Anti-Cheat Services](#anti-cheat-services)
9. [Analytics Services](#analytics-services)
10. [Type Definitions](#type-definitions)
11. [Error Handling](#error-handling)

---

## Overview

All services are located in `/lib/` directory and use Supabase as the backend. Services follow a consistent pattern:

**Response Format:**
```typescript
{
  success: boolean;
  data?: T;
  error?: string;
}
```

**Import Pattern:**
```typescript
import { functionName } from '@/lib/serviceName';
```

---

## Authentication Services

**File:** `/contexts/AuthContext.tsx`

### useAuth()

React hook providing authentication state and methods.

**Returns:**
```typescript
{
  // State
  isAuthenticated: boolean;
  isGuest: boolean;
  user: User | null;
  profile: UserProfile | null;
  status: 'loading' | 'authenticated' | 'guest' | 'unauthenticated';

  // Methods
  signIn: (credentials: SignInCredentials) => Promise<AuthResult>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  convertGuestToAccount: (credentials: SignUpCredentials) => Promise<AuthResult>;
}
```

**Example:**
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { signIn, isAuthenticated, profile } = useAuth();

  const handleLogin = async () => {
    const result = await signIn({
      email: 'user@example.com',
      password: 'password123'
    });

    if (result.success) {
      console.log('Logged in:', result.user);
    } else {
      console.error('Login failed:', result.error);
    }
  };

  return (
    <View>
      {isAuthenticated ? (
        <Text>Welcome, {profile?.nickname}!</Text>
      ) : (
        <Button onPress={handleLogin} title="Sign In" />
      )}
    </View>
  );
}
```

### signIn()

Authenticate existing user.

**Parameters:**
```typescript
interface SignInCredentials {
  email: string;
  password: string;
}
```

**Returns:**
```typescript
interface AuthResult {
  success: boolean;
  user?: User;
  profile?: UserProfile;
  error?: {
    message: string;
    error: string;
  };
}
```

**Example:**
```typescript
const result = await signIn({
  email: 'john@example.com',
  password: 'SecurePassword123'
});

if (result.success) {
  console.log('User ID:', result.user?.id);
  console.log('Profile:', result.profile);
} else {
  console.error('Error:', result.error?.message);
}
```

### signUp()

Create new user account.

**Parameters:**
```typescript
interface SignUpCredentials {
  email: string;
  password: string;
  nickname: string;
  nationality: string; // ISO 3166-1 alpha-2
}
```

**Returns:** `AuthResult`

**Example:**
```typescript
const result = await signUp({
  email: 'newuser@example.com',
  password: 'SecurePassword123',
  nickname: 'ProGamer',
  nationality: 'US'
});

if (result.success) {
  console.log('Account created!');
  console.log('User:', result.user);
  console.log('Profile:', result.profile);
}
```

**Validation:**
- Email: Valid email format
- Password: Min 8 chars, uppercase, lowercase, number
- Nickname: 3-20 chars, alphanumeric + underscores
- Nationality: Valid ISO 3166-1 alpha-2 code

### signOut()

Sign out current user.

**Returns:** `Promise<void>`

**Example:**
```typescript
await signOut();
// User signed out, session cleared
```

### convertGuestToAccount()

Convert guest account to full account.

**Parameters:** `SignUpCredentials`

**Returns:** `AuthResult`

**Example:**
```typescript
// User playing as guest, now wants to save progress
const result = await convertGuestToAccount({
  email: 'guest@example.com',
  password: 'NewPassword123',
  nickname: 'FormerGuest',
  nationality: 'PL'
});

if (result.success) {
  console.log('Guest converted to account!');
  console.log('Progress preserved');
}
```

---

## Profile Services

**File:** `/lib/profile.ts`

### createProfile()

Create user profile after signup (auto-called by AuthContext).

**Parameters:**
```typescript
interface CreateProfileData {
  nickname: string;
  nationality: string;
  avatar_url?: string;
}

createProfile(userId: string, data: CreateProfileData)
```

**Returns:**
```typescript
{
  success: boolean;
  profile?: UserProfile;
  error?: string;
}
```

**Example:**
```typescript
import { createProfile } from '@/lib/profile';

const result = await createProfile('user-uuid', {
  nickname: 'GamerTag',
  nationality: 'US',
  avatar_url: 'https://example.com/avatar.png'
});
```

### getProfile()

Fetch user profile by ID.

**Parameters:** `userId: string`

**Returns:**
```typescript
{
  success: boolean;
  profile?: UserProfile;
  error?: string;
}
```

**Example:**
```typescript
const result = await getProfile('user-uuid');

if (result.success) {
  console.log('Nickname:', result.profile?.nickname);
  console.log('Nationality:', result.profile?.nationality);
}
```

### getProfileByNickname()

Search user by nickname.

**Parameters:** `nickname: string`

**Returns:** Same as `getProfile()`

**Example:**
```typescript
const result = await getProfileByNickname('ProGamer');

if (result.success) {
  console.log('Found user:', result.profile);
} else {
  console.log('User not found');
}
```

### updateProfile()

Update user profile.

**Parameters:**
```typescript
interface UpdateProfileData {
  nickname?: string;
  nationality?: string;
  avatar_url?: string;
}

updateProfile(userId: string, data: UpdateProfileData)
```

**Returns:**
```typescript
{
  success: boolean;
  profile?: UserProfile;
  error?: string;
}
```

**Example:**
```typescript
const result = await updateProfile('user-uuid', {
  nickname: 'NewNickname',
  avatar_url: 'https://example.com/new-avatar.png'
});

if (result.success) {
  console.log('Profile updated!');
}
```

**Note:** Nickname changes are tracked in `username_history` table.

### updateLastSeen()

Update user's last seen timestamp.

**Parameters:** `userId: string`

**Returns:** `Promise<void>`

**Example:**
```typescript
import { updateLastSeen } from '@/lib/profile';

// Called automatically on app launch
useEffect(() => {
  if (user?.id) {
    updateLastSeen(user.id);
  }
}, [user]);
```

### deleteProfile()

Delete user account (GDPR compliance).

**Parameters:** `userId: string`

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Example:**
```typescript
const result = await deleteProfile('user-uuid');

if (result.success) {
  console.log('Account deleted');
  // All related data cascade deleted
}
```

**Cascades to:**
- campaign_progress
- leaderboards
- player_stats
- achievement_progress
- daily_rewards
- All user data

---

## Leaderboard Services

**File:** `/lib/leaderboard.ts`

### submitScore()

Submit score to leaderboard with anti-cheat validation.

**Parameters:**
```typescript
interface ScoreSubmission {
  level_id: string;
  score: number;
  stars: 1 | 2 | 3;
  completion_time: number; // seconds
  zombies_killed: number;
  hull_integrity?: number; // 0-100
  gameplay_hash?: string;
  client_version?: string;
}

submitScore(userId: string, submission: ScoreSubmission)
```

**Returns:**
```typescript
{
  success: boolean;
  entry?: LeaderboardEntry;
  error?: string;
}
```

**Example:**
```typescript
import { submitScore } from '@/lib/leaderboard';

const result = await submitScore('user-uuid', {
  level_id: 'city_hall',
  score: 15000,
  stars: 3,
  completion_time: 180,
  zombies_killed: 50,
  hull_integrity: 85,
  gameplay_hash: 'abc123...',
  client_version: '2.0.0'
});

if (result.success) {
  console.log('Score submitted!');
  console.log('Entry:', result.entry);
} else {
  console.error('Failed:', result.error);
  // May be rejected by anti-cheat
}
```

**Validation:**
- Checks if user is banned
- Validates score, time, zombie count
- Checks rate limits
- Only keeps best score per level

### getLeaderboard()

Fetch leaderboard with filters.

**Parameters:**
```typescript
interface LeaderboardFilter {
  level_id?: string;       // Specific level or all levels
  scope?: 'global' | 'regional' | 'friends';
  timeframe?: 'all_time' | 'this_week' | 'this_month';
  nationality?: string;    // For regional scope
  limit?: number;          // Default: 100
  offset?: number;         // For pagination
}

getLeaderboard(filter: LeaderboardFilter)
```

**Returns:**
```typescript
{
  success: boolean;
  entries?: LeaderboardEntryWithProfile[];
  error?: string;
}
```

**Example:**
```typescript
import { getLeaderboard } from '@/lib/leaderboard';

// Global leaderboard for specific level
const result = await getLeaderboard({
  level_id: 'city_hall',
  scope: 'global',
  timeframe: 'all_time',
  limit: 100
});

if (result.success) {
  result.entries?.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.profile.nickname} - ${entry.score}`);
  });
}

// Regional leaderboard
const regional = await getLeaderboard({
  scope: 'regional',
  nationality: 'US',
  limit: 50
});
```

### getGlobalLeaderboard()

Get aggregated global leaderboard (all levels combined).

**Parameters:**
```typescript
getGlobalLeaderboard(limit?: number, offset?: number)
```

**Returns:**
```typescript
{
  success: boolean;
  entries?: GlobalLeaderboardEntry[];
  error?: string;
}

interface GlobalLeaderboardEntry {
  id: string;
  nickname: string;
  nationality: string;
  avatar_url: string | null;
  total_score: number;
  total_stars: number;
  levels_completed: number;
  last_activity: string;
}
```

**Example:**
```typescript
const result = await getGlobalLeaderboard(100);

if (result.success) {
  console.log('Top players:');
  result.entries?.forEach(entry => {
    console.log(`${entry.nickname}: ${entry.total_score} pts, ${entry.total_stars} ⭐`);
  });
}
```

### getRegionalLeaderboard()

Get leaderboard for specific country.

**Parameters:**
```typescript
getRegionalLeaderboard(countryCode: string, limit?: number)
```

**Returns:**
```typescript
{
  success: boolean;
  entries?: any[];
  error?: string;
}
```

**Example:**
```typescript
const result = await getRegionalLeaderboard('PL', 50);

if (result.success) {
  console.log('Top Polish players:');
  result.entries?.forEach(entry => {
    console.log(`${entry.nickname}: ${entry.total_score}`);
  });
}
```

### getUserRank()

Get user's rank for specific level.

**Parameters:**
```typescript
getUserRank(userId: string, levelId: string)
```

**Returns:**
```typescript
{
  success: boolean;
  rank?: UserRank;
  error?: string;
}

interface UserRank {
  rank: number;          // Position (1 = first)
  total_players: number;
  percentile: number;    // 0-100
  score: number;
}
```

**Example:**
```typescript
const result = await getUserRank('user-uuid', 'city_hall');

if (result.success) {
  console.log(`Rank: #${result.rank.rank} of ${result.rank.total_players}`);
  console.log(`Top ${result.rank.percentile.toFixed(1)}%`);
}
```

### getPlayerStats()

Get player's aggregate statistics.

**Parameters:**
```typescript
getPlayerStats(userId: string)
```

**Returns:**
```typescript
{
  success: boolean;
  stats?: PlayerStats;
  error?: string;
}

interface PlayerStats {
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
```

**Example:**
```typescript
const result = await getPlayerStats('user-uuid');

if (result.success) {
  const stats = result.stats!;
  console.log(`Games: ${stats.total_games}`);
  console.log(`Zombies: ${stats.total_zombies_killed}`);
  console.log(`Stars: ${stats.total_stars}`);
  console.log(`Playtime: ${Math.floor(stats.total_playtime / 60)} min`);
}
```

### updatePlayerStats()

Update player statistics (incremental).

**Parameters:**
```typescript
interface UpdateStatsData {
  total_games?: number;
  total_zombies_killed?: number;
  total_stars?: number;
  total_playtime?: number;
  best_wave?: number;
}

updatePlayerStats(userId: string, updates: UpdateStatsData)
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Example:**
```typescript
// Called automatically after level completion
await updatePlayerStats('user-uuid', {
  total_games: 1,
  total_zombies_killed: 50,
  total_stars: 3,
  total_playtime: 180
});
```

**Note:** Values are incremented, not replaced.

### subscribeToLeaderboard()

Subscribe to real-time leaderboard updates.

**Parameters:**
```typescript
subscribeToLeaderboard(
  levelId: string,
  callback: (entry: LeaderboardEntry) => void
): () => void
```

**Returns:** Unsubscribe function

**Example:**
```typescript
import { subscribeToLeaderboard } from '@/lib/leaderboard';

useEffect(() => {
  const unsubscribe = subscribeToLeaderboard('city_hall', (entry) => {
    console.log('New score:', entry);
    // Update UI with new entry
  });

  return () => {
    unsubscribe(); // Clean up on unmount
  };
}, []);
```

---

## Achievement Services

**File:** `/lib/achievements.ts`

### getAllAchievements()

Get all achievement definitions.

**Returns:**
```typescript
{
  success: boolean;
  achievements?: Achievement[];
  error?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'combat' | 'progression' | 'special';
  requirement_type: string;
  requirement_value: number;
  reward_type: string | null;
  reward_value: any;
  icon_url: string | null;
  created_at: string;
}
```

**Example:**
```typescript
import { getAllAchievements } from '@/lib/achievements';

const result = await getAllAchievements();

if (result.success) {
  result.achievements?.forEach(ach => {
    console.log(`${ach.name}: ${ach.description}`);
  });
}
```

### getUserAchievementProgress()

Get user's progress on all achievements.

**Parameters:**
```typescript
getUserAchievementProgress(userId: string)
```

**Returns:**
```typescript
{
  success: boolean;
  progress?: AchievementProgress[];
  error?: string;
}

interface AchievementProgress {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
```

**Example:**
```typescript
const result = await getUserAchievementProgress('user-uuid');

if (result.success) {
  result.progress?.forEach(p => {
    console.log(`${p.achievement_id}: ${p.progress} (${p.completed ? 'Unlocked' : 'Locked'})`);
  });
}
```

### getAchievementsWithProgress()

Get achievements with user's progress combined.

**Parameters:**
```typescript
getAchievementsWithProgress(userId: string)
```

**Returns:**
```typescript
{
  success: boolean;
  achievements?: AchievementWithProgress[];
  error?: string;
}

interface AchievementWithProgress {
  // All Achievement fields
  ...Achievement;
  // Plus progress
  progress: AchievementProgress | null;
}
```

**Example:**
```typescript
const result = await getAchievementsWithProgress('user-uuid');

if (result.success) {
  result.achievements?.forEach(ach => {
    const progress = ach.progress?.progress || 0;
    const total = ach.requirement_value;
    const percent = (progress / total) * 100;

    console.log(`${ach.name}: ${progress}/${total} (${percent.toFixed(0)}%)`);
  });
}
```

### updateAchievementProgress()

Update progress on specific achievement.

**Parameters:**
```typescript
updateAchievementProgress(
  userId: string,
  achievementId: string,
  progressValue: number
)
```

**Returns:**
```typescript
{
  success: boolean;
  unlocked?: boolean;
  achievement?: AchievementUnlocked;
  error?: string;
}

interface AchievementUnlocked {
  achievement: Achievement;
  progress: AchievementProgress;
}
```

**Example:**
```typescript
const result = await updateAchievementProgress(
  'user-uuid',
  'zombie_slayer_100',
  100
);

if (result.success && result.unlocked) {
  console.log('🎉 Achievement Unlocked!');
  console.log(result.achievement.achievement.name);
}
```

### incrementAchievementProgress()

Increment progress by value.

**Parameters:**
```typescript
incrementAchievementProgress(
  userId: string,
  achievementId: string,
  incrementBy?: number // default: 1
)
```

**Returns:** Same as `updateAchievementProgress()`

**Example:**
```typescript
// Increment zombie kill count by 5
await incrementAchievementProgress(
  'user-uuid',
  'zombie_slayer_100',
  5
);
```

### trackZombieKills()

Helper to track zombie kills for achievements.

**Parameters:**
```typescript
trackZombieKills(userId: string, zombiesKilled: number)
```

**Returns:** `Promise<void>`

**Example:**
```typescript
import { trackZombieKills } from '@/lib/achievements';

// Called after level completion
await trackZombieKills('user-uuid', 50);
// Updates: first_blood, zombie_slayer_100, zombie_slayer_1000
```

### trackLevelCompletion()

Helper to track level completion achievements.

**Parameters:**
```typescript
trackLevelCompletion(
  userId: string,
  levelId: string,
  stars: number,
  hullIntegrity: number,
  completionTime: number
)
```

**Returns:** `Promise<void>`

**Example:**
```typescript
await trackLevelCompletion(
  'user-uuid',
  'city_hall',
  3,           // stars
  100,         // hull integrity
  240          // completion time (seconds)
);
// Updates: first_victory, perfect_run, speed_demon, three_star_master
```

### getAchievementStats()

Get achievement statistics for user.

**Parameters:**
```typescript
getAchievementStats(userId: string)
```

**Returns:**
```typescript
{
  total: number;
  completed: number;
  inProgress: number;
  locked: number;
  completionPercentage: number;
}
```

**Example:**
```typescript
const stats = await getAchievementStats('user-uuid');

console.log(`Completed: ${stats.completed}/${stats.total}`);
console.log(`Progress: ${stats.completionPercentage.toFixed(1)}%`);
```

---

## Daily Rewards Services

**File:** `/lib/dailyRewards.ts`

### getDailyRewards()

Get user's daily rewards status.

**Parameters:**
```typescript
getDailyRewards(userId: string)
```

**Returns:**
```typescript
{
  success: boolean;
  rewards?: DailyRewards;
  error?: string;
}

interface DailyRewards {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_claim_date: string | null;
  total_rewards_claimed: number;
  created_at: string;
  updated_at: string;
}
```

**Example:**
```typescript
const result = await getDailyRewards('user-uuid');

if (result.success) {
  console.log(`Current streak: ${result.rewards?.current_streak} days`);
  console.log(`Longest streak: ${result.rewards?.longest_streak} days`);
}
```

### canClaimDailyReward()

Check if user can claim reward today.

**Parameters:**
```typescript
canClaimDailyReward(userId: string)
```

**Returns:**
```typescript
{
  canClaim: boolean;
  streak: number;
  nextReward?: DailyRewardDefinition;
}

interface DailyRewardDefinition {
  day: number;
  reward_type: 'scrap' | 'skin' | 'special';
  reward_amount: number;
  bonus?: string;
}
```

**Example:**
```typescript
const result = await canClaimDailyReward('user-uuid');

if (result.canClaim) {
  console.log(`You can claim today's reward!`);
  console.log(`Day ${result.nextReward?.day}: ${result.nextReward?.reward_amount} scrap`);
} else {
  console.log('Already claimed today. Come back tomorrow!');
}
```

### claimDailyReward()

Claim today's daily reward.

**Parameters:**
```typescript
claimDailyReward(userId: string)
```

**Returns:**
```typescript
{
  success: boolean;
  reward?: DailyRewardDefinition;
  new_streak?: number;
  streak_broken?: boolean;
  error?: string;
}
```

**Example:**
```typescript
const result = await claimDailyReward('user-uuid');

if (result.success) {
  console.log(`Claimed ${result.reward?.reward_amount} scrap!`);
  console.log(`Streak: ${result.new_streak} days`);

  if (result.streak_broken) {
    console.log('⚠️ Your streak was broken. Starting fresh!');
  }
} else {
  console.error(result.error);
}
```

### getRewardSchedule()

Get the full 7-day reward schedule.

**Returns:**
```typescript
DailyRewardDefinition[]
```

**Example:**
```typescript
import { getRewardSchedule } from '@/lib/dailyRewards';

const schedule = getRewardSchedule();

schedule.forEach(reward => {
  console.log(`Day ${reward.day}: ${reward.reward_amount} ${reward.reward_type}`);
});
```

---

## Cloud Sync Services

**File:** `/lib/cloudSync.ts`

### performFullSync()

Perform bidirectional sync between local and cloud.

**Parameters:**
```typescript
performFullSync(userId: string)
```

**Returns:**
```typescript
{
  success: boolean;
  data?: CampaignSaveData;
  error?: string;
  conflictResolved?: boolean;
  source?: 'cloud' | 'local' | 'merged';
}
```

**Example:**
```typescript
import { performFullSync } from '@/lib/cloudSync';

// Called on app launch after login
const result = await performFullSync('user-uuid');

if (result.success) {
  console.log(`Sync complete. Source: ${result.source}`);

  if (result.conflictResolved) {
    console.log('Conflicts were resolved automatically');
  }

  // Load campaign progress from result.data
}
```

### uploadToCloud()

Upload local save to cloud.

**Parameters:**
```typescript
uploadToCloud(userId: string, saveData: CampaignSaveData)
```

**Returns:** `SyncResult`

**Example:**
```typescript
import { uploadToCloud } from '@/lib/cloudSync';

const saveData = {
  playerProgress: {
    currentCampaignId: 'main',
    currentLevel: 5,
    unlockedLevels: ['city_hall', 'downtown'],
    levelProgress: {
      city_hall: {
        levelId: 'city_hall',
        completed: true,
        starsEarned: 3,
        bestScore: 15000,
        bestWave: 10,
        timesPlayed: 5,
        lastPlayedAt: Date.now()
      }
    },
    totalStars: 3,
    totalScrapEarned: 1000
  },
  version: 1,
  lastUpdated: Date.now()
};

await uploadToCloud('user-uuid', saveData);
```

### downloadFromCloud()

Download save from cloud.

**Parameters:**
```typescript
downloadFromCloud(userId: string)
```

**Returns:** `SyncResult`

**Example:**
```typescript
const result = await downloadFromCloud('user-uuid');

if (result.success && result.data) {
  console.log('Cloud save downloaded');
  console.log('Progress:', result.data.playerProgress);
  // Save locally
}
```

### autoSyncAfterLevelComplete()

Auto-sync after level completion (non-blocking).

**Parameters:**
```typescript
autoSyncAfterLevelComplete(userId: string, saveData: CampaignSaveData)
```

**Returns:** `Promise<void>`

**Example:**
```typescript
// Called by CampaignContext after level completion
await autoSyncAfterLevelComplete(userId, campaignSave);
// Saves locally first, then uploads in background
```

### canSync()

Check if device can sync (online).

**Returns:** `Promise<boolean>`

**Example:**
```typescript
const online = await canSync();

if (online) {
  console.log('Connected to internet');
} else {
  console.log('Offline mode');
}
```

### forceSync()

Force manual sync (user-initiated).

**Parameters:**
```typescript
forceSync(userId: string)
```

**Returns:** `SyncResult`

**Example:**
```typescript
// User clicks "Sync Now" button
const result = await forceSync('user-uuid');

if (result.success) {
  console.log('Manual sync complete');
} else {
  console.error('Sync failed:', result.error);
}
```

---

## Anti-Cheat Services

**File:** `/lib/antiCheat.ts`

### validateScoreSubmission()

Validate score submission before accepting.

**Parameters:**
```typescript
validateScoreSubmission(userId: string, submission: ScoreSubmission)
```

**Returns:**
```typescript
{
  valid: boolean;
  shouldFlag: boolean;
  reasons: SuspiciousReason[];
  metadata?: Record<string, any>;
}

type SuspiciousReason =
  | 'impossible_score'
  | 'impossible_time'
  | 'impossible_zombies'
  | 'hash_mismatch'
  | 'rate_limit_exceeded';
```

**Example:**
```typescript
import { validateScoreSubmission } from '@/lib/antiCheat';

const validation = await validateScoreSubmission('user-uuid', {
  level_id: 'city_hall',
  score: 15000,
  stars: 3,
  completion_time: 180,
  zombies_killed: 50
});

if (validation.valid) {
  console.log('Score is valid');
} else {
  console.log('Score rejected:', validation.reasons);
}
```

### isUserBanned()

Check if user is banned.

**Parameters:**
```typescript
isUserBanned(userId: string)
```

**Returns:** `Promise<boolean>`

**Example:**
```typescript
const banned = await isUserBanned('user-uuid');

if (banned) {
  console.log('User is banned');
  // Prevent score submission
}
```

### generateGameplayHash()

Generate gameplay hash for verification.

**Parameters:**
```typescript
generateGameplayHash(
  levelId: string,
  score: number,
  completionTime: number,
  zombiesKilled: number
)
```

**Returns:** `Promise<string>`

**Example:**
```typescript
const hash = await generateGameplayHash(
  'city_hall',
  15000,
  180,
  50
);

console.log('Gameplay hash:', hash);
// Use this in score submission
```

---

## Analytics Services

**File:** `/lib/analytics.ts`

### analytics.track()

Track custom event.

**Parameters:**
```typescript
track(eventName: string, properties?: Record<string, any>)
```

**Example:**
```typescript
import { analytics } from '@/lib/analytics';

analytics.track('level_completed', {
  level_id: 'city_hall',
  score: 15000,
  stars: 3,
  completion_time: 180
});

analytics.track('achievement_unlocked', {
  achievement_id: 'first_victory',
  achievement_name: 'First Victory'
});
```

### analytics.screen()

Track screen view.

**Parameters:**
```typescript
screen(screenName: string, properties?: Record<string, any>)
```

**Example:**
```typescript
analytics.screen('leaderboard_screen', {
  scope: 'global',
  level_id: 'city_hall'
});
```

---

## Type Definitions

### UserProfile

```typescript
interface UserProfile {
  id: string;
  nickname: string;
  nationality: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  last_seen_at: string;
}
```

### CampaignSaveData

```typescript
interface CampaignSaveData {
  playerProgress: {
    currentCampaignId: string;
    currentLevel: number;
    unlockedLevels: string[];
    levelProgress: Record<string, LevelProgress>;
    totalStars: number;
    totalScrapEarned: number;
  };
  version: number;
  lastUpdated: number;
}

interface LevelProgress {
  levelId: string;
  completed: boolean;
  starsEarned: number;
  bestScore: number;
  bestWave: number;
  timesPlayed: number;
  lastPlayedAt: number;
}
```

### LeaderboardEntry

```typescript
interface LeaderboardEntry {
  id: string;
  user_id: string;
  level_id: string;
  score: number;
  stars: 1 | 2 | 3;
  completion_time: number;
  zombies_killed: number;
  hull_integrity: number | null;
  gameplay_hash: string | null;
  client_version: string | null;
  flagged: boolean;
  created_at: string;
  updated_at: string;
}

interface LeaderboardEntryWithProfile extends LeaderboardEntry {
  profile: {
    nickname: string;
    nationality: string;
    avatar_url: string | null;
  };
}
```

---

## Error Handling

All service functions follow consistent error handling:

### Success Response

```typescript
{
  success: true,
  data: T,          // Type-specific data
  error: undefined
}
```

### Error Response

```typescript
{
  success: false,
  data: undefined,
  error: string     // Human-readable error message
}
```

### Common Errors

**Authentication:**
- `"Invalid email or password"`
- `"Nickname already taken"`
- `"Email already registered"`
- `"Weak password"`

**Leaderboard:**
- `"Score validation failed"`
- `"Account suspended. Contact support."`
- `"Too many submissions"`

**Cloud Sync:**
- `"Cannot sync while offline"`
- `"Failed to upload to cloud"`
- `"Sync conflict detected"`

**Achievements:**
- `"Achievement not found"`
- `"Already unlocked"`

**Daily Rewards:**
- `"Already claimed today"`
- `"Streak expired"`

### Error Handling Pattern

```typescript
const result = await someService.someFunction();

if (result.success) {
  // Handle success
  console.log('Success:', result.data);
} else {
  // Handle error
  console.error('Error:', result.error);
  // Show error to user
  Alert.alert('Error', result.error);
}
```

### Network Error Handling

```typescript
try {
  const result = await submitScore(userId, submission);

  if (result.success) {
    // Success
  } else {
    // Service-level error
    console.error(result.error);
  }
} catch (error) {
  // Network or unexpected error
  console.error('Network error:', error);
  Alert.alert('Network Error', 'Please check your connection');
}
```

---

## Environment Variables

Required environment variables in `.env`:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
EXPO_PUBLIC_CLIENT_VERSION=2.0.0
EXPO_PUBLIC_MAX_SCORE_SUBMISSIONS_PER_MINUTE=10
```

**Access in code:**
```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const appVersion = process.env.EXPO_PUBLIC_CLIENT_VERSION;
```

---

## Database Direct Access

For admin tools or debugging, direct database access via Supabase client:

### Query Example

```typescript
import { supabase } from '@/lib/supabase';

// Fetch user profile
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Insert achievement progress
await supabase.from('achievement_progress').insert({
  user_id: userId,
  achievement_id: 'first_victory',
  progress: 1,
  completed: true
});

// Update leaderboard entry
await supabase
  .from('leaderboards')
  .update({ flagged: true })
  .eq('id', entryId);

// Call database function
const { data: regional } = await supabase.rpc('get_regional_leaderboard', {
  country_code: 'US'
});
```

### Real-time Subscription

```typescript
const channel = supabase
  .channel('leaderboard-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'leaderboards',
      filter: `level_id=eq.city_hall`
    },
    (payload) => {
      console.log('Change detected:', payload);
    }
  )
  .subscribe();

// Clean up
supabase.removeChannel(channel);
```

---

## Conclusion

This API reference covers all major services in the Zombie Fleet authentication and gamification system. All functions are type-safe, handle errors consistently, and include real-world usage examples.

For additional help:
- Check source code in `/lib/` directory
- Review type definitions in `/types/` directory
- See integration examples in `/contexts/` and `/app/` directories
- Consult [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing patterns
