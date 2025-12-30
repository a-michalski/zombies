# 🗺️ Tile System - Cheat Sheet

**Szybka ściąga dla migracji poziomów**

---

## 📋 Checklist: Nowy poziom w Tiled

```
[ ] Otwórz Tiled
[ ] New Tileset → grasslands, 32×32px
[ ] Ustaw tile properties (walkable, buildable)
[ ] New Map → 20×12 tiles, 32×32px
[ ] Dodaj layers: ground, path, objects
[ ] Wypełnij ground → grass tile (Bucket Fill)
[ ] Narysuj path → horizontal/vertical/corners
[ ] Dodaj waypoints → type=waypoint, order=0,1,2...
[ ] Dodaj construction spots → type=construction, name=CS-01
[ ] Export JSON → assets/maps/level-XX.json
[ ] ☑ Embed tilesets ☑ Detach templates
```

---

## 💻 Kod: Migracja poziomu

### Format A (z createLevelConfig)

```typescript
// DODAJ NA POCZĄTKU:
import levelXXJson from '@/assets/maps/level-XX.json';
import { loadTiledMapFromJson } from '@/utils/tiledLoader';

const LEVEL_XX_TILEMAP = loadTiledMapFromJson(levelXXJson, 'grasslands');

// W createLevelConfig:
export const LEVEL_XX = createLevelConfig({
  mapConfig: {
    // USUŃ: waypoints
    // USUŃ: constructionSpots

    tileMap: LEVEL_XX_TILEMAP,  // ← DODAJ TO

    waves: [ /* ZOSTAW */ ],
    startingResources: { /* ZOSTAW */ },
  },
});
```

### Format B (raw object)

```typescript
// DODAJ NA POCZĄTKU:
import levelXXJson from '@/assets/maps/level-XX.json';
import { loadTiledMapFromJson } from '@/utils/tiledLoader';

const LEVEL_XX_TILEMAP = loadTiledMapFromJson(levelXXJson, 'grasslands');

// W object:
export const LEVEL_XX: LevelConfig = {
  mapConfig: {
    // USUŃ: grid
    // USUŃ: waypoints
    // USUŃ: constructionSpots

    tileMap: LEVEL_XX_TILEMAP,  // ← DODAJ TO

    waves: [ /* ZOSTAW */ ],
    startingResources: { /* ZOSTAW */ },
  },
};
```

---

## 🎨 Sprite Sheet Layout (512×512px)

```
Row 0: [0] Grass-1  [1] Grass-2  [2] Grass-3  [3] Dirt  [4] Sand
Row 1: [0] Path-H   [1] Path-V   [2] Corner-TL [3] Corner-TR [4] Corner-BL [5] Corner-BR
Row 2: [0] T-N      [1] T-E      [2] T-S       [3] T-W       [4] Crossroad
Row 3: [0] Tree-1   [1] Tree-2   [2] Rock      [3] Bush      [4] Flower
```

**Tile properties**:
- Grass: `walkable=false, buildable=true`
- Path: `walkable=true, buildable=false`
- Tree: `walkable=false, buildable=false`

---

## 🐛 Szybkie fixy

**Mapa nie renderuje**:
```bash
ls assets/images/tiles/tileset-grasslands.png
# Jeśli brakuje → pobierz z Kenney.nl
```

**Wrogowie skaczą losowo**:
```
Tiled → objects layer → każdy waypoint musi mieć `order` property!
```

**"Map size mismatch"**:
```
Tiled → Map Properties → Width=20, Height=12
```

**Construction spots not clickable**:
```
Spot musi być na grass (buildable=true), NIE na path!
```

---

## 🔗 Quick Links

- **Tutorial**: `docs/TILE_SYSTEM_MIGRATION_GUIDE.md`
- **Progress**: `TILE_SYSTEM_PROGRESS.md`
- **Kenney.nl**: https://kenney.nl/assets/tower-defense-top-down
- **Tiled**: https://www.mapeditor.org/

---

## 📦 File Structure

```
assets/
├── images/tiles/
│   └── tileset-grasslands.png  ← 512×512px sprite sheet
└── maps/
    ├── README.md               ← Tiled workflow
    └── level-XX.json           ← Exported from Tiled

data/maps/
└── level-XX.ts                 ← Add tileMap import

constants/
└── tileDefinitions.ts          ← Sprite layout

utils/
└── tiledLoader.ts              ← JSON parser

components/game/
├── TileMapRenderer.tsx         ← Renders tiles
└── GameMap.tsx                 ← Uses tileMap prop
```

---

## ⚡ Speed Run (30 min)

1. **Kenney.nl** → Download tileset (5 min)
2. **Figma/Photoshop** → 512×512 sprite sheet (10 min)
3. **Tiled** → Create level-01.json (10 min)
4. **Code** → Add tileMap to level-01.ts (2 min)
5. **Test** → npm start (3 min)

**Done! 🎉**
