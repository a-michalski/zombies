/**
 * GameModeToggle - Campaign/Endless toggle using extracted image assets
 * 
 * Uses pre-rendered toggle images from mockups for pixel-perfect appearance.
 * Swaps between campaign-active and endless-active images based on state.
 * 
 * Usage:
 * <GameModeToggle 
 *   mode={selectedMode} 
 *   onModeChange={(mode) => setSelectedMode(mode)} 
 * />
 */

import React from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { hasToggleImages, UI_IMAGES } from "@/utils/imageAssets";
import { THEME } from "@/constants/ui/theme";

export type GameMode = "campaign" | "endless";

interface GameModeToggleProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  disabled?: boolean;
}

export function GameModeToggle({ 
  mode, 
  onModeChange,
  disabled = false,
}: GameModeToggleProps) {
  const hasImages = hasToggleImages();

  // If we have image assets, use them
  if (hasImages) {
    return (
      <View style={[styles.imageContainer, disabled && styles.disabled]}>
        <Image
          source={mode === "campaign" ? UI_IMAGES.toggleCampaignActive : UI_IMAGES.toggleEndlessActive}
          style={styles.toggleImage}
          resizeMode="contain"
        />
        {/* Touchable overlays for each option */}
        <View style={styles.touchOverlay}>
          <Pressable
            style={styles.touchArea}
            onPress={() => !disabled && onModeChange("campaign")}
            disabled={disabled}
          >
            <Text style={[
              styles.overlayText,
              mode === "campaign" && styles.overlayTextActive,
            ]}>
              CAMPAIGN
            </Text>
          </Pressable>
          <Pressable
            style={styles.touchArea}
            onPress={() => !disabled && onModeChange("endless")}
            disabled={disabled}
          >
            <Text style={[
              styles.overlayText,
              mode === "endless" && styles.overlayTextActive,
            ]}>
              ENDLESS
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Fallback to styled toggle if no images
  return (
    <View style={[styles.fallbackContainer, disabled && styles.disabled]}>
      <Pressable
        onPress={() => !disabled && onModeChange("campaign")}
        style={[
          styles.fallbackOption,
          mode === "campaign" && styles.fallbackOptionActive,
        ]}
        disabled={disabled}
      >
        <Text style={[
          styles.fallbackText,
          mode === "campaign" && styles.fallbackTextActive,
        ]}>
          CAMPAIGN
        </Text>
      </Pressable>
      <Pressable
        onPress={() => !disabled && onModeChange("endless")}
        style={[
          styles.fallbackOption,
          mode === "endless" && styles.fallbackOptionActive,
        ]}
        disabled={disabled}
      >
        <Text style={[
          styles.fallbackText,
          mode === "endless" && styles.fallbackTextActive,
        ]}>
          ENDLESS
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleImage: {
    width: 400,
    height: 73,
  },
  touchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  touchArea: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  overlayText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#888888",
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
    ...Platform.select({
      web: {
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
      },
      default: {
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
    }),
  },
  overlayTextActive: {
    color: "#FFFFFF",
    ...Platform.select({
      web: {
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 212, 255, 0.5)",
      },
      default: {},
    }),
  },
  disabled: {
    opacity: 0.5,
  },
  // Fallback styles (if no images)
  fallbackContainer: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4A4A4A",
    overflow: "hidden",
  },
  fallbackOption: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: "center",
  },
  fallbackOptionActive: {
    backgroundColor: "#3A3A3A",
  },
  fallbackText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#666666",
    letterSpacing: 2,
  },
  fallbackTextActive: {
    color: "#FFFFFF",
    ...Platform.select({
      web: {
        textShadow: "0 0 8px rgba(0, 212, 255, 0.6)",
      },
      default: {},
    }),
  },
});

export default GameModeToggle;
