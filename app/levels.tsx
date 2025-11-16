/**
 * Level Select Screen - Campaign level selection
 *
 * Created: 2025-11-16 (PHASE-009)
 *
 * Route: /levels
 *
 * Features:
 * - Display all 10 campaign levels in 2-column grid
 * - Show progress bar (total stars earned)
 * - Highlight next level to play
 * - Navigate to game on level select
 * - Integration with CampaignContext
 */

import { useRouter } from 'expo-router';
import { ArrowLeft, BarChart } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LevelCard } from '@/components/campaign/LevelCard';
import { ProgressBar } from '@/components/campaign/ProgressBar';
import { THEME } from '@/constants/ui/theme';
import { useCampaignContext } from '@/contexts/CampaignContext';
import { LevelConfig } from '@/types/levels';

export default function LevelsScreen() {
  const router = useRouter();
  const {
    playerProgress,
    availableLevels,
    isLevelUnlocked,
    getLevelProgress,
    getNextLevel,
    calculateTotalStars,
    isLoading,
  } = useCampaignContext();

  // Calculate stats
  const totalStars = useMemo(() => calculateTotalStars(), [playerProgress]);
  const maxStars = availableLevels.length * 3; // 10 levels × 3 stars = 30

  // Find next level to play
  const nextLevel = useMemo(() => {
    // Find first unlocked but not completed level
    const firstIncomplete = availableLevels.find((level) => {
      const unlocked = isLevelUnlocked(level.id);
      const progress = getLevelProgress(level.id);
      return unlocked && (!progress || !progress.completed);
    });
    return firstIncomplete || null;
  }, [availableLevels, playerProgress]);

  // Navigate to game with selected level
  const handleLevelPress = (level: LevelConfig) => {
    // Store selected level (we'll handle this in game integration)
    // For now, just navigate to game
    router.push('/game');
  };

  // Show level details modal (future enhancement)
  const handleLevelLongPress = (level: LevelConfig) => {
    // TODO: Show LevelDetailsModal
    console.log('Long press level:', level.name);
  };

  // Render single level card
  const renderLevelCard = ({ item, index }: { item: LevelConfig; index: number }) => {
    const locked = !isLevelUnlocked(item.id);
    const progress = getLevelProgress(item.id);
    const isNext = nextLevel?.id === item.id;

    return (
      <View style={styles.cardWrapper}>
        <LevelCard
          level={item}
          progress={progress}
          locked={locked}
          isNext={isNext}
          onPress={() => handleLevelPress(item)}
          onLongPress={() => handleLevelLongPress(item)}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Campaign...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={THEME.colors.text.primary} />
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>CAMPAIGN</Text>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/stats')}
        >
          <BarChart size={24} color={THEME.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Campaign Info Section */}
      <View style={styles.campaignInfo}>
        <Text style={styles.campaignTitle}>Main Campaign</Text>
        <ProgressBar
          current={totalStars}
          total={maxStars}
          showLabel={true}
          animated={true}
          style={styles.progressBar}
        />
      </View>

      {/* Level Grid */}
      <FlatList
        data={availableLevels}
        renderItem={renderLevelCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background.primary,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: THEME.typography.fontSize.lg,
    color: THEME.colors.text.secondary,
  },

  // Header
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border.default,
    backgroundColor: THEME.colors.background.secondary,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
    padding: THEME.spacing.sm,
  },
  headerButtonText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  headerTitle: {
    fontSize: THEME.typography.fontSize.xl,
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.bold,
  },

  // Campaign Info
  campaignInfo: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border.default,
  },
  campaignTitle: {
    fontSize: THEME.typography.fontSize.lg,
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.bold,
    marginBottom: THEME.spacing.sm,
  },
  progressBar: {
    marginTop: THEME.spacing.xs,
  },

  // Level Grid
  listContent: {
    padding: THEME.spacing.md,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
  },
  cardWrapper: {
    // Cards are 160px wide, gap between columns
    width: '48%', // Slightly less than 50% for gap
  },
});
