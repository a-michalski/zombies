export const MAP_CONFIG = {
  WIDTH: 20,
  HEIGHT: 12,
  TILE_SIZE: 32,
} as const;

export const WAYPOINTS = [
  { x: 0, y: 6 },
  { x: 4, y: 6 },
  { x: 4, y: 3 },
  { x: 8, y: 3 },
  { x: 8, y: 9 },
  { x: 14, y: 9 },
  { x: 14, y: 4 },
  { x: 20, y: 4 },
] as const;

export const CONSTRUCTION_SPOTS = [
  { id: "CS-01", x: 2, y: 8 },
  { id: "CS-02", x: 6, y: 5 },
  { id: "CS-03", x: 6, y: 1 },
  { id: "CS-04", x: 10, y: 5 },
  { id: "CS-05", x: 10, y: 11 },
  { id: "CS-06", x: 16, y: 11 },
  { id: "CS-07", x: 16, y: 6 },
  { id: "CS-08", x: 18, y: 2 },
] as const;

export const GAME_CONFIG = {
  STARTING_SCRAP: 150,
  STARTING_HULL: 20,
  WAVE_COMPLETION_BONUS: 25,
  MANUAL_START_BONUS: 15,
  AUTO_START_DELAY: 15,
  TOTAL_WAVES: 10,
} as const;