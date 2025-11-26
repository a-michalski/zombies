import { router } from "expo-router";
import { ArrowLeft, FastForward, Heart, Infinity, Pause, Play, Wrench } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BuildMenu } from "@/components/game/BuildMenu";
import { GameMap } from "@/components/game/GameMap";
import { GameOverScreen } from "@/components/game/GameOverScreen";
import { PauseMenu } from "@/components/game/PauseMenu";
import { UpgradeMenu } from "@/components/game/UpgradeMenu";
import { PowerUpBar } from "@/components/game/PowerUpBar";
import { EffectsOverlay } from "@/components/game/EffectsOverlay";
import { MAP_CONFIG, WAYPOINTS, CONSTRUCTION_SPOTS } from "@/constants/gameConfig";
import { Position } from "@/types/game";
import { useGame } from "@/contexts/GameContext";
import { useCampaignContext } from "@/contexts/CampaignContext";
import { useGameEngine } from "@/hooks/useGameEngine";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const { gameState, currentLevel, resetGame, startWave, togglePause, toggleSpeed } = useGame();
  const { completeLevel } = useCampaignContext();

  useGameEngine();

  // Don't reset if level is already loaded (sessionConfig exists)
  // This prevents resetting waypoints when navigating to game screen
  useEffect(() => {
    if (!gameState.sessionConfig) {
      resetGame();
    }
  }, [resetGame, gameState.sessionConfig]);

  /**
   * Handle victory - complete level in campaign context and calculate stars
   */
  useEffect(() => {
    if (gameState.phase === 'victory' && currentLevel) {
      // Calculate stars based on hull integrity
      const hullPercent = (gameState.hullIntegrity / currentLevel.mapConfig.startingResources.hullIntegrity) * 100;

      let stars = 1; // Default: completed

      // Check 2-star requirement
      const twoStarReq = currentLevel.starRequirements.twoStars;
      if (twoStarReq.type === 'hull_remaining' && hullPercent >= twoStarReq.minHullPercent) {
        stars = 2;
      }

      // Check 3-star requirement
      const threeStarReq = currentLevel.starRequirements.threeStars;
      if (threeStarReq.type === 'hull_remaining' && hullPercent >= threeStarReq.minHullPercent) {
        stars = 3;
      } else if (threeStarReq.type === 'perfect' && gameState.hullIntegrity === currentLevel.mapConfig.startingResources.hullIntegrity) {
        stars = 3;
      }

      // Complete level in campaign context
      completeLevel(currentLevel.id, stars, {
        zombiesKilled: gameState.stats.zombiesKilled,
        wavesCompleted: gameState.currentWave,
        finalHullIntegrity: gameState.hullIntegrity,
        timeTaken: 0, // TODO: Add timer
        scrapEarned: gameState.scrap,
      });
    }
  }, [gameState.phase, currentLevel, gameState.hullIntegrity, gameState.stats.zombiesKilled, gameState.currentWave, gameState.scrap, completeLevel]);

  const mapWidth = MAP_CONFIG.WIDTH * MAP_CONFIG.TILE_SIZE;
  const mapHeight = MAP_CONFIG.HEIGHT * MAP_CONFIG.TILE_SIZE;

  const scale = Math.min(
    (SCREEN_WIDTH - 32) / mapWidth,
    (SCREEN_HEIGHT - 200 - insets.top - insets.bottom) / mapHeight
  );

  // Get dynamic data from level or use defaults
  // Use gameState.sessionConfig to ensure consistency with game engine
  const activeLevel = gameState.sessionConfig?.currentLevel || currentLevel;
  const waypoints = (activeLevel?.mapConfig.waypoints || WAYPOINTS) as Position[];
  const constructionSpots = activeLevel?.mapConfig.constructionSpots;
  const maxHullIntegrity = activeLevel?.mapConfig.startingResources.hullIntegrity || 20;
  const totalWaves = activeLevel?.mapConfig.waves.length || 10;

  return (
    <View style={styles.container}>
      {/* Stats Panel - Top Left Corner */}
      <View style={[styles.statsPanel, { top: insets.top + 16 }]}>
        <View style={styles.statRow}>
          <Heart size={18} color="#FF4444" fill="#FF4444" />
          <Text style={styles.statValue}>
            {gameState.hullIntegrity}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Wrench size={18} color="#FFD700" fill="#FFD700" />
          <Text style={styles.statValue}>
            {gameState.scrap}
          </Text>
        </View>
        <View style={styles.waveRow}>
          {activeLevel ? (
            <Text style={styles.waveText}>
              WAVE {gameState.currentWave}/{totalWaves}
            </Text>
          ) : (
            <View style={styles.endlessWaveContainer}>
              <Infinity size={14} color="#FFFFFF" />
              <Text style={styles.waveText}>WAVE {gameState.currentWave}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Controls - Top Right Corner */}
      <View style={[styles.topControls, { top: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={togglePause}
            activeOpacity={0.7}
          >
            {gameState.isPaused ? (
              <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Pause size={20} color="#FFFFFF" fill="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, gameState.gameSpeed === 2 && styles.controlButtonActive]}
            onPress={toggleSpeed}
            activeOpacity={0.7}
          >
            <FastForward size={20} color="#FFFFFF" />
            <Text style={styles.speedText}>{gameState.gameSpeed}x</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.mapContainer,
            {
              transform: [{ scale }],
            },
          ]}
        >
          <GameMap
            waypoints={waypoints}
            constructionSpots={constructionSpots}
          />
        </View>
      </ScrollView>

      {/* Power-Ups Bar - always visible during gameplay, right side */}
      {(gameState.phase === "playing" || gameState.phase === "between_waves") && (
        <PowerUpBar />
      )}

      {/* Start Wave Overlay - Center Screen */}
      {gameState.phase === "between_waves" && (
        <View style={styles.startWaveOverlay}>
          <View style={styles.startWavePanel}>
            <Text style={styles.startWaveTitle}>Ready for Next Wave?</Text>
            <Text style={styles.startWaveBonus}>+15 🔩 Bonus</Text>
            <TouchableOpacity
              style={styles.startWaveButton}
              onPress={() => startWave(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Start next wave and earn 15 scrap bonus"
            >
              <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.startWaveButtonText}>Start Wave</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <BuildMenu />
      <UpgradeMenu />
      <PauseMenu />
      <GameOverScreen />
      <EffectsOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  statsPanel: {
    position: "absolute" as const,
    top: 16,
    left: 16,
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: "#444444",
    zIndex: 100,
    minWidth: 140,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
      },
      default: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
      },
    }),
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800" as const,
  },
  waveRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#444444",
  },
  waveText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800" as const,
    letterSpacing: 1,
  },
  endlessWaveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  topControls: {
    position: "absolute" as const,
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 100,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#444444",
  },
  footerWaveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  controls: {
    flexDirection: "row",
    gap: 8,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#444444",
  },
  controlButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  speedText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700" as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  mapContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    backgroundColor: "#222222",
    borderTopWidth: 2,
    borderTopColor: "#333333",
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: "center",
    gap: 12,
  },
  footerText: {
    color: "#AAAAAA",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  startWaveOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },
  startWavePanel: {
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#444444",
    minWidth: 280,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
      },
      default: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 12,
      },
    }),
  },
  startWaveTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800" as const,
    marginBottom: 8,
    textAlign: "center",
  },
  startWaveBonus: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 20,
    textAlign: "center",
  },
  startWaveButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  startWaveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800" as const,
  },
});
