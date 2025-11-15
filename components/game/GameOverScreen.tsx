import { router } from "expo-router";
import { Home, RotateCcw, Trophy, Skull } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useGame } from "@/contexts/GameContext";
import { updateStatsFromGame } from "@/utils/storage";

export function GameOverScreen() {
  const { gameState, resetGame } = useGame();
  const statsSavedRef = useRef(false);

  useEffect(() => {
    if (
      (gameState.phase === "victory" || gameState.phase === "defeat") &&
      !statsSavedRef.current
    ) {
      const wavesSurvived = gameState.phase === "victory" 
        ? gameState.currentWave 
        : gameState.currentWave - 1;
      
      updateStatsFromGame(
        gameState.currentWave,
        gameState.stats.zombiesKilled,
        wavesSurvived
      );
      statsSavedRef.current = true;
    }
  }, [gameState.phase, gameState.currentWave, gameState.stats.zombiesKilled]);

  if (gameState.phase !== "victory" && gameState.phase !== "defeat") {
    return null;
  }

  const isVictory = gameState.phase === "victory";

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, isVictory ? styles.victoryModal : styles.defeatModal]}>
          <View style={styles.iconContainer}>
            {isVictory ? (
              <Trophy size={80} color="#FFD700" strokeWidth={2.5} />
            ) : (
              <Skull size={80} color="#FF4444" strokeWidth={2.5} />
            )}
          </View>

          <Text style={styles.title}>
            {isVictory ? "VICTORY!" : "BASTION DESTROYED"}
          </Text>

          <Text style={styles.subtitle}>
            {isVictory
              ? "All waves survived!"
              : `Survived ${gameState.currentWave - 1}/10 waves`}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Hull Integrity:</Text>
              <Text style={styles.statValue}>
                {gameState.hullIntegrity}/20
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Scrap Remaining:</Text>
              <Text style={styles.statValue}>{gameState.scrap}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Zombies Killed:</Text>
              <Text style={styles.statValue}>
                {gameState.stats.zombiesKilled}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.playAgainButton]}
              onPress={() => {
                statsSavedRef.current = false;
                resetGame();
              }}
              activeOpacity={0.8}
            >
              <RotateCcw size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.menuButton]}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Home size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Main Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    padding: 32,
    alignItems: "center",
    borderWidth: 3,
  },
  victoryModal: {
    backgroundColor: "#1a3a1a",
    borderColor: "#4CAF50",
  },
  defeatModal: {
    backgroundColor: "#3a1a1a",
    borderColor: "#FF4444",
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "900" as const,
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#AAAAAA",
    marginBottom: 32,
    textAlign: "center",
  },
  statsContainer: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    color: "#AAAAAA",
    fontWeight: "600" as const,
  },
  statValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700" as const,
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  playAgainButton: {
    backgroundColor: "#4CAF50",
  },
  menuButton: {
    backgroundColor: "#444444",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#FFFFFF",
  },
});
