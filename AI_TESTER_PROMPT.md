# AI TESTING PROMPT: Zombie Tower Defense - 7 New Levels Verification

## CONTEXT

You are an expert game tester and balance analyst reviewing a major content expansion for a zombie tower defense game. The development team has implemented 7 new campaign levels (11-17) with new enemies, special abilities, a new tower type, and complete game mechanics.

## YOUR MISSION

Analyze the implementation for:

1. **Game Balance** - Economy, difficulty curve, DPS/HP ratios
2. **Logic Correctness** - Special abilities implementation, edge cases
3. **UX/Playability** - Player experience, frustration points, fun factor
4. **Technical Issues** - Potential bugs, performance problems, integration issues
5. **Design Coherence** - Does everything fit together logically?

---

## WHAT WAS IMPLEMENTED

### 7 New Campaign Levels (11-17)

**Level 11: The Outskirts** (Easy)
- 10 construction spots, 200 starting scrap
- S-curve path, re-entry level after Level 10
- Economy ratio: 1.80 (generous)

**Level 12: Dead Factory** (Easy)
- 9 construction spots, 180 starting scrap
- Assembly line path
- **Introduces:** Spitter enemy (Wave 6), Cannon Tower unlocked
- Economy ratio: 2.00 (very generous)

**Level 13: The Descent** (Medium)
- 7 construction spots, 160 starting scrap
- Zigzag underground tunnels
- **Introduces:** Crawler enemy (Wave 5) with speed boost ability
- Economy ratio: 1.50 (tight) - First difficulty spike

**Level 14: The Nexus** (Medium)
- 8 construction spots, 140 starting scrap
- Lab floor with scattered obstacles
- **Introduces:** Bloater enemy (Wave 7) with death explosion
- Economy ratio: 1.60 (balanced)

**Level 15: Scorched Earth** (Hard)
- 8 construction spots, 130 starting scrap
- Straight battlefield path
- **Introduces:** Tank enemy (Wave 6) with 25% armor
- Economy ratio: 1.20 (difficult) - DPS check level

**Level 16: The Hive** (Hard)
- 6 construction spots, 120 starting scrap
- Organic corridor (minimal spots)
- Only heavy enemies (Tank, Bloater, Brute)
- Economy ratio: 1.15 (extremely tight) - Mastery test

**Level 17: The Queen's Fall** (Hard - BOSS)
- 7 construction spots, 110 starting scrap
- Circular arena
- **Introduces:** Hive Queen boss (Wave 10) with regeneration
- Economy ratio: 1.10 (boss fight) - Campaign finale

### 5 New Enemy Types

| Enemy | HP | Speed | Damage | Scrap | Special Ability |
|-------|----|----|--------|-------|-----------------|
| **Spitter** | 130 | 1.1 | 2 | 13 | Purple #9C27B0 - Ranged attack (NOT implemented yet) |
| **Crawler** | 55 | 2.2→3.08 | 1 | 6 | Cyan #00BCD4 - Speed boost ×1.4 when <50% HP |
| **Bloater** | 375 | 0.5 | 3 | 30 | Green #8BC34A - Explodes on death (1.5 radius, downgrades towers) |
| **Tank** | 450 | 0.7 | 4 | 35 | Gray #607D8B - 25% damage reduction (armor) |
| **Hive Queen** | 950 | 0.8 | 10 | 80 | Pink #E91E63 - Regenerates 3 HP/sec (boss) |

### New Tower: Cannon Tower

| Level | Damage | Range | Fire Rate | DPS | Cost | Special |
|-------|--------|-------|-----------|-----|------|---------|
| L1 | 25 | 1.5 | 0.4/s | 10.0 | 250 scrap | **AOE 1.0 radius** |
| L2 | 40 | 1.75 | 0.5/s | 20.0 | +150 scrap | **AOE 1.0 radius** |
| L3 | 65 | 2.0 | 0.6/s | 39.0 | +300 scrap | **AOE 1.0 radius** |

