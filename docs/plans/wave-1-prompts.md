# WAVE 1 - AGENT PROMPTS

Copy-paste these prompts into 4 separate Claude sessions to start Wave 1.

---

## 🚀 AGENT A - Architecture (Types)

```
You are Agent A working on PHASE-001-TYPES for Zombie Fleet Bastion game.

PROJECT CONTEXT:
- React Native tower defense game (Expo Router)
- Adding 10-level campaign system with progression
- Location: /Users/adammichalski/Code/zombies

YOUR TASK (PHASE-001-TYPES):
Create TypeScript type definitions for the new level system.

FILES TO CREATE:
1. types/levels.ts - Complete level configuration types
2. types/progression.ts - Player progress and star rating types
3. Extend types/game.ts - Add level-related fields to GameState

KEY TYPES NEEDED:
- LevelConfig: id, number, name, description, difficulty, waypoints, constructionSpots, backgroundImage, totalWaves, waveConfigs, startingScrap, startingHull, unlockRequirement, rewards
- LevelProgress: levelId, completed, starsEarned (0-3), bestScore, timesPlayed, lastPlayedAt
- PlayerProgress: currentLevel, unlockedLevels, levelProgress map, totalStars
- StarRequirements: rules for 1-3 star calculation
- ConstructionSpot: extend existing to work with dynamic levels

REQUIREMENTS:
- Strict TypeScript typing
- Export all interfaces/types
- Add JSDoc comments explaining each type
- Ensure compatibility with existing types/game.ts
- Follow existing code style in project

DELIVERABLE:
- All types compile without errors
- File-level comments added (format below)
- Commit with message: "feat: Add type definitions for level system"

FILE COMMENT FORMAT:
/**
 * [Brief description of what file does]
 *
 * Recent changes (2025-11-16):
 * - [What changed and why]
 *
 * Next agent: [Important context for next AI or developer]
 */

When done, report: "PHASE-001-TYPES COMPLETE ✅" with summary of types created.
```

---

## 🎨 AGENT B - Content (Level Design)

```
You are Agent B working on PHASE-002-LEVEL-DESIGN for Zombie Fleet Bastion game.

PROJECT CONTEXT:
- React Native tower defense game
- Currently has 1 map with 10 waves
- Adding 10 unique levels with different maps
- Location: /Users/adammichalski/Code/zombies

YOUR TASK (PHASE-002-LEVEL-DESIGN):
Design 10 unique level layouts with hand-crafted waypoints and construction spots.

EXISTING MAP SPEC (for reference):
- Map size: 20x12 tiles (each tile = 32px)
- Current waypoints: Read from constants/gameConfig.ts WAYPOINTS
- Current construction spots: Read from constants/gameConfig.ts CONSTRUCTION_SPOTS
- Current waves: Read from constants/waves.ts

LEVEL DESIGN STRATEGY:
Levels 1-3 (Easy - Tutorial):
- Level 1 "First Contact": Simple L-shaped path, 4 construction spots, 5 waves (only Shamblers)
- Level 2 "The Horde Grows": S-curved path, 5 spots, 7 waves (Shamblers + Runners)
- Level 3 "Heavy Infantry": Zigzag path, 6 spots, 8 waves (introduce Brute)

Levels 4-6 (Medium - Strategic):
- Level 4 "Crossroads": Two paths converging, 6 spots, 9 waves
- Level 5 "The Long March": Very winding long path, 7 spots, 10 waves
- Level 6 "Chokepoint": Narrow bottleneck design, 5 strategic spots, 10 waves

Levels 7-9 (Hard - Mastery):
- Level 7 "Limited Resources": Complex path, only 4 spots (forced choices), 12 waves
- Level 8 "Speed Run": Short path, fast enemies, 8 spots, 10 waves
- Level 9 "The Labyrinth": Maze-like with many turns, 8 spots, 15 waves

Level 10 (Boss):
- Level 10 "Last Stand": Longest path, 10 spots, 20 waves (epic finale)

OUTPUT FORMAT (create docs/level-designs.md):
For each level include:
- Name and description
- Difficulty
- Waypoints: array of {x, y} coordinates (keep within 0-20 for x, 0-12 for y)
- Construction spots: array with id and {x, y} coordinates
- Wave count and composition
- Starting resources (scrap, hull)
- Design notes (what makes this level unique)

REQUIREMENTS:
- All waypoints must create valid paths (no overlapping, sensible turns)
- Construction spots placed strategically (not on path)
- Progressive difficulty (waves get harder)
- Balance: solvable but challenging
- Each level feels unique

DELIVERABLE:
- docs/level-designs.md with all 10 levels fully specified
- Markdown format, clear structure
- Commit: "docs: Design 10 campaign levels"

When done, report: "PHASE-002-LEVEL-DESIGN COMPLETE ✅" with brief summary.
```

