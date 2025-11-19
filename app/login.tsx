/**
 * Login Screen
 * Created: 2025-11-19
 *
 * Main authentication screen with tab switcher (Sign In / Sign Up)
 * Includes guest mode option and full auth flow integration
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
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserPlus, LogIn, UserCircle, Skull } from 'lucide-react-native';

import { THEME } from '@/constants/ui/theme';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail, validatePassword, validateUsername } from '@/lib/validation';
import { analytics } from '@/lib/analytics';
import AuthFormInput from '@/components/auth/AuthFormInput';
import NationalityPicker from '@/components/auth/NationalityPicker';

type AuthTab = 'signin' | 'signup';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, signUp, isAuthenticated, status } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up form state
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [nationality, setNationality] = useState('');

  // Validation & feedback state
  const [nicknameError, setNicknameError] = useState('');
  const [nicknameValid, setNicknameValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Track screen view
  useEffect(() => {
    analytics.screen('login_screen');
    analytics.track('login_shown', { trigger: 'manual' });
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/levels');
    }
  }, [isAuthenticated]);

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

  // Handle Sign In
  const handleSignIn = useCallback(async () => {
    setError('');
    setSuccessMessage('');

    // Validate inputs
    const emailValidation = validateEmail(signInEmail);
    if (!emailValidation.valid) {
      setError(emailValidation.error || 'Invalid email');
      return;
    }

    if (signInPassword.trim().length === 0) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn({
        email: signInEmail.trim(),
        password: signInPassword,
      });

      if (result.success) {
        setSuccessMessage('Welcome back! Redirecting...');
        analytics.track('login_completed', { method: 'email' });

        // Redirect after a short delay
        setTimeout(() => {
          router.replace('/levels');
        }, 500);
      } else {
        const errorMessage = result.error?.message || 'Failed to sign in';
        setError(getFriendlyErrorMessage(errorMessage));
        analytics.track('auth_error', {
          error_type: result.error?.error,
          flow: 'signin',
        });
      }
    } catch (err) {
      console.error('[LoginScreen] Sign in error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [signInEmail, signInPassword, signIn]);

  // Handle Sign Up
  const handleSignUp = useCallback(async () => {
    setError('');
    setSuccessMessage('');

    // Validate inputs
    const emailValidation = validateEmail(signUpEmail);
    if (!emailValidation.valid) {
      setError(emailValidation.error || 'Invalid email');
      return;
    }

    const passwordValidation = validatePassword(signUpPassword);
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
      const result = await signUp({
        email: signUpEmail.trim(),
        password: signUpPassword,
        nickname: nickname.trim(),
        nationality: nationality,
      });

      if (result.success) {
        setSuccessMessage('Account created! Welcome to Zombie Fleet!');
        analytics.track('signup_completed', {
          method: 'email',
          nationality: nationality,
        });

        // Redirect after a short delay
        setTimeout(() => {
          router.replace('/levels');
        }, 1000);
      } else {
        const errorMessage = result.error?.message || 'Failed to create account';
        setError(getFriendlyErrorMessage(errorMessage));
        analytics.track('auth_error', {
          error_type: result.error?.error,
          flow: 'signup',
        });
      }
    } catch (err) {
      console.error('[LoginScreen] Sign up error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [signUpEmail, signUpPassword, nickname, nationality, signUp]);

  // Handle Guest Mode
  const handleGuestMode = useCallback(() => {
    analytics.track('guest_mode_started', { trigger: 'login_screen' });
    router.replace('/levels');
  }, []);

  // Helper to get friendly error messages
  const getFriendlyErrorMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    }
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

  // Render tab button
  const renderTabButton = (tab: AuthTab, icon: any, label: string) => {
    const isActive = activeTab === tab;
    const Icon = icon;

    return (
      <TouchableOpacity
        style={[styles.tabButton, isActive && styles.tabButtonActive]}
        onPress={() => {
          setActiveTab(tab);
          setError('');
          setSuccessMessage('');
        }}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
      >
        <Icon
          size={20}
          color={isActive ? THEME.colors.primary : THEME.colors.text.tertiary}
        />
        <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

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
          { paddingTop: insets.top + THEME.spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Skull size={48} color={THEME.colors.danger} strokeWidth={2} />
          <Text style={styles.title}>ZOMBIE FLEET</Text>
          <Text style={styles.subtitle}>Join the Fight</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          {renderTabButton('signin', LogIn, 'Sign In')}
          {renderTabButton('signup', UserPlus, 'Sign Up')}
        </View>

        {/* Error/Success Messages */}
        {error && (
          <View style={styles.messageContainer}>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        )}

        {successMessage && (
          <View style={[styles.messageContainer, styles.successContainer]}>
            <Text style={styles.successMessage}>{successMessage}</Text>
          </View>
        )}

        {/* Forms Container */}
        <View style={styles.formContainer}>
          {activeTab === 'signin' ? (
            // Sign In Form
            <View>
              <AuthFormInput
                label="Email"
                type="email"
                value={signInEmail}
                onChangeText={setSignInEmail}
                disabled={loading}
                testID="signin-email-input"
                autoComplete="email"
                returnKeyType="next"
              />

              <AuthFormInput
                label="Password"
                type="password"
                value={signInPassword}
                onChangeText={setSignInPassword}
                disabled={loading}
                testID="signin-password-input"
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
              />

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.8}
                accessible={true}
                accessibilityLabel="Sign In"
                accessibilityRole="button"
              >
                {loading ? (
                  <ActivityIndicator color={THEME.colors.text.primary} />
                ) : (
                  <>
                    <LogIn size={20} color={THEME.colors.text.primary} />
                    <Text style={styles.submitButtonText}>SIGN IN</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            // Sign Up Form
            <View>
              <AuthFormInput
                label="Email"
                type="email"
                value={signUpEmail}
                onChangeText={setSignUpEmail}
                disabled={loading}
                testID="signup-email-input"
                autoComplete="email"
                returnKeyType="next"
              />

              <AuthFormInput
                label="Password"
                type="password"
                value={signUpPassword}
                onChangeText={setSignUpPassword}
                disabled={loading}
                testID="signup-password-input"
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
                testID="signup-nickname-input"
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
                testID="signup-nationality-picker"
              />

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSignUp}
                disabled={loading}
                activeOpacity={0.8}
                accessible={true}
                accessibilityLabel="Sign Up"
                accessibilityRole="button"
              >
                {loading ? (
                  <ActivityIndicator color={THEME.colors.text.primary} />
                ) : (
                  <>
                    <UserPlus size={20} color={THEME.colors.text.primary} />
                    <Text style={styles.submitButtonText}>CREATE ACCOUNT</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Guest Mode Button */}
        <TouchableOpacity
          style={styles.guestButton}
          onPress={handleGuestMode}
          disabled={loading}
          activeOpacity={0.8}
          accessible={true}
          accessibilityLabel="Play as Guest"
          accessibilityRole="button"
          accessibilityHint="Continue without creating an account"
        >
          <UserCircle size={20} color={THEME.colors.text.secondary} />
          <Text style={styles.guestButtonText}>PLAY AS GUEST</Text>
        </TouchableOpacity>

        {/* Info Text */}
        <Text style={styles.infoText}>
          {activeTab === 'signin'
            ? "Don't have an account? Switch to Sign Up."
            : 'Create an account to save your progress and compete on leaderboards!'}
        </Text>

        {/* Extra bottom padding for keyboard */}
        <View style={{ height: THEME.spacing.xxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  title: {
    fontSize: THEME.typography.fontSize.huge,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.text.primary,
    marginTop: THEME.spacing.md,
    letterSpacing: 3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.secondary,
    marginTop: THEME.spacing.xs,
    letterSpacing: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.sm,
    padding: THEME.spacing.xs,
    marginBottom: THEME.spacing.lg,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.xs,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
  },
  tabButtonActive: {
    backgroundColor: THEME.colors.background.elevated,
    ...THEME.shadows.sm,
  },
  tabButtonText: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.tertiary,
  },
  tabButtonTextActive: {
    color: THEME.colors.primary,
  },
  messageContainer: {
    backgroundColor: THEME.colors.danger + '20',
    borderWidth: 1,
    borderColor: THEME.colors.danger,
    borderRadius: THEME.borderRadius.sm,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  successContainer: {
    backgroundColor: THEME.colors.success + '20',
    borderColor: THEME.colors.success,
  },
  errorMessage: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.danger,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.success,
    textAlign: 'center',
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  formContainer: {
    marginBottom: THEME.spacing.lg,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: THEME.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.border.default,
  },
  dividerText: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.tertiary,
    marginHorizontal: THEME.spacing.md,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    backgroundColor: THEME.colors.background.secondary,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 2,
    borderColor: THEME.colors.border.default,
    minHeight: THEME.touchTarget.recommended,
  },
  guestButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.secondary,
    letterSpacing: 1,
  },
  infoText: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.tertiary,
    textAlign: 'center',
    marginTop: THEME.spacing.lg,
    lineHeight: THEME.typography.fontSize.xs * THEME.typography.lineHeight.relaxed,
  },
});
