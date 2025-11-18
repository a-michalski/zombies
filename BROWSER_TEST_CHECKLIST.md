# BROWSER TEST CHECKLIST
## 7 New Levels (11-17) + Special Abilities Testing

**Date:** 2025-11-18
**Branch:** `claude/design-game-levels-011HpQA4319cUTrEXuUFJ8xD`
**Tester:** ___________

---

## ⚠️ CRITICAL TESTS (Must Pass Before Ship)

### 1. NEW ENEMIES APPEAR

- [ ] **Level 12, Wave 6:** Spitter enemies spawn (purple color #9C27B0)
- [ ] **Level 13, Wave 5:** Crawler enemies spawn (cyan color #00BCD4)
- [ ] **Level 14, Wave 7:** Bloater enemies spawn (green color #8BC34A)
- [ ] **Level 15, Wave 6:** Tank enemies spawn (gray color #607D8B)
- [ ] **Level 17, Wave 10:** Hive Queen spawns (pink color #E91E63, large size 48px)

### 2. TANK ARMOR (25% Damage Reduction)

**Test:** Build Lookout Post Level 3 (37.5 DPS). Shoot Tank enemy.

- [ ] Tank takes **28** damage per hit (not 37.5)
- [ ] Floating text shows reduced damage number "-28" (or "-18" for L2)
- [ ] Tank requires ~16 seconds to kill (not 12 seconds)

**Expected:** All projectiles deal 75% damage to Tanks.

**⚠️ Known Issue:** If Tank takes full damage (37.5), armor is NOT working!

### 3. BLOATER DEATH EXPLOSION

**Test:** Kill Bloater near a tower (within 1.5 units).

- [ ] Green explosion particles appear (color #8BC34A)
- [ ] Floating text "EXPLOSION!" appears on tower
- [ ] Tower downgrades by 1 level (Level 2 → Level 1)
- [ ] If Level 1 tower: Floating text "DESTROYED!" and tower disappears
- [ ] Hull Integrity decreases by 5

**Expected:** Bloater explosion damages/destroys nearby towers.

**⚠️ Known Issue:** If tower doesn't downgrade, explosion logic is NOT working!

### 4. CRAWLER SPEED BOOST

**Test:** Damage Crawler to <50% HP.

- [ ] Crawler base speed: 2.2 tiles/sec (normal movement)
- [ ] After <50% HP: Crawler speed increases to **3.08 tiles/sec** (visibly faster)
- [ ] Crawler reaches exit faster than expected

**Expected:** Crawler visibly speeds up when health drops below 50%.

**⚠️ Known Issue:** If Crawler doesn't speed up when damaged, speed boost is NOT working!

### 5. HIVE QUEEN REGENERATION

**Test:** Damage Hive Queen, then stop shooting.

- [ ] Hive Queen health bar decreases when hit
- [ ] When NOT taking damage: Health bar slowly increases (3 HP/sec)
- [ ] Regeneration stops at max HP (950 HP)
- [ ] Must sustain constant DPS or Queen heals

**Expected:** Hive Queen passively regenerates health.

**⚠️ Known Issue:** If Queen doesn't regenerate, regen logic is NOT working!

### 6. CANNON TOWER AOE DAMAGE

**Test:** Build Cannon Tower. Wait for grouped enemies.

- [ ] Cannon Tower option appears in BuildMenu (costs 250 scrap)
- [ ] Cannon shoots slower than Lookout Post (0.4 shots/sec)
- [ ] Orange explosion particles appear on impact (#FF8800)
- [ ] **ALL enemies within 1.0 unit radius take damage** (not just target)
- [ ] Multiple damage numbers appear for multiple enemies hit

**Expected:** Cannon Tower damages all enemies in blast radius.

**⚠️ Known Issue:** If only 1 enemy takes damage, AOE is NOT working!

### 7. TOWER TYPE SELECTION

**Test:** Click construction spot to open BuildMenu.

- [ ] Two buttons appear: "Lookout Post" and "Cannon Tower"
- [ ] Lookout Post costs 100 scrap
- [ ] Cannon Tower costs 250 scrap
- [ ] Stats change when selecting different tower type
- [ ] Cannon Tower shows "AOE (radius 1.0)" in stats
- [ ] Can build either tower type successfully

**Expected:** Player can choose which tower to build.

**⚠️ Known Issue:** If only Lookout Post appears, BuildMenu update failed!

---

## 🎮 GAMEPLAY TESTS

### Level 11: The Outskirts

- [ ] Level appears in campaign menu
- [ ] Map loads correctly (S-curve path)
- [ ] 10 construction spots visible
- [ ] Starting scrap: 200
- [ ] 10 waves complete successfully
- [ ] Uses Shuffler, Sprinter, Brute enemies (no new enemies yet)

### Level 12: Dead Factory

- [ ] Level unlocks after completing Level 11
- [ ] Map loads correctly (assembly line path)
- [ ] 9 construction spots visible
- [ ] Starting scrap: 180
- [ ] **NEW:** Spitter enemies appear (purple, ranged attack)
- [ ] **NEW:** Cannon Tower can be built
- [ ] Wave 6: First Spitter introduction
- [ ] Victory screen shows correct stats

### Level 13: The Descent

- [ ] Level unlocks after completing Level 12
- [ ] Map loads correctly (zigzag underground tunnels)
- [ ] 7 construction spots visible (reduced count)
- [ ] Starting scrap: 160
- [ ] **NEW:** Crawler enemies appear (cyan, very fast)
- [ ] Wave 5: First Crawler pack
- [ ] **TEST:** Crawlers speed up when damaged
- [ ] Difficulty feels harder (tight economy)

### Level 14: The Nexus

- [ ] Level unlocks after completing Level 13
- [ ] Map loads correctly (lab floor scattered obstacles)
- [ ] 8 construction spots visible
- [ ] Starting scrap: 140
- [ ] **NEW:** Bloater enemies appear (green, slow, large)
- [ ] Wave 7: First Bloater
- [ ] **TEST:** Bloater explodes and damages towers
- [ ] Wave 10: Multi-Bloater finale

### Level 15: Scorched Earth

- [ ] Level unlocks after completing Level 14
- [ ] Map loads correctly (straight battlefield path)
- [ ] 8 construction spots visible
- [ ] Starting scrap: 130
- [ ] **NEW:** Tank enemies appear (gray, armored)
- [ ] Wave 6: First Tank
- [ ] **TEST:** Tank takes reduced damage (armor works)
- [ ] Difficulty spike (DPS check level)

### Level 16: The Hive

- [ ] Level unlocks after completing Level 15
- [ ] Map loads correctly (organic biomass corridor)
- [ ] 6 construction spots visible (minimal)
- [ ] Starting scrap: 120
- [ ] Only heavy enemies (Tank, Bloater, Brute)
- [ ] Wave 8: Triple Tank wall
- [ ] Extremely difficult (mastery test)

### Level 17: The Queen's Fall

- [ ] Level unlocks after completing Level 16
- [ ] Map loads correctly (circular boss arena)
- [ ] 7 construction spots visible
- [ ] Starting scrap: 110
- [ ] **NEW:** Hive Queen appears (pink, huge, boss)
- [ ] Wave 10: Hive Queen + adds
- [ ] **TEST:** Hive Queen regenerates health
- [ ] Victory shows campaign completion

---

## 🐛 POTENTIAL BUGS TO CHECK

### Enemy Behavior

- [ ] **Spitter ranged attack:** Does Spitter walk to exit or attack from range?
  - **⚠️ KNOWN LIMITATION:** Spitter currently walks to exit (ranged attack not implemented)
  - **Expected:** Spitter should attack hull from distance, not walk to end

- [ ] **Crawler speed particles:** Does Crawler show speed effect when boosted?
  - **Note:** Visual effects not implemented yet (speed boost logic works, but no visual)

- [ ] **Tank armor visual:** Does Tank show damage reduction visually?
  - **Note:** Check if damage numbers are clearly reduced (e.g., 28 instead of 37.5)

- [ ] **Bloater chain explosions:** If 2 Bloaters die near each other, do both explode?
  - **Expected:** Yes, explosions should chain

- [ ] **Hive Queen regen visual:** Does Queen show green particles when regenerating?
  - **⚠️ KNOWN LIMITATION:** Regen works but no visual particles (not implemented)

### Tower Behavior

- [ ] **Cannon Tower targeting:** Does Cannon prioritize grouped enemies?
  - **Expected:** Same targeting as Lookout Post (furthest along path)

- [ ] **Cannon Tower upgrade:** Can Cannon Tower upgrade to Level 2-3?
  - **Expected:** Yes, costs 150 scrap (L2), 300 scrap (L3)

- [ ] **Mixed tower types:** Can I build Lookout Post AND Cannon Tower on same map?
  - **Expected:** Yes

- [ ] **Tower sell value:** Does selling Cannon Tower return correct scrap?
  - **Expected:** 50% of invested scrap (125 for L1, 200 for L2, 350 for L3)

### UI/UX Issues

- [ ] **BuildMenu tower type selection:** Do buttons highlight correctly when selected?
- [ ] **Cost display:** Does cost update when switching tower types?
- [ ] **Insufficient scrap:** Is Cannon Tower button disabled if <250 scrap?
- [ ] **Stats display:** Do stats show correctly for Cannon Tower?
  - **Damage:** 25
  - **Range:** 1.5
  - **Fire Rate:** 0.4/s
  - **DPS:** 10.0
  - **Type:** AOE (radius 1.0)

### Map/Wave Issues

- [ ] **Level progression:** Do levels 11-17 unlock in correct order?
- [ ] **Starting scrap:** Does each level start with correct scrap amount?
  - L11: 200, L12: 180, L13: 160, L14: 140, L15: 130, L16: 120, L17: 110
- [ ] **Construction spot count:** Does each level have correct number of spots?
  - L11: 10, L12: 9, L13: 7, L14: 8, L15: 8, L16: 6, L17: 7
- [ ] **Wave count:** Do all levels have exactly 10 waves?
- [ ] **Victory condition:** Does completing wave 10 trigger victory screen?
- [ ] **Star rating:** Does star system work for new levels?

---

## 🎯 BALANCE TESTS

### Economy Check

**Test:** Play each level and track scrap management.

- [ ] **Level 11 (1.80 ratio):** Can afford 3-4 upgraded towers (feels easy)
- [ ] **Level 12 (2.00 ratio):** Generous scrap, can experiment with Cannon Tower
- [ ] **Level 13 (1.50 ratio):** Tighter economy, must be strategic
- [ ] **Level 14 (1.60 ratio):** Balanced challenge
- [ ] **Level 15 (1.20 ratio):** Difficult, requires Level 3 towers
- [ ] **Level 16 (1.15 ratio):** Extremely tight, minimal mistakes allowed
- [ ] **Level 17 (1.10 ratio):** Boss fight, must use all resources wisely

**⚠️ Known Issue:** If Level 15-17 feel impossible, economy might be too tight (UX audit flagged this).

### Difficulty Curve

**Test:** Play levels 11-17 in sequence.

- [ ] Level 11 feels **easy** (re-entry after Level 10)
- [ ] Level 12 feels **easy** (introduces Spitter gently)
- [ ] Level 13 feels **medium** (first difficulty spike)
- [ ] Level 14 feels **medium** (manageable challenge)
- [ ] Level 15 feels **hard** (DPS check)
- [ ] Level 16 feels **very hard** (mastery test)
- [ ] Level 17 feels **epic** (boss battle)

**Expected:** Smooth progression from easy → hard.

**⚠️ Red Flag:** If Level 13 feels harder than Level 15, difficulty curve is broken!

---

## 🔧 TECHNICAL TESTS

### Console Errors

**Test:** Open browser console (F12) and play.

- [ ] No TypeScript errors in console
- [ ] No runtime errors when spawning new enemies
- [ ] No errors when building Cannon Tower
- [ ] No errors when Bloater explodes
- [ ] No errors when Crawler speed boosts
- [ ] No errors when Hive Queen regenerates

**⚠️ Critical:** Any red errors in console = bug!

### Performance

**Test:** Play Level 17 with max enemies on screen.

- [ ] Game runs at 60 FPS (no lag)
- [ ] Cannon Tower AOE doesn't cause lag spikes
- [ ] Bloater explosions don't freeze game
- [ ] 10+ enemies on screen at once without slowdown

**⚠️ Red Flag:** Game slows down below 30 FPS = performance issue!

### Save/Load

**Test:** Play Level 11, exit game, reload page.

- [ ] Level 11 completion is saved
- [ ] Level 12 unlocks after completing Level 11
- [ ] Star ratings persist across sessions
- [ ] Best scores save correctly

---

## 📊 EXPECTED RESULTS SUMMARY

### ✅ What Should Work Perfectly

1. All 7 new levels (11-17) playable
2. New enemies spawn at correct waves
3. Tank armor reduces damage by 25%
4. Bloater explosion damages towers
5. Crawler speeds up when damaged
6. Hive Queen regenerates health
7. Cannon Tower AOE damages multiple enemies
8. BuildMenu allows choosing tower type

### ⚠️ Known Limitations (Not Implemented Yet)

1. **Spitter ranged attack:** Spitter walks to exit instead of shooting from range
2. **Visual effects:** No speed boost particles for Crawler
3. **Visual effects:** No regeneration particles for Hive Queen
4. **Sound effects:** No explosion sounds for Bloater/Cannon
5. **UI indicators:** No armor icon on Tank
6. **UI indicators:** No speed boost icon on Crawler

### ❌ Critical Bugs (Must Fix)

Report immediately if found:

1. Tank takes full damage (armor not working)
2. Bloater doesn't explode on death
3. Crawler doesn't speed up when damaged
4. Hive Queen doesn't regenerate
5. Cannon Tower only damages 1 enemy (AOE not working)
6. Can't select Cannon Tower in BuildMenu
7. Game crashes when spawning new enemies
8. Levels 11-17 don't appear in campaign menu

---

## 📝 TEST EXECUTION NOTES

**Tester:** ___________
**Date:** ___________
**Browser:** ___________
**OS:** ___________

### Critical Bugs Found:

1. _________________________________
2. _________________________________
3. _________________________________

### Minor Issues:

1. _________________________________
2. _________________________________
3. _________________________________

### Suggestions:

1. _________________________________
2. _________________________________
3. _________________________________

---

## 🎯 SIGN-OFF CHECKLIST

Before approving for production:

- [ ] All 7 CRITICAL TESTS pass
- [ ] All 7 levels complete successfully
- [ ] 5 special abilities work correctly (Tank armor, Bloater explosion, Crawler speed, Queen regen, Cannon AOE)
- [ ] Tower selection works in BuildMenu
- [ ] No game-breaking bugs found
- [ ] Performance acceptable (60 FPS)
- [ ] No console errors

**Final Approval:** ☐ READY TO SHIP | ☐ NEEDS FIXES

**Approved By:** ___________
**Date:** ___________

---

## 📚 REFERENCE STATS

### Enemy Stats (For Testing)

| Enemy | HP | Speed | Damage | Scrap | Color |
|-------|----|----|--------|-------|-------|
| Spitter | 130 | 1.1 | 2 | 13 | Purple #9C27B0 |
| Crawler | 55 | 2.2 → 3.08 | 1 | 6 | Cyan #00BCD4 |
| Bloater | 375 | 0.5 | 3 | 30 | Green #8BC34A |
| Tank | 450 | 0.7 | 4 | 35 | Gray #607D8B |
| Hive Queen | 950 | 0.8 | 10 | 80 | Pink #E91E63 |

### Tower Stats (For Testing)

**Lookout Post:**
- L1: 10 dmg, 3.0 range, 1.0 fire rate, 10 DPS, 100 scrap
- L2: 15 dmg, 3.25 range, 1.2 fire rate, 18 DPS, +75 scrap
- L3: 25 dmg, 3.5 range, 1.5 fire rate, 37.5 DPS, +175 scrap

**Cannon Tower:**
- L1: 25 dmg, 1.5 range, 0.4 fire rate, 10 DPS, 250 scrap, **AOE 1.0 radius**
- L2: 40 dmg, 1.75 range, 0.5 fire rate, 20 DPS, +150 scrap, **AOE 1.0 radius**
- L3: 65 dmg, 2.0 range, 0.6 fire rate, 39 DPS, +300 scrap, **AOE 1.0 radius**

### Level Economy (For Testing)

| Level | Starting Scrap | Spots | Difficulty |
|-------|---------------|-------|------------|
| 11 | 200 | 10 | Easy |
| 12 | 180 | 9 | Easy |
| 13 | 160 | 7 | Medium |
| 14 | 140 | 8 | Medium |
| 15 | 130 | 8 | Hard |
| 16 | 120 | 6 | Hard |
| 17 | 110 | 7 | Hard (Boss) |
