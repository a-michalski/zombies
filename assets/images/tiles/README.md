# Tilesets Directory

This directory contains sprite sheets for tile-based map rendering.

## Current Tilesets

### grasslands (Main Theme)
- **File**: `tileset-grasslands.png`
- **Size**: 512×512px (16×16 tiles at 32px each)
- **Source**: Kenney.nl - "Tower Defense Top-Down" or "Tiny Town"
- **License**: CC0 (Public Domain)
- **Download**: https://kenney.nl/assets/tower-defense-top-down

### desert (Future)
- **File**: `tileset-desert.png`
- **Status**: Not yet created

### industrial (Future)
- **File**: `tileset-industrial.png`
- **Status**: Not yet created

## Tileset Layout

Each tileset should follow this sprite sheet layout (512×512px):

```
Row 0: Ground tiles
  [0,0] Grass variant 1
  [1,0] Grass variant 2
  [2,0] Grass variant 3
  [3,0] Dirt
  [4,0] Sand

Row 1: Path tiles (straight)
  [0,1] Path horizontal
  [1,1] Path vertical
  [2,1] Corner top-left
  [3,1] Corner top-right
  [4,1] Corner bottom-left
  [5,1] Corner bottom-right

Row 2: Path tiles (junctions)
  [0,2] T-junction north
  [1,2] T-junction east
  [2,2] T-junction south
  [3,2] T-junction west
  [4,2] Crossroad (4-way)

Row 3: Decorations
  [0,3] Tree variant 1
  [1,3] Tree variant 2
  [2,3] Rock
  [3,3] Bush
  [4,3] Flowers

Rows 4-15: Reserved for future use
```

## Getting Placeholder Tileset

### Option 1: Kenney.nl (Recommended)

1. Visit: https://kenney.nl/assets
2. Search for: "Tower Defense" or "Tiny Town"
3. Download: Choose "Tower Defense Top-Down" pack
4. Extract and find tiles suitable for 32×32 grid
5. Arrange into sprite sheet using image editor (Figma, Photoshop, GIMP)
6. Save as: `tileset-grasslands.png`

### Option 2: Create Simple Placeholder

If you just need to test the system, create a simple placeholder:

1. Open image editor (Figma, Photoshop, or online tool like Pixlr)
2. Create 512×512px canvas
3. Draw 32×32 squares with different colors:
   - Green squares for grass (row 0)
   - Brown squares for path (row 1)
   - Dark green for trees (row 3)
4. Export as PNG: `tileset-grasslands.png`

### Option 3: Script Generation (Quick Test)

For quick testing, you can generate a colored grid programmatically:
```bash
# Using ImageMagick (if installed)
convert -size 512x512 xc:green tileset-grasslands.png
```

## File Requirements

- **Format**: PNG (24-bit or 32-bit with alpha)
- **Size**: 512×512px (recommended) or 256×256px (minimum)
- **Tile Size**: Each tile must be 32×32px
- **Grid**: 16×16 tiles (512px) or 8×8 tiles (256px)
- **Optimization**: Use TinyPNG or ImageOptim before adding to project

## Creating Custom Tilesets

### Using Figma

1. Create 512×512 frame
2. Enable grid: 32×32
3. Design tiles on grid
4. Export > PNG > 2x scale

### Using Photoshop

1. New file: 512×512, 72 DPI
2. View > Show > Grid (32px spacing)
3. Design tiles
4. Save for Web > PNG-24

### Using GIMP

1. File > New: 512×512
2. Image > Guides > Grid (32px spacing)
3. Design tiles
4. Export as PNG

## Optimizing Tilesets

Before adding to project, optimize file size:

```bash
# Using TinyPNG CLI
tinypng tileset-grasslands.png

# Or ImageOptim (macOS)
imageoptim tileset-grasslands.png

# Or pngquant
pngquant --quality=80-95 tileset-grasslands.png
```

Target: < 100KB per tileset

## Current Status

- [x] Directory created
- [ ] grasslands tileset (pending download from Kenney.nl)
- [ ] desert tileset (future)
- [ ] industrial tileset (future)

## Next Steps

1. Download "Tower Defense Top-Down" from Kenney.nl
2. Extract and arrange tiles into 512×512 sprite sheet
3. Save as `tileset-grasslands.png`
4. Test with TileMapRenderer component
5. Optimize file size if > 100KB
