# ZOMBIE FLEET BASTION - 10 LEVELS PARALLEL IMPLEMENTATION PLAN

**Plan ID:** `PLAN-2025-001-PARALLEL`
**Created:** 2025-11-16
**Strategy:** Multi-agent parallel execution for maximum velocity

---

## 🚀 PARALLEL EXECUTION STRATEGY

### Agents Setup
- **Agent A (Architecture)** - Refactoring, types, core systems
- **Agent B (Content)** - Level designs, configs, balancing
- **Agent C (UI/UX)** - Components, screens, visual polish
- **Agent D (Graphics)** - AI prompts, image generation, asset integration

### Dependencies Map
```
WAVE 1 (Parallel - No dependencies)
├─ Agent A: PHASE-001-TYPES
├─ Agent B: PHASE-002-LEVEL-DESIGN
├─ Agent C: PHASE-003-UI-DESIGN
└─ Agent D: PHASE-004-GRAPHICS-PROMPTS

WAVE 2 (Parallel - Depends on Wave 1)
├─ Agent A: PHASE-005-SERVICES + PHASE-006-CONTEXTS
├─ Agent B: PHASE-007-LEVEL-CONFIGS (needs types from A)
└─ Agent C: PHASE-008-UI-COMPONENTS (needs types from A)

WAVE 3 (Parallel - Asset integration)
├─ Agent D: PHASE-009-GENERATE-GRAPHICS (needs prompts from Wave 1)
└─ Agent B: PHASE-010-INTEGRATE-ASSETS (needs graphics from D)

WAVE 4 (Parallel - Integration)
├─ Agent A: PHASE-011-GAME-ENGINE-UPDATE
└─ Agent C: PHASE-012-ROUTING-NAV

WAVE 5 (Sequential - Final integration)
└─ ALL AGENTS: PHASE-013-INTEGRATION-TESTING

WAVE 6 (Parallel - Polish)
├─ Agent A: PHASE-014-TESTS
├─ Agent C: PHASE-015-VISUAL-POLISH
└─ Agent B: PHASE-016-DOCUMENTATION
```

---

## 📊 SCOPE BOUNDARIES

### ✅ IN SCOPE
- 10 unique level configs (hand-crafted waypoints, construction spots)
- Level progression system (unlock flow)
- Star rating (1-3 stars per level)
- Level select screen with UI
- Persistence (save/load progress via AsyncStorage)
- Refactored architecture (3 contexts instead of 1)
- AI prompts for 10 map backgrounds (technical specs included)
- Unit tests for critical logic
- "Endless Mode" preserved as separate mode
- Documentation with file-level comments

### ❌ OUT OF SCOPE (Future Work)
- New tower types (keep only Lookout Post)
- New enemy types (keep 3 existing)
- Meta-progression/permanent upgrades
- Multiplayer
- Leaderboards
- In-app purchases
- Sound effects/music

---

## 📁 NEW FILE STRUCTURE

