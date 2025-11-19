/**
 * Reward Claim Success Modal
 * Created: 2025-11-19
 *
 * Beautiful modal shown after successfully claiming a daily reward
 * Features animated confetti and reward details
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Gift, Flame, Sparkles, X } from 'lucide-react-native';

import { THEME } from '@/constants/ui/theme';
import { DailyRewardDefinition } from '@/types/gamification';

// ============================================
// TYPES
// ============================================

export interface RewardClaimModalProps {
  visible: boolean;
  onClose: () => void;
  reward: DailyRewardDefinition;
  newStreak: number;
  streakBroken?: boolean;
}

// ============================================
// CONFETTI PARTICLE
// ============================================

interface ConfettiParticle {
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
}

const CONFETTI_COLORS = [
  THEME.colors.star.filled,
  THEME.colors.success,
  THEME.colors.primary,
  THEME.colors.warning,
  '#FF6B35',
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// MAIN COMPONENT
// ============================================

export function RewardClaimModal({
  visible,
  onClose,
  reward,
  newStreak,
  streakBroken,
}: RewardClaimModalProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const giftRotateAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  // Confetti particles
  const confettiParticles = useRef<ConfettiParticle[]>([]);

  // Initialize confetti particles
  useEffect(() => {
    confettiParticles.current = Array.from({ length: 30 }, () => ({
      x: new Animated.Value(SCREEN_WIDTH / 2),
      y: new Animated.Value(SCREEN_HEIGHT / 2),
      rotation: new Animated.Value(0),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }));
  }, []);

  // Entrance animation
  useEffect(() => {
    if (visible) {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0);
      giftRotateAnim.setValue(0);
      sparkleAnim.setValue(0);

      confettiParticles.current.forEach(particle => {
        particle.x.setValue(SCREEN_WIDTH / 2);
        particle.y.setValue(SCREEN_HEIGHT / 2 - 50);
        particle.rotation.setValue(0);
      });

      // Animation sequence
      Animated.parallel([
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Scale in
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        // Gift rotation
        Animated.sequence([
          Animated.timing(giftRotateAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(giftRotateAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        // Sparkle animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(sparkleAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(sparkleAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();

      // Confetti explosion
      confettiParticles.current.forEach((particle, index) => {
        const angle = (index / confettiParticles.current.length) * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        const targetX = SCREEN_WIDTH / 2 + Math.cos(angle) * distance;
        const targetY = SCREEN_HEIGHT / 2 - 50 + Math.sin(angle) * distance;

        Animated.parallel([
          Animated.timing(particle.x, {
            toValue: targetX,
            duration: 1000 + Math.random() * 500,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: targetY + SCREEN_HEIGHT,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.rotation, {
            toValue: 360 * (3 + Math.random() * 3),
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [visible]);

  const giftRotation = giftRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '20deg'],
  });

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        {/* Confetti */}
        {confettiParticles.current.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.confettiParticle,
              {
                backgroundColor: particle.color,
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y },
                  {
                    rotate: particle.rotation.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={24} color={THEME.colors.text.secondary} />
          </TouchableOpacity>

          {/* Gift Icon with animation */}
          <Animated.View
            style={[
              styles.giftContainer,
              {
                transform: [{ rotate: giftRotation }],
              },
            ]}
          >
            <Gift
              size={80}
              color={reward.special ? THEME.colors.star.filled : THEME.colors.success}
              strokeWidth={2}
            />

            {/* Sparkles */}
            <Animated.View
              style={[
                styles.sparkle,
                styles.sparkleTopLeft,
                {
                  opacity: sparkleAnim,
                  transform: [
                    {
                      scale: sparkleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Sparkles size={24} color={THEME.colors.star.filled} />
            </Animated.View>

            <Animated.View
              style={[
                styles.sparkle,
                styles.sparkleTopRight,
                {
                  opacity: sparkleAnim,
                  transform: [
                    {
                      scale: sparkleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Sparkles size={24} color={THEME.colors.star.filled} />
            </Animated.View>
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>Reward Claimed!</Text>

          {/* Reward Amount */}
          <View style={styles.rewardAmount}>
            <Text style={styles.scrapIcon}>🔩</Text>
            <Text
              style={[styles.rewardValue, reward.special && styles.rewardValueSpecial]}
            >
              +{reward.reward_amount}
            </Text>
            <Text style={styles.rewardUnit}>Scrap</Text>
          </View>

          {reward.special && (
            <View style={styles.bonusBadge}>
              <Sparkles size={16} color={THEME.colors.star.filled} />
              <Text style={styles.bonusBadgeText}>BONUS REWARD!</Text>
            </View>
          )}

          {/* Streak Info */}
          <View style={styles.streakInfo}>
            <Flame
              size={32}
              color="#FF6B35"
              fill="#FF6B35"
            />
            <View style={styles.streakTextContainer}>
              <Text style={styles.streakValue}>{newStreak} Day Streak</Text>
              {streakBroken ? (
                <Text style={styles.streakBroken}>Streak reset - starting fresh!</Text>
              ) : (
                <Text style={styles.streakMessage}>
                  {newStreak === 1
                    ? 'Great start! Come back tomorrow!'
                    : `Amazing! Keep it up!`}
                </Text>
              )}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>AWESOME!</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: THEME.colors.overlay.darker,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiParticle: {
    position: 'absolute',
    width: 8,
    height: 12,
    borderRadius: 2,
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 2,
    borderColor: THEME.colors.success,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    ...THEME.shadows.lg,
  },
  closeButton: {
    position: 'absolute',
    top: THEME.spacing.md,
    right: THEME.spacing.md,
    zIndex: 10,
    padding: THEME.spacing.xs,
  },
  giftContainer: {
    marginBottom: THEME.spacing.lg,
    position: 'relative',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleTopLeft: {
    top: -10,
    left: -10,
  },
  sparkleTopRight: {
    top: -10,
    right: -10,
  },
  title: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.success,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  rewardAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: THEME.spacing.md,
  },
  scrapIcon: {
    fontSize: 40,
  },
  rewardValue: {
    fontSize: 56,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.scrap,
  },
  rewardValueSpecial: {
    color: THEME.colors.star.filled,
  },
  rewardUnit: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.tertiary,
  },
  bonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.star.filled,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.round,
    marginBottom: THEME.spacing.lg,
  },
  bonusBadgeText: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.inverse,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    width: '100%',
  },
  streakTextContainer: {
    flex: 1,
  },
  streakValue: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginBottom: 4,
  },
  streakMessage: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.tertiary,
  },
  streakBroken: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.warning,
  },
  continueButton: {
    backgroundColor: THEME.colors.success,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    width: '100%',
    alignItems: 'center',
    ...THEME.shadows.success,
  },
  continueButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    letterSpacing: 1,
  },
});
