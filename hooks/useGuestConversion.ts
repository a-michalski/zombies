/**
 * Guest Conversion Hook
 * Created: 2025-11-19
 *
 * Manages when and how to show guest conversion prompts
 * Tracks level completions, dismissals, and user preferences
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '@/contexts/AuthContext';
import { useCampaignContext } from '@/contexts/CampaignContext';
import { shouldNeverShowPrompt } from '@/components/auth/GuestConversionPrompt';
import { analytics } from '@/lib/analytics';

// ============================================
// TYPES
// ============================================

export type ConversionTrigger = 'post_level' | 'leaderboard_view' | 'progress_warning';

export interface GuestConversionState {
  shouldShowPrompt: boolean;
  currentTrigger: ConversionTrigger | null;
  showPrompt: (trigger: ConversionTrigger) => void;
  dismissPrompt: () => void;
  neverShowAgain: () => void;
}

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  LEVEL_COMPLETIONS: '@zombie_fleet:guest_level_completions',
  LAST_PROMPT_SHOWN: '@zombie_fleet:last_conversion_prompt',
  DISMISSAL_COUNT: '@zombie_fleet:conversion_dismissals',
  NEVER_SHOW: '@zombie_fleet:never_show_conversion_prompt',
};

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Show after completing this many levels
  SHOW_AFTER_LEVEL: 3,

  // Minimum time between prompts (in milliseconds)
  MIN_PROMPT_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours

  // Maximum number of times to show prompt
  MAX_PROMPT_COUNT: 5,
};

// ============================================
// HOOK
// ============================================

export function useGuestConversion(): GuestConversionState {
  const { isGuest } = useAuth();
  const { playerProgress } = useCampaignContext();

  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState<ConversionTrigger | null>(null);
  const [neverShow, setNeverShow] = useState(false);
  const [dismissalCount, setDismissalCount] = useState(0);
  const [lastPromptTime, setLastPromptTime] = useState<number>(0);

  // Load persistent state on mount
  useEffect(() => {
    loadState();
  }, []);

  // Load state from AsyncStorage
  const loadState = async () => {
    try {
      const [neverShowValue, dismissalCountValue, lastPromptValue] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.NEVER_SHOW),
        AsyncStorage.getItem(STORAGE_KEYS.DISMISSAL_COUNT),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_PROMPT_SHOWN),
      ]);

      setNeverShow(neverShowValue === 'true');
      setDismissalCount(dismissalCountValue ? parseInt(dismissalCountValue, 10) : 0);
      setLastPromptTime(lastPromptValue ? parseInt(lastPromptValue, 10) : 0);
    } catch (error) {
      console.error('[useGuestConversion] Failed to load state:', error);
    }
  };

  // Check if we should auto-show prompt after level completion
  useEffect(() => {
    if (!isGuest) return;
    if (neverShow) return;
    if (dismissalCount >= CONFIG.MAX_PROMPT_COUNT) return;

    checkAutoShowConditions();
  }, [playerProgress, isGuest, neverShow, dismissalCount]);

  // Check if conditions are met to auto-show the prompt
  const checkAutoShowConditions = async () => {
    try {
      // Count completed levels
      const completedLevels = Object.values(playerProgress.levelProgress).filter(
        (progress) => progress.completed
      ).length;

      // Show after completing the configured number of levels
      if (completedLevels >= CONFIG.SHOW_AFTER_LEVEL) {
        // Check if enough time has passed since last prompt
        const now = Date.now();
        const timeSinceLastPrompt = now - lastPromptTime;

        if (timeSinceLastPrompt >= CONFIG.MIN_PROMPT_INTERVAL) {
          showPrompt('post_level');
        }
      }
    } catch (error) {
      console.error('[useGuestConversion] Failed to check auto-show conditions:', error);
    }
  };

  // Show the prompt with a specific trigger
  const showPrompt = useCallback(
    async (trigger: ConversionTrigger) => {
      // Don't show if user is authenticated or has disabled prompts
      if (!isGuest) return;
      if (neverShow) return;
      if (dismissalCount >= CONFIG.MAX_PROMPT_COUNT) return;

      // Check if enough time has passed since last prompt
      const now = Date.now();
      const timeSinceLastPrompt = now - lastPromptTime;

      if (timeSinceLastPrompt < CONFIG.MIN_PROMPT_INTERVAL && trigger !== 'leaderboard_view') {
        // Always show on leaderboard view, but respect cooldown for other triggers
        return;
      }

      // Update last prompt time
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_PROMPT_SHOWN, now.toString());
        setLastPromptTime(now);
      } catch (error) {
        console.error('[useGuestConversion] Failed to save last prompt time:', error);
      }

      setCurrentTrigger(trigger);
      setShouldShowPrompt(true);

      analytics.track('guest_converted', {
        trigger,
        action: 'shown',
        dismissal_count: dismissalCount,
        levels_completed: Object.values(playerProgress.levelProgress).filter(p => p.completed).length,
      });
    },
    [isGuest, neverShow, dismissalCount, lastPromptTime, playerProgress]
  );

  // Dismiss the prompt
  const dismissPrompt = useCallback(async () => {
    setShouldShowPrompt(false);
    setCurrentTrigger(null);

    // Increment dismissal count
    const newCount = dismissalCount + 1;
    setDismissalCount(newCount);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DISMISSAL_COUNT, newCount.toString());
    } catch (error) {
      console.error('[useGuestConversion] Failed to save dismissal count:', error);
    }

    analytics.track('guest_converted', {
      trigger: currentTrigger || 'unknown',
      action: 'dismissed',
      dismissal_count: newCount,
    });
  }, [dismissalCount, currentTrigger]);

  // Never show again
  const neverShowAgain = useCallback(async () => {
    setShouldShowPrompt(false);
    setCurrentTrigger(null);
    setNeverShow(true);

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NEVER_SHOW, 'true');
    } catch (error) {
      console.error('[useGuestConversion] Failed to save never show preference:', error);
    }

    analytics.track('guest_converted', {
      trigger: currentTrigger || 'unknown',
      action: 'never_show_again',
      dismissal_count: dismissalCount,
    });
  }, [currentTrigger, dismissalCount]);

  return {
    shouldShowPrompt,
    currentTrigger,
    showPrompt,
    dismissPrompt,
    neverShowAgain,
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get statistics about guest progress
 * Useful for showing in the conversion prompt
 */
