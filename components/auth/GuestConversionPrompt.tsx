/**
 * Guest Conversion Prompt Component
 * Created: 2025-11-19
 *
 * Modal/overlay that prompts guest users to create an account
 * Shows different messaging based on trigger context
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import {
  UserPlus,
  X,
  Cloud,
  Trophy,
  Award,
  Gift,
  CheckSquare,
  Square,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { THEME } from '@/constants/ui/theme';
import { analytics } from '@/lib/analytics';

// ============================================
// TYPES
// ============================================

export type ConversionTrigger = 'post_level' | 'leaderboard_view' | 'progress_warning';

export interface GuestConversionPromptProps {
  visible: boolean;
  onClose: () => void;
  onConvert: () => void;
  trigger: ConversionTrigger;
}

// ============================================
// STORAGE KEYS
// ============================================

const NEVER_SHOW_AGAIN_KEY = '@zombie_fleet:never_show_conversion_prompt';

// ============================================
// TRIGGER-SPECIFIC CONTENT
// ============================================

interface TriggerContent {
  title: string;
  message: string;
  icon: React.ComponentType<any>;
  iconColor: string;
}

const getTriggerContent = (trigger: ConversionTrigger): TriggerContent => {
  switch (trigger) {
    case 'post_level':
      return {
        title: 'Great Job!',
        message: 'You\'re making progress! Create an account to save your achievements and compete on global leaderboards.',
        icon: Trophy,
        iconColor: THEME.colors.star.filled,
      };
    case 'leaderboard_view':
      return {
        title: 'Join the Competition',
        message: 'Create an account to submit your scores and compete with players worldwide!',
        icon: Trophy,
        iconColor: THEME.colors.primary,
      };
    case 'progress_warning':
      return {
        title: 'Don\'t Lose Your Progress!',
        message: 'Your game data is only saved locally. Create an account to back up your progress to the cloud.',
        icon: Cloud,
        iconColor: THEME.colors.warning,
      };
    default:
      return {
        title: 'Save Your Progress',
        message: 'Create an account to unlock all features and save your progress.',
        icon: UserPlus,
        iconColor: THEME.colors.primary,
      };
  }
};

// ============================================
// COMPONENT
// ============================================

export default function GuestConversionPrompt({
  visible,
  onClose,
  onConvert,
  trigger,
}: GuestConversionPromptProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const triggerContent = getTriggerContent(trigger);
  const Icon = triggerContent.icon;

  // Track when prompt is shown
  useEffect(() => {
    if (visible) {
      analytics.track('guest_converted', {
        trigger,
        action: 'shown',
      });
    }
  }, [visible, trigger]);

  // Handle "Don't show again" checkbox
  const handleDontShowAgainToggle = () => {
    setDontShowAgain(!dontShowAgain);
  };

  // Handle close with "Don't show again" persistence
  const handleClose = async () => {
    if (dontShowAgain) {
      try {
        await AsyncStorage.setItem(NEVER_SHOW_AGAIN_KEY, 'true');
        analytics.track('guest_converted', {
          trigger,
          action: 'never_show_again',
        });
      } catch (error) {
        console.error('[GuestConversionPrompt] Failed to save preference:', error);
      }
    }

    analytics.track('guest_converted', {
      trigger,
      action: 'dismissed',
    });

    onClose();
  };

  // Handle conversion button
  const handleConvert = () => {
    analytics.track('guest_converted', {
      trigger,
      action: 'started',
    });

    onConvert();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <X size={24} color={THEME.colors.text.secondary} />
          </TouchableOpacity>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Icon & Title */}
            <View style={styles.header}>
              <View style={[styles.iconContainer, { backgroundColor: triggerContent.iconColor + '20' }]}>
                <Icon size={48} color={triggerContent.iconColor} strokeWidth={2} />
              </View>
              <Text style={styles.title}>{triggerContent.title}</Text>
              <Text style={styles.message}>{triggerContent.message}</Text>
            </View>

            {/* Benefits List */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Create an account to unlock:</Text>

              <BenefitItem
                icon={Cloud}
                iconColor={THEME.colors.primary}
                title="Cloud Save"
                description="Your progress is backed up and synced across devices"
              />

              <BenefitItem
                icon={Trophy}
                iconColor={THEME.colors.star.filled}
                title="Global Leaderboards"
                description="Compete with players worldwide and climb the ranks"
              />

              <BenefitItem
                icon={Award}
                iconColor={THEME.colors.success}
                title="Achievements"
                description="Unlock special badges and track your accomplishments"
              />

              <BenefitItem
                icon={Gift}
                iconColor={THEME.colors.warning}
                title="Daily Rewards"
                description="Claim exclusive rewards and bonuses every day"
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.convertButton}
                onPress={handleConvert}
                activeOpacity={0.8}
                accessible={true}
                accessibilityLabel="Create Account"
                accessibilityRole="button"
              >
                <UserPlus size={20} color={THEME.colors.text.primary} />
                <Text style={styles.convertButtonText}>CREATE ACCOUNT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.maybeLaterButton}
                onPress={handleClose}
                activeOpacity={0.7}
                accessible={true}
                accessibilityLabel="Maybe Later"
                accessibilityRole="button"
              >
                <Text style={styles.maybeLaterButtonText}>MAYBE LATER</Text>
              </TouchableOpacity>
            </View>

            {/* Don't show again checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={handleDontShowAgainToggle}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel="Don't show this again"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: dontShowAgain }}
            >
              {dontShowAgain ? (
                <CheckSquare size={20} color={THEME.colors.primary} />
              ) : (
                <Square size={20} color={THEME.colors.text.tertiary} />
              )}
              <Text style={styles.checkboxLabel}>Don't show this again</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ============================================
// BENEFIT ITEM SUB-COMPONENT
// ============================================

interface BenefitItemProps {
  icon: React.ComponentType<any>;
  iconColor: string;
  title: string;
  description: string;
}

function BenefitItem({ icon: Icon, iconColor, title, description }: BenefitItemProps) {
  return (
    <View style={styles.benefitItem}>
      <View style={[styles.benefitIconContainer, { backgroundColor: iconColor + '20' }]}>
        <Icon size={24} color={iconColor} strokeWidth={2} />
      </View>
      <View style={styles.benefitTextContainer}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitDescription}>{description}</Text>
      </View>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: THEME.colors.overlay.dark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  modalContent: {
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.lg,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    ...THEME.shadows.lg,
    ...(Platform.OS === 'web' && {
      maxHeight: '80vh',
    }),
  },
  closeButton: {
    position: 'absolute',
    top: THEME.spacing.md,
    right: THEME.spacing.md,
    zIndex: 10,
    padding: THEME.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    lineHeight: THEME.typography.fontSize.md * THEME.typography.lineHeight.relaxed,
  },
  benefitsContainer: {
    marginBottom: THEME.spacing.lg,
  },
  benefitsTitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.md,
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.sm,
  },
  benefitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  benefitDescription: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.tertiary,
    lineHeight: THEME.typography.fontSize.sm * THEME.typography.lineHeight.normal,
  },
  buttonsContainer: {
    marginBottom: THEME.spacing.md,
  },
  convertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.sm,
    ...THEME.shadows.primary,
    minHeight: THEME.touchTarget.recommended,
  },
  convertButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    letterSpacing: 1,
  },
  maybeLaterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.background.secondary,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 2,
    borderColor: THEME.colors.border.default,
    minHeight: THEME.touchTarget.recommended,
  },
  maybeLaterButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.secondary,
    letterSpacing: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    paddingVertical: THEME.spacing.sm,
  },
  checkboxLabel: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.tertiary,
  },
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if user has chosen to never show the prompt again
 */
export async function shouldNeverShowPrompt(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(NEVER_SHOW_AGAIN_KEY);
    return value === 'true';
  } catch (error) {
    console.error('[GuestConversionPrompt] Failed to check preference:', error);
    return false;
  }
}

/**
 * Reset the "never show again" preference (useful for testing)
 */
export async function resetNeverShowPreference(): Promise<void> {
  try {
    await AsyncStorage.removeItem(NEVER_SHOW_AGAIN_KEY);
  } catch (error) {
    console.error('[GuestConversionPrompt] Failed to reset preference:', error);
  }
}
