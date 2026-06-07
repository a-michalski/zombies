/**
 * Sprite-sheet sources and tile indices for the retro (pixel-art) look.
 *
 * Sheets (all CC0, see assets/images/retro/):
 *  - Tiny Town    — terrain + the cobblestone lookout-post base.
 *  - Tiny Dungeon — survivors (towers) and monsters (zombies).
 *
 * Both packs share the same layout: 12 x 11 tiles, 16x16 px, no spacing.
 */
import { EnemyType } from "@/constants/enemies";

export const TINY_TOWN = {
  sheet: require("@/assets/images/retro/tiny-town.png") as number,
  cols: 12,
  rows: 11,
} as const;

export const TINY_DUNGEON = {
  sheet: require("@/assets/images/retro/tiny-dungeon.png") as number,
  cols: 12,
  rows: 11,
} as const;

/** Tiny Town cobblestone tile, used as the lookout-post platform. */
export const TT_STONE = 48;

/**
 * Tiny Dungeon monster used for each enemy type. The wave roster mainly uses
 * shambler/runner/brute; the rest fall back to a sensible monster so anything
 * spawned still gets a sprite.
 */
export const ENEMY_SPRITE: Record<EnemyType, number> = {
  shambler: 108, // green zombie — slow basic
  runner: 121, // pale ghoul — fast
  brute: 123, // hulking beast — tank
  spitter: 124,
  crawler: 108,
  bloater: 123,
  tank: 123,
  hiveQueen: 124,
};

/** Tiny Dungeon survivor manning the lookout post, by tower level. */
export const TOWER_GUARD_SPRITE: Record<number, number> = {
  1: 98, // dwarf survivor
  2: 100, // armored survivor
  3: 96, // veteran
};
