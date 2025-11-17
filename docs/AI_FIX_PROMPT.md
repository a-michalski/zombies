# AI Fix Prompt - Zombie Fleet Bastion Improvements

## Context
You are working on a React Native/Expo tower defense game called "Zombie Fleet Bastion". The game has been reviewed by QA and App Store reviewers, and there are critical issues that need to be fixed before the app can be submitted to app stores.

## Your Task
Fix all critical and high-priority issues identified in two comprehensive reviews:
1. **QA & Game Design Review** (`docs/QA_GAME_DESIGN_REVIEW.md`)
2. **App Store Review** (`docs/APP_STORE_REVIEW.md`)

## Project Structure
- Framework: React Native with Expo Router
- Language: TypeScript
- State Management: Context API + Custom Hooks
- Storage: AsyncStorage
- File-based routing: `app/` directory
- Components: `components/` directory
- Constants: `constants/` directory
- Utils: `utils/` directory

## Critical Issues to Fix

### PHASE 1: App Store Compliance (CRITICAL - Must Fix First)

#### 1.1 Create Privacy Policy
**Files to create:**
- `app/privacy.tsx` - Privacy Policy screen
- `docs/PRIVACY_POLICY.md` - Privacy Policy document

**Requirements:**
- Must disclose all data collected:
  - Game statistics (zombies killed, waves survived, best wave)
  - Settings preferences (music, sound, game speed)
  - Campaign progress (level completion, stars, unlocked levels)
  - All stored locally in AsyncStorage
- Must explain:
  - Why data is collected (game functionality)
  - How it's stored (local device storage only)
  - How long it's kept (until app uninstall or user reset)
  - User rights (access, delete, export)
- Must be accessible from Settings screen
- Style: Match existing app design (dark theme, similar to Settings screen)

**Implementation:**
```typescript
// app/privacy.tsx should:
// - Use ScrollView for long content
// - Match Settings screen styling
// - Include back button
// - Display Privacy Policy text in readable format
```

#### 1.2 Create Terms of Service
**Files to create:**
- `app/terms.tsx` - Terms of Service screen
- `docs/TERMS_OF_SERVICE.md` - Terms of Service document

**Requirements:**
- Standard EULA/Terms of Service
- Include: usage rights, limitations, liability, etc.
- Accessible from Settings screen
- Match app design style

#### 1.3 Create About/Contact Screen
**Files to create:**
- `app/about.tsx` - About/Contact screen

**Requirements:**
- Developer name/company: "Rork" (from app.json bundle identifier)
- Support email: [TO BE PROVIDED BY USER]
- Website: https://rork.com/ (from app.json)
- App version: Display from `expo-constants`
- Build number: Display from `expo-constants`
- Link in Settings screen

**Implementation:**
```typescript
// Use expo-constants to get version:
import Constants from 'expo-constants';
const version = Constants.expoConfig?.version;
```

#### 1.4 Fix App Name
**File to modify:**
- `app.json`

**Change:**
```json
// FROM:
"name": "Zombie Fleet Bastion Prototype"

// TO:
"name": "Zombie Fleet Bastion"
```

#### 1.5 Remove Unused Dependencies
**File to modify:**
- `package.json`

**Remove:**
- `expo-location` (not used in code)
- `expo-image-picker` (not used in code)

**Action:**
```bash
# Remove from package.json dependencies
# Then run: bun install
```

#### 1.6 Update Settings Screen
**File to modify:**
- `app/settings.tsx`

**Add links to:**
- Privacy Policy (navigate to `/privacy`)
- Terms of Service (navigate to `/terms`)
- About/Contact (navigate to `/about`)

**Implementation:**
Add new section in Settings:
```typescript
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Legal & Support</Text>
  
  <TouchableOpacity
    style={styles.settingRow}
    onPress={() => router.push('/privacy')}
  >
    <Text style={styles.settingLabel}>Privacy Policy</Text>
    <ArrowRight />
  </TouchableOpacity>
  
  <TouchableOpacity
    style={styles.settingRow}
    onPress={() => router.push('/terms')}
  >
    <Text style={styles.settingLabel}>Terms of Service</Text>
    <ArrowRight />
  </TouchableOpacity>
  
  <TouchableOpacity
    style={styles.settingRow}
    onPress={() => router.push('/about')}
  >
    <Text style={styles.settingLabel}>About & Contact</Text>
    <ArrowRight />
  </TouchableOpacity>
</View>
```

