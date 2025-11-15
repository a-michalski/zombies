import { router } from "expo-router";
import { Home, Play, Settings } from "lucide-react-native";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useGame } from "@/contexts/GameContext";

export function PauseMenu() {
  const { gameState, togglePause } = useGame();

  if (!gameState.isPaused || gameState.phase === "victory" || gameState.phase === "defeat") {
    return null;
  }

  const handleResume = () => {
    togglePause();
  };

  const handleSettings = () => {
    // Navigate to settings - will be implemented
    togglePause();
    router.push("/settings" as any);
  };

  const handleMainMenu = () => {
    togglePause();
    router.back();
  };

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>GAME PAUSED</Text>
          </View>

          <View style={styles.content}>
            <TouchableOpacity
              style={[styles.button, styles.resumeButton]}
              onPress={handleResume}
              activeOpacity={0.8}
            >
              <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.buttonText}>Resume</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.settingsButton]}
              onPress={handleSettings}
              activeOpacity={0.8}
            >
              <Settings size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.menuButton]}
              onPress={handleMainMenu}
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
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: "#444444",
    overflow: "hidden",
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#444444",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900" as const,
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  resumeButton: {
    backgroundColor: "#4CAF50",
  },
  settingsButton: {
    backgroundColor: "#4A90E2",
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

