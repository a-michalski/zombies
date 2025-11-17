# 🏗️ WAVE 1: Campaign System Foundation (Types, Data, Design)

**Branch:** `claude/wave-1-foundation-017yQ5sZ8Mwc4Go6i1EpkXY3` → `main`

## Overview
This PR adds the foundational layer for the 10-level campaign system in Zombie Fleet Bastion. It includes complete TypeScript type definitions, 10 fully-designed levels, a centralized UI design system, and AI prompts for generating map backgrounds.

## What's Included

### ✅ PHASE-001: Type Definitions (Agent A)
**Commit:** `deffe11`

**Files Created:**
- `types/map.ts` - MapConfig, WaveConfig, ConstructionSpotConfig (88 lines)
- `types/levels.ts` - LevelConfig, CampaignConfig, StarRequirements (136 lines)
- `types/progression.ts` - PlayerProgress, LevelProgress, CampaignSaveData (76 lines)
- `types/game.ts` (extended +22 lines) - GameSessionConfig for campaign mode

**Key Types:**
- Complete level configuration with waypoints, construction spots, waves
- 0-3 star rating system with multiple requirement types (hull%, time, tower limits)
- Level unlock requirements (previous level + min stars)
- Backward compatible (sessionConfig optional)

**Total:** 322 lines of strict TypeScript

---

### ✅ PHASE-002: Level Design (Agent B)
**Commit:** `dd894e1`

**Files Created:**
- `data/maps/level-01.ts` → `level-10.ts` (10 level configurations)
- `data/maps/index.ts` - Barrel export + helper functions (90 lines)
- `docs/level-designs.md` - Comprehensive documentation with ASCII maps (581 lines)

**10 Campaign Levels:**

**Tutorial (Levels 1-3):**
1. **First Contact** (Easy) - L-shaped path, 5 waves, shamblers only, 200 scrap
2. **The Horde Grows** (Easy) - S-curve, 7 waves, introduces runners
3. **Heavy Infantry** (Easy) - Zigzag, 8 waves, first brute enemy

**Strategic (Levels 4-6):**
4. **Crossroads** (Medium) - Complex winding path, 9 waves
5. **The Long March** (Medium) - **Reuses original game map**, 10 waves
6. **Chokepoint** (Medium) - Narrow passages, 10 waves

**Mastery (Levels 7-9):**
7. **Limited Resources** (Hard) - Only 5 construction spots, 12 waves
8. **Speed Run** (Hard) - Short path, fast enemies, 10 waves
9. **The Labyrinth** (Hard) - Maze-like (11 waypoints), 15 waves

**Boss (Level 10):**
10. **Last Stand** (Boss) - Epic finale, longest path (13 waypoints), 20 waves

**Progressive Difficulty:**
- Starting scrap: 200 → 175 → 150 → ... → 120 (decreases)
- Wave count: 5 → 7 → 8 → ... → 20 (increases)
- Construction spots: 5-10 (strategically placed)

**Total:** 1,563 lines of level data + documentation

---

### ✅ PHASE-003: UI Design System (Agent C)
**Commit:** `1429e81`

**Files Created:**
- `constants/ui/theme.ts` - Centralized design system (208 lines)
- `docs/ui-specs.md` - Component specifications (937 lines)

**Theme Features:**
- **Colors:** 4-tier backgrounds, borders, text hierarchy, semantic colors, difficulty badges, star ratings
- **Spacing:** xs (4px) → xxl (48px) scale
- **Typography:** Font sizes (12-48px), weights (400-900)
- **Shadows:** 4 predefined styles for depth
- **Touch Targets:** iOS (44px) + recommended (48px) minimums
- **Animations:** Duration constants (fast, normal, slow, victory)
- **Helper Functions:** `getDifficultyColor`, `getStarColor`, `getProgressionColor`

**UI Component Specs (7 components):**
1. **LevelCard** - 160×200px cards with locked/unlocked/completed states
2. **StarRating** - 0-3 stars display with optional animation (3 sizes)
3. **DifficultyBadge** - Color-coded pill badges (easy/medium/hard)
4. **ProgressBar** - Campaign star progress indicator (X/30 stars)
5. **LevelSelectScreen** - 2-column grid layout with header
6. **VictoryScreenEnhanced** - Modal with animated star reveal
7. **LevelDetailsModal** - Level preview before start

