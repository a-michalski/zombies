# Zombie Fleet Bastion - Campaign Level Designs

This document provides a comprehensive overview of all 10 campaign levels, including visual ASCII maps, wave compositions, and design notes.

**Legend:**
- `S` = Start (entry waypoint)
- `E` = Exit (final waypoint)
- `*` = Waypoint (path point)
- `T` = Tower construction spot
- `.` = Open space
- `-`, `|` = Path segments

**Map Grid:** 20 tiles wide (x: 0-20) × 12 tiles high (y: 0-12)

---

## Level 1: First Contact

**Difficulty:** Easy (Tutorial)
**Waves:** 5
**Construction Spots:** 5
**Starting Resources:** 200 scrap, 20 hull

### Description
Your first encounter with the zombie horde. Learn the basics of tower defense with a simple L-shaped path and generous resources.

### Visual Map
```
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
  0 . . . . . . . . . . . . T . . . . . . . .
  1 . . . . . . . . . . . . T . . . . . . . .
  2 . . . . . . . . . . . . . . . . . . . . .
  3 . . . . . . . . . . * - * - * - * - * - E
  4 . . . . . . . . T . . . . . . . . . . . .
  5 . . . . . . . . . . . . . . . . T . . . .
  6 S - * - * - * - * - * . . . . . . . . . .
  7 . . . . . . . . . . . . . . . . . . . . .
  8 . . . . T . . . . . . . T . . . . . . . .
  9 . . . . . . . . . . . . . . . . . . . . .
 10 . . . . . . . . . . . . . . . . . . . . .
 11 . . . . . . . . . . . . . . . . . . . . .
```

### Wave Composition
- Wave 1: 5 Shamblers
- Wave 2: 6 Shamblers
- Wave 3: 8 Shamblers
- Wave 4: 10 Shamblers
- Wave 5: 12 Shamblers

### Star Requirements
- ⭐ 1 Star: Complete the level
- ⭐⭐ 2 Stars: Keep 60%+ hull integrity
- ⭐⭐⭐ 3 Stars: Keep 90%+ hull integrity

### Design Notes
Simple L-shaped path allows players to learn tower placement basics. Only shambler enemies keep difficulty low. Generous starting scrap (200) encourages experimentation. Path moves left-to-right then turns upward, creating natural tower placement zones.

---

## Level 2: The Horde Grows

**Difficulty:** Easy (Tutorial)
**Waves:** 7
**Construction Spots:** 6
**Starting Resources:** 175 scrap, 20 hull

### Description
The zombies are getting faster. Adapt your strategy to handle different enemy types with an S-curved path.

### Visual Map
```
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
  0 . . . . . . . . . . . . . . . . . . . . .
  1 . . . . . . . . . . . . . . . . . . . . .
  2 . . . . . . . . . . T . . . . . . T . . .
  3 . . . . . . . . . . . . . . . . . . . . .
  4 . . . . . . . * - * - * - * - * . . . . .
  5 . . . . . . . . . . . . . . . . . . . . .
  6 . . . . . T . | . . . T . . . . . . . . .
  7 . . . . . . . | . . . . . . . . . . . . .
  8 . . . . . . . | . . . . . . . . . . . . .
  9 S - * - * - * - * . . . . . . * - * - * - E
 10 . . . . . . . . . . . . . . . . . . . . .
 11 . . . T . . . . . . . . . . . . . T . . .
```

### Wave Composition
- Wave 1: 6 Shamblers
- Wave 2: 8 Shamblers
- Wave 3: 6 Shamblers, 3 Runners (first runners!)
- Wave 4: 8 Shamblers, 4 Runners
- Wave 5: 6 Shamblers, 6 Runners
- Wave 6: 10 Shamblers, 5 Runners
- Wave 7: 8 Shamblers, 8 Runners

### Star Requirements
- ⭐ 1 Star: Complete the level
- ⭐⭐ 2 Stars: Keep 55%+ hull integrity
- ⭐⭐⭐ 3 Stars: Keep 85%+ hull integrity

### Design Notes
S-curve path introduces more complex pathfinding. First introduction of runner enemies (wave 3+) teaches players to handle speed. Six construction spots provide strategic options at curves. Reduced starting scrap (175) encourages planning.

