/**
 * Environment Variables Helper
 * 
 * Provides typed access to environment variables with defaults.
 * Uses EXPO_PUBLIC_ prefix for Expo environment variables.
 */

export const IS_DEV = process.env.EXPO_PUBLIC_ENV === 'development';
export const IS_PROD = process.env.EXPO_PUBLIC_ENV === 'production';
export const ENABLE_DEBUG = process.env.EXPO_PUBLIC_ENABLE_DEBUG === 'true';

// Fallback to __DEV__ if EXPO_PUBLIC_ENV is not set
export const IS_DEVELOPMENT = IS_DEV || (typeof __DEV__ !== 'undefined' ? __DEV__ : false);