---

## 🖼️ AGENT C - UI/UX (Design System)

```
You are Agent C working on PHASE-003-UI-DESIGN for Zombie Fleet Bastion game.

PROJECT CONTEXT:
- React Native tower defense game (Expo Router)
- Dark theme UI already established
- Adding campaign level select screen
- Location: /Users/adammichalski/Code/zombies

YOUR TASK (PHASE-003-UI-DESIGN):
Create design system and component specifications for campaign UI.

EXISTING UI REFERENCE:
- Read app/index.tsx for current design patterns
- Read app/game.tsx for header/footer styles
- Colors: Check existing StyleSheet definitions

FILES TO CREATE:
1. constants/ui/theme.ts - Centralized design system
2. docs/ui-specs.md - Component specifications

THEME.TS STRUCTURE:
Export object with:
- colors:
  - background: primary (#0a0a0a), secondary (#1a1a1a), tertiary (#2a2a2a)
  - accent: green (#4CAF50), red (#FF4444), gold (#FFD700), orange (#FFA500)
  - difficulty: easy (green), medium (yellow), hard (red)
  - text: primary (#FFFFFF), secondary (#AAAAAA), disabled (#666666)
- spacing: xs(4), sm(8), md(16), lg(24), xl(32)
- borderRadius: sm(8), md(12), lg(16)
- typography: fontSize, fontWeight constants

UI-SPECS.MD CONTENT:
Specify these components (markdown format):

1. LevelCard
   - Size: 160x200px
   - Shows: level number, name, difficulty badge, stars (0-3), lock icon if locked, "Play" button
   - States: locked, unlocked, completed (with stars)
   - Layout: vertical card with image thumbnail at top

2. StarRating
   - Shows 0-3 stars (filled/empty)
   - Gold (#FFD700) filled, gray (#444444) empty
   - Sizes: small (16px), medium (24px), large (32px)
   - Optional animation on reveal

3. DifficultyBadge
   - Small pill badge
   - Color-coded: Easy (green), Medium (yellow), Hard (red)
   - Text: difficulty level

4. ProgressBar
   - Linear progress indicator
   - Shows: current stars / total stars (max 30)
   - Gradient fill, animated

5. VictoryScreenEnhanced
   - Modal overlay
   - Shows: "Victory!" message, star rating (animated reveal), stats, buttons
   - Buttons: "Next Level", "Replay", "Back to Campaign"

REQUIREMENTS:
- Consistent with existing dark theme
- Reuse existing patterns where possible
- Mobile-first design
- Accessibility considerations (touch targets ≥44px)

DELIVERABLE:
- constants/ui/theme.ts ✅
- docs/ui-specs.md ✅
- Commit: "feat: Add UI design system and component specs"

When done, report: "PHASE-003-UI-DESIGN COMPLETE ✅"
```

---

## 🎨 AGENT D - Graphics (AI Prompts)

