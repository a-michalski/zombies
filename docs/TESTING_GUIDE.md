# Zombie Fleet - Testing Guide

**Version:** 2.0 MVP
**Last Updated:** November 19, 2025
**Audience:** QA Engineers, Developers, Testers

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Authentication Flow Testing](#authentication-flow-testing)
3. [Cloud Sync Testing](#cloud-sync-testing)
4. [Leaderboard Testing](#leaderboard-testing)
5. [Achievement Testing](#achievement-testing)
6. [Daily Rewards Testing](#daily-rewards-testing)
7. [Anti-Cheat Testing](#anti-cheat-testing)
8. [Multi-Device Testing](#multi-device-testing)
9. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
10. [Test Environments](#test-environments)

---

## Testing Overview

### Test Priorities

**Critical (Must Pass):**
- Authentication (signup, signin, guest mode)
- Cloud sync (save/load)
- Score submission to leaderboard
- Data persistence

**High Priority:**
- Achievements tracking
- Daily rewards claiming
- Anti-cheat validation
- Multi-device sync

**Medium Priority:**
- Leaderboard filters (regional, timeframe)
- Profile updates
- Statistics display

**Low Priority:**
- UI animations
- Edge cases
- Performance optimization

### Testing Tools

**Required:**
- **Device/Emulator** - iOS Simulator or Android Emulator
- **Supabase Dashboard** - For database inspection
- **Network Tools** - Charles Proxy or similar (for offline testing)
- **Multiple Devices** - For multi-device sync testing

**Optional:**
- **Analytics Dashboard** - For event tracking verification
- **Database Client** - TablePlus, pgAdmin for direct DB queries

---

## Authentication Flow Testing

### Test Case 1: Sign Up (New Account)

**Objective:** Verify new user can create an account

**Steps:**
1. Launch app
2. Click "SIGN IN" button on main menu
3. Switch to "Sign Up" tab
4. Enter email: `test+{timestamp}@example.com`
5. Enter password: `Test1234`
6. Enter nickname: `TestUser{random}`
7. Select nationality: `United States (US)`
8. Click "CREATE ACCOUNT"

**Expected Results:**
- ✅ Account created successfully
- ✅ Profile created in database
- ✅ `player_stats` record auto-created
- ✅ `daily_rewards` record auto-created
- ✅ User redirected to campaign screen
- ✅ Session persisted (survives app restart)

**Database Verification:**
```sql
-- Check profile created
SELECT * FROM profiles WHERE nickname = 'TestUser{random}';

-- Check stats initialized
SELECT * FROM player_stats WHERE user_id = '{user_id}';

-- Check daily rewards initialized
SELECT * FROM daily_rewards WHERE user_id = '{user_id}';
```

**Common Issues:**
- ❌ "Nickname already taken" → Use unique nickname
- ❌ "Email already registered" → Use unique email
- ❌ "Weak password" → Ensure password meets requirements

### Test Case 2: Sign In (Existing Account)

**Objective:** Verify existing user can sign in

**Steps:**
1. Launch app
2. Click "SIGN IN"
3. Enter email: `existing@example.com`
4. Enter password: `{correct_password}`
5. Click "SIGN IN"

**Expected Results:**
- ✅ Login successful
- ✅ Profile loaded
- ✅ Cloud sync initiated
- ✅ Campaign progress loaded
- ✅ User redirected to campaign screen
- ✅ `last_seen_at` updated in database

**Database Verification:**
```sql
-- Check last_seen updated
SELECT last_seen_at FROM profiles WHERE id = '{user_id}';
-- Should be within last minute
```

**Error Cases to Test:**
- Wrong password → "Invalid email or password"
- Wrong email → "Invalid email or password"
- Non-existent account → "Invalid email or password"

### Test Case 3: Guest Mode

**Objective:** Verify guest mode works without account

**Steps:**
1. Launch app
2. Click "PLAY AS GUEST"
3. Play a level
4. Close and reopen app

**Expected Results:**
- ✅ User redirected to campaign screen
- ✅ Can play all levels
- ✅ Progress saved locally (AsyncStorage)
- ✅ Progress persists after app restart
- ✅ Cannot submit to leaderboard (read-only)
- ✅ "Save Progress" banner visible
- ✅ No achievements or daily rewards

**Local Storage Verification:**
```typescript
// Check AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const save = await AsyncStorage.getItem('@zombie_fleet:campaign_progress');
console.log('Local save:', JSON.parse(save));
```

### Test Case 4: Guest to Account Conversion

**Objective:** Verify guest can convert to full account without losing progress

**Pre-condition:** User in guest mode with some level progress

**Steps:**
1. Play 2-3 levels as guest
2. Click "SAVE PROGRESS" banner
3. Fill out signup form:
   - Email: `guest+{timestamp}@example.com`
   - Password: `Test1234`
   - Nickname: `GuestUser{random}`
   - Nationality: `Poland (PL)`
4. Click "CREATE ACCOUNT"

**Expected Results:**
- ✅ Account created
- ✅ Local progress preserved
- ✅ Progress uploaded to cloud
- ✅ User becomes authenticated
- ✅ All completed levels still completed
- ✅ Stars and scores preserved
- ✅ Leaderboard access granted
- ✅ Achievements tracking starts

**Database Verification:**
```sql
-- Check campaign_progress uploaded
SELECT * FROM campaign_progress WHERE user_id = '{new_user_id}';

-- Check save_data contains level progress
SELECT save_data->'playerProgress'->'levelProgress' FROM campaign_progress
WHERE user_id = '{new_user_id}';
```

### Test Case 5: Session Persistence

**Objective:** Verify user stays logged in across app restarts

**Steps:**
1. Sign in to account
2. Close app completely
3. Wait 5 minutes
4. Reopen app

**Expected Results:**
- ✅ User automatically logged in
- ✅ No login screen shown
- ✅ Goes directly to campaign screen
- ✅ Profile loaded
- ✅ Cloud sync triggered

**Session Expiry Test:**
1. Sign in
2. Wait 7 days without opening app
3. Open app

**Expected:** Session expired, user shown login screen

### Test Case 6: Sign Out

**Objective:** Verify user can sign out and data is cleared

**Steps:**
1. Sign in to account
2. Go to Settings
3. Click "Sign Out"
4. Confirm sign out

**Expected Results:**
- ✅ User signed out
- ✅ Session cleared from AsyncStorage
- ✅ Redirected to main menu
- ✅ "SIGN IN" button shown
- ✅ Local campaign progress cleared
- ✅ No auto-login on next app open

---

## Cloud Sync Testing

### Test Case 7: Initial Sync (New Account)

**Objective:** Verify cloud sync works for new account

**Steps:**
1. Create new account
2. Play 1 level to completion
3. Wait for sync indicator

**Expected Results:**
- ✅ Progress saved locally immediately
- ✅ Progress uploaded to cloud within 5 seconds
- ✅ Sync status shows "Synced"
- ✅ Database has campaign_progress record

**Database Verification:**
```sql
-- Check cloud save created
SELECT * FROM campaign_progress WHERE user_id = '{user_id}';

-- Check last_synced is recent
SELECT last_synced FROM campaign_progress WHERE user_id = '{user_id}';
-- Should be within last minute
```

### Test Case 8: Bidirectional Sync

**Objective:** Verify sync works when cloud has newer data

**Pre-condition:** Account with cloud save

**Steps:**
1. Device A: Sign in, play level 1, sync
2. Device A: Close app
3. Device B: Sign in (should download level 1 progress)
4. Device B: Play level 2, sync
5. Device A: Reopen app (should download level 2 progress)

**Expected Results:**
- ✅ Device A uploads level 1 progress
- ✅ Device B downloads level 1 progress
- ✅ Device B uploads level 2 progress
- ✅ Device A downloads level 2 progress
- ✅ Both devices have identical progress

### Test Case 9: Conflict Resolution

**Objective:** Verify conflicts are resolved correctly

**Setup:**
1. Device A and B signed into same account
2. Both devices offline

**Steps:**
1. Device A: Play level 1 (3 stars)
2. Device B: Play level 2 (2 stars)
3. Device A: Go online, sync
4. Device B: Go online, sync

**Expected Results:**
- ✅ Merge conflict detected
- ✅ Both level 1 and level 2 progress preserved
- ✅ Best scores kept for each level
- ✅ Total stars = max(deviceA.stars, deviceB.stars)
- ✅ Unlocked levels = union(deviceA.levels, deviceB.levels)

**Database Verification:**
```sql
SELECT save_data FROM campaign_progress WHERE user_id = '{user_id}';
-- Should contain both level 1 and level 2 progress
```

### Test Case 10: Offline Play

**Objective:** Verify game works offline and syncs later

**Steps:**
1. Sign in (online)
2. Enable airplane mode
3. Play 3 levels
4. Check sync status (should show "Offline")
5. Disable airplane mode
6. Wait for automatic sync

**Expected Results:**
- ✅ Levels playable offline
- ✅ Progress saved locally
- ✅ Sync status shows "Offline"
- ✅ When online, sync triggers automatically
- ✅ Cloud save updated with offline progress

### Test Case 11: Manual Sync

**Objective:** Verify manual sync button works

**Steps:**
1. Go to Settings
2. Click "Sync Now" button
3. Observe sync status

**Expected Results:**
- ✅ Sync status shows "Syncing..."
- ✅ After completion, shows "Synced" with timestamp
- ✅ Cloud save updated in database
- ✅ Error shown if offline

---

## Leaderboard Testing

### Test Case 12: Submit Score to Leaderboard

**Objective:** Verify score submission works

**Pre-condition:** Authenticated user

**Steps:**
1. Play level "city_hall" to completion
2. Get score: 15000, stars: 3, time: 120s, zombies: 50
3. Observe leaderboard submission

**Expected Results:**
- ✅ Score submitted to leaderboards table
- ✅ Anti-cheat validation passes
- ✅ Entry appears in level leaderboard
- ✅ User rank calculated
- ✅ Player stats updated (total_games, total_zombies_killed, etc.)

**Database Verification:**
```sql
-- Check leaderboard entry
SELECT * FROM leaderboards
WHERE user_id = '{user_id}' AND level_id = 'city_hall';

-- Check player stats updated
SELECT total_games, total_zombies_killed, total_stars
FROM player_stats WHERE user_id = '{user_id}';
```

### Test Case 13: Update Best Score

**Objective:** Verify only best score is kept per level

**Steps:**
1. Play level "city_hall", get score: 10000
2. Check leaderboard entry (score = 10000)
3. Play same level again, get score: 15000
4. Check leaderboard entry (score = 15000)
5. Play same level again, get score: 8000
6. Check leaderboard entry (score should still be 15000)

**Expected Results:**
- ✅ First score: 10000 saved
- ✅ Second score: Updated to 15000
- ✅ Third score: Not updated (lower than best)
- ✅ Only one entry per user per level

**Database Verification:**
```sql
-- Should be only one row per user per level
SELECT COUNT(*) FROM leaderboards
WHERE user_id = '{user_id}' AND level_id = 'city_hall';
-- Result: 1

-- Score should be highest
SELECT score FROM leaderboards
WHERE user_id = '{user_id}' AND level_id = 'city_hall';
-- Result: 15000
```

### Test Case 14: Global Leaderboard

**Objective:** Verify global leaderboard aggregates correctly

**Steps:**
1. Open leaderboard screen
2. View "Global" tab
3. Scroll through entries

**Expected Results:**
- ✅ Shows top 100 users
- ✅ Sorted by total_score descending
- ✅ Shows nickname, nationality flag, total score, total stars
- ✅ User's rank shown at bottom
- ✅ Real-time updates when new scores posted

**Database Verification:**
```sql
-- Check global leaderboard view
SELECT * FROM global_leaderboard LIMIT 100;
```

### Test Case 15: Regional Leaderboard

**Objective:** Verify regional filtering works

**Steps:**
1. Open leaderboard screen
2. Switch to "Regional" tab
3. Select country: "United States"

**Expected Results:**
- ✅ Shows only users with nationality = 'US'
- ✅ Sorted by total score
- ✅ User's regional rank shown

**Database Verification:**
```sql
-- Check regional leaderboard function
SELECT * FROM get_regional_leaderboard('US');
```

### Test Case 16: Leaderboard Real-Time Updates

**Objective:** Verify leaderboard updates in real-time

**Setup:** Two devices signed into different accounts

**Steps:**
1. Device A: Open leaderboard screen
2. Device B: Complete level with high score
3. Device A: Observe leaderboard (no manual refresh)

**Expected Results:**
- ✅ Device A's leaderboard updates automatically
- ✅ New entry appears
- ✅ Rankings shift accordingly
- ✅ Update happens within 2-3 seconds

---

## Achievement Testing

### Test Case 17: Achievement Progress Tracking

**Objective:** Verify achievement progress updates

**Pre-condition:** New account (no achievements)

**Steps:**
1. Play level, kill 1 zombie
2. Check achievements screen
3. Play more levels, kill 99 more zombies (total 100)
4. Check achievements screen
5. Kill 900 more zombies (total 1000)
6. Check achievements screen

**Expected Results:**

**After 1 zombie:**
- ✅ "First Blood" achievement unlocked
- ✅ Reward granted (100 scrap)
- ✅ "Zombie Slayer" shows progress: 1/100

**After 100 zombies:**
- ✅ "Zombie Slayer" achievement unlocked
- ✅ Reward granted (500 scrap)
- ✅ "Zombie Massacre" shows progress: 100/1000

**After 1000 zombies:**
- ✅ "Zombie Massacre" achievement unlocked
- ✅ Reward granted (2000 scrap)

**Database Verification:**
```sql
-- Check achievement progress
SELECT * FROM achievement_progress WHERE user_id = '{user_id}';

-- Check specific achievement
SELECT progress, completed FROM achievement_progress
WHERE user_id = '{user_id}' AND achievement_id = 'zombie_slayer_100';
```

### Test Case 18: Achievement Unlock Notification

**Objective:** Verify achievement unlock shows notification

**Steps:**
1. Play level
2. Kill enough zombies to unlock "Zombie Slayer" (100 kills)
3. Observe UI

**Expected Results:**
- ✅ Achievement unlock popup appears
- ✅ Shows achievement name and description
- ✅ Shows reward earned
- ✅ Confetti/celebration animation
- ✅ Achievement marked as completed in list

### Test Case 19: Multiple Achievement Categories

**Objective:** Verify different achievement types work

**Test achievements:**

**Combat Achievements:**
- First Blood (1 kill)
- Zombie Slayer (100 kills)
- Zombie Massacre (1000 kills)

**Progression Achievements:**
- First Victory (1 level complete)
- Three Star Master (10 levels with 3 stars)
- Completionist (all levels with 3 stars)

**Special Achievements:**
- Perfect Defense (100% hull integrity)
- Speed Demon (level in < 5 minutes)

**Expected Results:**
- ✅ All achievement types tracked independently
- ✅ Progress updates correctly for each category
- ✅ Rewards granted when unlocked

---

## Daily Rewards Testing

### Test Case 20: First Daily Reward

**Objective:** Verify new user can claim first daily reward

**Pre-condition:** New account, never claimed reward

**Steps:**
1. Sign in
2. Daily reward popup should appear
3. Click "CLAIM REWARD"

**Expected Results:**
- ✅ Popup shows Day 1 reward (100 scrap)
- ✅ Reward claimed successfully
- ✅ Current streak: 1
- ✅ Next reward preview shown (Day 2: 150 scrap)
- ✅ Cannot claim again today

**Database Verification:**
```sql
SELECT current_streak, last_claim_date, total_rewards_claimed
FROM daily_rewards WHERE user_id = '{user_id}';
-- current_streak: 1
-- last_claim_date: today's date
-- total_rewards_claimed: 1
```

### Test Case 21: Consecutive Daily Claims

**Objective:** Verify streak increments for consecutive days

**Steps:**
1. Day 1: Claim reward (streak = 1)
2. Wait until next day (change device date or wait 24h)
3. Day 2: Open app, claim reward
4. Wait until next day
5. Day 3: Open app, claim reward

**Expected Results:**
- ✅ Day 1: Streak = 1, Reward = 100 scrap
- ✅ Day 2: Streak = 2, Reward = 150 scrap
- ✅ Day 3: Streak = 3, Reward = 200 scrap
- ✅ Longest streak updated: 3

**Database Verification:**
```sql
SELECT current_streak, longest_streak FROM daily_rewards
WHERE user_id = '{user_id}';
-- current_streak: 3
-- longest_streak: 3
```

### Test Case 22: Streak Break

**Objective:** Verify streak resets when day skipped

**Steps:**
1. Day 1: Claim reward (streak = 1)
2. Skip 2 days (don't open app)
3. Day 4: Open app, claim reward

**Expected Results:**
- ✅ Streak reset to 1
- ✅ Message: "Streak broken! Starting fresh."
- ✅ Longest streak still preserved
- ✅ Reward = 100 scrap (Day 1 reward)

**Database Verification:**
```sql
SELECT current_streak, longest_streak FROM daily_rewards
WHERE user_id = '{user_id}';
-- current_streak: 1
-- longest_streak: 1 (or higher if had longer streak before)
```

### Test Case 23: 7-Day Cycle Completion

**Objective:** Verify reward cycle resets after 7 days

**Steps:**
1. Claim rewards for 7 consecutive days
2. On day 8, claim reward

**Expected Results:**
- ✅ Day 7: Streak = 7, Reward = 500 scrap + bonus
- ✅ Day 8: Streak = 8, Reward = 100 scrap (cycle restarts)
- ✅ Cycle continues indefinitely

### Test Case 24: Same-Day Re-Claim Prevention

**Objective:** Verify user cannot claim twice in one day

**Steps:**
1. Claim daily reward
2. Try to claim again immediately
3. Close and reopen app
4. Try to claim again

**Expected Results:**
- ✅ "Already claimed today" message
- ✅ Claim button disabled
- ✅ Shows "Come back tomorrow"
- ✅ Next reward preview shown

---

## Anti-Cheat Testing

### Test Case 25: Normal Score Submission

**Objective:** Verify legitimate score is accepted

**Steps:**
1. Play level "city_hall" normally
2. Complete with score: 12000, time: 180s, zombies: 45
3. Submit score

**Expected Results:**
- ✅ Score accepted
- ✅ No flags set
- ✅ Appears in leaderboard
- ✅ No suspicious_scores entry

### Test Case 26: Impossible Score Detection

**Objective:** Verify impossible scores are rejected

**Test Data:**
```typescript
{
  level_id: 'city_hall',
  score: 999999999,  // Impossibly high
  stars: 3,
  completion_time: 120,
  zombies_killed: 50,
}
```

**Expected Results:**
- ❌ Score rejected
- ✅ Error: "Score validation failed"
- ✅ Entry created in suspicious_scores table
- ✅ User flagged for review
- ✅ Score NOT in leaderboard

**Database Verification:**
```sql
SELECT * FROM suspicious_scores
WHERE user_id = '{user_id}' AND level_id = 'city_hall';
-- Should have entry with reason: 'impossible_score'
```

### Test Case 27: Impossible Time Detection

**Objective:** Verify impossible completion times are rejected

**Test Data:**
```typescript
{
  level_id: 'city_hall',
  score: 15000,
  stars: 3,
  completion_time: 1,  // 1 second (impossible)
  zombies_killed: 50,
}
```

**Expected Results:**
- ❌ Score rejected
- ✅ Flagged as suspicious
- ✅ Reason: "impossible_time"

### Test Case 28: Impossible Zombie Count

**Objective:** Verify zombie count validation

**Test Data:**
```typescript
{
  level_id: 'city_hall',
  score: 15000,
  stars: 3,
  completion_time: 120,
  zombies_killed: 10000,  // More than exist in level
}
```

**Expected Results:**
- ❌ Score rejected
- ✅ Reason: "impossible_zombies"

### Test Case 29: Rate Limiting

**Objective:** Verify rate limiting prevents spam

**Steps:**
1. Submit 15 scores rapidly (within 1 minute)

**Expected Results:**
- ✅ First 10 submissions: Accepted
- ❌ Submissions 11-15: Rejected
- ✅ Error: "Too many submissions. Please wait."
- ✅ Flagged as suspicious

### Test Case 30: Ban Enforcement

**Objective:** Verify banned users cannot submit scores

**Setup:** User has active ban

**Steps:**
1. Try to submit score

**Expected Results:**
- ❌ Submission rejected immediately
- ✅ Error: "Account suspended. Contact support."
- ✅ No validation performed (banned check happens first)

---

## Multi-Device Testing

### Test Case 31: Two Devices, Same Account

**Objective:** Verify sync works across devices

**Devices:** iPhone and iPad (or two emulators)

**Steps:**
1. Device A: Sign in, play level 1
2. Device A: Sync completes
3. Device B: Sign in (should download progress)
4. Device B: Verify level 1 is completed

**Expected Results:**
- ✅ Device B sees level 1 completed
- ✅ Same stars and score
- ✅ Same unlocked levels

### Test Case 32: Simultaneous Play

**Objective:** Verify conflict resolution with simultaneous play

**Steps:**
1. Device A: Go offline
2. Device B: Go offline
3. Device A: Play level 1
4. Device B: Play level 2
5. Device A: Go online, sync
6. Device B: Go online, sync

**Expected Results:**
- ✅ Both progresses merged
- ✅ No data loss
- ✅ Both level 1 and 2 completed on both devices

### Test Case 33: Cloud Overwrite Protection

**Objective:** Verify newer local data not overwritten by older cloud data

**Steps:**
1. Device A: Play level 1, get 3 stars
2. Device A: Turn off WiFi (prevent sync)
3. Device A: Play level 2, get 3 stars
4. Device B: Sign in (has old cloud save with only level 1)
5. Device A: Turn on WiFi, sync

**Expected Results:**
- ✅ Device A keeps both level 1 and 2 progress
- ✅ Device A uploads to cloud
- ✅ Cloud save updated with both levels
- ✅ No data lost

---

## Common Issues & Troubleshooting

### Issue 1: User Cannot Sign In

**Symptoms:**
- "Invalid email or password" error
- Infinite loading spinner
- Network error

**Debugging Steps:**
1. Check internet connection
2. Verify Supabase is accessible:
   ```bash
   curl https://your-project.supabase.co/rest/v1/
   ```
3. Check Supabase dashboard for user:
   ```sql
   SELECT * FROM auth.users WHERE email = 'user@example.com';
   ```
4. Verify environment variables:
   ```bash
   echo $EXPO_PUBLIC_SUPABASE_URL
   echo $EXPO_PUBLIC_SUPABASE_ANON_KEY
   ```
5. Check app logs for errors

**Common Fixes:**
- Clear AsyncStorage and retry
- Reset password via Supabase dashboard
- Check if account exists in auth.users but not in profiles (orphaned account)

### Issue 2: Cloud Sync Not Working

**Symptoms:**
- Progress not syncing across devices
- "Sync failed" error
- Stuck on "Syncing..."

**Debugging Steps:**
1. Check internet connection
2. Check Supabase RLS policies:
   ```sql
   -- User should be able to read/write own data
   SELECT * FROM campaign_progress WHERE user_id = auth.uid();
   ```
3. Check for error logs in console
4. Verify user is authenticated:
   ```typescript
   const { data: { session } } = await supabase.auth.getSession();
   console.log('Session:', session);
   ```
5. Check if campaign_progress row exists:
   ```sql
   SELECT * FROM campaign_progress WHERE user_id = '{user_id}';
   ```

**Common Fixes:**
- Force manual sync from settings
- Sign out and sign back in
- Check RLS policies in Supabase dashboard

### Issue 3: Leaderboard Not Updating

**Symptoms:**
- Scores not appearing
- Rank not updating
- Real-time updates not working

**Debugging Steps:**
1. Check if score was submitted:
   ```sql
   SELECT * FROM leaderboards
   WHERE user_id = '{user_id}' AND level_id = '{level_id}';
   ```
2. Check if flagged:
   ```sql
   SELECT flagged FROM leaderboards
   WHERE user_id = '{user_id}' AND level_id = '{level_id}';
   ```
3. Check for anti-cheat flags:
   ```sql
   SELECT * FROM suspicious_scores WHERE user_id = '{user_id}';
   ```
4. Verify real-time subscription:
   ```typescript
   console.log('Channel status:', channel.state);
   ```

**Common Fixes:**
- Refresh leaderboard manually
- Check if score passed anti-cheat validation
- Verify user not banned

### Issue 4: Achievements Not Unlocking

**Symptoms:**
- Progress not tracking
- Achievement shows wrong progress
- Unlock notification not appearing

**Debugging Steps:**
1. Check achievement_progress table:
   ```sql
   SELECT * FROM achievement_progress
   WHERE user_id = '{user_id}' AND achievement_id = '{achievement_id}';
   ```
2. Verify achievement tracking is being called
3. Check console logs for tracking errors
4. Verify achievement definition exists:
   ```sql
   SELECT * FROM achievements WHERE id = '{achievement_id}';
   ```

**Common Fixes:**
- Manually trigger achievement check
- Verify game events are calling tracking functions
- Check if user is in guest mode (no achievement tracking)

### Issue 5: Daily Rewards Not Available

**Symptoms:**
- Cannot claim daily reward
- "Already claimed today" when shouldn't have
- Streak incorrect

**Debugging Steps:**
1. Check daily_rewards table:
   ```sql
   SELECT * FROM daily_rewards WHERE user_id = '{user_id}';
   ```
2. Verify current date:
   ```typescript
   console.log('Today:', new Date().toISOString().split('T')[0]);
   ```
3. Check last_claim_date
4. Verify time zone settings

**Common Fixes:**
- Check device date/time settings
- Verify UTC vs local time conversion
- Wait until next day (midnight UTC)

---

## Test Environments

### Development Environment

**Supabase Project:** Development
**Database:** development_db
**URL:** https://dev-project.supabase.co

**Test Accounts:**
- `test1@example.com` / `Test1234`
- `test2@example.com` / `Test1234`
- `qa@example.com` / `QA1234`

**Features:**
- Debug logging enabled
- Relaxed rate limits
- Test data can be reset

### Staging Environment

**Supabase Project:** Staging
**Database:** staging_db
**URL:** https://staging-project.supabase.co

**Test Accounts:**
- `staging1@example.com` / `Staging1234`
- `staging2@example.com` / `Staging1234`

**Features:**
- Production-like environment
- Real anti-cheat validation
- No test data resets

### Production Environment

**Supabase Project:** Production
**Database:** production_db
**URL:** https://prod-project.supabase.co

**Features:**
- Live user data
- Full anti-cheat active
- Analytics tracking
- No test accounts

---

## Test Data Management

### Creating Test Users

**Script:**
```typescript
// scripts/create-test-users.ts
import { supabase } from './lib/supabase';

async function createTestUser(index: number) {
  const email = `test${index}@example.com`;
  const password = 'Test1234';
  const nickname = `TestUser${index}`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error(`Failed to create ${email}:`, error);
    return;
  }

  // Create profile
  await supabase.from('profiles').insert({
    id: data.user!.id,
    nickname,
    nationality: 'US',
  });

  console.log(`Created: ${email} / ${password} (${nickname})`);
}

// Create 10 test users
for (let i = 1; i <= 10; i++) {
  await createTestUser(i);
}
```

### Resetting Test Data

**SQL Script:**
```sql
-- WARNING: This deletes all data!
-- Only run in development environment!

-- Delete all user data (cascades to all related tables)
DELETE FROM profiles WHERE nickname LIKE 'TestUser%';

-- Or delete specific user
DELETE FROM profiles WHERE id = '{user_id}';

-- Reset auto-incrementing sequences (if any)
-- (Not needed for UUID primary keys)
```

### Populating Test Leaderboard

```typescript
// scripts/populate-leaderboard.ts
async function populateLeaderboard() {
  const levels = ['city_hall', 'downtown', 'suburbs'];

  for (let i = 1; i <= 100; i++) {
    const userId = `test-user-${i}`;

    for (const level of levels) {
      await supabase.from('leaderboards').insert({
        user_id: userId,
        level_id: level,
        score: Math.floor(Math.random() * 50000),
        stars: Math.floor(Math.random() * 3) + 1,
        completion_time: Math.floor(Math.random() * 600) + 60,
        zombies_killed: Math.floor(Math.random() * 100) + 20,
        hull_integrity: Math.floor(Math.random() * 100),
      });
    }
  }
}
```

---

## Automated Testing

### Unit Tests

**Framework:** Jest + React Testing Library

**Example:**
```typescript
// __tests__/lib/validation.test.ts
import { validateEmail, validatePassword, validateUsername } from '@/lib/validation';

describe('Validation', () => {
  describe('validateEmail', () => {
    it('accepts valid email', () => {
      const result = validateEmail('test@example.com');
      expect(result.valid).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = validateEmail('invalid-email');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('validatePassword', () => {
    it('accepts strong password', () => {
      const result = validatePassword('Test1234');
      expect(result.valid).toBe(true);
    });

    it('rejects weak password', () => {
      const result = validatePassword('weak');
      expect(result.valid).toBe(false);
    });
  });
});
```

**Run Tests:**
```bash
npm test
npm run test:coverage
```

### Integration Tests

**Framework:** Detox (for E2E testing)

**Example:**
```typescript
// e2e/auth.test.ts
describe('Authentication Flow', () => {
  it('should sign up successfully', async () => {
    await element(by.text('SIGN IN')).tap();
    await element(by.text('Sign Up')).tap();

    await element(by.id('signup-email-input')).typeText('test@example.com');
    await element(by.id('signup-password-input')).typeText('Test1234');
    await element(by.id('signup-nickname-input')).typeText('TestUser');

    await element(by.text('CREATE ACCOUNT')).tap();

    await expect(element(by.text('CAMPAIGN MODE'))).toBeVisible();
  });
});
```

---

## Performance Testing

### Load Testing Leaderboards

**Tool:** Apache JMeter or Artillery

**Test Scenario:**
- 1000 concurrent users
- Each fetching global leaderboard
- Measure response time

**Expected Performance:**
- < 100ms for leaderboard fetch
- < 500ms for score submission
- < 50ms for profile fetch

### Sync Performance

**Metrics:**
- Local save: < 50ms
- Cloud upload: < 2s
- Cloud download: < 1s
- Conflict resolution: < 3s

---

## Conclusion

This testing guide covers all critical paths for the Zombie Fleet authentication and gamification system. Regular testing ensures data integrity, user experience quality, and system reliability.

**Testing Checklist:**
- ✅ All authentication flows
- ✅ Cloud sync scenarios
- ✅ Leaderboard operations
- ✅ Achievement tracking
- ✅ Daily rewards
- ✅ Anti-cheat validation
- ✅ Multi-device sync
- ✅ Error handling
- ✅ Performance benchmarks

For production release, all critical and high-priority tests must pass.
