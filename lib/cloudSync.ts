/**
 * Cloud Sync Service
 * Created: 2025-11-19
 *
 * Handles synchronization of campaign progress between local AsyncStorage and Supabase cloud
 * Implements conflict resolution and offline support
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-constants';

import { supabase } from './supabase';
import { analytics } from './analytics';
import { CampaignSaveData } from '@/types/progression';
import { loadCampaignProgress as loadLocalProgress, saveCampaignProgress as saveLocalProgress } from '@/utils/storage';

// ============================================
// TYPES
// ============================================

export interface SyncResult {
  success: boolean;
  data?: CampaignSaveData;
  error?: string;
  conflictResolved?: boolean;
  source?: 'cloud' | 'local' | 'merged';
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

// ============================================
// DEVICE ID MANAGEMENT
// ============================================

const DEVICE_ID_KEY = '@zombie_fleet:device_id';

/**
 * Get or create unique device ID
 * Used for conflict resolution
 */
async function getDeviceId(): Promise<string> {
  try {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
      // Generate new device ID
      deviceId = `${Device.default.deviceId || 'unknown'}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
  } catch (error) {
    console.error('[CloudSync] Failed to get device ID:', error);
    return `fallback-${Date.now()}`;
  }
}

// ============================================
// UPLOAD TO CLOUD
// ============================================

/**
 * Upload local campaign progress to cloud
 * Creates or updates the cloud save
 */
export async function uploadToCloud(
  userId: string,
  saveData: CampaignSaveData
): Promise<SyncResult> {
  try {
    analytics.track('cloud_sync_started', {
      direction: 'upload',
      user_id: userId,
    });

    const deviceId = await getDeviceId();

    // Upsert to campaign_progress table
    const { data, error } = await supabase
      .from('campaign_progress')
      .upsert({
        user_id: userId,
        save_data: saveData,
        version: saveData.version,
        device_id: deviceId,
        last_synced: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[CloudSync] Upload error:', error);
      analytics.track('cloud_sync_failed', {
        direction: 'upload',
        error: error.message,
      });

      return {
        success: false,
        error: error.message,
      };
    }

    analytics.track('cloud_sync_completed', {
      direction: 'upload',
      user_id: userId,
    });

    return {
      success: true,
      data: saveData,
      source: 'local',
    };
  } catch (error) {
    console.error('[CloudSync] Upload exception:', error);
    analytics.track('cloud_sync_failed', {
      direction: 'upload',
      error: 'exception',
    });

    return {
      success: false,
      error: 'Failed to upload to cloud',
    };
  }
}

// ============================================
// DOWNLOAD FROM CLOUD
// ============================================

/**
 * Download campaign progress from cloud
 */
export async function downloadFromCloud(userId: string): Promise<SyncResult> {
  try {
    analytics.track('cloud_sync_started', {
      direction: 'download',
      user_id: userId,
    });

    const { data, error } = await supabase
      .from('campaign_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // PGRST116 = not found (no cloud save exists yet)
      if (error.code === 'PGRST116') {
        return {
          success: true,
          data: undefined,
          source: 'cloud',
        };
      }

      console.error('[CloudSync] Download error:', error);
      analytics.track('cloud_sync_failed', {
        direction: 'download',
        error: error.message,
      });

      return {
        success: false,
        error: error.message,
      };
    }

    const cloudSave: CampaignSaveData = data.save_data as CampaignSaveData;

    analytics.track('cloud_sync_completed', {
      direction: 'download',
      user_id: userId,
    });

    return {
      success: true,
      data: cloudSave,
      source: 'cloud',
    };
  } catch (error) {
    console.error('[CloudSync] Download exception:', error);
    analytics.track('cloud_sync_failed', {
      direction: 'download',
      error: 'exception',
    });

    return {
      success: false,
      error: 'Failed to download from cloud',
    };
  }
}

// ============================================
// CONFLICT RESOLUTION
// ============================================

/**
 * Resolve conflicts between local and cloud saves
 * Strategy: Last-Write-Wins based on timestamps
 * If timestamps are very close, merge progress (take max of each)
 */
function resolveConflict(
  localSave: CampaignSaveData,
  cloudSave: CampaignSaveData
): { resolved: CampaignSaveData; source: 'local' | 'cloud' | 'merged' } {
  const localTime = localSave.lastUpdated;
  const cloudTime = cloudSave.lastUpdated;

  // If timestamps differ by more than 1 minute, use newer
  const timeDiff = Math.abs(localTime - cloudTime);
  if (timeDiff > 60000) {
    if (localTime > cloudTime) {
      console.log('[CloudSync] Conflict resolved: Local is newer');
      return { resolved: localSave, source: 'local' };
    } else {
      console.log('[CloudSync] Conflict resolved: Cloud is newer');
      return { resolved: cloudSave, source: 'cloud' };
    }
  }

  // Timestamps are very close - merge progress
  console.log('[CloudSync] Conflict resolved: Merging progress');

  const merged: CampaignSaveData = {
    playerProgress: {
      currentCampaignId: localSave.playerProgress.currentCampaignId,
      currentLevel: Math.max(
        localSave.playerProgress.currentLevel,
        cloudSave.playerProgress.currentLevel
      ),
      // Merge unlocked levels (union)
      unlockedLevels: Array.from(
        new Set([
          ...localSave.playerProgress.unlockedLevels,
          ...cloudSave.playerProgress.unlockedLevels,
        ])
      ),
      // Merge level progress (take best of each level)
      levelProgress: mergeLevelProgress(
        localSave.playerProgress.levelProgress,
        cloudSave.playerProgress.levelProgress
      ),
      totalStars: Math.max(
        localSave.playerProgress.totalStars,
        cloudSave.playerProgress.totalStars
      ),
      totalScrapEarned: Math.max(
        localSave.playerProgress.totalScrapEarned,
        cloudSave.playerProgress.totalScrapEarned
      ),
    },
    version: Math.max(localSave.version, cloudSave.version),
    lastUpdated: Math.max(localTime, cloudTime),
  };

  return { resolved: merged, source: 'merged' };
}

/**
 * Merge level progress - take best stats for each level
 */
function mergeLevelProgress(
  local: Record<string, any>,
  cloud: Record<string, any>
): Record<string, any> {
  const merged: Record<string, any> = { ...local };

  Object.keys(cloud).forEach(levelId => {
    const localProgress = local[levelId];
    const cloudProgress = cloud[levelId];

    if (!localProgress) {
      merged[levelId] = cloudProgress;
    } else {
      // Take best of each stat
      merged[levelId] = {
        levelId,
        completed: localProgress.completed || cloudProgress.completed,
        starsEarned: Math.max(localProgress.starsEarned, cloudProgress.starsEarned),
        bestScore: Math.max(localProgress.bestScore, cloudProgress.bestScore),
        bestWave: Math.max(localProgress.bestWave, cloudProgress.bestWave),
        timesPlayed: localProgress.timesPlayed + cloudProgress.timesPlayed,
        lastPlayedAt: Math.max(localProgress.lastPlayedAt, cloudProgress.lastPlayedAt),
      };
    }
  });

  return merged;
}

// ============================================
// FULL SYNC (BIDIRECTIONAL)
// ============================================

/**
 * Perform full bidirectional sync
 * Called on app launch after login
 */
export async function performFullSync(userId: string): Promise<SyncResult> {
  try {
    analytics.track('cloud_sync_started', {
      direction: 'bidirectional',
      user_id: userId,
    });

    // 1. Load local save
    const localSave = await loadLocalProgress();

    // 2. Download cloud save
    const cloudResult = await downloadFromCloud(userId);

    if (!cloudResult.success) {
      return cloudResult;
    }

    const cloudSave = cloudResult.data;

    // 3. Handle different scenarios
    let finalSave: CampaignSaveData;
    let source: 'local' | 'cloud' | 'merged';
    let conflictResolved = false;

    if (!localSave && !cloudSave) {
      // No saves anywhere - this is a new user
      console.log('[CloudSync] No saves found - new user');
      return { success: true, source: 'cloud' };
    } else if (localSave && !cloudSave) {
      // Local exists, cloud doesn't - upload local
      console.log('[CloudSync] Local exists, cloud empty - uploading');
      finalSave = localSave;
      source = 'local';
      await uploadToCloud(userId, localSave);
    } else if (!localSave && cloudSave) {
      // Cloud exists, local doesn't - download cloud
      console.log('[CloudSync] Cloud exists, local empty - downloading');
      finalSave = cloudSave;
      source = 'cloud';
      await saveLocalProgress(cloudSave);
    } else if (localSave && cloudSave) {
      // Both exist - resolve conflict
      console.log('[CloudSync] Both exist - resolving conflict');
      const resolution = resolveConflict(localSave, cloudSave);
      finalSave = resolution.resolved;
      source = resolution.source;
      conflictResolved = true;

      // Save resolved version to both local and cloud
      await saveLocalProgress(finalSave);
      await uploadToCloud(userId, finalSave);
    } else {
      return { success: false, error: 'Unexpected sync state' };
    }

    analytics.track('cloud_sync_completed', {
      direction: 'bidirectional',
      user_id: userId,
      source,
      conflict_resolved: conflictResolved,
    });

    return {
      success: true,
      data: finalSave,
      source,
      conflictResolved,
    };
  } catch (error) {
    console.error('[CloudSync] Full sync exception:', error);
    analytics.track('cloud_sync_failed', {
      direction: 'bidirectional',
      error: 'exception',
    });

    return {
      success: false,
      error: 'Failed to perform full sync',
    };
  }
}

// ============================================
// AUTO-SYNC ON LEVEL COMPLETION
// ============================================

/**
 * Automatically sync after level completion
 * Called by CampaignContext after completeLevel()
 */
export async function autoSyncAfterLevelComplete(
  userId: string,
  saveData: CampaignSaveData
): Promise<void> {
  try {
    // Save locally first (instant)
    await saveLocalProgress(saveData);

    // Upload to cloud in background (non-blocking)
    uploadToCloud(userId, saveData).catch(error => {
      console.error('[CloudSync] Auto-sync failed:', error);
      // Don't throw - local save is already done
    });
  } catch (error) {
    console.error('[CloudSync] Auto-sync exception:', error);
  }
}

// ============================================
// OFFLINE DETECTION
// ============================================

/**
 * Check if we're online and can sync
 */
export async function canSync(): Promise<boolean> {
  try {
    // Simple ping to Supabase
    const { error } = await supabase.from('profiles').select('id').limit(1);
    return !error;
  } catch (error) {
    return false;
  }
}

// ============================================
// FORCE SYNC (MANUAL)
// ============================================

/**
 * Force sync - user initiated
 * Shows in settings or sync button
 */
export async function forceSync(userId: string): Promise<SyncResult> {
  const online = await canSync();

  if (!online) {
    analytics.track('offline_mode_detected');
    return {
      success: false,
      error: 'Cannot sync while offline',
    };
  }

  return performFullSync(userId);
}
