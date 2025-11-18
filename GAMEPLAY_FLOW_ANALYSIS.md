# ANALIZA GAMEPLAY FLOW - Co działa, co nie działa
**Data:** 2025-01-18  
**Branch:** `claude/design-game-levels-011HpQA4319cUTrEXuUFJ8xD`  
**Metoda:** Code Review + Static Analysis

---

## ✅ CO DZIAŁA POPRAWNIE

### 1. **Flow po pierwszej fali** ✅

**Status:** ✅ **DZIAŁA**

**Co się dzieje:**
1. Po zakończeniu fali → `phase: "between_waves"`
2. Pokazuje przycisk "Start Wave (+15 🔩)" w footerze
3. Gracz może:
   - Zbudować/upgrade wieże (BuildMenu, UpgradeMenu dostępne)
   - Kliknąć construction spots
   - Zobaczyć statystyki (Hull, Wave, Scrap)
4. Po kliknięciu "Start Wave" → `phase: "playing"` + +15 scrap bonus

**Kod:**
```typescript
// hooks/useGameEngine.ts (linie 169-186)
if (enemyQueueRef.current.length === 0 && newState.enemies.length === 0) {
  newState.scrap += GAME_CONFIG.WAVE_COMPLETION_BONUS; // +25 scrap
  // ...
  if (newState.currentWave >= totalWaves) {
    newState.phase = "victory";
  } else {
    newState.currentWave += 1;
    newState.phase = "between_waves";
  }
}
```

**Wnioski:** ✅ Flow między falami działa poprawnie.

---

### 2. **Budowanie wież** ✅

**Status:** ✅ **DZIAŁA**

**Co działa:**
- ✅ BuildMenu pokazuje się po kliknięciu construction spot
- ✅ Wybór typu wieży (Lookout Post vs Cannon Tower)
- ✅ Stats się zmieniają dynamicznie
- ✅ Koszty są poprawne (100 vs 250 scrap)
- ✅ Cannon Tower pokazuje "AOE (radius 1.0)"
- ✅ Build button respektuje koszt
- ✅ Construction spots są z poziomu lub domyślne

**Kod:**
```typescript
// app/game.tsx (linia 83)
const constructionSpots = currentLevel?.mapConfig.constructionSpots;
// Jeśli poziom ma constructionSpots, używa ich, w przeciwnym razie używa CONSTRUCTION_SPOTS
```

**Wnioski:** ✅ Budowanie działa poprawnie.

---

### 3. **Wybór poziomu (Level Select)** ✅

**Status:** ✅ **DZIAŁA**

**Co działa:**
- ✅ Ekran `/levels` pokazuje wszystkie poziomy (1-17)
- ✅ Poziomy są unlockowane progresywnie
- ✅ Po ukończeniu poziomu następny się unlockuje
- ✅ Progress bar pokazuje gwiazdki
- ✅ Kliknięcie poziomu → `startCampaignLevel()` → `/game`

**Kod:**
```typescript
// app/levels.tsx (linie 68-79)
const handleLevelPress = (level: LevelConfig) => {
  if (!isLevelUnlocked(level.id)) return;
  startCampaignLevel(level);
  router.push('/game');
};
```

**Wnioski:** ✅ Wybór poziomu działa poprawnie.

---

## ⚠️ PROBLEMY ZNALEZIONE

### 🔴 PROBLEM 1: GameOverScreen nie pokazuje gwiazdek

**Status:** ❌ **BRAKUJE FUNKCJONALNOŚCI**

**Problem:**
- `GameOverScreen` pokazuje tylko podstawowe statystyki (Hull, Scrap, Zombies Killed)
- **NIE pokazuje gwiazdek** (stars) które gracz zdobył
- **NIE pokazuje informacji o następnym poziomie**