All colors extracted from existing codebase (`app/index.tsx`, `app/game.tsx`, `components/game/BuildMenu.tsx`) for consistency.

**Total:** 1,145 lines of design system + specs

---

### ✅ PHASE-004: Graphics Prompts (Agent D)
**Commit:** `565835d`

**Files Created:**
- `docs/prompts/map-backgrounds.md` - 10 copy-paste ready AI prompts (577 lines)

**Map Themes (Visual Progression):**
1. **Coastal Military Bastion** - Fortifications, recent abandonment
2. **Urban Street** - Abandoned vehicles, early outbreak chaos
3. **Military Checkpoint** - Destroyed barriers, combat damage
4. **City Intersection** - Vehicle pileups, converging routes
5. **Industrial Wasteland** - Rusted machinery, heavy decay (matches current style)
6. **Narrow Alley** - Claustrophobic passage, dumpsters, fire escapes
7. **Suburban Ruins** - Burned homes, nature reclaiming
8. **Abandoned Highway** - Overturned trucks, open road
9. **Underground Parking** - Support pillars, water damage, darkest level
10. **Apocalyptic Battlefield** - Collapsed skyscrapers, ground zero devastation

**Each Prompt Includes:**
- Complete technical specs (640×384px, PNG, <500KB, mobile-optimized)
- Post-apocalyptic dark theme (#2a2a2a base color)
- Top-down isometric perspective (2.5D view)
- Muted earth tones, desaturated palette
- Dark ambient lighting with dramatic shadows
- **CRITICAL:** "Do NOT draw paths" (paths are separate overlay textures)
- Uniform ground surface (asphalt/concrete/dirt) for path placement
- Ready for Midjourney, DALL-E 3, and Stable Diffusion

**Visual Progression:** Fresh abandonment → Moderate destruction → Heavy decay → Total apocalypse

---

## Statistics

**Files Changed:** 19 files
**Lines Added:** +4,325 lines
**Lines Removed:** -3 lines

**Breakdown:**
- **Types:** 4 files (322 lines)
- **Level Data:** 11 files (1,563 lines)
- **UI System:** 1 file (208 lines)
- **Documentation:** 3 files (2,095 lines)

## Technical Highlights

✅ **Strict TypeScript** - No `any` types, full type safety
✅ **Backward Compatible** - Existing game still works (sessionConfig optional)
✅ **Level 5 = Current Map** - Smooth transition from single-map to campaign
✅ **Design System** - All colors extracted from existing UI patterns
✅ **Production Ready** - All data structures complete and validated
✅ **JSDoc Comments** - Comprehensive documentation on all types

## What This Enables

After this PR merges:
- ✅ Complete type system for all campaign features
- ✅ 10 fully-designed levels ready to implement
- ✅ Centralized theme for consistent UI across all screens
- ✅ AI prompts ready to generate 10 unique map backgrounds
- ✅ Foundation for WAVE 2 (implementation)

## Testing

- ✅ All TypeScript files compile without errors
- ✅ Level data validated against type definitions
- ✅ Theme object properly exported and typed
- ✅ All 10 level configs include valid waypoints and construction spots
- ✅ Documentation complete and accurate

## Migration Notes

**Backward Compatibility:**
- `GameState.sessionConfig` is optional - existing game logic unaffected
- Current map waypoints preserved in `data/maps/level-05.ts` (The Long March)
- No breaking changes to existing components

**Next Steps (WAVE 2):**
The next PR will implement:
- UI Components (StarRating, DifficultyBadge, ProgressBar)
- Campaign Context (state management + level unlocking)
- Storage system (campaign progress persistence)
- Integration ready for Level Select screen

---

**Related:** This is WAVE 1 of the campaign system implementation.
**Follows:** WAVE 2 PR will build on this foundation with working code.

## Commits (4)

```
dd894e1 feat: Add 10 campaign level designs (PHASE-002)
1429e81 feat: Add UI design system and component specs (PHASE-003)
565835d docs: Create AI prompts for 10 map backgrounds (PHASE-004)
deffe11 feat: Add type definitions for level system (PHASE-001)
```
