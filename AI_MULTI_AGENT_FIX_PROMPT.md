# MULTI-AGENT PROMPT - Naprawa Bugów Zombie Fleet Bastion
**Data:** 2025-01-18  
**Branch:** `claude/design-game-levels-011HpQA4319cUTrEXuUFJ8xD`  
**Cel:** Naprawa 19 zidentyfikowanych problemów w grze

---

## 📋 KONTEKST PROJEKTU

**Projekt:** Zombie Fleet Bastion - Tower Defense Game  
**Framework:** React Native + Expo Router  
**Język:** TypeScript  
**State Management:** Context API + Custom Hooks  
**Storage:** AsyncStorage  
**Lokalizacja:** `/Users/adammichalski/Code/zombies`

**Struktura:**
- `app/` - File-based routing (Expo Router)
- `components/` - Komponenty React Native
- `contexts/` - Context API (GameContext, CampaignContext)
- `hooks/` - Custom hooks (useGameEngine)
- `constants/` - Konfiguracja (towers, enemies, gameConfig)
- `utils/` - Utilities (storage, imageAssets, pathfinding)
- `types/` - TypeScript type definitions

---

## 🎯 ZADANIE GŁÓWNE

Naprawić wszystkie 19 zidentyfikowanych problemów z `BUGS_AND_FIXES_LIST.md`, podzielonych na 4 fazy pracy dla różnych agentów.

**Dokumentacja:**
- `BUGS_AND_FIXES_LIST.md` - Pełna lista bugów z priorytetami
- `APP_STORE_COMPLIANCE_ANALYSIS.md` - Analiza zgodności App Store
- `GAMEPLAY_FLOW_ANALYSIS.md` - Analiza gameplay flow
- `ANALYSIS_PROGRESS.md` - Status analizy

---

## 🤖 AGENT A - Gameplay Fixes (PRIORYTET 1)

**Twoje zadanie:** Naprawić 6 krytycznych bugów gameplay

### BUG-001: GameOverScreen nie pokazuje gwiazdek
**Plik:** `components/game/GameOverScreen.tsx`  
**Problem:** Po victory nie widać ile gwiazdek gracz zdobył  
**Fix:**
1. Dodać import `useCampaignContext`
2. Pobrać `getLevelProgress(currentLevel.id)` aby uzyskać `starsEarned`
3. Wyświetlić gwiazdki w UI (⭐⭐⭐, ⭐⭐☆, ⭐☆☆)
4. Dodać style dla gwiazdek

**Kod do zmiany:**
```typescript
// components/game/GameOverScreen.tsx
import { useCampaignContext } from '@/contexts/CampaignContext';

export function GameOverScreen() {
  const { gameState, resetGame, currentLevel } = useGame();
  const { getLevelProgress } = useCampaignContext();
  
  // Get stars earned
  const levelProgress = currentLevel ? getLevelProgress(currentLevel.id) : null;
  const starsEarned = levelProgress?.starsEarned || 0;
  
  // Render stars function
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i < starsEarned ? '⭐' : '☆'}
        </Text>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };
  
  // W JSX (w sekcji victory):
  {isVictory && renderStars()}
}
```

---

### BUG-002: GameOverScreen hardcoded hull integrity (20)
**Plik:** `components/game/GameOverScreen.tsx`  
**Problem:** Pokazuje hardcoded `/20` zamiast używać `maxHullIntegrity` z poziomu  
**Fix:**
```typescript
const maxHullIntegrity = currentLevel?.mapConfig.startingResources.hullIntegrity || 20;
<Text style={styles.statValue}>
  {gameState.hullIntegrity}/{maxHullIntegrity}
</Text>
```

---

### BUG-003: Brak przycisku "Next Level" w GameOverScreen
**Plik:** `components/game/GameOverScreen.tsx`  
**Problem:** Po victory tylko "Play Again" i "Main Menu"  
**Fix:**
1. Dodać import `useCampaignContext` i `useRouter`
2. Pobrać `getNextLevel(currentLevel.id)`
3. Sprawdzić `isLevelUnlocked(nextLevel.id)`
4. Dodać przycisk "Next Level" jeśli unlocked
5. Kliknięcie → `startCampaignLevel(nextLevel)` → `router.push('/game')`