#### 1.7 Add Data Management Features
**File to modify:**
- `app/settings.tsx`

**Add:**
- "Reset Progress" button (with confirmation dialog)
- "Export Data" button (optional, but recommended)

**Implementation:**
```typescript
// Use existing resetCampaignProgress from utils/storage.ts
import { resetCampaignProgress, getStats, getSettings, loadCampaignProgress } from '@/utils/storage';

// Reset Progress function:
const handleResetProgress = async () => {
  // Show Alert.alert confirmation
  // If confirmed, call resetCampaignProgress()
  // Also reset stats
  // Show success message
};
```

---

### PHASE 2: Game Balance Fixes (HIGH PRIORITY)

#### 2.1 Fix Wave 10 Bug
**File to modify:**
- `constants/waves.ts`

**Issue:** Wave 10 has duplicate Brute entry

**Current (WRONG):**
```typescript
{
  wave: 10,
  enemies: [
    { type: "brute", count: 1 },
    { type: "runner", count: 15 },
    { type: "brute", count: 1 },  // DUPLICATE!
    { type: "shambler", count: 20 },
  ],
  spawnDelay: 0.6,
}
```

**Fix:**
```typescript
{
  wave: 10,
  enemies: [
    { type: "brute", count: 2 },  // Combined into one entry
    { type: "runner", count: 15 },
    { type: "shambler", count: 20 },
  ],
  spawnDelay: 0.6,
}
```

#### 2.2 Fix Level 2 Tower Range
**File to modify:**
- `constants/towers.ts`

**Issue:** Level 2 tower has no range increase

**Current:**
```typescript
{
  level: 2,
  damage: 15,
  range: 3.0,  // Same as level 1
  fireRate: 1.2,
  upgradeCost: 75,
}
```

**Fix:**
```typescript
{
  level: 2,
  damage: 15,
  range: 3.25,  // Increased from 3.0
  fireRate: 1.2,
  upgradeCost: 75,
}
```

#### 2.3 Improve Early Game Economy
**File to modify:**
- `constants/gameConfig.ts`

**Options (choose one):**

**Option A: Increase Starting Scrap**
```typescript
// FROM:
STARTING_SCRAP: 150,

// TO:
STARTING_SCRAP: 200,
```

**Option B: Reduce First Tower Cost**
```typescript
// In constants/towers.ts
// FROM:
buildCost: 100,

// TO:
buildCost: 75,
```

**Recommendation:** Use Option A (increase starting scrap to 200) as it's simpler and less disruptive.

#### 2.4 Introduce Runners Earlier
**File to modify:**
- `constants/waves.ts`

**Issue:** Wave 4 still only has Shamblers

**Current Wave 4:**
```typescript
{
  wave: 4,
  enemies: [{ type: "shambler", count: 15 }],
  spawnDelay: 1.2,
}
```

**Fix:**
```typescript
{
  wave: 4,
  enemies: [
    { type: "shambler", count: 12 },
    { type: "runner", count: 3 },  // Introduce Runners
  ],
  spawnDelay: 1.2,
}
```

---

### PHASE 3: UX Improvements (HIGH PRIORITY)

#### 3.1 Add Tower Range Visualization
**File to modify:**
- `components/game/GameMap.tsx`

**Requirement:** Show tower range when tower is selected

**Implementation:**
```typescript
// When tower is selected, draw a circle showing its range
// Use SVG Circle component
// Color: semi-transparent (e.g., rgba(74, 144, 226, 0.2))
// Border: rgba(74, 144, 226, 0.5)
```

#### 3.2 Add Enemy Health Bars
**File to modify:**
- `components/game/EnemyRenderer.tsx`

**Requirement:** Show health bar above each enemy

**Implementation:**
```typescript
// Draw health bar above enemy
// Green when full health
// Red when low health
// Show current/max health ratio
```

#### 3.3 Add Construction Spot Highlight
**File to modify:**
- `components/game/GameMap.tsx`

**Requirement:** Highlight construction spot when tapped/selected

**Current:** Spots are clickable but don't show clear feedback

**Implementation:**
```typescript
// When spot is selected (gameState.selectedSpotId === spot.id):
// - Increase opacity
// - Add pulsing animation
// - Change border color to gold/yellow
```

