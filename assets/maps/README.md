# Tiled Maps Directory

This directory contains Tiled Map Editor exports for game levels.

## Setup

1. **Download Tiled**: https://www.mapeditor.org/
2. **Download Tileset**: Get placeholder tiles from Kenney.nl
   - Recommended: "Tiny Town" or "RPG Urban Pack"
   - URL: https://kenney.nl/assets/tower-defense-top-down
   - License: CC0 (Public Domain)
3. **Save tileset**: Place in `../images/tiles/tileset-grasslands.png`

## Creating a New Map

### Step 1: New Tileset in Tiled

1. Open Tiled
2. Map > New Tileset
3. Settings:
   - Name: `grasslands`
   - Type: Based on Tileset Image
   - Image: Browse to `../images/tiles/tileset-grasslands.png`
   - Tile width: `32`
   - Tile height: `32`
4. Click OK

### Step 2: Configure Tile Properties

1. Click on tile in tileset (e.g., grass tile)
2. Right panel > Properties
3. Add custom properties:
   - `walkable` (bool): Can enemies walk on this?
   - `buildable` (bool): Can towers be built here?

Example configurations:
- **Grass tiles**: `walkable: false`, `buildable: true`
- **Path tiles**: `walkable: true`, `buildable: false`
- **Tree tiles**: `walkable: false`, `buildable: false`

### Step 3: Create New Map

1. File > New > New Map
2. Settings:
   - Orientation: Orthogonal
   - Tile layer format: CSV
   - Tile render order: Right Down
   - Map size: Width `20` tiles, Height `12` tiles
   - Tile size: `32×32` pixels
3. Click OK

### Step 4: Add Layers

Create these layers (Layer > New Layer):

1. **ground** (Tile Layer)
   - Base terrain (grass, dirt, sand)
   - Fill entire map with ground tiles

2. **path** (Tile Layer)
   - Enemy walking path
   - Draw path from start to end
   - Use path tiles (walkable: true, buildable: false)

3. **decorations** (Tile Layer) - OPTIONAL
   - Trees, rocks, bushes
   - Place decorations on grass (not on path!)

4. **objects** (Object Layer)
   - Waypoints (enemy path points)
   - Construction spots (tower build locations)

### Step 5: Add Waypoints (Object Layer)

1. Select "objects" layer
2. Click "Insert Point" tool
3. Place points along the path (start to end)
4. For each point:
   - Type: `waypoint`
   - Name: Optional (e.g., "Start", "Turn 1", "Exit")
   - Custom Properties:
     - `order` (int): 0 for first, 1 for second, etc.

**Important**: Waypoints MUST have `order` property to define path sequence!

### Step 6: Add Construction Spots (Object Layer)

1. Select "objects" layer
2. Click "Insert Point" tool
3. Place points where towers can be built
4. For each point:
   - Type: `construction`
   - Name: `CS-01`, `CS-02`, etc. (or leave blank for auto-naming)

### Step 7: Export Map

1. File > Export As
2. Format: JSON map files (*.json)
3. Settings:
   - ☑ Embed tilesets
   - ☑ Detach templates
4. Save as: `assets/maps/level-XX.json`

## Using Exported Map in Code

```typescript
// data/maps/level-01.ts
import level01Json from '@/assets/maps/level-01.json';
import { loadTiledMapFromJson } from '@/utils/tiledLoader';
import { createLevelConfig } from '@/utils/levelHelpers';

const LEVEL_01_TILEMAP = loadTiledMapFromJson(level01Json, 'grasslands');

export const LEVEL_01 = createLevelConfig({
  id: 'level-01',
  name: 'First Contact',
  description: 'Your first encounter with the zombie horde.',
  difficulty: 'easy',

  mapConfig: {
    waypoints: LEVEL_01_TILEMAP.waypoints!,
    constructionSpots: LEVEL_01_TILEMAP.constructionSpots!,
    waves: [...], // Define waves manually
    tileMap: LEVEL_01_TILEMAP,
  },
});
```

## Troubleshooting

### "Map size mismatch" error
- Ensure map is exactly 20×12 tiles in Tiled
- Check Map > Map Properties

### "Missing ground layer" error
- Create a tile layer named exactly "ground"
- Layer names are case-sensitive!

### Waypoints out of order
- Check `order` property on each waypoint object
- Order should be: 0, 1, 2, 3, ...

### Tiles not rendering correctly
- Verify tileset image path is correct
- Check tile width/height is 32×32
- Ensure "Embed tilesets" is checked when exporting

## File Naming Convention

- `level-01.json` - Level 1: First Contact
- `level-02.json` - Level 2: [Name]
- ...
- `level-10.json` - Level 10: Last Stand
- `endless.json` - Endless Mode map (if different from campaign)

## Resources

- Tiled Documentation: https://doc.mapeditor.org/
- Tiled Tutorials: https://doc.mapeditor.org/en/stable/manual/introduction/
- Kenney Assets: https://kenney.nl/assets
