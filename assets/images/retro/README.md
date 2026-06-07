# Retro tileset (CC0)

This folder holds the pixel-art tileset used when `RETRO_SOURCE = "tileset"`
in `constants/retro.ts`.

## Installed sheets

Both are Kenney packs, **CC0 1.0 (public domain)** — free for personal,
educational and commercial use; crediting Kenney is appreciated but not
required. Same layout: **12 x 11** tiles, **16x16 px**, **no spacing**
(192x176 px). Full texts in `LICENSE-tiny-town.txt` / `LICENSE-tiny-dungeon.txt`.

- **`tiny-town.png`** — Kenney **"Tiny Town"** — https://kenney.nl/assets/tiny-town
  - Terrain (grass/dirt/cobblestone) for the map.
- **`tiny-dungeon.png`** — Kenney **"Tiny Dungeon"** — https://kenney.nl/assets/tiny-dungeon
  - Survivors (towers) and monsters (zombies).

### Where each sheet is used

- `components/game/RetroTilesetLayer.tsx` slices **Tiny Town** on the
  `MAP_CONFIG` grid: grass base, a grass-edged dirt path auto-tiled along the
  waypoints (`computePathTiles`), cobblestone plots on the construction spots,
  and start/end markers.
- `RetroEnemyRenderer` draws zombies from **Tiny Dungeon**, `RetroTowerRenderer`
  draws the Lookout Post as a cobblestone platform + a Tiny Dungeon survivor,
  and `RetroProjectileRenderer` draws crossbow bolts procedurally (solid Views,
  no asset). All share the cropper in `components/game/RetroSprite.tsx`; tile
  indices live in `constants/retroSprites.ts`.

Tile indices (row-major, 12 per row):
- Tiny Town — grass `0/1/2`, tree `4`, bush `5`, cobblestone `48`, dirt
  auto-tile block `12-14 / 24-26 / 36-38`.
- Tiny Dungeon — zombies: shambler `108`, runner `121`, brute `123`;
  survivors (tower levels 1/2/3): `98 / 100 / 96`.

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
