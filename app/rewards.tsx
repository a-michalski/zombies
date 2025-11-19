/**
 * Daily Rewards Full Screen
 * Created: 2025-11-19
 *
 * Full rewards screen showing:
 * - Current streak banner
 * - Calendar view of claimed days
 * - Full reward schedule
 * - Longest streak stat
 * - Total rewards claimed stat
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import {
  ArrowLeft,
  Flame,
  Gift,
  Trophy,
  Calendar,
  TrendingUp,
  Sparkles,
  Award,
  CheckCircle,
} from 'lucide-react-native';

import { THEME } from '@/constants/ui/theme';
import { useAuth } from '@/contexts/AuthContext';
import {
  getDailyRewards,
  canClaimDailyReward,
  claimDailyReward,
  getRewardSchedule,
} from '@/lib/dailyRewards';
import {
  DailyRewardDefinition,
  DailyRewards,
} from '@/types/gamification';
import { analytics } from '@/lib/analytics';

// ============================================
// MAIN COMPONENT
// ============================================

export default function RewardsScreen() {
  const { user, isAuthenticated, isGuest } = useAuth();

  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [rewards, setRewards] = useState<DailyRewards | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [nextReward, setNextReward] = useState<DailyRewardDefinition | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const claimButtonScale = useRef(new Animated.Value(1)).current;

  // Load rewards
  const loadRewards = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const [rewardsResult, claimResult] = await Promise.all([
        getDailyRewards(user.id),
        canClaimDailyReward(user.id),
      ]);

      if (rewardsResult.success && rewardsResult.rewards) {
        setRewards(rewardsResult.rewards);
      }

      setCanClaim(claimResult.canClaim);
      setNextReward(claimResult.nextReward || null);

      analytics.screen('rewards_screen', {
        can_claim: claimResult.canClaim,
        streak: claimResult.streak,
      });
    } catch (error) {
      console.error('[RewardsScreen] Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadRewards();
  }, [user]);

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Pulse animation for claim button
  useEffect(() => {
    if (canClaim) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(claimButtonScale, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(claimButtonScale, {
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
    if (!canClaim || claiming || !user) return;

    try {
      setClaiming(true);

      const result = await claimDailyReward(user.id);

      if (result.success && result.reward) {
        // Success animation
        Animated.parallel([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(claimButtonScale, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(claimButtonScale, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          sparkleAnim.setValue(0);
        });

        // Show success message
        if (Platform.OS === 'web') {
          alert(
            `Reward Claimed!\n\n🔩 +${result.reward.reward_amount} Scrap\n🔥 ${result.new_streak} Day Streak`
          );
        } else {
          Alert.alert(
            'Reward Claimed!',
            `🔩 +${result.reward.reward_amount} Scrap\n🔥 ${result.new_streak} Day Streak`,
            [{ text: 'Awesome!', style: 'default' }]
          );
        }

        // Reload rewards
        await loadRewards();
      }
    } catch (error) {
      console.error('[RewardsScreen] Claim error:', error);
    } finally {
      setClaiming(false);
    }
  };

  // Redirect guest users
  if (isGuest) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Daily Rewards',
            headerShown: true,
          }}
        />
        <View style={styles.guestContainer}>
          <Gift size={64} color={THEME.colors.text.tertiary} />
          <Text style={styles.guestTitle}>Login Required</Text>
          <Text style={styles.guestMessage}>
            Create an account to claim daily rewards and build your streak!
          </Text>
          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => router.push('/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.guestButtonText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Daily Rewards',
            headerShown: true,
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Loading rewards...</Text>
        </View>
      </View>
    );
  }

  const currentStreak = rewards?.current_streak || 0;
  const longestStreak = rewards?.longest_streak || 0;
  const totalClaimed = rewards?.total_rewards_claimed || 0;
  const rewardSchedule = getRewardSchedule();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Daily Rewards',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={THEME.colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
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
            <Sparkles size={150} color={THEME.colors.star.filled} />
          </Animated.View>

          {/* Current Streak Banner */}
          <View style={styles.streakBanner}>
            <View style={styles.streakBannerContent}>
              <Flame
                size={48}
                color={currentStreak > 0 ? '#FF6B35' : THEME.colors.text.tertiary}
                fill={currentStreak > 0 ? '#FF6B35' : 'transparent'}
              />
              <View style={styles.streakBannerText}>
                <Text style={styles.streakBannerLabel}>Current Streak</Text>
                <Text style={styles.streakBannerValue}>
                  {currentStreak > 0 ? `${currentStreak} Days` : 'Not Started'}
                </Text>
              </View>
            </View>
          </View>

          {/* Claim Section */}
          {nextReward && (
            <View style={styles.claimSection}>
              <Text style={styles.sectionTitle}>
                {canClaim ? "Today's Reward" : 'Next Reward'}
              </Text>

              <View style={styles.rewardCard}>
                <View
                  style={[
                    styles.rewardCardBadge,
                    nextReward.special && styles.rewardCardBadgeSpecial,
                  ]}
                >
                  <Gift
                    size={64}
                    color={
                      nextReward.special
                        ? THEME.colors.star.filled
                        : THEME.colors.primary
                    }
                  />
                  {nextReward.special && (
                    <View style={styles.specialBadge}>
                      <Sparkles size={12} color={THEME.colors.star.filled} />
                      <Text style={styles.specialBadgeText}>BONUS</Text>
                    </View>
                  )}
                </View>

                <View style={styles.rewardCardInfo}>
                  <View style={styles.rewardAmount}>
                    <Text style={styles.scrapIcon}>🔩</Text>
                    <Text
                      style={[
                        styles.rewardValue,
                        nextReward.special && styles.rewardValueSpecial,
                      ]}
                    >
                      {nextReward.reward_amount}
                    </Text>
                    <Text style={styles.rewardUnit}>Scrap</Text>
                  </View>

                  {canClaim ? (
                    <Animated.View style={{ transform: [{ scale: claimButtonScale }] }}>
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
                          <ActivityIndicator
                            size="small"
                            color={THEME.colors.text.primary}
                          />
                        ) : (
                          <>
                            <Gift size={20} color={THEME.colors.text.primary} />
                            <Text style={styles.claimButtonText}>CLAIM REWARD</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </Animated.View>
                  ) : (
                    <View style={styles.claimedBadge}>
                      <CheckCircle size={20} color={THEME.colors.success} />
                      <Text style={styles.claimedText}>Already Claimed Today</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Trophy size={32} color={THEME.colors.star.filled} />
              </View>
              <Text style={styles.statValue}>{longestStreak}</Text>
              <Text style={styles.statLabel}>Longest Streak</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Award size={32} color={THEME.colors.success} />
              </View>
              <Text style={styles.statValue}>{totalClaimed}</Text>
              <Text style={styles.statLabel}>Total Claimed</Text>
            </View>
          </View>

          {/* Reward Schedule */}
          <View style={styles.scheduleSection}>
            <View style={styles.sectionHeader}>
              <Calendar size={24} color={THEME.colors.primary} />
              <Text style={styles.sectionTitle}>Reward Schedule</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Rewards cycle every 7 days. Build your streak to maximize earnings!
            </Text>

            <View style={styles.scheduleGrid}>
              {rewardSchedule.map((reward, index) => (
                <View
                  key={index}
                  style={[
                    styles.scheduleCard,
                    reward.special && styles.scheduleCardSpecial,
                  ]}
                >
                  <View style={styles.scheduleDayBadge}>
                    <Text style={styles.scheduleDayText}>Day {reward.day}</Text>
                  </View>

                  <View style={styles.scheduleRewardInfo}>
                    <Text style={styles.scheduleRewardIcon}>🔩</Text>
                    <Text
                      style={[
                        styles.scheduleRewardAmount,
                        reward.special && styles.scheduleRewardAmountSpecial,
                      ]}
                    >
                      {reward.reward_amount}
                    </Text>
                  </View>

                  {reward.special && (
                    <View style={styles.scheduleSpecialBadge}>
                      <Sparkles size={12} color={THEME.colors.star.filled} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Streak Tips */}
          <View style={styles.tipsSection}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={24} color={THEME.colors.info} />
              <Text style={styles.sectionTitle}>Streak Tips</Text>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                🔥 Claim your reward every day to maintain your streak
              </Text>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                ⏰ You have until midnight to claim today's reward
              </Text>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                ⭐ Special bonus rewards on days 3 and 7!
              </Text>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                🎯 Missing a day will reset your streak to day 1
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background.primary,
  },
  backButton: {
    padding: THEME.spacing.sm,
    marginLeft: THEME.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  loadingText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.tertiary,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  guestTitle: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  guestMessage: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    lineHeight: THEME.typography.fontSize.md * THEME.typography.lineHeight.relaxed,
    marginBottom: THEME.spacing.xl,
  },
  guestButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    ...THEME.shadows.primary,
  },
  guestButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    letterSpacing: 1,
  },
  sparkleOverlay: {
    position: 'absolute',
    top: 100,
    left: '50%',
    marginLeft: -75,
    zIndex: 100,
  },
  streakBanner: {
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: THEME.colors.border.light,
    padding: THEME.spacing.xl,
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.md,
  },
  streakBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.lg,
  },
  streakBannerText: {
    flex: 1,
  },
  streakBannerLabel: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.tertiary,
    marginBottom: 4,
  },
  streakBannerValue: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.text.primary,
  },
  claimSection: {
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  sectionSubtitle: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.tertiary,
    marginBottom: THEME.spacing.md,
    lineHeight: THEME.typography.fontSize.sm * THEME.typography.lineHeight.normal,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  rewardCard: {
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: THEME.colors.border.default,
    padding: THEME.spacing.xl,
    ...THEME.shadows.md,
  },
  rewardCardBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: THEME.colors.primary + '20',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.lg,
    borderWidth: 3,
    borderColor: THEME.colors.primary,
  },
  rewardCardBadgeSpecial: {
    backgroundColor: THEME.colors.star.filled + '20',
    borderColor: THEME.colors.star.filled,
  },
  rewardCardInfo: {
    alignItems: 'center',
  },
  rewardAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: THEME.spacing.lg,
  },
  scrapIcon: {
    fontSize: 32,
  },
  rewardValue: {
    fontSize: 48,
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
  specialBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.star.filled,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.round,
  },
  specialBadgeText: {
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.inverse,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.success,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    minWidth: 200,
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
  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.success + '20',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
  },
  claimedText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.success,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 2,
    borderColor: THEME.colors.border.default,
    padding: THEME.spacing.lg,
    alignItems: 'center',
    ...THEME.shadows.sm,
  },
  statIconContainer: {
    marginBottom: THEME.spacing.sm,
  },
  statValue: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.tertiary,
    textAlign: 'center',
  },
  scheduleSection: {
    marginBottom: THEME.spacing.lg,
  },
  scheduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.md,
  },
  scheduleCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 2,
    borderColor: THEME.colors.border.default,
    padding: THEME.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.sm,
  },
  scheduleCardSpecial: {
    borderColor: THEME.colors.star.filled,
    backgroundColor: THEME.colors.star.filled + '10',
  },
  scheduleDayBadge: {
    backgroundColor: THEME.colors.background.secondary,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.sm,
  },
  scheduleDayText: {
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.tertiary,
  },
  scheduleRewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleRewardIcon: {
    fontSize: 20,
  },
  scheduleRewardAmount: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.text.primary,
  },
  scheduleRewardAmountSpecial: {
    color: THEME.colors.star.filled,
  },
  scheduleSpecialBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  tipsSection: {
    marginBottom: THEME.spacing.lg,
  },
  tipCard: {
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.sm,
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.info,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  tipText: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.secondary,
    lineHeight: THEME.typography.fontSize.sm * THEME.typography.lineHeight.normal,
  },
});
