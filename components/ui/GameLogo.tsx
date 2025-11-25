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
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { hasLogoImage, UI_IMAGES } from "@/utils/imageAssets";

interface GameLogoProps {
  /** Scale factor for the logo (default: 1) */
  scale?: number;
}

export function GameLogo({ scale = 1 }: GameLogoProps) {
  const hasImage = hasLogoImage();

  // If we have logo image, use it
  if (hasImage) {
    // Actual dimensions of logo.png (base version)
    // React Native will automatically select @2x or @3x versions based on device pixel ratio
    const baseWidth = 183;
    const baseHeight = 142;
    
    // Try to resolve asset source for actual dimensions (works on native, not on web)
    // This helps get the correct dimensions for the selected @2x/@3x version
    let actualWidth = baseWidth;
    let actualHeight = baseHeight;
    
    try {
      if (Image.resolveAssetSource && typeof Image.resolveAssetSource === 'function') {
        const imageSource = Image.resolveAssetSource(UI_IMAGES.logo);
        if (imageSource && imageSource.width && imageSource.height) {
          actualWidth = imageSource.width;
          actualHeight = imageSource.height;
        }
      }
    } catch (error) {
      // Fallback to base dimensions if resolveAssetSource fails
      console.warn('Could not resolve asset source, using default dimensions');
    }
    
    return (
      <View style={styles.container}>
        <Image
          source={UI_IMAGES.logo}
          style={[
            styles.logoImage,
            { 
              width: actualWidth * scale, 
              height: actualHeight * scale,
            },
          ]}
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
