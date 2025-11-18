import { X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { LOOKOUT_POST, CANNON_TOWER } from "@/constants/towers";
import { useGame } from "@/contexts/GameContext";

type TowerType = "tower_lookout_post" | "tower_cannon";

export function BuildMenu() {
  const { gameState, buildTower, selectSpot } = useGame();
  const [selectedTowerType, setSelectedTowerType] = useState<TowerType>("tower_lookout_post");

  if (!gameState.selectedSpotId) return null;

  const towerConfig = selectedTowerType === "tower_cannon" ? CANNON_TOWER : LOOKOUT_POST;
  const canAfford = gameState.scrap >= towerConfig.buildCost;
  const level1Stats = towerConfig.levels[0];
  const dps = (level1Stats.damage * level1Stats.fireRate).toFixed(1);

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={() => selectSpot(null)}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => selectSpot(null)}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Build Tower</Text>
            <TouchableOpacity
              onPress={() => selectSpot(null)}
              style={styles.closeButton}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Tower Type Selection */}
          <View style={styles.towerTypeContainer}>
            <TouchableOpacity
              style={[
                styles.towerTypeButton,
                selectedTowerType === "tower_lookout_post" && styles.towerTypeButtonActive,
              ]}
              onPress={() => setSelectedTowerType("tower_lookout_post")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.towerTypeText,
                  selectedTowerType === "tower_lookout_post" && styles.towerTypeTextActive,
                ]}
              >
                Lookout Post
              </Text>
              <Text style={styles.towerTypeCost}>🔩 {LOOKOUT_POST.buildCost}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.towerTypeButton,
                selectedTowerType === "tower_cannon" && styles.towerTypeButtonActive,
              ]}
              onPress={() => setSelectedTowerType("tower_cannon")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.towerTypeText,
                  selectedTowerType === "tower_cannon" && styles.towerTypeTextActive,
                ]}
              >
                Cannon Tower
              </Text>
              <Text style={styles.towerTypeCost}>🔩 {CANNON_TOWER.buildCost}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.towerName}>{towerConfig.name}</Text>
            <Text style={styles.description}>{towerConfig.description}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Damage:</Text>
                <Text style={styles.statValue}>{level1Stats.damage}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Range:</Text>
                <Text style={styles.statValue}>{level1Stats.range.toFixed(1)}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Fire Rate:</Text>
                <Text style={styles.statValue}>{level1Stats.fireRate.toFixed(1)}/s</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>DPS:</Text>
                <Text style={styles.statValue}>{dps}</Text>
              </View>
              {selectedTowerType === "tower_cannon" && (
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Type:</Text>
                  <Text style={[styles.statValue, { color: "#FF8800" }]}>AOE (radius 1.0)</Text>
                </View>
              )}
            </View>

            <View style={styles.costContainer}>
              <Text style={styles.costLabel}>Cost:</Text>
              <Text style={[styles.costValue, !canAfford && styles.costValueInsufficient]}>
                🔩 {towerConfig.buildCost}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => selectSpot(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.buildButton,
                !canAfford && styles.buttonDisabled,
              ]}
              onPress={() => {
                if (canAfford && gameState.selectedSpotId) {
                  const spotId = gameState.selectedSpotId;
                  buildTower(spotId, selectedTowerType);
                  selectSpot(null); // Close menu after building
                  if (__DEV__) {
                    console.log("Building tower at spot:", spotId, "type:", selectedTowerType);
                  }
                }
              }}
              disabled={!canAfford}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, !canAfford && styles.buttonTextDisabled]}>
                Build
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: "#444444",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#444444",
  },
  title: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  towerTypeContainer: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 0,
    gap: 12,
  },
  towerTypeButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: "#333333",
    alignItems: "center",
  },
  towerTypeButtonActive: {
    borderColor: "#4A90E2",
    backgroundColor: "#2a3a4a",
  },
  towerTypeText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#AAAAAA",
    marginBottom: 4,
  },
  towerTypeTextActive: {
    color: "#4A90E2",
  },
  towerTypeCost: {
    fontSize: 12,
    color: "#666666",
  },
  content: {
    padding: 20,
  },
  towerName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#4A90E2",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 20,
    lineHeight: 20,
  },
  statsContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#AAAAAA",
    fontWeight: "600" as const,
  },
  statValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700" as const,
  },
  costContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 16,
  },
  costLabel: {
    fontSize: 16,
    color: "#AAAAAA",
    fontWeight: "600" as const,
  },
  costValue: {
    fontSize: 18,
    color: "#FFD700",
    fontWeight: "800" as const,
  },
  costValueInsufficient: {
    color: "#FF4444",
  },
  actions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#444444",
  },
  buildButton: {
    backgroundColor: "#4A90E2",
  },
  buttonDisabled: {
    backgroundColor: "#333333",
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  buttonTextDisabled: {
    color: "#666666",
  },
});
