/**
 * Authentication Context
 * Created: 2025-11-19
 *
 * Manages user authentication state, session management, and auth operations
 */

import createContextHook from '@nkzw/create-context-hook';
import { Session, User, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import { createProfile, getProfile, updateLastSeen } from '@/lib/profile';
import { validateEmail, validatePassword, validateUsername, checkUsernameAvailability } from '@/lib/validation';
import { analytics } from '@/lib/analytics';
import {
  AuthState,
  AuthStatus,
  UserProfile,
  SignUpData,
  SignInData,
  AuthError,
  AuthErrorResult,
  CreateProfileData,
} from '@/types/auth';

/**
 * Map Supabase auth errors to our custom error types
 */
function mapAuthError(error: SupabaseAuthError): AuthError {
  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'invalid_credentials';
  }
  if (message.includes('email already registered') || message.includes('user already registered')) {
    return 'email_already_exists';
  }
  if (message.includes('password') && message.includes('weak')) {
    return 'weak_password';
  }
  if (message.includes('invalid email')) {
    return 'invalid_email';
  }
  if (message.includes('network')) {
    return 'network_error';
  }

  return 'unknown_error';
}

/**
 * Auth Context Provider
 * Manages authentication state and provides auth operations
 */
export const [AuthProvider, useAuth] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    status: 'loading',
    session: null,
    user: null,
    profile: null,
  });

  /**
   * Initialize auth session on mount
   * Check for existing session and set up auth state listener
   */
  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;

      if (error) {
        console.error('[Auth] Get session error:', error);
        setAuthState({
          status: 'unauthenticated',
          session: null,
          user: null,
          profile: null,
        });
        return;
      }

      if (session) {
        // User is authenticated
        loadUserProfile(session.user.id, session, session.user);
      } else {
        // No session - user is guest
        setAuthState({
          status: 'guest',
          session: null,
          user: null,
          profile: null,
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('[Auth] State change:', event, session?.user?.id);

        if (event === 'SIGNED_IN' && session) {
          loadUserProfile(session.user.id, session, session.user);
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            status: 'guest',
            session: null,
            user: null,
            profile: null,
          });
          analytics.reset();
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Session refreshed - update state
          setAuthState(prev => ({
            ...prev,
            session,
            user: session.user,
          }));
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Load user profile from database
   */
  const loadUserProfile = async (userId: string, session: Session, user: User) => {
    const { success, profile, error } = await getProfile(userId);

    if (success && profile) {
      setAuthState({
        status: 'authenticated',
        session,
        user,
        profile,
      });

      // Update last seen
      updateLastSeen(userId);

      // Initialize analytics with user ID
      analytics.identify(userId, {
        nickname: profile.nickname,
        nationality: profile.nationality,
      });
    } else {
      // Profile not found - this shouldn't happen normally
      console.error('[Auth] Profile not found for user:', userId, error);

      // Sign out to reset state
      await supabase.auth.signOut();

      setAuthState({
        status: 'unauthenticated',
        session: null,
        user: null,
        profile: null,
      });
    }
  };

  /**
   * Sign up with email, password, and profile data
   */
  const signUp = useCallback(
    async (data: SignUpData): Promise<{ success: boolean; error?: AuthErrorResult }> => {
      analytics.track('signup_started', {
        nationality: data.nationality,
      });

      // Client-side validation
      const emailValidation = validateEmail(data.email);
      if (!emailValidation.valid) {
        return {
          success: false,
          error: {
            error: 'invalid_email',
            message: emailValidation.error || 'Invalid email',
          },
        };
      }

      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: {
            error: 'weak_password',
            message: passwordValidation.error || 'Weak password',
          },
        };
      }

      const usernameValidation = validateUsername(data.nickname);
      if (!usernameValidation.valid) {
        return {
          success: false,
          error: {
            error: 'nickname_profane',
            message: usernameValidation.error || 'Invalid username',
          },
        };
      }

      // Check username availability
      const availability = await checkUsernameAvailability(data.nickname);
      if (!availability.available) {
        return {
          success: false,
          error: {
            error: 'nickname_already_exists',
            message: availability.error || 'Username already taken',
          },
        };
      }

      try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (authError) {
          console.error('[Auth] Sign up error:', authError);
          const mappedError = mapAuthError(authError);
          return {
            success: false,
            error: {
              error: mappedError,
              message: authError.message,
            },
          };
        }

        if (!authData.user) {
          return {
            success: false,
            error: {
              error: 'unknown_error',
              message: 'Failed to create user',
            },
          };
        }

        // Create profile
        const profileData: CreateProfileData = {
          nickname: data.nickname,
          nationality: data.nationality,
        };

        const { success: profileSuccess, error: profileError } = await createProfile(
          authData.user.id,
          profileData
        );

        if (!profileSuccess) {
          console.error('[Auth] Profile creation error:', profileError);

          // Rollback: delete auth user
          await supabase.auth.signOut();

          return {
            success: false,
            error: {
              error: 'nickname_already_exists',
              message: profileError || 'Failed to create profile',
            },
          };
        }

        // Success - auth state will be updated by onAuthStateChange listener
        analytics.track('signup_completed', {
          user_id: authData.user.id,
          nationality: data.nationality,
        });

        return { success: true };
      } catch (error) {
        console.error('[Auth] Sign up exception:', error);
        return {
          success: false,
          error: {
            error: 'unknown_error',
            message: 'An unexpected error occurred',
          },
        };
      }
    },
    []
  );

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(
    async (data: SignInData): Promise<{ success: boolean; error?: AuthErrorResult }> => {
      analytics.track('login_shown', { trigger: 'manual' });

      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (authError) {
          console.error('[Auth] Sign in error:', authError);
          const mappedError = mapAuthError(authError);

          analytics.track('auth_error', {
            error_type: mappedError,
          });

          return {
            success: false,
            error: {
              error: mappedError,
              message: authError.message,
            },
          };
        }

        if (!authData.user) {
          return {
            success: false,
            error: {
              error: 'unknown_error',
              message: 'Failed to sign in',
            },
          };
        }

        // Success - auth state will be updated by onAuthStateChange listener
        analytics.track('login_completed', {
          user_id: authData.user.id,
        });

        return { success: true };
      } catch (error) {
        console.error('[Auth] Sign in exception:', error);
        return {
          success: false,
          error: {
            error: 'unknown_error',
            message: 'An unexpected error occurred',
          },
        };
      }
    },
    []
  );

  /**
   * Sign out
   */
  const signOut = useCallback(async (): Promise<{ success: boolean }> => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('[Auth] Sign out error:', error);
        return { success: false };
      }

      analytics.track('logout');
      analytics.reset();

      return { success: true };
    } catch (error) {
      console.error('[Auth] Sign out exception:', error);
      return { success: false };
    }
  }, []);

  /**
   * Refresh user profile from database
   * Useful after profile updates
   */
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!authState.user) return;

    const { success, profile } = await getProfile(authState.user.id);

    if (success && profile) {
      setAuthState(prev => ({
        ...prev,
        profile,
      }));
    }
  }, [authState.user]);

  /**
   * Convert guest to account
   * Allows guest players to create an account and keep their progress
   */
  const convertGuestToAccount = useCallback(
    async (data: SignUpData): Promise<{ success: boolean; error?: AuthErrorResult }> => {
      analytics.track('guest_converted', {
        trigger: 'manual',
      });

      // Same as signUp for now
      // In future, we'll migrate local campaign progress to cloud
      return signUp(data);
    },
    [signUp]
  );

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = authState.status === 'authenticated';

  /**
   * Check if user is guest
   */
  const isGuest = authState.status === 'guest';

  /**
   * Check if auth is loading
   */
  const isLoading = authState.status === 'loading';

  return {
    // State
    authState,
    session: authState.session,
    user: authState.user,
    profile: authState.profile,
    status: authState.status,

    // Computed
    isAuthenticated,
    isGuest,
    isLoading,

    // Actions
    signUp,
    signIn,
    signOut,
    refreshProfile,
    convertGuestToAccount,
  };
});
