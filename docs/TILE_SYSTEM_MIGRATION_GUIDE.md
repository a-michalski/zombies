# 🗺️ Tutorial: Migracja na Tile System

**Ostatnia aktualizacja**: 2025-12-30
**Status**: System gotowy, czekamy na assety
**Dla kogo**: Ty (Adam) - developer Zombie Fleet Bastion

---

## 📋 Spis treści

1. [Przegląd - Co się zmienia](#1-przegląd---co-się-zmienia)
2. [Szybki Start - 30 minut](#2-szybki-start---30-minut)
3. [Krok po kroku - Pierwszy poziom](#3-krok-po-kroku---pierwszy-poziom)
4. [Migracja istniejących poziomów](#4-migracja-istniejących-poziomów)
5. [Troubleshooting](#5-troubleshooting)
6. [FAQ](#6-faq)

---

## 1. Przegląd - Co się zmienia

### ❌ Stary system (PRZED)
```typescript
// data/maps/level-01.ts
export const LEVEL_01 = createLevelConfig({
  mapConfig: {
    waypoints: [
      { x: 0, y: 6 },
      { x: 10, y: 6 },
      // ...
    ],
    constructionSpots: [
      { id: 'CS-01', position: { x: 4, y: 8 } },
      // ...
    ],
    waves: [...],
  },
});

// GameMap renderuje:
// - 6.2MB background.png (cała mapa w jednym pliku)
// - SVG linie dla ścieżek (brzydkie)
// - SVG kółka dla waypoints (placeholdery)
```

**Problemy**:
- ❌ 6.2MB background.png
- ❌ Nie można łatwo edytować map
- ❌ SVG linie wyglądają źle
- ❌ Trudno stworzyć nowe mapy

### ✅ Nowy system (PO)
```typescript
// assets/maps/level-01.json (stworzony w Tiled)
{
  "width": 20, "height": 12,
  "layers": [
    { "name": "ground", "data": [1,1,1,2,2,...] },
    { "name": "path", "data": [0,0,5,5,5,...] },
    { "name": "objects", "objects": [
      {"type": "waypoint", "x": 0, "y": 6, "order": 0},
      {"type": "construction", "x": 4, "y": 8, "name": "CS-01"}
    ]}
  ]
}

// data/maps/level-01.ts
import level01Json from '@/assets/maps/level-01.json';
import { loadTiledMapFromJson } from '@/utils/tiledLoader';

const LEVEL_01_TILEMAP = loadTiledMapFromJson(level01Json, 'grasslands');

export const LEVEL_01 = createLevelConfig({
  mapConfig: {
    // waypoints i constructionSpots wyciągną się z tileMap!
    tileMap: LEVEL_01_TILEMAP,
    waves: [...],
  },
});

// GameMap renderuje:
// - ~50KB tileset-grasslands.png (sprite sheet z wszystkimi tile)
// - TileMapRenderer składa mapę z małych kawałków (32×32px)
// - Ładne tile dla ścieżek zamiast SVG linii
```

**Korzyści**:
- ✅ 99% redukcja rozmiaru (6.2MB → ~50KB)
- ✅ Tiled Map Editor - wizualne tworzenie map
- ✅ Ładne tekstury ścieżek z Kenney.nl
- ✅ Łatwa edycja i prototypowanie

---

## 2. Szybki Start - 30 minut

### Faza A: Pobierz assety (5 min)

#### Opcja 1: Kenney.nl (Zalecana)
```bash
# 1. Otwórz w przeglądarce:
https://kenney.nl/assets/tower-defense-top-down

# 2. Kliknij "Download" (CC0 - darmowe!)

# 3. Rozpakuj ZIP, znajdź folder z tile

# 4. Wybierz tile pasujące do layoutu (patrz poniżej)

# 5. Otwórz Figma/Photoshop/GIMP
```

**Layout sprite sheet** (512×512px, 16×16 tiles @ 32px):
```
Row 0: Grass variants (3x), Dirt, Sand
Row 1: Path-H, Path-V, 4 corners
Row 2: T-junctions (4x), Crossroad
Row 3: Tree (2x), Rock, Bush, Flowers
```

#### Opcja 2: Prosty placeholder (SZYBKI TEST)
```bash
# Figma/Photoshop:
# 1. Nowy canvas: 512×512px
# 2. Grid: 32×32px
# 3. Pokoloruj kwadraty:
#    - [0,0] Zielony (grass)
#    - [0,1] Brązowy (path horizontal)
#    - [1,1] Brązowy (path vertical)
#    - [0,3] Ciemnozielony (tree)

# 4. Export jako PNG
```

**Zapisz jako**:
```
assets/images/tiles/tileset-grasslands.png
```

### Faza B: Zainstaluj Tiled (5 min)

```bash
# macOS:
brew install --cask tiled

# Windows:
# Pobierz z https://www.mapeditor.org/

# Linux:
sudo apt install tiled  # lub snap install tiled
```

**Sprawdź instalację**:
```bash
tiled --version
# Powinno pokazać: Tiled 1.10.x lub nowszy
```

### Faza C: Stwórz pierwszą mapę (15 min)

#### C1: Nowy Tileset w Tiled
1. Otwórz Tiled
2. Menu: **Map → New Tileset**
3. Ustawienia:
   - **Name**: `grasslands`
   - **Type**: Based on Tileset Image
   - **Image**: Browse → `assets/images/tiles/tileset-grasslands.png`
   - **Tile width**: `32`
   - **Tile height**: `32`
4. Kliknij **OK**

#### C2: Ustaw właściwości tile
1. Kliknij na tile w tileset panel (np. grass tile)
2. Prawy panel: **Properties**
3. Kliknij `+` → **Add Property**
4. Dodaj:
   - Property name: `walkable`, Type: `bool`, Value: `false` (dla grass)
   - Property name: `buildable`, Type: `bool`, Value: `true` (dla grass)

**Ustaw dla wszystkich tile**:
```
Grass:  walkable=false, buildable=true
Path:   walkable=true,  buildable=false
Tree:   walkable=false, buildable=false
```

#### C3: Nowa mapa
1. Menu: **File → New → New Map**
2. Ustawienia:
   - **Orientation**: Orthogonal
   - **Tile layer format**: CSV
   - **Tile render order**: Right Down
   - **Map size**: Width `20` tiles, Height `12` tiles
   - **Tile size**: `32×32` pixels
3. Kliknij **OK**

#### C4: Dodaj layers
1. Prawy panel: **Layers**
2. Kliknij `+` → **Add Tile Layer**
3. Dodaj te layers (w tej kolejności):
   - `ground` (Tile Layer)
   - `path` (Tile Layer)
   - `objects` (Object Layer) ← Zmień typ!

#### C5: Maluj mapę
1. Wybierz layer `ground`
2. Wybierz grass tile z tileset
3. Kliknij **Bucket Fill** (ikona wiadra) lub `G`
4. Kliknij na mapie → cała mapa zapełni się grass

5. Wybierz layer `path`
6. Wybierz path tile (horizontal/vertical/corners)
7. Narysuj ścieżkę od lewej do prawej (pamiętaj: wrogowie będą tą ścieżką szli!)

#### C6: Dodaj waypoints
1. Wybierz layer `objects`
2. Kliknij **Insert Point** (ikona kropki) lub `I`
3. Kliknij na mapie w miejscu startu ścieżki
4. W Properties (prawy panel):
   - **Type**: `waypoint`
   - **Name**: (opcjonalne, np. "Start")
   - Kliknij `+` → Add Property:
     - Property name: `order`, Type: `int`, Value: `0`

5. Powtórz dla kolejnych punktów ścieżki:
   - Drugi punkt: `order=1`
   - Trzeci punkt: `order=2`
   - ...
   - Ostatni punkt (exit): `order=N`

**WAŻNE**: Waypoints muszą mieć `order` property w kolejności 0, 1, 2, 3...!

#### C7: Dodaj construction spots
1. Nadal na layer `objects`
2. Kliknij **Insert Point**
3. Kliknij na mapie gdzie chcesz tower spot (NIE na ścieżce!)
4. W Properties:
   - **Type**: `construction`
   - **Name**: `CS-01` (lub zostaw puste dla auto-naming)

5. Powtórz dla ~5-8 spotów

#### C8: Export JSON
1. Menu: **File → Export As**
2. Format: **JSON map files (*.json)**
3. Opcje (zaznacz checkboxy):
   - ☑ **Embed tilesets**
   - ☑ **Detach templates**
4. Save as: `assets/maps/level-01-test.json`

### Faza D: Test w grze (5 min)

#### D1: Dodaj import do poziomu
```typescript
// data/maps/level-01.ts (na początku pliku)
import level01TestJson from '@/assets/maps/level-01-test.json';
import { loadTiledMapFromJson } from '@/utils/tiledLoader';

// Tuż przed export const LEVEL_01
const LEVEL_01_TILEMAP = loadTiledMapFromJson(level01TestJson, 'grasslands');
```

#### D2: Dodaj tileMap do mapConfig
```typescript
export const LEVEL_01 = createLevelConfig({
  // ... existing config ...

  mapConfig: {
    // ZAKOMENTUJ stare waypoints i constructionSpots - nie są już potrzebne!
    // waypoints: [ ... ],
    // constructionSpots: [ ... ],

    // DODAJ TO:
    tileMap: LEVEL_01_TILEMAP,

    // ZOSTAW waves - te muszą zostać!
    waves: [
      createWaveConfig(1, [{ type: 'shambler' as EnemyType, count: 5 }], 2000),
      // ...
    ],

    startingResources: {
      scrap: 200,
      hullIntegrity: 20,
    },
  },
});
```

#### D3: Odpal grę
```bash
npm start
```

**Sprawdź**:
- ✅ Mapa renderuje się z tile
- ✅ Waypoints są widoczne (czerwone/niebieskie kółka)
- ✅ Construction spots są klikalne
- ✅ Wrogowie idą ścieżką
- ✅ Możesz budować tower na spotach

**Jeśli coś nie działa** → patrz sekcja [5. Troubleshooting](#5-troubleshooting)

---

## 3. Krok po kroku - Pierwszy poziom

### Problem: LEVEL_01 używa createLevelConfig, LEVEL_02 używa raw object

Twoje poziomy mają dwa formaty:
```typescript
// Format A (level-01.ts, level-03, level-04, ...)
export const LEVEL_01 = createLevelConfig({
  mapConfig: {
    waypoints: [...],
    constructionSpots: [...],
    waves: [...],
  },
});

// Format B (level-02.ts)
export const LEVEL_02: LevelConfig = {
  mapConfig: {
    grid: { width: 20, height: 12, tileSize: 32 },
    waypoints: [...],
    constructionSpots: [...],
    waves: [...],
  },
};
```

### Migracja Format A (z createLevelConfig)

**PRZED**:
```typescript
// data/maps/level-01.ts
import { createLevelConfig, createWaveConfig } from '@/utils/levelHelpers';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_01 = createLevelConfig({
  id: 'level-01',
  number: 1,
  name: 'First Contact',
  description: '...',
  difficulty: 'easy',

  mapConfig: {
    waypoints: [
      { x: 0, y: 6 },
      { x: 10, y: 6 },
      { x: 10, y: 3 },
      { x: 20, y: 3 },
    ],

    constructionSpots: [
      { id: 'CS-01', position: { x: 4, y: 8 } },
      { id: 'CS-02', position: { x: 8, y: 4 } },
      { id: 'CS-03', position: { x: 12, y: 8 } },
      { id: 'CS-04', position: { x: 12, y: 1 } },
      { id: 'CS-05', position: { x: 16, y: 5 } },
    ],

    startingResources: {
      scrap: 200,
      hullIntegrity: 20,
    },

    waves: [
      createWaveConfig(1, [{ type: 'shambler' as EnemyType, count: 5 }], 2000),
      createWaveConfig(2, [{ type: 'shambler' as EnemyType, count: 6 }], 1800),
      // ...
    ],
  },

  unlockRequirement: {
    previousLevelId: null,
    minStarsRequired: 0,
  },
});
```

**PO** (z Tiled):
```typescript
// data/maps/level-01.ts
import { createLevelConfig, createWaveConfig } from '@/utils/levelHelpers';
import { EnemyType } from '@/constants/enemies';
// NOWE: import JSON + loader
import level01Json from '@/assets/maps/level-01.json';
import { loadTiledMapFromJson } from '@/utils/tiledLoader';

// NOWE: Parse Tiled JSON
const LEVEL_01_TILEMAP = loadTiledMapFromJson(level01Json, 'grasslands');

export const LEVEL_01 = createLevelConfig({
  id: 'level-01',
  number: 1,
  name: 'First Contact',
  description: '...',
  difficulty: 'easy',

  mapConfig: {
    // USUNIĘTE: waypoints (są w tileMap!)
    // USUNIĘTE: constructionSpots (są w tileMap!)

    // NOWE: tileMap zawiera waypoints + constructionSpots + grafikę
    tileMap: LEVEL_01_TILEMAP,

    startingResources: {
      scrap: 200,
      hullIntegrity: 20,
    },

    waves: [
      createWaveConfig(1, [{ type: 'shambler' as EnemyType, count: 5 }], 2000),
      createWaveConfig(2, [{ type: 'shambler' as EnemyType, count: 6 }], 1800),
      // ... (waves zostają bez zmian!)
    ],
  },

  unlockRequirement: {
    previousLevelId: null,
    minStarsRequired: 0,
  },
});
```

### Migracja Format B (raw object)

**PRZED**:
```typescript
// data/maps/level-02.ts
import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';

export const LEVEL_02: LevelConfig = {
  id: 'level-02',
  number: 2,
  name: 'The Horde Grows',
  // ...

  mapConfig: {
    grid: {
      width: 20,
      height: 12,
      tileSize: 32,
    },

    waypoints: [
      { x: 0, y: 9 },
      { x: 7, y: 9 },
      // ...
    ],

    constructionSpots: [
      { id: 'CS-01', position: { x: 3, y: 11 } },
      // ...
    ],

    startingResources: {
      scrap: 175,
      hullIntegrity: 20,
    },

    waves: [
      {
        wave: 1,
        enemies: [{ type: 'shambler' as EnemyType, count: 6 }],
        spawnDelay: 2000,
      },
      // ...
    ],
  },

  starRequirements: { /* ... */ },
  unlockRequirement: { /* ... */ },
  rewards: { /* ... */ },
};
```

**PO** (z Tiled):
```typescript
// data/maps/level-02.ts
import { LevelConfig } from '@/types/levels';
import { EnemyType } from '@/constants/enemies';
// NOWE: import JSON + loader
import level02Json from '@/assets/maps/level-02.json';
import { loadTiledMapFromJson } from '@/utils/tiledLoader';

// NOWE: Parse Tiled JSON
const LEVEL_02_TILEMAP = loadTiledMapFromJson(level02Json, 'grasslands');

export const LEVEL_02: LevelConfig = {
  id: 'level-02',
  number: 2,
  name: 'The Horde Grows',
  // ...

  mapConfig: {
    // USUNIĘTE: grid (jest w tileMap!)
    // USUNIĘTE: waypoints (są w tileMap!)
    // USUNIĘTE: constructionSpots (są w tileMap!)

    // NOWE: tileMap
    tileMap: LEVEL_02_TILEMAP,

    startingResources: {
      scrap: 175,
      hullIntegrity: 20,
    },

    waves: [
      {
        wave: 1,
        enemies: [{ type: 'shambler' as EnemyType, count: 6 }],
        spawnDelay: 2000,
      },
      // ... (waves zostają!)
    ],
  },

  starRequirements: { /* ... */ },
  unlockRequirement: { /* ... */ },
  rewards: { /* ... */ },
};
```

---

## 4. Migracja istniejących poziomów

### Strategia: Migruj jeden poziom na raz

Masz **17 poziomów** do migracji:
- level-01 do level-17
- plus endless mode

**NIE MIGRUJ WSZYSTKICH NARAZ!** Zrób tak:

### Faza 1: Test na jednym poziomie (LEVEL_01)

✅ **Zrobione w [Sekcji 2](#2-szybki-start---30-minut)**

### Faza 2: Drugi poziom (LEVEL_02) - 20 min

1. **Otwórz Tiled**
2. **File → New Map** (20×12 tiles, 32×32px)
3. **Narysuj ścieżkę** według waypoints z level-02.ts:
   ```typescript
   // Stare waypoints (level-02.ts)
   { x: 0, y: 9 },   // Start
   { x: 7, y: 9 },   // Right
   { x: 7, y: 4 },   // Up (S-curve)
   { x: 14, y: 4 },  // Right
   { x: 14, y: 9 },  // Down
   { x: 20, y: 9 },  // Exit
   ```

   W Tiled:
   - Layer `ground`: wypełnij grass
   - Layer `path`: narysuj ścieżkę według waypoints (horizontal/vertical/corners)
   - Layer `objects`: dodaj waypoints w order 0-5

4. **Dodaj construction spots** według level-02.ts:
   ```typescript
   // Stare spots
   { id: 'CS-01', position: { x: 3, y: 11 } },
   { id: 'CS-02', position: { x: 5, y: 6 } },
   // ...
   ```

   W Tiled:
   - Layer `objects`: Insert Point
   - Type: `construction`, Name: `CS-01`, etc.

5. **Export**: `assets/maps/level-02.json`

6. **Update level-02.ts**:
   ```typescript
   import level02Json from '@/assets/maps/level-02.json';
   import { loadTiledMapFromJson } from '@/utils/tiledLoader';

   const LEVEL_02_TILEMAP = loadTiledMapFromJson(level02Json, 'grasslands');

   export const LEVEL_02: LevelConfig = {
     // ...
     mapConfig: {
       tileMap: LEVEL_02_TILEMAP,  // ← Dodaj to
       // Usuń waypoints i constructionSpots
       waves: [ /* ... */ ],
     },
   };
   ```

7. **Test w grze** - odpal LEVEL_02 i sprawdź czy działa

### Faza 3: Batch migration (pozostałe 15 poziomów)

**Dla każdego poziomu powtórz**:
1. Otwórz `data/maps/level-XX.ts`
2. Skopiuj waypoints i constructionSpots
3. Otwórz Tiled
4. Stwórz nową mapę bazując na skopiowanych danych
5. Export do `assets/maps/level-XX.json`
6. Update level-XX.ts (dodaj tileMap, usuń waypoints/spots)
7. Test

**Automatyzacja pomocna**: Możesz napisać skrypt który:
- Czyta waypoints z level-XX.ts
- Generuje Tiled JSON automatycznie
- Ale nadal musisz ręcznie narysować ścieżki w Tiled (to jest design work!)

### Faza 4: Endless mode

Endless mode może używać:
- Jednej uniwersalnej mapy (np. `assets/maps/endless.json`)
- Lub losować z puli gotowych map (level-01 do level-17)

```typescript
// data/maps/endless.ts
import endlessJson from '@/assets/maps/endless.json';
import { loadTiledMapFromJson } from '@/utils/tiledLoader';

const ENDLESS_TILEMAP = loadTiledMapFromJson(endlessJson, 'grasslands');

export const ENDLESS_MODE = {
  // ...
  mapConfig: {
    tileMap: ENDLESS_TILEMAP,
    // Waves generowane dynamicznie
  },
};
```

---

## 5. Troubleshooting

### Problem: "Map size mismatch"

**Error**:
```
Error: Map size mismatch. Expected 20×12, got 16×10
```

**Fix**:
1. Otwórz mapę w Tiled
2. Menu: **Map → Map Properties**
3. Sprawdź **Width** i **Height**:
   - Powinno być: **Width: 20**, **Height: 12**
4. Jeśli nie - zmień lub stwórz nową mapę

---

### Problem: "Missing ground layer"

**Error**:
```
Warning: Missing required layer: ground
```

**Fix**:
1. Otwórz mapę w Tiled
2. Prawy panel: **Layers**
3. Sprawdź czy jest layer o nazwie **ground** (case-sensitive!)
4. Jeśli nie - kliknij `+` → Add Tile Layer → nazwij `ground`

---

### Problem: "Waypoints out of order"

**Symptom**: Wrogowie skaczą losowo po mapie zamiast iść ścieżką

**Fix**:
1. Otwórz mapę w Tiled
2. Wybierz layer `objects`
3. Kliknij na każdy waypoint (kropka na mapie)
4. Sprawdź w Properties: musi być `order` property!
5. Upewnij się że order to: 0, 1, 2, 3, ..., N (bez dziur!)

---

### Problem: "Tiles not rendering"

**Symptom**: Mapa jest czarna lub nie widać tile

**Fix**:
1. Sprawdź czy `tileset-grasslands.png` istnieje:
   ```bash
   ls assets/images/tiles/tileset-grasslands.png
   ```

2. Sprawdź Console w Metro bundler:
   ```
   WARN: Tileset not found: @/assets/images/tiles/tileset-grasslands.png
   ```

3. Jeśli brakuje - pobierz z Kenney.nl lub stwórz placeholder

4. Sprawdź czy Tiled export zawiera embedded tileset:
   - W Tiled: File → Export As → ☑ Embed tilesets

---

### Problem: "Construction spots not clickable"

**Symptom**: Nie można kliknąć na construction spot

**Fix**:
1. Sprawdź czy spot NIE jest na ścieżce (path layer)
2. Construction spots muszą być na `buildable` tiles (grass, dirt)
3. W Tiled: sprawdź properties tile - `buildable` musi być `true`

---

### Problem: "Enemies walk through towers"

**Symptom**: Wrogowie przechodzą przez miejsca gdzie są tower

**Fix**:
1. To jest OK! Wrogowie idą tylko ścieżką (waypoints)
2. Towers budowane są poza ścieżką (na construction spots)
3. Jeśli wrogowie schodzą ze ścieżki - sprawdź waypoints order

---

## 6. FAQ

### Q: Czy muszę migrować wszystkie 17 poziomów naraz?

**A**: NIE! Możesz migrować stopniowo:
- Nowe poziomy: tile system
- Stare poziomy: nadal działają ze starym system (background.png)
- GameMap obsługuje oba systemy jednocześnie (backward compatible)

---

### Q: Co z background.png? Mogę usunąć?

**A**: NIE OD RAZU! Usuń dopiero gdy:
1. Wszystkie poziomy używają tile system
2. Przetestowałeś wszystkie poziomy
3. Backup jest bezpieczny

Zachowaj backup:
```bash
mkdir assets/images/old-backgrounds
mv assets/images/ui/background.png assets/images/old-backgrounds/
```

---

### Q: Czy mogę zmienić wygląd ścieżki w istniejących poziomach?

**A**: TAK! To jest główna korzyść tile system:
1. Otwórz mapę w Tiled
2. Wybierz layer `path`
3. Eraser tool (E) → usuń stare tile
4. Wybierz nowe tile → maluj
5. Export → Odśwież grę

---

### Q: Jak dodać nową mapę (level-18)?

**A**:
1. Tiled: File → New Map (20×12)
2. Narysuj mapę
3. Export: `assets/maps/level-18.json`
4. Stwórz: `data/maps/level-18.ts`
5. Dodaj do `data/maps/index.ts`

Przykład:
```typescript
// data/maps/level-18.ts
import level18Json from '@/assets/maps/level-18.json';
import { loadTiledMapFromJson } from '@/utils/tiledLoader';
import { createLevelConfig, createWaveConfig } from '@/utils/levelHelpers';

const LEVEL_18_TILEMAP = loadTiledMapFromJson(level18Json, 'grasslands');

export const LEVEL_18 = createLevelConfig({
  id: 'level-18',
  number: 18,
  name: 'New Challenge',
  description: 'A brand new level!',
  difficulty: 'hard',

  mapConfig: {
    tileMap: LEVEL_18_TILEMAP,
    waves: [ /* ... */ ],
  },

  unlockRequirement: {
    previousLevelId: 'level-17',
    minStarsRequired: 1,
  },
});
```

---

### Q: Jak zmienić theme (grasslands → desert)?

**A**:
1. Pobierz nowy tileset (desert tiles z Kenney.nl)
2. Zapisz jako: `assets/images/tiles/tileset-desert.png`
3. W Tiled: Map Properties → Tileset → zmień na tileset-desert.png
4. W kodzie:
   ```typescript
   const LEVEL_XX_TILEMAP = loadTiledMapFromJson(levelXXJson, 'desert'); // ← zmień theme
   ```

---

### Q: Jak dodać dekoracje (trees, rocks)?

**A**:
1. Tiled: Add Tile Layer → nazwij `decorations`
2. Wybierz tree/rock tile z tileset
3. Maluj na mapie (tylko na grass, NIE na path!)
4. Export
5. TileMapRenderer automatycznie wyrenderuje decorations

---

### Q: Co jeśli chcę ścieżkę która przecina samą siebie (crossroad)?

**A**:
1. Tiled: użyj crossroad tile (col: 4, row: 2 w sprite sheet)
2. Waypoints muszą przechodzić przez crossroad:
   ```
   waypoint 3 → [10, 5] (przed crossroad)
   waypoint 4 → [11, 5] (crossroad)
   waypoint 5 → [11, 6] (po crossroad, skręt)
   ```

---

### Q: Jak zrobić mapę z wieloma ścieżkami (multiple paths)?

**A**: Obecny system wspiera tylko JEDNĄ ścieżkę (jeden ciąg waypoints).

Jeśli chcesz multiple paths:
1. **Opcja A**: Stwórz jeden waypoint path który rozgałęzia się i łączy (wymaga T-junctions)
2. **Opcja B**: Rozszerz system (wymaga modyfikacji kodu):
   - Dodaj `paths: Position[][]` do TileMapConfig
   - Modify EnemySpawner aby losować path
   - Modify EnemyRenderer aby wspierać multiple paths

---

### Q: Jak debugować problemy z mapą?

**A**:
1. **Console logs**: Sprawdź Metro bundler console
   ```
   WARN: Tileset not found
   ERROR: Map size mismatch
   ```

2. **Debug overlay** (FAZA 4 - jeszcze nie zaimplementowane):
   ```typescript
   // Będzie dostępne później
   <TileMapDebugOverlay tileMap={LEVEL_01_TILEMAP} />
   ```

3. **Ręczna inspekcja JSON**:
   ```bash
   cat assets/maps/level-01.json | jq '.layers'
   ```

---

## 📚 Dodatkowe zasoby

- **Tiled Documentation**: https://doc.mapeditor.org/
- **Kenney Assets**: https://kenney.nl/assets/tower-defense-top-down
- **Tile System Progress**: `TILE_SYSTEM_PROGRESS.md`
- **Code Documentation**:
  - `types/tiles.ts` - Type definitions
  - `constants/tileDefinitions.ts` - Sprite layout
  - `utils/tiledLoader.ts` - Parser
  - `components/game/TileMapRenderer.tsx` - Renderer
  - `assets/maps/README.md` - Tiled workflow

---

## 🎯 Następne kroki dla Ciebie

1. [ ] **Pobierz tileset** z Kenney.nl → `assets/images/tiles/tileset-grasslands.png`
2. [ ] **Zainstaluj Tiled** → https://www.mapeditor.org/
3. [ ] **Stwórz level-01.json** w Tiled (15 min)
4. [ ] **Test level-01** w grze
5. [ ] **Stwórz level-02.json** (20 min)
6. [ ] **Migruj pozostałe 15 poziomów** (stopniowo, po jednym na raz)
7. [ ] **Usuń stary background.png** (gdy wszystkie poziomy używają tile system)

---

**Powodzenia! 🚀**

Jeśli utkniesz - sprawdź [Troubleshooting](#5-troubleshooting) lub wróć do tego dokumentu.
