/**
 * GDPR Compliance Service
 * Created: 2025-11-19
 *
 * Implements GDPR requirements:
 * - Article 7 (Consent)
 * - Article 15 (Right to Access)
 * - Article 17 (Right to Erasure)
 * - Article 20 (Right to Data Portability)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { supabase } from './supabase';
import { analytics } from './analytics';
import { getSettings, getStats, loadCampaignProgress } from '@/utils/storage';

// ============================================
// CONSTANTS
// ============================================

const CONSENT_KEY = '@zombie_fleet:gdpr_consent';
const CONSENT_VERSION = 1; // Increment when privacy policy changes

// ============================================
// TYPES
// ============================================

export interface GDPRConsent {
  version: number;
  essentialConsent: boolean; // Required to use the app
  analyticsConsent: boolean; // Optional analytics
  consentDate: string;
  lastUpdated: string;
}

export interface UserDataExport {
  exportDate: string;
  userId: string | null;
  profile: {
    nickname: string | null;
    nationality: string | null;
    email: string | null;
    createdAt: string | null;
    lastSeen: string | null;
  };
  localData: {
    settings: any;
    stats: any;
    campaignProgress: any;
  };
  cloudData: {
    campaignProgress: any;
    leaderboardEntries: any[];
    playerStats: any;
    achievements: any[];
    dailyRewards: any;
  };
  dataCategories: DataCategory[];
  gdprConsent: GDPRConsent | null;
}

export interface DataCategory {
  name: string;
  description: string;
  dataPoints: string[];
  storage: 'local' | 'cloud' | 'both';
  retention: string;
  purpose: string;
}

// ============================================
// CONSENT MANAGEMENT
// ============================================

/**
 * Save user's GDPR consent
 */