export function getGuestProgressStats(playerProgress: any): {
  levelsCompleted: number;
  totalStars: number;
  totalScrapEarned: number;
} {
  const completedLevels = Object.values(playerProgress.levelProgress).filter(
    (progress: any) => progress.completed
  ).length;

  return {
    levelsCompleted: completedLevels,
    totalStars: playerProgress.totalStars,
    totalScrapEarned: playerProgress.totalScrapEarned,
  };
}

/**
 * Reset all conversion tracking (useful for testing)
 */
export async function resetGuestConversionTracking(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.LEVEL_COMPLETIONS),
      AsyncStorage.removeItem(STORAGE_KEYS.LAST_PROMPT_SHOWN),
      AsyncStorage.removeItem(STORAGE_KEYS.DISMISSAL_COUNT),
      AsyncStorage.removeItem(STORAGE_KEYS.NEVER_SHOW),
    ]);
    console.log('[useGuestConversion] Tracking reset successfully');
  } catch (error) {
    console.error('[useGuestConversion] Failed to reset tracking:', error);
  }
}

/**
 * Check if user should be prompted based on specific trigger
 */
export async function shouldShowForTrigger(
  trigger: ConversionTrigger,
  isGuest: boolean
): Promise<boolean> {
  // Always allow for authenticated users (returns false)
  if (!isGuest) return false;

  // Check if never show is enabled
  const neverShow = await shouldNeverShowPrompt();
  if (neverShow) return false;

  // Check dismissal count
  try {
    const dismissalCountValue = await AsyncStorage.getItem(STORAGE_KEYS.DISMISSAL_COUNT);
    const dismissalCount = dismissalCountValue ? parseInt(dismissalCountValue, 10) : 0;

    if (dismissalCount >= CONFIG.MAX_PROMPT_COUNT) {
      return false;
    }
  } catch (error) {
    console.error('[useGuestConversion] Failed to check dismissal count:', error);
  }

  // For leaderboard view, always show (if not disabled above)
  if (trigger === 'leaderboard_view') {
    return true;
  }

  // For other triggers, check cooldown
  try {
    const lastPromptValue = await AsyncStorage.getItem(STORAGE_KEYS.LAST_PROMPT_SHOWN);
    const lastPromptTime = lastPromptValue ? parseInt(lastPromptValue, 10) : 0;
    const now = Date.now();
    const timeSinceLastPrompt = now - lastPromptTime;

    return timeSinceLastPrompt >= CONFIG.MIN_PROMPT_INTERVAL;
  } catch (error) {
    console.error('[useGuestConversion] Failed to check cooldown:', error);
    return true; // Default to showing on error
  }
}
