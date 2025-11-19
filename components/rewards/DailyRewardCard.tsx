/**
 * Daily Reward Card Component
 * Created: 2025-11-19
 *
 * Beautiful card component showing daily reward status with:
 * - Current streak display
 * - Today's reward preview
 * - Countdown timer if already claimed
 * - Claim button with animations
 * - Preview of next 7 days
 * - Streak danger warning
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Flame,
  Gift,
  Clock,
  AlertTriangle,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';

import { THEME } from '@/constants/ui/theme';
import { useAuth } from '@/contexts/AuthContext';
import {
  getDailyRewards,
  canClaimDailyReward,
  claimDailyReward,
  getRewardSchedule,
  isStreakInDanger,
} from '@/lib/dailyRewards';
import {
  DailyRewardDefinition,
  DailyRewards,
} from '@/types/gamification';
import { analytics } from '@/lib/analytics';

// ============================================
// TYPES
// ============================================

export interface DailyRewardCardProps {
  userId: string;
  onClaim?: (reward: DailyRewardDefinition) => void;
  onViewFullScreen?: () => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function DailyRewardCard({
  userId,
  onClaim,
  onViewFullScreen,
}: DailyRewardCardProps) {
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [rewards, setRewards] = useState<DailyRewards | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [nextReward, setNextReward] = useState<DailyRewardDefinition | null>(null);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<string>('');
  const [showDangerWarning, setShowDangerWarning] = useState(false);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Load rewards status
  const loadRewards = async () => {
    try {
      setLoading(true);

      const [rewardsResult, claimResult] = await Promise.all([
        getDailyRewards(userId),
        canClaimDailyReward(userId),
      ]);

      if (rewardsResult.success && rewardsResult.rewards) {
        setRewards(rewardsResult.rewards);
        setShowDangerWarning(isStreakInDanger(rewardsResult.rewards.last_claim_date || null));
      }

      setCanClaim(claimResult.canClaim);
      setNextReward(claimResult.nextReward || null);

      analytics.track('daily_reward_shown', {
        user_id: userId,
        can_claim: claimResult.canClaim,
        streak: claimResult.streak,
      });
    } catch (error) {
      console.error('[DailyRewardCard] Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadRewards();
  }, [userId]);

  // Countdown timer update
  useEffect(() => {
    if (!canClaim && rewards?.last_claim_date) {
      const updateTimer = () => {
        const lastClaim = new Date(rewards.last_claim_date + 'T00:00:00');
        const tomorrow = new Date(lastClaim);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const now = new Date();
        const msUntilTomorrow = tomorrow.getTime() - now.getTime();

        if (msUntilTomorrow <= 0) {
          setTimeUntilNextClaim('Available now!');
          // Reload to update claim status
          loadRewards();
        } else {
          const hours = Math.floor(msUntilTomorrow / (1000 * 60 * 60));
          const minutes = Math.floor((msUntilTomorrow % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((msUntilTomorrow % (1000 * 60)) / 1000);
          setTimeUntilNextClaim(
            `${hours}h ${minutes}m ${seconds}s`
          );
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [canClaim, rewards?.last_claim_date]);

  // Pulse animation for claim button
  useEffect(() => {
    if (canClaim) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [canClaim]);

  // Handle claim
  const handleClaim = async () => {
    if (!canClaim || claiming) return;

    try {
      setClaiming(true);

      // Animate button press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Claim reward
      const result = await claimDailyReward(userId);

      if (result.success && result.reward) {
        // Success animation
        Animated.parallel([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          sparkleAnim.setValue(0);
        });

        // Callback
        onClaim?.(result.reward);

        // Reload rewards
        await loadRewards();
      }
    } catch (error) {
      console.error('[DailyRewardCard] Claim error:', error);
    } finally {
      setClaiming(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  const currentStreak = rewards?.current_streak || 0;
  const rewardSchedule = getRewardSchedule();

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      {/* Sparkle overlay for claim animation */}
      <Animated.View
        style={[
          styles.sparkleOverlay,
          {
            opacity: sparkleAnim,
            transform: [
              {
                scale: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 2],
                }),
              },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <Sparkles size={100} color={THEME.colors.star.filled} />
      </Animated.View>

      {/* Header with streak */}
      <View style={styles.header}>
        <View style={styles.streakContainer}>
          <Flame
            size={24}
            color={currentStreak > 0 ? '#FF6B35' : THEME.colors.text.tertiary}
            fill={currentStreak > 0 ? '#FF6B35' : 'transparent'}
          />
          <Text style={styles.streakText}>
            {currentStreak > 0 ? `${currentStreak} Day Streak!` : 'Start Your Streak'}
          </Text>
        </View>

        {/* View full screen button */}
        {onViewFullScreen && (
          <TouchableOpacity
            onPress={onViewFullScreen}
            style={styles.viewMoreButton}
            activeOpacity={0.7}
          >
            <Text style={styles.viewMoreText}>View All</Text>
            <ChevronRight size={16} color={THEME.colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Streak danger warning */}
      {showDangerWarning && canClaim && (
        <View style={styles.warningBanner}>
          <AlertTriangle size={16} color={THEME.colors.warning} />
          <Text style={styles.warningText}>
            Claim soon or lose your {currentStreak}-day streak!
          </Text>
        </View>
      )}

      {/* Today's reward */}
      <View style={styles.mainRewardContainer}>
        <View style={styles.mainRewardBadge}>
          <Gift
            size={48}
            color={nextReward?.special ? THEME.colors.star.filled : THEME.colors.primary}
          />
        </View>

        <View style={styles.mainRewardInfo}>
          <Text style={styles.mainRewardLabel}>
            {canClaim ? "Today's Reward" : 'Next Reward'}
          </Text>
          <View style={styles.mainRewardAmount}>
            <Text style={styles.scrapIcon}>🔩</Text>
            <Text
              style={[
                styles.mainRewardValue,
                nextReward?.special && styles.specialRewardValue,
              ]}
            >
              {nextReward?.reward_amount || 0}
            </Text>
            <Text style={styles.mainRewardUnit}>Scrap</Text>
          </View>
          {nextReward?.special && (
            <View style={styles.specialBadge}>
              <Sparkles size={12} color={THEME.colors.star.filled} />
              <Text style={styles.specialBadgeText}>BONUS</Text>
            </View>
          )}
        </View>
      </View>

      {/* Claim button or countdown */}
      {canClaim ? (
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[
              styles.claimButton,
              claiming && styles.claimButtonDisabled,
            ]}
            onPress={handleClaim}
            disabled={claiming}
            activeOpacity={0.8}
          >
            {claiming ? (
              <ActivityIndicator size="small" color={THEME.colors.text.primary} />
            ) : (
              <>
                <Gift size={20} color={THEME.colors.text.primary} />
                <Text style={styles.claimButtonText}>CLAIM REWARD</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <View style={styles.countdownContainer}>
          <Clock size={20} color={THEME.colors.text.tertiary} />
          <Text style={styles.countdownText}>Come back in {timeUntilNextClaim}</Text>
        </View>
      )}

      {/* Next 7 days preview */}
      <View style={styles.schedulePreview}>
        <Text style={styles.schedulePreviewTitle}>Upcoming Rewards</Text>
        <View style={styles.schedulePreviewGrid}>
          {rewardSchedule.map((reward, index) => {
            const dayNumber = ((currentStreak + index) % rewardSchedule.length) + 1;
            const isToday = index === 0 && canClaim;

            return (
              <View
                key={index}
                style={[
                  styles.schedulePreviewItem,
                  isToday && styles.schedulePreviewItemToday,
                  reward.special && styles.schedulePreviewItemSpecial,
                ]}
              >
                <Text style={styles.schedulePreviewDay}>Day {dayNumber}</Text>
                <View style={styles.schedulePreviewReward}>
                  <Text style={styles.schedulePreviewIcon}>🔩</Text>
                  <Text
                    style={[
                      styles.schedulePreviewAmount,
                      reward.special && styles.schedulePreviewAmountSpecial,
                    ]}
                  >
                    {reward.reward_amount}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: THEME.colors.border.default,
    padding: THEME.spacing.lg,
    ...THEME.shadows.md,
    overflow: 'hidden',
  },
  sparkleOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -50,
    marginTop: -50,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  streakText: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewMoreText: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.primary,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.warning + '20',
    borderRadius: THEME.borderRadius.sm,
    padding: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  warningText: {
    flex: 1,
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.warning,
  },
  mainRewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  mainRewardBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
    borderWidth: 2,
    borderColor: THEME.colors.border.default,
  },
  mainRewardInfo: {
    flex: 1,
  },
  mainRewardLabel: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.tertiary,
    marginBottom: 4,
  },
  mainRewardAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  scrapIcon: {
    fontSize: 20,
  },
  mainRewardValue: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.scrap,
  },
  specialRewardValue: {
    color: THEME.colors.star.filled,
  },
  mainRewardUnit: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.tertiary,
  },
  specialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.star.filled + '20',
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  specialBadgeText: {
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.star.filled,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.success,
    height: THEME.touchTarget.recommended,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.md,
    ...THEME.shadows.success,
  },
  claimButtonDisabled: {
    opacity: 0.6,
  },
  claimButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    letterSpacing: 1,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.background.secondary,
    height: THEME.touchTarget.recommended,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border.default,
    marginBottom: THEME.spacing.md,
  },
  countdownText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.tertiary,
  },
  schedulePreview: {
    marginTop: THEME.spacing.sm,
  },
  schedulePreviewTitle: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.tertiary,
    marginBottom: THEME.spacing.sm,
  },
  schedulePreviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
  },
  schedulePreviewItem: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border.dark,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schedulePreviewItemToday: {
    borderColor: THEME.colors.primary,
    borderWidth: 2,
  },
  schedulePreviewItemSpecial: {
    borderColor: THEME.colors.star.filled,
    borderWidth: 2,
    backgroundColor: THEME.colors.star.filled + '10',
  },
  schedulePreviewDay: {
    fontSize: 8,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.tertiary,
    marginBottom: 2,
  },
  schedulePreviewReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  schedulePreviewIcon: {
    fontSize: 8,
  },
  schedulePreviewAmount: {
    fontSize: 10,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.secondary,
  },
  schedulePreviewAmountSpecial: {
    color: THEME.colors.star.filled,
  },
});
