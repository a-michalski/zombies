import { MAP_CONFIG } from "@/constants/gameConfig";
import { Position } from "@/types/game";

/**
 * Deterministic 0..1 hash from integer coordinates (+ salt).
 * Used so procedural texture/decoration is stable across renders.
 */
export function hash2(x: number, y: number, salt = 0): number {
  let h =
    Math.imul(x | 0, 73856093) ^
    Math.imul(y | 0, 19349663) ^
    Math.imul(salt | 0, 83492791);
  h = (h ^ (h >>> 13)) >>> 0;
  return (h % 100000) / 100000;
}

/**
 * Build the set of "x,y" tile keys covered by the path, derived from the
 * waypoint centerline and widened by `halfWidth` tiles on each side.
 */
export function computePathTiles(
  waypoints: readonly Position[],
  halfWidth = 0.75
): Set<string> {
  const tiles = new Set<string>();

  const mark = (cx: number, cy: number) => {
    const r = Math.ceil(halfWidth + 0.5);
    for (let oy = -r; oy <= r; oy++) {
      for (let ox = -r; ox <= r; ox++) {
        const tx = Math.round(cx) + ox;
        const ty = Math.round(cy) + oy;
        if (tx < 0 || ty < 0 || tx >= MAP_CONFIG.WIDTH || ty >= MAP_CONFIG.HEIGHT) {
          continue;
        }
        if (Math.hypot(cx - tx, cy - ty) <= halfWidth + 0.5) {
          tiles.add(`${tx},${ty}`);
        }
      }
    }
  };

  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const steps = Math.max(1, Math.ceil(dist * 4));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      mark(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    }
  }

  return tiles;
}
