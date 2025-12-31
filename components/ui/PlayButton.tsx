/**
 * PlayButton - Main PLAY button using extracted image assets
 * 
 * Uses pre-rendered button images from mockups for pixel-perfect appearance.
 * Supports normal and pressed states with image swapping.
 * 
 * Usage:
 * <PlayButton onPress={() => handlePlay()} />
 */

import React, { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { hasPlayButtonImages, UI_IMAGES } from "@/utils/imageAssets";

interface PlayButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
}

export function PlayButton({ 
  onPress, 
  disabled = false,
  label = "PLAY" 
}: PlayButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const hasImages = hasPlayButtonImages();

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);

  // If we have image assets, use them
  if (hasImages) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.imageContainer,
          disabled && styles.disabled,
        ]}
      >
        <Image
          source={isPressed ? UI_IMAGES.playButtonPressed : UI_IMAGES.playButtonNormal}
          style={styles.buttonImage}
          resizeMode="contain"
        />
        {/* Text overlay */}
        <View style={styles.textOverlay}>
          <Text style={styles.buttonText}>{label}</Text>
        </View>
      </Pressable>
    );
  }

  // Fallback to styled button if no images
  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={({ pressed }) => [
        styles.fallbackButton,
        pressed && styles.fallbackButtonPressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonImage: {
    width: 335,
    height: 75,
  },
  textOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 6,
    textAlign: "center",
    textTransform: "uppercase",
    ...Platform.select({
      web: {
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
      },
      default: {
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
      },
    }),
  },
  disabled: {
    opacity: 0.5,
  },
  // Fallback styles (if no images)
  fallbackButton: {
    backgroundColor: "#00BFFF",
    paddingHorizontal: 80,
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#4A4A4A",
  },
  fallbackButtonPressed: {
    backgroundColor: "#0099CC",
  },
});

export default PlayButton;
