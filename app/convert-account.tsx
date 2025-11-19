/**
 * Convert Guest to Account Screen
 * Created: 2025-11-19
 *
 * Full screen for converting a guest account to a full account
 * Shows guest progress stats and preserves all progress after conversion
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  UserPlus,
  ArrowLeft,
  Star,
  Trophy,
  CheckCircle,
  TrendingUp,
  Coins,
} from 'lucide-react-native';

import { THEME } from '@/constants/ui/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useCampaignContext } from '@/contexts/CampaignContext';
import { performFullSync } from '@/lib/cloudSync';
import { validateEmail, validatePassword, validateUsername } from '@/lib/validation';
import { analytics } from '@/lib/analytics';
import AuthFormInput from '@/components/auth/AuthFormInput';
import NationalityPicker from '@/components/auth/NationalityPicker';
import { getGuestProgressStats } from '@/hooks/useGuestConversion';

// ============================================
// COMPONENT
// ============================================

export default function ConvertAccountScreen() {
  const insets = useSafeAreaInsets();
  const { convertGuestToAccount, isGuest, user } = useAuth();
  const { playerProgress } = useCampaignContext();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [nationality, setNationality] = useState('');

  // Validation & feedback state
  const [nicknameError, setNicknameError] = useState('');
  const [nicknameValid, setNicknameValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversionSuccess, setConversionSuccess] = useState(false);
  const [syncingProgress, setSyncingProgress] = useState(false);

  // Get guest progress stats
  const stats = getGuestProgressStats(playerProgress);

  // Track screen view
  useEffect(() => {
    analytics.screen('convert_account_screen');
    analytics.track('guest_converted', {
      trigger: 'manual',
      action: 'screen_viewed',
      levels_completed: stats.levelsCompleted,
    });
  }, []);

  // Redirect if not a guest
  useEffect(() => {
    if (!isGuest) {
      router.replace('/levels');
    }
  }, [isGuest]);

  // Real-time nickname validation
  useEffect(() => {
    if (nickname.trim().length === 0) {
      setNicknameError('');
      setNicknameValid(false);
      return;
    }

    const validation = validateUsername(nickname);
    if (!validation.valid) {
      setNicknameError(validation.error || 'Invalid nickname');
      setNicknameValid(false);
    } else {
      setNicknameError('');
      setNicknameValid(true);
    }
  }, [nickname]);

  // Handle conversion
  const handleConvert = useCallback(async () => {
    setError('');

    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.error || 'Invalid email');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.error || 'Invalid password');
      return;
    }

    const usernameValidation = validateUsername(nickname);
    if (!usernameValidation.valid) {
      setError(usernameValidation.error || 'Invalid nickname');
      return;
    }

    if (!nationality || nationality.trim().length === 0) {
      setError('Please select your nationality');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Convert guest to account
      const result = await convertGuestToAccount({
        email: email.trim(),
        password: password,
        nickname: nickname.trim(),
        nationality: nationality,
      });

      if (!result.success) {
        const errorMessage = result.error?.message || 'Failed to create account';
        setError(getFriendlyErrorMessage(errorMessage));
        analytics.track('auth_error', {
          error_type: result.error?.error,
          flow: 'guest_conversion',
        });
        setLoading(false);
        return;
      }

      // Step 2: Sync local campaign progress to cloud
      setSyncingProgress(true);

      // Wait a moment for auth state to update
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Perform full sync - this will upload local progress to cloud
      if (user?.id) {
        const syncResult = await performFullSync(user.id);

        if (!syncResult.success) {
          console.error('[ConvertAccount] Sync failed:', syncResult.error);
          // Don't fail the whole conversion - local data is still saved
        }
      }

      setSyncingProgress(false);
      setConversionSuccess(true);

      analytics.track('guest_converted', {
        trigger: 'manual',
        action: 'completed',
        levels_completed: stats.levelsCompleted,
        total_stars: stats.totalStars,
      });

      // Redirect after showing success message
      setTimeout(() => {
        router.replace('/levels');
      }, 2000);
    } catch (err) {
      console.error('[ConvertAccount] Conversion error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
      setSyncingProgress(false);
    }
  }, [email, password, nickname, nationality, convertGuestToAccount, user, stats]);

  // Helper to get friendly error messages
  const getFriendlyErrorMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('email already registered')) {
      return 'This email is already registered. Please sign in instead.';
    }
    if (lowerMessage.includes('already taken')) {
      return 'This nickname is already taken. Please choose another.';
    }
    if (lowerMessage.includes('weak password')) {
      return 'Password must be at least 8 characters with uppercase, lowercase, and number.';
    }
    if (lowerMessage.includes('invalid email')) {
      return 'Please enter a valid email address.';
    }
    if (lowerMessage.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }

    return message;
  };

  // Show success screen
  if (conversionSuccess) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.successContainer}>
          <CheckCircle size={80} color={THEME.colors.success} strokeWidth={2} />
          <Text style={styles.successTitle}>Account Created!</Text>
          <Text style={styles.successMessage}>
            Your progress has been saved to the cloud. You can now compete on leaderboards and unlock achievements!
          </Text>
          <ActivityIndicator
            size="large"
            color={THEME.colors.primary}
            style={{ marginTop: THEME.spacing.lg }}
          />
          <Text style={styles.redirectText}>Redirecting to campaign...</Text>
        </View>
      </View>
    );
  }

  // Show syncing screen
  if (syncingProgress) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.successContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.syncingTitle}>Syncing Your Progress...</Text>
          <Text style={styles.syncingMessage}>
            Uploading {stats.levelsCompleted} completed levels to the cloud
          </Text>
        </View>
      </View>
    );
  }

  // Main conversion form
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + THEME.spacing.md },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={24} color={THEME.colors.text.secondary} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <UserPlus size={48} color={THEME.colors.primary} strokeWidth={2} />
          <Text style={styles.title}>Save Your Progress</Text>
          <Text style={styles.subtitle}>
            Create an account to keep your achievements and compete globally
          </Text>
        </View>

        {/* Progress Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Your Progress So Far:</Text>

          <View style={styles.statsGrid}>
            <StatCard
              icon={Trophy}
              iconColor={THEME.colors.primary}
              label="Levels Completed"
              value={stats.levelsCompleted.toString()}
            />

            <StatCard
              icon={Star}
              iconColor={THEME.colors.star.filled}
              label="Total Stars"
              value={stats.totalStars.toString()}
            />

            <StatCard
              icon={Coins}
              iconColor={THEME.colors.scrap}
              label="Scrap Earned"
              value={stats.totalScrapEarned.toString()}
            />
          </View>

          <View style={styles.progressNote}>
            <TrendingUp size={20} color={THEME.colors.success} />
            <Text style={styles.progressNoteText}>
              All your progress will be preserved and synced to the cloud
            </Text>
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.messageContainer}>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Create Your Account</Text>

          <AuthFormInput
            label="Email"
            type="email"
            value={email}
            onChangeText={setEmail}
            disabled={loading}
            testID="convert-email-input"
            autoComplete="email"
            returnKeyType="next"
          />

          <AuthFormInput
            label="Password"
            type="password"
            value={password}
            onChangeText={setPassword}
            disabled={loading}
            testID="convert-password-input"
            autoComplete="password"
            returnKeyType="next"
            helperText="Min 8 characters with uppercase, lowercase, and number"
          />

          <AuthFormInput
            label="Nickname"
            type="text"
            value={nickname}
            onChangeText={setNickname}
            error={nicknameError}
            disabled={loading}
            testID="convert-nickname-input"
            autoComplete="username"
            returnKeyType="next"
            helperText={
              nicknameValid && !nicknameError
                ? 'Nickname looks good!'
                : '3-20 characters, letters, numbers, and underscores only'
            }
          />

          <NationalityPicker
            label="Nationality"
            value={nationality}
            onValueChange={setNationality}
            disabled={loading}
            testID="convert-nationality-picker"
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleConvert}
            disabled={loading}
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel="Create Account & Save Progress"
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color={THEME.colors.text.primary} />
            ) : (
              <>
                <UserPlus size={20} color={THEME.colors.text.primary} />
                <Text style={styles.submitButtonText}>CREATE ACCOUNT & SAVE</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          By creating an account, you agree to our Terms of Service and Privacy Policy.
          Your game progress will be backed up to the cloud automatically.
        </Text>

        {/* Extra bottom padding for keyboard */}
        <View style={{ height: THEME.spacing.xxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ============================================
// STAT CARD SUB-COMPONENT
// ============================================

interface StatCardProps {
  icon: React.ComponentType<any>;
  iconColor: string;
  label: string;
  value: string;
}

function StatCard({ icon: Icon, iconColor, label, value }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Icon size={32} color={iconColor} strokeWidth={2} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  title: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginTop: THEME.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.secondary,
    marginTop: THEME.spacing.sm,
    textAlign: 'center',
    lineHeight: THEME.typography.fontSize.md * THEME.typography.lineHeight.normal,
  },
  statsContainer: {
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  statsTitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.sm,
    padding: THEME.spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginTop: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.tertiary,
    marginTop: THEME.spacing.xs,
    textAlign: 'center',
  },
  progressNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.success + '20',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.success,
  },
  progressNoteText: {
    flex: 1,
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.success,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  messageContainer: {
    backgroundColor: THEME.colors.danger + '20',
    borderWidth: 1,
    borderColor: THEME.colors.danger,
    borderRadius: THEME.borderRadius.sm,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  errorMessage: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.danger,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: THEME.spacing.lg,
  },
  formTitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginTop: THEME.spacing.md,
    ...THEME.shadows.primary,
    minHeight: THEME.touchTarget.recommended,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    letterSpacing: 1,
  },
  infoText: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: THEME.typography.fontSize.xs * THEME.typography.lineHeight.relaxed,
  },

  // Success screen styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  successTitle: {
    fontSize: THEME.typography.fontSize.xxl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.success,
    marginTop: THEME.spacing.lg,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.secondary,
    marginTop: THEME.spacing.md,
    textAlign: 'center',
    lineHeight: THEME.typography.fontSize.md * THEME.typography.lineHeight.relaxed,
  },
  redirectText: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.tertiary,
    marginTop: THEME.spacing.md,
  },

  // Syncing screen styles
  syncingTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginTop: THEME.spacing.lg,
    textAlign: 'center',
  },
  syncingMessage: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.secondary,
    marginTop: THEME.spacing.sm,
    textAlign: 'center',
  },
});
