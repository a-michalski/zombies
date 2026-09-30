import { router } from "expo-router";
import { ArrowLeft, FastForward, Heart, Pause, Play } from "lucide-react-native";
import React, { useState } from "react";
import {
  LayoutChangeEvent,
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
import { useGame } from "@/contexts/GameContext";
import { useGameEngine } from "@/hooks/useGameEngine";

const MAP_AREA_PADDING = 16;

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const { gameState, mapData, startWave, togglePause, toggleSpeed } = useGame();

  useGameEngine();

  const mapWidth = mapData.grid.width * mapData.grid.tileSize;
  const mapHeight = mapData.grid.height * mapData.grid.tileSize;

  // Measure the area between header and footer, then fit the whole map into it.
  const [mapArea, setMapArea] = useState<{ width: number; height: number } | null>(null);
  const onMapAreaLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setMapArea({ width, height });
  };

  const scale = mapArea
    ? Math.min(
        (mapArea.width - MAP_AREA_PADDING * 2) / mapWidth,
        (mapArea.height - MAP_AREA_PADDING * 2) / mapHeight
      )
    : 0;
  const scaledWidth = mapWidth * scale;
  const scaledHeight = mapHeight * scale;

  // Get dynamic data from the active session (campaign level or classic map)
  const activeLevel = gameState.sessionConfig?.currentLevel ?? null;
  const maxHullIntegrity = activeLevel?.mapConfig.startingResources.hullIntegrity ?? 20;
  const isEndless = activeLevel?.id === "endless";
  const totalWaves = activeLevel ? activeLevel.mapConfig.waves.length : 10;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          {activeLevel && (
            <Text style={styles.levelName}>{activeLevel.name}</Text>
          )}

          <View style={styles.stat}>
            <Heart size={18} color="#FF4444" fill="#FF4444" />
            <Text style={styles.statText}>
              {gameState.hullIntegrity}/{maxHullIntegrity}
            </Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.waveText}>
              {isEndless ? `Wave ${gameState.currentWave}` : `Wave ${gameState.currentWave}/${totalWaves}`}
            </Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statText}>🔩 {gameState.scrap}</Text>
          </View>
        </View>

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

      <View style={styles.mapArea} onLayout={onMapAreaLayout}>
        {mapArea && (
          <View style={{ width: scaledWidth, height: scaledHeight }}>
            <View
              style={{
                width: mapWidth,
                height: mapHeight,
                transform: [
                  { translateX: -(mapWidth - scaledWidth) / 2 },
                  { translateY: -(mapHeight - scaledHeight) / 2 },
                  { scale },
                ],
              }}
            >
              <GameMap />
            </View>
          </View>
        )}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {/* Power-Ups Bar - always visible during gameplay */}
        {(gameState.phase === "playing" || gameState.phase === "between_waves") && (
          <PowerUpBar />
        )}

        {gameState.phase === "between_waves" && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => startWave(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Start next wave and earn 15 scrap bonus"
          >
            <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Wave (+15 🔩)</Text>
          </TouchableOpacity>
        )}
        {gameState.phase === "playing" && (
          <Text style={styles.footerText}>Wave {gameState.currentWave} in progress...</Text>
        )}
      </View>

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#222222",
    borderBottomWidth: 2,
    borderBottomColor: "#333333",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap" as const,
  },
  levelName: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "700" as const,
    marginRight: 8,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700" as const,
  },
  waveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700" as const,
  },
  controls: {
    flexDirection: "row",
    gap: 8,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#333333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  controlButtonActive: {
    backgroundColor: "#4CAF50",
  },
  speedText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700" as const,
  },
  mapArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
  startButton: {
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
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800" as const,
  },
});
