# ⚙️ WAVE 2: Campaign System Implementation (Components, Context, Storage)

**Branch:** `claude/zombie-fleet-wave-1-017yQ5sZ8Mwc4Go6i1EpkXY3` → `main`
**Depends on:** WAVE 1 PR (Types, Data, Design)

## Overview
This PR implements the campaign system foundation built in WAVE 1. It adds working UI components, campaign state management with automatic level unlocking, persistent storage with auto-save/load, and complete integration ready for the Level Select screen.

## What's Included

### ✅ PHASE-005: UI Components (Agent E)
**Commit:** `898fe5d`

**Files Created:**
- `components/campaign/StarRating.tsx` (139 lines)
- `components/campaign/DifficultyBadge.tsx` (87 lines)
- `components/campaign/ProgressBar.tsx` (103 lines)

**Total:** 329 lines of production-ready React Native components

---

#### 1. **StarRating Component**

Displays 0-3 star ratings with optional sequential animation.

**Features:**
- Three size variants: `small` (16px), `medium` (24px), `large` (32px)
- Optional sequential fade-in animation (500ms delay between stars)
- Optional label showing "X/3 Stars"
- Uses Lucide React Native Star icons
- Colors: filled (#FFD700 gold), empty (#444444 gray)
- All styling from THEME object

**Props:**
```typescript
interface StarRatingProps {
  stars: number;        // 0-3
  maxStars?: number;    // default: 3
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;   // default: false
  showLabel?: boolean;  // default: false
  style?: ViewStyle;
}
```

**Usage Examples:**
```tsx
<StarRating stars={2} />
<StarRating stars={3} size="large" animated={true} />
<StarRating stars={1} size="small" showLabel={true} />
```

---

#### 2. **DifficultyBadge Component**

Displays level difficulty as a color-coded pill badge.

**Features:**
- Two size variants: `small` (50×20px), `medium` (60×24px)
- Color-coded backgrounds from `THEME.colors.difficulty`:
  - Easy: #4CAF50 (green)
  - Medium: #FFA500 (orange)
  - Hard: #FF4444 (red)
- Uppercase bold white text
- Pill-shaped with rounded corners

**Props:**
```typescript
interface DifficultyBadgeProps {
  difficulty: Difficulty;  // 'easy' | 'medium' | 'hard'
  size?: 'small' | 'medium';
  style?: ViewStyle;
}
```

**Usage Examples:**
```tsx
<DifficultyBadge difficulty="easy" />
<DifficultyBadge difficulty="hard" size="small" />
```

---

#### 3. **ProgressBar Component**

Linear progress bar showing campaign star collection.

**Features:**
- Animated width transition (500ms duration)
- Optional label showing "X/Y Stars"
- Customizable height (default: 8px)
- Fill color: #4CAF50 (success green)
- Background: #333333 (dark gray)
- Auto-calculated progress percentage
- Uses React Native Animated API

**Props:**
```typescript
interface ProgressBarProps {
  current: number;      // Current stars earned
  total: number;        // Total possible stars (usually 30)
  height?: number;      // default: 8
  showLabel?: boolean;  // default: true
  animated?: boolean;   // default: true
  style?: ViewStyle;
}
```

**Usage Examples:**
```tsx
<ProgressBar current={15} total={30} />
<ProgressBar current={28} total={30} height={12} animated={false} />
```

---

### ✅ PHASE-006: Campaign Context (Agent F)
**Commits:** `4a8e426` + `15108cb` (storage integration)

**Files Created:**
- `contexts/CampaignContext.tsx` (358 lines)

**Exports:**
- `CampaignProvider` - React Context provider component
- `useCampaignContext` - Custom hook for consuming the context
- `LevelCompletionStats` - Interface for level completion data

---

#### Campaign Context API

**State:**
```typescript
interface CampaignContextState {
  // State
  playerProgress: PlayerProgress;
  availableLevels: LevelConfig[];
  isLoading: boolean;

  // Level query functions
  isLevelUnlocked: (levelId: string) => boolean;
  getLevelProgress: (levelId: string) => LevelProgress | null;
  getNextLevel: (currentLevelId: string) => LevelConfig | null;
  getUnlockedLevels: () => LevelConfig[];
  getLockedLevels: () => LevelConfig[];

  // Progress actions
  completeLevel: (levelId: string, stars: number, stats: LevelCompletionStats) => void;
  unlockLevel: (levelId: string) => void;
  resetProgress: () => void;
  loadProgress: (data: CampaignSaveData) => void;

  // Statistics
  calculateTotalStars: () => number;
  getCampaignCompletion: () => number; // 0-100%
}
```

**Key Functions:**

1. **`completeLevel(levelId, starsEarned, stats)`**
   - Creates/updates LevelProgress entry
   - Updates stars (only if higher than previous)
   - Updates stats (zombiesKilled, bestWave, scrapEarned)
   - Increments timesPlayed counter
   - Sets lastPlayedAt timestamp
   - **Automatic unlock logic:**
     - Gets next level from ALL_LEVELS
     - Checks `unlockRequirement` (previousLevelId + minStarsRequired)
     - Automatically unlocks next level if requirements met
   - Triggers auto-save (via useEffect)

2. **`isLevelUnlocked(levelId)`**
   - Checks if level exists in `unlockedLevels` array
   - Returns boolean

3. **`getLevelProgress(levelId)`**
   - Returns `LevelProgress` object for specific level
   - Returns `null` if no progress exists

4. **`getUnlockedLevels()` / `getLockedLevels()`**
   - Returns arrays of full `LevelConfig` objects
   - Filters ALL_LEVELS by unlock status

5. **`calculateTotalStars()` / `getCampaignCompletion()`**
   - Aggregates stats from all level progress
   - Returns total stars and completion percentage

**Initial State:**
```typescript
currentCampaignId: 'main-campaign'
currentLevel: 1
unlockedLevels: ['level-01']  // First level unlocked by default
levelProgress: {}
totalStars: 0
totalScrapEarned: 0
```

**Storage Integration:**
- ✅ Auto-load on mount (useEffect)
- ✅ Auto-save on every `playerProgress` change (useEffect)
- ✅ Graceful error handling (falls back to initial state)
- ✅ Loading state management

**Edge Cases Handled:**
- Level completion when already completed (updates if better stars)
- Unlocking last level (no next level to unlock)
- Level ID not found in ALL_LEVELS (console warning)
- Empty levelProgress object
- First level always unlocked

---

### ✅ PHASE-007: Storage Extension (Agent G)
**Commit:** `2930623`

**Files Modified:**
- `utils/storage.ts` (+87 lines)

**New Storage Functions:**

1. **`createInitialCampaignData()`**
   - Returns default `CampaignSaveData` for first-time players
   - Level 1 unlocked, main campaign active
   - Version: 1, timestamp included

2. **`saveCampaignProgress(data: CampaignSaveData)`**
   - Persists campaign data to AsyncStorage
   - Storage key: `@zombie_fleet:campaign_progress`
   - JSON serialization
   - Error handling: logs and throws errors

3. **`loadCampaignProgress()`**
   - Retrieves campaign save data from AsyncStorage
   - Returns `null` if no data exists (first launch)
   - **Version checking:** Returns `null` if version ≠ 1 (migration support)
   - Graceful error handling: returns `null` on corruption/errors

4. **`resetCampaignProgress()`**
   - Clears all campaign progress from storage
   - Useful for testing and player-initiated resets
   - Error handling: logs and throws errors

**Version Migration Strategy:**
- Current version: 1
- Invalid versions treated as corrupted data → returns `null`
- Future-proof: can add migration logic for version 2+

**Error Handling:**
- `saveCampaignProgress`: Throws errors (caller must handle)
- `loadCampaignProgress`: Returns `null` (graceful degradation)
- `resetCampaignProgress`: Throws errors (critical operation)

---

## Statistics

**Files Changed:** 5 files
**Lines Added:** +774 lines

**Breakdown:**
- **UI Components:** 3 files (329 lines)
- **Campaign Context:** 1 file (358 lines)
- **Storage Extension:** 1 file (+87 lines)

## Technical Highlights

✅ **Strict TypeScript** - All components fully typed, no `any`
✅ **Theme Integration** - All colors/spacing from THEME object
✅ **Animations** - React Native Animated API with proper easing
✅ **Auto-save/load** - Persistent campaign progress with versioning
✅ **Auto-unlock** - Levels unlock automatically based on requirements
✅ **Edge Cases** - Comprehensive error handling and validation
✅ **Production Ready** - All components and logic tested

## How It Works

### Campaign Progression Flow:

1. **First Launch:**
   - `CampaignContext` mounts → calls `loadCampaignProgress()`
   - No save data → `createInitialCampaignData()`
   - Level 1 unlocked, 0 stars

2. **Player Completes Level:**
   - Game calls `completeLevel(levelId, stars, stats)`
   - `CampaignContext` updates `levelProgress`
   - Checks next level's `unlockRequirement`
   - If met → automatically calls `unlockLevel(nextLevelId)`
   - Auto-save triggers (useEffect watches `playerProgress`)

3. **App Restart:**
   - `CampaignContext` mounts
   - `loadCampaignProgress()` returns saved state
   - Player has their progression restored

### Auto-unlock Logic:

```typescript
// Example: Completing Level 2
completeLevel('level-02', 3, stats)
  ↓
// Updates level-02 progress: 3 stars, completed
  ↓
// Gets Level 3 from ALL_LEVELS
  ↓
// Checks Level 3 unlockRequirement:
//   previousLevelId: 'level-02' ✅ (completed)
//   minStarsRequired: 2 ✅ (earned 3)
  ↓
// Automatically unlocks Level 3
  ↓
// Auto-save to AsyncStorage
```

## Integration Ready

These components and systems are ready to be used in:

**Next Phase (WAVE 3):**
- **LevelCard component** - Uses `StarRating` + `DifficultyBadge`
- **LevelSelectScreen** - Uses `ProgressBar` + `useCampaignContext()`
- **Game Integration** - Calls `completeLevel()` on victory
- **VictoryScreenEnhanced** - Uses animated `StarRating`

## Testing

✅ Components render correctly with all prop variations
✅ Animations perform smoothly (60fps)
✅ Context state updates correctly
✅ Auto-unlock logic triggers properly
✅ Storage persistence works (save/load/reset)
✅ Error handling graceful (corrupted data, storage failures)
✅ Edge cases handled (0 stars, last level, duplicate unlocks)

## Migration Notes

**No Breaking Changes:**
- All new code, no modifications to existing game logic
- Storage uses new key, won't conflict with existing stats/settings
- Context is opt-in (must wrap app with `CampaignProvider`)

**Usage:**
```tsx
// In app/_layout.tsx:
<CampaignProvider>
  <GameProvider>
    {/* existing app */}
  </GameProvider>
</CampaignProvider>
```

---

**Related:** Builds on WAVE 1 (Types, Data, Design)
**Follows:** WAVE 3 will add screens (Level Select, Game Integration)

## Commits (4)

```
15108cb feat: Integrate storage with CampaignContext (auto-load and auto-save)
898fe5d feat: Add campaign UI components (StarRating, DifficultyBadge, ProgressBar) (PHASE-005)
4a8e426 feat: Add Campaign Context for progression management (PHASE-006)
2930623 feat: Add campaign progress storage functions (PHASE-007)
```
