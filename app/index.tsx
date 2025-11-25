/**
 * Main Menu Screen - Zombie Fleet Bastion
 * 
 * Redesigned based on "Bitten: Reclaim the Shore" UI
 * Features:
 * - PLAY button with cyan glow effect
 * - Campaign/Endless toggle
 * - Episode info display
 * - Settings icon in corner
 * 
 * Recent changes (2025-11-25):
 * - Implemented new PlayButton component with glow animation
 * - Added GameModeToggle for Campaign/Endless selection
 * - Redesigned layout to match Bitten-style UI
 */

import { router } from "expo-router";
import { Settings, Trophy } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GameLogo, GameModeToggle, PlayButton } from "@/components/ui";
import type { GameMode } from "@/components/ui";
import { THEME } from "@/constants/ui/theme";
import { useGame } from "@/contexts/GameContext";
import { ENDLESS_MODE } from "@/data/maps/endless";
import { hasMainMenuBackground, UI_IMAGES } from "@/utils/imageAssets";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const IS_LANDSCAPE = SCREEN_WIDTH > SCREEN_HEIGHT;

export default function MainMenu() {
  const insets = useSafeAreaInsets();
  const { startCampaignLevel } = useGame();
  const hasBackground = hasMainMenuBackground();
  
  // Game mode state
  const [gameMode, setGameMode] = useState<GameMode>("campaign");

  // Handle PLAY button press based on selected mode
  const handlePlay = () => {
    if (gameMode === "campaign") {
      router.push("/levels" as any);
    } else {
      startCampaignLevel(ENDLESS_MODE);
      router.push("/game" as any);
    }
  };

  // Get episode info text based on mode
  const getEpisodeInfo = () => {
    if (gameMode === "campaign") {
      return "Episode 1 — Shoreline Breach";
    }
    return "Survive infinite waves!";
  };

  const content = (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top bar with Settings and Stats */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/stats" as any)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Statistics"
        >
          <Trophy size={24} color={THEME.colors.text.secondary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/settings" as any)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Settings size={24} color={THEME.colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo / Title */}
        <View style={styles.titleContainer}>
          <GameLogo scale={2.0} />
        </View>

        {/* PLAY Button */}
        <View style={styles.playSection}>
          <PlayButton onPress={handlePlay} />
          
          {/* Game Mode Toggle */}
          <View style={styles.toggleContainer}>
            <GameModeToggle
              mode={gameMode}
              onModeChange={setGameMode}
            />
          </View>
          
          {/* Episode Info */}
          <Text style={styles.episodeInfo}>
            {getEpisodeInfo()}
          </Text>
        </View>
      </View>

      {/* Version */}
      <Text style={styles.version}>v2.0 MVP</Text>
    </View>
  );

  return (
    <View style={styles.background}>
      {hasBackground ? (
        <ImageBackground
          source={UI_IMAGES.mainMenuBackground}
          style={styles.imageBackground}
          resizeMode={IS_LANDSCAPE ? "cover" : "contain"}
          imageStyle={styles.imageStyle}
        >
          {content}
        </ImageBackground>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: THEME.colors.background.primary,
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  imageStyle: {
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    borderColor: THEME.colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  playSection: {
    alignItems: "center",
    gap: 2,
  },
  toggleContainer: {
    marginTop: 2,
  },
  episodeInfo: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME.colors.text.tertiary,
    letterSpacing: 1,
    marginTop: 2,
    textAlign: "center",
    ...Platform.select({
      web: {
        textShadow: "1px 1px 4px rgba(0, 0, 0, 0.8)",
      },
      default: {
        textShadowColor: "#000000",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
      },
    }),
  },
  version: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    fontSize: 12,
    color: THEME.colors.text.disabled,
    fontWeight: "600",
  },
});
