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
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Lock, Play } from 'lucide-react-native';
import { THEME } from '@/constants/ui/theme';
import { LevelConfig } from '@/types/levels';
import { LevelProgress } from '@/types/progression';
import StarRating from './StarRating';
import DifficultyBadge from './DifficultyBadge';

export interface LevelCardProps {
  level: LevelConfig;
  progress: LevelProgress | null;
  locked: boolean;
  isNext?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
}

export default function LevelCard({
  level,
  progress,
  locked,
  isNext = false,
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

  // Button configuration based on state
  const getButtonConfig = () => {
    if (locked) {
      return {
        text: 'LOCKED',
        backgroundColor: THEME.colors.border.default,
        textColor: THEME.colors.text.disabled,
        showIcon: false,
      };
    }
    if (isCompleted) {
      return {
        text: 'REPLAY',
        backgroundColor: THEME.colors.background.tertiary,
        textColor: THEME.colors.text.primary,
        showIcon: true,
      };
    }
    return {
      text: 'PLAY',
      backgroundColor: THEME.colors.success,
      textColor: THEME.colors.text.primary,
      showIcon: true,
    };
  };

  const buttonConfig = getButtonConfig();

  // Border color based on state
  const borderColor = isNext
    ? THEME.colors.star.filled
    : isCompleted && starsEarned === 3
      ? THEME.colors.success
      : THEME.colors.border.default;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor },
        locked && styles.containerLocked,
        style,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={locked}
      activeOpacity={0.7}
      accessibilityLabel={`${level.name} - ${locked ? 'Locked' : 'Unlocked'}`}
      accessibilityRole="button"
    >
      {/* Thumbnail Area */}
      <View style={styles.thumbnail}>
        {/* Level number placeholder */}
        <Text style={[styles.thumbnailNumber, locked && styles.thumbnailNumberLocked]}>
          {level.number}
        </Text>

        {/* Difficulty Badge - absolute positioned */}
        <View style={styles.difficultyBadgeContainer}>
          <DifficultyBadge difficulty={level.difficulty} size="small" />
        </View>

        {/* Lock icon overlay for locked levels */}
        {locked && (
          <View style={styles.lockOverlay}>
            <Lock size={32} color={THEME.colors.text.disabled} strokeWidth={2} />
          </View>
        )}
      </View>

      {/* Level Info Section */}
      <View style={styles.infoSection}>
        {/* Level number label */}
        <Text style={[styles.levelNumber, locked && styles.levelNumberLocked]}>
          Level {level.number}
        </Text>

        {/* Level name */}
        <Text
          style={[styles.levelName, locked && styles.levelNameLocked]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {level.name}
        </Text>

        {/* Level description */}
        <Text
          style={[styles.levelDescription, locked && styles.levelDescriptionLocked]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {level.description}
        </Text>

        {/* Star Rating (if completed) or Lock Icon (if locked) */}
        {isCompleted && !locked ? (
          <View style={styles.starsContainer}>
            <StarRating stars={starsEarned} size="small" />
          </View>
        ) : locked ? (
          <View style={styles.lockedIndicator}>
            <Lock size={16} color={THEME.colors.text.disabled} />
            <Text style={styles.lockedText}>LOCKED</Text>
          </View>
        ) : (
          <View style={styles.starsContainer}>
            {/* Show empty stars for unlocked but not completed */}
            <StarRating stars={0} size="small" />
          </View>
        )}

        {/* Action Button */}
        <View
          style={[
            styles.button,
            { backgroundColor: buttonConfig.backgroundColor },
            isCompleted && !locked && styles.buttonCompleted,
          ]}
        >
          <View style={styles.buttonContent}>
            {buttonConfig.showIcon && (
              <Play
                size={16}
                color={buttonConfig.textColor}
                fill={buttonConfig.textColor}
                style={styles.buttonIcon}
              />
            )}
            <Text style={[styles.buttonText, { color: buttonConfig.textColor }]}>
              {buttonConfig.text}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 200,
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
    ...THEME.shadows.md,
  },
  containerLocked: {
    opacity: 0.6,
  },

  // Thumbnail Section
  thumbnail: {
    height: 100,
    backgroundColor: THEME.colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnailNumber: {
    fontSize: 48,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.text.primary,
    opacity: 0.3,
  },
  thumbnailNumberLocked: {
    opacity: 0.15,
  },
  difficultyBadgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    ...THEME.shadows.sm,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // Info Section
  infoSection: {
    flex: 1,
    padding: THEME.spacing.sm,
    justifyContent: 'space-between',
  },
  levelNumber: {
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: THEME.typography.fontWeight.normal,
    color: THEME.colors.text.secondary,
    marginBottom: 2,
  },
  levelNumberLocked: {
    color: THEME.colors.text.disabled,
  },
  levelName: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  levelNameLocked: {
    color: THEME.colors.text.disabled,
  },
  levelDescription: {
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: THEME.typography.fontWeight.normal,
    color: THEME.colors.text.tertiary,
    lineHeight: 16,
    marginBottom: THEME.spacing.xs,
  },
  levelDescriptionLocked: {
    color: THEME.colors.text.disabled,
  },

  // Stars Section
  starsContainer: {
    alignItems: 'center',
    marginVertical: THEME.spacing.xs,
  },

  // Locked Indicator
  lockedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginVertical: THEME.spacing.xs,
  },
  lockedText: {
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.disabled,
    textTransform: 'uppercase',
  },

  // Action Button
  button: {
    height: THEME.touchTarget.recommended,
    borderRadius: THEME.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCompleted: {
    borderWidth: 1,
    borderColor: THEME.colors.border.light,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
});
