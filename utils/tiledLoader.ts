/**
 * Tiled Map Loader
 *
 * Parses Tiled Map Editor JSON exports into TileMapConfig format.
 * Supports layers, tilesets, objects, and custom properties.
 *
 * Tiled Map Editor: https://www.mapeditor.org/
 * JSON Format Spec: https://doc.mapeditor.org/en/stable/reference/json-map-format/
 *
 * Created: 2025-12-30
 */

import { Position } from '@/types/game';
import { TileMapConfig, TileCell, TiledMapJson, TileTheme } from '@/types/tiles';
import { MAP_WIDTH, MAP_HEIGHT, getDefaultTileProperties } from '@/constants/tileDefinitions';
import { validateTileMap } from './mapValidation';

/**
 * Parse Tiled Map Editor JSON export into TileMapConfig
 *
 * Expected Tiled map structure:
 * - Layers:
 *   - "ground" (Tile Layer) - base terrain tiles
 *   - "path" (Tile Layer) - enemy path tiles (optional, can overlay ground)
 *   - "decorations" (Tile Layer) - trees, rocks, etc (optional)
 *   - "objects" (Object Layer) - waypoints, construction spots
 *
 * - Custom tile properties (set in tileset):
 *   - walkable: boolean - can enemies walk on this tile?
 *   - buildable: boolean - can towers be built here?
 *
 * - Object properties:
 *   - type: "waypoint" | "construction" | "spawn"
 *   - order: number (for waypoints - defines path order)
 *
 * @param json - Tiled JSON export (File > Export As > JSON)
 * @param theme - Visual theme (determines sprite sheet to use)
 * @returns Parsed TileMapConfig ready for rendering
 * @throws Error if map dimensions don't match expected size or required layers missing
 */