---

## Level 3: Heavy Infantry

**Difficulty:** Easy (Tutorial)
**Waves:** 8
**Construction Spots:** 6
**Starting Resources:** 150 scrap, 20 hull

### Description
Heavily armored brutes join the horde. Focus your fire and upgrade your towers!

### Visual Map
```
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
  0 . . . T . . . . . . . . . . T . . . . . .
  1 . . . . . . . . . . . . . . T . . . . . .
  2 S - * - * - * . . . . . . . . . . . . . .
  3 . . . . . . | . . . . . * - * - * - * . .
  4 . . . . . . | . . . . . | . . . . . . . .
  5 . . . . T . | . . T . . | . . . T . . . .
  6 . . . . . . | . . . . . . . . . | . . . E
  7 . . . . . . | . . . . . . . . . | . . . .
  8 . . . . . . * - * - * - * - * . | . . . .
  9 . . . . . . . . . . . . . . . . | . . . .
 10 . . . . . . . . . . T . . . . . | . . . .
 11 . . . . . . . . . . . . . . . . . . . . .
```

### Wave Composition
- Wave 1: 8 Shamblers
- Wave 2: 6 Shamblers, 4 Runners
- Wave 3: 10 Shamblers, 5 Runners
- Wave 4: 8 Shamblers, 8 Runners
- Wave 5: 1 Brute, 8 Shamblers (first brute!)
- Wave 6: 1 Brute, 10 Runners, 5 Shamblers
- Wave 7: 2 Brutes, 8 Runners, 8 Shamblers
- Wave 8: 2 Brutes, 12 Runners, 10 Shamblers

### Star Requirements
- ⭐ 1 Star: Complete the level
- ⭐⭐ 2 Stars: Keep 50%+ hull integrity
- ⭐⭐⭐ 3 Stars: Keep 80%+ hull integrity

### Design Notes
Zigzag pattern creates multiple tower coverage zones. First brute enemy appears in wave 5, teaching focus fire tactics. Path length provides good shooting time but requires strategic positioning. Standard starting scrap (150) transitions to normal difficulty.

---

## Level 4: Crossroads

**Difficulty:** Medium
**Waves:** 9
**Construction Spots:** 7
**Starting Resources:** 140 scrap, 20 hull

### Description
A winding path tests your strategic planning. Place your towers wisely at the crossroads!

### Visual Map
```
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
  0 . . . . . . . . . . . . . . . . . . . . .
  1 . . . . . . . . . . . . . . . . . . . . .
  2 . . . . . . . . . . T . . . . . . . T . .
  3 . . . T . . . . . . . . . . . . . . . . .
  4 . . . . . . . . . . . . . . . . . . . . E
  5 . . . . . . . . . . . . . . . . . . . . .
  6 . . . . . . . . . . . . . . . . . T . . .
  7 . . . . . . . T . . . . T . . . . T . . .
  8 . . T . . . . . . . . . . . . . . . . . .
  9 . . . . . . . . . . . . . . . . . . . . .
 10 S - * - * - * - * . . * - * - * - * - * - E
 11 . . . . . | . . . . . | . . . . . | . . .
```

### Wave Composition
- Wave 1: 10 Shamblers, 5 Runners
- Wave 2: 12 Shamblers, 6 Runners
- Wave 3: 12 Runners, 8 Shamblers
- Wave 4: 1 Brute, 10 Runners, 8 Shamblers
- Wave 5: 2 Brutes, 12 Runners
- Wave 6: 18 Runners, 10 Shamblers
- Wave 7: 2 Brutes, 15 Runners, 10 Shamblers
- Wave 8: 3 Brutes, 12 Runners, 12 Shamblers
- Wave 9: 3 Brutes, 18 Runners, 15 Shamblers

### Star Requirements
- ⭐ 1 Star: Complete the level
- ⭐⭐ 2 Stars: Keep 45%+ hull integrity
- ⭐⭐⭐ 3 Stars: Keep 75%+ hull integrity