```
zombies/
├── docs/                          [NEW]
│   ├── plans/
│   │   └── 10-levels-implementation.md
│   ├── architecture/
│   │   ├── contexts-refactor.md
│   │   └── persistence-strategy.md
│   └── prompts/
│       └── map-backgrounds.md     [10 AI prompts with technical specs]
│
├── constants/
│   ├── levels/                    [NEW]
│   │   ├── index.ts
│   │   ├── level-01.ts
│   │   ├── level-02.ts
│   │   ├── ... (level-03 to level-09)
│   │   └── level-10.ts
│   ├── game/                      [REFACTORED - move existing]
│   │   ├── enemies.ts
│   │   ├── towers.ts
│   │   └── waves.ts
│   └── ui/                        [NEW]
│       └── theme.ts
│
├── types/
│   ├── game.ts                    [EXISTS - extend]
│   ├── levels.ts                  [NEW]
│   └── progression.ts             [NEW]
│
├── contexts/
│   ├── GameStateContext.tsx       [NEW - extracted from GameContext]
│   ├── LevelProgressContext.tsx   [NEW]
│   ├── GameActionsContext.tsx     [NEW - extracted from GameContext]
│   └── GameContext.tsx            [DEPRECATED - keep for backwards compat]
│
├── services/                      [NEW]
│   ├── storage.ts                 [AsyncStorage wrapper]
│   ├── levelManager.ts            [Level unlock logic]
│   └── scoreCalculator.ts         [Star rating calculation]
│
├── hooks/
│   ├── useGameEngine.ts           [EXISTS - update to use new contexts]
│   ├── useLevelProgress.ts        [NEW]
│   └── usePersistedState.ts       [NEW]
│
├── app/
│   ├── index.tsx                  [EXISTS - update menu]
│   ├── campaign.tsx               [NEW - level select]
│   ├── game.tsx                   [EXISTS - rename to endless.tsx]
│   ├── level/[id].tsx             [NEW - dynamic route for levels]
│   └── ... (existing files)
│
├── components/
│   ├── game/                      [EXISTS]
│   ├── campaign/                  [NEW]
│   │   ├── LevelCard.tsx
│   │   ├── LevelGrid.tsx
│   │   ├── StarRating.tsx
│   │   ├── DifficultyBadge.tsx
│   │   ├── ProgressBar.tsx
│   │   └── VictoryScreenEnhanced.tsx
│   └── ui/                        [NEW]
│       └── Button.tsx
│
├── __tests__/                     [NEW]
│   ├── services/
│   │   ├── storage.test.ts
│   │   ├── levelManager.test.ts
│   │   └── scoreCalculator.test.ts
│   └── hooks/
│       └── useLevelProgress.test.ts
│
└── assets/images/map/
    ├── backgrounds/               [NEW]
    │   ├── level-01-bg.png
    │   ├── level-02-bg.png
    │   └── ... (level-03 to level-10)
    └── ... (existing)
```

---

## 🌊 WAVE 1: FOUNDATION (4 Agents Parallel)

### **PHASE-001-TYPES** 👤 Agent A
**Duration:** 30-45 min
**Dependencies:** None

**Files to create:**
- `types/levels.ts`
- `types/progression.ts`
- Extend `types/game.ts`

**Key types:**
```typescript
// types/levels.ts
export interface LevelConfig {
  id: string;
  number: number;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';

  // Map
  waypoints: Position[];
  constructionSpots: ConstructionSpot[];
  backgroundImage: string;

  // Gameplay
  totalWaves: number;
  waveConfigs: WaveConfig[];
  startingScrap: number;
  startingHull: number;

  // Progression
  unlockRequirement: string | null;
  rewards: {
    scrapBonus: number;
    baseStars: number;
  };
}

// types/progression.ts
export interface LevelProgress {
  levelId: string;
  completed: boolean;
  starsEarned: number; // 0-3
  bestScore: number;
  timesPlayed: number;
  lastPlayedAt: number | null;
}

export interface PlayerProgress {
  currentLevel: string;
  unlockedLevels: string[];
  levelProgress: Record<string, LevelProgress>;
  totalStars: number;
}

export interface StarRequirements {
  oneStar: { complete: true };
  twoStars: { complete: true; minHullIntegrity: number };
  threeStars: { complete: true; minHullIntegrity: number; perfectDefense: boolean };
}
```

**Deliverable:** Complete type definitions, TypeScript compiles
**Checkpoint:** Types reviewed ✅

---

### **PHASE-002-LEVEL-DESIGN** 👤 Agent B
**Duration:** 45-60 min
**Dependencies:** None (conceptual design only)

**Tasks:**
1. Design 10 unique map layouts (waypoints, construction spots)
2. Plan wave progression for each level
3. Balance difficulty curve
4. Document design decisions

**Level Design Strategy:**

**Levels 1-3: Tutorial Arc (Easy)**
- **Level 1 "First Contact"**: Simple L-shaped path, 4 construction spots, 5 waves (only Shamblers)
- **Level 2 "The Horde Grows"**: S-curved path, 5 spots, 7 waves (Shamblers + Runners)
- **Level 3 "Heavy Infantry"**: Zigzag path, 6 spots, 8 waves (introduce Brute)

**Levels 4-6: Strategic Arc (Medium)**
- **Level 4 "Crossroads"**: Two parallel paths converging, 6 spots, 9 waves
- **Level 5 "The Long March"**: Very winding long path, 7 spots, 10 waves
- **Level 6 "Chokepoint"**: Narrow bottleneck design, 5 strategic spots, 10 waves

**Levels 7-9: Mastery Arc (Hard)**
- **Level 7 "Limited Resources"**: Complex path, only 4 spots (forced choices), 12 waves
- **Level 8 "Speed Run"**: Short path with fast enemies, 8 spots, 10 waves
- **Level 9 "The Labyrinth"**: Maze-like path with many turns, 8 spots, 15 waves

