import AsyncStorage from "@react-native-async-storage/async-storage";
import { CampaignSaveData } from "@/types/progression";

const STORAGE_KEYS = {
  SETTINGS: "@zombie_fleet:settings",
  STATS: "@zombie_fleet:stats",
  CAMPAIGN_PROGRESS: "@zombie_fleet:campaign_progress",
} as const;

export interface GameSettings {
  musicEnabled: boolean;
  soundEffectsEnabled: boolean;
  defaultGameSpeed: 1 | 2;
}

export interface GameStats {
  bestWave: number;
  totalZombiesKilled: number;
  totalWavesSurvived: number;
  gamesPlayed: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  musicEnabled: true,
  soundEffectsEnabled: true,
  defaultGameSpeed: 1,
};

const DEFAULT_STATS: GameStats = {
  bestWave: 0,
  totalZombiesKilled: 0,
  totalWavesSurvived: 0,
  gamesPlayed: 0,
};

export async function getSettings(): Promise<GameSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data) as GameSettings;
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

export async function getStats(): Promise<GameStats> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
    if (data) {
      return JSON.parse(data) as GameStats;
    }
    return DEFAULT_STATS;
  } catch (error) {
    console.error("Error loading stats:", error);
    return DEFAULT_STATS;
  }
}

export async function saveStats(stats: GameStats): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.error("Error saving stats:", error);
  }
}

export async function updateStatsFromGame(
  wave: number,
  zombiesKilled: number,
  wavesSurvived: number
): Promise<void> {
  try {
    const currentStats = await getStats();
    const updatedStats: GameStats = {
      bestWave: Math.max(currentStats.bestWave, wave),
      totalZombiesKilled: currentStats.totalZombiesKilled + zombiesKilled,
      totalWavesSurvived: currentStats.totalWavesSurvived + wavesSurvived,
      gamesPlayed: currentStats.gamesPlayed + 1,
    };
    await saveStats(updatedStats);
  } catch (error) {
    console.error("Error updating stats:", error);
  }
}

/**
 * Campaign Progress Storage
 *
 * Added: 2025-11-16 (PHASE-007)
 * Stores player progression, unlocked levels, and star ratings
 */

/**
 * Create initial campaign save data structure
 * Used when no save data exists (first launch)
 */
export const createInitialCampaignData = (): CampaignSaveData => {
  return {
    playerProgress: {
      currentCampaignId: "main-campaign",
      currentLevel: 1,
      unlockedLevels: ["level-01"], // First level unlocked by default
      levelProgress: {},
      totalStars: 0,
      totalScrapEarned: 0,
    },
    version: 1,
    lastUpdated: Date.now(),
  };
};

/**
 * Save campaign progress to AsyncStorage
 *
 * @param data - Complete campaign save data
 * @throws Error if save fails
 */
export const saveCampaignProgress = async (
  data: CampaignSaveData
): Promise<void> => {
  try {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEYS.CAMPAIGN_PROGRESS, jsonData);
  } catch (error) {
    console.error("Failed to save campaign progress:", error);
    throw error;
  }
};

/**
 * Load campaign progress from AsyncStorage
 *
 * @returns Campaign save data or null if not found/corrupted
 */
export const loadCampaignProgress = async (): Promise<CampaignSaveData | null> => {
  try {
    const jsonData = await AsyncStorage.getItem(STORAGE_KEYS.CAMPAIGN_PROGRESS);
    if (!jsonData) {
      return null;
    }

    const data = JSON.parse(jsonData) as CampaignSaveData;

    // Version migration logic (future-proofing)
    if (data.version !== 1) {
      console.warn("Campaign save data version mismatch. Resetting progress.");
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to load campaign progress:", error);
    return null;
  }
};

/**
 * Clear all campaign progress (for testing or player-initiated reset)
 *
 * @throws Error if delete fails
 */
export const resetCampaignProgress = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CAMPAIGN_PROGRESS);
  } catch (error) {
    console.error("Failed to reset campaign progress:", error);
    throw error;
  }
};

