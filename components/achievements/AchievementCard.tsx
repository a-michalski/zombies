/**
 * Achievement Card Component
 * Displays individual achievement with progress, status, and rewards
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Trophy, Lock, CheckCircle, Skull, Sparkles } from 'lucide-react-native';
import { THEME } from '@/constants/ui/theme';
import type { AchievementWithProgress } from '@/types/gamification';

export interface AchievementCardProps {
  achievement: AchievementWithProgress;
  onPress?: () => void;
}

/**
 * Get icon emoji based on achievement category
 */
const getCategoryEmoji = (category: string): string => {
  switch (category) {
    case 'combat':
      return '💀';
    case 'progression':
      return '🏆';
    case 'special':
      return '⭐';
    default:
      return '🎯';
  }
};

/**
 * Get category color based on achievement type
 */
const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'combat':
      return '#FF4444'; // Red for combat
    case 'progression':
      return '#FFD700'; // Gold for progression
    case 'special':
      return '#9B59B6'; // Purple for special
    default:
      return THEME.colors.primary;
  }
};

/**
 * Format reward text
 */
const getRewardText = (achievement: AchievementWithProgress): string => {
  if (!achievement.reward_type) {
    return '';
  }

  switch (achievement.reward_type) {
    case 'scrap':
      return `+${achievement.reward_value?.amount || 0} Scrap 🔩`;
    case 'skin':
      return `Unlock: ${achievement.reward_value?.name || 'New Skin'}`;
    case 'flag':
      return `Unlock: ${achievement.reward_value?.name || 'New Flag'}`;
    case 'badge':
      return `Badge: ${achievement.reward_value?.name || 'Special Badge'}`;
    default:
      return 'Reward';
  }
};

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onPress,
}) => {
  const progress = achievement.progress;
  const isCompleted = progress?.completed || false;
  const isInProgress = progress && !isCompleted && progress.progress > 0;
  const isLocked = !progress || progress.progress === 0;

  // Calculate progress percentage
  const progressPercentage = progress
    ? Math.min((progress.progress / achievement.requirement_value) * 100, 100)
    : 0;

  const categoryColor = getCategoryColor(achievement.category);
  const categoryEmoji = getCategoryEmoji(achievement.category);

  // Format completed date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const CardContent = () => (
    <View
      style={[
        styles.card,
        isCompleted && styles.cardCompleted,
        isLocked && styles.cardLocked,
      ]}
    >
      {/* Category indicator */}
      <View style={[styles.categoryBar, { backgroundColor: categoryColor }]} />

      <View style={styles.cardContent}>
        {/* Icon/Status Section */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: categoryColor + '20' }]}>
            {isCompleted ? (
              <CheckCircle size={28} color={THEME.colors.success} fill={THEME.colors.success} />
            ) : isLocked ? (
              <Lock size={28} color={THEME.colors.text.disabled} />
            ) : (
              <Text style={styles.categoryEmoji}>{categoryEmoji}</Text>
            )}
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Title */}
          <Text
            style={[
              styles.title,
              isLocked && styles.titleLocked,
              isCompleted && styles.titleCompleted,
            ]}
            numberOfLines={2}
          >
            {achievement.name}
          </Text>

          {/* Description */}
          <Text
            style={[styles.description, isLocked && styles.descriptionLocked]}
            numberOfLines={2}
          >
            {achievement.description}
          </Text>

          {/* Progress Bar (for in-progress achievements) */}
          {isInProgress && (
            <View style={styles.progressSection}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progressPercentage}%`,
                      backgroundColor: categoryColor,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {progress?.progress || 0} / {achievement.requirement_value}
              </Text>
            </View>
          )}

          {/* Reward Display */}
          {getRewardText(achievement) && (
            <View style={styles.rewardContainer}>
              <Sparkles size={14} color={THEME.colors.star.filled} />
              <Text style={styles.rewardText}>{getRewardText(achievement)}</Text>
            </View>
          )}

          {/* Completed Date */}
          {isCompleted && progress?.completed_at && (
            <Text style={styles.completedDate}>
              Unlocked {formatDate(progress.completed_at)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  // If onPress is provided, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border.default,
    marginBottom: THEME.spacing.md,
    overflow: 'hidden',
    ...THEME.shadows.sm,
  },
  cardCompleted: {
    borderColor: THEME.colors.success + '40',
  },
  cardLocked: {
    opacity: 0.7,
  },
  categoryBar: {
    height: 4,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    padding: THEME.spacing.md,
  },
  iconContainer: {
    marginRight: THEME.spacing.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: {
    fontSize: 28,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  titleLocked: {
    color: THEME.colors.text.tertiary,
  },
  titleCompleted: {
    color: THEME.colors.success,
  },
  description: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.xs,
    lineHeight: 20,
  },
  descriptionLocked: {
    color: THEME.colors.text.disabled,
  },
  progressSection: {
    marginTop: THEME.spacing.xs,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: THEME.colors.border.default,
    borderRadius: THEME.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: THEME.spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: THEME.borderRadius.sm,
  },
  progressText: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.tertiary,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing.xs,
    gap: THEME.spacing.xs,
  },
  rewardText: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.star.filled,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  completedDate: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.tertiary,
    marginTop: THEME.spacing.xs,
    fontStyle: 'italic',
  },
});