export function parseTiledMap(json: TiledMapJson, theme: TileTheme = 'grasslands'): TileMapConfig {
  // Validate map dimensions
  if (json.width !== MAP_WIDTH || json.height !== MAP_HEIGHT) {
    throw new Error(
      `Map size mismatch. Expected ${MAP_WIDTH}×${MAP_HEIGHT}, ` +
      `got ${json.width}×${json.height}. ` +
      `Please create map with correct dimensions in Tiled.`
    );
  }

  if (json.tilewidth !== 32 || json.tileheight !== 32) {
    throw new Error(
      `Tile size mismatch. Expected 32×32px, got ${json.tilewidth}×${json.tileheight}. ` +
      `Please use 32×32 tiles in Tiled.`
    );
  }

  // Find required layers
  const groundLayer = json.layers.find(l => l.name === 'ground' && l.type === 'tilelayer');
  const pathLayer = json.layers.find(l => l.name === 'path' && l.type === 'tilelayer');
  const decorationsLayer = json.layers.find(l => l.name === 'decorations' && l.type === 'tilelayer');
  const objectsLayer = json.layers.find(l => l.type === 'objectgroup');

  if (!groundLayer?.data) {
    throw new Error(
      'Missing required "ground" tile layer in Tiled map. ' +
      'Please create a tile layer named "ground".'
    );
  }

  // Get tileset info
  if (!json.tilesets || json.tilesets.length === 0) {
    throw new Error('No tilesets found in Tiled map. Please add a tileset.');
  }

  const tileset = json.tilesets[0]; // Use first tileset

  // Build map of tile properties from tileset
  const tileProperties = new Map<number, { walkable: boolean; buildable: boolean }>();

  tileset.tiles?.forEach(tile => {
    const props = { walkable: false, buildable: true }; // Defaults

    tile.properties?.forEach(p => {
      if (p.name === 'walkable' && p.type === 'bool') {
        props.walkable = Boolean(p.value);
      }
      if (p.name === 'buildable' && p.type === 'bool') {
        props.buildable = Boolean(p.value);
      }
    });

    tileProperties.set(tile.id, props);
  });

  // Initialize tiles grid
  const tiles: TileCell[][] = [];

  for (let y = 0; y < json.height; y++) {
    tiles[y] = [];
  }

  // Parse ground layer (base terrain)
  for (let y = 0; y < json.height; y++) {
    for (let x = 0; x < json.width; x++) {
      const index = y * json.width + x;
      const gid = groundLayer.data[index];

      if (gid === 0) {
        // Empty tile
        tiles[y][x] = {
          type: 'empty',
          variant: 0,
          spriteX: 0,
          spriteY: 0,
          walkable: false,
          buildable: false,
        };
        continue;
      }

      // Convert GID to local tile ID
      const localId = gid - tileset.firstgid;

      // Get custom properties or use defaults
      const props = tileProperties.get(localId) || getDefaultTileProperties('grass');

      // Calculate sprite position in tileset
      const spriteX = localId % tileset.columns;
      const spriteY = Math.floor(localId / tileset.columns);

      tiles[y][x] = {
        type: 'grass', // Will be refined based on sprite position
        variant: localId,
        spriteX,
        spriteY,
        walkable: props.walkable,
        buildable: props.buildable,
      };
    }
  }

  // Overlay path layer (if exists)
  if (pathLayer?.data) {
    for (let y = 0; y < json.height; y++) {
      for (let x = 0; x < json.width; x++) {
        const index = y * json.width + x;
        const gid = pathLayer.data[index];

        if (gid > 0) {
          const localId = gid - tileset.firstgid;
          const spriteX = localId % tileset.columns;
          const spriteY = Math.floor(localId / tileset.columns);

          // Path tiles are walkable but not buildable
          tiles[y][x] = {
            type: 'path-h', // Will be refined by autotiling or manually set
            variant: localId,
            spriteX,
            spriteY,
            walkable: true,
            buildable: false,
          };
        }
      }
    }
  }

  // Overlay decorations layer (if exists)
  if (decorationsLayer?.data) {
    for (let y = 0; y < json.height; y++) {
      for (let x = 0; x < json.width; x++) {
        const index = y * json.width + x;
        const gid = decorationsLayer.data[index];

        if (gid > 0 && tiles[y][x].type !== 'path-h' && tiles[y][x].type !== 'path-v') {
          // Only place decorations on non-path tiles
          const localId = gid - tileset.firstgid;
          const spriteX = localId % tileset.columns;
          const spriteY = Math.floor(localId / tileset.columns);

          tiles[y][x] = {
            type: 'tree', // Could be tree, rock, bush - refine based on sprite
            variant: localId,
            spriteX,
            spriteY,
            walkable: false,
            buildable: false,
          };
        }
      }
    }
  }

  // Extract waypoints from objects layer
  const waypoints: Position[] = [];

  if (objectsLayer?.objects) {
    const waypointObjects = objectsLayer.objects
      .filter(obj => obj.type === 'waypoint')
      .map(obj => {
        // Get order property
        const orderProp = obj.properties?.find(p => p.name === 'order');
        const order = orderProp?.value ?? 0;

        return {
          x: Math.floor(obj.x / json.tilewidth),
          y: Math.floor(obj.y / json.tileheight),
          order: Number(order),
        };
      })
      .sort((a, b) => a.order - b.order); // Sort by order

    waypoints.push(...waypointObjects.map(({ x, y }) => ({ x, y })));
  }

  // Extract construction spots from objects layer
  const constructionSpots: Array<{ id: string; position: Position }> = [];

  if (objectsLayer?.objects) {
    const constructionObjects = objectsLayer.objects
      .filter(obj => obj.type === 'construction')
      .map((obj, index) => ({
        id: obj.name || `CS-${String(index + 1).padStart(2, '0')}`,
        position: {
          x: Math.floor(obj.x / json.tilewidth),
          y: Math.floor(obj.y / json.tileheight),
        },
      }));

    constructionSpots.push(...constructionObjects);
  }

  // Build final config
  const tileMapConfig: TileMapConfig = {
    version: 1,
    width: json.width,
    height: json.height,
    theme,
    tiles,
    waypoints: waypoints.length > 0 ? waypoints : undefined,
    constructionSpots: constructionSpots.length > 0 ? constructionSpots : undefined,
  };

  // Validate before returning
  if (__DEV__) {
    validateTileMap(tileMapConfig);
  }

  return tileMapConfig;
}

/**
 * Load and parse Tiled map from JSON file
 *
 * Usage:
 * ```typescript
 * import level01Json from '@/assets/maps/level-01.json';
 * const tileMap = loadTiledMapFromJson(level01Json);
 * ```
 *
 * @param jsonData - Imported JSON data from Tiled export
 * @param theme - Visual theme (default: grasslands)
 * @returns Parsed TileMapConfig
 */
export function loadTiledMapFromJson(jsonData: any, theme: TileTheme = 'grasslands'): TileMapConfig {
  return parseTiledMap(jsonData as TiledMapJson, theme);
}