**Kod:**
```typescript
const { getNextLevel, isLevelUnlocked } = useCampaignContext();
const router = useRouter();

const nextLevel = currentLevel ? getNextLevel(currentLevel.id) : null;
const isNextLevelUnlocked = nextLevel ? isLevelUnlocked(nextLevel.id) : false;

// W JSX (w sekcji victory):
{isVictory && isNextLevelUnlocked && nextLevel && (
  <TouchableOpacity
    style={styles.nextLevelButton}
    onPress={() => {
      startCampaignLevel(nextLevel);
      router.push('/game');
    }}
  >
    <Text style={styles.buttonText}>Next Level: {nextLevel.name}</Text>
  </TouchableOpacity>
)}
```

---

### BUG-004: UpgradeMenu nie wspiera Cannon Tower
**Plik:** `components/game/UpgradeMenu.tsx`  
**Problem:** UpgradeMenu używa tylko `LOOKOUT_POST`, nie wspiera `CANNON_TOWER`  
**Fix:**
1. Dodać import `CANNON_TOWER` z `@/constants/towers`
2. Sprawdzić `tower.type` aby wybrać odpowiedni config
3. Użyć `tower.type === "tower_cannon" ? CANNON_TOWER : LOOKOUT_POST`
4. Zaktualizować wszystkie miejsca gdzie używa się `LOOKOUT_POST`:
   - `currentStats` (linia 21)
   - `nextStats` (linia 22)
   - `invested` calculation (linia 28-32)
   - `sellValue` calculation (linia 33)
   - Title (linia 54)

**Kod:**
```typescript
import { LOOKOUT_POST, CANNON_TOWER } from "@/constants/towers";

export function UpgradeMenu() {
  const { gameState, upgradeTower, sellTower, selectTower } = useGame();
  const tower = gameState.towers.find((t) => t.id === gameState.selectedTowerId);
  if (!tower) return null;

  // Get tower config based on type
  const towerConfig = tower.type === "tower_cannon" ? CANNON_TOWER : LOOKOUT_POST;
  
  const currentStats = towerConfig.levels[tower.level - 1];
  const nextStats = tower.level < 3 ? towerConfig.levels[tower.level] : null;
  
  // Calculate invested and sell value
  let invested = towerConfig.buildCost;
  for (let i = 1; i < tower.level; i++) {
    const levelCost = towerConfig.levels[i].upgradeCost;
    if (levelCost) invested += levelCost;
  }
  const sellValue = Math.floor(invested * towerConfig.sellValueModifier);
  
  // W JSX:
  <Text style={styles.title}>
    {towerConfig.name} - Level {tower.level}
  </Text>
}
```

---

### BUG-005: UpgradeMenu nie pokazuje typu wieży
**Plik:** `components/game/UpgradeMenu.tsx`  
**Problem:** Tytuł pokazuje tylko "Lookout Post - Level X"  
**Fix:** Użyć `towerConfig.name` zamiast hardcoded `LOOKOUT_POST.name` (już naprawione w BUG-004)

---

### BUG-006: Main Menu "TAP TO CONTINUE" prowadzi do /game zamiast /levels
**Plik:** `app/index.tsx`  
**Problem:** "TAP TO CONTINUE" prowadzi do `/game` (classic mode) zamiast `/levels` (campaign)  
**Fix:**
```typescript
// app/index.tsx (linia 51)
onPress={() => router.push("/levels" as any)}
```

---

## ✅ DELIVERABLES AGENT A

Po zakończeniu:
1. ✅ GameOverScreen pokazuje gwiazdki
2. ✅ GameOverScreen używa maxHullIntegrity z poziomu
3. ✅ GameOverScreen ma przycisk "Next Level"
4. ✅ UpgradeMenu wspiera Cannon Tower
5. ✅ UpgradeMenu pokazuje typ wieży
6. ✅ Main Menu prowadzi do /levels

