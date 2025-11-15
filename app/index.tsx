import { router } from "expo-router";
import { Settings, Skull, Trophy } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function MainMenu() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.background}>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Skull size={64} color="#FF4444" strokeWidth={2.5} />
            <Text style={styles.title}>ZOMBIE FLEET</Text>
            <Text style={styles.subtitle}>BASTION PROTOTYPE</Text>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push("/game" as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>START GAME</Text>
          </TouchableOpacity>

          <View style={styles.menuButtons}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => router.push("/stats" as any)}
              activeOpacity={0.7}
            >
              <Trophy size={20} color="#FFD700" />
              <Text style={styles.menuButtonText}>Statistics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => router.push("/settings" as any)}
              activeOpacity={0.7}
            >
              <Settings size={20} color="#FFFFFF" />
              <Text style={styles.menuButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.version}>v2.0 MVP</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  title: {
    fontSize: 42,
    fontWeight: "900" as const,
    color: "#FFFFFF",
    marginTop: 24,
    letterSpacing: 2,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#888888",
    marginTop: 8,
    letterSpacing: 4,
  },
  startButton: {
    backgroundColor: "#FF4444",
    paddingHorizontal: 64,
    paddingVertical: 20,
    borderRadius: 12,
    shadowColor: "#FF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  menuButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#222222",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
  },
  menuButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  version: {
    position: "absolute",
    bottom: 32,
    fontSize: 12,
    color: "#555555",
    fontWeight: "600" as const,
  },
});