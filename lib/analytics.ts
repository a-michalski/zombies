/**
 * Analytics Tracking
 * Created: 2025-11-19
 *
 * Centralized analytics for tracking user behavior and game metrics
 *
 * TODO Phase 1: Implement PostHog or Mixpanel integration
 * For now, this is a placeholder that logs to console in dev mode
 */

const DEV_MODE = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
const ENABLE_DEBUG_LOGS = process.env.EXPO_PUBLIC_ENABLE_DEBUG_LOGS === 'true';

// ============================================
// EVENT TYPES
// ============================================

export type AnalyticsEvent =
  // App Lifecycle
  | 'app_opened'
  | 'app_backgrounded'
  | 'app_closed'

  // Auth Events
  | 'login_shown'
  | 'signup_started'
  | 'signup_completed'
  | 'login_completed'
  | 'logout'
  | 'guest_mode_started'
  | 'guest_converted'

  // Game Events
  | 'game_started'
  | 'level_started'
  | 'level_completed'
  | 'level_failed'
  | 'wave_completed'
  | 'tower_placed'
  | 'tower_upgraded'
  | 'zombie_killed'

  // Social Events
  | 'leaderboard_viewed'
  | 'profile_viewed'
  | 'friend_request_sent'
  | 'friend_request_accepted'
  | 'challenge_sent'
  | 'challenge_accepted'

  // Gamification Events
  | 'achievement_unlocked'
  | 'daily_reward_claimed'
  | 'daily_reward_shown'

  // Cloud Sync Events
  | 'cloud_sync_started'
  | 'cloud_sync_completed'
  | 'cloud_sync_failed'
  | 'offline_mode_detected'

  // Errors
  | 'error_occurred'
  | 'network_error'
  | 'auth_error'
  | 'sync_error';

export type EventProperties = Record<string, string | number | boolean | null>;

// ============================================
// ANALYTICS CLIENT
// ============================================

class Analytics {
  private userId: string | null = null;
  private isInitialized = false;

  /**
   * Initialize analytics with user ID
   */
  init(userId: string | null = null) {
    this.userId = userId;
    this.isInitialized = true;

    if (ENABLE_DEBUG_LOGS) {
      console.log('[Analytics] Initialized', { userId });
    }

    // TODO: Initialize PostHog/Mixpanel here
    // Example:
    // posthog.init(POSTHOG_API_KEY, {
    //   host: POSTHOG_HOST,
    //   person_profiles: 'identified_only',
    // });
  }

  /**
   * Identify user (call after login/signup)
   */
  identify(userId: string, traits?: EventProperties) {
    this.userId = userId;

    if (ENABLE_DEBUG_LOGS) {
      console.log('[Analytics] Identify', { userId, traits });
    }

    // TODO: PostHog identify
    // posthog.identify(userId, traits);
  }

  /**
   * Track an event
   */
  track(event: AnalyticsEvent, properties?: EventProperties) {
    if (!this.isInitialized) {
      console.warn('[Analytics] Not initialized. Call init() first.');
      return;
    }

    const eventData = {
      event,
      properties: {
        ...properties,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        platform: 'mobile', // or 'web' based on Platform.OS
      },
    };

    if (DEV_MODE || ENABLE_DEBUG_LOGS) {
      console.log('[Analytics] Track', eventData);
    }

    // TODO: PostHog capture
    // posthog.capture(event, eventData.properties);
  }

  /**
   * Track screen view
   */
  screen(screenName: string, properties?: EventProperties) {
    this.track('app_opened' as AnalyticsEvent, {
      screen: screenName,
      ...properties,
    });
  }

  /**
   * Reset analytics (call on logout)
   */
  reset() {
    this.userId = null;

    if (ENABLE_DEBUG_LOGS) {
      console.log('[Analytics] Reset');
    }

    // TODO: PostHog reset
    // posthog.reset();
  }

  /**
   * Set user properties (for segmentation)
   */
  setUserProperties(properties: EventProperties) {
    if (ENABLE_DEBUG_LOGS) {
      console.log('[Analytics] Set User Properties', properties);
    }

    // TODO: PostHog set person properties
    // posthog.setPersonProperties(properties);
  }
}

// Singleton instance
export const analytics = new Analytics();

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Track game metrics (called after level completion)
 */
export function trackLevelCompletion(data: {
  level_id: string;
  stars: number;
  score: number;
  completion_time: number;
  zombies_killed: number;
  is_logged_in: boolean;
  wave_died?: number;
}) {
  analytics.track('level_completed', {
    level_id: data.level_id,
    stars: data.stars,
    score: data.score,
    completion_time: data.completion_time,
    zombies_killed: data.zombies_killed,
    is_logged_in: data.is_logged_in,
  });
}

/**
 * Track level failure
 */
export function trackLevelFailed(data: {
  level_id: string;
  wave_died: number;
  reason?: string;
  is_logged_in: boolean;
}) {
  analytics.track('level_failed', {
    level_id: data.level_id,
    wave_died: data.wave_died,
    reason: data.reason || 'unknown',
    is_logged_in: data.is_logged_in,
  });
}

/**
 * Track conversion funnel (guest → account)
 */
export function trackGuestConversion(data: {
  days_played_as_guest: number;
  levels_completed: number;
  trigger: string; // 'post_level' | 'leaderboard_view' | 'manual'
}) {
  analytics.track('guest_converted', {
    days_played_as_guest: data.days_played_as_guest,
    levels_completed: data.levels_completed,
    trigger: data.trigger,
  });
}

/**
 * Track errors
 */
export function trackError(error: Error, context?: EventProperties) {
  analytics.track('error_occurred', {
    error_message: error.message,
    error_stack: error.stack?.substring(0, 500), // Limit stack trace length
    ...context,
  });
}

/**
 * Track user retention metrics
 */
export function trackUserSession(data: {
  session_start: number; // timestamp
  session_end: number; // timestamp
  screens_viewed: number;
  actions_performed: number;
}) {
  const sessionDuration = data.session_end - data.session_start;

  analytics.track('app_closed', {
    session_duration: sessionDuration,
    screens_viewed: data.screens_viewed,
    actions_performed: data.actions_performed,
  });
}

// ============================================
// FEATURE FLAG HELPER (for analytics-driven rollout)
// ============================================

export function isFeatureEnabled(featureName: string): boolean {
  // Simple env-based feature flags for now
  const envKey = `EXPO_PUBLIC_FEATURE_${featureName.toUpperCase()}`;
  const envValue = process.env[envKey];

  return envValue === 'true';
}
