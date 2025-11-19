import { router } from "expo-router";
import { Home, RotateCcw, Trophy, Skull, ChevronRight, Star } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useGame } from "@/contexts/GameContext";
import { useCampaignContext } from "@/contexts/CampaignContext";
import { updateStatsFromGame } from "@/utils/storage";
import { ALL_LEVELS } from "@/data/maps";

export function GameOverScreen() {
  const { gameState, resetGame } = useGame();
  const { completeLevel } = useCampaignContext();
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

      // Update campaign progress with stars earned
      if (gameState.phase === "victory" && gameState.sessionConfig?.currentLevel) {
        const levelConfig = gameState.sessionConfig.currentLevel;
        const maxHull = levelConfig.mapConfig.startingResources.hullIntegrity;
        const hullPercent = (gameState.hullIntegrity / maxHull) * 100;

        let stars = 1; // 1 star for completion
        if (hullPercent >= (levelConfig.starRequirements.twoStars.type === 'hull_remaining'
            ? levelConfig.starRequirements.twoStars.minHullPercent
            : 0)) {
          stars = 2;
        }
        if (hullPercent >= (levelConfig.starRequirements.threeStars.type === 'hull_remaining'
            ? levelConfig.starRequirements.threeStars.minHullPercent
            : 0)) {
          stars = 3;
        }

        // Call completeLevel with correct signature
        completeLevel(levelConfig.id, stars, {
          zombiesKilled: gameState.stats.zombiesKilled,
          wavesCompleted: gameState.currentWave,
          finalHullIntegrity: hullPercent,
          timeTaken: 0, // TODO: Track game time
          scrapEarned: gameState.scrap,
        });
      }

      statsSavedRef.current = true;
    }
  }, [gameState.phase, gameState.currentWave, gameState.stats.zombiesKilled, gameState.sessionConfig, gameState.hullIntegrity, gameState.scrap, completeLevel]);

  if (gameState.phase !== "victory" && gameState.phase !== "defeat") {
    return null;
  }

  const isVictory = gameState.phase === "victory";
  const currentLevel = gameState.sessionConfig?.currentLevel;

  // Calculate stars earned
  let starsEarned = 0;
  if (isVictory && currentLevel) {
    const maxHull = currentLevel.mapConfig.startingResources.hullIntegrity;
    const hullPercent = (gameState.hullIntegrity / maxHull) * 100;

    starsEarned = 1; // 1 star for completion
    if (hullPercent >= (currentLevel.starRequirements.twoStars.type === 'hull_remaining'
        ? currentLevel.starRequirements.twoStars.minHullPercent
        : 0)) {
      starsEarned = 2;
    }
    if (hullPercent >= (currentLevel.starRequirements.threeStars.type === 'hull_remaining'
        ? currentLevel.starRequirements.threeStars.minHullPercent
        : 0)) {
      starsEarned = 3;
    }
  }

  // Find next level
  const currentLevelIndex = currentLevel
    ? ALL_LEVELS.findIndex(l => l.id === currentLevel.id)
    : -1;
  const nextLevel = currentLevelIndex >= 0 && currentLevelIndex < ALL_LEVELS.length - 1
    ? ALL_LEVELS[currentLevelIndex + 1]
    : null;
  const maxHull = currentLevel?.mapConfig.startingResources.hullIntegrity || 20;

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

          {isVictory && starsEarned > 0 && (
            <View style={styles.starsContainer}>
              {[1, 2, 3].map((starNum) => (
                <Star
                  key={starNum}
                  size={40}
                  color={starNum <= starsEarned ? "#FFD700" : "#444444"}
                  fill={starNum <= starsEarned ? "#FFD700" : "transparent"}
                  strokeWidth={2}
                />
              ))}
            </View>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Hull Integrity:</Text>
              <Text style={styles.statValue}>
                {gameState.hullIntegrity}/{maxHull}
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
            {isVictory && nextLevel && (
              <TouchableOpacity
                style={[styles.button, styles.nextLevelButton]}
                onPress={() => {
                  statsSavedRef.current = false;
                  router.push(`/game?levelId=${nextLevel.id}` as any);
                }}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Next level - ${nextLevel.name}`}
                accessibilityHint="Start the next campaign level"
              >
                <Text style={styles.buttonText}>Next Level</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.playAgainButton]}
              onPress={() => {
                statsSavedRef.current = false;
                resetGame();
              }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Play again"
              accessibilityHint="Restart the current level"
            >
              <RotateCcw size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.menuButton]}
              onPress={() => router.back()}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Main menu"
              accessibilityHint="Return to level selection"
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
    marginBottom: 16,
    textAlign: "center",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    justifyContent: "center",
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
  nextLevelButton: {
    backgroundColor: "#2196F3",
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