### Design Notes
Complex winding path with crossroads creates strategic tower placement opportunities. Path doubles back on itself allowing towers to hit enemies multiple times. Medium difficulty begins with reduced scrap (140) and larger wave counts. Requires understanding of tower range and positioning.

---

## Level 5: The Long March

**Difficulty:** Medium
**Waves:** 10
**Construction Spots:** 8
**Starting Resources:** 150 scrap, 20 hull

### Description
A familiar battlefield. The classic gauntlet of 10 waves tests all your skills.

### Visual Map
```
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
  0 . . . . . . . . . . . . . . . . . . . . .
  1 . . . . . . T . . . . . . . . . . . . . .
  2 . . . . . . . . . . . . . . . . . . T . .
  3 . . . . . . . . * - * . . . . . . . . . .
  4 S - * - * - * . | . . . . . . * - * - * - E
  5 . . . . . . T . | . . T . . . . T . . . .
  6 . . T . . . . . | . . . . . . . . . . . .
  7 . . . . . . . . | . . . . . . . | . . . .
  8 . . . . . . . . | . . . . . . . | . . . .
  9 . . . . . . . . * - * - * - * - * . . . .
 10 . . . . . . . . . . . . . . . . . . . . .
 11 . . . . . . . . . . T . . . . . T . . . .
```

### Wave Composition (Classic Mode Pattern)
- Wave 1: 5 Shamblers
- Wave 2: 8 Shamblers
- Wave 3: 12 Shamblers
- Wave 4: 15 Shamblers
- Wave 5: 10 Runners
- Wave 6: 10 Shamblers, 8 Runners
- Wave 7: 15 Runners, 10 Shamblers
- Wave 8: 1 Brute, 10 Runners
- Wave 9: 15 Runners, 1 Brute, 10 Shamblers
- Wave 10: 1 Brute, 15 Runners, 1 Brute, 20 Shamblers

### Star Requirements
- ⭐ 1 Star: Complete the level
- ⭐⭐ 2 Stars: Keep 40%+ hull integrity
- ⭐⭐⭐ 3 Stars: Keep 70%+ hull integrity

### Design Notes
**REUSES the original game map** from constants/gameConfig.ts. Complex switchback pattern creates long path with multiple coverage opportunities. 8 construction spots provide maximum flexibility. This is the "classic mode" experience adapted for campaign. Tests all concepts learned in previous levels.

---

## Level 6: Chokepoint

**Difficulty:** Medium
**Waves:** 10
**Construction Spots:** 6
**Starting Resources:** 135 scrap, 20 hull

### Description
Narrow passages create deadly killzones. Control the chokepoints to survive!

### Visual Map
```
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
  0 . . . . . T . . . . . . . . . . . . . . .
  1 . . . . . . . . . . . . . . . . T . . . .
  2 . . . * - * - * - * . . . * - * - * - * - E
  3 . . . | . . . . | . . . . | . . . . . . .
  4 . . T | . . . . | . . T . | . . . . . . .
  5 . . . | . . . . | . . . . | . . . . . . .
  6 S - * - * . . . | . T . . | . . . . . . .
  7 . . . . . . . . | . . . . | . . . . . . .
  8 . . . . . . . . | . . . . | . . . . . . .
  9 . . . . . . . . * - * - * - * . . . . . .
 10 . . . . . . . . . . . . . . . . . . . . .
 11 . . . . . . . . . . T . . . . . . . . . .
```

### Wave Composition
- Wave 1: 12 Shamblers, 5 Runners
- Wave 2: 10 Shamblers, 8 Runners
- Wave 3: 15 Runners
- Wave 4: 1 Brute, 15 Shamblers
- Wave 5: 2 Brutes, 10 Runners
- Wave 6: 20 Runners, 10 Shamblers
- Wave 7: 2 Brutes, 15 Runners, 12 Shamblers
- Wave 8: 3 Brutes, 12 Runners, 15 Shamblers
- Wave 9: 3 Brutes, 18 Runners
- Wave 10: 4 Brutes, 20 Runners, 20 Shamblers

### Star Requirements
- ⭐ 1 Star: Complete the level
- ⭐⭐ 2 Stars: Keep 40%+ hull integrity
- ⭐⭐⭐ 3 Stars: Keep 65%+ hull integrity