**Level 10: Boss (Hard)**
- **Level 10 "Last Stand"**: Longest path, 10 spots, 20 waves (epic finale)

**Output Format:** `docs/level-designs.md`

**Deliverable:** Complete design document with all 10 levels
**Checkpoint:** Level designs reviewed for balance ✅

---

### **PHASE-003-UI-DESIGN** 👤 Agent C
**Duration:** 30-45 min
**Dependencies:** None

**Tasks:**
1. Create `constants/ui/theme.ts` (design system)
2. Design component specs
3. Plan layout for campaign screen
4. Document UI patterns

**Theme Structure:**
```typescript
export const THEME = {
  colors: {
    background: {
      primary: '#0a0a0a',
      secondary: '#1a1a1a',
      tertiary: '#2a2a2a',
    },
    accent: {
      green: '#4CAF50',
      red: '#FF4444',
      gold: '#FFD700',
      orange: '#FFA500',
    },
    difficulty: {
      easy: '#4CAF50',
      medium: '#FFC107',
      hard: '#F44336',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
      disabled: '#666666',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
};
```

**Component Specs (in docs/ui-specs.md):**
- LevelCard
- StarRating
- DifficultyBadge
- ProgressBar
- VictoryScreenEnhanced

**Deliverable:** Design system + component specs
**Checkpoint:** UI design approved ✅

---

### **PHASE-004-GRAPHICS-PROMPTS** 👤 Agent D
**Duration:** 45-60 min
**Dependencies:** None

**Tasks:**
1. Create `docs/prompts/map-backgrounds.md`
2. Write 10 copy-paste ready AI prompts with FULL technical specs

**Technical Specs (MUST include in ALL prompts):**
- Dimensions: 640x384px (20 tiles × 12 tiles @ 32px/tile)
- Format: PNG, <500KB
- Perspective: Top-down isometric (2.5D)
- Style: Post-apocalyptic, dark theme
- Color palette: Base #2a2a2a, muted earth tones
- Lighting: Dark ambient with dramatic shadows
- Composition: Clear center area for path/towers
- Performance: Optimized for mobile
- Context: Background for tower defense game

**Example Prompt:**
```
Level 1: First Contact

Create a top-down post-apocalyptic game map background, 640x384 pixels.
Scene: Abandoned city street with destroyed buildings on sides.
Style: Dark gritty atmosphere, muted colors (base #2a2a2a gray), desaturated earth tones.
Perspective: Slight isometric (2.5D).
Details: Rubble, abandoned cars, broken street, some overgrown weeds.
Lighting: Dark ambient with dramatic shadows.
Technical: PNG format, clear center area for gameplay, optimized for mobile (<500KB).
Purpose: Background for tower defense game level 1.
```

**Deliverable:** 10 complete AI prompts
**Checkpoint:** Prompts reviewed ✅

---

## 🌊 WAVE 2: CORE IMPLEMENTATION (3 Agents Parallel)

**⚠️ WAIT FOR WAVE 1 APPROVAL BEFORE STARTING**

### **PHASE-005-SERVICES** 👤 Agent A
**Duration:** 60-90 min
**Dependencies:** PHASE-001-TYPES ✅

**Files to create:**
- `services/storage.ts`
- `services/levelManager.ts`
- `services/scoreCalculator.ts`
- `__tests__/services/*.test.ts` (3 test files)

**storage.ts:**
```typescript
const STORAGE_KEY = '@ZombieFleet:PlayerProgress';

export async function savePlayerProgress(progress: PlayerProgress): Promise<void>
export async function getPlayerProgress(): Promise<PlayerProgress | null>
export async function resetProgress(): Promise<void>
```

**levelManager.ts:**
```typescript
export function isLevelUnlocked(levelId: string, progress: PlayerProgress): boolean
export function unlockNextLevel(currentLevelId: string, progress: PlayerProgress): PlayerProgress
export function getNextLevelId(currentLevelId: string): string | null
```

**scoreCalculator.ts:**
```typescript
export function calculateStars(
  completed: boolean,
  hullIntegrity: number,
  startingHull: number
): number
```

**Testing:** Jest tests, coverage ≥80%

**Deliverable:** Services layer complete with tests
**Checkpoint:** All tests passing ✅

---

