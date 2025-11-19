# LISTA BŁĘDÓW I POPRAWEK - Zombie Fleet Bastion
**Data:** 2025-01-18  
**Branch:** `claude/design-game-levels-011HpQA4319cUTrEXuUFJ8xD`  
**Status:** ZBIERANIE PROBLEMÓW

---

## 🔴 PRIORYTET 1: KRYTYCZNE BŁĘDY

### BUG-001: GameOverScreen nie pokazuje gwiazdek
**Plik:** `components/game/GameOverScreen.tsx`  
**Linia:** 65-82  
**Problem:** Po victory nie widać ile gwiazdek gracz zdobył (⭐⭐⭐, ⭐⭐☆, ⭐☆☆)  
**Wpływ:** Wysoki - gracz nie widzi swoich osiągnięć  
**Fix:**
- Dodać import `useCampaignContext`
- Pobrać `getLevelProgress(currentLevel.id)` aby uzyskać `starsEarned`
- Wyświetlić gwiazdki w UI (⭐⭐⭐, ⭐⭐☆, ⭐☆☆)

---

### BUG-002: GameOverScreen hardcoded hull integrity (20)
**Plik:** `components/game/GameOverScreen.tsx`  
**Linia:** 69  
**Problem:** Pokazuje hardcoded `/20` zamiast używać `maxHullIntegrity` z poziomu  
**Wpływ:** Średni - może pokazywać nieprawidłowe wartości dla poziomów z innym hull integrity  
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
**Linia:** 84-105  
**Problem:** Po victory tylko "Play Again" i "Main Menu", brak szybkiego przejścia do następnego poziomu  
**Wpływ:** Wysoki - gracz musi ręcznie wracać do level select  
**Fix:**
- Dodać import `useCampaignContext` i `useGame`
- Pobrać `getNextLevel(currentLevel.id)`
- Sprawdzić `isLevelUnlocked(nextLevel.id)`
- Dodać przycisk "Next Level" jeśli unlocked
- Kliknięcie → `startCampaignLevel(nextLevel)` → `router.push('/game')`

---

### BUG-004: UpgradeMenu nie wspiera Cannon Tower
**Plik:** `components/game/UpgradeMenu.tsx`  
**Linia:** 11, 21-33  
**Problem:** UpgradeMenu używa tylko `LOOKOUT_POST`, nie wspiera `CANNON_TOWER`  
**Wpływ:** Wysoki - nie można upgrade/sell Cannon Tower  
**Fix:**
- Dodać import `CANNON_TOWER`
- Sprawdzić `tower.type` aby wybrać odpowiedni config
- Użyć `tower.type === "tower_cannon" ? CANNON_TOWER : LOOKOUT_POST`
- Zaktualizować wszystkie miejsca gdzie używa się `LOOKOUT_POST`

---

### BUG-005: UpgradeMenu nie pokazuje typu wieży
**Plik:** `components/game/UpgradeMenu.tsx`  
**Linia:** 54  
**Problem:** Tytuł pokazuje tylko "Lookout Post - Level X", nie pokazuje typu wieży  
**Wpływ:** Średni - gracz nie wie jaki typ wieży upgradeuje  
**Fix:**
- Użyć `towerConfig.name` zamiast hardcoded `LOOKOUT_POST.name`
- Dodać wyświetlanie typu wieży (Lookout Post vs Cannon Tower)

---

### BUG-006: Main Menu "TAP TO CONTINUE" prowadzi do /game zamiast /levels
**Plik:** `app/index.tsx`  
**Linia:** 51  
**Problem:** "TAP TO CONTINUE" prowadzi do `/game` (classic mode) zamiast `/levels` (campaign)  
**Wpływ:** Średni - gracz nie trafia od razu do campaign  
**Fix:**
```typescript
onPress={() => router.push("/levels" as any)}
```

---

## ⚠️ PRIORYTET 2: ŚREDNIE PROBLEMY

### BUG-007: GameOverScreen nie pokazuje informacji o następnym poziomie
**Plik:** `components/game/GameOverScreen.tsx`  
**Problem:** Po victory gracz nie widzi czy następny poziom został unlocked, jaki jest następny poziom, ile gwiazdek potrzeba  
**Wpływ:** Średni - gracz nie wie co dalej  
**Fix:**
- Dodać sekcję z informacją o następnym poziomie
- Pokazać nazwę następnego poziomu
- Pokazać czy jest unlocked
- Pokazać wymagania (jeśli locked)

---

### BUG-008: Nieaktualny komentarz w levels.tsx (30 zamiast 51 gwiazdek)
**Plik:** `app/levels.tsx`  
**Linia:** 51  
**Problem:** Komentarz mówi "10 levels × 3 stars = 30", ale teraz jest 17 poziomów (51 gwiazdek)  
**Wpływ:** Niski - tylko nieaktualny komentarz  
**Fix:**
```typescript
const maxStars = availableLevels.length * 3; // 17 levels × 3 stars = 51
```