### Design Notes
Multiple vertical chokepoints create natural killzones for concentrated tower fire. Only 6 construction spots require careful placement at key chokepoint positions. Narrow passages slow enemy advance but also limit tower placement options. Rewards understanding of tower range and chokepoint defense.

---

## Level 7: Limited Resources

**Difficulty:** Hard
**Waves:** 12
**Construction Spots:** 5 (ONLY!)
**Starting Resources:** 120 scrap, 20 hull

### Description
Only 5 tower spots available. Every decision matters. Choose wisely!

### Visual Map
```
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
  0 . . . . . . . . . . . . . . . . . . . . .
  1 . . . . . . . . . . . . . . . . . . . . .
  2 . . . . . . . . . . . . . . . * - * - * - E
  3 . . . . . . . . . * - * . . . | . . . . .
  4 . . . . . . . . . | . . . . . | . . . . .
  5 . . T . . . T . . | . . . . . | . . T . .
  6 . . . . . . T . . | . T . . . | . . . . .
  7 . . . . . . . . . | . . . . . | . . . . .
  8 S - * - * - * . . | . . . . . | . . . . .
  9 . . . . . . . . . * - * - * - * . . . . .
 10 . . . . . . . . . . . . . . . . . . . . .
 11 . . . . . . . . . . . . T . . . . . . . .
```

### Wave Composition
- Wave 1: 15 Shamblers, 8 Runners
- Wave 2: 18 Runners
- Wave 3: 2 Brutes, 15 Shamblers
- Wave 4: 20 Runners, 12 Shamblers
- Wave 5: 3 Brutes, 15 Runners
- Wave 6: 2 Brutes, 22 Runners, 15 Shamblers
- Wave 7: 4 Brutes, 18 Runners
- Wave 8: 30 Runners
- Wave 9: 4 Brutes, 20 Runners, 20 Shamblers
- Wave 10: 5 Brutes, 25 Runners
- Wave 11: 3 Brutes, 30 Runners, 25 Shamblers
- Wave 12: 6 Brutes, 25 Runners, 20 Shamblers

### Star Requirements
- ⭐ 1 Star: Complete the level
- ⭐⭐ 2 Stars: Keep 35%+ hull integrity
- ⭐⭐⭐ 3 Stars: Keep 60%+ hull integrity

### Design Notes
**THE CHALLENGE:** Only 5 construction spots! Every tower placement is critical. Long winding path provides shooting time but requires perfect positioning. 12 waves test resource management and tower upgrade strategy. Requires 2 stars from level 6 to unlock. This is optimization mastery.

---

## Level 8: Speed Run

**Difficulty:** Hard
**Waves:** 10
**Construction Spots:** 8
**Starting Resources:** 130 scrap, 20 hull

### Description
A short path and fast enemies! Build quickly and shoot faster!

### Visual Map
```
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
  0 . . . . . . . . . . . . . . . . . . . . .
  1 . . . T . . . . T . . . T . . . T . . . .
  2 . . . . . . . . . . . . . . . . . . . . .
  3 . . . . . . * - * - * - * - * - * - * - E
  4 . . . T . . | . . . . . . . . . . . . . .
  5 . . . T . . | . T . . . T . . . T . . . .
  6 S - * - * - * . . . . . . . . . . . . . .
  7 . . . . . . . . . . . . . . . . . . . . .
  8 . . . T . . . . . . . . . . . . . . . . .
  9 . . . . . . . . . . . . . . . . . . . . .
 10 . . . . . . . . . . . . . . . . . . . . .
 11 . . . . . . . . . . . . . . . . . . . . .
```

### Wave Composition (Mostly Runners!)
- Wave 1: 15 Runners
- Wave 2: 20 Runners
- Wave 3: 25 Runners
- Wave 4: 2 Brutes, 20 Runners
- Wave 5: 30 Runners
- Wave 6: 28 Runners, 12 Shamblers
- Wave 7: 3 Brutes, 25 Runners
- Wave 8: 35 Runners
- Wave 9: 4 Brutes, 30 Runners
- Wave 10: 5 Brutes, 40 Runners

