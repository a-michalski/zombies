# Retro tileset (CC0)

This folder holds the pixel-art tileset used when `RETRO_SOURCE = "tileset"`
in `constants/retro.ts`.

## Installed tileset

- **`tiny-town.png`** — Kenney **"Tiny Town"** packed tilemap.
  - Grid: **12 x 11** tiles, **16x16 px** each, **no spacing** (192x176 px total).
  - Source: https://kenney.nl/assets/tiny-town
  - License: **CC0 1.0 (public domain)** — free for personal, educational and
    commercial use; crediting Kenney is appreciated but not required. Full text
    in `LICENSE-tiny-town.txt`.

`components/game/RetroTilesetLayer.tsx` slices this sheet on the `MAP_CONFIG`
grid: grass base, a grass-edged dirt path auto-tiled along the waypoints
(`computePathTiles` from `utils/retroTiles.ts`), cobblestone plots on the
construction spots, and start/end markers.

Tile indices used (row-major, 12 per row): grass `0/1/2`, tree `4`, bush `5`,
cobblestone `48`, and the 3x3 dirt auto-tile block `12-14 / 24-26 / 36-38`.

## Crisp pixels

- Web: `image-rendering: pixelated` is set on the sheet `<Image>`.
- Native: the source is kept at native resolution and upscaled by the integer
  factor `TILE_SIZE / 16` (= 2), so no blur is introduced.

## Comparing the two looks

`RetroTileLayer` (procedural, zero assets) and `RetroTilesetLayer` (this sheet)
are interchangeable. Switch `RETRO_SOURCE` between `"procedural"` and
`"tileset"` to compare; `RETRO_MODE = false` restores the original high-fi look.

## Adding more / alternative CC0 packs

Other good CC0 options (verify each pack's license before use):

1. **Kenney – "Tower Defense (Top-down)" / "RPG Urban" / "Roguelike-RPG"** —
   https://kenney.nl/assets (all CC0).
2. **itch.io – "Cute Fantasy RPG", "Tiny Swords"** — often CC0 / free for
   commercial use, but confirm per pack.
