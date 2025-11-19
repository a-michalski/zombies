/**
 * Daily Rewards Usage Example
 * Created: 2025-11-19
 *
 * Complete example showing how to integrate daily rewards into your app
 * This is a reference implementation - copy patterns to your actual screens
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Gift, Home } from 'lucide-react-native';
import { router } from 'expo-router';

import { THEME } from '@/constants/ui/theme';
import { useAuth } from '@/contexts/AuthContext';
import { DailyRewardCard } from './DailyRewardCard';
import { RewardClaimModal } from './RewardClaimModal';
import { DailyRewardDefinition } from '@/types/gamification';
import { analytics } from '@/lib/analytics';

/**
 * Example: Daily Rewards in Home Screen
 *
 * This example shows:
 * 1. Inline DailyRewardCard component
 * 2. Success modal after claiming
 * 3. Navigation to full rewards screen
 * 4. Proper auth handling
 * 5. Analytics tracking
 */
export default function RewardsExample() {
  const { user, isAuthenticated, isGuest } = useAuth();

  // State for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [claimedReward, setClaimedReward] = useState<{
    reward: DailyRewardDefinition;
    streak: number;
    streakBroken?: boolean;
  } | null>(null);

  /**
   * Handle successful reward claim
   * Called by DailyRewardCard after claim
   */
  const handleRewardClaim = async (reward: DailyRewardDefinition) => {
    console.log('[RewardsExample] Reward claimed:', reward);

    // Track analytics
    analytics.track('daily_reward_claimed', {
      user_id: user?.id,
      reward_amount: reward.reward_amount,
      reward_type: reward.reward_type,
      special: reward.special,
    });

    // TODO: Grant the scrap to user's campaign progress
    // Example:
    // await grantScrapReward(user.id, reward.reward_amount);

    // Get current streak from your state or refetch
    // For now, we'll just show the modal
    // In real implementation, get this from claimDailyReward result
    setClaimedReward({
      reward,
      streak: 1, // Replace with actual streak
      streakBroken: false,
    });

    setShowSuccessModal(true);

    // Show native alert as fallback
    if (Platform.OS !== 'web') {
      // Modal will show instead, but you could also show a Toast
    }
  };

  /**
   * Navigate to full rewards screen
   */
  const handleViewFullRewards = () => {
    analytics.track('daily_reward_shown', {
      trigger: 'view_full_screen',
    });

    router.push('/rewards');
  };

  /**
   * Close success modal
   */
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setClaimedReward(null);
  };

  // Guest users should be prompted to log in
  if (isGuest) {
    return (
      <View style={styles.container}>
        <View style={styles.guestPrompt}>
          <Gift size={64} color={THEME.colors.text.tertiary} />
          <Text style={styles.guestTitle}>Daily Rewards</Text>
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

  // Not authenticated (shouldn't happen, but handle it)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Rewards Example</Text>
          <Text style={styles.headerSubtitle}>
            Integrate this into your home screen or campaign
          </Text>
        </View>

        {/* Section 1: Inline Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Inline Card Component</Text>
          <Text style={styles.sectionDescription}>
            Use this on your home screen, campaign, or anywhere you want to show daily
            rewards inline.
          </Text>

          <DailyRewardCard
            userId={user.id}
            onClaim={handleRewardClaim}
            onViewFullScreen={handleViewFullRewards}
          />
        </View>

        {/* Section 2: Full Screen Button */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 Full Rewards Screen</Text>
          <Text style={styles.sectionDescription}>
            Navigate to the dedicated rewards screen for detailed stats and schedule.
          </Text>

          <TouchableOpacity
            style={styles.fullScreenButton}
            onPress={handleViewFullRewards}
            activeOpacity={0.8}
          >
            <Gift size={20} color={THEME.colors.text.primary} />
            <Text style={styles.fullScreenButtonText}>VIEW ALL REWARDS</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Integration Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Integration Tips</Text>

          <View style={styles.tipCard}>
            <Text style={styles.tipNumber}>1</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Home Screen</Text>
              <Text style={styles.tipDescription}>
                Add DailyRewardCard to your main menu for maximum visibility
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipNumber}>2</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Post-Level</Text>
              <Text style={styles.tipDescription}>
                Remind users after completing a level if they haven't claimed today
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipNumber}>3</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Campaign Screen</Text>
              <Text style={styles.tipDescription}>
                Show at the top of your levels list for easy access
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipNumber}>4</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Menu Button</Text>
              <Text style={styles.tipDescription}>
                Add a "Daily Rewards" button to your main menu alongside other features
              </Text>
            </View>
          </View>
        </View>

        {/* Back to Home */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Home size={20} color={THEME.colors.text.primary} />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      {claimedReward && (
        <RewardClaimModal
          visible={showSuccessModal}
          onClose={handleCloseModal}
          reward={claimedReward.reward}
          newStreak={claimedReward.streak}
          streakBroken={claimedReward.streakBroken}
        />
      )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xxl,
  },
  header: {
    marginBottom: THEME.spacing.xl,
  },
  headerTitle: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  headerSubtitle: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.tertiary,
  },
  section: {
    marginBottom: THEME.spacing.xl,
  },
  sectionTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
  },
  sectionDescription: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.tertiary,
    marginBottom: THEME.spacing.md,
    lineHeight: THEME.typography.fontSize.sm * THEME.typography.lineHeight.normal,
  },
  fullScreenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    ...THEME.shadows.primary,
  },
  fullScreenButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    letterSpacing: 1,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.primary,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  tipNumber: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.primary,
    marginRight: THEME.spacing.md,
    width: 32,
    textAlign: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.tertiary,
    lineHeight: THEME.typography.fontSize.sm * THEME.typography.lineHeight.normal,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.background.elevated,
    borderWidth: 2,
    borderColor: THEME.colors.border.default,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
  },
  backButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },
  guestPrompt: {
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
});
