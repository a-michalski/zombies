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

import LevelCard from '@/components/campaign/LevelCard';
import ProgressBar from '@/components/campaign/ProgressBar';
import { PurchaseModal } from '@/components/campaign/PurchaseModal';
import { THEME } from '@/constants/ui/theme';
import { useCampaignContext } from '@/contexts/CampaignContext';
import { useGame } from '@/contexts/GameContext';
import { usePurchase } from '@/contexts/PurchaseContext';
import { LevelConfig } from '@/types/levels';
import { ENDLESS_MODE } from '@/data/maps/endless';
import { Infinity } from 'lucide-react-native';

export default function LevelsScreen() {
  const router = useRouter();
  const { startCampaignLevel } = useGame();
  const {
    playerProgress,
    availableLevels,
    isLevelUnlocked,
    getLevelProgress,
    getNextLevel,
    calculateTotalStars,
    isLoading,
  } = useCampaignContext();
  const { isLevelPremium, isLevelAccessible } = usePurchase();
  const [showPurchaseModal, setShowPurchaseModal] = React.useState(false);

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

  /**
   * Navigate to game with selected level
   * Starts campaign level and navigates to game screen
   */
  const handleLevelPress = (level: LevelConfig) => {
    // Check if level is locked by progression
    if (!isLevelUnlocked(level.id)) {
      return; // Don't navigate if locked
    }

    // Check if level is premium and not accessible
    if (isLevelPremium(level.id) && !isLevelAccessible(level.id)) {
      setShowPurchaseModal(true);
      return;
    }

    // Start campaign level
    startCampaignLevel(level);

    // Navigate to game
    router.push('/game');
  };

  // Show level details modal (future enhancement)
  const handleLevelLongPress = (level: LevelConfig) => {
    // TODO: Show LevelDetailsModal
    console.log('Long press level:', level.name);
  };

  // Render single level card
  const renderLevelCard = ({ item, index }: { item: LevelConfig; index: number }) => {
    const lockedByProgression = !isLevelUnlocked(item.id);
    const isPremium = isLevelPremium(item.id);
    const isPremiumLocked = isPremium && !isLevelAccessible(item.id);
    const locked = lockedByProgression || isPremiumLocked;
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
        {isPremiumLocked && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>PREMIUM</Text>
          </View>
        )}
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

      {/* Endless Mode Card */}
      <View style={styles.endlessModeSection}>
        <TouchableOpacity
          style={styles.endlessModeCard}
          onPress={() => {
            startCampaignLevel(ENDLESS_MODE);
            router.push('/game');
          }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Endless Survival Mode"
          accessibilityHint="Test your skills in infinite waves with increasing difficulty"
        >
          <View style={styles.endlessModeIconContainer}>
            <Infinity size={48} color="#FFD700" strokeWidth={3} />
          </View>
          <View style={styles.endlessModeContent}>
            <Text style={styles.endlessModeTitle}>ENDLESS SURVIVAL</Text>
            <Text style={styles.endlessModeDescription}>
              Infinite waves • Increasing difficulty • Test your skills!
            </Text>
            <View style={styles.endlessModeBadge}>
              <Text style={styles.endlessModeBadgeText}>FREE</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Campaign Levels Label */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Campaign Levels</Text>
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

      {/* Purchase Modal */}
      <PurchaseModal
        visible={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
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

  // Endless Mode Section
  endlessModeSection: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.background.primary,
  },
  endlessModeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 16,
    padding: THEME.spacing.md,
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  endlessModeIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endlessModeContent: {
    flex: 1,
  },
  endlessModeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 4,
  },
  endlessModeDescription: {
    fontSize: 13,
    color: THEME.colors.text.secondary,
    marginBottom: 8,
  },
  endlessModeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  endlessModeBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    backgroundColor: THEME.colors.background.secondary,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.colors.border.default,
  },
  sectionTitle: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.secondary,
    textTransform: 'uppercase',
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
    position: 'relative',
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    zIndex: 10,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
});