**Comparison to Lookout Post:**
- Lookout Post L1: 10 dmg, 3.0 range, 1.0 fire rate, 10 DPS, 100 scrap
- Cannon Tower L1: 25 dmg, 1.5 range, 0.4 fire rate, 10 DPS, 250 scrap, **AOE**

**Trade-off:** Cannon costs 2.5× more, has 50% range, but damages ALL enemies in blast radius.

### BuildMenu Tower Selection

Players can now choose which tower to build:
- Click construction spot → BuildMenu shows 2 buttons
- "Lookout Post" (100 scrap) vs "Cannon Tower" (250 scrap)
- Stats dynamically update based on selection
- Can build mixed tower types on same map

---

## IMPLEMENTATION DETAILS (FOR VERIFICATION)

### Special Abilities Code Logic

**1. Tank Armor (25% damage reduction)**

```typescript
// In useGameEngine.ts projectile collision
let finalDamage = projectile.damage;
if (targetEnemy.type === "tank") {
  finalDamage = Math.floor(projectile.damage * 0.75);
}
targetEnemy.health -= finalDamage;
```

**Question for tester:** Does Math.floor() cause issues with low-damage weapons? Should armor round up/down?

**2. Crawler Speed Boost (×1.4 when <50% HP)**

```typescript
// In useGameEngine.ts enemy movement
let effectiveSpeed = enemyConfig.speed;
if (enemy.type === "crawler") {
  const healthPercent = enemy.health / enemy.maxHealth;
  if (healthPercent < 0.5) {
    effectiveSpeed = enemyConfig.speed * 1.4; // 2.2 → 3.08 tiles/sec
  }
}
```

**Question for tester:** Does this create a "don't shoot crawlers until they're close" exploit?

**3. Bloater Death Explosion (1.5 radius, downgrades towers)**

```typescript
// In useGameEngine.ts after enemy dies
if (deadEnemy.type === "bloater") {
  const explosionRadius = 1.5;
  const explosionDamage = 5; // Hull integrity damage
  
  newState.towers.forEach((tower) => {
    const distance = getDistance(deadEnemy.position, tower.position);
    if (distance <= explosionRadius) {
      if (tower.level > 1) {
        tower.level -= 1; // Downgrade tower
      } else {
        // Remove Level 1 tower completely
        newState.towers = newState.towers.filter((t) => t.id !== tower.id);
      }
      newState.hullIntegrity -= explosionDamage;
    }
  });
  
  // Spawn green explosion particles
  // Spawn "EXPLOSION!" floating text on towers
}
```

**Questions for tester:**
- Is 1.5 radius too punishing? Should it be 1.0?
- Does destroying Level 1 towers feel too harsh?
- Can Bloater explosions chain-react if multiple Bloaters die near each other?
- Does this discourage building towers near the path (bad UX)?

**4. Hive Queen Regeneration (3 HP/sec)**

```typescript
// In useGameEngine.ts enemy update loop
if (enemy.type === "hiveQueen" && enemy.health < enemy.maxHealth) {
  enemy.health = Math.min(enemy.health + (3 * dt), enemy.maxHealth);
}
```

**Questions for tester:**
- Is 3 HP/sec balanced against player DPS?
- Hive Queen has 950 HP. Can player sustain enough DPS to outpace regen?
- Does this create boring "wait until all towers are built" meta?

**5. Cannon Tower AOE Damage (1.0 radius)**

```typescript
// In useGameEngine.ts projectile collision
if (projectile.towerType === "tower_cannon") {
  const aoeRadius = 1.0;
  const enemiesInAOE = newState.enemies.filter((enemy) => {
    const distToImpact = getDistance(enemy.position, projectile.targetPosition);
    return distToImpact <= aoeRadius;
  });
  
  enemiesInAOE.forEach((enemy) => {
    let finalDamage = projectile.damage;
    if (enemy.type === "tank") {
      finalDamage = Math.floor(projectile.damage * 0.75); // Tank armor applies
    }
    enemy.health -= finalDamage;
    // Spawn damage numbers, particles, etc.
  });
}
```

