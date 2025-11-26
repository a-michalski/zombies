import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { Trophy, ChevronRight, RotateCcw, ArrowLeft, Skull, CheckCircle, Clock } from 'lucide-react-native';
import { THEME } from '@/constants/ui/theme';
import StarRating from './StarRating';

export interface VictoryScreenStats {
  zombiesKilled: number;
  wavesCompleted: number;
  scrapEarned: number;
  timeSeconds: number;
}

export interface VictoryScreenEnhancedProps {
  visible: boolean;
  levelId: string;
  starsEarned: number; // 0-3
  stats: VictoryScreenStats;
  isLastLevel?: boolean; // Hide "Next Level" if true
  onNextLevel: () => void;
  onReplay: () => void;
  onBackToCampaign: () => void;
}

export const VictoryScreenEnhanced: React.FC<VictoryScreenEnhancedProps> = ({
  visible,
  starsEarned,
  stats,
  isLastLevel = false,
  onNextLevel,
  onReplay,
  onBackToCampaign,
}) => {
  // Animation values - using Reanimated shared values
  const modalOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(50);

  useEffect(() => {
    if (visible) {
      // Reset animations
      modalOpacity.value = 0;
      titleScale.value = 0;
      statsOpacity.value = 0;
      buttonsTranslateY.value = 50;

      // Animation sequence - runs on UI thread
      // 1. Modal fades in
      modalOpacity.value = withTiming(1, { duration: 300 });
      
      // 2. Title appears with spring animation
      titleScale.value = withSpring(1, {
        damping: 8,
        stiffness: 40,
      });

      // 3. Stats fade in after stars complete
      const starsDelay = starsEarned * 500 + 300;
      statsOpacity.value = withDelay(
        starsDelay,
        withTiming(1, { duration: 300 })
      );

      // 4. Buttons slide up after stats
      buttonsTranslateY.value = withDelay(
        starsDelay + 300,
        withTiming(0, { duration: 200 })
      );
    } else {
      // Reset when hidden
      modalOpacity.value = 0;
      titleScale.value = 0;
      statsOpacity.value = 0;
      buttonsTranslateY.value = 50;
    }
  }, [visible, starsEarned, modalOpacity, titleScale, statsOpacity, buttonsTranslateY]);

  // Animated styles
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
  }));

  const contentPanelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalOpacity.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const statsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
        <Animated.View style={[styles.contentPanel, contentPanelAnimatedStyle]}>
          {/* Title with trophy icons */}
          <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
            <Trophy size={32} color={THEME.colors.star.filled} fill={THEME.colors.star.filled} />
            <Text style={styles.title}>VICTORY!</Text>
            <Trophy size={32} color={THEME.colors.star.filled} fill={THEME.colors.star.filled} />
          </Animated.View>

          {/* Animated star rating */}
          <View style={styles.starContainer}>
            <StarRating stars={starsEarned} size="large" animated={visible} />
          </View>

          {/* Stats panel */}
          <Animated.View style={[styles.statsPanel, statsAnimatedStyle]}>
            <View style={styles.statRow}>
              <Skull size={20} color={THEME.colors.danger} />
              <Text style={styles.statLabel}>Zombies Killed:</Text>
              <Text style={styles.statValue}>{stats.zombiesKilled}</Text>
            </View>

            <View style={styles.statRow}>
              <CheckCircle size={20} color={THEME.colors.success} />
              <Text style={styles.statLabel}>Waves Survived:</Text>
              <Text style={styles.statValue}>{stats.wavesCompleted}/10</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.scrapIcon}>🔩</Text>
              <Text style={styles.statLabel}>Scrap Earned:</Text>
              <Text style={[styles.statValue, { color: THEME.colors.scrap }]}>
                {stats.scrapEarned}
              </Text>
            </View>

            <View style={styles.statRow}>
              <Clock size={20} color={THEME.colors.info} />
              <Text style={styles.statLabel}>Time:</Text>
              <Text style={styles.statValue}>{formatTime(stats.timeSeconds)}</Text>
            </View>
          </Animated.View>

          {/* Action buttons */}
          <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
            {/* Next Level button (if not last level) */}
            {!isLastLevel && (
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onNextLevel}
              >
                <Text style={styles.primaryButtonText}>Next Level</Text>
                <ChevronRight size={20} color={THEME.colors.text.primary} />
              </Pressable>
            )}

            {/* Replay and Back buttons */}
            <View style={styles.secondaryButtonsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onReplay}
              >
                <RotateCcw size={20} color={THEME.colors.text.primary} />
                <Text style={styles.secondaryButtonText}>Replay</Text>
              </Pressable>
            </View>

            {/* Back to Campaign button */}
            <Pressable
              style={({ pressed }) => [
                styles.tertiaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onBackToCampaign}
            >
              <ArrowLeft size={20} color={THEME.colors.text.primary} />
              <Text style={styles.tertiaryButtonText}>Back to Campaign</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: THEME.colors.overlay.darker,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentPanel: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: THEME.colors.success,
    padding: THEME.spacing.xl,
    ...THEME.shadows.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.success,
    textAlign: 'center',
  },
  starContainer: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  statsPanel: {
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    gap: THEME.spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  scrapIcon: {
    fontSize: 20,
    width: 20,
    textAlign: 'center',
  },
  statLabel: {
    flex: 1,
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.secondary,
  },
  statValue: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },
  buttonsContainer: {
    gap: THEME.spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.primary,
    height: THEME.touchTarget.recommended,
    borderRadius: THEME.borderRadius.md,
    ...THEME.shadows.primary,
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.border.light,
    height: THEME.touchTarget.recommended,
    borderRadius: THEME.borderRadius.md,
    ...THEME.shadows.sm,
  },
  tertiaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: THEME.colors.border.light,
    height: THEME.touchTarget.recommended,
    borderRadius: THEME.borderRadius.md,
  },
  primaryButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },
  secondaryButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },
  tertiaryButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
