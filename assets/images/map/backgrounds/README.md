# Map Background Images

This folder contains background images for campaign levels.

## Status: PENDING GENERATION

The 10 map background images need to be generated using AI tools (Midjourney, DALL-E, Stable Diffusion, etc.)

## Generation Instructions

Use the prompts from `/docs/prompts/map-backgrounds.md` to generate the following images:

- `level-01-bg.png` - Abandoned city street
- `level-02-bg.png` - Industrial wasteland
- `level-03-bg.png` - Military outpost ruins
- `level-04-bg.png` - Highway intersection
- `level-05-bg.png` - Urban ruins (classic map)
- `level-06-bg.png` - Narrow alley chokepoint
- `level-07-bg.png` - Devastated downtown
- `level-08-bg.png` - Open highway speed run
- `level-09-bg.png` - Underground parking maze
- `level-10-bg.png` - Final stand rooftop

## Technical Specifications

- **Dimensions:** 640x384 pixels (20 tiles × 12 tiles @ 32px/tile)
- **Format:** PNG, optimized for mobile (<500KB each)
- **Perspective:** Top-down isometric (2.5D)
- **Style:** Post-apocalyptic, dark theme
- **Color palette:** Base #2a2a2a, muted earth tones

## Current Status

**Optional Feature:** The game works without background images. They are purely cosmetic enhancements.

If you want to add backgrounds, either:
1. Generate them using the AI prompts
2. Use placeholder dark gray backgrounds
3. Leave empty (game uses default dark background)

## Implementation

Once images are generated, the levels can reference them via the optional `backgroundImage` field in `LevelConfig`.