**Kod:**
```typescript
// components/game/GameOverScreen.tsx (linie 65-82)
<View style={styles.statsContainer}>
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>Hull Integrity:</Text>
    <Text style={styles.statValue}>{gameState.hullIntegrity}/20</Text>
  </View>
  {/* Brak gwiazdek! */}
</View>
```

**Co powinno być:**
- Pokazywać gwiazdki (⭐⭐⭐, ⭐⭐☆, ⭐☆☆)
- Pokazywać informację o następnym poziomie (jeśli unlocked)
- Przycisk "Next Level" (jeśli następny poziom jest unlocked)

**Wpływ:** Średni - gracz nie widzi swoich osiągnięć

---

### 🔴 PROBLEM 2: Hardcoded maxStars (30 zamiast 51)

**Status:** ❌ **BUG**

**Problem:**
- `app/levels.tsx` ma hardcoded `maxStars = availableLevels.length * 3`
- Komentarz mówi "10 levels × 3 stars = 30"
- Ale teraz jest **17 poziomów**, więc powinno być **51 gwiazdek**

**Kod:**
```typescript
// app/levels.tsx (linia 51)
const maxStars = availableLevels.length * 3; // 10 levels × 3 stars = 30
// ❌ Komentarz jest nieaktualny, ale kod jest OK (używa availableLevels.length)
```

**Weryfikacja:**
- Kod używa `availableLevels.length * 3` - więc jest OK ✅
- Komentarz jest nieaktualny - ale to tylko komentarz ⚠️

**Wpływ:** Niski - tylko nieaktualny komentarz

---

### 🔴 PROBLEM 3: GameOverScreen hardcoded hull integrity (20)

**Status:** ❌ **BUG**

**Problem:**
- `GameOverScreen` pokazuje hardcoded `/20` dla hull integrity
- Powinno używać `maxHullIntegrity` z poziomu

**Kod:**
```typescript
// components/game/GameOverScreen.tsx (linia 69)
<Text style={styles.statValue}>
  {gameState.hullIntegrity}/20  // ❌ Hardcoded!
</Text>
```

**Co powinno być:**
```typescript
const maxHullIntegrity = currentLevel?.mapConfig.startingResources.hullIntegrity || 20;
<Text style={styles.statValue}>
  {gameState.hullIntegrity}/{maxHullIntegrity}
</Text>
```

**Wpływ:** Średni - może pokazywać nieprawidłowe wartości dla poziomów z innym hull integrity

---

### 🔴 PROBLEM 4: Brak przycisku "Next Level" w GameOverScreen

**Status:** ❌ **BRAKUJE FUNKCJONALNOŚCI**

**Problem:**
- Po victory `GameOverScreen` ma tylko:
  - "Play Again" (resetuje grę)
  - "Main Menu" (wraca do menu głównego)
- **Brak przycisku "Next Level"** który by przeniósł do następnego poziomu

**Kod:**
```typescript
// components/game/GameOverScreen.tsx (linie 84-105)
<View style={styles.actions}>
  <TouchableOpacity onPress={() => resetGame()}>
    <Text>Play Again</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => router.back()}>
    <Text>Main Menu</Text>
  </TouchableOpacity>
  {/* ❌ Brak "Next Level" */}
</View>
```

**Co powinno być:**
- Jeśli następny poziom jest unlocked → pokaż przycisk "Next Level"
- Kliknięcie → `startCampaignLevel(nextLevel)` → `/game`

**Wpływ:** Wysoki - gracz musi ręcznie wracać do level select

---

### 🔴 PROBLEM 5: GameOverScreen nie pokazuje informacji o następnym poziomie

**Status:** ❌ **BRAKUJE FUNKCJONALNOŚCI**

**Problem:**
- Po victory gracz nie widzi:
  - Czy następny poziom został unlocked
  - Jaki jest następny poziom
  - Ile gwiazdek potrzeba do unlocku

**Wpływ:** Średni - gracz nie wie co dalej

---

