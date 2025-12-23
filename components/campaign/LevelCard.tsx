/**
 * LevelCard - Campaign level selection card component
 *
 * Created: 2025-11-16 (PHASE-008)
 *
 * Displays a single level with thumbnail, difficulty, stars, and action button.
 * Supports three states: locked, unlocked, and completed.
 *
 * Props:
 * - level: LevelConfig
 * - progress: LevelProgress | null
 * - locked: boolean
 * - isNext?: boolean (highlight as next level)
 * - onPress?: () => void (start/replay level)
 * - onLongPress?: () => void (show level details)
 * - style?: ViewStyle
 *
 * Usage:
 * <LevelCard
 *   level={LEVEL_01}
 *   progress={{ completed: true, starsEarned: 3, ... }}
 *   locked={false}
 *   onPress={() => console.log('Start level')}
 * />
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '@/constants/ui/theme';
import { CAMPAIGN_DESIGN_SPECS } from '@/constants/campaignDesignSpecs';
import { CAMPAIGN_ICONS } from '@/utils/imageAssets';
import { figmaLetterSpacingToRN } from '@/constants/campaignDesignSpecs';
import { LevelConfig } from '@/types/levels';
import { LevelProgress } from '@/types/progression';
import StarRating from './StarRating';

export interface LevelCardProps {
  level: LevelConfig;
  progress: LevelProgress | null;
  locked: boolean;
  isNext?: boolean;
  isPremium?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
}

export default function LevelCard({
  level,
  progress,
  locked,
  isNext = false,
  isPremium = false,
  onPress,
  onLongPress,
  style,
}: LevelCardProps) {
  // Determine card state
  const isCompleted = progress?.completed || false;
  const starsEarned = progress?.starsEarned || 0;

  // Touch handlers
  const handlePress = () => {
    if (locked) return;
    onPress?.();
  };

  const handleLongPress = () => {
    if (locked) return;
    onLongPress?.();
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={locked}
        activeOpacity={0.7}
        accessibilityLabel={`${level.name} - ${locked ? 'Locked' : 'Unlocked'}`}
        accessibilityRole="button"
      >
        {/* Level Number Circle - Left side */}
        <View style={styles.levelNumberContainer}>
          <LinearGradient
            colors={[
              CAMPAIGN_DESIGN_SPECS.colors.gradient.levelNumber.from,
              CAMPAIGN_DESIGN_SPECS.colors.gradient.levelNumber.to,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.levelNumberCircle}
          >
            <Text style={styles.levelNumberText}>{level.number}</Text>
          </LinearGradient>
        </View>

        {/* Content - Title with Stars, Description */}
        <View style={styles.content}>
          {/* Title Row with Stars */}
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, locked && styles.titleLocked]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {level.name}
            </Text>
            {/* Stars - same row as title */}
            <View style={styles.starsContainer}>
              <StarRating stars={isCompleted ? starsEarned : 0} size="small" />
            </View>
          </View>

          {/* Description */}
          <Text
            style={[styles.description, locked && styles.descriptionLocked]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {level.description}
          </Text>
        </View>

        {/* Bottom Border - 4px */}
        <View style={styles.bottomBorder} />

        {/* Subtle Border Overlay - for non-premium cards */}
        {!isPremium && (
          <View style={styles.subtleBorderOverlay} />
        )}

        {/* Locked Overlay */}
        {locked && (
          <View style={styles.lockedOverlay}>
            <Image
              source={CAMPAIGN_ICONS.lock}
              style={styles.lockIcon}
              resizeMode="contain"
            />
            <Text style={styles.lockedText}>LOCKED</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Premium Badge - Right side */}
      {isPremium && (
        <View style={styles.premiumBadge}>
          <LinearGradient
            colors={[
              CAMPAIGN_DESIGN_SPECS.colors.gradient.premiumBadge.from,
              CAMPAIGN_DESIGN_SPECS.colors.gradient.premiumBadge.via!,
              CAMPAIGN_DESIGN_SPECS.colors.gradient.premiumBadge.to,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.premiumBadgeGradient}
          >
            <Text style={styles.premiumBadgeText}>PREMIUM</Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Container - Pixel perfect from Figma
  container: {
    width: '100%', // Fill parent container
    height: CAMPAIGN_DESIGN_SPECS.dimensions.cardHeight,
    position: 'relative',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: CAMPAIGN_DESIGN_SPECS.colors.background.card,
    borderRadius: CAMPAIGN_DESIGN_SPECS.spacing.cardBorderRadius,
    paddingHorizontal: CAMPAIGN_DESIGN_SPECS.spacing.cardPadding,
    paddingVertical: 0,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.4), 0px 2px 4px -2px rgba(0,0,0,0.4)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
      },
    }),
  },
  subtleBorderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: CAMPAIGN_DESIGN_SPECS.spacing.cardBottomBorder, // Exclude bottom border area
    borderWidth: 1,
    borderColor: CAMPAIGN_DESIGN_SPECS.colors.border.cardSubtle,
    borderRadius: CAMPAIGN_DESIGN_SPECS.spacing.cardBorderRadius,
    pointerEvents: 'none',
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CAMPAIGN_DESIGN_SPECS.spacing.cardBottomBorder,
    backgroundColor: CAMPAIGN_DESIGN_SPECS.colors.border.card,
  },

  // Level Number Circle - Left side
  levelNumberContainer: {
    marginRight: CAMPAIGN_DESIGN_SPECS.spacing.cardGap,
  },
  levelNumberCircle: {
    width: CAMPAIGN_DESIGN_SPECS.dimensions.levelNumberCircle,
    height: CAMPAIGN_DESIGN_SPECS.dimensions.levelNumberCircle,
    borderRadius: CAMPAIGN_DESIGN_SPECS.dimensions.levelNumberCircle / 2,
    borderWidth: 1,
    borderColor: CAMPAIGN_DESIGN_SPECS.colors.border.levelNumber,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.5), inset 0px 2px 4px 0px rgba(255,255,255,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  levelNumberText: {
    fontSize: CAMPAIGN_DESIGN_SPECS.typography.levelName.fontSize,
    fontWeight: CAMPAIGN_DESIGN_SPECS.typography.levelName.fontWeight,
    color: CAMPAIGN_DESIGN_SPECS.colors.text.number,
    textAlign: 'center',
  },

  // Content - Title, Description, Stars
  content: {
    width: 271, // From Figma - exact content width for all cards (prevents overlap with premium badge at 347px)
    justifyContent: 'center',
    height: CAMPAIGN_DESIGN_SPECS.dimensions.cardContentHeight,
    flexShrink: 0, // Prevent shrinking
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Title on left, stars on right
    marginBottom: CAMPAIGN_DESIGN_SPECS.spacing.textGap,
    height: 18, // From Figma
    width: '100%', // Ensure full width
  },
  title: {
    flex: 1,
    minWidth: 0, // Allow text to shrink
    marginRight: CAMPAIGN_DESIGN_SPECS.spacing.textGap, // Gap between title and stars
    fontSize: CAMPAIGN_DESIGN_SPECS.typography.levelName.fontSize,
    fontWeight: CAMPAIGN_DESIGN_SPECS.typography.levelName.fontWeight,
    letterSpacing: figmaLetterSpacingToRN(
      CAMPAIGN_DESIGN_SPECS.typography.levelName.letterSpacing,
      CAMPAIGN_DESIGN_SPECS.typography.levelName.fontSize
    ),
    lineHeight: CAMPAIGN_DESIGN_SPECS.typography.levelName.lineHeight,
    color: CAMPAIGN_DESIGN_SPECS.colors.text.title,
    textTransform: 'uppercase',
  },
  titleLocked: {
    color: CAMPAIGN_DESIGN_SPECS.colors.text.locked,
  },
  description: {
    fontSize: CAMPAIGN_DESIGN_SPECS.typography.levelDescription.fontSize,
    fontWeight: CAMPAIGN_DESIGN_SPECS.typography.levelDescription.fontWeight,
    letterSpacing: figmaLetterSpacingToRN(
      CAMPAIGN_DESIGN_SPECS.typography.levelDescription.letterSpacing,
      CAMPAIGN_DESIGN_SPECS.typography.levelDescription.fontSize
    ),
    lineHeight: CAMPAIGN_DESIGN_SPECS.typography.levelDescription.lineHeight,
    color: CAMPAIGN_DESIGN_SPECS.colors.text.description,
  },
  descriptionLocked: {
    color: CAMPAIGN_DESIGN_SPECS.colors.text.locked,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: CAMPAIGN_DESIGN_SPECS.dimensions.starsGroupWidth,
    height: 16, // From Figma
  },

  // Locked Overlay
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: CAMPAIGN_DESIGN_SPECS.colors.overlay.locked,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: CAMPAIGN_DESIGN_SPECS.spacing.textGap,
  },
  lockIcon: {
    width: CAMPAIGN_DESIGN_SPECS.dimensions.lockIconSize,
    height: CAMPAIGN_DESIGN_SPECS.dimensions.lockIconSize,
  },
  lockedText: {
    fontSize: CAMPAIGN_DESIGN_SPECS.typography.lockedText.fontSize,
    fontWeight: CAMPAIGN_DESIGN_SPECS.typography.lockedText.fontWeight,
    letterSpacing: figmaLetterSpacingToRN(
      CAMPAIGN_DESIGN_SPECS.typography.lockedText.letterSpacing,
      CAMPAIGN_DESIGN_SPECS.typography.lockedText.fontSize
    ),
    lineHeight: CAMPAIGN_DESIGN_SPECS.typography.lockedText.lineHeight,
    color: CAMPAIGN_DESIGN_SPECS.colors.text.locked,
    textTransform: 'uppercase',
  },

  // Premium Badge - Right side
  premiumBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: CAMPAIGN_DESIGN_SPECS.dimensions.premiumBadgeWidth,
    height: CAMPAIGN_DESIGN_SPECS.dimensions.premiumBadgeHeight,
    borderTopRightRadius: CAMPAIGN_DESIGN_SPECS.spacing.cardBorderRadius,
    borderBottomRightRadius: CAMPAIGN_DESIGN_SPECS.spacing.cardBorderRadius,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '-2px 0px 4px 0px rgba(0,0,0,0.3)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  premiumBadgeGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CAMPAIGN_DESIGN_SPECS.colors.border.premium,
  },
  premiumBadgeText: {
    fontSize: CAMPAIGN_DESIGN_SPECS.typography.premiumBadge.fontSize,
    fontWeight: CAMPAIGN_DESIGN_SPECS.typography.premiumBadge.fontWeight,
    letterSpacing: figmaLetterSpacingToRN(
      CAMPAIGN_DESIGN_SPECS.typography.premiumBadge.letterSpacing,
      CAMPAIGN_DESIGN_SPECS.typography.premiumBadge.fontSize
    ),
    lineHeight: CAMPAIGN_DESIGN_SPECS.typography.premiumBadge.lineHeight,
    color: CAMPAIGN_DESIGN_SPECS.colors.text.premium,
    textTransform: 'uppercase',
    transform: [{ rotate: '90deg' }],
    width: CAMPAIGN_DESIGN_SPECS.dimensions.premiumBadgeTextWidth,
    height: CAMPAIGN_DESIGN_SPECS.dimensions.premiumBadgeTextHeight,
    textAlign: 'center',
  },
});
