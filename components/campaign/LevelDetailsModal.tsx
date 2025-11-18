import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { X, Play, Lock, Star } from 'lucide-react-native';
import { THEME } from '@/constants/ui/theme';
import DifficultyBadge from './DifficultyBadge';
import type { LevelConfig } from '@/types/levels';
import type { LevelProgress } from '@/types/progression';

export interface LevelDetailsModalProps {
  visible: boolean;
  level: LevelConfig | null;
  playerProgress: LevelProgress | null; // null if not completed
  isUnlocked: boolean;
  onStart: () => void;
  onClose: () => void;
}

export const LevelDetailsModal: React.FC<LevelDetailsModalProps> = ({
  visible,
  level,
  playerProgress,
  isUnlocked,
  onStart,
  onClose,
}) => {
  if (!level) {
    return null;
  }

  // Extract star requirements for display
  const getStarRequirementText = (requirement: any, starNumber: number): string => {
    if (starNumber === 1) {
      return 'Complete all waves';
    }

    if (starNumber === 2) {
      if (requirement.type === 'hull_remaining') {
        return `Keep hull above ${requirement.minHullPercent}%`;
      }
      if (requirement.type === 'time_limit') {
        const mins = Math.floor(requirement.maxSeconds / 60);
        const secs = requirement.maxSeconds % 60;
        return `Complete in ${mins}:${secs.toString().padStart(2, '0')}`;
      }
    }

    if (starNumber === 3) {
      if (requirement.type === 'hull_remaining') {
        return `Keep hull above ${requirement.minHullPercent}%`;
      }
      if (requirement.type === 'max_towers') {
        return `Use max ${requirement.maxTowers} towers`;
      }
      if (requirement.type === 'perfect') {
        return requirement.description;
      }
    }

    return 'Complete objective';
  };

  const starRequirements = [
    getStarRequirementText(level.starRequirements.oneStar, 1),
    getStarRequirementText(level.starRequirements.twoStars, 2),
    getStarRequirementText(level.starRequirements.threeStars, 3),
  ];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.contentPanel} onPress={(e) => e.stopPropagation()}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Close button */}
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color={THEME.colors.text.secondary} />
            </Pressable>

            {/* Title section */}
            <Text style={styles.title}>
              Level {level.number}: {level.name}
            </Text>

            {/* Difficulty badge */}
            <View style={styles.difficultyContainer}>
              <DifficultyBadge difficulty={level.difficulty} size="medium" showIcon />
            </View>

            {/* Description */}
            <Text style={styles.description}>{level.description}</Text>

            {/* Star requirements section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Star Requirements:</Text>
              {starRequirements.map((req, index) => (
                <View key={index} style={styles.objectiveRow}>
                  <Star
                    size={16}
                    color={THEME.colors.star.filled}
                    fill={
                      playerProgress && playerProgress.starsEarned > index
                        ? THEME.colors.star.filled
                        : 'transparent'
                    }
                  />
                  <Text style={styles.objectiveText}>{req}</Text>
                </View>
              ))}
            </View>

            {/* Level stats section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Level Info:</Text>
              <View style={styles.statsContainer}>
                <Text style={styles.statText}>• Waves: {level.mapConfig.waves.length}</Text>
                <Text style={styles.statText}>
                  • Starting Scrap: {level.mapConfig.startingScrap} 🔩
                </Text>
                <Text style={styles.statText}>
                  • Construction Spots: {level.mapConfig.constructionSpots.length}
                </Text>
                <Text style={styles.statText}>
                  • Waypoints: {level.mapConfig.waypoints.length}
                </Text>
              </View>
            </View>

            {/* Player progress (if level completed) */}
            {playerProgress && playerProgress.completed && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Best:</Text>
                <View style={styles.statsContainer}>
                  <Text style={styles.statText}>
                    • Stars Earned: {playerProgress.starsEarned}/3 ⭐
                  </Text>
                  <Text style={styles.statText}>• Best Score: {playerProgress.bestScore}</Text>
                  <Text style={styles.statText}>
                    • Times Played: {playerProgress.timesPlayed}
                  </Text>
                </View>
              </View>
            )}

            {/* Action buttons */}
            <View style={styles.buttonsContainer}>
              {/* Start/Locked button */}
              <Pressable
                style={({ pressed }) => [
                  styles.startButton,
                  !isUnlocked && styles.lockedButton,
                  pressed && isUnlocked && styles.buttonPressed,
                ]}
                onPress={onStart}
                disabled={!isUnlocked}
              >
                {isUnlocked ? (
                  <>
                    <Play size={20} color={THEME.colors.text.primary} fill={THEME.colors.text.primary} />
                    <Text style={styles.startButtonText}>
                      {playerProgress?.completed ? 'Play Again' : 'Start Level'}
                    </Text>
                  </>
                ) : (
                  <>
                    <Lock size={20} color={THEME.colors.text.disabled} />
                    <Text style={styles.lockedButtonText}>Complete Previous Level</Text>
                  </>
                )}
              </Pressable>

              {/* Cancel button */}
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: THEME.colors.overlay.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentPanel: {
    width: '90%',
    maxWidth: 600,
    maxHeight: '80%',
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: THEME.colors.border.light,
    ...THEME.shadows.lg,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
  },
  closeButton: {
    position: 'absolute',
    top: THEME.spacing.lg,
    right: THEME.spacing.lg,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.extrabold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    paddingRight: 44, // Space for close button
  },
  difficultyContainer: {
    marginBottom: THEME.spacing.md,
  },
  description: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.normal,
    color: THEME.colors.text.tertiary,
    lineHeight: 20,
    marginBottom: THEME.spacing.lg,
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  objectiveText: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.secondary,
  },
  statsContainer: {
    gap: THEME.spacing.xs,
  },
  statText: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.secondary,
  },
  buttonsContainer: {
    gap: THEME.spacing.md,
    marginTop: THEME.spacing.sm,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.success,
    height: THEME.touchTarget.recommended,
    borderRadius: THEME.borderRadius.md,
    ...THEME.shadows.success,
  },
  lockedButton: {
    backgroundColor: THEME.colors.border.default,
    ...THEME.shadows.none,
  },
  startButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },
  lockedButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.disabled,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: THEME.colors.border.light,
    height: THEME.touchTarget.recommended,
    borderRadius: THEME.borderRadius.md,
  },
  cancelButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
