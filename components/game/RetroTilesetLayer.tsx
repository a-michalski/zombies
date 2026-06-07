import React, { useMemo } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";

import { CONSTRUCTION_SPOTS, MAP_CONFIG, WAYPOINTS } from "@/constants/gameConfig";
import { RETRO_PALETTE } from "@/constants/retro";
import { Position } from "@/types/game";
import { computePathTiles, hash2 } from "@/utils/retroTiles";

/**
 * Tileset-based pixel-art map background (PoC), mirroring RetroTileLayer.
 *
 * Instead of drawing tiles from code, this slices a CC0 16x16 sprite sheet
 * (Kenney "Tiny Town", public domain — see assets/images/retro/) into cells
 * and lays them out on the MAP_CONFIG grid: grass as the base, a dirt path
 * carved along the waypoints (with grass-edged auto-tiling), stone plots on
 * construction spots, plus start/end markers.
 *
 * Crisp pixels: the source is upscaled by an integer factor (TILE / 16). On
 * web we additionally set `image-rendering: pixelated`; on native the integer
 * scale from the native-resolution sheet keeps edges sharp (no blur).
 */

// The packed Tiny Town sheet: 12 x 11 tiles, 16px each, no spacing (192x176).
const SHEET = require("@/assets/images/retro/tiny-town.png");

const P = RETRO_PALETTE;
const TILE = MAP_CONFIG.TILE_SIZE; // on-screen tile size (32)
const SRC = 16; // source tile size in the sheet
const COLS = 12; // sheet columns
const ROWS = 11; // sheet rows
const SHEET_W = COLS * TILE; // sheet scaled to on-screen tile size
const SHEET_H = ROWS * TILE;

// Crisp upscaling hint for the web renderer (no-op on native).
// `imageRendering` isn't in RN's style types (web-only), so cast it through.
const PIXELATED =
  Platform.OS === "web" ? ({ imageRendering: "pixelated" } as any) : null;

// --- Tiny Town tile indices (row-major, COLS per row) ---
const GRASS = 0;
const GRASS_TUFT = 1;
const GRASS_FLOWER = 2;
const TREE = 4;
const BUSH = 5;
const STONE = 48; // cobblestone plot, used to mark construction spots
// 3x3 dirt auto-tile block (grass surrounds a dirt patch).
const DIRT = {
  TL: 12, TM: 13, TR: 14,
  ML: 24, MM: 25, MR: 26,
  BL: 36, BM: 37, BR: 38,
} as const;

interface RetroTilesetLayerProps {
  /** Waypoints used to carve the path. Defaults to the global WAYPOINTS. */
  waypoints?: readonly Position[];
  /** Construction spots to mark with a stone plot. Defaults to constants. */
  spots?: readonly { x: number; y: number }[];
}

/** Render one sheet cell, cropped to a 16px tile and scaled to TILE px. */
function Cell({ idx, left, top }: { idx: number; left: number; top: number }) {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  return (
    <View style={{ position: "absolute", left, top, width: TILE, height: TILE, overflow: "hidden" }}>
      <Image
        source={SHEET}
        fadeDuration={0}
        resizeMode="stretch"
        style={[
          {
            position: "absolute",
            left: -col * TILE,
            top: -row * TILE,
            width: SHEET_W,
            height: SHEET_H,
          },
          PIXELATED,
        ]}
      />
    </View>
  );
}

export function RetroTilesetLayer({
  waypoints = WAYPOINTS,
  spots = CONSTRUCTION_SPOTS,
}: RetroTilesetLayerProps) {
  const pathTiles = useMemo(() => computePathTiles(waypoints), [waypoints]);

  const spotKeys = useMemo(
    () => new Set(spots.map((s) => `${s.x},${s.y}`)),
    [spots]
  );

  const cells = useMemo(() => {
    const inBounds = (x: number, y: number) =>
      x >= 0 && y >= 0 && x < MAP_CONFIG.WIDTH && y < MAP_CONFIG.HEIGHT;
    // A neighbour reads as grass when it's in-bounds and not part of the path.
    // Out-of-bounds is treated as path so map-edge entrances stay solid dirt.
    const isGrass = (x: number, y: number) =>
      inBounds(x, y) && !pathTiles.has(`${x},${y}`);

    // Pick the dirt auto-tile variant from which sides border grass.
    const pathIndex = (x: number, y: number) => {
      const gN = isGrass(x, y - 1);
      const gS = isGrass(x, y + 1);
      const gW = isGrass(x - 1, y);
      const gE = isGrass(x + 1, y);
      if (gN && gW) return DIRT.TL;
      if (gN && gE) return DIRT.TR;
      if (gS && gW) return DIRT.BL;
      if (gS && gE) return DIRT.BR;
      if (gN) return DIRT.TM;
      if (gS) return DIRT.BM;
      if (gW) return DIRT.ML;
      if (gE) return DIRT.MR;
      return DIRT.MM;
    };

    const out: React.ReactNode[] = [];

    for (let ty = 0; ty < MAP_CONFIG.HEIGHT; ty++) {
      for (let tx = 0; tx < MAP_CONFIG.WIDTH; tx++) {
        const key = `${tx},${ty}`;
        const left = tx * TILE;
        const top = ty * TILE;

        if (pathTiles.has(key)) {
          out.push(<Cell key={`p-${key}`} idx={pathIndex(tx, ty)} left={left} top={top} />);
          continue;
        }

        if (spotKeys.has(key)) {
          // Grass under a stone plot so the cobble's transparent edges blend in.
          out.push(<Cell key={`g-${key}`} idx={GRASS} left={left} top={top} />);
          out.push(<Cell key={`s-${key}`} idx={STONE} left={left} top={top} />);
          continue;
        }

        // Grass base with a little deterministic variation.
        const h = hash2(tx, ty, 3);
        let base = GRASS;
        if (h > 0.93) base = GRASS_FLOWER;
        else if (h > 0.78) base = GRASS_TUFT;
        out.push(<Cell key={`g-${key}`} idx={base} left={left} top={top} />);

        // Sparse cosmetic foliage on plain grass only (kept clear of the path).
        const d = hash2(tx, ty, 42);
        if (d > 0.965) out.push(<Cell key={`d-${key}`} idx={BUSH} left={left} top={top} />);
        else if (d > 0.94) out.push(<Cell key={`d-${key}`} idx={TREE} left={left} top={top} />);
      }
    }

    return out;
  }, [pathTiles, spotKeys]);

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
      {cells}
      {markers}
    </View>
  );
}
