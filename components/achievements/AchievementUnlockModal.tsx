/**
 * Achievement Unlock Modal
 * Celebration modal that appears when an achievement is unlocked
 * Features animations, confetti effects, and reward display
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Sparkles, Trophy, Gift } from 'lucide-react-native';
import { THEME } from '@/constants/ui/theme';
import type { AchievementUnlocked } from '@/types/gamification';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export interface AchievementUnlockModalProps {
  achievement: AchievementUnlocked | null;
  visible: boolean;
  onClose: () => void;
}

/**
 * Get category emoji and color
 */
const getCategoryInfo = (category: string) => {
  switch (category) {
    case 'combat':
      return { emoji: '💀', color: '#FF4444' };
    case 'progression':
      return { emoji: '🏆', color: '#FFD700' };
    case 'special':
      return { emoji: '⭐', color: '#9B59B6' };
    default:
      return { emoji: '🎯', color: THEME.colors.primary };
  }
};

/**
 * Confetti particle component
 */
const ConfettiParticle: React.FC<{
  delay: number;
  x: number;
  color: string;
}> = ({ delay, x, color }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, SCREEN_HEIGHT],
  });

  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        {
          backgroundColor: color,
          left: x,
          transform: [{ translateY }, { rotate }],
          opacity,
        },
      ]}
    />
  );
};

/**
 * Format reward text
 */
const getRewardText = (achievement: AchievementUnlocked): string => {
  const ach = achievement.achievement;

  if (!ach.reward_type) {
    return 'Achievement Unlocked!';
  }

  switch (ach.reward_type) {
    case 'scrap':
      return `+${ach.reward_value?.amount || 0} SCRAP`;
    case 'skin':
      return `${ach.reward_value?.name || 'New Skin'} Unlocked!`;
    case 'flag':
      return `${ach.reward_value?.name || 'New Flag'} Unlocked!`;
    case 'badge':
      return `${ach.reward_value?.name || 'Badge'} Earned!`;
    default:
      return 'Reward Unlocked!';
  }
};

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  achievement,
  visible,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && achievement) {
      // Reset animations
      scaleAnim.setValue(0);
      glowAnim.setValue(0);

      // Start entrance animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }
  }, [visible, achievement]);

  if (!achievement) {
    return null;
  }

  const { emoji, color } = getCategoryInfo(achievement.achievement.category);
  const rewardText = getRewardText(achievement);

  // Generate confetti particles
  const confettiColors = ['#FFD700', '#FF4444', '#4CAF50', '#4A90E2', '#9B59B6'];
  const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
    delay: i * 50,
    x: Math.random() * SCREEN_WIDTH,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
  }));

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Confetti particles */}
        {confettiParticles.map((particle, index) => (
          <ConfettiParticle
            key={index}
            delay={particle.delay}
            x={particle.x}
            color={particle.color}
          />
        ))}

        <Pressable style={styles.centeredView} onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[
              styles.contentPanel,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Glow effect */}
            <Animated.View
              style={[
                styles.glowCircle,
                {
                  backgroundColor: color,
                  opacity: glowOpacity,
                },
              ]}
            />

            {/* Header sparkles */}
            <View style={styles.headerSparkles}>
              <Sparkles size={24} color={THEME.colors.star.filled} />
              <Text style={styles.headerText}>ACHIEVEMENT UNLOCKED!</Text>
              <Sparkles size={24} color={THEME.colors.star.filled} />
            </View>

            {/* Achievement icon */}
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
              <Text style={styles.achievementEmoji}>{emoji}</Text>
            </View>

            {/* Achievement name */}
            <Text style={styles.achievementName}>{achievement.achievement.name}</Text>

            {/* Achievement description */}
            <Text style={styles.achievementDescription}>
              {achievement.achievement.description}
            </Text>

            {/* Reward section */}
            <View style={styles.rewardSection}>
              <View style={styles.rewardHeader}>
                <Gift size={20} color={color} />
                <Text style={[styles.rewardLabel, { color }]}>YOU EARNED</Text>
              </View>
              <Text style={[styles.rewardText, { color }]}>{rewardText}</Text>
            </View>

            {/* Close button */}
            <Pressable style={[styles.closeButton, { backgroundColor: color }]} onPress={onClose}>
              <Text style={styles.closeButtonText}>AWESOME!</Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Pressable>
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
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: THEME.spacing.lg,
  },
  contentPanel: {
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.border.light,
    ...THEME.shadows.lg,
  },
  glowCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: '30%',
    opacity: 0.3,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
  },
  headerSparkles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
  },
  headerText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.extrabold,
    color: THEME.colors.star.filled,
    letterSpacing: 1,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.lg,
    borderWidth: 3,
    borderColor: THEME.colors.border.light,
  },
  achievementEmoji: {
    fontSize: 64,
  },
  achievementName: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.extrabold,
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.sm,
  },
  achievementDescription: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
    lineHeight: 22,
  },
  rewardSection: {
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    width: '100%',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border.default,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
    marginBottom: THEME.spacing.xs,
  },
  rewardLabel: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.bold,
    letterSpacing: 1,
  },
  rewardText: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.black,
    textAlign: 'center',
  },
  closeButton: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.md,
    width: '100%',
    alignItems: 'center',
    ...THEME.shadows.md,
  },
  closeButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.extrabold,
    color: THEME.colors.text.primary,
    letterSpacing: 1,
  },
  confettiParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
