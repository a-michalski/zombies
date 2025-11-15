import { router } from "expo-router";
import { ArrowLeft, Skull, Target, Trophy, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getStats, type GameStats } from "@/utils/storage";

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<GameStats>({
    bestWave: 0,
    totalZombiesKilled: 0,
    totalWavesSurvived: 0,
    gamesPlayed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const loadedStats = await getStats();
      setStats(loadedStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const averageWavesPerGame =
    stats.gamesPlayed > 0
      ? (stats.totalWavesSurvived / stats.gamesPlayed).toFixed(1)
      : "0.0";

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
        <View style={styles.headerContent}>
          <Trophy size={24} color="#FFD700" />
          <Text style={styles.headerTitle}>Statistics</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Performance</Text>

          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Trophy size={24} color="#FFD700" />
              <Text style={styles.statCardTitle}>Best Wave</Text>
            </View>
            <Text style={styles.statCardValue}>{stats.bestWave}</Text>
            <Text style={styles.statCardLabel}>Highest wave survived</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Combat Stats</Text>

          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Skull size={24} color="#FF4444" />
              <Text style={styles.statCardTitle}>Total Zombies Killed</Text>
            </View>
            <Text style={styles.statCardValue}>{stats.totalZombiesKilled.toLocaleString()}</Text>
            <Text style={styles.statCardLabel}>Eliminated enemies</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Target size={24} color="#4CAF50" />
              <Text style={styles.statCardTitle}>Total Waves Survived</Text>
            </View>
            <Text style={styles.statCardValue}>{stats.totalWavesSurvived}</Text>
            <Text style={styles.statCardLabel}>Waves completed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game History</Text>

          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Zap size={24} color="#4A90E2" />
              <Text style={styles.statCardTitle}>Games Played</Text>
            </View>
            <Text style={styles.statCardValue}>{stats.gamesPlayed}</Text>
            <Text style={styles.statCardLabel}>
              Average: {averageWavesPerGame} waves per game
            </Text>
          </View>
        </View>

        {stats.gamesPlayed === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No statistics yet. Play a game to see your stats!
            </Text>
          </View>
        )}
      </ScrollView>
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
    width: 40,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#444444",
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  statCardTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  statCardValue: {
    fontSize: 32,
    fontWeight: "900" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 14,
    color: "#AAAAAA",
    fontWeight: "600" as const,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    lineHeight: 24,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

