import React from "react";
import { Image, Platform, StyleProp, View, ViewStyle } from "react-native";

/**
 * Crisp-pixel hint for the web renderer. On native the integer/near-integer
 * upscale from the native-resolution sheet keeps edges sharp on its own.
 */
export const PIXELATED =
  Platform.OS === "web" ? ({ imageRendering: "pixelated" } as any) : null;

interface RetroSpriteProps {
  /** require()'d sprite sheet. */
  sheet: number;
  /** Tile index, row-major (index = row * cols + col). */
  index: number;
  /** Sheet grid dimensions. */
  cols: number;
  rows: number;
  /** On-screen size of one tile (square). */
  size: number;
  /** Mirror horizontally (e.g. to face the other way). */
  flipX?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Renders a single cell of a packed sprite sheet, cropped and scaled to `size`.
 *
 * The sheet is scaled so each source tile maps to `size` px, then offset inside
 * an `overflow: hidden` box so only the requested cell shows. This is the
 * standard RN sprite-sheet technique and works on web + native.
 */
export function RetroSprite({ sheet, index, cols, rows, size, flipX, style }: RetroSpriteProps) {
  const col = index % cols;
  const row = Math.floor(index / cols);
  const sheetW = cols * size;
  const sheetH = rows * size;

  return (
    <View
      style={[
        { width: size, height: size, overflow: "hidden" },
        flipX ? { transform: [{ scaleX: -1 }] } : null,
        style,
      ]}
    >
      <Image
        source={sheet}
        fadeDuration={0}
        resizeMode="stretch"
        style={[
          {
            position: "absolute",
            left: -col * size,
            top: -row * size,
            width: sheetW,
            height: sheetH,
          },
          PIXELATED,
        ]}
      />
    </View>
  );
}
