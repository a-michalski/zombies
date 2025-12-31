/**
 * Tile System Definitions
 *
 * SINGLE SOURCE OF TRUTH for map dimensions and tile sprite sheet layout.
 * Consolidates MAP_CONFIG (gameConfig.ts) and DEFAULT_GRID (levels.ts).
 *
 * Created: 2025-12-30
 */

import { TileTheme } from '@/types/tiles';

/**
 * Map dimensions - CANONICAL VALUES
 * All maps in the game use this grid size
 */
export const MAP_WIDTH = 20;    // tiles (0-19 inclusive)
export const MAP_HEIGHT = 12;   // tiles (0-11 inclusive)
export const TILE_SIZE = 32;    // pixels per tile

/**
 * Physical map size in pixels
 */
export const MAP_PIXEL_WIDTH = MAP_WIDTH * TILE_SIZE;   // 640px
export const MAP_PIXEL_HEIGHT = MAP_HEIGHT * TILE_SIZE; // 384px

/**
 * Sprite sheet layout for each tile type
 * Defines position (col, row) in the tileset image
 *
 * Format: Each tileset is 512×512px with 16×16 tiles (32px each)
 * Position (0, 0) is top-left corner of the sprite sheet
 */
export const TILE_REGIONS: Record<string, Array<{ col: number; row: number }>> = {
  // Ground tiles (row 0)
  grass: [
    { col: 0, row: 0 },   // variant 0 - base grass
    { col: 1, row: 0 },   // variant 1 - grass with small flowers
    { col: 2, row: 0 },   // variant 2 - slightly darker grass
  ],
  dirt: [
    { col: 3, row: 0 },   // variant 0
  ],
  sand: [
    { col: 4, row: 0 },   // variant 0 (for desert theme)
  ],

  // Path tiles (row 1)
  'path-h': [
    { col: 0, row: 1 },   // horizontal path
  ],
  'path-v': [
    { col: 1, row: 1 },   // vertical path
  ],
  'corner-tl': [
    { col: 2, row: 1 },   // top-left corner
  ],
  'corner-tr': [
    { col: 3, row: 1 },   // top-right corner
  ],
  'corner-bl': [
    { col: 4, row: 1 },   // bottom-left corner
  ],
  'corner-br': [
    { col: 5, row: 1 },   // bottom-right corner
  ],

  // T-junctions and crossroads (row 2)
  't-junction-n': [
    { col: 0, row: 2 },   // T pointing north
  ],
  't-junction-e': [
    { col: 1, row: 2 },   // T pointing east
  ],
  't-junction-s': [
    { col: 2, row: 2 },   // T pointing south
  ],
  't-junction-w': [
    { col: 3, row: 2 },   // T pointing west
  ],
  crossroad: [
    { col: 4, row: 2 },   // 4-way intersection
  ],

  // Decoration tiles (row 3)
  tree: [
    { col: 0, row: 3 },   // variant 0 - pine tree
    { col: 1, row: 3 },   // variant 1 - oak tree
  ],
  rock: [
    { col: 2, row: 3 },   // variant 0 - grey rock
  ],
  bush: [
    { col: 3, row: 3 },   // variant 0 - green bush
  ],
  flower: [
    { col: 4, row: 3 },   // variant 0 - small flowers
  ],

  // Special
  empty: [
    { col: 0, row: 0 },   // Transparent/empty (will be skipped in rendering)
  ],
};

/**
 * Tileset images per theme
 * Each tileset is a sprite sheet containing all tiles for that theme
 *
 * Static imports required for Metro Bundler web compatibility
 */
export const TILESET_IMAGES: Record<TileTheme, any> = {
  grasslands: null, // require('@/assets/images/tiles/tileset-grasslands.png'),
  desert: null,     // require('@/assets/images/tiles/tileset-desert.png'), // Future
  industrial: null, // require('@/assets/images/tiles/tileset-industrial.png'), // Future
};

/**
 * Default tile properties by type
 * Used when Tiled map doesn't specify custom properties
 */
export const DEFAULT_TILE_PROPERTIES: Record<string, { walkable: boolean; buildable: boolean }> = {
  // Ground tiles - buildable but not walkable
  grass: { walkable: false, buildable: true },
  dirt: { walkable: false, buildable: true },
  sand: { walkable: false, buildable: true },

  // Path tiles - walkable but not buildable
  'path-h': { walkable: true, buildable: false },
  'path-v': { walkable: true, buildable: false },
  'corner-tl': { walkable: true, buildable: false },
  'corner-tr': { walkable: true, buildable: false },
  'corner-bl': { walkable: true, buildable: false },
  'corner-br': { walkable: true, buildable: false },
  't-junction-n': { walkable: true, buildable: false },
  't-junction-e': { walkable: true, buildable: false },
  't-junction-s': { walkable: true, buildable: false },
  't-junction-w': { walkable: true, buildable: false },
  crossroad: { walkable: true, buildable: false },

  // Decorations - neither walkable nor buildable (visual only, placed on grass)
  tree: { walkable: false, buildable: false },
  rock: { walkable: false, buildable: false },
  bush: { walkable: false, buildable: false },
  flower: { walkable: false, buildable: false },

  // Special
  empty: { walkable: false, buildable: false },
};

/**
 * Helper: Get sprite position for a tile type and variant
 */
export function getTileSpritePosition(
  type: string,
  variant: number = 0
): { col: number; row: number } {
  const regions = TILE_REGIONS[type];

  if (!regions || regions.length === 0) {
    console.warn(`Unknown tile type: ${type}, using grass fallback`);
    return TILE_REGIONS.grass[0];
  }

  // Clamp variant to available options
  const clampedVariant = Math.min(variant, regions.length - 1);
  return regions[clampedVariant];
}

/**
 * Helper: Get default properties for a tile type
 */
export function getDefaultTileProperties(type: string): { walkable: boolean; buildable: boolean } {
  return DEFAULT_TILE_PROPERTIES[type] || { walkable: false, buildable: false };
}