**Commit message:** `fix: Gameplay UI fixes - GameOverScreen stars, UpgradeMenu Cannon Tower support`

---

## 🤖 AGENT B - App Store Compliance (PRIORYTET 1)

**Twoje zadanie:** Naprawić 3 krytyczne blokery App Store

### APP-STORE-001: Brak metadanych w app.json
**Plik:** `app.json`  
**Problem:** Brak `description`, `keywords`, `privacy`, URLs  
**Fix:**
```json
{
  "expo": {
    "name": "Zombie Fleet Bastion",
    "description": "Tower defense game where you command survivors defending against zombie waves. Build towers, manage resources, and survive!",
    "slug": "zombie-fleet-bastion",
    "privacy": "public",
    "version": "1.0.0",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "app.rork.zombie-fleet-bastion",
      "infoPlist": {
        "NSPrivacyPolicyURL": "https://adammichalski.com/privacy",
        "NSPrivacyPolicyWebsiteURL": "https://adammichalski.com/privacy"
      }
    },
    "android": {
      "package": "app.rork.zombie-fleet-bastion",
      "privacy": "public"
    }
  }
}
```

**Uwaga:** Privacy Policy URL musi być hostowana online. Jeśli nie jest jeszcze hostowana, użyj placeholder URL i dodaj komentarz TODO.

---

### APP-STORE-002: Brak Accessibility Labels
**Plik:** Wszystkie komponenty z `TouchableOpacity`  
**Problem:** Tylko LevelCard ma accessibility labels  
**Fix:** Dodać `accessibilityLabel` i `accessibilityRole="button"` do wszystkich przycisków

**Pliki do zmiany:**
1. `app/index.tsx` - "TAP TO CONTINUE", menu buttons
2. `app/game.tsx` - pause button, speed button, start wave button
3. `components/game/BuildMenu.tsx` - wszystkie TouchableOpacity
4. `components/game/UpgradeMenu.tsx` - wszystkie TouchableOpacity
5. `components/game/PauseMenu.tsx` - wszystkie TouchableOpacity
6. `components/game/GameOverScreen.tsx` - wszystkie TouchableOpacity
7. `components/game/GameMap.tsx` - construction spots TouchableOpacity
8. `app/settings.tsx` - wszystkie TouchableOpacity
9. `app/levels.tsx` - level cards, back button

**Przykład:**
```typescript
<TouchableOpacity
  accessibilityLabel="Build Lookout Post tower for 100 scrap"
  accessibilityRole="button"
  accessibilityHint="Builds a tower at the selected construction spot"
  // ... reszta props
>
```

---

### APP-STORE-003: Brak Privacy Policy URL (online)
**Plik:** `app.json` + hosting (zewnętrzne)  
**Problem:** Privacy Policy musi być hostowana online  
**Fix:**
1. Upload `docs/PRIVACY_POLICY.md` do adammichalski.com/privacy
2. Upload `docs/TERMS_OF_SERVICE.md` do adammichalski.com/terms
3. Dodać URLs do app.json (już w APP-STORE-001)

**Uwaga:** Jeśli nie masz dostępu do hostingu, dodaj komentarz TODO w app.json i zaktualizuj dokumentację.

---

## ✅ DELIVERABLES AGENT B

Po zakończeniu:
1. ✅ app.json ma wszystkie wymagane metadane
2. ✅ Wszystkie przyciski mają accessibility labels
3. ✅ Privacy Policy URL dodany (lub TODO jeśli nie hostowana)

**Commit message:** `fix: App Store compliance - metadata, accessibility labels, privacy URLs`

---

## 🤖 AGENT C - UX Improvements (PRIORYTET 2)

**Twoje zadanie:** Naprawić 5 problemów UX i średnich priorytetów

### BUG-007: GameOverScreen nie pokazuje informacji o następnym poziomie
**Plik:** `components/game/GameOverScreen.tsx`  
**Problem:** Po victory gracz nie widzi informacji o następnym poziomie  
**Fix:**
1. Dodać sekcję z informacją o następnym poziomie
2. Pokazać nazwę następnego poziomu
3. Pokazać czy jest unlocked
4. Pokazać wymagania (jeśli locked)