### **PHASE-006-CONTEXTS** 👤 Agent A (Sequential after PHASE-005)
**Duration:** 90-120 min
**Dependencies:** PHASE-005-SERVICES ✅

**Files to create:**
- `contexts/GameStateContext.tsx` (~80 lines)
- `contexts/LevelProgressContext.tsx` (~100 lines)
- `contexts/GameActionsContext.tsx` (~80 lines)
- `hooks/useLevelProgress.ts`
- `hooks/usePersistedState.ts`

**Files to modify:**
- `contexts/GameContext.tsx` → Add deprecation warning, re-export from new contexts

**Architecture:**
- GameStateContext: Pure game state (enemies, towers, projectiles)
- LevelProgressContext: Player progression, persistence
- GameActionsContext: Game actions (build, upgrade, pause, etc.)

**Deliverable:** Refactored contexts, backwards compatible
**Checkpoint:** App runs without errors ✅

---

### **PHASE-007-LEVEL-CONFIGS** 👤 Agent B
**Duration:** 90-120 min
**Dependencies:** PHASE-001-TYPES ✅, PHASE-002-LEVEL-DESIGN ✅

**Files to create:**
- `constants/levels/index.ts`
- `constants/levels/level-01.ts` through `level-10.ts` (10 files)

**Move existing files:**
- `constants/gameConfig.ts` → `constants/game/config.ts`
- `constants/enemies.ts` → `constants/game/enemies.ts`
- `constants/towers.ts` → `constants/game/towers.ts`
- `constants/waves.ts` → `constants/game/waves.ts`

**Each level config:**
```typescript
export const LEVEL_01: LevelConfig = {
  id: 'level_01',
  number: 1,
  name: 'First Contact',
  description: 'The dead walk. Build your defenses and survive.',
  difficulty: 'easy',
  waypoints: [...],
  constructionSpots: [...],
  backgroundImage: 'level-01-bg.png',
  totalWaves: 5,
  waveConfigs: [...],
  startingScrap: 200,
  startingHull: 20,
  unlockRequirement: null,
  rewards: { scrapBonus: 50, baseStars: 3 },
};
```

**Deliverable:** All 10 levels configured
**Checkpoint:** Configs reviewed for balance ✅

---

### **PHASE-008-UI-COMPONENTS** 👤 Agent C
**Duration:** 120-150 min
**Dependencies:** PHASE-001-TYPES ✅, PHASE-003-UI-DESIGN ✅

**Files to create:**
- `components/campaign/LevelCard.tsx`
- `components/campaign/LevelGrid.tsx`
- `components/campaign/StarRating.tsx`
- `components/campaign/DifficultyBadge.tsx`
- `components/campaign/ProgressBar.tsx`
- `components/campaign/VictoryScreenEnhanced.tsx`
- `components/ui/Button.tsx`

**Component Specs:**
- LevelCard: 160x200px card, shows level info, stars, lock state
- StarRating: Animated 0-3 stars, gold shimmer
- DifficultyBadge: Color-coded badges
- ProgressBar: Linear gradient, animated
- VictoryScreenEnhanced: Modal with star reveal

**Deliverable:** All UI components built
**Checkpoint:** Components reviewed, visually tested ✅

---

## 🌊 WAVE 3: ASSETS (2 Agents Parallel)

**⚠️ WAIT FOR WAVE 2 APPROVAL BEFORE STARTING**

### **PHASE-009-GENERATE-GRAPHICS** 👤 Agent D
**Duration:** Variable (depends on AI tool)
**Dependencies:** PHASE-004-GRAPHICS-PROMPTS ✅

**Tasks:**
1. Use prompts from `docs/prompts/map-backgrounds.md`
2. Generate 10 backgrounds (Midjourney/DALL-E/Stable Diffusion)
3. Download and optimize (<500KB each)
4. Save to `assets/images/map/backgrounds/`
5. Verify dimensions (640x384px)

**Deliverable:** 10 map background images
**Checkpoint:** Images reviewed for quality ✅

---

### **PHASE-010-INTEGRATE-ASSETS** 👤 Agent B
**Duration:** 30-45 min
**Dependencies:** PHASE-009-GENERATE-GRAPHICS ✅, PHASE-007-LEVEL-CONFIGS ✅

**Tasks:**
1. Update level configs with image paths
2. Test all images load in app
3. Verify performance

**Deliverable:** All levels have working backgrounds
**Checkpoint:** Visual test passed ✅

---

