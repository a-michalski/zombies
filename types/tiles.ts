/**
 * Tile System Types
 *
 * Defines the tile-based map system for tower defense levels.
 * Replaces large background PNGs with modular 32×32 tiles.
 *
 * Created: 2025-12-30
 * Integration: Extends existing MapConfig from types/map.ts
 */

import { Position } from './game';

/**
 * Available tile types for the map
 * Each type corresponds to a region in the sprite sheet
 */
export type TileType =
  // Ground tiles (walkable/buildable terrain)
  | 'grass'
  | 'dirt'
  | 'sand'

  // Path tiles (where enemies walk)
  | 'path-h'        // Horizontal path
  | 'path-v'        // Vertical path
  | 'corner-tl'     // Top-left corner
  | 'corner-tr'     // Top-right corner
  | 'corner-bl'     // Bottom-left corner
  | 'corner-br'     // Bottom-right corner
  | 't-junction-n'  // T-junction pointing north
  | 't-junction-e'  // T-junction pointing east
  | 't-junction-s'  // T-junction pointing south
  | 't-junction-w'  // T-junction pointing west
  | 'crossroad'     // 4-way intersection

  // Decoration tiles (visual only)
  | 'tree'
  | 'rock'
  | 'bush'
  | 'flower'

  // Special
  | 'empty';        // No tile (transparent)

/**
 * Visual theme for the tileset
 * Determines which sprite sheet to use
 */
export type TileTheme = 'grasslands' | 'desert' | 'industrial';

/**
 * Individual tile cell in the grid
 * Contains both visual data (sprite position) and gameplay data (walkable, buildable)
 */
export interface TileCell {
  /** Type of tile (determines appearance) */
  type: TileType;

  /**
   * Variant number for this tile type (e.g., grass has 3 variants)
   * IMPORTANT: Fixed during map generation, NOT randomized during rendering
   */
  variant: number;

  /** X position in sprite sheet (column index) */
  spriteX: number;

  /** Y position in sprite sheet (row index) */
  spriteY: number;

  /** Can enemies walk on this tile? */
  walkable: boolean;

  /** Can towers be built on this tile? */
  buildable: boolean;

  /** Does this tile block projectiles? (e.g., tall trees) */
  blocksProjectiles?: boolean;
}

/**
 * Complete tile-based map configuration
 * Alternative to large background PNG - uses small reusable tiles
 */
export interface TileMapConfig {
  /** Version for future migrations */
  version: 1;

  /** Map width in tiles (should be 20) */
  width: number;

  /** Map height in tiles (should be 12) */
  height: number;

  /** Visual theme (determines sprite sheet) */
  theme: TileTheme;

  /**
   * 2D grid of tiles [y][x]
   * - First index is row (Y coordinate, 0-11)
   * - Second index is column (X coordinate, 0-19)
   */
  tiles: TileCell[][];

  /**
   * Waypoints for enemy path
   * Extracted from Tiled object layer or generated from level config
   */
  waypoints?: Position[];

  /**
   * Construction spots for towers
   * Extracted from Tiled object layer or generated from level config
   */
  constructionSpots?: Array<{
    id: string;
    position: Position;
  }>;
}

/**
 * Tiled Map Editor JSON format (partial - only what we need)
 * https://doc.mapeditor.org/en/stable/reference/json-map-format/
 */
export interface TiledMapJson {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;

  layers: Array<{
    name: string;
    type: 'tilelayer' | 'objectgroup';

    // For tile layers
    data?: number[];

    // For object layers
    objects?: Array<{
      id: number;
      x: number;
      y: number;
      width?: number;
      height?: number;
      type?: string;
      name?: string;
      properties?: Array<{
        name: string;
        type: string;
        value: any;
      }>;
    }>;
  }>;

  tilesets: Array<{
    firstgid: number;
    name: string;
    tilewidth: number;
    tileheight: number;
    tilecount: number;
    columns: number;
    image: string;
    imagewidth: number;
    imageheight: number;

    // Custom tile properties
    tiles?: Array<{
      id: number;
      properties?: Array<{
        name: string;
        type: string;
        value: any;
      }>;
    }>;
  }>;
}