**Questions for tester:**
- Is AOE radius 1.0 too small? Too large?
- Does Cannon Tower damage scale correctly with enemy group sizes?
- Is 250 scrap cost balanced for AOE capability?
- Should AOE have damage falloff (full damage at center, 50% at edge)?

---

## VERIFICATION TASKS

### 1. BALANCE ANALYSIS

**Economy Check:**

Economy Ratio = (Starting Scrap + Total Enemy Scrap) / Minimum Viable Defense Cost

Verify these economy ratios make sense:
- Level 11: 1.80 (should feel easy/generous)
- Level 12: 2.00 (very generous, allows Cannon Tower experimentation)
- Level 13: 1.50 (tight, first difficulty spike)
- Level 14: 1.60 (balanced challenge)
- Level 15: 1.20 (difficult, requires Level 3 towers)
- Level 16: 1.15 (extremely tight, mastery test)
- Level 17: 1.10 (boss fight, minimal margin for error)

**Questions:**
- Does the economy progression feel fair?
- Are Levels 15-17 too punishing? (UX audit flagged this as potential frustration)
- Is there enough scrap to experiment with Cannon Tower in later levels?

**DPS vs HP Check:**

Calculate if player can realistically win each level:

**Example: Level 15, Wave 6 (First Tank)**
- Tank: 450 HP, 0.7 speed, 25% armor
- Path length: ~350 units
- Time to traverse: 350 / (0.7 × 32) ≈ 15.6 seconds
- Required DPS (with armor): 450 HP / 15.6s = 28.8 effective DPS needed
- Lookout Post L2: 18 DPS × 0.75 (armor) = 13.5 effective DPS ❌ NOT ENOUGH!
- Lookout Post L3: 37.5 DPS × 0.75 (armor) = 28.1 effective DPS ✅ Barely enough

Is this balanced? Player needs Level 3 towers by Wave 6 of Level 15. Is this achievable with 130 starting scrap + 5 waves of scrap income?

**Cannon Tower Value Analysis:**

**Scenario: 3 enemies grouped within 1.0 radius**
- Lookout Post L1: 10 dmg single-target = 10 total damage per shot
- Cannon Tower L1: 25 dmg × 3 enemies = 75 total damage per shot
- Effective DPS ratio: 7.5× more damage when hitting 3 enemies!

**Questions:**
- Is this too powerful against grouped enemies?
- Does 250 scrap cost balance the AOE advantage?
- Does slower fire rate (0.4/s vs 1.0/s) feel sluggish?

### 2. LOGIC VERIFICATION

**Test Cases to Check:**

**A. Tank Armor + Cannon AOE Interaction**

**Scenario:** Cannon Tower hits 1 Tank + 2 Crawlers

**Expected:**
- Tank takes: 25 × 0.75 = 18.75 → 18 damage (Math.floor)
- Crawlers take: 25 damage each

**Question:** Does the code correctly apply Tank armor to AOE damage?

**B. Bloater Explosion Chain Reaction**

**Scenario:** 2 Bloaters within 1.5 units of each other, both die simultaneously

**Expected:**
- Bloater A explodes → damages nearby towers + Bloater B (?)
- If Bloater B takes damage, does it die and explode too?

**Question:** Does the current code handle chain explosions? Should it?

**C. Crawler Speed Boost + Projectile Tracking**

**Scenario:** Projectile fired at Crawler at 100% HP (speed 2.2)
         Crawler drops to 49% HP mid-flight (speed 3.08)
         Projectile targets original predicted position

**Expected:**
- Does projectile miss because Crawler moved faster?
- Or does projectile track dynamically?

