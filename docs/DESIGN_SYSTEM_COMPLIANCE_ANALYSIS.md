# Analiza zgodności kodu z Design System Rules

**Data:** 2025-11-17  
**Status:** Częściowa zgodność

---

## 📊 Podsumowanie

### ✅ Zgodne z dokumentem:
- **Komponenty campaign/** - wszystkie używają `THEME`
- **Storybook stories** - wszystkie używają `THEME`
- **Struktura projektu** - zgodna z dokumentem
- **Wzorce komponentów** - zgodne z dokumentem

### ❌ Wymagają refaktoryzacji:
- **Pliki w `app/`** - 158 hardcoded wartości kolorów (8 plików)
- **Komponenty `components/game/`** - 95 hardcoded wartości kolorów (9 plików)

---

## 🔍 Szczegółowa analiza

### 1. Komponenty Campaign (✅ ZGODNE)

**Pliki:**
- `components/campaign/DifficultyBadge.tsx` - ✅ używa THEME
- `components/campaign/LevelCard.tsx` - ✅ używa THEME
- `components/campaign/ProgressBar.tsx` - ✅ używa THEME
- `components/campaign/StarRating.tsx` - ✅ używa THEME

**Status:** Wszystkie komponenty campaign są w pełni zgodne z dokumentem.

---

### 2. Pliki App/ (❌ WYMAGAJĄ REFAKTORYZACJI)

**Pliki z hardcoded wartościami:**

#### `app/index.tsx` - 13 hardcoded kolorów
```typescript
// Obecne (hardcoded):
backgroundColor: "#0a0a0a"           // → THEME.colors.background.primary
color: "#FFFFFF"                     // → THEME.colors.text.primary
color: "#CCCCCC"                     // → THEME.colors.text.secondary
color: "#666666"                     // → THEME.colors.text.disabled
backgroundColor: "rgba(0, 0, 0, 0.5)" // → THEME.colors.overlay.subtle
backgroundColor: "rgba(0, 0, 0, 0.7)" // → THEME.colors.overlay.dark
borderColor: "#FFFFFF"               // → THEME.colors.border.light (lub nowy token)
fontSize: 48                         // → THEME.typography.fontSize.huge
fontSize: 18                         // → THEME.typography.fontSize.lg
fontSize: 14                         // → THEME.typography.fontSize.sm
fontSize: 12                         // → THEME.typography.fontSize.xs
paddingHorizontal: 32                // → THEME.spacing.xl
paddingVertical: 16                   // → THEME.spacing.md
borderRadius: 8                      // → THEME.borderRadius.sm
```

#### `app/game.tsx` - 21 hardcoded kolorów
```typescript
// Obecne (hardcoded):
backgroundColor: "#1a1a1a"           // → THEME.colors.background.secondary
backgroundColor: "#222222"           // → THEME.colors.background.tertiary
borderBottomColor: "#333333"         // → THEME.colors.border.default
color: "#FFD700"                     // → THEME.colors.scrap
color: "#FFFFFF"                     // → THEME.colors.text.primary
color: "#AAAAAA"                     // → THEME.colors.text.tertiary
backgroundColor: "#333333"           // → THEME.colors.border.default
backgroundColor: "#4CAF50"           // → THEME.colors.success
padding: 16                          // → THEME.spacing.md
paddingHorizontal: 16                // → THEME.spacing.md
borderRadius: 8                      // → THEME.borderRadius.sm
borderRadius: 12                     // → THEME.borderRadius.md
// + shadowColor, shadowOffset, etc. → THEME.shadows.success
```

#### Inne pliki w `app/`:
- `app/stats.tsx` - 18 hardcoded wartości
- `app/settings.tsx` - 35 hardcoded wartości
- `app/about.tsx` - 28 hardcoded wartości
- `app/privacy.tsx` - 18 hardcoded wartości
- `app/terms.tsx` - 20 hardcoded wartości
- `app/+not-found.tsx` - 5 hardcoded wartości

**Łącznie:** ~158 hardcoded wartości w 8 plikach

---

### 3. Komponenty Game/ (❌ WYMAGAJĄ REFAKTORYZACJI)

**Pliki z hardcoded wartościami:**

#### `components/game/BuildMenu.tsx` - 19 hardcoded kolorów
```typescript
// Obecne (hardcoded):
backgroundColor: "rgba(0, 0, 0, 0.7)" // → THEME.colors.overlay.dark
backgroundColor: "#2a2a2a"            // → THEME.colors.background.elevated
borderColor: "#444444"                // → THEME.colors.border.light
color: "#FFFFFF"                      // → THEME.colors.text.primary
color: "#4A90E2"                      // → THEME.colors.primary
color: "#AAAAAA"                      // → THEME.colors.text.tertiary
backgroundColor: "#1a1a1a"           // → THEME.colors.background.secondary
// + spacing, borderRadius, etc.
```

#### `components/game/UpgradeMenu.tsx` - 23 hardcoded wartości
#### `components/game/GameOverScreen.tsx` - 15 hardcoded wartości
#### `components/game/PauseMenu.tsx` - 11 hardcoded wartości
#### `components/game/TowerRenderer.tsx` - 10 hardcoded wartości
#### `components/game/EnemyRenderer.tsx` - 9 hardcoded wartości
#### `components/game/GameMap.tsx` - 6 hardcoded wartości
#### `components/game/ProjectileRenderer.tsx` - 1 hardcoded wartość
#### `components/game/VisualEffects.tsx` - 1 hardcoded wartość

**Łącznie:** ~95 hardcoded wartości w 9 plikach

---

## 💡 Rekomendacje

### Opcja A: Stopniowa refaktoryzacja (REKOMENDOWANA) ✅

**Zalety:**
- Nie przerywa pracy nad nowymi funkcjami
- Można refaktorować przy okazji zmian w plikach
- Mniejsze ryzyko wprowadzenia błędów
- Naturalna ewolucja kodu

**Plan:**
1. **Nowe komponenty** - zawsze używają THEME (już działa ✅)
2. **Przy modyfikacjach** - refaktoruj hardcoded wartości do THEME
3. **Przy bugfixach** - jeśli dotykasz stylów, użyj THEME
4. **Dedicated refactoring sprints** - okresowo (np. co 2-3 tygodnie)

**Priorytety:**
1. **Wysoki:** `app/index.tsx`, `app/game.tsx` (główne ekrany)
2. **Średni:** `components/game/BuildMenu.tsx`, `UpgradeMenu.tsx` (często używane)
3. **Niski:** `app/about.tsx`, `app/privacy.tsx` (rzadko modyfikowane)

---

### Opcja B: Kompleksowa refaktoryzacja (NIE REKOMENDOWANA) ❌

**Wady:**
- Duży scope zmian (253 hardcoded wartości)
- Wysokie ryzyko wprowadzenia błędów
- Przerwa w pracy nad funkcjami
- Możliwe konflikty w merge

**Gdyby jednak:**
- Wymagałoby dedykowanego sprintu (2-3 dni)
- Pełnego testowania wszystkich ekranów
- Code review wszystkich zmian

---

## 🎯 Plan działania (Opcja A)

### Faza 1: Krytyczne ekrany (1-2 dni)
- [ ] `app/index.tsx` - Main menu
- [ ] `app/game.tsx` - Game screen

### Faza 2: Często używane komponenty (1-2 dni)
- [ ] `components/game/BuildMenu.tsx`
- [ ] `components/game/UpgradeMenu.tsx`
- [ ] `components/game/PauseMenu.tsx`
- [ ] `components/game/GameOverScreen.tsx`

### Faza 3: Pozostałe komponenty (1 dzień)
- [ ] `components/game/TowerRenderer.tsx`
- [ ] `components/game/EnemyRenderer.tsx`
- [ ] `components/game/GameMap.tsx`
- [ ] `components/game/ProjectileRenderer.tsx`
- [ ] `components/game/VisualEffects.tsx`

### Faza 4: Pozostałe ekrany (1 dzień)
- [ ] `app/stats.tsx`
- [ ] `app/settings.tsx`
- [ ] `app/about.tsx`
- [ ] `app/privacy.tsx`
- [ ] `app/terms.tsx`
- [ ] `app/+not-found.tsx`

---

## 📝 Przykład refaktoryzacji

### Przed (app/index.tsx):
```typescript
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  title: {
    fontSize: 48,
    fontWeight: "900" as const,
    color: "#FFFFFF",
    marginTop: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#CCCCCC",
  },
});
```

### Po (zgodne z dokumentem):
```typescript
import { THEME } from '@/constants/ui/theme';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: THEME.colors.background.primary,
  },
  title: {
    fontSize: THEME.typography.fontSize.huge,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.text.primary,
    marginTop: THEME.spacing.lg,
  },
  subtitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.secondary,
  },
});
```

---

## ✅ Checklist zgodności

Dla każdego pliku sprawdź:
- [ ] Wszystkie kolory używają `THEME.colors.*`
- [ ] Wszystkie spacingi używają `THEME.spacing.*`
- [ ] Wszystkie font sizes używają `THEME.typography.fontSize.*`
- [ ] Wszystkie font weights używają `THEME.typography.fontWeight.*`
- [ ] Wszystkie border radius używają `THEME.borderRadius.*`
- [ ] Wszystkie shadows używają `THEME.shadows.*` lub spread operator
- [ ] Import `THEME` jest na górze pliku

---

## 🚨 Uwagi

1. **Nie wszystkie wartości da się zmapować do THEME:**
   - `textShadow` (string) - może wymagać rozszerzenia THEME
   - `letterSpacing` - może wymagać dodania do THEME.typography
   - Specyficzne wartości (np. `marginTop: IS_LANDSCAPE ? 40 : 80`) - OK, to logika

2. **Możliwe rozszerzenia THEME:**
   ```typescript
   typography: {
     letterSpacing: {
       tight: 2,
       normal: 3,
       wide: 4,
     },
   },
   ```

3. **Testowanie po refaktoryzacji:**
   - Wizualne porównanie przed/po
   - Test na web i native
   - Sprawdzenie wszystkich stanów komponentów

---

## 📊 Statystyki

- **Pliki zgodne:** 4 (components/campaign/*)
- **Pliki wymagające refaktoryzacji:** 17 (app/* + components/game/*)
- **Hardcoded wartości:** ~253
- **THEME użycia:** 207 (w 13 plikach)

---

**Wniosek:** Kod jest częściowo zgodny. Nowe komponenty (campaign) są w pełni zgodne, ale starsze pliki wymagają stopniowej refaktoryzacji. **Rekomendacja: Opcja A (stopniowa refaktoryzacja).**