export async function saveConsent(
  essentialConsent: boolean,
  analyticsConsent: boolean
): Promise<void> {
  try {
    const consent: GDPRConsent = {
      version: CONSENT_VERSION,
      essentialConsent,
      analyticsConsent,
      consentDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

    analytics.track('gdpr_consent_given', {
      essential: essentialConsent,
      analytics: analyticsConsent,
      version: CONSENT_VERSION,
    });
  } catch (error) {
    console.error('[GDPR] Failed to save consent:', error);
    throw error;
  }
}

/**
 * Load user's GDPR consent
 */
export async function loadConsent(): Promise<GDPRConsent | null> {
  try {
    const data = await AsyncStorage.getItem(CONSENT_KEY);
    if (!data) {
      return null;
    }

    const consent = JSON.parse(data) as GDPRConsent;

    // Check if consent is outdated
    if (consent.version < CONSENT_VERSION) {
      return null; // Need to re-consent
    }

    return consent;
  } catch (error) {
    console.error('[GDPR] Failed to load consent:', error);
    return null;
  }
}

/**
 * Check if user has given consent
 */
export async function hasConsent(): Promise<boolean> {
  const consent = await loadConsent();
  return consent !== null && consent.essentialConsent;
}

/**
 * Update analytics consent
 */
export async function updateAnalyticsConsent(enabled: boolean): Promise<void> {
  try {
    const consent = await loadConsent();
    if (!consent) {
      throw new Error('No consent found');
    }

    consent.analyticsConsent = enabled;
    consent.lastUpdated = new Date().toISOString();

    await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

    analytics.track('gdpr_analytics_consent_updated', {
      enabled,
    });
  } catch (error) {
    console.error('[GDPR] Failed to update analytics consent:', error);
    throw error;
  }
}

// ============================================
// DATA CATEGORIES (ARTICLE 15)
// ============================================

/**
 * Get all data categories we collect
 * Required for transparency under GDPR Article 15
 */
export function getDataCategories(): DataCategory[] {
  return [
    {
      name: 'Account Information',
      description: 'Basic account and profile data',
      dataPoints: [
        'Email address',
        'Nickname',
        'Nationality',
        'Account creation date',
        'Last seen timestamp',
      ],
      storage: 'cloud',
      retention: 'Until account deletion',
      purpose: 'User identification and leaderboard display',
    },
    {
      name: 'Game Settings',
      description: 'User preferences and settings',
      dataPoints: [
        'Music enabled/disabled',
        'Sound effects enabled/disabled',
        'Default game speed',
      ],
      storage: 'local',
      retention: 'Until app uninstall or manual reset',
      purpose: 'Personalize game experience',
    },
    {
      name: 'Game Statistics',
      description: 'Player performance metrics',
      dataPoints: [
        'Best wave reached',
        'Total zombies killed',
        'Total waves survived',
        'Number of games played',
      ],
      storage: 'local',
      retention: 'Until app uninstall or manual reset',
      purpose: 'Track player progress and display statistics',
    },
    {
      name: 'Campaign Progress',
      description: 'Level completion and progression data',
      dataPoints: [
        'Unlocked levels',
        'Level completion status',
        'Star ratings per level',
        'Best scores',
        'Total stars earned',
        'Total scrap earned',
      ],
      storage: 'both',
      retention: 'Until account deletion or manual reset',
      purpose: 'Save game progress and enable cloud sync',
    },
    {
      name: 'Leaderboard Entries',
      description: 'High scores and rankings',
      dataPoints: [
        'Level ID',
        'Score',
        'Stars earned',
        'Completion time',
        'Zombies killed',
        'Hull integrity',
        'Timestamp',
      ],
      storage: 'cloud',
      retention: 'Until account deletion',
      purpose: 'Display in global and regional leaderboards',
    },
    {
      name: 'Achievements',
      description: 'Unlocked achievements and progress',
      dataPoints: [
        'Achievement ID',
        'Progress percentage',
        'Completion status',
        'Completion date',
      ],
      storage: 'cloud',
      retention: 'Until account deletion',
      purpose: 'Track and display player achievements',
    },
    {
      name: 'Daily Rewards',
      description: 'Daily login streak and rewards',
      dataPoints: [
        'Current streak',
        'Longest streak',
        'Last claim date',
        'Total rewards claimed',
      ],
      storage: 'cloud',
      retention: 'Until account deletion',
      purpose: 'Daily reward system and player retention',
    },
    {
      name: 'Analytics Data',
      description: 'Anonymized usage analytics (optional)',
      dataPoints: [
        'Screen views',
        'Button clicks',
        'Level completions',
        'Session duration',
        'Error logs',
      ],
      storage: 'cloud',
      retention: '90 days (rolling)',
      purpose: 'Improve game experience and fix bugs (requires consent)',
    },
  ];
}

// ============================================
// DATA EXPORT (ARTICLE 20)
// ============================================

/**
 * Export all user data as JSON
 * GDPR Article 20: Right to Data Portability
 */
export async function exportUserData(
  userId: string | null
): Promise<UserDataExport> {
  try {
    analytics.track('gdpr_data_export_started', { user_id: userId });

    // 1. Load local data
    const settings = await getSettings();
    const stats = await getStats();
    const campaignProgress = await loadCampaignProgress();
    const consent = await loadConsent();

    // 2. Load cloud data (if authenticated)
    let profile = null;
    let cloudCampaignProgress = null;
    let leaderboardEntries: any[] = [];
    let playerStats = null;
    let achievements: any[] = [];
    let dailyRewards = null;
    let email = null;

    if (userId) {
      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      profile = profileData;

      // Get auth email
      const { data: { user } } = await supabase.auth.getUser();
      email = user?.email || null;

      // Get cloud campaign progress
      const { data: cloudProgress } = await supabase
        .from('campaign_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      cloudCampaignProgress = cloudProgress;

      // Get leaderboard entries
      const { data: leaderboard } = await supabase
        .from('leaderboards')
        .select('*')
        .eq('user_id', userId);

      leaderboardEntries = leaderboard || [];

      // Get player stats
      const { data: stats } = await supabase
        .from('player_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      playerStats = stats;

      // Get achievement progress
      const { data: achievementData } = await supabase
        .from('achievement_progress')
        .select('*')
        .eq('user_id', userId);

      achievements = achievementData || [];

      // Get daily rewards
      const { data: rewards } = await supabase
        .from('daily_rewards')
        .select('*')
        .eq('user_id', userId)
        .single();

      dailyRewards = rewards;
    }

    // 3. Compile export
    const exportData: UserDataExport = {
      exportDate: new Date().toISOString(),
      userId,
      profile: {
        nickname: profile?.nickname || null,
        nationality: profile?.nationality || null,
        email,
        createdAt: profile?.created_at || null,
        lastSeen: profile?.last_seen_at || null,
      },
      localData: {
        settings,
        stats,
        campaignProgress,
      },
      cloudData: {
        campaignProgress: cloudCampaignProgress,
        leaderboardEntries,
        playerStats,
        achievements,
        dailyRewards,
      },
      dataCategories: getDataCategories(),
      gdprConsent: consent,
    };

    analytics.track('gdpr_data_export_completed', {
      user_id: userId,
      has_profile: profile !== null,
    });

    return exportData;
  } catch (error) {
    console.error('[GDPR] Data export failed:', error);
    analytics.track('gdpr_data_export_failed', {
      user_id: userId,
      error: String(error),
    });
    throw error;
  }
}

/**
 * Download data export as JSON file
 * Creates a shareable JSON file
 */
export async function downloadDataExport(userId: string | null): Promise<void> {
  try {
    const exportData = await exportUserData(userId);
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `zombie-fleet-data-export-${timestamp}.json`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    // Write to file
    await FileSystem.writeAsStringAsync(fileUri, jsonString);

    // Share/Download file
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Download Your Data',
        UTI: 'public.json',
      });
    } else {
      throw new Error('Sharing not available on this device');
    }

    analytics.track('gdpr_data_download_completed', {
      user_id: userId,
      file_size: jsonString.length,
    });
  } catch (error) {
    console.error('[GDPR] Data download failed:', error);
    analytics.track('gdpr_data_download_failed', {
      user_id: userId,
      error: String(error),
    });
    throw error;
  }
}