**Kod:**
```typescript
{isVictory && nextLevel && (
  <View style={styles.nextLevelInfo}>
    <Text style={styles.nextLevelTitle}>Next Level</Text>
    <Text style={styles.nextLevelName}>{nextLevel.name}</Text>
    {isNextLevelUnlocked ? (
      <Text style={styles.unlockedText}>✅ Unlocked</Text>
    ) : (
      <Text style={styles.lockedText}>
        🔒 Locked - Complete current level to unlock
      </Text>
    )}
  </View>
)}
```

---

### BUG-008: Nieaktualny komentarz w levels.tsx
**Plik:** `app/levels.tsx`  
**Problem:** Komentarz mówi "10 levels × 3 stars = 30", ale jest 17 poziomów  
**Fix:**
```typescript
const maxStars = availableLevels.length * 3; // 17 levels × 3 stars = 51
```

---

### BUG-009: resetGame() w useEffect może powodować problemy
**Plik:** `app/game.tsx`  
**Problem:** `useEffect(() => { resetGame(); }, [resetGame]);` może resetować grę przy każdym renderze  
**Fix:**
```typescript
// Zmienić z:
useEffect(() => {
  resetGame();
}, [resetGame]);

// Na:
useEffect(() => {
  // Reset only on mount, not on every resetGame change
  resetGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Empty deps = only on mount
```

**LUB lepiej:**
```typescript
const hasInitializedRef = useRef(false);

useEffect(() => {
  if (!hasInitializedRef.current) {
    resetGame();
    hasInitializedRef.current = true;
  }
}, [resetGame]);
```

---

### BUG-010: UpgradeMenu nie pokazuje AOE dla Cannon Tower
**Plik:** `components/game/UpgradeMenu.tsx`  
**Problem:** Jeśli Cannon Tower jest wybrana, nie pokazuje informacji o AOE  
**Fix:**
```typescript
{selectedTowerType === "tower_cannon" && (
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>Type:</Text>
    <Text style={[styles.statValue, { color: "#FF8800" }]}>AOE (radius 1.0)</Text>
  </View>
)}
```

**Uwaga:** To powinno być w sekcji "Current Stats", nie tylko w BuildMenu.

---

### BUG-011: Brak wizualnego feedbacku przy kliknięciu construction spot
**Plik:** `components/game/GameMap.tsx`  
**Problem:** Construction spot ma highlight tylko gdy selected, ale brak animacji/feedbacku przy kliknięciu  
**Fix:**
Dodać `Animated` feedback przy kliknięciu (opcjonalne, można pominąć jeśli zbyt skomplikowane)

---

## ✅ DELIVERABLES AGENT C

Po zakończeniu:
1. ✅ GameOverScreen pokazuje informacje o następnym poziomie
2. ✅ Komentarz w levels.tsx zaktualizowany
3. ✅ resetGame() useEffect naprawiony
4. ✅ UpgradeMenu pokazuje AOE dla Cannon Tower
5. ✅ Construction spot visual feedback (opcjonalne)

**Commit message:** `fix: UX improvements - next level info, comments, useEffect, AOE display`

---

## 🤖 AGENT D - App Store Submission Prep (PRIORYTET 2)

**Twoje zadanie:** Przygotować materiały do App Store submission (zewnętrzne zadania)

### APP-STORE-004: Brak App Store Description
**Plik:** Dokumentacja / App Store Connect (zewnętrzne)  
**Zadanie:** Napisać opis dla App Store listing

**Wymagane:**
- Short description (170 characters)
- Full description (4000 characters)
- Keywords (100 characters)
- Promotional text (170 characters, opcjonalny)