## 🌊 WAVE 4: INTEGRATION (2 Agents Parallel)

**⚠️ WAIT FOR WAVE 3 APPROVAL BEFORE STARTING**

### **PHASE-011-GAME-ENGINE-UPDATE** 👤 Agent A
**Duration:** 60-90 min
**Dependencies:** PHASE-006-CONTEXTS ✅, PHASE-007-LEVEL-CONFIGS ✅

**Files to modify:**
- `hooks/useGameEngine.ts` - Accept levelConfig param, use dynamic waypoints/waves
- `components/game/GameMap.tsx` - Accept level config

**Deliverable:** Game engine works with dynamic levels
**Checkpoint:** Test with level 1 ✅

---

### **PHASE-012-ROUTING-NAV** 👤 Agent C
**Duration:** 90-120 min
**Dependencies:** PHASE-008-UI-COMPONENTS ✅, PHASE-007-LEVEL-CONFIGS ✅

**Files to create:**
- `app/campaign.tsx`
- `app/level/[id].tsx`

**Files to modify:**
- `app/index.tsx` - Add "Campaign" button
- `app/game.tsx` → Rename to `app/endless.tsx`
- `app/_layout.tsx` - Add routes

**Deliverable:** Campaign flow complete
**Checkpoint:** Navigation tested ✅

---

## 🌊 WAVE 5: INTEGRATION & TESTING (All Agents)

**⚠️ WAIT FOR WAVE 4 APPROVAL BEFORE STARTING**

### **PHASE-013-INTEGRATION-TESTING** 👤 All Agents
**Duration:** 120-180 min
**Dependencies:** ALL PREVIOUS PHASES ✅

**Testing Checklist:**
- ✅ Play level 1 → complete → earn stars → unlock level 2
- ✅ Stars persist (close/reopen app)
- ✅ All 10 levels playable
- ✅ Endless mode works
- ✅ No TypeScript errors
- ✅ No crashes
- ✅ Build successful: `npm run build && npm start`
- ✅ Performance good (60fps)

**Deliverable:** Fully integrated game
**Checkpoint:** QA approved ✅

---

## 🌊 WAVE 6: POLISH & DOCUMENTATION (3 Agents Parallel)

**⚠️ WAIT FOR WAVE 5 APPROVAL BEFORE STARTING**

### **PHASE-014-TESTS** 👤 Agent A
**Duration:** 60-90 min

**Tasks:**
- Run all Jest tests
- Add missing tests (≥70% coverage)
- Fix failing tests

**Deliverable:** All tests passing
**Checkpoint:** Test report reviewed ✅

---

### **PHASE-015-VISUAL-POLISH** 👤 Agent C
**Duration:** 60-90 min

**Tasks:**
- Animation polish
- Loading/error states
- Accessibility review
- Visual bug fixes

**Deliverable:** Polished UI
**Checkpoint:** Visual review ✅

---

### **PHASE-016-DOCUMENTATION** 👤 Agent B
**Duration:** 60-90 min

**Tasks:**
- File-level comments (all files)
- Update README.md
- Architecture docs

**Deliverable:** Complete documentation
**Checkpoint:** Docs reviewed ✅

---

## 📊 EXECUTION SUMMARY

### Total Phases: 16
### Total Waves: 6
### Parallel Opportunities: 13 phases (81% parallelizable)

### Timeline Estimate:
- **Sequential:** ~20-25 hours
- **Parallel (4 agents):** ~8-10 hours
- **Speedup:** ~2.5x faster

### Agent Workload:
- **Agent A:** 6 phases, ~7-9 hours
- **Agent B:** 5 phases, ~7-9 hours
- **Agent C:** 5 phases, ~7-9 hours
- **Agent D:** 2 phases, ~2-3 hours

---

## ✅ DEFINITION OF DONE

**Per Phase:**
- Code complete and tested
- TypeScript compiles
- Checkpoint deliverables met
- File comments added
- Git commit created

**Overall Project:**
- All 16 phases complete
- Campaign mode functional
- 10 levels playable
- Persistence working
- Endless mode preserved
- Tests passing (≥70%)
- Documentation complete
- Build successful

---

## 📝 NOTES

- Each agent works independently until merge point
- Checkpoints are blockers - wait for approval
- Communication via shared files
- Quality gates at each wave
- Keep local branches after merge (Cursor Rules)

---

**Status:** Plan approved, ready for Wave 1 execution