```
You are Agent D working on PHASE-004-GRAPHICS-PROMPTS for Zombie Fleet Bastion game.

PROJECT CONTEXT:
- React Native tower defense game
- Need 10 unique map backgrounds
- Post-apocalyptic zombie theme
- Location: /Users/adammichalski/Code/zombies

YOUR TASK (PHASE-004-GRAPHICS-PROMPTS):
Create 10 copy-paste ready AI prompts for generating map backgrounds.

TECHNICAL SPECIFICATIONS (MUST include in ALL prompts):
- Dimensions: 640x384 pixels (20 tiles × 12 tiles @ 32px/tile)
- Format: PNG
- File size: <500KB (optimized for mobile)
- Perspective: Top-down, slight isometric angle (2.5D)
- Style: Post-apocalyptic, dark gritty atmosphere
- Base color: #2a2a2a (dark gray)
- Color palette: Muted earth tones, desaturated
- Lighting: Dark ambient with dramatic shadows
- Composition: Clear center area for path/towers (don't overcrowd center)
- Technical: Optimized for mobile performance
- Context: Background for tower defense game

PROMPT STRUCTURE (for each level):
```markdown
## Level [X]: [Name]

**Scene Description:**
[What this map shows - abandoned street, destroyed facility, etc.]

**AI Prompt (Copy-Paste Ready):**
Create a top-down post-apocalyptic game map background, 640x384 pixels.
Scene: [specific scene].
Style: Dark gritty atmosphere, muted colors (base #2a2a2a gray), desaturated earth tones.
Perspective: Slight isometric (2.5D), top-down view.
Details: [specific details like rubble, vehicles, vegetation].
Lighting: Dark ambient with dramatic shadows.
Technical: PNG format, clear center area for gameplay, optimized for mobile (<500KB).
Purpose: Background for tower defense game level [X].

**Visual Theme:**
[Unique aspect that differentiates this level visually]
```

LEVEL THEMES (suggestions):
1. Abandoned city street
2. Destroyed shopping mall
3. Military checkpoint ruins
4. Industrial wasteland
5. Overgrown park
6. Collapsed highway
7. Ruined suburb
8. Burned forest
9. Underground parking (dark)
10. Final battlefield (epic scale)

REQUIREMENTS:
- All 10 prompts ready to copy-paste into Midjourney/DALL-E/Stable Diffusion
- Complete technical specifications in EVERY prompt
- Visual variety across levels
- Consistent dark theme
- Each prompt explains intended use case

OUTPUT FILE:
- docs/prompts/map-backgrounds.md

DELIVERABLE:
- Complete markdown file with 10 prompts ✅
- Each prompt is copy-paste ready ✅
- Commit: "docs: Create AI prompts for map backgrounds"

When done, report: "PHASE-004-GRAPHICS-PROMPTS COMPLETE ✅" with prompt count.
```

---

## 📋 EXECUTION INSTRUCTIONS

1. **Open 4 separate Claude Code sessions** (or 4 browser tabs with Claude)

2. **Copy each prompt above into a separate session:**
   - Session 1: Agent A (Types)
   - Session 2: Agent B (Level Design)
   - Session 3: Agent C (UI Design)
   - Session 4: Agent D (Graphics Prompts)

3. **All agents run in parallel** - they don't wait for each other

4. **When all 4 report "COMPLETE ✅":**
   - Review all outputs
   - Approve checkpoints
   - Ready for Wave 2

5. **Expected completion time:** 45-90 minutes (all running simultaneously)

---

## ✅ SUCCESS CRITERIA

**Wave 1 is complete when:**
- ✅ Agent A: Types created, TypeScript compiles
- ✅ Agent B: All 10 levels designed in docs/level-designs.md
- ✅ Agent C: Theme + UI specs created
- ✅ Agent D: 10 AI prompts ready in docs/prompts/map-backgrounds.md
- ✅ All commits pushed to git
- ✅ Checkpoints reviewed and approved

**Next step:** Launch Wave 2 with 3 agents (prompts will be provided after Wave 1 completion)
