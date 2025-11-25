/**
 * GameLogo - Game logo using image asset
 * 
 * Uses pre-rendered logo image for pixel-perfect appearance.
 * Falls back to styled text if image not available.
 * 
 * Usage:
 * <GameLogo />
 */

import React from "react";
import {
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";

import { hasLogoImage, UI_IMAGES } from "@/utils/imageAssets";

interface GameLogoProps {
  /** Scale factor for the logo (default: 1) */
  scale?: number;
}

export function GameLogo({ scale = 1 }: GameLogoProps) {
  const hasImage = hasLogoImage();

  // If we have logo image, use it
  if (hasImage) {
    // Actual dimensions of logo.png (base version) - trimmed to remove empty space
    // React Native will automatically select @2x or @3x versions based on device pixel ratio
    const baseWidth = 98;
    const baseHeight = 41;
    
    // Get pixel ratio to ensure we use the best quality image
    const pixelRatio = PixelRatio.get();
    
    // Calculate display size based on base dimensions and scale
    // expo-image will automatically select @2x/@3x versions for best quality
    const displayWidth = baseWidth * scale;
    const displayHeight = baseHeight * scale;
    
    return (
      <View style={styles.container}>
        <Image
          source={UI_IMAGES.logo}
          style={[
            styles.logoImage,
            { 
              width: displayWidth, 
              height: displayHeight,
            },
          ]}
          contentFit="contain"
          // Ensure best quality rendering
          cachePolicy="memory-disk"
          // expo-image automatically selects @2x/@3x based on pixel ratio
          // This ensures crisp rendering on all devices
        />
      </View>
    );
  }

  // Fallback to styled text
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { fontSize: 52 * scale }]}>
          ZOMBIE FLEET
        </Text>
      </View>
      <Text style={[styles.subtitle, { fontSize: 22 * scale }]}>
        BASTION
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    // Add padding to compensate for trimmed space from top
    // Original logo had empty space on top that was removed during trimming
    // With scale=2.0, we need to compensate for the visual shift
    paddingTop: 10,
  },
  logoImage: {
    // Width and height are set dynamically via inline styles based on scale prop
  },
  // Fallback styles
  titleContainer: {
    position: "relative",
  },
  title: {
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: 4,
    textAlign: "center",
    textTransform: "uppercase",
    color: "#FF6B35",
    ...Platform.select({
      web: {
        background: "linear-gradient(180deg, #FFD700 0%, #FF8C00 30%, #FF4500 60%, #8B0000 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textShadow: "3px 3px 0 #1A0A00, 0 4px 8px rgba(0, 0, 0, 0.8)",
      },
      default: {
        textShadowColor: "#000000",
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 6,
      },
    }),
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 12,
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 8,
    color: "#CCCCCC",
    ...Platform.select({
      web: {
        textShadow: "2px 2px 0 #1A1A1A, 0 2px 8px rgba(0, 0, 0, 0.6)",
      },
      default: {
        textShadowColor: "#000000",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
      },
    }),
  },
});

export default GameLogo;
