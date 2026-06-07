import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { MAP_CONFIG, WAYPOINTS } from "@/constants/gameConfig";
import { RETRO_PALETTE, RETRO_PIXELS_PER_TILE } from "@/constants/retro";
import { Position } from "@/types/game";
import { computePathTiles, hash2 } from "@/utils/retroTiles";

interface RetroTileLayerProps {
  /** Waypoints used to carve the path. Defaults to the global WAYPOINTS. */
  waypoints?: readonly Position[];
}

const P = RETRO_PALETTE;
const TILE = MAP_CONFIG.TILE_SIZE;
const PX = RETRO_PIXELS_PER_TILE; // sub-pixels per tile edge
const SUB = TILE / PX; // size of one sub-pixel

/**
 * Procedural pixel-art map background (PoC).
 *
 * Renders grass + dirt path as crisp solid-color tiles with deterministic
 * per-pixel texture and a few cosmetic decorations. Solid <View>s are
 * inherently aliasing-free, which gives the retro look without any assets.
 */
export function RetroTileLayer({ waypoints = WAYPOINTS }: RetroTileLayerProps) {
  const pathTiles = useMemo(() => computePathTiles(waypoints), [waypoints]);

  const tiles = useMemo(() => {
    const out: React.ReactNode[] = [];

    for (let ty = 0; ty < MAP_CONFIG.HEIGHT; ty++) {
      for (let tx = 0; tx < MAP_CONFIG.WIDTH; tx++) {
        const isPath = pathTiles.has(`${tx},${ty}`);
        const base = isPath ? P.path : P.grass;
        const light = isPath ? P.pathLight : P.grassLight;
        const dark = isPath ? P.pathDark : P.grassDark;

        const sub: React.ReactNode[] = [];
        for (let py = 0; py < PX; py++) {
          for (let px = 0; px < PX; px++) {
            const h = hash2(tx * PX + px, ty * PX + py, isPath ? 7 : 1);
            let color: string | null = null;
            if (h > 0.86) color = light;
            else if (h < 0.14) color = dark;
            if (!color) continue;
            sub.push(
              <View
                key={`s-${px}-${py}`}
                style={{
                  position: "absolute",
                  left: px * SUB,
                  top: py * SUB,
                  width: SUB,
                  height: SUB,
                  backgroundColor: color,
                }}
              />
            );
          }
        }

        // Cosmetic decoration on grass only, low density.
        let deco: React.ReactNode = null;
        if (!isPath) {
          const d = hash2(tx, ty, 99);
          if (d > 0.94) {
            const c = d > 0.97 ? P.flower : P.flowerAlt;
            deco = (
              <View
                style={{
                  position: "absolute",
                  left: SUB,
                  top: SUB,
                  width: SUB,
                  height: SUB,
                  backgroundColor: c,
                }}
              />
            );
          } else if (d < 0.06) {
            deco = (
              <View
                style={{
                  position: "absolute",
                  left: SUB,
                  top: TILE - 2 * SUB,
                  width: 2 * SUB,
                  height: SUB,
                  backgroundColor: P.rock,
                }}
              />
            );
          }
        }

        out.push(
          <View
            key={`t-${tx}-${ty}`}
            style={{
              position: "absolute",
              left: tx * TILE,
              top: ty * TILE,
              width: TILE,
              height: TILE,
              backgroundColor: base,
            }}
          >
            {sub}
            {deco}
          </View>
        );
      }
    }

    return out;
  }, [pathTiles]);

  const markers = useMemo(() => {
    if (waypoints.length === 0) return null;
    const first = waypoints[0];
    const last = waypoints[waypoints.length - 1];

    const dot = (p: Position, color: string, key: string) => (
      <View
        key={key}
        style={{
          position: "absolute",
          left: p.x * TILE - TILE * 0.4,
          top: p.y * TILE - TILE * 0.4,
          width: TILE * 0.8,
          height: TILE * 0.8,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: P.outline,
        }}
      />
    );

    return [dot(first, P.start, "start"), dot(last, P.end, "end")];
  }, [waypoints]);

  return (
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: P.grass }]}
      pointerEvents="none"
    >
      {tiles}
      {markers}
    </View>
  );
}
