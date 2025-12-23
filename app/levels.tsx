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
import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import LevelCard from '@/components/campaign/LevelCard';
import ProgressBar from '@/components/campaign/ProgressBar';
import { PurchaseModal } from '@/components/campaign/PurchaseModal';
import { THEME } from '@/constants/ui/theme';
import { CAMPAIGN_DESIGN_SPECS } from '@/constants/campaignDesignSpecs';
import { CAMPAIGN_ICONS, CAMPAIGN_IMAGES } from '@/utils/imageAssets';
import { useCampaignContext } from '@/contexts/CampaignContext';
import { useGame } from '@/contexts/GameContext';
import { usePurchase } from '@/contexts/PurchaseContext';
import { LevelConfig } from '@/types/levels';
import { ENDLESS_MODE } from '@/data/maps/endless';
import { figmaLetterSpacingToRN } from '@/constants/campaignDesignSpecs';

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
  // Note: Design shows 51 stars max, but we calculate based on actual levels
  const displayMaxStars = 51; // From Figma design

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
          isPremium={isPremium}
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
    <SafeAreaView style={styles.container} edges={Platform.OS === 'web' ? [] : ['top']}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <View style={styles.backButtonContent}>
            <Image
              source={CAMPAIGN_ICONS.backArrow}
              style={styles.backButtonIcon}
              resizeMode="contain"
              tintColor={CAMPAIGN_DESIGN_SPECS.colors.text.button}
            />
            <Text style={styles.backButtonText}>Back</Text>
          </View>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>CAMPAIGN</Text>

        {/* Right side: Stars counter, Stats, Settings */}
        <View style={styles.headerRight}>
          {/* Stars Counter */}
          <View style={styles.starsCounter}>
            <Text style={styles.starsCounterText}>
              {totalStars}/{displayMaxStars} Stars
            </Text>
            <Image
              source={CAMPAIGN_ICONS.star}
              style={styles.starIcon}
              resizeMode="contain"
              tintColor={CAMPAIGN_DESIGN_SPECS.colors.text.title}
            />
          </View>

          {/* Stats Button */}
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => router.push('/stats')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="View statistics"
          >
            <Image
              source={CAMPAIGN_ICONS.stats}
              style={styles.headerIcon}
              resizeMode="contain"
              tintColor={CAMPAIGN_DESIGN_SPECS.colors.text.button}
            />
          </TouchableOpacity>

          {/* Settings Button */}
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Image
              source={CAMPAIGN_ICONS.settings}
              style={styles.headerIcon}
              resizeMode="contain"
              tintColor={CAMPAIGN_DESIGN_SPECS.colors.text.button}
            />
          </TouchableOpacity>
        </View>
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

      {/* Endless Mode Section - "TRY SURVIVE" */}
      <View style={styles.endlessModeSection}>
        <Text style={styles.endlessModeSectionTitle}>TRY SURVIVE</Text>
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
          {/* Infinity Icon Container */}
          <View style={styles.endlessModeIconContainer}>
            <View style={styles.endlessModeIconCircle}>
              <Image
                source={CAMPAIGN_ICONS.infinity}
                style={styles.endlessModeIcon}
                resizeMode="contain"
                tintColor={CAMPAIGN_DESIGN_SPECS.colors.text.title}
              />
            </View>
          </View>

          {/* Content */}
          <View style={styles.endlessModeContent}>
            <Text style={styles.endlessModeTitle}>ENDLESS SURVIVAL</Text>
            <Text style={styles.endlessModeDescription}>
              Infinite waves • Increasing difficulty • Test your skills!
            </Text>
          </View>

          {/* Image on the right */}
          <View style={styles.endlessModeImageContainer}>
            <Image
              source={CAMPAIGN_IMAGES.endlessMode}
              style={styles.endlessModeImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={[
                CAMPAIGN_DESIGN_SPECS.colors.gradient.endlessImage.from,
                CAMPAIGN_DESIGN_SPECS.colors.gradient.endlessImage.to,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.endlessModeImageGradient}
            />
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

  // Header - Pixel perfect from Figma
  header: {
    height: CAMPAIGN_DESIGN_SPECS.spacing.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CAMPAIGN_DESIGN_SPECS.spacing.headerPadding,
    paddingTop: 0,
    paddingBottom: 1, // pb-px from Figma
    borderBottomWidth: 1,
    borderBottomColor: CAMPAIGN_DESIGN_SPECS.colors.border.header,
    backgroundColor: CAMPAIGN_DESIGN_SPECS.colors.background.header,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      },
    }),
  },
  backButton: {
    height: CAMPAIGN_DESIGN_SPECS.dimensions.backButtonHeight,
    backgroundColor: CAMPAIGN_DESIGN_SPECS.colors.background.button,
    borderWidth: 1,
    borderColor: CAMPAIGN_DESIGN_SPECS.colors.border.button,
    borderRadius: CAMPAIGN_DESIGN_SPECS.borderRadius.button,
    ...Platform.select({
      web: {
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CAMPAIGN_DESIGN_SPECS.spacing.buttonPaddingX,
    paddingVertical: CAMPAIGN_DESIGN_SPECS.spacing.buttonPaddingY,
    height: '100%',
  },
  backButtonIcon: {
    width: CAMPAIGN_DESIGN_SPECS.dimensions.backButtonIconSize,
    height: CAMPAIGN_DESIGN_SPECS.dimensions.backButtonIconSize,
    marginRight: CAMPAIGN_DESIGN_SPECS.spacing.buttonGap,
  },
  backButtonText: {
    fontSize: CAMPAIGN_DESIGN_SPECS.typography.buttonText.fontSize,
    fontWeight: CAMPAIGN_DESIGN_SPECS.typography.buttonText.fontWeight,
    letterSpacing: figmaLetterSpacingToRN(
      CAMPAIGN_DESIGN_SPECS.typography.buttonText.letterSpacing,
      CAMPAIGN_DESIGN_SPECS.typography.buttonText.fontSize
    ),
    lineHeight: CAMPAIGN_DESIGN_SPECS.typography.buttonText.lineHeight,
    color: CAMPAIGN_DESIGN_SPECS.colors.text.button,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: CAMPAIGN_DESIGN_SPECS.typography.headerTitle.fontSize,
    fontWeight: CAMPAIGN_DESIGN_SPECS.typography.headerTitle.fontWeight,
    letterSpacing: figmaLetterSpacingToRN(
      CAMPAIGN_DESIGN_SPECS.typography.headerTitle.letterSpacing,
      CAMPAIGN_DESIGN_SPECS.typography.headerTitle.fontSize
    ),
    lineHeight: CAMPAIGN_DESIGN_SPECS.typography.headerTitle.lineHeight,
    color: CAMPAIGN_DESIGN_SPECS.colors.text.title,
    textTransform: 'uppercase',
    ...Platform.select({
      web: {
        textShadow: '0px 1px 4px rgba(0,0,0,0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
    }),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    height: CAMPAIGN_DESIGN_SPECS.dimensions.backButtonHeight,
  },
  starsCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
    marginRight: CAMPAIGN_DESIGN_SPECS.spacing.headerGap,
  },
  starsCounterText: {
    fontSize: CAMPAIGN_DESIGN_SPECS.typography.starsCounter.fontSize,
    fontWeight: CAMPAIGN_DESIGN_SPECS.typography.starsCounter.fontWeight,
    lineHeight: CAMPAIGN_DESIGN_SPECS.typography.starsCounter.lineHeight,
    color: CAMPAIGN_DESIGN_SPECS.colors.text.description,
    textTransform: 'uppercase',
  },
  starIcon: {
    width: CAMPAIGN_DESIGN_SPECS.dimensions.starIconSize,
    height: CAMPAIGN_DESIGN_SPECS.dimensions.starIconSize,
    marginLeft: CAMPAIGN_DESIGN_SPECS.spacing.buttonGap,
  },
  headerIconButton: {
    width: CAMPAIGN_DESIGN_SPECS.dimensions.statsSettingsButtonSize,
    height: CAMPAIGN_DESIGN_SPECS.dimensions.statsSettingsButtonSize,
    backgroundColor: CAMPAIGN_DESIGN_SPECS.colors.background.button,
    borderWidth: 1,
    borderColor: CAMPAIGN_DESIGN_SPECS.colors.border.button,
    borderRadius: CAMPAIGN_DESIGN_SPECS.borderRadius.button,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 9,
    paddingBottom: 1,
    paddingHorizontal: 9,
    marginLeft: CAMPAIGN_DESIGN_SPECS.spacing.headerGap,
    ...Platform.select({
      web: {
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  headerIcon: {
    width: CAMPAIGN_DESIGN_SPECS.dimensions.statsSettingsIconSize,
    height: CAMPAIGN_DESIGN_SPECS.dimensions.statsSettingsIconSize,
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

  // Endless Mode Section - Pixel perfect from Figma
  endlessModeSection: {
    paddingHorizontal: CAMPAIGN_DESIGN_SPECS.spacing.containerPadding,
    paddingVertical: CAMPAIGN_DESIGN_SPECS.spacing.containerVerticalPadding,
    backgroundColor: CAMPAIGN_DESIGN_SPECS.colors.background.primary,
    marginBottom: CAMPAIGN_DESIGN_SPECS.spacing.sectionHeaderGap,
  },
  endlessModeSectionTitle: {
    fontSize: CAMPAIGN_DESIGN_SPECS.typography.sectionTitle.fontSize,
    fontWeight: CAMPAIGN_DESIGN_SPECS.typography.sectionTitle.fontWeight,
    letterSpacing: figmaLetterSpacingToRN(
      CAMPAIGN_DESIGN_SPECS.typography.sectionTitle.letterSpacing,
      CAMPAIGN_DESIGN_SPECS.typography.sectionTitle.fontSize
    ),
    lineHeight: CAMPAIGN_DESIGN_SPECS.typography.sectionTitle.lineHeight,
    color: CAMPAIGN_DESIGN_SPECS.colors.text.title,
    textTransform: 'uppercase',
    marginBottom: CAMPAIGN_DESIGN_SPECS.spacing.sectionTitleGap,
  },
  endlessModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: CAMPAIGN_DESIGN_SPECS.dimensions.endlessCardHeight,
    borderWidth: 2,
    borderColor: CAMPAIGN_DESIGN_SPECS.colors.border.endless,
    borderRadius: CAMPAIGN_DESIGN_SPECS.borderRadius.endlessCard,
    backgroundColor: CAMPAIGN_DESIGN_SPECS.colors.background.endlessCard,
    paddingLeft: CAMPAIGN_DESIGN_SPECS.spacing.endlessCardPadding,
    paddingRight: 0,
    paddingVertical: 0,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0px 6px 12px 0px rgba(0,0,0,0.5)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
  },
  endlessModeIconContainer: {
    width: CAMPAIGN_DESIGN_SPECS.dimensions.endlessIconContainer,
    height: CAMPAIGN_DESIGN_SPECS.dimensions.endlessIconContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: CAMPAIGN_DESIGN_SPECS.spacing.endlessCardGap,
  },
  endlessModeIconCircle: {
    width: CAMPAIGN_DESIGN_SPECS.dimensions.endlessIconContainer,
    height: CAMPAIGN_DESIGN_SPECS.dimensions.endlessIconContainer,
    borderRadius: CAMPAIGN_DESIGN_SPECS.borderRadius.endlessIcon,
    borderWidth: 2,
    borderColor: CAMPAIGN_DESIGN_SPECS.colors.border.endless,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 4,
      },
    }),
  },
  endlessModeIcon: {
    width: CAMPAIGN_DESIGN_SPECS.dimensions.endlessIconInner,
    height: CAMPAIGN_DESIGN_SPECS.dimensions.endlessIconInner,
  },
  endlessModeContent: {
    flex: 1,
    justifyContent: 'center',
    height: 38, // From Figma
  },
  endlessModeTitle: {
    fontSize: CAMPAIGN_DESIGN_SPECS.typography.endlessTitle.fontSize,
    fontWeight: CAMPAIGN_DESIGN_SPECS.typography.endlessTitle.fontWeight,
    letterSpacing: figmaLetterSpacingToRN(
      CAMPAIGN_DESIGN_SPECS.typography.endlessTitle.letterSpacing,
      CAMPAIGN_DESIGN_SPECS.typography.endlessTitle.fontSize
    ),
    lineHeight: CAMPAIGN_DESIGN_SPECS.typography.endlessTitle.lineHeight,
    color: CAMPAIGN_DESIGN_SPECS.colors.text.endlessTitle,
    textTransform: 'uppercase',
    marginBottom: CAMPAIGN_DESIGN_SPECS.spacing.textGap,
  },
  endlessModeDescription: {
    fontSize: CAMPAIGN_DESIGN_SPECS.typography.endlessDescription.fontSize,
    fontWeight: CAMPAIGN_DESIGN_SPECS.typography.endlessDescription.fontWeight,
    letterSpacing: CAMPAIGN_DESIGN_SPECS.typography.endlessDescription.letterSpacing,
    lineHeight: CAMPAIGN_DESIGN_SPECS.typography.endlessDescription.lineHeight,
    color: CAMPAIGN_DESIGN_SPECS.colors.text.endlessDesc,
  },
  endlessModeImageContainer: {
    width: CAMPAIGN_DESIGN_SPECS.dimensions.endlessImageWidth,
    height: CAMPAIGN_DESIGN_SPECS.dimensions.endlessImageHeight,
    position: 'relative',
    overflow: 'hidden',
  },
  endlessModeImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  endlessModeImageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    paddingHorizontal: CAMPAIGN_DESIGN_SPECS.spacing.containerPadding,
    paddingVertical: CAMPAIGN_DESIGN_SPECS.spacing.containerVerticalPadding,
  },
  columnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: CAMPAIGN_DESIGN_SPECS.spacing.gridGap,
    width: '100%',
  },
  cardWrapper: {
    // Cards should fill available space in grid with gap between
    flex: 1,
    marginRight: CAMPAIGN_DESIGN_SPECS.spacing.gridGap / 2,
    position: 'relative',
  },
  cardWrapperLast: {
    marginRight: 0, // Remove margin from last card in row
  },
});