**Przykład:**
```
Short: "Tower defense game. Build towers, defend against zombie waves, survive!"

Full: "Zombie Fleet Bastion is a strategic tower defense game where you command a fleet of survivors defending against endless waves of zombies.

FEATURES:
- 17 challenging levels with unique maps
- Two tower types: Lookout Post and Cannon Tower
- 8 enemy types with unique abilities
- Campaign mode with star ratings
- Offline gameplay - no internet required
- Beautiful pixel art graphics

Build and upgrade towers, manage resources, and survive as long as you can!"

Keywords: "tower defense, strategy, zombies, survival, offline, campaign"
```

**Deliverable:** Utworzyć plik `docs/APP_STORE_DESCRIPTION.md` z opisami.

---

### APP-STORE-005: Brak Screenshots
**Plik:** App Store Connect (zewnętrzne)  
**Zadanie:** Zrobić screenshots dla App Store listing

**Wymagane:**
- iPhone screenshots (6.7", 6.5", 5.5")
- iPad screenshots (12.9", 11") - jeśli supportsTablet: true
- App preview video (opcjonalny, ale zalecany)

**Deliverable:** Utworzyć folder `docs/app-store-assets/` z instrukcjami jak zrobić screenshots.

---

### APP-STORE-006: Brak Age Rating
**Plik:** App Store Connect (zewnętrzne)  
**Zadanie:** Ustawić age rating w App Store Connect

**Wymagane:**
- Ustawić 9+ lub 12+ w App Store Connect
- Dodać content descriptors (Fantasy Violence)

**Deliverable:** Utworzyć plik `docs/APP_STORE_AGE_RATING.md` z instrukcjami.

---

## ✅ DELIVERABLES AGENT D

Po zakończeniu:
1. ✅ App Store description napisany
2. ✅ Instrukcje do screenshots
3. ✅ Instrukcje do age rating

**Commit message:** `docs: App Store submission materials - descriptions, screenshots, age rating`

---

## 📋 WORKFLOW WIELOAGENTOWY

### Kolejność wykonania:
1. **Agent A** → Gameplay fixes (6 bugów) - **PRIORYTET 1**
2. **Agent B** → App Store compliance (3 blokery) - **PRIORYTET 1**
3. **Agent C** → UX improvements (5 problemów) - **PRIORYTET 2**
4. **Agent D** → App Store submission prep (3 zadania) - **PRIORYTET 2**

### Współpraca:
- Każdy agent pracuje niezależnie na swoim zakresie
- Po zakończeniu każdej fazy → commit + push
- Jeśli agent znajdzie dodatkowe problemy → dodać do `BUGS_AND_FIXES_LIST.md`
- Jeśli agent potrzebuje zmian w innych plikach → skonsultować z innymi agentami

### Testowanie:
- Po każdej fazie → przetestować zmiany w przeglądarce
- Sprawdzić czy nie zepsuto istniejącej funkcjonalności
- Sprawdzić czy nowe funkcje działają poprawnie

---

## 🎯 SUKCES

**Kryteria ukończenia:**
- ✅ Wszystkie 19 problemów naprawione
- ✅ App działa poprawnie w przeglądarce
- ✅ Wszystkie komponenty renderują się bez błędów
- ✅ Navigation działa poprawnie
- ✅ App Store compliance spełnione (oprócz zewnętrznych zadań)

**Po ukończeniu:**
- Utworzyć PR z wszystkimi zmianami
- Przetestować pełny flow gry
- Zaktualizować dokumentację jeśli potrzebne

---

## 📚 DODATKOWE ZASOBY

**Dokumentacja:**
- `BUGS_AND_FIXES_LIST.md` - Pełna lista bugów
- `APP_STORE_COMPLIANCE_ANALYSIS.md` - Analiza App Store
- `GAMEPLAY_FLOW_ANALYSIS.md` - Analiza gameplay
- `TEST_REPORT.md` - Weryfikacja funkcji

**Kod referencyjny:**
- `contexts/GameContext.tsx` - Game state management
- `contexts/CampaignContext.tsx` - Campaign progression
- `components/game/BuildMenu.tsx` - Przykład menu z tower selection
- `constants/towers.ts` - Tower configurations

---

**Powodzenia! 🚀**

