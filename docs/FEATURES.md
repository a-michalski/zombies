# Zombie Fleet - Feature Overview

**Version:** 2.0 MVP
**Last Updated:** November 19, 2025
**Status:** Production Ready

## Table of Contents

1. [System Overview](#system-overview)
2. [Authentication System](#authentication-system)
3. [Gamification Features](#gamification-features)
4. [Cloud Sync & Multi-Device](#cloud-sync--multi-device)
5. [Anti-Cheat System](#anti-cheat-system)
6. [User Flows](#user-flows)
7. [Feature Highlights](#feature-highlights)
8. [Technical Architecture](#technical-architecture)

---

## System Overview

Zombie Fleet is a tower defense game featuring a comprehensive authentication and gamification system. The system provides:

- **Email/Password Authentication** with secure cloud backend
- **Guest Mode** with seamless account conversion
- **Cloud Save System** for cross-device progression
- **Global & Regional Leaderboards** with real-time updates
- **Achievement System** with progress tracking
- **Daily Rewards** with login streaks
- **Anti-Cheat Validation** for score submissions
- **Multi-Device Sync** with conflict resolution

### Platform Support

- **iOS** - Native app via Expo
- **Android** - Native app via Expo
- **Web** - Progressive Web App
- **Cross-Platform** - Shared codebase with React Native

---

## Authentication System

### 1. Sign Up Flow

**Screen:** `/app/login.tsx`

**Features:**
- Email & password registration
- Real-time nickname validation
- Nationality selection with flag picker
- Password strength requirements
- Duplicate email detection
- Reserved username protection

**Validation Rules:**
- **Email:** Must be valid email format
- **Password:** Minimum 8 characters, must include uppercase, lowercase, and number
- **Nickname:** 3-20 characters, alphanumeric and underscores only
- **Nationality:** ISO 3166-1 alpha-2 country codes

**User Profile Fields:**
```typescript
{
  id: string;              // UUID from auth.users
  nickname: string;        // Unique username (3-20 chars)
  nationality: string;     // Country code (e.g., 'US', 'PL')
  avatar_url: string;      // Optional avatar URL
  created_at: timestamp;   // Account creation
  updated_at: timestamp;   // Last profile update
  last_seen_at: timestamp; // Last app launch
}
```

**Success State:**
1. User account created in `auth.users`
2. Profile created in `profiles` table
3. Player stats initialized automatically (via trigger)
4. Daily rewards record created automatically (via trigger)
5. Session token stored in AsyncStorage
6. User redirected to campaign screen

### 2. Sign In Flow

**Screen:** `/app/login.tsx`

**Features:**
- Email & password authentication
- Session persistence across app restarts
- Auto-login if session valid
- Cloud sync triggered on login

**Login Process:**
1. Validate email/password
2. Authenticate with Supabase Auth
3. Fetch user profile
4. Trigger cloud sync (bidirectional)
5. Resolve any save conflicts
6. Load campaign progress
7. Update last_seen_at timestamp

### 3. Guest Mode

**Features:**
- Play without account
- Local save only (no cloud backup)
- Limited leaderboard access (read-only)
- No achievements or daily rewards
- Seamless conversion to full account

**Guest Mode Limitations:**
- Cannot submit scores to leaderboard
- Cannot unlock achievements
- No cloud save (progress lost on uninstall)
- No daily rewards
- Cannot compete globally

**Convert to Account Flow:**

**Screen:** `/app/convert-account.tsx`

**Process:**
1. User clicks "Save Progress" in guest mode
2. Shows signup form with email, password, nickname, nationality
3. Creates account with existing local save
4. Uploads local progress to cloud
5. Preserves all campaign progress
6. User becomes authenticated
7. Full feature access granted

### 4. Session Management

**Session Persistence:**
- Sessions stored in AsyncStorage
- Auto-refresh tokens enabled
- Session expires after 7 days of inactivity
- Logout clears local session and cache

**Security Features:**
- Row Level Security (RLS) on all tables
- Users can only access/modify their own data
- Public read access for profiles and leaderboards
- Private access for campaign progress and rewards

---

## Gamification Features

### 1. Leaderboards

**Screens:**
- `/app/leaderboard.tsx` - Global leaderboards
- `/app/stats.tsx` - Personal statistics

**Leaderboard Types:**

#### Global Leaderboard
- Aggregates scores across all levels
- Shows total score, stars, and levels completed
- Real-time updates via Supabase realtime
- Paginated (100 entries per page)

#### Level-Specific Leaderboards
- Best score per user per level
- Displays: score, stars, completion time, zombies killed, hull integrity
- Filtered by flagged status (cheaters hidden)
- User rank and percentile shown

#### Regional Leaderboards
- Filtered by nationality
- Uses database function for optimized queries
- Shows country rankings

**Leaderboard Entry Data:**
```typescript
{
  user_id: string;
  level_id: string;
  score: number;
  stars: 1 | 2 | 3;
  completion_time: number;      // seconds
  zombies_killed: number;
  hull_integrity: number;       // 0-100
  gameplay_hash: string;        // Anti-cheat verification
  client_version: string;
  flagged: boolean;             // Suspicious score
  created_at: timestamp;
  updated_at: timestamp;
}
```

**Features:**
- Best score per level (upsert pattern)
- Real-time updates when new scores posted
- Friend leaderboards (Phase 2)
- Time-based filters (all time, this week, this month)

### 2. Achievements

**Screen:** `/app/achievements.tsx`

**Achievement Categories:**
- **Combat** - Kill counts, combat milestones
- **Progression** - Level completions, star collections
- **Special** - Perfect runs, speed runs, unique challenges

**Default Achievements:**

| Achievement | Requirement | Reward |
|------------|-------------|--------|
| First Blood | Kill 1 zombie | 100 scrap |
| Zombie Slayer | Kill 100 zombies | 500 scrap |
| Zombie Massacre | Kill 1000 zombies | 2000 scrap |
| First Victory | Complete 1 level | 200 scrap |
| Perfect Defense | Complete level with 100% hull | 1000 scrap |
| Speed Demon | Complete level in under 5 min | 750 scrap |
| Three Star Master | Get 3 stars on 10 levels | 1500 scrap |
| Completionist | Get 3 stars on all levels | Golden Tower Skin |

**Progress Tracking:**
```typescript
{
  user_id: string;
  achievement_id: string;
  progress: number;          // Current progress
  completed: boolean;
  completed_at: timestamp;
  created_at: timestamp;
  updated_at: timestamp;
}
```

**Features:**
- Real-time progress updates
- Automatic unlock detection
- Progress persistence in cloud
- Reward claiming (scrap, skins, etc.)
- Achievement notifications
- Statistics dashboard (total unlocked, completion %)

### 3. Daily Rewards

**Screen:** `/app/rewards.tsx`

**Reward Schedule (7-day cycle):**

| Day | Reward |
|-----|--------|
| 1 | 100 Scrap |
| 2 | 150 Scrap |
| 3 | 200 Scrap |
| 4 | 250 Scrap |
| 5 | 300 Scrap |
| 6 | 400 Scrap |
| 7 | 500 Scrap + Bonus |

**Streak Tracking:**
```typescript
{
  user_id: string;
  current_streak: number;     // Days in a row
  longest_streak: number;     // All-time best
  last_claim_date: date;      // YYYY-MM-DD
  total_rewards_claimed: number;
}
```

**Features:**
- Daily check-in system
- Streak bonuses
- Streak expiration (24h grace period)
- Visual streak calendar
- Streak warnings (< 6 hours to expire)
- Reset at midnight UTC

**Streak Rules:**
- Miss a day: streak resets to 1
- Consecutive days: streak increments
- Grace period: Can claim until end of next day
- Cycle repeats after day 7

### 4. Player Statistics

**Screen:** `/app/stats.tsx`

**Tracked Stats:**
```typescript
{
  user_id: string;
  total_games: number;
  total_zombies_killed: number;
  total_stars: number;
  total_playtime: number;      // seconds
  best_wave: number;
  created_at: timestamp;
  updated_at: timestamp;
}
```

**Displays:**
- Total kills
- Total games played
- Total stars earned
- Best wave reached
- Total playtime (formatted as hours:minutes)
- Account creation date
- Account age

**Features:**
- Auto-updated after each game
- Aggregated across all levels
- Visible to all users (public profile)
- Historical tracking

---

## Cloud Sync & Multi-Device

### Cloud Save Structure

**Campaign Progress:**
```typescript
{
  playerProgress: {
    currentCampaignId: string;
    currentLevel: number;
    unlockedLevels: string[];
    levelProgress: {
      [levelId: string]: {
        levelId: string;
        completed: boolean;
        starsEarned: number;
        bestScore: number;
        bestWave: number;
        timesPlayed: number;
        lastPlayedAt: timestamp;
      }
    };
    totalStars: number;
    totalScrapEarned: number;
  };
  version: number;
  lastUpdated: timestamp;
}
```

### Sync Flow

**On App Launch (Authenticated User):**
1. Check for internet connection
2. Load local save from AsyncStorage
3. Download cloud save from Supabase
4. Compare timestamps
5. Resolve conflicts if any
6. Update local and cloud with resolved version

**Conflict Resolution Strategy:**

**Last-Write-Wins:**
- If timestamps differ by > 1 minute, use newer save
- If local is newer → upload to cloud
- If cloud is newer → download and save locally

**Merge Strategy:**
- If timestamps very close (< 1 minute) → merge
- Take max of all progress values
- Union of unlocked levels
- Best score per level
- Preserve highest stats

**On Level Completion:**
1. Update local save immediately
2. Queue cloud upload (non-blocking)
3. Upload in background
4. Retry on failure

**Device ID Tracking:**
- Unique device ID stored in AsyncStorage
- Tracked in campaign_progress table
- Used for debugging multi-device issues

**Offline Support:**
- Full game playable offline
- Saves queued for sync when online
- Manual sync button in settings
- Sync status indicators (syncing, synced, offline)

---

## Anti-Cheat System

### Score Validation

**Validation Checks:**

1. **Rate Limiting**
   - Max 10 submissions per minute
   - Prevents score spamming
   - Flagged if exceeded

2. **Score Range Validation**
   - Calculates theoretical max score per level
   - Based on zombies, waves, time bonuses
   - Rejects if score > theoretical max
   - Flags if > 95% of max (suspicious)

3. **Time Validation**
   - Calculates min/max completion time
   - Min = 10 seconds per wave
   - Max = 180 seconds per wave
   - Rejects if impossible time

4. **Zombie Count Validation**
   - Verifies zombies killed vs level config
   - Must kill at least 80% of total zombies
   - Cannot exceed total zombie count

5. **Gameplay Hash Verification**
   - Optional SHA-256 hash of gameplay events
   - Validates consistency of submission
   - Future: Server-side replay validation

6. **Consistency Checks**
   - Stars vs Score correlation
   - Hull vs Stars correlation
   - Kill rate vs time validation

**Suspicious Score Handling:**

```typescript
{
  user_id: string;
  level_id: string;
  score: number;
  reason: string;              // Comma-separated reasons
  metadata: json;              // Validation details
  auto_banned: boolean;        // Auto-ban flag
  reviewed: boolean;           // Manual review status
  reviewed_by: user_id;
  reviewed_at: timestamp;
}
```

**Ban System:**

```typescript
{
  user_id: string;
  reason: string;
  banned_by: user_id;
  banned_until: timestamp;     // null if permanent
  permanent: boolean;
  active: boolean;
  created_at: timestamp;
  lifted_at: timestamp;
}
```

**Ban Enforcement:**
- Checked before score submission
- Temporary bans (time-limited)
- Permanent bans
- Manual review system for admins

**Edge Function (Future):**
- Deploy validation to Supabase Edge Functions
- Server-side validation only
- Cannot be bypassed by client modification
- Cryptographic verification

---

## User Flows

### First-Time User (Signup)

```
1. Open app → Main Menu
2. Click "SIGN IN" button
3. Switch to "Sign Up" tab
4. Enter email
5. Enter password (real-time validation)
6. Enter nickname (checks availability)
7. Select nationality (flag picker)
8. Click "CREATE ACCOUNT"
9. Account created + profile initialized
10. Redirect to campaign screen
11. Cloud sync initiated
12. Play tutorial (optional)
```

### Returning User (Signin)

```
1. Open app → Main Menu
2. Auto-login if session valid
   → OR →
3. Click "SIGN IN"
4. Enter email & password
5. Click "SIGN IN"
6. Cloud sync initiated
7. Conflict resolution (if needed)
8. Redirect to campaign screen
9. Resume progress
```

### Guest User

```
1. Open app → Main Menu
2. Click "PLAY AS GUEST"
3. Redirect to campaign screen
4. Play game (local save only)
5. See "Save Progress" banner
6. Click "Save Progress"
7. Redirect to account creation
8. Fill signup form
9. Account created with existing progress
10. Progress uploaded to cloud
11. Full features unlocked
```

### Level Completion (Authenticated)

```
1. Complete level
2. Calculate score
3. Submit to leaderboard
   ├─ Anti-cheat validation
   ├─ Check if banned
   ├─ Validate score/time/zombies
   └─ Accept or reject
4. Update player stats
5. Update campaign progress
6. Track achievements progress
7. Check for achievement unlocks
8. Save locally
9. Upload to cloud (background)
10. Show results screen
11. Display rank/achievements
```

### Daily Reward Claim

```
1. Open app (once per day)
2. Check if reward available
3. Show daily reward popup
4. Click "CLAIM REWARD"
5. Update streak
6. Grant reward (scrap)
7. Show next reward preview
8. Dismiss popup
```

### Leaderboard Viewing

```
1. Click "Leaderboard" from main menu
2. Load global leaderboard
   ├─ Show top 100 users
   ├─ Show user's rank
   └─ Real-time updates
3. Switch tabs:
   ├─ Global (all users)
   ├─ Regional (by country)
   ├─ Friends (Phase 2)
   └─ Level-specific
4. Scroll to load more
5. See score details (time, stars, etc.)
```

---

## Feature Highlights

### For Players

**Why Create an Account?**
- ☁️ **Cloud Save** - Never lose progress
- 🏆 **Leaderboards** - Compete globally
- 🎖️ **Achievements** - Unlock rewards
- 🎁 **Daily Rewards** - Free scrap every day
- 📱 **Multi-Device** - Play on phone and tablet
- 🌍 **Regional Rankings** - Compete with your country

**Why Play as Guest?**
- 🚀 **Instant Play** - No signup required
- 🎮 **Full Gameplay** - All levels available
- 💾 **Local Save** - Progress saved on device
- 🔄 **Easy Conversion** - Upgrade to account anytime

### For Developers

**Scalability:**
- Supabase backend (PostgreSQL + Realtime)
- Row Level Security for data protection
- Optimized queries with indexes
- Database views for complex aggregations
- Edge Functions ready for anti-cheat

**Maintainability:**
- Type-safe TypeScript
- Modular service architecture
- Comprehensive error handling
- Analytics tracking throughout
- Testing-ready structure

**Security:**
- Password hashing (bcrypt)
- JWT session tokens
- RLS policies on all tables
- Anti-cheat validation
- Reserved username protection
- Rate limiting

---

## Technical Architecture

### Frontend Stack
- **React Native** (0.79.1)
- **Expo** (53.0.4)
- **Expo Router** (5.0.3) - File-based routing
- **TypeScript** (5.8.3)
- **AsyncStorage** (2.1.2) - Local persistence
- **Zustand** (5.0.2) - State management
- **React Query** (5.83.0) - Server state

### Backend Stack
- **Supabase** - PostgreSQL + Auth + Realtime
- **PostgreSQL** - Primary database
- **Edge Functions** - Server-side validation (planned)
- **Realtime** - WebSocket subscriptions

### Services Layer

**Authentication:**
- `/lib/supabase.ts` - Client configuration
- `/contexts/AuthContext.tsx` - Auth state management

**Profile Management:**
- `/lib/profile.ts` - CRUD operations
- `/lib/validation.ts` - Input validation

**Gamification:**
- `/lib/leaderboard.ts` - Leaderboard queries
- `/lib/achievements.ts` - Achievement tracking
- `/lib/dailyRewards.ts` - Reward claiming
- `/lib/antiCheat.ts` - Score validation

**Cloud Sync:**
- `/lib/cloudSync.ts` - Bidirectional sync
- `/utils/storage.ts` - Local storage helpers

**Analytics:**
- `/lib/analytics.ts` - Event tracking

### Database Schema

**Tables:**
- `profiles` - User profiles
- `campaign_progress` - Cloud saves
- `leaderboards` - Score submissions
- `player_stats` - Aggregate statistics
- `achievements` - Achievement definitions
- `achievement_progress` - User progress
- `daily_rewards` - Streak tracking
- `suspicious_scores` - Anti-cheat logs
- `user_bans` - Ban management
- `username_history` - Nickname changes
- `reserved_usernames` - Protected names
- `friends` - Social features (Phase 2)

**Views:**
- `global_leaderboard` - Aggregated scores

**Functions:**
- `get_regional_leaderboard(country_code)` - Regional rankings
- `update_updated_at_column()` - Timestamp trigger
- `create_player_stats_for_new_profile()` - Auto-init stats
- `create_daily_rewards_for_new_profile()` - Auto-init rewards

### Screens

**Authentication:**
- `/app/index.tsx` - Main menu
- `/app/login.tsx` - Sign in/up
- `/app/convert-account.tsx` - Guest conversion

**Gamification:**
- `/app/leaderboard.tsx` - Leaderboards
- `/app/achievements.tsx` - Achievement list
- `/app/rewards.tsx` - Daily rewards
- `/app/stats.tsx` - Player statistics

**Game:**
- `/app/levels.tsx` - Campaign map
- `/app/game.tsx` - Gameplay screen

**Settings:**
- `/app/settings.tsx` - User settings
- `/app/about.tsx` - About/credits
- `/app/privacy.tsx` - Privacy policy
- `/app/terms.tsx` - Terms of service

---

## Marketing Features

### Player Retention
- **Daily Rewards** - Incentivizes daily logins
- **Achievements** - Long-term goals
- **Leaderboards** - Competitive motivation
- **Cloud Save** - Reduces churn (no lost progress)
- **Streaks** - Habit formation

### Engagement
- **Real-time Leaderboards** - Immediate feedback
- **Regional Competition** - National pride
- **Achievement Notifications** - Dopamine hits
- **Progress Tracking** - Visible improvement

### Monetization Ready
- **Scrap Currency** - In-game currency system
- **Cosmetic Rewards** - Tower skins, flags
- **Premium Features** - Ad-free, bonus scrap (future)
- **Battle Pass** - Seasonal rewards (future)

### Social Features (Phase 2)
- **Friends System** - Add/manage friends
- **Friend Leaderboards** - Compete with friends
- **Challenges** - Send level challenges
- **Chat** - In-game messaging

---

## Performance Metrics

**Database Performance:**
- Indexed queries for fast leaderboard loading
- Materialized view for global leaderboard (< 100ms)
- Pagination for large result sets
- Connection pooling via Supabase

**App Performance:**
- Local-first approach (instant saves)
- Background sync (non-blocking)
- Optimistic UI updates
- Cached leaderboard data

**Scalability:**
- Horizontal scaling via Supabase
- Read replicas for leaderboards
- Edge Functions for compute-heavy tasks
- CDN for static assets

---

## Future Enhancements

### Phase 2 - Social Features
- Friends system
- Friend leaderboards
- Direct challenges
- In-game chat
- Friend requests/blocking

### Phase 3 - Advanced Gamification
- Seasons & Battle Pass
- Clans/Guilds
- Clan wars
- Weekly tournaments
- Special events

### Phase 4 - Monetization
- In-app purchases (scrap packs)
- Premium subscription (ad-free + bonuses)
- Cosmetic shop (skins, flags, effects)
- Battle Pass system

### Phase 5 - Competitive
- Ranked mode
- ELO rating system
- Pro leagues
- Spectator mode
- Replays

---

## Conclusion

Zombie Fleet features a production-ready authentication and gamification system with:
- ✅ Secure authentication with guest mode
- ✅ Cloud save with multi-device sync
- ✅ Global and regional leaderboards
- ✅ Comprehensive achievement system
- ✅ Daily rewards with streaks
- ✅ Anti-cheat validation
- ✅ Player statistics tracking
- ✅ Scalable backend architecture

The system is designed for player retention, competitive play, and future monetization while maintaining security and performance.
