/**
 * Map configuration types for dynamic level loading
 *
 * Recent changes (2025-11-16):
 * - Created comprehensive map configuration system
 * - Supports dynamic waypoints, construction spots, and wave configs
 *
 * Next agent: Agent B will use MapConfig to define 10 unique maps
 */

import { Position } from './game';
import { EnemyType } from '@/constants/enemies';

/**
 * Configuration for a single construction spot on the map
 * Construction spots are locations where players can build towers
 */
export interface ConstructionSpotConfig {
  /** Unique identifier for this construction spot (e.g., 'CS-01') */
  id: string;

  /** Position in tile coordinates (0-20 x, 0-12 y), NOT pixels */
  position: Position;
}

/**
 * Configuration for a single enemy wave
 * Defines which enemies spawn and how quickly they appear
 */
export interface WaveConfig {
  /** Wave number (1-based index) */
  wave: number;

  /** Array of enemy types and counts for this wave */
  enemies: {
    /** Type of enemy to spawn (shambler, runner, brute) */
    type: EnemyType;

    /** Number of enemies of this type to spawn */
    count: number;
  }[];

  /** Delay in milliseconds between each enemy spawn */
  spawnDelay: number;
}

/**
 * Complete map configuration for a level
 * Contains all data needed to dynamically generate a playable map
 */
export interface MapConfig {
  /** Grid size configuration for the map */
  grid: {
    /** Width in tiles (default: 20) */
    width: number;

    /** Height in tiles (default: 12) */
    height: number;

    /** Size of each tile in pixels (default: 32) */
    tileSize: number;
  };

  /**
   * Enemy path waypoints in tile coordinates
   * Enemies follow these points from first to last
   * Must have at least 2 waypoints (start and end)
   */
  waypoints: Position[];

  /** Available tower construction spots for this map */
  constructionSpots: ConstructionSpotConfig[];

  /** Starting resources for this map */
  startingResources: {
    /** Starting scrap (currency for building towers) */
    scrap: number;

    /** Starting hull integrity (player health) */
    hullIntegrity: number;
  };

  /** Wave configurations for this map */
  waves: WaveConfig[];

  /** Optional background image path for this map */
  backgroundImage?: string;
}