---

### BUG-009: resetGame() w useEffect może powodować problemy
**Plik:** `app/game.tsx`  
**Linia:** 34-36  
**Problem:** `useEffect(() => { resetGame(); }, [resetGame]);` może resetować grę przy każdym renderze  
**Wpływ:** Niski - może powodować nieoczekiwane resetowanie  
**Fix:**
- Sprawdzić czy to nie powoduje problemów
- Rozważyć użycie `useRef` lub innego podejścia
- Może powinno być tylko przy mount, nie przy każdej zmianie `resetGame`

---

## 📋 PRIORYTET 3: DROBNE PROBLEMY / UX

### BUG-010: UpgradeMenu nie pokazuje AOE dla Cannon Tower
**Plik:** `components/game/UpgradeMenu.tsx`  
**Problem:** Jeśli Cannon Tower jest wybrana, nie pokazuje informacji o AOE (radius 1.0)  
**Wpływ:** Niski - gracz może nie wiedzieć że Cannon Tower ma AOE  
**Fix:**
- Dodać wyświetlanie "AOE (radius 1.0)" dla Cannon Tower w stats

---

### BUG-011: Brak wizualnego feedbacku przy kliknięciu construction spot
**Plik:** `components/game/GameMap.tsx`  
**Problem:** Construction spot ma highlight tylko gdy selected, ale brak animacji/feedbacku przy kliknięciu  
**Wpływ:** Niski - UX improvement  
**Fix:**
- Dodać animację/feedback przy kliknięciu construction spot

---

## ✅ CO DZIAŁA POPRAWNIE

1. ✅ Flow po pierwszej fali (between_waves)
2. ✅ Budowanie wież (BuildMenu) - wspiera oba typy
3. ✅ Wybór poziomu (Level Select)
4. ✅ Progresja poziomów (unlockowanie)
5. ✅ Zapis postępu (CampaignContext)
6. ✅ Construction spots selection
7. ✅ Pause menu
8. ✅ Navigation (back buttons)

---

## 📊 PODSUMOWANIE

**Krytyczne błędy:** 6  
**Średnie problemy:** 3  
**Drobne problemy:** 2  
**Razem:** 11 problemów

---

## 🎯 PLAN NAPRAWY

### Faza 1: Krytyczne błędy (PRIORYTET 1)
1. BUG-001: GameOverScreen - gwiazdki
2. BUG-002: GameOverScreen - hull integrity
3. BUG-003: GameOverScreen - Next Level button
4. BUG-004: UpgradeMenu - Cannon Tower support
5. BUG-005: UpgradeMenu - tower type display
6. BUG-006: Main Menu - navigation to /levels

### Faza 2: Średnie problemy (PRIORYTET 2)
7. BUG-007: GameOverScreen - next level info
8. BUG-008: levels.tsx - komentarz
9. BUG-009: resetGame() - useEffect

### Faza 3: Drobne problemy (PRIORYTET 3)
10. BUG-010: UpgradeMenu - AOE display
11. BUG-011: GameMap - visual feedback

---

---

## ✅ WERYFIKACJA: Co już działa w GameContext

**Dobra wiadomość:** `upgradeTower()` i `sellTower()` w `GameContext.tsx` już wspierają oba typy wież:
- ✅ `upgradeTower()` używa `tower.type === "tower_cannon" ? CANNON_TOWER : LOOKOUT_POST`
- ✅ `sellTower()` używa `tower.type === "tower_cannon" ? CANNON_TOWER : LOOKOUT_POST`

**Problem:** `UpgradeMenu.tsx` nie używa tego - używa hardcoded `LOOKOUT_POST` wszędzie.

---

## 📝 NOTATKI Z ANALIZY

### Navigation Flow:
- ✅ Main Menu → `/levels` (po naprawie BUG-006)
- ✅ `/levels` → `/game` (działa)
- ✅ `/game` → back button → `/levels` (działa)
- ✅ Pause Menu → Settings/Main Menu (działa)
- ✅ GameOverScreen → Main Menu (działa, ale brak Next Level)

### Construction Spots:
- ✅ Selection działa (`selectSpot()`)
- ✅ BuildMenu się otwiera
- ✅ Visual feedback (highlight) działa
- ⚠️ Brak animacji przy kliknięciu (BUG-011)

### Tower Management:
- ✅ BuildMenu wspiera oba typy wież
- ❌ UpgradeMenu nie wspiera Cannon Tower (BUG-004)
- ✅ sellTower w GameContext wspiera oba typy
- ✅ upgradeTower w GameContext wspiera oba typy