### ⚠️ PROBLEM 6: resetGame() w useEffect może powodować problemy

**Status:** ⚠️ **POTENCJALNY PROBLEM**

**Problem:**
- `app/game.tsx` ma `useEffect(() => { resetGame(); }, [resetGame]);`
- To resetuje grę przy każdym renderze
- Może powodować problemy jeśli `resetGame` się zmienia

**Kod:**
```typescript
// app/game.tsx (linie 34-36)
useEffect(() => {
  resetGame();
}, [resetGame]);
```

**Wpływ:** Niski - może powodować nieoczekiwane resetowanie

---

## 📊 PODSUMOWANIE

### ✅ Co działa:
1. ✅ Flow po pierwszej fali (between_waves)
2. ✅ Budowanie wież (BuildMenu)
3. ✅ Wybór poziomu (Level Select)
4. ✅ Progresja poziomów (unlockowanie)
5. ✅ Zapis postępu (CampaignContext)

### ❌ Co nie działa / brakuje:
1. ❌ GameOverScreen nie pokazuje gwiazdek
2. ❌ GameOverScreen hardcoded hull integrity (20)
3. ❌ Brak przycisku "Next Level" w GameOverScreen
4. ❌ GameOverScreen nie pokazuje informacji o następnym poziomie
5. ⚠️ resetGame() w useEffect może powodować problemy

---

## 🎯 REKOMENDACJE

### PRIORYTET 1: Napraw GameOverScreen
1. **Dodaj wyświetlanie gwiazdek** (⭐⭐⭐, ⭐⭐☆, ⭐☆☆)
2. **Napraw hardcoded hull integrity** - użyj `maxHullIntegrity` z poziomu
3. **Dodaj przycisk "Next Level"** - jeśli następny poziom jest unlocked
4. **Dodaj informację o następnym poziomie** - nazwa, czy unlocked

### PRIORYTET 2: Popraw komentarze
1. Zaktualizuj komentarz w `levels.tsx` (30 → 51 gwiazdek)

### PRIORYTET 3: Sprawdź resetGame()
1. Sprawdź czy `resetGame()` w `useEffect` nie powoduje problemów
2. Rozważ użycie `useRef` lub innego podejścia

---

## 🔧 SUGEROWANE ZMIANY

### 1. Napraw GameOverScreen - dodaj gwiazdki i Next Level

```typescript
// components/game/GameOverScreen.tsx
import { useCampaignContext } from '@/contexts/CampaignContext';
import { useGame } from '@/contexts/GameContext';

export function GameOverScreen() {
  const { gameState, resetGame, currentLevel } = useGame();
  const { getNextLevel, isLevelUnlocked } = useCampaignContext();
  
  // Get stars earned (from CampaignContext)
  const levelProgress = currentLevel ? getLevelProgress(currentLevel.id) : null;
  const starsEarned = levelProgress?.starsEarned || 0;
  
  // Get next level
  const nextLevel = currentLevel ? getNextLevel(currentLevel.id) : null;
  const isNextLevelUnlocked = nextLevel ? isLevelUnlocked(nextLevel.id) : false;
  
  // Get max hull integrity
  const maxHullIntegrity = currentLevel?.mapConfig.startingResources.hullIntegrity || 20;
  
  // Render stars
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
  
  // ... w JSX:
  {isVictory && renderStars()}
  <Text style={styles.statValue}>
    {gameState.hullIntegrity}/{maxHullIntegrity}
  </Text>
  
  {isVictory && isNextLevelUnlocked && nextLevel && (
    <TouchableOpacity
      style={styles.nextLevelButton}
      onPress={() => {
        startCampaignLevel(nextLevel);
        router.push('/game');
      }}
    >
      <Text>Next Level: {nextLevel.name}</Text>
    </TouchableOpacity>
  )}
}
```

---

**Raport wygenerowany przez:** AI Code Analysis  
**Data:** 2025-01-18

