/**
 * Retro / pixel-art mode (PoC).
 *
 * Toggle RETRO_MODE to compare the new pixelated look with the original
 * high-fidelity image-based rendering. Nothing is deleted: when RETRO_MODE
 * is false the game renders exactly as before.
 *
 * RETRO_SOURCE selects where the map graphics come from:
 *  - "procedural": tiles drawn from code (no asset files needed). Works offline.
 *  - "tileset":    a CC0 16x16 tileset dropped into assets/images/retro/
 *                  (see assets/images/retro/README.md). Falls back to
 *                  "procedural" until a tileset renderer is wired in.
 */
export const RETRO_MODE = true;

export type RetroSource = "procedural" | "tileset";
export const RETRO_SOURCE: RetroSource = "procedural";

/** GBA-grassland inspired limited palette (kept small on purpose). */
export const RETRO_PALETTE = {
  grass: "#5a9e3f",
  grassLight: "#7bbf52",
  grassDark: "#3f7d2e",
  path: "#d8c79a",
  pathLight: "#e7d9b3",
  pathDark: "#c0ac7c",
  water: "#3f8fd0",
  waterLight: "#65b0e6",
  rock: "#8a8473",
  rockDark: "#6b6557",
  flower: "#e85b6b",
  flowerAlt: "#f2c14e",
  start: "#e84d4d",
  end: "#4d6de8",
  outline: "#1b1b1b",
} as const;

/** Sub-pixels per tile edge for procedural texture (higher = finer, heavier). */
export const RETRO_PIXELS_PER_TILE = 4;