**Question:** Check useGameEngine.ts projectile movement logic. Does it recalculate target position?

**D. Hive Queen Regeneration + Overkill Damage**

**Scenario:** Hive Queen at 5 HP, regenerating 3 HP/sec
         Lookout Post L3 shoots (25 damage)

**Expected:**
- Hive Queen dies (overkill damage)
- Does regen trigger AFTER death? (Should be prevented)

**Question:** Check enemy update loop order. Is regen applied before/after death check?

**E. BuildMenu Tower Type Selection + Insufficient Scrap**

**Scenario:** Player has 150 scrap
         Clicks construction spot
         Selects "Cannon Tower" (costs 250 scrap)

**Expected:**
- Build button disabled
- Cost text turns red (#FF4444)
- Cannot build tower

**Question:** Does canAfford check work correctly for both tower types?

### 3. UX/PLAYABILITY ANALYSIS

**Player Experience Questions:**

**Level Difficulty Curve:**

Level 11 (Easy) → 12 (Easy) → 13 (Medium) → 14 (Medium) → 15 (Hard) → 16 (Very Hard) → 17 (Boss)

- Does this feel like smooth progression?
- Is the jump from Level 12 (Easy, 2.00 ratio) to Level 13 (Medium, 1.50 ratio) too steep?
- Is Level 16 (6 spots, 1.15 ratio, only heavy enemies) fun or frustrating?

**Cannon Tower Decision-Making:**

- When should player build Cannon Tower vs Lookout Post?
- Does 250 scrap cost make it "late-game only" tower?
- Is AOE radius 1.0 clear to player? (No visual indicator in game)
- Does 1.5 range (vs 3.0 Lookout) feel too short-ranged?

**Special Ability Clarity:**

- Tank armor: Does player notice damage reduction? (Floating damage numbers should show reduced values)
- Crawler speed boost: Is speed increase obvious? (No visual particles implemented)
- Bloater explosion: Is explosion warning clear BEFORE player builds towers near path?
- Hive Queen regen: Can player see health bar refilling? (No green particles implemented)

**Frustration Points:**

- Level 15-17: Are these too difficult for average players?
- Bloater explosions: Does losing a Level 3 tower (350+ scrap invested) feel unfair?
- Cannon Tower cost: Is 250 scrap too expensive to experiment with?
- Hive Queen regen: Does boss fight drag on too long if player under-builds?

### 4. TECHNICAL ISSUE DETECTION

**Potential Bugs:**

1. **Spitter ranged attack not implemented** - Spitter currently walks to exit instead of attacking from range. Is this acceptable?

2. **Performance:** Cannon Tower AOE checks distance for EVERY enemy. With 20+ enemies on screen, does this cause lag?

3. **Floating point precision:** Tank armor uses Math.floor(). Does 10 damage weapon deal 7 or 8 damage to Tank? (10 × 0.75 = 7.5 → 7)

4. **Tower sell refund:** Does selling Cannon Tower return correct scrap? (50% of invested: 125 L1, 200 L2, 350 L3)

5. **Level progression:** Does completing Level 11 unlock Level 12? (Check unlockRequirement.previousLevelId)

6. **Wave spawn timing:** Are spawnDelay values (1100-1600ms) balanced for new enemy speeds?

7. **Projectile lifetime:** Do slow Cannon projectiles (0.4/s fire rate) despawn correctly if enemy dies mid-flight?

### 5. DESIGN COHERENCE CHECK

**Does everything fit together logically?**

**Thematic Progression:**
- Level 11-12: Suburban/industrial (familiar, grounded)
- Level 13-14: Underground/lab (strange, dangerous)
- Level 15-16: Battlefield/hive (desperate, horrific)
- Level 17: Boss arena (epic finale)

**Enemy Introduction Order:**
- Level 12: Spitter (ranged enemy - teaches spacing)
- Level 13: Crawler (fast enemy - teaches reaction speed)
- Level 14: Bloater (tank enemy - teaches focus fire)
- Level 15: Tank (armored enemy - teaches DPS check)
- Level 17: Hive Queen (boss - tests all skills)

Is this pedagogically sound? Does each level teach one new mechanic?

**Tower Type Synergy:**

- **Lookout Post:** Long range (3.0), fast fire rate (1.0/s), cheap (100) → Good for: Early game, scattered enemies, tight budgets
- **Cannon Tower:** Short range (1.5), slow fire rate (0.4/s), expensive (250), AOE → Good for: Late game, grouped enemies, chokepoints

Does this create interesting strategic choices? Or is one tower always better?

---

## REFERENCE FILES TO REVIEW

Please review these files in the codebase:

1. **BROWSER_TEST_CHECKLIST.md** - 540-line comprehensive testing document
   - 7 Critical Tests (must-pass)
   - Gameplay tests for each level
   - Potential bugs with known limitations
   - Balance validation tests
   - Technical tests

2. **FINAL_7_LEVELS_DESIGN.md** - 1080-line design document
   - Complete YAML configurations
   - Multi-agent validation results (Grade A 95/100)
   - UX audit results (Grade B+ 82/100 - flagged economy concerns)

**Implementation Files:**
- `constants/enemies.ts` - Enemy stats and abilities
- `constants/towers.ts` - Tower stats (Lookout Post, Cannon Tower)
- `data/maps/level-11.ts` through `level-17.ts` - Level configurations
- `hooks/useGameEngine.ts` - Game loop with special abilities logic
- `components/game/BuildMenu.tsx` - Tower type selection UI
- `contexts/GameContext.tsx` - Tower build/upgrade/sell functions

---

## YOUR DELIVERABLE

Provide a comprehensive analysis covering:

### ✅ WHAT WORKS WELL
- Which design decisions are solid?
- Which levels feel well-balanced?
- Which special abilities are interesting/fun?

### ⚠️ CONCERNS & RISKS
- Which levels might be too hard/easy?
- Which special abilities might be exploitable/broken?
- Which mechanics need tuning?

### ❌ CRITICAL ISSUES
- Game-breaking bugs
- Impossible levels
- Unfair mechanics
- Technical problems

### 📊 BALANCE RECOMMENDATIONS
- Economy adjustments (starting scrap, enemy scrap rewards)
- Tower cost/damage tuning
- Special ability value changes (Tank armor %, Bloater radius, etc.)

### 🎮 UX IMPROVEMENTS
- Player feedback clarity (visual indicators for abilities)
- Difficulty curve smoothing
- Frustration reduction

### 🔧 TECHNICAL FIXES
- Code logic errors
- Performance optimizations
- Edge case handling

---

## TESTING METHODOLOGY

You can:
- **Simulate** - Calculate expected outcomes mathematically
- **Review Code** - Read implementation logic for bugs/edge cases
- **Analyze Design** - Evaluate balance, progression, UX
- **Compare Standards** - Does this match industry best practices for tower defense?

**Focus on:** Game balance, player experience, and potential bugs/exploits.

---

## KNOWN LIMITATIONS (Not Implemented Yet)

These are **INTENTIONALLY** not implemented:
- Spitter ranged attack (walks to exit instead)
- Visual effects (Crawler speed particles, Hive Queen regen particles)
- Sound effects (explosions, AOE impacts)
- UI indicators (Tank armor icon, Crawler speed boost icon)

**Do NOT flag these as bugs.** Focus on what IS implemented.

---

## SUCCESS CRITERIA

A good verification report will:
- Identify 3-5 critical balance issues (if any)
- Suggest specific numeric adjustments (e.g., "Increase Level 15 starting scrap from 130 to 150")
- Flag 2-3 potential exploits or edge cases
- Validate difficulty curve makes sense
- Confirm special abilities are coded correctly

**Begin your analysis.**

