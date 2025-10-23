import { router } from "expo-router";
import { ArrowLeft, FastForward, Heart, Pause, Play } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Dimensions,
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
import { UpgradeMenu } from "@/components/game/UpgradeMenu";
import { MAP_CONFIG } from "@/constants/gameConfig";
import { useGame } from "@/contexts/GameContext";
import { useGameEngine } from "@/hooks/useGameEngine";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const { gameState, resetGame, startWave, togglePause, toggleSpeed } = useGame();

  useGameEngine();

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const mapWidth = MAP_CONFIG.WIDTH * MAP_CONFIG.TILE_SIZE;
  const mapHeight = MAP_CONFIG.HEIGHT * MAP_CONFIG.TILE_SIZE;
  
  const scale = Math.min(
    (SCREEN_WIDTH - 32) / mapWidth,
    (SCREEN_HEIGHT - 200 - insets.top - insets.bottom) / mapHeight
  );

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
          <View style={styles.stat}>
            <Heart size={18} color="#FF4444" fill="#FF4444" />
            <Text style={styles.statText}>
              {gameState.hullIntegrity}/{20}
            </Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.waveText}>
              Wave {gameState.currentWave}/10
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
          <GameMap />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {gameState.phase === "between_waves" && (
          <>
            <Text style={styles.footerText}>
              Auto-start in {Math.ceil(gameState.waveCountdown)}s
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => startWave(true)}
              activeOpacity={0.8}
            >
              <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.startButtonText}>Start Wave (+15 🔩)</Text>
            </TouchableOpacity>
          </>
        )}
        {gameState.phase === "playing" && (
          <Text style={styles.footerText}>Wave {gameState.currentWave} in progress...</Text>
        )}
      </View>

      <BuildMenu />
      <UpgradeMenu />
      <GameOverScreen />
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