---

---

## 🏪 APP STORE COMPLIANCE - WERYFIKACJA

### ✅ CO JUŻ SPEŁNIA WYMAGANIA:
1. ✅ Privacy Policy - `app/privacy.tsx` istnieje i dostępna z Settings
2. ✅ Terms of Service - `app/terms.tsx` istnieje i dostępna z Settings
3. ✅ About & Contact - `app/about.tsx` z kontaktem (hi@adammichalski.com)
4. ✅ Reset Progress - Funkcjonalność w Settings
5. ✅ App Name - "Zombie Fleet Bastion" (bez "Prototype")
6. ✅ No Unused Permissions - Brak nieużywanych dependencies
7. ✅ No Third-Party Tracking - Brak analytics/tracking
8. ✅ Local Storage Only - Wszystkie dane lokalnie

### ❌ APP STORE BLOKERY:

#### APP-STORE-001: Brak metadanych w app.json
**Plik:** `app.json`  
**Problem:** Brak `description`, `keywords`, `privacy`, URLs  
**Wpływ:** Wysoki - App Store Connect wymaga  
**Fix:**
- Dodać `description`
- Dodać `keywords`
- Dodać `privacy: "public"`
- Dodać `ios.infoPlist.NSPrivacyPolicyURL`
- Dodać `supportUrl`

#### APP-STORE-002: Brak Accessibility Labels
**Plik:** Wszystkie komponenty  
**Problem:** Tylko LevelCard ma accessibility labels  
**Wpływ:** Wysoki - App Store wymaga accessibility  
**Fix:**
- Dodać `accessibilityLabel` do wszystkich `TouchableOpacity`
- Dodać `accessibilityRole="button"`
- Przetestować z VoiceOver

#### APP-STORE-003: Brak Privacy Policy URL (online)
**Plik:** `app.json` + hosting  
**Problem:** Privacy Policy musi być hostowana online  
**Wpływ:** Wysoki - App Store Connect wymaga URL  
**Fix:**
- Hostować Privacy Policy na adammichalski.com/privacy
- Hostować Terms na adammichalski.com/terms
- Dodać URLs do app.json

#### APP-STORE-004: Brak App Store Description
**Plik:** App Store Connect (zewnętrzne)  
**Problem:** Brak opisu dla listing  
**Wpływ:** Wysoki - Wymagane do submission  
**Fix:**
- Napisać short description (170 chars)
- Napisać full description (4000 chars)
- Dodać keywords (100 chars)

#### APP-STORE-005: Brak Screenshots
**Plik:** App Store Connect (zewnętrzne)  
**Problem:** Brak screenshots dla listing  
**Wpływ:** Wysoki - Wymagane do submission  
**Fix:**
- Zrobić screenshots (iPhone 6.7", 6.5", 5.5")
- Zrobić screenshots (iPad 12.9", 11")
- Opcjonalnie: app preview video

#### APP-STORE-006: Brak Age Rating
**Plik:** App Store Connect (zewnętrzne)  
**Problem:** Age rating nie ustawiony  
**Wpływ:** Wysoki - Wymagane do submission  
**Fix:**
- Ustawić 9+ lub 12+ w App Store Connect
- Dodać content descriptors (Fantasy Violence)

---

## 📊 FINALNA LISTA POPRAWEK

### 🔴 PRIORYTET 1: KRYTYCZNE (Gameplay + App Store)
1. BUG-001: GameOverScreen - gwiazdki
2. BUG-002: GameOverScreen - hull integrity
3. BUG-003: GameOverScreen - Next Level button
4. BUG-004: UpgradeMenu - Cannon Tower support
5. BUG-005: UpgradeMenu - tower type display
6. BUG-006: Main Menu - navigation to /levels
7. APP-STORE-001: app.json metadata
8. APP-STORE-002: Accessibility labels
9. APP-STORE-003: Privacy Policy URL (online)

### ⚠️ PRIORYTET 2: WYSOKIE (App Store Submission)
10. APP-STORE-004: App Store description
11. APP-STORE-005: Screenshots
12. APP-STORE-006: Age rating
13. BUG-007: GameOverScreen - next level info
14. BUG-008: levels.tsx - komentarz
15. BUG-009: resetGame() - useEffect

### 🟡 PRIORYTET 3: ŚREDNIE (UX Improvements)
16. BUG-010: UpgradeMenu - AOE display
17. BUG-011: GameMap - visual feedback
18. APP-STORE-007: Color contrast verification
19. APP-STORE-008: Data Export (opcjonalne)

---

**Razem:** 19 problemów do naprawy

**Lista będzie aktualizowana podczas dalszej analizy...**