### Star Requirements
- ⭐ 1 Star: Complete the level
- ⭐⭐ 2 Stars: Keep 30%+ hull integrity
- ⭐⭐⭐ 3 Stars: Keep 55%+ hull integrity

### Design Notes
**EXTREMELY SHORT PATH** - only 4 waypoints! Enemies reach the exit very quickly. Dominated by fast runner enemies creating intense pressure. 8 construction spots but minimal time to use them all. Requires immediate tower building and rapid upgrades. Tests quick decision-making and reflex tower defense.

---

## Level 9: The Labyrinth

**Difficulty:** Hard
**Waves:** 15
**Construction Spots:** 7
**Starting Resources:** 125 scrap, 20 hull

### Description
Navigate a treacherous maze. 15 waves of chaos await those who dare enter.

### Visual Map
```
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
  0 . . . . . . . . . . . . . . . . . . . . .
  1 . . . . . . . . . . T . . . . . T . . . .
  2 . . . * - * - * - * . . . * - * . . . . .
  3 . . . | . . . | . . . . . | . . . . . . .
  4 . . T | . . . | . . . . . | . . . . . . .
  5 . . . | . T . | . . . . . | . . . . . . .
  6 S - * - * . . | . . . . T . * - * - * - E
  7 . . . . . . . | . . . . . . | . . . . . .
  8 . . . . . . . | . . . . . . | . . T . . .
  9 . . . . . . . * - * - * - * - * . . . . .
 10 . . . . . . . . . . . . . . * - * . . . .
 11 . . . . . . . . . T . . . . . . . . . . .
```

### Wave Composition
- Wave 1: 15 Shamblers, 10 Runners
- Wave 2: 20 Runners
- Wave 3: 2 Brutes, 18 Shamblers
- Wave 4: 25 Runners, 15 Shamblers
- Wave 5: 3 Brutes, 18 Runners
- Wave 6: 30 Runners
- Wave 7: 4 Brutes, 20 Shamblers
- Wave 8: 3 Brutes, 25 Runners, 15 Shamblers
- Wave 9: 35 Runners
- Wave 10: 5 Brutes, 25 Runners
- Wave 11: 4 Brutes, 30 Runners, 20 Shamblers
- Wave 12: 40 Runners
- Wave 13: 6 Brutes, 30 Runners
- Wave 14: 5 Brutes, 35 Runners, 25 Shamblers
- Wave 15: 7 Brutes, 40 Runners, 30 Shamblers

### Star Requirements
- ⭐ 1 Star: Complete the level
- ⭐⭐ 2 Stars: Keep 30%+ hull integrity
- ⭐⭐⭐ 3 Stars: Keep 50%+ hull integrity

### Design Notes
**MAZE-LIKE PATH** with 11 waypoints creating labyrinthine feel. Path snakes through entire map requiring full coverage. 15 waves of escalating difficulty test endurance. Long path provides time but requires strategic tower placement across the whole map. This is the mastery test before the final boss.

---

## Level 10: Last Stand

**Difficulty:** Hard (Boss)
**Waves:** 20 (EPIC!)
**Construction Spots:** 10 (Maximum!)
**Starting Resources:** 150 scrap, 20 hull

### Description
The final battle. 20 waves of pure chaos. This is your last stand against the horde!

### Visual Map
```
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
  0 . . . . . T . . . . T . . . . T . . . . .
  1 . . . . . . . . . . . . . . . . . . . . .
  2 . . . * - * - * - * . . * - * . . . . . .
  3 . . . | . . . | . . . . | . . . . . . . .
  4 . . . | . . . | . . . . | . . . * - * . .
  5 . . . | . . . | . T . . | . T . | . . . .
  6 . . . | . T . | . . . T | . . . | . T - E
  7 . . . | . . . | . . . . | . . . | . . . .
  8 . . T | . . . | . . . . | . . . | . . . .
  9 . . . | . . . | . . . . * - * - * . . . .
 10 . . . | . . . * - * - * - * . . . . . . .
 11 S - * - * . . . . . . T . . T . . . . . .
```

