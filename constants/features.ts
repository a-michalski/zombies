/**
 * Feature Flags
 * 
 * Controls which features are enabled in the application.
 * Can be toggled via environment variables for gradual rollouts.
 */

/**
 * Feature flags configuration
 * 
 * Features are enabled by default unless explicitly disabled via environment variable.
 * Use EXPO_PUBLIC_ENABLE_* format for Expo environment variables.
 */
export const FEATURES = {
  /**
   * Endless mode - infinite survival mode
   * Default: enabled
   */
  ENDLESS_MODE: process.env.EXPO_PUBLIC_ENABLE_ENDLESS !== 'false',

  /**
   * Campaign mode - story-based level progression
   * Default: enabled
   */
  CAMPAIGN_MODE: process.env.EXPO_PUBLIC_ENABLE_CAMPAIGN !== 'false',

  /**
   * Power-ups - special abilities during gameplay
   * Default: enabled
   */
  POWER_UPS: process.env.EXPO_PUBLIC_ENABLE_POWER_UPS !== 'false',

  /**
   * Statistics screen - player stats and achievements
   * Default: enabled
   */
  STATISTICS: process.env.EXPO_PUBLIC_ENABLE_STATISTICS !== 'false',

  /**
   * Premium purchases - in-app purchases for premium content
   * Default: enabled
   */
  PREMIUM_PURCHASES: process.env.EXPO_PUBLIC_ENABLE_PREMIUM !== 'false',
} as const;

/**
 * Type for feature flags
 */
export type FeatureFlag = keyof typeof FEATURES;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return FEATURES[feature];
}

