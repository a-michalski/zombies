/**
 * Resolves map data (grid, waypoints, construction spots) for the current
 * game session. Campaign levels carry their own mapConfig; classic mode
 * falls back to the constants in gameConfig.ts.
 *
 * This is the single source of truth for "where things are" so that the
 * engine, the renderers and the build logic never disagree.
 */

import { CONSTRUCTION_SPOTS, MAP_CONFIG, WAYPOINTS } from "@/constants/gameConfig";
import { GameState, Position } from "@/types/game";
import { ConstructionSpotConfig } from "@/types/map";

export interface MapGrid {
  width: number;
  height: number;
  tileSize: number;
}

export interface MapData {
  grid: MapGrid;
  waypoints: readonly Position[];
  constructionSpots: readonly ConstructionSpotConfig[];
}

export const CLASSIC_GRID: MapGrid = {
  width: MAP_CONFIG.WIDTH,
  height: MAP_CONFIG.HEIGHT,
  tileSize: MAP_CONFIG.TILE_SIZE,
};

export const CLASSIC_WAYPOINTS: readonly Position[] = WAYPOINTS.map((w) => ({ x: w.x, y: w.y }));

export const CLASSIC_CONSTRUCTION_SPOTS: readonly ConstructionSpotConfig[] = CONSTRUCTION_SPOTS.map(
  (s) => ({ id: s.id, position: { x: s.x, y: s.y } })
);

export const CLASSIC_MAP_DATA: MapData = {
  grid: CLASSIC_GRID,
  waypoints: CLASSIC_WAYPOINTS,
  constructionSpots: CLASSIC_CONSTRUCTION_SPOTS,
};

/**
 * Get map data for the given game state.
 * Returns the level's mapConfig when a campaign level is active,
 * otherwise the classic (hardcoded) map.
 */
export function getMapData(state: Pick<GameState, "sessionConfig">): MapData {
  const mapConfig = state.sessionConfig?.currentLevel?.mapConfig;
  if (!mapConfig) {
    return CLASSIC_MAP_DATA;
  }

  return {
    grid: mapConfig.grid ?? CLASSIC_GRID,
    waypoints: mapConfig.waypoints,
    constructionSpots: mapConfig.constructionSpots,
  };
}
