import { ArrowUp, DollarSign, X } from "lucide-react-native";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { LOOKOUT_POST } from "@/constants/towers";
import { useGame } from "@/contexts/GameContext";

export function UpgradeMenu() {
  const { gameState, upgradeTower, sellTower, selectTower } = useGame();

  const tower = gameState.towers.find((t) => t.id === gameState.selectedTowerId);

  if (!tower) return null;

  const currentStats = LOOKOUT_POST.levels[tower.level - 1];
  const nextStats = tower.level < 3 ? LOOKOUT_POST.levels[tower.level] : null;
  const canUpgrade = nextStats && gameState.scrap >= (nextStats.upgradeCost || 0);

  const currentDps = (currentStats.damage * currentStats.fireRate).toFixed(1);
  const nextDps = nextStats ? (nextStats.damage * nextStats.fireRate).toFixed(1) : null;

  let invested = LOOKOUT_POST.buildCost;
  for (let i = 1; i < tower.level; i++) {
    const levelCost = LOOKOUT_POST.levels[i].upgradeCost;
    if (levelCost) invested += levelCost;
  }
  const sellValue = Math.floor(invested * LOOKOUT_POST.sellValueModifier);

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={() => selectTower(null)}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => selectTower(null)}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {LOOKOUT_POST.name} - Level {tower.level}
            </Text>
            <TouchableOpacity
              onPress={() => selectTower(null)}
              style={styles.closeButton}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Current Stats</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Damage:</Text>
                <Text style={styles.statValue}>{currentStats.damage}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Range:</Text>
                <Text style={styles.statValue}>{currentStats.range.toFixed(1)}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Fire Rate:</Text>
                <Text style={styles.statValue}>{currentStats.fireRate.toFixed(1)}/s</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>DPS:</Text>
                <Text style={styles.statValue}>{currentDps}</Text>
              </View>
            </View>

            {nextStats && (
              <>
                <Text style={styles.sectionTitle}>Upgrade to Level {tower.level + 1}</Text>
                <View style={styles.upgradeContainer}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Damage:</Text>
                    <Text style={styles.upgradeValue}>
                      {currentStats.damage} → {nextStats.damage}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Range:</Text>
                    <Text style={styles.upgradeValue}>
                      {currentStats.range.toFixed(1)} → {nextStats.range.toFixed(1)}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Fire Rate:</Text>
                    <Text style={styles.upgradeValue}>
                      {currentStats.fireRate.toFixed(1)} → {nextStats.fireRate.toFixed(1)}/s
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>DPS:</Text>
                    <Text style={styles.upgradeValue}>
                      {currentDps} → {nextDps}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.upgradeButton,
                    !canUpgrade && styles.buttonDisabled,
                  ]}
                  onPress={() => {
                    if (canUpgrade) {
                      upgradeTower(tower.id);
                    }
                  }}
                  disabled={!canUpgrade}
                  activeOpacity={0.7}
                >
                  <ArrowUp size={20} color="#FFFFFF" />
                  <Text style={[styles.upgradeButtonText, !canUpgrade && styles.buttonTextDisabled]}>
                    Upgrade - 🔩 {nextStats.upgradeCost}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {tower.level === 3 && (
              <View style={styles.maxLevelContainer}>
                <Text style={styles.maxLevelText}>⭐ MAX LEVEL ⭐</Text>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.sellButton]}
              onPress={() => sellTower(tower.id)}
              activeOpacity={0.7}
            >
              <DollarSign size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Sell - 🔩 {sellValue}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => selectTower(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Close</Text>
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
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 12,
    marginTop: 8,
  },
  statsContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  upgradeContainer: {
    backgroundColor: "#1a3a1a",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#4CAF50",
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
  upgradeValue: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "700" as const,
  },
  upgradeButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  maxLevelContainer: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  maxLevelText: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: "#1a1a1a",
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  cancelButton: {
    backgroundColor: "#444444",
  },
  sellButton: {
    backgroundColor: "#FF6B6B",
  },
  buttonDisabled: {
    backgroundColor: "#333333",
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  buttonTextDisabled: {
    color: "#666666",
  },
});