### Wave Composition
- Wave 1: 20 Shamblers, 10 Runners
- Wave 2: 25 Runners
- Wave 3: 2 Brutes, 20 Shamblers, 15 Runners
- Wave 4: 30 Runners, 15 Shamblers
- Wave 5: 3 Brutes, 25 Runners
- Wave 6: 35 Runners
- Wave 7: 4 Brutes, 25 Shamblers, 20 Runners
- Wave 8: 3 Brutes, 35 Runners
- Wave 9: 40 Runners, 20 Shamblers
- Wave 10: 5 Brutes, 30 Runners, 25 Shamblers
- Wave 11: 45 Runners
- Wave 12: 6 Brutes, 35 Runners
- Wave 13: 5 Brutes, 40 Runners, 30 Shamblers
- Wave 14: 50 Runners
- Wave 15: 7 Brutes, 40 Runners
- Wave 16: 6 Brutes, 45 Runners, 35 Shamblers
- Wave 17: 8 Brutes, 40 Runners
- Wave 18: 55 Runners, 30 Shamblers
- Wave 19: 9 Brutes, 50 Runners
- Wave 20: 10 Brutes, 50 Runners, 40 Shamblers

### Star Requirements
- ⭐ 1 Star: Complete the level
- ⭐⭐ 2 Stars: Keep 25%+ hull integrity
- ⭐⭐⭐ 3 Stars: Keep 45%+ hull integrity

### Unlock Requirement
Must earn 2 stars on Level 9 to unlock.

### Design Notes
**THE ULTIMATE CHALLENGE!** Longest possible path with 13 waypoints covering maximum distance. 10 construction spots provide maximum strategic options. 20 waves of pure mayhem with up to 10 brutes and 50+ runners in final waves. Generous starting scrap (150) enables complex strategies. This is the epic finale that tests everything learned. Massive rewards for completion (500 scrap + 150 per star).

---

## Campaign Progression Summary

### Easy Levels (Tutorial) - Levels 1-3
- **Level 1:** Simple L-path, shamblers only, 5 waves
- **Level 2:** S-curve, introduces runners, 7 waves
- **Level 3:** Zigzag, introduces brutes, 8 waves

### Medium Levels (Strategic) - Levels 4-6
- **Level 4:** Complex winding path, 9 waves
- **Level 5:** Classic map reuse, 10 waves
- **Level 6:** Chokepoint defense, 10 waves

### Hard Levels (Mastery) - Levels 7-9
- **Level 7:** Limited resources (5 spots only!), 12 waves
- **Level 8:** Speed run (short path + fast enemies), 10 waves
- **Level 9:** The labyrinth (maze + 15 waves)

### Boss Level - Level 10
- **Level 10:** Last stand (longest path + 20 waves + 10 spots)

---

## Design Philosophy

### Progressive Difficulty
1. **Starting Resources:** 200 → 175 → 150 → 140 → ... → 120 (harder = less scrap)
2. **Wave Count:** 5 → 7 → 8 → 9 → 10 → 12 → 15 → 20 (progressive challenge)
3. **Construction Spots:** Tutorial levels have more spots, hard levels constrain options
4. **Enemy Composition:** Gradual introduction (shamblers → runners → brutes)

### Unique Level Identities
Each level has a distinct characteristic:
- L-shape vs S-curve vs zigzag vs maze
- Short path vs long path
- Many spots vs few spots
- Chokepoints vs open areas

### Star Requirements
- Lower requirements on harder levels (acknowledge difficulty)
- 3-star runs require near-perfect play
- Unlocks tier-gated (need stars from previous level)

---

## Technical Implementation Notes

**File Locations:**
- Level configs: `/home/user/zombies/data/maps/level-01.ts` through `level-10.ts`
- Barrel export: `/home/user/zombies/data/maps/index.ts`
- This documentation: `/home/user/zombies/docs/level-designs.md`

**Types Used:**
- `LevelConfig` from `@/types/levels`
- `MapConfig` from `@/types/map`
- `EnemyType` from `@/constants/enemies`

**Coordinates:**
- All positions in TILES (not pixels)
- Grid: 20 wide × 12 high
- Tile size: 32px

---

**Created:** 2025-11-16
**Phase:** PHASE-002-LEVEL-DESIGN
**Agent:** Agent B
