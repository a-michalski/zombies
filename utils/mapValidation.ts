/**
 * Map Validation Utilities
 *
 * Validates waypoints, construction spots, and tile positions.
 * Throws errors in DEV mode, logs warnings in PROD.
 *
 * Created: 2025-12-30
 */

import { Position } from '@/types/game';
import { TileMapConfig } from '@/types/tiles';
import { MAP_WIDTH, MAP_HEIGHT } from '@/constants/tileDefinitions';

/**
 * Check if a position is within map bounds
 */
export function isValidTilePosition(x: number, y: number): boolean {
  return x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT;
}

/**
 * Validate a single waypoint position
 * Throws error in DEV, warns in PROD
 *
 * @param wp - Waypoint position to validate
 * @param index - Waypoint index (for error messages)
 * @throws Error in DEV mode if waypoint is out of bounds
 */
export function validateWaypoint(wp: Position, index: number): void {
  if (!isValidTilePosition(wp.x, wp.y)) {
    const message =
      `Waypoint ${index} out of bounds: (${wp.x}, ${wp.y}). ` +
      `Valid range: x[0-${MAP_WIDTH - 1}], y[0-${MAP_HEIGHT - 1}]`;

    if (__DEV__) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }
}

/**
 * Validate array of waypoints
 * Ensures:
 * - At least 2 waypoints (start and end)
 * - All waypoints within map bounds
 * - No duplicate positions
 *
 * @param waypoints - Array of waypoint positions
 * @throws Error in DEV mode if validation fails
 */
export function validateWaypoints(waypoints: Position[]): void {
  // Check minimum count
  if (waypoints.length < 2) {
    const message = `Invalid waypoints: need at least 2 (start and end), got ${waypoints.length}`;

    if (__DEV__) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
    return;
  }

  // Check each waypoint is within bounds
  waypoints.forEach((wp, index) => {
    validateWaypoint(wp, index);
  });

  // Check for duplicates (adjacent waypoints at same position)
  for (let i = 1; i < waypoints.length; i++) {
    const prev = waypoints[i - 1];
    const curr = waypoints[i];

    if (prev.x === curr.x && prev.y === curr.y) {
      const message = `Duplicate waypoints at index ${i - 1} and ${i}: (${curr.x}, ${curr.y})`;

      if (__DEV__) {
        console.warn(message); // Just warn, don't throw - might be intentional
      }
    }
  }
}

/**
 * Validate construction spot position
 *
 * @param spot - Construction spot with id and position
 * @throws Error in DEV mode if position is out of bounds
 */
export function validateConstructionSpot(spot: { id: string; position: Position }): void {
  if (!isValidTilePosition(spot.position.x, spot.position.y)) {
    const message =
      `Construction spot "${spot.id}" out of bounds: (${spot.position.x}, ${spot.position.y}). ` +
      `Valid range: x[0-${MAP_WIDTH - 1}], y[0-${MAP_HEIGHT - 1}]`;

    if (__DEV__) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }
}

/**
 * Validate complete TileMapConfig
 * Checks:
 * - Correct map dimensions (20×12)
 * - Tile grid has correct size
 * - All tile positions valid
 * - Waypoints valid (if present)
 * - Construction spots valid (if present)
 *
 * @param tileMap - Complete tile map configuration
 * @throws Error in DEV mode if validation fails
 */
export function validateTileMap(tileMap: TileMapConfig): void {
  // Check dimensions
  if (tileMap.width !== MAP_WIDTH || tileMap.height !== MAP_HEIGHT) {
    const message =
      `Invalid map dimensions: expected ${MAP_WIDTH}×${MAP_HEIGHT}, ` +
      `got ${tileMap.width}×${tileMap.height}`;

    if (__DEV__) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }

  // Check tile grid size
  if (tileMap.tiles.length !== MAP_HEIGHT) {
    const message =
      `Invalid tile grid: expected ${MAP_HEIGHT} rows, ` +
      `got ${tileMap.tiles.length}`;

    if (__DEV__) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }

  // Check each row has correct width
  tileMap.tiles.forEach((row, y) => {
    if (row.length !== MAP_WIDTH) {
      const message =
        `Invalid tile grid row ${y}: expected ${MAP_WIDTH} columns, ` +
        `got ${row.length}`;

      if (__DEV__) {
        throw new Error(message);
      } else {
        console.warn(message);
      }
    }
  });

  // Validate waypoints if present
  if (tileMap.waypoints) {
    validateWaypoints(tileMap.waypoints);
  }

  // Validate construction spots if present
  if (tileMap.constructionSpots) {
    tileMap.constructionSpots.forEach(spot => {
      validateConstructionSpot(spot);
    });
  }
}

/**
 * Sanitize waypoint position (clamp to valid range)
 * Use only as last resort - prefer throwing errors in validateWaypoint
 *
 * @param wp - Waypoint position (possibly out of bounds)
 * @returns Clamped position within valid range
 */
export function sanitizeWaypointPosition(wp: Position): Position {
  return {
    x: Math.max(0, Math.min(MAP_WIDTH - 1, Math.floor(wp.x))),
    y: Math.max(0, Math.min(MAP_HEIGHT - 1, Math.floor(wp.y))),
  };
}