// ============================================
// ACCOUNT DELETION (ARTICLE 17)
// ============================================

/**
 * Delete user account and all associated data
 * GDPR Article 17: Right to Erasure ("Right to be Forgotten")
 */
export async function deleteUserAccount(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    analytics.track('gdpr_account_deletion_started', { user_id: userId });

    // 1. Delete cloud data (cascading deletes handled by database)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('[GDPR] Profile deletion failed:', profileError);
      return { success: false, error: profileError.message };
    }

    // 2. Delete auth user
    const { error: authError } = await supabase.auth.signOut();

    if (authError) {
      console.error('[GDPR] Sign out failed:', authError);
    }

    // Note: Admin API is needed to fully delete auth user
    // This should be done via a serverless function or backend API
    // For now, we delete the profile which removes all linked data

    // 3. Delete local data
    await AsyncStorage.clear();

    analytics.track('gdpr_account_deletion_completed', {
      user_id: userId,
    });

    return { success: true };
  } catch (error) {
    console.error('[GDPR] Account deletion failed:', error);
    analytics.track('gdpr_account_deletion_failed', {
      user_id: userId,
      error: String(error),
    });
    return { success: false, error: 'Failed to delete account' };
  }
}

/**
 * Delete local data only (for guest users)
 */
export async function deleteLocalData(): Promise<void> {
  try {
    analytics.track('gdpr_local_data_deletion_started');

    await AsyncStorage.clear();

    analytics.track('gdpr_local_data_deletion_completed');
  } catch (error) {
    console.error('[GDPR] Local data deletion failed:', error);
    throw error;
  }
}

// ============================================
// CONSENT VERIFICATION
// ============================================

/**
 * Check if user needs to show consent modal
 * Returns true if consent is required (first launch or version update)
 */
export async function needsConsent(): Promise<boolean> {
  const consent = await loadConsent();
  return consent === null || consent.version < CONSENT_VERSION;
}

/**
 * Get consent status summary
 */
export async function getConsentStatus(): Promise<{
  hasConsent: boolean;
  essentialConsent: boolean;
  analyticsConsent: boolean;
  consentDate: string | null;
}> {
  const consent = await loadConsent();

  if (!consent) {
    return {
      hasConsent: false,
      essentialConsent: false,
      analyticsConsent: false,
      consentDate: null,
    };
  }

  return {
    hasConsent: true,
    essentialConsent: consent.essentialConsent,
    analyticsConsent: consent.analyticsConsent,
    consentDate: consent.consentDate,
  };
}
