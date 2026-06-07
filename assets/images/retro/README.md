# Retro tileset slot (CC0)

This folder is the drop point for a free pixel-art tileset, used when
`RETRO_SOURCE = "tileset"` in `constants/retro.ts`.

Right now the retro look is **procedural** (drawn from code in
`components/game/RetroTileLayer.tsx`) so the app works with zero asset files.
A tileset gives a richer, closer-to-the-reference look once you drop one in.

## Recommended CC0 packs (free, incl. commercial use)

Download locally (the build sandbox can't reach these hosts) and unzip here:

1. **Kenney – "Tiny Town" / "Tower Defense (Top-down)"** — https://kenney.nl/assets
   16x16, perfectly tileable, the closest to the reference screenshot. CC0.
2. **Kenney – "RPG Urban Pack" / "Roguelike/RPG pack"** — extra props, fences, water.
3. **itch.io – "Cute Fantasy RPG", "Tiny Swords"** — check each pack's license
   (many are CC0 / free for commercial use, but confirm per pack).

## How to wire a tileset in (next step)

1. Drop the tileset PNG(s) here, e.g. `assets/images/retro/tiles.png`.
2. Note the grid size (usually 16x16) and which cell is grass/dirt/water/etc.
3. Add a `RetroTilesetLayer` that slices the sheet (e.g. via transformed
   `<Image>` crops or `react-native-svg` `<Image>` with a viewBox per cell)
   and renders cells on the `MAP_CONFIG` grid — mirroring `RetroTileLayer`.
4. Switch on `RETRO_SOURCE` inside `GameMap` to pick procedural vs tileset.

Keep source sheets crisp: on web set `image-rendering: pixelated`; on native
keep the source at native pixel size and scale up integer multiples.