#### 3.4 Add Tutorial/Onboarding
**Files to create:**
- `components/tutorial/TutorialOverlay.tsx`
- `app/_layout.tsx` (modify to show tutorial on first launch)

**Requirements:**
- Show on first launch only
- Use AsyncStorage to track if tutorial was shown
- Interactive tutorial:
  1. Highlight construction spots
  2. Show how to build tower
  3. Show how to start wave
  4. Show how to upgrade tower
- Skip button available
- Match app design style

**Implementation:**
```typescript
// Check in _layout.tsx or index.tsx:
const [showTutorial, setShowTutorial] = useState(false);

useEffect(() => {
  checkTutorialStatus();
}, []);

const checkTutorialStatus = async () => {
  const tutorialShown = await AsyncStorage.getItem('@tutorial_shown');
  if (!tutorialShown) {
    setShowTutorial(true);
  }
};
```

---

### PHASE 4: Additional Improvements (MEDIUM PRIORITY)

#### 4.1 Add DPS Calculation
**File to modify:**
- `components/game/BuildMenu.tsx`
- `components/game/UpgradeMenu.tsx`

**Requirement:** Show Damage Per Second (DPS) in tower stats

**Calculation:**
```typescript
const dps = damage * fireRate;
// Display: "DPS: 10" (for damage 10, fireRate 1.0)
```

#### 4.2 Add Next Wave Preview
**File to modify:**
- `app/game.tsx`

**Requirement:** Show upcoming wave enemies before starting

**Implementation:**
```typescript
// Add "Preview Wave" button in between_waves phase
// Show modal with:
// - Wave number
// - Enemy types and counts
// - Total enemies
```

#### 4.3 Improve Late Game Economy
**File to modify:**
- `constants/gameConfig.ts`
- `constants/towers.ts`

**Options:**
- Increase upgrade costs slightly
- Add "premium" upgrades (optional)
- Add scrap sinks (repair hull, temporary buffs)

**Recommendation:** Increase L2→L3 upgrade cost from 150 to 175 scrap

---

## Implementation Guidelines

### Code Style
- Follow existing code patterns
- Use TypeScript strictly
- Match existing component structure
- Use existing styling patterns (StyleSheet)
- Follow React Native best practices

### Testing Requirements
- Test all new screens navigate correctly
- Test Privacy Policy/Terms/About screens
- Test Settings links work
- Test Reset Progress functionality
- Test tutorial flow
- Test game balance changes (play through waves 1-10)

### File Organization
- New screens go in `app/` directory
- New components go in `components/` directory
- Documentation goes in `docs/` directory
- Follow existing naming conventions

### Design Consistency
- Use existing color scheme:
  - Background: `#1a1a1a`, `#222222`
  - Text: `#FFFFFF`, `#AAAAAA`
  - Accent: `#4CAF50` (green), `#4A90E2` (blue)
  - Error: `#FF4444` (red)
- Use existing typography (font sizes, weights)
- Match Settings screen style for new screens

---

## Priority Order

1. **CRITICAL (Do First):**
   - Privacy Policy screen
   - Terms of Service screen
   - About/Contact screen
   - Fix app name
   - Remove unused dependencies
   - Update Settings with links

2. **HIGH PRIORITY (Do Second):**
   - Fix Wave 10 bug
   - Fix Level 2 tower range
   - Improve early game economy
   - Add tower range visualization
   - Add enemy health bars
   - Add construction spot highlight

3. **MEDIUM PRIORITY (Do Third):**
   - Add tutorial
   - Add DPS calculation
   - Add next wave preview
   - Improve late game economy

---

## Expected Outcomes

After implementing these fixes:
- App Store compliance: 18/20 (90%) - Ready for submission
- Game balance: Improved early and late game
- UX: Better player guidance and feedback
- Code quality: Maintained or improved

---

## Notes

- All changes should be backward compatible
- Test thoroughly before committing
- Follow existing git workflow (commit after each phase)
- Update documentation if needed
- Ask for clarification if requirements are unclear

---

## Questions to Ask User

Before starting, confirm:
1. Support email address for About screen
2. Developer/company name (currently "Rork" from bundle ID)
3. Website URL (currently https://rork.com/ from app.json)
4. Preference for early game economy fix (Option A: more scrap, or Option B: cheaper tower)

---

**Ready to start? Begin with PHASE 1 (App Store Compliance) as these are critical blockers.**

