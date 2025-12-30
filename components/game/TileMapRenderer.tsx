/**
 * TileMapRenderer Component
 *
 * Renders a tile-based map from TileMapConfig.
 * Optimized with React.memo to prevent unnecessary re-renders.
 *
 * Features:
 * - Renders 240 tiles (20×12 grid) from sprite sheet
 * - Uses absolute positioning for each tile
 * - Memoized to only re-render when tileMap reference changes
 *
 * Created: 2025-12-30
 */

import React, { useMemo } from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';

import { TileMapConfig } from '@/types/tiles';
import { TILE_SIZE } from '@/constants/tileDefinitions';

interface TileMapRendererProps {
  /** Tile map configuration to render */
  tileMap: TileMapConfig;

  /** Sprite sheet image source for this theme */
  spriteSheet: ImageSourcePropType;
}

/**
 * Renders individual tile using sprite sheet cropping
 * Uses transform to offset the sprite sheet image
 */
const TileImage = React.memo<{
  spriteSheet: ImageSourcePropType;
  x: number;
  y: number;
  spriteX: number;
  spriteY: number;
}>(({ spriteSheet, x, y, spriteX, spriteY }) => {
  // Calculate position offset in sprite sheet
  const offsetX = -spriteX * TILE_SIZE;
  const offsetY = -spriteY * TILE_SIZE;

  return (
    <View
      style={[
        styles.tileContainer,
        {
          left: x * TILE_SIZE,
          top: y * TILE_SIZE,
        },
      ]}
    >
      <Image
        source={spriteSheet}
        style={[
          styles.spriteSheet,
          {
            transform: [{ translateX: offsetX }, { translateY: offsetY }],
          },
        ]}
        resizeMode="stretch"
      />
    </View>
  );
}, (prev, next) => {
  // Only re-render if sprite position or location changed
  return (
    prev.x === next.x &&
    prev.y === next.y &&
    prev.spriteX === next.spriteX &&
    prev.spriteY === next.spriteY &&
    prev.spriteSheet === next.spriteSheet
  );
});

TileImage.displayName = 'TileImage';

/**
 * Main TileMapRenderer component
 * Renders entire grid of tiles from sprite sheet
 */
export const TileMapRenderer = React.memo<TileMapRendererProps>(
  ({ tileMap, spriteSheet }) => {
    // Pre-calculate all tile render data
    const tileRenderData = useMemo(() => {
      const data: Array<{
        key: string;
        x: number;
        y: number;
        spriteX: number;
        spriteY: number;
      }> = [];

      for (let y = 0; y < tileMap.tiles.length; y++) {
        const row = tileMap.tiles[y];
        for (let x = 0; x < row.length; x++) {
          const cell = row[x];

          // Skip empty tiles
          if (cell.type === 'empty') {
            continue;
          }

          data.push({
            key: `tile-${x}-${y}`,
            x,
            y,
            spriteX: cell.spriteX,
            spriteY: cell.spriteY,
          });
        }
      }

      return data;
    }, [tileMap]);

    const mapWidth = tileMap.width * TILE_SIZE;
    const mapHeight = tileMap.height * TILE_SIZE;

    return (
      <View
        style={[
          styles.container,
          {
            width: mapWidth,
            height: mapHeight,
          },
        ]}
      >
        {tileRenderData.map(tile => (
          <TileImage
            key={tile.key}
            spriteSheet={spriteSheet}
            x={tile.x}
            y={tile.y}
            spriteX={tile.spriteX}
            spriteY={tile.spriteY}
          />
        ))}
      </View>
    );
  },
  (prev, next) => {
    // Only re-render if tileMap reference changed
    // This prevents re-renders when game state updates but map doesn't change
    return prev.tileMap === next.tileMap && prev.spriteSheet === next.spriteSheet;
  }
);

TileMapRenderer.displayName = 'TileMapRenderer';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  tileContainer: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    overflow: 'hidden',
  },
  spriteSheet: {
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
});
